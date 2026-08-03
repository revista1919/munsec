// ⚙️ CONFIGURACIÓN MUNSEC - EDITAR CADA AÑO
// Cambia solo los valores, no la estructura

export const CONFIG_INSCRIPCION = {
  año: 2025,
  
  // 🟢 CONTROL DE INSCRIPCIONES
  inscripciones: {
    abiertas: true,
    fecha_apertura: "2025-03-01T00:00:00-03:00",
    fecha_cierre: null,
    mensajes: {
      cerradas: "Las inscripciones para MUNSEC {año} se encuentran cerradas. Síguenos en Instagram @munsec.chile para conocer las fechas de la próxima edición.",
      programadas: "Las inscripciones abrirán el {fecha}. ¡Te esperamos!",
      cerradas_temporal: "Las inscripciones cerraron el {fecha}. Si tienes dudas, escríbenos a {email}.",
      abiertas: "¡Inscripciones abiertas! Completa el formulario para participar en MUNSEC {año}."
    }
  },
  
  // Información del evento
  evento: {
    nombre: "MUNSEC 2025",
    fecha: "15, 16 y 17 de agosto",
    lugar: "Santiago, Chile",
    direccion: "Centro de Extensión UC, Av. Libertador Bernardo O'Higgins 390"
  },
  
  // Datos bancarios para el pago
  pago: {
    habilitado: true,
    cuenta: {
      banco: "Banco Estado",
      tipo: "Cuenta RUT",
      numero: "12345678",
      titular: "MUNSEC - Organización",
      rut: "12.345.678-9",
      email_confirmacion: "pagos@munsec.org"
    },
    // Valores base (para Chile)
    valores: {
      publico: {
        delegado: 8000,
        delegacion: 7000,
        descripcion: "Establecimientos públicos y subvencionados"
      },
      privado: {
        delegado: 15000,
        delegacion: 12000,
        descripcion: "Establecimientos privados"
      }
    },
    // 🔥 NUEVO: Precios diferenciados por país (extranjeros)
    valores_extranjero: {
      publico: {
        delegado: 25, // USD
        delegacion: 20,
        descripcion: "Establecimientos públicos extranjeros (USD)"
      },
      privado: {
        delegado: 40,
        delegacion: 35,
        descripcion: "Establecimientos privados extranjeros (USD)"
      }
    },
    // 🔥 NUEVO: Configuración de becas
    becas: {
      habilitadas: true,
      codigo_secreto: "MUNSEC-BECA-2025", // Código que se verifica internamente
      descuento_porcentaje: 50, // 50% de descuento si aplica
      mensaje_beca_total: "Beca completa. Solo debes subir el correo de confirmación.",
      mensaje_descuento: "Descuento aplicado. Sube el comprobante con el monto ya descontado."
    },
    mensaje: "Realiza la transferencia y sube el comprobante. Tu inscripción se confirmará en 24-48 horas hábiles."
  },
  
  // Comisiones disponibles
  comisiones: [
    {
      id: "asamblea_general",
      nombre: "Asamblea General",
      activa: true,
      paises_disponibles: [
        "Estados Unidos", "China", "Rusia", "Francia", "Reino Unido",
        "Alemania", "Japón", "Brasil", "India", "Canadá",
        "México", "Argentina", "Chile", "Colombia", "Perú",
        "España", "Italia", "Corea del Sur", "Australia", "Egipto",
        "Nigeria", "Sudáfrica", "Turquía", "Ucrania", "Israel"
      ],
      topicos: [
        "Cambio climático y desarrollo sostenible",
        "Derechos humanos en zonas de conflicto",
        "Cooperación internacional post-pandemia"
      ]
    }
  ],
  
  // 🔥 ACTUALIZADO: Requisitos con mínimos/máximos desde config
  requisitos: {
    edad: {
      minimo: 14,
      maximo: 18
    },
    delegacion: {
      minimo: 2,  // Ahora se lee desde aquí
      maximo: 10  // Ahora se lee desde aquí
    }
  },
  
  contact: {
    email: "contacto@munsec.org",
    instagram: "@munsec.chile",
    whatsapp: "+56912345678"
  },
  
  // 🔥 NUEVO: Texto legal para tratamiento de datos
  legal: {
    tratamiento_datos: {
      titulo: "Acuerdo de Tratamiento de Datos Personales",
      texto_completo: `Por medio del presente instrumento, y en conformidad con lo dispuesto en la Ley N° 19.628 sobre Protección de la Vida Privada y demás normativa aplicable, el titular de los datos personales declara haber sido informado y acepta expresamente lo siguiente:

1. FINALIDAD DEL TRATAMIENTO: Los datos personales proporcionados serán utilizados exclusivamente para fines internos de MUNSEC, incluyendo pero no limitándose a: gestión de inscripciones, envío de correos electrónicos informativos, notificaciones sobre actualizaciones del evento, y comunicaciones relacionadas con la formación académica.

2. USO INTERNO: MUNSEC se compromete a tratar los datos con estricta confidencialidad y a no utilizarlos para fines comerciales, lucrativos o ajenos a los propósitos académicos y formativos declarados.

3. POSIBILIDAD DE COMPARTIR DATOS: Eventualmente, y siempre bajo estrictos protocolos de seguridad y anonimización, los datos podrían ser compartidos con otras organizaciones verificadas y seguras, exclusivamente para propósitos académicos, de formación y sin ánimo de lucro. En ningún caso se compartirán datos con entidades que no cumplan con estándares de seguridad verificados.

4. DERECHOS DEL TITULAR: El titular podrá ejercer en cualquier momento sus derechos de acceso, rectificación, cancelación y oposición contactándose a través de los canales oficiales de MUNSEC.

5. VIGENCIA: Este consentimiento permanecerá vigente mientras dure la relación entre el titular y MUNSEC, y por un período adicional de 2 años tras la finalización del evento, únicamente para fines estadísticos y de archivo académico.

Al hacer clic en "Aceptar", usted manifiesta su consentimiento libre, informado e inequívoco para el tratamiento de sus datos personales conforme a los términos aquí expuestos.`,
      checkbox_texto: "He leído y acepto el Acuerdo de Tratamiento de Datos Personales para fines internos de MUNSEC, envío de correos, actualizaciones, y la posible compartición con organizaciones verificadas con propósitos académicos y de formación, sin ánimo de lucro."
    }
  }
};

