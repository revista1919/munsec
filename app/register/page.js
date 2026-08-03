"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CONFIG_INSCRIPCION, verificarEstadoInscripciones, obtenerTiempoRestante } from '@/config/inscripcion';

export default function Register() {
  const [estado, setEstado] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Verificar estado inicial
    const estadoInicial = verificarEstadoInscripciones();
    setEstado(estadoInicial);

    // Actualizar tiempo restante cada minuto
    const actualizarTiempo = () => {
      const tiempo = obtenerTiempoRestante();
      setTiempoRestante(tiempo);
    };

    actualizarTiempo();
    const intervalo = setInterval(actualizarTiempo, 60000);

    return () => clearInterval(intervalo);
  }, []);

  // Estado de carga o verificación preliminar
  if (!estado) {
    return (
      <div className="bg-[#F4F6F9] min-h-screen flex items-center justify-center font-sans">
        <div className="text-center p-8 max-w-sm">
          <div className="w-8 h-8 border-2 border-[#009EDB] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Verificando Protocolo de Admisión...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F6F9] min-h-screen text-slate-800 font-sans pb-24">
      {/* Cabecera Institucional */}
      <header className="pt-20 pb-16 bg-white border-b border-slate-200 shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#009EDB]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-slate-500">
              Convocatoria Oficial y Registro
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
                Inscripción de Delegaciones — MUNSEC {CONFIG_INSCRIPCION.año}
              </h1>
              {estado.abiertas && (
                <p className="text-slate-600 text-sm sm:text-base font-normal max-w-2xl leading-relaxed mt-3">
                  Registro formal para representaciones escolares, docentes asesores y delegados titulares que conformarán la Asamblea General y comisiones diplomáticas.
                </p>
              )}
            </div>

            {/* Etiqueta oficial de estado de convocatoria */}
            <div
              className={`inline-flex items-center gap-2.5 px-4 py-2 border text-xs font-semibold uppercase tracking-wider ${
                estado.abiertas
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  estado.abiertas ? 'bg-emerald-600 animate-pulse' : 'bg-slate-500'
                }`}
              />
              {estado.abiertas ? 'Proceso Abierto — Vigente' : 'Convocatoria Cerrada'}
            </div>
          </div>
        </div>
      </header>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          {!estado.abiertas ? (
            /* ================================================================
               PANTALLA DE INSCRIPCIONES CERRADAS O PENDIENTES
            ================================================================ */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="bg-white border border-slate-300 p-8 sm:p-16 text-center shadow-xs">
                <span className="text-xs font-bold uppercase tracking-widest text-[#009EDB] block mb-2">
                  Secretaría General de Admisión
                </span>

                <h2 className="font-serif text-2xl sm:text-4xl text-slate-900 font-bold mb-4">
                  {estado.razon === 'programada'
                    ? 'Apertura de Convocatoria Programada'
                    : estado.razon === 'cerrada_temporal'
                    ? 'Proceso de Registro Finalizado'
                    : 'Convocatoria Oficial Cerrada'}
                </h2>

                <div className="w-16 h-0.5 bg-[#009EDB] mx-auto my-6" />

                <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
                  {estado.mensaje}
                </p>

                {/* Bloque informativo de plazos */}
                {estado.razon === 'programada' && CONFIG_INSCRIPCION.inscripciones.fecha_apertura && (
                  <div className="bg-slate-50 border border-slate-200 p-6 max-w-md mx-auto text-left space-y-1 mb-8">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Apertura de plataforma
                    </span>
                    <p className="text-sm font-semibold text-slate-800 font-mono">
                      {new Date(CONFIG_INSCRIPCION.inscripciones.fecha_apertura).toLocaleDateString('es-CL', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}

                {estado.razon === 'cerrada_temporal' && CONFIG_INSCRIPCION.inscripciones.fecha_cierre && (
                  <div className="bg-slate-50 border border-slate-200 p-6 max-w-md mx-auto text-left space-y-1 mb-8">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Fecha oficial de cierre
                    </span>
                    <p className="text-sm font-semibold text-slate-800 font-mono">
                      {new Date(CONFIG_INSCRIPCION.inscripciones.fecha_cierre).toLocaleDateString('es-CL', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-6">
                  <p className="text-xs uppercase tracking-widest text-slate-500">
                    Mesa de ayuda y acreditaciones: <strong className="text-slate-700">{CONFIG_INSCRIPCION.contact.email}</strong>
                  </p>
                </div>
              </div>

              {/* Ficha técnica resumida del evento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 p-6 shadow-xs">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#009EDB] block mb-1">
                    Fechas Oficiales
                  </span>
                  <h3 className="font-serif text-lg font-bold text-slate-900">{CONFIG_INSCRIPCION.evento.fecha}</h3>
                  <p className="text-xs text-slate-500 mt-1">Sesiones plenarias y debates de comisión.</p>
                </div>

                <div className="bg-white border border-slate-200 p-6 shadow-xs">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#009EDB] block mb-1">
                    Sede Institucional
                  </span>
                  <h3 className="font-serif text-lg font-bold text-slate-900">{CONFIG_INSCRIPCION.evento.lugar}</h3>
                  <p className="text-xs text-slate-500 mt-1">Sede de conferencias oficial.</p>
                </div>

                <div className="bg-white border border-slate-200 p-6 shadow-xs">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#009EDB] block mb-1">
                    Admisibilidad
                  </span>
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    {CONFIG_INSCRIPCION.requisitos.edad.minimo} a {CONFIG_INSCRIPCION.requisitos.edad.maximo} años
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Estudiantes de Enseñanza Media regular.</p>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ================================================================
               PANTALLA DE INSCRIPCIONES ABIERTAS
            ================================================================ */
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              {/* Banner de tiempo restante - Estilo ONU */}
              {tiempoRestante && (
                <div className="bg-slate-900 text-white border-l-4 border-[#009EDB] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#009EDB] block mb-1">
                      Plazo Exclusivo de Registro
                    </span>
                    <h3 className="font-serif text-xl font-bold">
                      Cierre del Registro Institucional de Delegaciones
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Las postulaciones enviadas después de la fecha límite no serán incorporadas al dossier oficial.
                    </p>
                  </div>

                  <div className="bg-slate-800 border border-slate-700 px-6 py-3 text-right">
                    <span className="block text-xs uppercase tracking-wider text-slate-400">Tiempo restante</span>
                    <div className="text-2xl font-mono font-bold text-white tracking-tight">
                      {tiempoRestante.dias} DÍAS — {tiempoRestante.horas} HRS
                    </div>
                  </div>
                </div>
              )}

              {/* Contenedor Principal: Detalle de Comisión y Acceso */}
              <div className="bg-white border border-slate-200 shadow-xs overflow-hidden">
                {/* Cabecera del Documento / Comisión */}
                <div className="bg-slate-50 border-b border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#009EDB] block mb-1">
                      Órgano Principal
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                      Asamblea General (General Assembly)
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500 bg-white border border-slate-300 px-3 py-1.5 self-start sm:self-center">
                    COMISIÓN I — MUNSEC {CONFIG_INSCRIPCION.año}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
                  {/* Columna Izquierda: Aranceles, Plazos y Tópicos */}
                  <aside className="lg:col-span-5 p-6 sm:p-8 space-y-10">
                    {/* Aranceles Oficiales */}
                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 mb-6">
                        Estructura de Aranceles ({CONFIG_INSCRIPCION.año})
                      </h3>

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                            Establecimientos Públicos y Subvencionados
                          </span>
                          <div className="grid grid-cols-2 gap-4 pl-3 border-l-2 border-slate-200">
                            <div>
                              <span className="text-xs text-slate-500 block">Delegado Individual</span>
                              <span className="font-serif text-lg font-bold text-slate-900">
                                ${CONFIG_INSCRIPCION.pago.valores.publico.delegado.toLocaleString('es-CL')} CLP
                              </span>
                            </div>
                            <div>
                              <span className="text-xs text-slate-500 block">Por delegado en Pareja</span>
                              <span className="font-serif text-lg font-bold text-slate-900">
                                ${CONFIG_INSCRIPCION.pago.valores.publico.delegacion.toLocaleString('es-CL')} CLP
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 pt-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                            Establecimientos Particulares Pagados
                          </span>
                          <div className="grid grid-cols-2 gap-4 pl-3 border-l-2 border-slate-200">
                            <div>
                              <span className="text-xs text-slate-500 block">Delegado Individual</span>
                              <span className="font-serif text-lg font-bold text-slate-900">
                                ${CONFIG_INSCRIPCION.pago.valores.privado.delegado.toLocaleString('es-CL')} CLP
                              </span>
                            </div>
                            <div>
                              <span className="text-xs text-slate-500 block">Por delegado en Pareja</span>
                              <span className="font-serif text-lg font-bold text-slate-900">
                                ${CONFIG_INSCRIPCION.pago.valores.privado.delegacion.toLocaleString('es-CL')} CLP
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 italic mt-4">
                        * Los valores contemplan acreditación, materiales oficiales y diploma de participación en la cumbre.
                      </p>
                    </section>

                    {/* Plazos Institucionales */}
                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 mb-4">
                        Calendario y Plazos
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-baseline">
                          <span className="text-slate-500 text-xs">Cierre de inscripciones</span>
                          <span className="font-semibold text-slate-900 font-mono text-xs">
                            {CONFIG_INSCRIPCION.inscripciones.fecha_cierre
                              ? new Date(CONFIG_INSCRIPCION.inscripciones.fecha_cierre).toLocaleDateString('es-CL', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                })
                              : 'Por confirmar'}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-slate-500 text-xs">Asignación de Estados</span>
                          <span className="font-semibold text-slate-900 text-xs">
                            72 hrs hábiles posverificación
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-slate-500 text-xs">Fecha de Sesiones</span>
                          <span className="font-semibold text-slate-900 text-xs">
                            {CONFIG_INSCRIPCION.evento.fecha}
                          </span>
                        </div>
                      </div>
                    </section>

                    {/* Tópicos a Debatir */}
                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 mb-4">
                        Tópicos en Agenda
                      </h3>
                      <ul className="space-y-2 text-sm text-slate-700">
                        {CONFIG_INSCRIPCION.comisiones[0].topicos.map((topico, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#009EDB] mt-1.5 shrink-0" />
                            <span className="leading-snug">{topico}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* Países / Estados */}
                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 mb-4">
                        Estados Miembros Disponibles
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {CONFIG_INSCRIPCION.comisiones[0].paises_disponibles.map((pais, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5"
                          >
                            {pais}
                          </span>
                        ))}
                      </div>
                    </section>
                  </aside>

                  {/* Columna Derecha: Acceso Directo al Formulario y Normas */}
                  <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-12 flex flex-col justify-between">
                    <div className="max-w-md mx-auto text-center my-auto py-12">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#009EDB] block mb-2">
                        Plataforma Oficial de Registro
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                        Acreditación de Delegaciones y Docentes
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-8">
                        Acceda al portal seguro para completar la ficha de su institución escolar, inscribir al profesor titular a cargo y declarar las preferencias de Estado para cada estudiante.
                      </p>

                      {/* Botón Principal - Estilo ONU */}
                      <Link
                        href="/register/formulario"
                        target="_blank"
                        className="w-full sm:w-auto inline-block bg-[#009EDB] text-white font-semibold text-sm px-10 py-4 hover:bg-[#0072CE] transition-colors shadow-xs"
                      >
                        Comenzar Formulario de Inscripción
                      </Link>

                      <p className="text-[11px] text-slate-400 mt-3">
                        El formulario se abrirá en una ventana externa para facilitar el adjunto de comprobantes.
                      </p>
                    </div>

                    {/* Nota Legal Inferior */}
                    <div className="border-t border-slate-200 pt-6 text-left">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                        Acuerdo de Compromiso Diplomático
                      </span>
                      <p className="text-xs text-slate-500 leading-normal">
                        La inscripción compromete a la institución participante al cumplimiento riguroso de los horarios de debate, el protocolo de vestimenta formal y los reglamentos internos sancionados por la Secretaría General de MUNSEC {CONFIG_INSCRIPCION.año}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel de Requisitos Institucionales */}
              <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-xs">
                <div className="border-b border-slate-200 pb-4 mb-6">
                  <span className="text-xs font-semibold tracking-widest uppercase text-[#009EDB]">
                    Resolución de Admisibilidad
                  </span>
                  <h3 className="font-serif text-xl font-bold text-slate-900 mt-0.5">
                    Requisitos Obligatorios para Delegaciones y Colegios
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="border-l-2 border-[#009EDB] pl-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-1">
                      1. Rango de Edad Estudiantil
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Los delegados deben cursar Enseñanza Media y tener entre{' '}
                      <strong className="text-slate-800">{CONFIG_INSCRIPCION.requisitos.edad.minimo}</strong> y{' '}
                      <strong className="text-slate-800">{CONFIG_INSCRIPCION.requisitos.edad.maximo} años</strong> cumplidos al inicio del certamen.
                    </p>
                  </div>

                  <div className="border-l-2 border-[#009EDB] pl-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-1">
                      2. Docente Asesor Titular
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Cada delegación debe registrar al menos un profesor responsable o directivo que la acompañe durante las jornadas oficiales en la sede del evento.
                    </p>
                  </div>

                  <div className="border-l-2 border-[#009EDB] pl-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-1">
                      3. Comprobante y Transferencia
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      El registro sólo será verificado y liberado tras cargar digitalmente en el formulario el recibo bancario por la cuota completa de los delegados inscritos.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}