import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { verificarEstadoInscripciones, CONFIG_INSCRIPCION } from '@/config/inscripcion';

export async function POST(request) {
  try {
    const datos = await request.json();

    // 🔖 Leer el flag de prueba que manda el frontend
    const esPrueba = datos.__es_prueba === true;

    // ============================================================
    // VERIFICAR QUE LAS POSTULACIONES ESTÉN ABIERTAS
    // (si es prueba, se salta todas las validaciones)
    // ============================================================
    const estado = verificarEstadoInscripciones(esPrueba);
    if (!estado.abiertas) {
      return NextResponse.json(
        { error: estado.mensaje },
        { status: 403 }
      );
    }

    // ============================================================
    // VALIDACIONES DE LA POSTULACIÓN
    // (SIN pago, SIN beca, SIN comprobantes)
    // ============================================================

    // Establecimiento
    if (!datos.tipo_establecimiento || !datos.nombre_establecimiento) {
      return NextResponse.json(
        { error: 'Faltan datos del establecimiento' },
        { status: 400 }
      );
    }

    if (!datos.ciudad || !datos.pais_origen) {
      return NextResponse.json(
        { error: 'Faltan datos de ubicación del establecimiento' },
        { status: 400 }
      );
    }

    // Profesor responsable
    if (!datos.profesor_nombre || !datos.profesor_email || !datos.profesor_telefono) {
      return NextResponse.json(
        { error: 'Faltan datos del profesor responsable (nombre, email y teléfono son obligatorios)' },
        { status: 400 }
      );
    }

    if (!datos.profesor_email.includes('@')) {
      return NextResponse.json(
        { error: 'El correo electrónico del profesor no es válido' },
        { status: 400 }
      );
    }

    // Delegaciones
    if (!datos.delegaciones || !Array.isArray(datos.delegaciones) || datos.delegaciones.length === 0) {
      return NextResponse.json(
        { error: 'Debe postular al menos una delegación' },
        { status: 400 }
      );
    }

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

      if (!del.delegado_1 || !del.delegado_1.nombre || !del.delegado_1.edad || !del.delegado_1.curso) {
        return NextResponse.json(
          { error: `Faltan datos del Delegado 1 en la Delegación ${i + 1}` },
          { status: 400 }
        );
      }

      if (del.tiene_pareja) {
        if (!del.delegado_2 || !del.delegado_2.nombre || !del.delegado_2.edad || !del.delegado_2.curso) {
          return NextResponse.json(
            { error: `Faltan datos del Delegado 2 en la Delegación ${i + 1}` },
            { status: 400 }
          );
        }
      }

      if (!del.pais_preferencia_1 || !del.pais_preferencia_2 || !del.pais_preferencia_3) {
        return NextResponse.json(
          { error: `Faltan las 3 preferencias de país en la Delegación ${i + 1}` },
          { status: 400 }
        );
      }

      const preferencias = [del.pais_preferencia_1, del.pais_preferencia_2, del.pais_preferencia_3];
      const preferenciasUnicas = new Set(preferencias);
      if (preferenciasUnicas.size !== 3) {
        return NextResponse.json(
          { error: `Las preferencias de país en la Delegación ${i + 1} deben ser diferentes entre sí` },
          { status: 400 }
        );
      }
    }

    // Aceptación de términos
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
          del.pais_preferencia_3,
        ].filter(Boolean),
        delegados: [],
      };

      delegacion.delegados.push({
        tipo: 'titular_1',
        nombre: del.delegado_1.nombre || '',
        rut: del.delegado_1.rut || '',
        edad: del.delegado_1.edad || '',
        curso: del.delegado_1.curso || '',
      });

      if (del.tiene_pareja && del.delegado_2) {
        delegacion.delegados.push({
          tipo: 'titular_2',
          nombre: del.delegado_2.nombre || '',
          rut: del.delegado_2.rut || '',
          edad: del.delegado_2.edad || '',
          curso: del.delegado_2.curso || '',
        });
      }

      return delegacion;
    });

    const totalDelegados = delegacionesProcesadas.reduce(
      (total, del) => total + del.delegados.length,
      0
    );

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
        asignatura: datos.profesor_asignatura || '',
      },

      // Delegaciones
      cantidad_delegaciones: datos.cantidad_delegaciones || datos.delegaciones.length,
      total_delegados: totalDelegados,
      delegaciones: delegacionesProcesadas,

      // Motivación y experiencia
      motivacion: datos.motivacion || '',
      experiencia_previa: datos.experiencia_previa || 'no',
      experiencia_detalle: datos.experiencia_detalle || '',

      // Apoyos y alimentación
      apoyos: {
        requiere_apoyo: datos.requiere_apoyo || 'no',
        apoyo_delegado: datos.apoyo_delegado || '',
        apoyo_descripcion: datos.apoyo_descripcion || '',
        apoyo_coordinacion: datos.apoyo_coordinacion || 'no',
        apoyo_observaciones: datos.apoyo_observaciones || '',
      },
      alimentacion: {
        tiene_restriccion: datos.tiene_restriccion || 'no',
        restriccion_delegado: datos.restriccion_delegado || '',
        restriccion_tipo: Array.isArray(datos.restriccion_tipo) ? datos.restriccion_tipo : [],
        restriccion_detalle: datos.restriccion_detalle || '',
      },

      // Aceptación de términos
      terminos: {
        acepta_terminos: datos.acepta_terminos || false,
        acepta_reglamento: datos.acepta_reglamento || false,
        acepta_datos: datos.acepta_datos || false,
        fecha_aceptacion: new Date().toISOString(),
      },

      // Metadata
      año: CONFIG_INSCRIPCION.año || new Date().getFullYear(),
      estado: esPrueba ? 'prueba' : 'postulacion',
      estado_pago: 'no_aplica',
      es_prueba: esPrueba, // 🔖 flag para que el equipo filtre en Firestore
      fecha_postulacion: new Date().toISOString(),
      timestamp: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'inscripciones'), inscripcion);

    // ============================================================
    // RESPUESTA EXITOSA
    // ============================================================

    return NextResponse.json({
      success: true,
      id: docRef.id,
      es_prueba: esPrueba,
      message: esPrueba
        ? '🧪 Postulación de PRUEBA guardada (no es real)'
        : 'Postulación guardada exitosamente',
      detalles: {
        delegaciones: datos.delegaciones.length,
        delegados: totalDelegados,
        estado: esPrueba
          ? 'Envío de prueba'
          : 'Postulación pendiente de revisión por el equipo',
      },
    });
  } catch (error) {
    console.error('Error al guardar postulación:', error);

    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';

    return NextResponse.json(
      {
        error: 'Error interno del servidor al procesar la postulación',
        detalles: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}