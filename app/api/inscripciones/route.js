import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { verificarEstadoInscripciones, CONFIG_INSCRIPCION } from '@/config/inscripcion';

export async function POST(request) {
  try {
    // 🔒 VERIFICAR SI LAS INSCRIPCIONES ESTÁN ABIERTAS
    const estado = verificarEstadoInscripciones();
    if (!estado.abiertas) {
      return NextResponse.json(
        { error: estado.mensaje },
        { status: 403 }
      );
    }
    
    const datos = await request.json();

    // ============================================================
    // VALIDACIONES BÁSICAS DEL SERVIDOR (relajadas)
    // ============================================================
    
    // Validar establecimiento
    if (!datos.tipo_establecimiento || !datos.nombre_establecimiento) {
      return NextResponse.json(
        { error: 'Faltan datos del establecimiento' },
        { status: 400 }
      );
    }
    
    // Validar ciudad y país
    if (!datos.ciudad || !datos.pais_origen) {
      return NextResponse.json(
        { error: 'Faltan datos de ubicación del establecimiento' },
        { status: 400 }
      );
    }
    
    // Validar profesor (mínimo indispensable)
    if (!datos.profesor_nombre || !datos.profesor_email || !datos.profesor_telefono) {
      return NextResponse.json(
        { error: 'Faltan datos del profesor responsable (nombre, email y teléfono son obligatorios)' },
        { status: 400 }
      );
    }
    
    // Validar formato de email
    if (!datos.profesor_email.includes('@')) {
      return NextResponse.json(
        { error: 'El correo electrónico del profesor no es válido' },
        { status: 400 }
      );
    }
    
    // Validar delegaciones
    if (!datos.delegaciones || !Array.isArray(datos.delegaciones) || datos.delegaciones.length === 0) {
      return NextResponse.json(
        { error: 'Debe inscribir al menos una delegación' },
        { status: 400 }
      );
    }
    
    // Validar cantidad de delegaciones según config
    const minDeleg = CONFIG_INSCRIPCION.requisitos.delegacion.minimo || 1;
    const maxDeleg = CONFIG_INSCRIPCION.requisitos.delegacion.maximo || 10;
    
    if (datos.delegaciones.length < minDeleg || datos.delegaciones.length > maxDeleg) {
      return NextResponse.json(
        { error: `La cantidad de delegaciones debe estar entre ${minDeleg} y ${maxDeleg}` },
        { status: 400 }
      );
    }
    
    // Validar cada delegación
    for (let i = 0; i < datos.delegaciones.length; i++) {
      const del = datos.delegaciones[i];
      
      // Delegado 1 siempre obligatorio (nombre, edad, curso)
      if (!del.delegado_1 || !del.delegado_1.nombre || !del.delegado_1.edad || !del.delegado_1.curso) {
        return NextResponse.json(
          { error: `Faltan datos del Delegado 1 en la Delegación ${i + 1}` },
          { status: 400 }
        );
      }
      
      // Si tiene pareja, validar delegado 2
      if (del.tiene_pareja) {
        if (!del.delegado_2 || !del.delegado_2.nombre || !del.delegado_2.edad || !del.delegado_2.curso) {
          return NextResponse.json(
            { error: `Faltan datos del Delegado 2 en la Delegación ${i + 1}` },
            { status: 400 }
          );
        }
      }
      
      // Validar preferencias de país a nivel delegación
      if (!del.pais_preferencia_1 || !del.pais_preferencia_2 || !del.pais_preferencia_3) {
        return NextResponse.json(
          { error: `Faltan las 3 preferencias de país en la Delegación ${i + 1}` },
          { status: 400 }
        );
      }
      
      // Validar que las preferencias sean diferentes entre sí
      const preferencias = [del.pais_preferencia_1, del.pais_preferencia_2, del.pais_preferencia_3];
      const preferenciasUnicas = new Set(preferencias);
      if (preferenciasUnicas.size !== 3) {
        return NextResponse.json(
          { error: `Las preferencias de país en la Delegación ${i + 1} deben ser diferentes entre sí` },
          { status: 400 }
        );
      }
    }
    
    // ============================================================
    // VALIDACIONES DE PAGO Y BECAS (ACTUALIZADO - SIN codigoBecaValido)
    // ============================================================
    
    // Determinar si tiene beca (solo verificamos que haya marcado la opción y puesto un código)
    const tieneBeca = datos.beca && datos.beca.tieneBeca && datos.beca.codigoBeca && datos.beca.codigoBeca.trim() !== '';
    const esBecaTotal = tieneBeca && datos.beca.becaTotal;
    
    // Si no tiene beca o tiene beca con descuento, debe subir comprobante de pago
    if (!esBecaTotal) {
      if (!datos.comprobante_base64) {
        return NextResponse.json(
          { error: 'Debe subir el comprobante de pago' },
          { status: 400 }
        );
      }
      
      // Validar tamaño del comprobante (máximo ~2MB en base64)
      if (datos.comprobante_base64 && datos.comprobante_base64.length > 3 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'El comprobante de pago es demasiado grande. Máximo 2 MB.' },
          { status: 400 }
        );
      }
    }
    
    // Si tiene beca total, debe subir comprobante de beca
    if (esBecaTotal) {
      if (!datos.beca.comprobanteBeca) {
        return NextResponse.json(
          { error: 'Para beca total, debe subir una imagen del correo de confirmación de tu beca' },
          { status: 400 }
        );
      }
    }
    
    // Si marcó que tiene beca pero no puso código, error
    if (datos.beca && datos.beca.tieneBeca && (!datos.beca.codigoBeca || datos.beca.codigoBeca.trim() === '')) {
      return NextResponse.json(
        { error: 'Si tienes beca, debes ingresar el código que te fue entregado' },
        { status: 400 }
      );
    }
    
    // Validar aceptación de términos
    if (!datos.acepta_terminos || !datos.acepta_reglamento || !datos.acepta_datos) {
      return NextResponse.json(
        { error: 'Debe aceptar todos los términos, reglamentos y acuerdos de datos' },
        { status: 400 }
      );
    }

    // ============================================================
    // PROCESAR DELEGACIONES PARA FIRESTORE
    // ============================================================
    
    const delegacionesProcesadas = datos.delegaciones.map((del, index) => {
      const delegacion = {
        numero: index + 1,
        tiene_pareja: del.tiene_pareja || false,
        preferencias_pais: [
          del.pais_preferencia_1,
          del.pais_preferencia_2,
          del.pais_preferencia_3
        ].filter(Boolean),
        delegados: []
      };

      // Delegado 1 (siempre presente)
      delegacion.delegados.push({
        tipo: 'titular_1',
        nombre: del.delegado_1.nombre || '',
        rut: del.delegado_1.rut || '',
        edad: del.delegado_1.edad || '',
        curso: del.delegado_1.curso || ''
      });

      // Delegado 2 (solo si tiene pareja)
      if (del.tiene_pareja && del.delegado_2) {
        delegacion.delegados.push({
          tipo: 'titular_2',
          nombre: del.delegado_2.nombre || '',
          rut: del.delegado_2.rut || '',
          edad: del.delegado_2.edad || '',
          curso: del.delegado_2.curso || ''
        });
      }

      return delegacion;
    });

    // Contar total de delegados
    const totalDelegados = delegacionesProcesadas.reduce((total, del) => {
      return total + del.delegados.length;
    }, 0);

    // ============================================================
    // PROCESAR INFORMACIÓN DE PAGO Y BECAS
    // ============================================================
    
    let informacionPago = {
      metodo: 'transferencia',
      moneda: datos.pais_origen === 'Chile' ? 'CLP' : 'USD',
      comprobante_procesado: false,
      comprobante_drive_url: ''
    };
    
    // Determinar monto según tipo y país
    const esExtranjero = datos.pais_origen !== 'Chile';
    let montoTotal = 0;
    let precioPorPersona = 0;
    
    if (esExtranjero) {
      const valoresExt = CONFIG_INSCRIPCION.pago.valores_extranjero;
      precioPorPersona = datos.tipo_establecimiento === 'publico' 
        ? valoresExt.publico.delegado 
        : valoresExt.privado.delegado;
    } else {
      const valoresNac = CONFIG_INSCRIPCION.pago.valores;
      precioPorPersona = datos.tipo_establecimiento === 'publico' 
        ? valoresNac.publico.delegado 
        : valoresNac.privado.delegado;
    }
    
    montoTotal = totalDelegados * precioPorPersona;
    
    // Procesar información de beca (VERIFICACIÓN MANUAL POR EL EQUIPO)
    if (tieneBeca && datos.beca) {
      informacionPago.beca = {
        aplicada: true,
        codigo: datos.beca.codigoBeca.trim(),
        tipo: datos.beca.becaTotal ? 'total' : 'descuento',
        porcentaje_descuento: datos.beca.becaTotal ? 100 : (CONFIG_INSCRIPCION.pago.becas.descuento_porcentaje || 0),
        comprobante_beca: datos.beca.comprobanteBeca || null,
        comprobante_beca_nombre: datos.beca.comprobanteBecaNombre || null,
        verificada: false, // ⚠️ EL EQUIPO DEBE VERIFICAR MANUALMENTE
        verificada_por: '',
        fecha_verificacion: null
      };
      
      // Calcular monto con descuento
      if (!datos.beca.becaTotal) {
        const descuento = CONFIG_INSCRIPCION.pago.becas.descuento_porcentaje || 0;
        montoTotal = montoTotal - (montoTotal * descuento / 100);
      } else {
        montoTotal = 0; // Beca total
      }
    }
    
    informacionPago.monto_total = montoTotal;
    informacionPago.monto_original = totalDelegados * precioPorPersona;
    informacionPago.precio_por_persona = precioPorPersona;

    // ============================================================
    // CREAR DOCUMENTO PARA FIRESTORE
    // ============================================================
    
    const inscripcion = {
      // Establecimiento
      tipo_establecimiento: datos.tipo_establecimiento,
      nombre_establecimiento: datos.nombre_establecimiento,
      pais_origen: datos.pais_origen,
      ciudad: datos.ciudad,
      direccion: datos.direccion || '',
      telefono_establecimiento: datos.telefono_establecimiento || '',
      
      // Profesor
      profesor: {
        nombre: datos.profesor_nombre,
        apellido: datos.profesor_apellido || '',
        rut: datos.profesor_rut || '',
        email: (datos.profesor_email || '').toLowerCase().trim(),
        telefono: datos.profesor_telefono || '',
        edad: datos.profesor_edad || '',
        asignatura: datos.profesor_asignatura || ''
      },
      
      // Delegaciones
      cantidad_delegaciones: datos.cantidad_delegaciones || datos.delegaciones.length,
      total_delegados: totalDelegados,
      delegaciones: delegacionesProcesadas,
      
      // Información de pago
      pago: informacionPago,
      
      // Comprobante de pago (solo si no es beca total)
      comprobante_base64: esBecaTotal ? null : (datos.comprobante_base64 || null),
      comprobante_nombre: esBecaTotal ? null : (datos.comprobante_nombre || null),
      
      // Aceptación de términos
      terminos: {
        acepta_terminos: datos.acepta_terminos || false,
        acepta_reglamento: datos.acepta_reglamento || false,
        acepta_datos: datos.acepta_datos || false,
        fecha_aceptacion: new Date().toISOString()
      },
      
      // Metadata
      año: CONFIG_INSCRIPCION.año || new Date().getFullYear(),
      estado: 'pendiente',
      estado_pago: esBecaTotal ? 'beca_total_pendiente_verificacion' : 'pendiente_verificacion',
      fecha_inscripcion: new Date().toISOString(),
      timestamp: serverTimestamp(),
      
      // Notas internas para el equipo
      notas_internas: tieneBeca ? '⚠️ REQUIERE VERIFICACIÓN MANUAL DE BECA - Código: ' + datos.beca.codigoBeca.trim() : '',
      prioridad_verificacion: tieneBeca ? 'alta' : 'normal'
    };

    // Guardar en Firestore
    const docRef = await addDoc(collection(db, 'inscripciones'), inscripcion);

    // ============================================================
    // RESPUESTA EXITOSA
    // ============================================================
    
    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: 'Inscripción guardada exitosamente',
      detalles: {
        delegaciones: datos.delegaciones.length,
        delegados: totalDelegados,
        monto: montoTotal,
        moneda: informacionPago.moneda,
        beca: tieneBeca ? (esBecaTotal ? 'Beca Total (pendiente verificación)' : `Descuento ${CONFIG_INSCRIPCION.pago.becas.descuento_porcentaje}% (pendiente verificación)`) : 'No aplica',
        estado: 'Pendiente de verificación por el equipo'
      }
    });

  } catch (error) {
    console.error('Error al guardar inscripción:', error);
    
    // Error más descriptivo para debugging
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al procesar la inscripción',
        detalles: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}