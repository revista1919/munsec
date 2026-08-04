"use client";

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzx9Bhrckyor-_z6mfwp6vG9j0dS_pi7S4I5gMD3_qWTuXOxUUKQNVt0j-4xT7BMQBnPA/exec';
const WHATSAPP_LINK = 'https://chat.whatsapp.com/Ji3QcgJ4V2K0he8klcoQJb';

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  
  const [status, setStatus] = useState('loading');
  const [email, setEmail] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [nombre, setNombre] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [descargando, setDescargando] = useState(false);
  
  const bienvenidaRef = useRef(null);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const respuestaParam = searchParams.get('respuesta');
    
    if (emailParam) setEmail(emailParam);
    if (respuestaParam) setRespuesta(respuestaParam);
    
    if (emailParam && respuestaParam) {
      procesarRespuesta(emailParam, respuestaParam);
    } else if (emailParam) {
      setStatus('pending');
    } else {
      setStatus('error');
      setMensaje('Enlace no valido');
    }
  }, [searchParams]);

  const procesarRespuesta = async (emailParam, respuestaParam) => {
    setStatus('loading');
    
    try {
      const formData = new URLSearchParams();
      formData.append("email", emailParam);
      formData.append("respuesta", respuestaParam);
      
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        if (respuestaParam === 'Si' || respuestaParam === 'si') {
          setStatus('bienvenida');
          const nombreDesdeEmail = emailParam.split('@')[0];
          const nombreFormateado = nombreDesdeEmail
            .replace(/[0-9._-]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .trim();
          setNombre(nombreFormateado || 'Participante');
        } else {
          setStatus('success');
        }
      } else {
        setStatus('error');
        setMensaje(result.message || 'Error al procesar');
      }
    } catch (error) {
      setStatus('error');
      setMensaje('Error de conexion');
    }
  };

  const copiarMensaje = () => {
    const texto = `Bienvenido/a al equipo oficial de MUNSEC Chile

Estimado/a ${nombre}:

Te damos la mas cordial bienvenida al equipo. Estamos muy contentos de contar contigo.

Proximas actividades:
- Reunion presencial en Palacio Pereira (Huerfanos 1515, Santiago)
- Reunion online para quienes residan en otra region

Unete al grupo de WhatsApp:
${WHATSAPP_LINK}

Durante los proximos dias nos pondremos en contacto con los horarios y detalles.

Equipo Organizador
MUNSEC Chile`;

    navigator.clipboard.writeText(texto).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    });
  };

  const descargarPDF = async () => {
    if (!bienvenidaRef.current) return;
    setDescargando(true);
    
    try {
      const canvas = await html2canvas(bienvenidaRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#eef2f5',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('MUNSEC_Bienvenida.pdf');
    } catch (error) {
      console.error('Error generando PDF:', error);
    }
    
    setDescargando(false);
  };

  const descargarImagen = async () => {
    if (!bienvenidaRef.current) return;
    setDescargando(true);
    
    try {
      const canvas = await html2canvas(bienvenidaRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#eef2f5',
      });
      
      const link = document.createElement('a');
      link.download = 'MUNSEC_Bienvenida.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generando imagen:', error);
    }
    
    setDescargando(false);
  };

  const getStatusStyle = () => {
    switch(status) {
      case 'success':
        return { bg: '#f3f4f6', border: '#d1d5db', text: '#4b5563' };
      case 'error':
        return { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' };
      case 'loading':
        return { bg: '#f9fafb', border: '#e5e7eb', text: '#6b7280' };
      default:
        return { bg: '#ffffff', border: '#e5e7eb', text: '#111111' };
    }
  };

  const getMensajeTexto = () => {
    switch(status) {
      case 'success':
        return 'Se ha registrado su declinacion. Agradecemos su tiempo e interes.';
      case 'error':
        return mensaje || 'No se pudo procesar su solicitud. Por favor intente nuevamente.';
      case 'loading':
        return 'Procesando su solicitud...';
      default:
        return '';
    }
  };

  const statusStyle = getStatusStyle();
  const fechaActual = new Date().toLocaleDateString('es-CL', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  // Pantalla de bienvenida completa
  if (status === 'bienvenida') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#eef2f5',
        padding: '1rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}>
        {/* Tarjeta de bienvenida (para descargar) */}
        <div 
          ref={bienvenidaRef}
          style={{
            backgroundColor: '#ffffff',
            maxWidth: '600px',
            margin: '0 auto 20px auto',
            border: '1px solid #d1d5db',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '25px 20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '15px',
          }}>
            <div>
              <Image 
                src="/munsec.png" 
                alt="MUNSEC" 
                width={120}
                height={30}
                style={{ height: '30px', width: 'auto' }}
              />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#111111',
                textTransform: 'uppercase',
              }}>
                {fechaActual}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#418FDE',
                fontWeight: 'bold',
                marginTop: '3px',
              }}>
                COMUNICADO OFICIAL
              </div>
            </div>
          </div>

          <div style={{
            borderBottom: '3px solid #111111',
            margin: '0 20px',
          }}></div>

          <div style={{ padding: '25px 20px', textAlign: 'center' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              color: '#666666',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}>
              Inicio de Actividades
            </div>
            <h1 style={{
              fontFamily: '"Georgia", serif',
              fontSize: '28px',
              color: '#111111',
              margin: '0 0 20px 0',
              lineHeight: '1.1',
              letterSpacing: '-0.5px',
            }}>
              Bienvenidos al Equipo
            </h1>
          </div>

          <div style={{ padding: '0 20px 20px 20px' }}>
            <div style={{
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
              padding: '15px 18px',
              borderLeft: '4px solid #418FDE',
              fontSize: '14px',
              lineHeight: '1.6',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}>
              <strong>Estimado/a {nombre}:</strong> Te damos la mas cordial bienvenida al equipo oficial de MUNSEC. Queremos agradecer sinceramente tu interes, disposicion y compromiso con este proyecto.
            </div>
          </div>

          <div style={{ padding: '0 20px' }}>
            <p style={{
              fontFamily: '"Georgia", serif',
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#333333',
              margin: '0 0 15px 0',
              textAlign: 'justify',
            }}>
              <strong style={{ fontSize: '18px', color: '#111111' }}>E</strong>stamos muy contentos de contar contigo y confiamos en que tu participacion sera un gran aporte para el crecimiento de MUNSEC y el desarrollo de nuestras futuras actividades.
            </p>
            
            <p style={{
              fontFamily: '"Georgia", serif',
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#333333',
              margin: '0 0 15px 0',
              textAlign: 'justify',
            }}>
              Para dar inicio a este proceso, tenemos planificadas dos instancias de bienvenida: una reunion <strong>presencial</strong> en el <em>Palacio Pereira (Huerfanos 1515, Santiago)</em> y una reunion <strong>online</strong>, destinada a quienes residan en otra region o, por motivos justificados, no puedan asistir presencialmente.
            </p>

            <p style={{
              fontFamily: '"Georgia", serif',
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#333333',
              margin: '0 0 15px 0',
              textAlign: 'justify',
            }}>
              En ambas instancias realizaremos la presentacion del equipo, daremos a conocer el trabajo de cada comision, llevaremos a cabo una capacitacion sobre ellas y presentaremos las principales actividades planificadas para este ano.
            </p>

            <p style={{
              fontFamily: '"Georgia", serif',
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#333333',
              margin: '0 0 25px 0',
              textAlign: 'justify',
            }}>
              <em>Durante los proximos dias nos pondremos en contacto contigo con los horarios y mas detalles.</em>
            </p>
          </div>

          {/* WhatsApp Box */}
          <div style={{ padding: '0 20px 25px 20px' }}>
            <div style={{
              backgroundColor: '#f7f9fc',
              border: '1px solid #e1e8ed',
              borderRadius: '8px',
              padding: '25px 15px',
              textAlign: 'center',
            }}>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#444444',
                margin: '0 0 18px 0',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}>
                Unete a nuestra comunidad oficial de WhatsApp. Este sera el canal de comunicacion central para los eventos y la coordinacion general.
              </p>
              
              <a 
                href={WHATSAPP_LINK}
                target="_blank"
                style={{
                  display: 'inline-block',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '12px 25px',
                  borderRadius: '30px',
                  backgroundColor: '#25D366',
                  border: '1px solid #1EBE5D',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                <span style={{ marginRight: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{ verticalAlign: 'middle' }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </span>
                Unirse al grupo de WhatsApp
              </a>
            </div>
          </div>

          {/* Cita */}
          <div style={{ padding: '0 20px 20px 20px' }}>
            <p style={{
              fontFamily: '"Georgia", serif',
              fontSize: '17px',
              lineHeight: '1.5',
              color: '#111111',
              margin: '0',
              textAlign: 'center',
              fontStyle: 'italic',
            }}>
              "Bienvenido/a a MUNSEC. Esperamos trabajar contigo y construir una gran experiencia."
            </p>
          </div>

          {/* Footer */}
          <div style={{ padding: '0 20px 30px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Image 
                src="/munsec.png" 
                alt="MUNSEC" 
                width={45}
                height={45}
                style={{ 
                  width: '45px', 
                  height: '45px', 
                  borderRadius: '50%', 
                  backgroundColor: '#f4f4f4', 
                  border: '1px solid #ddd',
                  objectFit: 'contain',
                  padding: '2px',
                }}
              />
              <div>
                <div style={{
                  fontSize: '15px',
                  fontWeight: 'bold',
                  color: '#111111',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}>
                  Equipo Organizador
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#666666',
                  fontStyle: 'italic',
                  marginTop: '2px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}>
                  MUNSEC Chile
                </div>
              </div>
            </div>
          </div>

          {/* Barra negra */}
          <div style={{
            backgroundColor: '#111111',
            padding: '30px 20px',
            textAlign: 'center',
          }}>
            <div style={{ marginBottom: '15px' }}>
              <a href="https://www.instagram.com/munsec.chile/" target="_blank">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
            <p style={{
              fontSize: '11px',
              color: '#888888',
              margin: '0',
              lineHeight: '1.6',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}>
              Este mensaje ha sido emitido de manera oficial para <strong>{email}</strong>.
              <br />
              {new Date().getFullYear()} MUNSEC. Todos los derechos reservados.
            </p>
          </div>
        </div>

        {/* Botones de accion */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <p style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#666666',
            margin: '0 0 5px 0',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}>
            Hoy o manana recibira una copia de este mensaje en su correo electronico.
          </p>

          <button
            onClick={copiarMensaje}
            style={{
              width: '100%',
              padding: '14px 20px',
              fontSize: '13px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              border: '1px solid #111111',
              backgroundColor: copiado ? '#111111' : '#ffffff',
              color: copiado ? '#ffffff' : '#111111',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
            }}
          >
            {copiado ? 'COPIADO' : 'Copiar mensaje'}
          </button>

          <button
            onClick={descargarPDF}
            disabled={descargando}
            style={{
              width: '100%',
              padding: '14px 20px',
              fontSize: '13px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: descargando ? 'not-allowed' : 'pointer',
              border: '1px solid #cccccc',
              backgroundColor: '#ffffff',
              color: '#333333',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              borderRadius: '4px',
              opacity: descargando ? 0.5 : 1,
            }}
          >
            {descargando ? 'DESCARGANDO...' : 'Descargar PDF'}
          </button>

          <button
            onClick={descargarImagen}
            disabled={descargando}
            style={{
              width: '100%',
              padding: '14px 20px',
              fontSize: '13px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: descargando ? 'not-allowed' : 'pointer',
              border: '1px solid #cccccc',
              backgroundColor: '#ffffff',
              color: '#333333',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              borderRadius: '4px',
              opacity: descargando ? 0.5 : 1,
            }}
          >
            {descargando ? 'DESCARGANDO...' : 'Descargar imagen (PNG)'}
          </button>
        </div>
      </div>
    );
  }

  // Pantallas de carga, exito (rechazo) y error
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#eef2f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        maxWidth: '550px',
        width: '100%',
        border: '1px solid #d1d5db',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        borderRadius: '4px',
      }}>
        {/* Header */}
        <div style={{
          padding: '25px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '15px',
        }}>
          <div>
            <Image 
              src="/munsec.png" 
              alt="MUNSEC" 
              width={120}
              height={30}
              style={{ height: '30px', width: 'auto' }}
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: '#666666',
            }}>
              Portal Oficial
            </div>
            <div style={{
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#418FDE',
              marginTop: '4px',
              letterSpacing: '0.5px',
            }}>
              RESOLUCION DE EQUIPO
            </div>
          </div>
        </div>

        <div style={{
          borderBottom: '3px solid #111111',
          margin: '0 20px',
        }}></div>

        <div style={{ padding: '30px 20px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            color: '#888888',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            Tramite de Nombramiento
          </div>
          
          <h1 style={{
            fontFamily: '"Georgia", serif',
            fontSize: '24px',
            color: '#111111',
            marginBottom: '20px',
            lineHeight: '1.2',
            letterSpacing: '-0.5px',
          }}>
            Confirmacion de Participacion
          </h1>
          
          {email && (
            <div style={{
              backgroundColor: '#f8fafc',
              borderLeft: '4px solid #111111',
              padding: '15px',
              marginBottom: '25px',
              wordBreak: 'break-word',
            }}>
              <div style={{
                fontSize: '10px',
                color: '#666666',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '4px',
              }}>
                Credencial asignada a:
              </div>
              <div style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#111111',
                wordBreak: 'break-all',
              }}>
                {email}
              </div>
            </div>
          )}

          {/* Estado: Pendiente */}
          {status === 'pending' && (
            <>
              <p style={{
                fontFamily: '"Georgia", serif',
                fontSize: '15px',
                color: '#333333',
                lineHeight: '1.6',
                marginBottom: '25px',
                textAlign: 'justify',
              }}>
                Para formalizar su integracion al equipo organizador, confirme su participacion a continuacion.
              </p>
              
              <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
              }}>
                <button
                  onClick={() => {
                    setRespuesta('Si');
                    procesarRespuesta(email, 'Si');
                  }}
                  style={{
                    flex: '1',
                    padding: '14px 20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    cursor: 'pointer',
                    border: '1px solid #111111',
                    backgroundColor: '#111111',
                    color: '#ffffff',
                    transition: 'all 0.2s ease',
                    minWidth: '140px',
                    textAlign: 'center',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#333';
                    e.target.style.borderColor = '#333';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#111111';
                    e.target.style.borderColor = '#111111';
                  }}
                >
                  Ratificar Aceptacion
                </button>
                
                <button
                  onClick={() => {
                    setRespuesta('No');
                    procesarRespuesta(email, 'No');
                  }}
                  style={{
                    flex: '1',
                    padding: '14px 20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    cursor: 'pointer',
                    border: '1px solid #cccccc',
                    backgroundColor: 'transparent',
                    color: '#666666',
                    transition: 'all 0.2s ease',
                    minWidth: '140px',
                    textAlign: 'center',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f4f4f4';
                    e.target.style.color = '#111111';
                    e.target.style.borderColor = '#111111';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#666666';
                    e.target.style.borderColor = '#cccccc';
                  }}
                >
                  Declinar Nombramiento
                </button>
              </div>
            </>
          )}

          {/* Estado: Cargando, Exito o Error */}
          {(status === 'loading' || status === 'success' || status === 'error') && (
            <div style={{
              padding: '20px',
              fontSize: '14px',
              lineHeight: '1.5',
              textAlign: 'center',
              wordBreak: 'break-word',
              border: `1px solid ${statusStyle.border}`,
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}>
              {status === 'loading' && 'Procesando su solicitud...'}
              {status === 'success' && (
                <>
                  <strong>Proceso completado.</strong>
                  <br />
                  {getMensajeTexto()}
                </>
              )}
              {status === 'error' && (
                <>
                  <strong>Error de procesamiento.</strong>
                  <br />
                  {getMensajeTexto()}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#eef2f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '4px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        }}>
          <p style={{ color: '#666', fontSize: '16px' }}>Cargando...</p>
        </div>
      </div>
    }>
      <ConfirmacionContent />
    </Suspense>
  );
}