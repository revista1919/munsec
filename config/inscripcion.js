// ⚙️ CONFIGURACIÓN MUNSEC - EDITAR CADA AÑO
// Cambia solo los valores, no la estructura

export const CONFIG_INSCRIPCION = {
  año: 2026,

  // 🟢 CONTROL DE INSCRIPCIONES
  inscripciones: {
    abiertas: true, // 🔒 CERRADAS para el público hasta el 28 de septiembre
    fecha_apertura: "2026-09-28T00:00:00-03:00", // 📅 28 de septiembre
    fecha_cierre: "2026-10-11T23:59:59-03:00",   // 11 de octubre

    // 🧪 MODO PRUEBA — Solo con ?prueba=1 en la URL
    // Cambia esta palabra si quieres invalidar el link del equipo
    palabraPrueba: "munsec2026",

    mensajes: {
      cerradas: "Las inscripciones para MUNSEC {año} se encuentran cerradas. Síguenos en Instagram @munsec.chile para conocer las fechas de la próxima edición.",
      programadas: "Las inscripciones abrirán el {fecha}. ¡Te esperamos!",
      cerradas_temporal: "Las inscripciones cerraron el {fecha}. Si tienes dudas, escríbenos a {email}.",
      abiertas: "¡Inscripciones abiertas! Completa el formulario para participar en MUNSEC {año}."
    }
  },

  // Información del evento
  evento: {
    nombre: "MUNSEC 2026",
    fecha: "2 y 3 de Noviembre",
    lugar: "CEPAL - Comisión Económica para América Latina y el Caribe",
    direccion: "Av. Dag Hammarskjöld 3477, Vitacura, Santiago"
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
      email_confirmacion: "munsec.chile@gmail.com"
    },
    valores: {
      nacional: {
        delegado: 10000, // CLP
        descripcion: "Establecimientos nacionales (Chile)"
      },
      extranjero: {
        delegado: 20, // USD
        descripcion: "Establecimientos extranjeros"
      }
    },
    becas: {
      habilitadas: false,
      codigo_secreto: "",
      descuento_porcentaje: 0,
      mensaje_beca_total: "",
      mensaje_descuento: ""
    },
    mensaje: "El pago se realizará únicamente si eres seleccionado. Por ahora, solo se muestran los precios de referencia."
  },

  // Comisiones disponibles
  comisiones: [
    {
      id: "asamblea_general",
      nombre: "Asamblea General",
      activa: true,
      topicos: [
        "Por definir"
      ]
    }
  ],

  // Requisitos
  requisitos: {
    edad: {
      minimo: 14,
      maximo: 18
    },
    delegacion: {
      minimo: 1,    // Al menos 1 delegación por establecimiento
      maximo: 999   // Sin límite real (prácticamente infinito)
    }
  },

  contact: {
    email: "munsec.chile@gmail.com",
    instagram: "@munsec.chile",
    whatsapp: "+56912345678"
  },

  // ============================================================
  // TEXTO LEGAL — HTML formateado para Quill / dangerouslySetInnerHTML
  // Solo el equipo edita este contenido. El usuario solo lo ve.
  // ============================================================
  legal: {
    tratamiento_datos: {
      titulo: "Acuerdo de Tratamiento de Datos Personales",

      texto_completo: `
        <p>
          Por medio del presente instrumento, y en conformidad con lo dispuesto en la
          <strong>Ley N° 19.628 sobre Protección de la Vida Privada</strong> y demás normativa aplicable,
          el titular de los datos personales declara haber sido informado y acepta expresamente lo siguiente:
        </p>

        <h3>1. Finalidad del tratamiento</h3>
        <p>
          Los datos personales proporcionados serán utilizados <strong>exclusivamente para fines internos de MUNSEC</strong>,
          incluyendo, pero no limitándose a:
        </p>
        <ul>
          <li>Gestión de inscripciones y postulaciones.</li>
          <li>Envío de correos electrónicos informativos.</li>
          <li>Notificaciones sobre actualizaciones del evento.</li>
          <li>Comunicaciones relacionadas con la formación académica.</li>
        </ul>

        <h3>2. Uso interno</h3>
        <p>
          MUNSEC se compromete a tratar los datos con <strong>estricta confidencialidad</strong> y a
          <strong>no utilizarlos para fines comerciales, lucrativos o ajenos</strong> a los propósitos
          académicos y formativos declarados.
        </p>

        <h3>3. Posibilidad de compartir datos</h3>
        <p>
          Eventualmente, y siempre bajo <strong>estrictos protocolos de seguridad y anonimización</strong>,
          los datos podrían ser compartidos con otras organizaciones verificadas y seguras,
          exclusivamente para propósitos académicos y de formación, y sin ánimo de lucro.
          En ningún caso se compartirán datos con entidades que no cumplan con estándares
          de seguridad verificados.
        </p>

        <h3>4. Derechos del titular</h3>
        <p>
          El titular podrá ejercer en cualquier momento sus derechos de
          <strong>acceso, rectificación, cancelación y oposición</strong> contactándose a través de
          los canales oficiales de MUNSEC.
        </p>

        <h3>5. Vigencia</h3>
        <p>
          Este consentimiento permanecerá vigente para la utilización por parte de MUNSEC
          de manera indefinida, siguiendo estrictos protocolos de privacidad y con fines
          estrictamente académicos.
        </p>

        <blockquote>
          Al hacer clic en <strong>"Aceptar"</strong>, usted manifiesta su consentimiento
          libre, informado e inequívoco para el tratamiento de sus datos personales
          conforme a los términos aquí expuestos.
        </blockquote>
      `,

      checkbox_texto: "He leído y acepto el Acuerdo de Tratamiento de Datos Personales para fines internos de MUNSEC, envío de correos, actualizaciones, y la posible compartición con organizaciones verificadas con propósitos académicos y de formación, sin ánimo de lucro."
    }
  }
};

// 🛠️ VERIFICAR ESTADO DE INSCRIPCIONES
// Recibe un booleano "esPrueba" (viene de ?prueba=1 en la URL)
export function verificarEstadoInscripciones(esPrueba = false) {
  const config = CONFIG_INSCRIPCION.inscripciones;
  const ahora = new Date();

  // 🧪 MODO PRUEBA: salta todas las validaciones
  if (esPrueba) {
    return {
      abiertas: true,
      razon: 'modo_prueba',
      mensaje: '🧪 Modo prueba activado. El formulario funciona con normalidad, pero no es una inscripción real.'
    };
  }

  // 🔒 Validaciones normales
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

// 🕐 TIEMPO RESTANTE
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

// 🧪 HELPER: detecta si estamos en modo prueba según la URL
// Funciona con ?prueba=1 o ?prueba=munsec2026
export function esModoPrueba() {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  const valor = params.get('prueba');
  if (!valor) return false;
  // Acepta ?prueba=1 o ?prueba=<palabraPrueba>
  return valor === '1' || valor === CONFIG_INSCRIPCION.inscripciones.palabraPrueba;
}
