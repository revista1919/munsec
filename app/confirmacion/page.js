"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

// La URL de tu Web App de Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzx9Bhrckyor-_z6mfwp6vG9j0dS_pi7S4I5gMD3_qWTuXOxUUKQNVt0j-4xT7BMQBnPA/exec';

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  
  const [status, setStatus] = useState('loading');
  const [email, setEmail] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const respuestaParam = searchParams.get('respuesta');
    
    if (emailParam) setEmail(emailParam);
    if (respuestaParam) setRespuesta(respuestaParam);
    
    // Si viene con respuesta directa (móvil), procesar automáticamente
    if (emailParam && respuestaParam) {
      procesarRespuesta(emailParam, respuestaParam);
    } else if (emailParam) {
      // Si solo viene email (PC), mostrar botones
      setStatus('pending');
    } else {
      setStatus('error');
      setMensaje('Enlace inválido');
    }
  }, [searchParams]);

  const procesarRespuesta = async (emailParam, respuestaParam) => {
    setStatus('loading');
    
    try {
      // Mismo método que usas en el formulario de suscripción
      const formData = new URLSearchParams();
      formData.append("email", emailParam);
      formData.append("respuesta", respuestaParam);
      
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setMensaje(result.message || 'Error al procesar');
      }
    } catch (error) {
      setStatus('error');
      setMensaje('Error de conexión');
    }
  };

  // Determinar colores según estado y respuesta
  const getStatusStyle = () => {
    switch(status) {
      case 'success':
        return respuesta === 'Si' || respuesta === 'si'
          ? { bg: '#f0f7ff', border: '#418FDE', text: '#003366' }
          : { bg: '#f3f4f6', border: '#d1d5db', text: '#4b5563' };
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
        return respuesta === 'Si' || respuesta === 'si'
          ? 'Su participación ha sido confirmada exitosamente. En breve recibirá las instrucciones correspondientes.'
          : 'Se ha registrado su declinación. Agradecemos su tiempo e interés.';
      case 'error':
        return mensaje || 'No se pudo procesar su solicitud. Por favor intente nuevamente.';
      case 'loading':
        return 'Procesando su solicitud...';
      default:
        return '';
    }
  };

  const statusStyle = getStatusStyle();

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
              RESOLUCIÓN DE EQUIPO
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
            Trámite de Nombramiento
          </div>
          
          <h1 style={{
            fontFamily: '"Georgia", serif',
            fontSize: '24px',
            color: '#111111',
            marginBottom: '20px',
            lineHeight: '1.2',
            letterSpacing: '-0.5px',
          }}>
            Confirmación de Participación
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

          {/* Estado: Pendiente - Mostrar botones */}
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
                Para formalizar su integración al equipo organizador, confirme su participación a continuación.
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
                  Ratificar Aceptación
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

          {/* Estado: Cargando, Éxito o Error */}
          {(status === 'loading' || status === 'success' || status === 'error') && (
            <div style={{
              marginTop: status === 'pending' ? '0' : '0',
              padding: '20px',
              fontSize: '14px',
              lineHeight: '1.5',
              textAlign: 'center',
              wordBreak: 'break-word',
              border: `1px solid ${statusStyle.border}`,
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
            }}>
              {status === 'loading' && 'Procesando su solicitud...'}
              {status === 'success' && (
                <>
                  <strong>
                    {respuesta === 'Si' || respuesta === 'si' 
                      ? 'Confirmación exitosa.' 
                      : 'Proceso completado.'}
                  </strong>
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

// Componente principal con Suspense
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