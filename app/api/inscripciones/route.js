import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { verificarEstadoInscripciones, CONFIG_INSCRIPCION } from '@/config/inscripcion';

export async function POST(request) {
  try {
    let datos;
    try {
      datos = await request.json();
    } catch (parseError) {
      console.error('[MUNSEC API] Body JSON inválido:', parseError);
      return NextResponse.json(
        { error: 'El cuerpo de la solicitud no es JSON válido', code: 'INVALID_JSON' },
        { status: 400 }
      );
    }

    const esPrueba = datos.__es_prueba === true;

    // ============================================================
    // VERIFICAR QUE LAS POSTULACIONES ESTÉN ABIERTAS
    // ============================================================
    const estado = verificarEstadoInscripciones(esPrueba);
    if (!estado.abiertas) {
      return NextResponse.json(
        { error: estado.mensaje || 'Las postulaciones no están abiertas', code: 'CLOSED' },
        { status: 403 }
      );
    }

    // ============================================================
    // VALIDACIONES DEFENSIVAS
    // ============================================================
    if (!datos.tipo_establecimiento || !datos.nombre_establecimiento) {
      return NextResponse.json(
        { error: 'Faltan datos del establecimiento', code: 'MISSING_SCHOOL' },
        { status: 400 }
      );
    }
    if (!datos.ciudad || !datos.pais_origen) {
      return NextResponse.json(
        { error: 'Faltan datos de ubicación del establecimiento', code: 'MISSING_LOCATION' },
        { status: 400 }
      );
    }

    if (!datos.profesor_nombre || !datos.profesor_email || !datos.profesor_telefono) {
      return NextResponse.json(
        { error: 'Faltan datos del profesor responsable (nombre, email y teléfono son obligatorios)', code: 'MISSING_TEACHER' },
        { status: 400 }
      );
    }

    const email = String(datos.profesor_email || '').trim().toLowerCase();
    if (!email.includes('@') || email.length < 5) {
      return NextResponse.json(
        { error: 'El correo electrónico del profesor no es válido', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    if (!datos.delegaciones || !Array.isArray(datos.delegaciones) || datos.delegaciones.length === 0) {
      return NextResponse.json(
        { error: 'Debe postular al menos una delegación', code: 'NO_DELEGATIONS' },
        { status: 400 }
      );
    }

    const minDeleg = CONFIG_INSCRIPCION?.requisitos?.delegacion?.minimo ?? 1;
    const maxDeleg = CONFIG_INSCRIPCION?.requisitos?.delegacion?.maximo ?? 999; // unificado con frontend

    if (datos.delegaciones.length < minDeleg || datos.delegaciones.length > maxDeleg) {
      return NextResponse.json(
        { error: `La cantidad de delegaciones debe estar entre ${minDeleg} y ${maxDeleg}`, code: 'DELEG_LIMIT' },
        { status: 400 }
      );
    }

    // Validar cada delegación
    for (let i = 0; i < datos.delegaciones.length; i++) {
      const del = datos.delegaciones[i];
      if (!del?.delegado_1?.nombre || !del.delegado_1.edad || !del.delegado_1.curso) {
        return NextResponse.json(
          { error: `Faltan datos del Delegado 1 en la Delegación ${i + 1}`, code: 'MISSING_D1' },
          { status: 400 }
        );
      }
      if (del.tiene_pareja) {
        if (!del?.delegado_2?.nombre || !del.delegado_2.edad || !del.delegado_2.curso) {
          return NextResponse.json(
            { error: `Faltan datos del Delegado 2 en la Delegación ${i + 1}`, code: 'MISSING_D2' },
            { status: 400 }
          );
        }
      }
      if (!del.pais_preferencia_1 || !del.pais_preferencia_2 || !del.pais_preferencia_3) {
        return NextResponse.json(
          { error: `Faltan las 3 preferencias de país en la Delegación ${i + 1}`, code: 'MISSING_PREFS' },
          { status: 400 }
        );
      }
      const preferencias = [
        String(del.pais_preferencia_1 || '').trim().toLowerCase(),
        String(del.pais_preferencia_2 || '').trim().toLowerCase(),
        String(del.pais_preferencia_3 || '').trim().toLowerCase(),
      ];
      if (new Set(preferencias).size !== 3) {
        return NextResponse.json(
          { error: `Las preferencias de país en la Delegación ${i + 1} deben ser diferentes entre sí`, code: 'DUPLICATE_PREFS' },
          { status: 400 }
        );
      }
    }

    if (!datos.acepta_terminos || !datos.acepta_reglamento || !datos.acepta_datos) {
      return NextResponse.json(
        { error: 'Debe aceptar todos los términos, reglamentos y acuerdos de datos', code: 'TERMS' },
        { status: 400 }
      );
    }

    // ============================================================
    // PROCESAR DELEGACIONES
    // ============================================================
    const delegacionesProcesadas = datos.delegaciones.map((del, index) => {
      const delegacion = {
        numero: index + 1,
        tiene_pareja: Boolean(del.tiene_pareja),
        preferencias_pais: [
          del.pais_preferencia_1,
          del.pais_preferencia_2,
          del.pais_preferencia_3,
        ].filter(Boolean).map(String),
        delegados: [],
      };

      delegacion.delegados.push({
        tipo: 'titular_1',
        nombre: String(del.delegado_1?.nombre || ''),
        rut: String(del.delegado_1?.rut || ''),
        edad: String(del.delegado_1?.edad || ''),
        curso: String(del.delegado_1?.curso || ''),
      });

      if (del.tiene_pareja && del.delegado_2) {
        delegacion.delegados.push({
          tipo: 'titular_2',
          nombre: String(del.delegado_2?.nombre || ''),
          rut: String(del.delegado_2?.rut || ''),
          edad: String(del.delegado_2?.edad || ''),
          curso: String(del.delegado_2?.curso || ''),
        });
      }

      return delegacion;
    });

    const totalDelegados = delegacionesProcesadas.reduce(
      (total, del) => total + del.delegados.length,
      0
    );

    // ============================================================
    // DOCUMENTO PARA FIRESTORE (solo campos limpios)
    // ============================================================
    const inscripcion = {
      tipo_establecimiento: String(datos.tipo_establecimiento),
      nombre_establecimiento: String(datos.nombre_establecimiento),
      pais_origen: String(datos.pais_origen),
      ciudad: String(datos.ciudad),
      direccion: String(datos.direccion || ''),
      telefono_establecimiento: String(datos.telefono_establecimiento || ''),

      profesor: {
        nombre: String(datos.profesor_nombre),
        apellido: String(datos.profesor_apellido || ''),
        rut: String(datos.profesor_rut || ''),
        email,
        telefono: String(datos.profesor_telefono || ''),
        edad: String(datos.profesor_edad || ''),
        asignatura: String(datos.profesor_asignatura || ''),
      },

      cantidad_delegaciones: Number(datos.cantidad_delegaciones) || datos.delegaciones.length,
      total_delegados: totalDelegados,
      delegaciones: delegacionesProcesadas,

      motivacion: String(datos.motivacion || ''),
      experiencia_previa: datos.experiencia_previa === 'si' ? 'si' : 'no',
      experiencia_detalle: String(datos.experiencia_detalle || ''),

      apoyos: {
        requiere_apoyo: datos.requiere_apoyo === 'si' ? 'si' : 'no',
        apoyo_delegado: String(datos.apoyo_delegado || ''),
        apoyo_descripcion: String(datos.apoyo_descripcion || ''),
        apoyo_coordinacion: datos.apoyo_coordinacion === 'si' ? 'si' : 'no',
        apoyo_observaciones: String(datos.apoyo_observaciones || ''),
      },

      alimentacion: {
        tiene_restriccion: datos.tiene_restriccion === 'si' ? 'si' : 'no',
        restriccion_delegado: String(datos.restriccion_delegado || ''),
        restriccion_tipo: Array.isArray(datos.restriccion_tipo) ? datos.restriccion_tipo.map(String) : [],
        restriccion_detalle: String(datos.restriccion_detalle || ''),
      },

      terminos: {
        acepta_terminos: Boolean(datos.acepta_terminos),
        acepta_reglamento: Boolean(datos.acepta_reglamento),
        acepta_datos: Boolean(datos.acepta_datos),
        fecha_aceptacion: new Date().toISOString(),
      },

      año: CONFIG_INSCRIPCION?.año || new Date().getFullYear(),
      estado: esPrueba ? 'prueba' : 'postulacion',
      estado_pago: 'no_aplica',
      es_prueba: esPrueba,
      fecha_postulacion: new Date().toISOString(),
      timestamp: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'inscripciones'), inscripcion);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      es_prueba: esPrueba,
      message: esPrueba
        ? 'Postulación de PRUEBA guardada (no es real)'
        : 'Postulación guardada exitosamente',
      detalles: {
        delegaciones: datos.delegaciones.length,
        delegados: totalDelegados,
        estado: esPrueba ? 'Envío de prueba' : 'Postulación pendiente de revisión por el equipo',
      },
    });
  } catch (error) {
    console.error('[MUNSEC API] Error al guardar postulación:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      {
        error: 'Error interno del servidor al procesar la postulación',
        code: 'INTERNAL',
        detalles: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