// 🛠️ FUNCIÓN PARA VERIFICAR ESTADO DE INSCRIPCIONES
export function verificarEstadoInscripciones() {
  const config = CONFIG_INSCRIPCION.inscripciones;
  const ahora = new Date();
  
  if (!config.abiertas) {
    return {
      abiertas: false,
      razon: 'manual',
      mensaje: config.mensajes.cerradas
        .replace('{año}', CONFIG_INSCRIPCION.año)
        .replace('{email}', CONFIG_INSCRIPCION.contact.email)
    };
  }
  
  if (config.fecha_apertura) {
    const fechaApertura = new Date(config.fecha_apertura);
    if (ahora < fechaApertura) {
      return {
        abiertas: false,
        razon: 'programada',
        mensaje: config.mensajes.programadas
          .replace('{fecha}', fechaApertura.toLocaleDateString('es-CL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }))
      };
    }
  }
  
  if (config.fecha_cierre) {
    const fechaCierre = new Date(config.fecha_cierre);
    if (ahora > fechaCierre) {
      return {
        abiertas: false,
        razon: 'cerrada_temporal',
        mensaje: config.mensajes.cerradas_temporal
          .replace('{fecha}', fechaCierre.toLocaleDateString('es-CL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }))
          .replace('{email}', CONFIG_INSCRIPCION.contact.email)
      };
    }
  }
  
  return {
    abiertas: true,
    razon: 'abiertas',
    mensaje: config.mensajes.abiertas
      .replace('{año}', CONFIG_INSCRIPCION.año)
  };
}

// 🕐 FUNCIÓN PARA OBTENER TIEMPO RESTANTE
export function obtenerTiempoRestante() {
  const config = CONFIG_INSCRIPCION.inscripciones;
  const ahora = new Date();
  
  if (!config.fecha_cierre) return null;
  
  const fechaCierre = new Date(config.fecha_cierre);
  const diferencia = fechaCierre - ahora;
  
  if (diferencia <= 0) return null;
  
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  return { dias, horas };
}