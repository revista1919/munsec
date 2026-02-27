"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
// --- CONFIGURACIÓN DEL CORREO (EDITAR AQUÍ CUANDO CAMBIE) ---
const CONTACT_EMAIL = "munsec.chile@gmail.com";
// -----------------------------------------------------------

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function Contacto() {
  const [selectedPurpose, setSelectedPurpose] = useState('academico');
  const [isMobile, setIsMobile] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      setIsMobile(mobileRegex.test(userAgent));
    };
    
    checkMobile();
  }, []);

  // Función para obtener el asunto según el propósito seleccionado
  const getEmailSubject = () => {
    switch(selectedPurpose) {
      case 'academico':
        return 'Consulta Académica - MUNSEC';
      case 'cultural':
        return 'Propuesta Cultural - MUNSEC';
      case 'solicitud':
        return 'Solicitud General - MUNSEC';
      default:
        return 'Contacto - MUNSEC';
    }
  };

  // Función para obtener el cuerpo del mensaje (opcional)
  const getEmailBody = () => {
  const baseStyles = {
    container: 'max-width:600px; margin:0 auto; font-family:Arial, sans-serif;',
    header: 'background-color:#f8f9fa; padding:30px; text-align:center; border-bottom:3px solid #4A90E2;',
    title: 'font-family:Georgia, serif; font-size:24px; color:#1a1a1a; margin:0;',
    subtitle: 'font-size:12px; color:#4A90E2; text-transform:uppercase; letter-spacing:2px;',
    content: 'padding:30px; background-color:#ffffff;',
    paragraph: 'font-size:14px; line-height:1.6; color:#333; margin-bottom:20px;',
    signature: 'margin-top:30px; padding-top:20px; border-top:1px solid #e5e7eb;',
    button: 'display:inline-block; background-color:#4A90E2; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:4px; font-size:13px; font-weight:bold;',
    footer: 'background-color:#f8f9fa; padding:20px; text-align:center; font-size:11px; color:#666;'
  };

  const getPurposeContent = () => {
    switch(selectedPurpose) {
      case 'academico':
        return `
          <h3 style="font-size:18px; color:#1a1a1a; margin-bottom:15px;">Comunicación Académica</h3>
          <p style="${baseStyles.paragraph}">
            <strong>Institución de origen:</strong> [COMPLETAR]<br>
            <strong>Área de interés:</strong> [COMPLETAR]<br>
            <strong>Descripción del proyecto:</strong><br>
            [DETALLAR PROPUESTA]
          </p>
        `;
      case 'cultural':
        return `
          <h3 style="font-size:18px; color:#1a1a1a; margin-bottom:15px;">Propuesta Cultural</h3>
          <p style="${baseStyles.paragraph}">
            <strong>Tipo de actividad:</strong> [COMPLETAR]<br>
            <strong>Fechas tentativas:</strong> [COMPLETAR]<br>
            <strong>Descripción de la iniciativa:</strong><br>
            [DETALLAR PROPUESTA CULTURAL]
          </p>
        `;
      case 'solicitud':
        return `
          <h3 style="font-size:18px; color:#1a1a1a; margin-bottom:15px;">Solicitud General</h3>
          <p style="${baseStyles.paragraph}">
            <strong>Asunto específico:</strong> [COMPLETAR]<br>
            <strong>Detalles de la solicitud:</strong><br>
            [EXPLICAR REQUERIMIENTO]
          </p>
        `;
      default:
        return '';
    }
  };

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, sans-serif;">
        
        <!-- CONTENEDOR PRINCIPAL -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f4f6;">
          <tr>
            <td align="center" style="padding:40px 20px;">
              
              <!-- EMAIL CARD -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background-color:#ffffff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                
                <!-- HEADER -->
                <tr>
                  <td style="background:linear-gradient(135deg, #4A90E2 0%, #357ABD 100%); padding:40px 30px; text-align:center; border-radius:8px 8px 0 0;">
                    <h1 style="margin:0; font-family:Georgia, serif; font-size:32px; color:#ffffff; letter-spacing:-0.5px;">
                      MUNSEC
                    </h1>
                    <p style="margin:10px 0 0 0; font-size:12px; text-transform:uppercase; letter-spacing:3px; color:#ffffff; opacity:0.9;">
                      Modelo de Naciones Unidas • Secretaría
                    </p>
                  </td>
                </tr>
                
                <!-- CONTENIDO PRINCIPAL -->
                <tr>
                  <td style="padding:40px 30px;">
                    
                    <!-- SALUDO -->
                    <p style="font-size:16px; color:#1a1a1a; line-height:1.6; margin-bottom:25px;">
                      Estimado/a <strong>Secretaría MUNSEC</strong>,
                    </p>
                    
                    <!-- CUERPO DEL MENSAJE -->
                    <p style="font-size:15px; color:#333; line-height:1.7; margin-bottom:20px;">
                      Por medio de la presente, me dirijo a ustedes para hacer llegar la siguiente comunicación:
                    </p>
                    
                    <!-- CONTENIDO DINÁMICO SEGÚN PROPÓSITO -->
                    ${getPurposeContent()}
                    
                    <!-- INFORMACIÓN ADICIONAL -->
                    <div style="margin:30px 0; padding:25px; background-color:#f8f9fa; border-left:4px solid #4A90E2;">
                      <p style="margin:0; font-size:14px; color:#555; line-height:1.6;">
                        <strong>Nota:</strong> Agradecemos confirmar recepción de este mensaje. 
                        Para consultas, puede responder directamente a este correo.
                      </p>
                    </div>
                    
                    <!-- DATOS DE CONTACTO DEL REMITENTE -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0;">
                      <tr>
                        <td style="padding:20px; background-color:#ffffff; border:1px solid #e5e7eb; border-radius:6px;">
                          <p style="margin:0 0 10px 0; font-size:14px; color:#1a1a1a;">
                            <strong>Datos del remitente:</strong>
                          </p>
                          <p style="margin:0; font-size:13px; color:#666;">
                            <strong>Nombre completo:</strong> [COMPLETAR]<br>
                            <strong>Institución/Organización:</strong> [COMPLETAR]<br>
                            <strong>Teléfono de contacto:</strong> [COMPLETAR]<br>
                            <strong>Correo electrónico:</strong> [COMPLETAR]
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- FIRMA -->
                    <div style="margin-top:40px;">
                      <p style="font-size:15px; color:#333; line-height:1.7; margin-bottom:5px;">
                        Atentamente,
                      </p>
                      <p style="font-size:16px; color:#1a1a1a; line-height:1.7;">
                        <strong>[NOMBRE DEL REMITENTE]</strong><br>
                        <span style="font-size:13px; color:#666;">[CARGO / POSICIÓN]</span>
                      </p>
                    </div>
                    
                  </td>
                </tr>
                
                <!-- FOOTER -->
                <tr>
                  <td style="padding:30px; background-color:#f8f9fa; border-top:1px solid #e5e7eb; text-align:center; border-radius:0 0 8px 8px;">
                    <p style="margin:0 0 10px 0; font-size:12px; color:#666;">
                      © ${new Date().getFullYear()} MUNSEC - Modelo de Naciones Unidas · Secretaría
                    </p>
                    <p style="margin:0; font-size:11px; color:#999;">
                      Este correo fue enviado a través del formulario de contacto oficial.
                    </p>
                  </td>
                </tr>
                
              </table>
              
            </td>
          </tr>
        </table>
        
      </body>
    </html>
  `;

  // Convertir el HTML a una línea y codificarlo para URL
  return encodeURIComponent(htmlBody);
};

  // Construir el mailto con asunto dinámico (para móvil)
  const getMailtoLink = () => {
    const subject = encodeURIComponent(getEmailSubject());
    const body = encodeURIComponent(getEmailBody());
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  // Construir enlace de Gmail (para escritorio)
  const getGmailLink = () => {
    const subject = encodeURIComponent(getEmailSubject());
    const body = encodeURIComponent(getEmailBody());
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${subject}&body=${body}`;
  };

  // Construir enlace de Outlook (para escritorio)
  const getOutlookLink = () => {
    const subject = encodeURIComponent(getEmailSubject());
    const body = encodeURIComponent(getEmailBody());
    return `https://outlook.live.com/mail/0/deeplink/compose?to=${CONTACT_EMAIL}&subject=${subject}&body=${body}`;
  };

  // Función para copiar el correo
  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 3000);
    }).catch(err => {
      // Fallback para navegadores antiguos
      const textArea = document.createElement('textarea');
      textArea.value = CONTACT_EMAIL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 3000);
    });
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-32">
      {/* Header */}
      <header className="pt-32 pb-20 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <span className="text-[#4A90E2] text-[10px] uppercase tracking-[0.5em] font-bold block mb-4">
            Correspondencia
          </span>
          <h1 className="font-serif text-5xl text-slate-900 mb-6">Contacto</h1>
          <p className="text-slate-500 font-light max-w-2xl leading-relaxed text-sm">
            Establece comunicación con la secretaría de MUNSEC para fines académicos, 
            colaboraciones culturales o solicitudes formales. Revisaremos tu mensaje 
            y te responderemos a la brevedad.
          </p>
        </div>
      </header>

      {/* Sección de Contacto */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white border border-slate-200 overflow-hidden"
          >
            <div className="grid md:grid-cols-12">
              {/* Información de contacto y propósito */}
              <div className="md:col-span-5 p-12 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="mb-10">
                    <span className="font-serif text-2xl font-bold text-slate-300 uppercase tracking-tighter">
                      MUNSEC
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl text-slate-900 mb-6">Oficina de Enlace</h2>
                  
                  <div className="space-y-6">
                    {/* Propósito Académico */}
                    <div 
                      className={`p-4 border cursor-pointer transition-all ${
                        selectedPurpose === 'academico' 
                          ? 'border-[#4A90E2] bg-[#4A90E2]/5' 
                          : 'border-slate-100 hover:border-slate-300'
                      }`}
                      onClick={() => setSelectedPurpose('academico')}
                    >
                      <h3 className="font-serif text-lg text-slate-900 mb-2">Académico</h3>
                      <p className="text-slate-500 text-xs leading-relaxed font-light">
                        Investigación, intercambio estudiantil, programas de formación 
                        y convenios con instituciones educativas.
                      </p>
                    </div>

                    {/* Propósito Cultural */}
                    <div 
                      className={`p-4 border cursor-pointer transition-all ${
                        selectedPurpose === 'cultural' 
                          ? 'border-[#4A90E2] bg-[#4A90E2]/5' 
                          : 'border-slate-100 hover:border-slate-300'
                      }`}
                      onClick={() => setSelectedPurpose('cultural')}
                    >
                      <h3 className="font-serif text-lg text-slate-900 mb-2">Cultural</h3>
                      <p className="text-slate-500 text-xs leading-relaxed font-light">
                        Actividades de difusión, eventos interculturales, exposiciones 
                        y programas de extensión.
                      </p>
                    </div>

                    {/* Propósito Solicitud General */}
                    <div 
                      className={`p-4 border cursor-pointer transition-all ${
                        selectedPurpose === 'solicitud' 
                          ? 'border-[#4A90E2] bg-[#4A90E2]/5' 
                          : 'border-slate-100 hover:border-slate-300'
                      }`}
                      onClick={() => setSelectedPurpose('solicitud')}
                    >
                      <h3 className="font-serif text-lg text-slate-900 mb-2">Solicitud General</h3>
                      <p className="text-slate-500 text-xs leading-relaxed font-light">
                        Peticiones formales, consultas administrativas, propuestas 
                        de colaboración y otros asuntos.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Correo de contacto - COMPORTAMIENTO DIFERENCIADO */}
                <div className="mt-12 pt-6 border-t border-slate-100">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold block mb-2">
                    Enviar correspondencia a
                  </span>
                  
                  <div className="space-y-4">
                    {/* Mostrar el correo como texto siempre */}
                    <div className="text-lg text-slate-900 font-light break-all">
                      {CONTACT_EMAIL}
                    </div>

                    {/* Feedback de copiado */}
                    {showCopyFeedback && (
                      <span className="inline-block text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        ✓ Correo copiado al portapapeles
                      </span>
                    )}

                    {/* Opciones según dispositivo */}
                    {isMobile ? (
                      /* MÓVIL: Mailto link */
                      <a
                        href={getMailtoLink()}
                        className="inline-block text-xs px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#4A90E2]/90 transition-colors"
                      >
                        Abrir aplicación de correo
                      </a>
                    ) : (
                      /* ESCRITORIO: Botones para servicios web */
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={getGmailLink()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                          </svg>
                          Gmail
                        </a>
                        <a
                          href={getOutlookLink()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.5 3.5L4 6v12l3.5 2.5 8-5v-4l-8 5v-4l8-5v-4l-8 5z"/>
                          </svg>
                          Outlook
                        </a>
                        <button
                          onClick={copyEmailToClipboard}
                          className="text-xs px-3 py-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors"
                        >
                          Copiar correo
                        </button>
                      </div>
                    )}

                    {/* Instrucciones adicionales según dispositivo */}
                    {isMobile ? (
                      <p className="text-[10px] text-slate-400 mt-2">
                        * Se abrirá tu aplicación de correo predeterminada con el asunto según el propósito seleccionado.
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400 mt-2">
                        * Selecciona un propósito y luego haz clic en Gmail o Outlook para enviar con el asunto pre-completado.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Panel derecho - Información según propósito */}
              <div className="md:col-span-7 bg-slate-50 p-12">
                <div className="h-full flex flex-col justify-center">
                  <h3 className="font-serif text-xl text-slate-900 mb-6">
                    {selectedPurpose === 'academico' && 'Comunicación Académica'}
                    {selectedPurpose === 'cultural' && 'Vinculación Cultural'}
                    {selectedPurpose === 'solicitud' && 'Recepción de Solicitudes'}
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed font-light mb-8">
                    {selectedPurpose === 'academico' && 
                      'Para propuestas académicas, incluye en tu mensaje: institución de origen, área de interés y una breve descripción del proyecto o colaboración propuesta.'}
                    {selectedPurpose === 'cultural' && 
                      'Si tu iniciativa tiene fines culturales, detalla el tipo de actividad, fechas tentativas y cómo visualizas la participación de MUNSEC en el proyecto.'}
                    {selectedPurpose === 'solicitud' && 
                      'Para solicitudes generales, especifica claramente el asunto y proporciona la información necesaria para que podamos dar curso a tu requerimiento.'}
                  </p>

                  <div className="border border-slate-200 bg-white p-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-3">
                      Protocolo de respuesta
                    </p>
                    <ul className="space-y-2 text-slate-500 text-xs font-light">
                      <li className="flex items-start gap-2">
                        <span className="text-[#4A90E2] text-sm">•</span>
                        <span>Tiempo de respuesta estimado: 3-5 días hábiles</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4A90E2] text-sm">•</span>
                        <span>Indicar en el asunto el propósito de la comunicación</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4A90E2] text-sm">•</span>
                        <span>Incluir datos de contacto para facilitar la respuesta</span>
                      </li>
                    </ul>
                  </div>

                  {/* Indicador visual de propósito seleccionado */}
                  <div className="mt-6 text-right">
                    <span className="text-[8px] uppercase tracking-[0.3em] text-slate-300">
                      Propósito activo: {
                        selectedPurpose === 'academico' ? 'Académico' : 
                        selectedPurpose === 'cultural' ? 'Cultural' : 'Solicitud General'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}