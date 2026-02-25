"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
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

                {/* Correo de contacto estático */}
                <div className="mt-12 pt-6 border-t border-slate-100">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold block mb-2">
                    Enviar correspondencia a
                  </span>
                  <a 
                    href={`mailto:${CONTACT_EMAIL}`} 
                    className="text-lg text-slate-900 font-light hover:text-[#4A90E2] transition-colors break-all"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  <p className="text-[10px] text-slate-400 mt-2 tracking-wide">
                    * Para asuntos específicos, selecciona el propósito que mejor describa tu consulta.
                  </p>
                </div>
              </div>

              {/* Formulario de contacto simulado / Información adicional */}
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

      {/* Sección de nota adicional */}
      
    </div>
  );
}