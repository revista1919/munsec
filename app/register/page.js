"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CONFIG_INSCRIPCION, verificarEstadoInscripciones, obtenerTiempoRestante } from '@/config/inscripcion';

export default function Register() {
  const [estado, setEstado] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(null);

  useEffect(() => {
    const estadoInicial = verificarEstadoInscripciones();
    setEstado(estadoInicial);

    const actualizarTiempo = () => {
      const tiempo = obtenerTiempoRestante();
      setTiempoRestante(tiempo);
    };

    actualizarTiempo();
    const intervalo = setInterval(actualizarTiempo, 60000);

    return () => clearInterval(intervalo);
  }, []);

  if (!estado) {
    return (
      <div className="bg-[#F5F7FA] min-h-screen flex items-center justify-center font-sans">
        <div className="text-center p-8 max-w-sm">
          <div className="w-8 h-8 border-2 border-[#003366] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Cargando información...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F7FA] min-h-screen text-slate-800 font-sans pb-24 selection:bg-[#418FDE] selection:text-white">
      
      {/* BARRA SUPERIOR INSTITUCIONAL */}
      <div className="h-1.5 w-full bg-[#003366]" />

      {/* CABECERA OFICIAL */}
      <header className="bg-white border-b border-slate-200 shadow-sm pt-12 pb-10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-12 h-12 shrink-0">
                  <img
                    src="/munsec.png"
                    alt="Logo MUNSEC"
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.src = 'https://www.munsec.org/munsec.png'; }}
                  />
                </div>
                <div className="border-l border-slate-300 pl-5">
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#003366] block mb-1">
                    MUNSEC {CONFIG_INSCRIPCION.año}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                    Lugar: {CONFIG_INSCRIPCION.evento.lugar} | Fechas: {CONFIG_INSCRIPCION.evento.fecha}
                  </span>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#003366] tracking-tight leading-tight">
                Postula tu Delegación<br/>a MUNSEC {CONFIG_INSCRIPCION.año}
              </h1>
            </div>

            {/* Etiqueta de Estado */}
            <div className="flex-shrink-0">
              <div className={`inline-flex items-center gap-3 px-5 py-3 border rounded-sm text-[11px] font-bold uppercase tracking-widest ${
                estado.abiertas
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <span className={`w-2 h-2 rounded-full ${estado.abiertas ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                {estado.abiertas ? 'Postulaciones Abiertas' : 'Postulaciones Cerradas'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-12">
        {!estado.abiertas ? (
          /* ================================================================
             ESTADO: CERRADO / PROGRAMADO
          ================================================================ */
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-10 sm:p-16 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-300" />
              
              <div className="text-center mb-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#418FDE] block mb-4">
                  Aviso Importante
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#003366] font-semibold mb-6">
                  {estado.razon === 'programada'
                    ? 'Las postulaciones aún no abren'
                    : estado.razon === 'cerrada_temporal'
                    ? 'Las postulaciones están cerradas por ahora'
                    : 'Las postulaciones están cerradas'}
                </h2>
                <div className="w-12 h-px bg-[#003366] mx-auto mb-8" />
                <p className="text-slate-700 text-sm sm:text-base font-serif max-w-2xl mx-auto leading-relaxed">
                  {estado.mensaje}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
                {estado.razon === 'programada' && CONFIG_INSCRIPCION.inscripciones.fecha_apertura && (
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-sm">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                      Abren el
                    </span>
                    <p className="text-sm font-mono font-semibold text-[#003366]">
                      {new Date(CONFIG_INSCRIPCION.inscripciones.fecha_apertura).toLocaleDateString('es-CL', {
                        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
                {estado.razon === 'cerrada_temporal' && CONFIG_INSCRIPCION.inscripciones.fecha_cierre && (
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-sm">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                      Cerraron el
                    </span>
                    <p className="text-sm font-mono font-semibold text-[#003366]">
                      {new Date(CONFIG_INSCRIPCION.inscripciones.fecha_cierre).toLocaleDateString('es-CL', {
                        day: '2-digit', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                    ¿Dudas? Escríbenos
                  </span>
                  <p className="text-sm font-mono font-semibold text-[#003366]">
                    {CONFIG_INSCRIPCION.contact.email}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-10">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center mb-6">Información del Evento</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                  <div className="pt-4 sm:pt-0">
                    <span className="block text-[11px] font-semibold text-slate-800 mb-1">Fechas</span>
                    <span className="block text-xs text-slate-500">{CONFIG_INSCRIPCION.evento.fecha}</span>
                  </div>
                  <div className="pt-4 sm:pt-0">
                    <span className="block text-[11px] font-semibold text-slate-800 mb-1">Lugar</span>
                    <span className="block text-xs text-slate-500">CEPAL, Santiago</span>
                  </div>
                  <div className="pt-4 sm:pt-0">
                    <span className="block text-[11px] font-semibold text-slate-800 mb-1">Edades</span>
                    <span className="block text-xs text-slate-500">Estudiantes de {CONFIG_INSCRIPCION.requisitos.edad.minimo} a {CONFIG_INSCRIPCION.requisitos.edad.maximo} años</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ================================================================
             ESTADO: ABIERTO
          ================================================================ */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            {/* Ticker de Tiempo Restante */}
            {tiempoRestante && (
              <div className="bg-white border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#003366]/5 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#003366]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#418FDE] block mb-0.5">
                      Tiempo para postular
                    </span>
                    <p className="text-xs font-serif text-slate-600">
                      Las postulaciones fuera de plazo no serán consideradas.
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-sm flex gap-4 text-center min-w-[200px] justify-center">
                  <div>
                    <span className="block font-mono text-xl font-bold text-[#003366] leading-none mb-1">{tiempoRestante.dias}</span>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Días</span>
                  </div>
                  <span className="text-[#003366] font-mono text-xl opacity-30">:</span>
                  <div>
                    <span className="block font-mono text-xl font-bold text-[#003366] leading-none mb-1">{tiempoRestante.horas}</span>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Hrs</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* COLUMNA IZQUIERDA */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Cuadro Informativo */}
                <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-8 py-5 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Cómo funciona la postulación</span>
                    <span className="text-[10px] font-mono text-slate-400">MUNSEC {CONFIG_INSCRIPCION.año}</span>
                  </div>
                  
                  <div className="p-8 space-y-10">
                    
                    {/* Sección 1: Pasos */}
                    <section>
                      <h3 className="font-serif text-lg font-semibold text-[#003366] mb-4">Pasos del proceso</h3>
                      <p className="text-sm text-slate-700 font-serif leading-relaxed mb-6">
                        Este formulario es el único medio oficial para postular. <strong>Postular no asegura tu cupo y no debes pagar nada en esta etapa.</strong>
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="w-6 h-6 border border-[#003366] text-[#003366] flex items-center justify-center text-[10px] font-bold font-mono shrink-0 mt-0.5">01</div>
                          <div>
                            <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Completa el formulario</span>
                            <p className="text-xs text-slate-600 leading-relaxed">Ingresa los datos de tu colegio, del profesor a cargo y de tus delegados.</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-6 h-6 border border-[#003366] text-[#003366] flex items-center justify-center text-[10px] font-bold font-mono shrink-0 mt-0.5">02</div>
                          <div>
                            <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Revisamos tu postulación</span>
                            <p className="text-xs text-slate-600 leading-relaxed">El equipo de MUNSEC evalúa las postulaciones según los requisitos y los cupos disponibles.</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-6 h-6 border border-[#003366] text-[#003366] flex items-center justify-center text-[10px] font-bold font-mono shrink-0 mt-0.5">03</div>
                          <div>
                            <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Te avisamos si quedaste seleccionado</span>
                            <p className="text-xs text-slate-600 leading-relaxed">Si quedas seleccionado, te enviaremos un correo con un link para completar tu inscripción y pagar.</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* Sección 2: Precios */}
                    <section>
                      <h3 className="font-serif text-lg font-semibold text-[#003366] mb-4">Precios de inscripción</h3>
                      <p className="text-[11px] text-slate-500 italic mb-5">Solo se paga si quedas seleccionado. Por ahora no debes pagar nada.</p>
                      
                      <div className="grid grid-cols-2 gap-5">
                        <div className="bg-slate-50 p-5 border border-slate-200">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Estudiantes de Chile</span>
                          <span className="font-serif text-2xl font-bold text-[#003366] block mb-1">
                            ${CONFIG_INSCRIPCION.pago.valores.nacional.delegado.toLocaleString('es-CL')}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-slate-500">CLP por delegación (1 o 2 estudiantes)</span>
                        </div>
                        <div className="bg-slate-50 p-5 border border-slate-200">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Estudiantes extranjeros</span>
                          <span className="font-serif text-2xl font-bold text-[#003366] block mb-1">
                            US${CONFIG_INSCRIPCION.pago.valores.extranjero.delegado}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-slate-500">USD por delegación (1 o 2 estudiantes)</span>
                        </div>
                      </div>
                    </section>

                  </div>
                </div>

                {/* Requisitos y Tópicos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-sm">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#003366] mb-4 border-b border-slate-100 pb-2">Requisitos para participar</h3>
                    <ul className="space-y-3 text-xs text-slate-700">
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 bg-[#418FDE] shrink-0 mt-1.5" />
                        <span>Tener entre {CONFIG_INSCRIPCION.requisitos.edad.minimo} y {CONFIG_INSCRIPCION.requisitos.edad.maximo} años al inicio del evento.</span>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 bg-[#418FDE] shrink-0 mt-1.5" />
                        <span>Contar con un profesor o directivo que acompañe a la delegación.</span>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 bg-[#418FDE] shrink-0 mt-1.5" />
                        <span>Vestimenta formal durante el evento (occidental o tradicional del país representado).</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-sm">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#003366] mb-4 border-b border-slate-100 pb-2">Temas a debatir</h3>
                    <ul className="space-y-3 text-xs text-slate-700 font-serif">
                      {CONFIG_INSCRIPCION.comisiones[0].topicos.map((topico, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="font-bold text-[#003366] shrink-0">{i+1}.</span>
                          <span className="leading-snug">{topico}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

              {/* COLUMNA DERECHA */}
              <div className="lg:col-span-5 sticky top-32">
                <div className="bg-[#003366] p-1 shadow-md rounded-sm">
                  <div className="bg-white p-8 sm:p-10 border border-[#003366]/20">
                    <div className="text-center mb-8">
                      <div className="w-12 h-12 mx-auto mb-4 text-[#003366] opacity-90">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-slate-900 mb-3">Formulario de Postulación</h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-serif">
                        Completa los datos de tu colegio y tus delegados. El formulario se guarda solo mientras avanzas.
                      </p>
                    </div>

                    <Link
                      href="/register/formulario"
                      className="group relative w-full flex justify-center items-center gap-3 bg-[#003366] text-white font-bold text-xs uppercase tracking-widest px-6 py-4 hover:bg-[#002244] transition-all rounded-sm overflow-hidden"
                    >
                      <span className="relative z-10">Ir al Formulario</span>
                      <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                      </svg>
                      <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    </Link>

                    <div className="mt-6 p-4 bg-slate-50 border border-slate-200">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider text-center font-semibold">
                        Importante
                      </p>
                      <p className="text-xs text-slate-600 mt-2 text-center leading-relaxed font-serif">
                        No debes pagar nada ahora. Solo pagas si quedas seleccionado.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400">
                    Fecha límite para postular
                  </p>
                  <p className="text-xs font-mono text-slate-600 mt-1">
                    {CONFIG_INSCRIPCION.inscripciones.fecha_cierre 
                      ? new Date(CONFIG_INSCRIPCION.inscripciones.fecha_cierre).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' }) 
                      : 'Por confirmar'}
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
