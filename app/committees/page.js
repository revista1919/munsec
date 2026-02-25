"use client";

import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export default function Committees() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-32">
      {/* Header */}
      <header className="pt-32 pb-20 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <span className="text-[#4A90E2] text-[10px] uppercase tracking-[0.5em] font-bold block mb-4">
            Marco
          </span>
          <h1 className="font-serif text-5xl text-slate-900 mb-6">Órganos y Comités</h1>
          <p className="text-slate-500 font-light max-w-2xl leading-relaxed text-sm">
            La arquitectura de MUNSEC se divide en dos estamentos principales. Cada uno responde a protocolos de debate distintos, ajustándose a la naturaleza de los conflictos que abordan.
          </p>
        </div>
      </header>

      {/* Detalle de Comités */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-5xl space-y-32">
          
          {/* ASAMBLEA GENERAL */}
          <motion.div 
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-12 gap-12 items-start"
          >
            <div className="md:col-span-5">
              <div className="aspect-square bg-slate-200 relative overflow-hidden group">
                {/* Imagen Asamblea General */}
                <img 
                  src="https://st4.depositphotos.com/1005647/24727/i/450/depositphotos_247273236-stock-photo-new-york-usa-feb-2019.jpg"
                  alt="Asamblea General de la ONU - Nueva York"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                
                {/* Atribución de imagen - Depositphotos */}
                <div className="absolute bottom-3 left-3 text-white/70 text-[8px] tracking-wider">
                  © Depositphotos.com / 247273236
                </div>
                
                
              </div>
            </div>
            <div className="md:col-span-7">
              <span className="text-[#4A90E2] text-[10px] uppercase tracking-[0.4em] font-bold block mb-4">Órgano Legislativo</span>
              <h2 className="font-serif text-3xl text-slate-900 mb-6">Asambleas Generales</h2>
              <div className="space-y-6 text-slate-600 text-sm leading-relaxed font-light">
                <p>
                  Representa el pilar de debate multilateral de MUNSEC. En esta instancia, las delegaciones trabajan en bloques extensos para abordar tópicos de carácter social, humanitario y jurídico.
                </p>
                <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-6">
                  <div>
                    <h4 className="text-slate-900 font-medium mb-2 text-xs uppercase tracking-wider">Protocolo</h4>
                    <p>Debate parlamentario formal, redacción de resoluciones conjuntas y votación mayoritaria.</p>
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-medium mb-2 text-xs uppercase tracking-wider">Participación</h4>
                    <p>Abierto a delegaciones de todos los establecimientos.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CONSEJO DE SEGURIDAD */}
          <motion.div 
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-12 gap-12 items-start"
          >
            <div className="md:col-span-7 order-2 md:order-1">
              <span className="text-red-500 text-[10px] uppercase tracking-[0.4em] font-bold block mb-4">Órgano Ejecutivo</span>
              <h2 className="font-serif text-3xl text-slate-900 mb-6">Consejos de Seguridad</h2>
              <div className="space-y-6 text-slate-600 text-sm leading-relaxed font-light">
                <p>
                  Instancia de alta complejidad técnica encargada del mantenimiento de la paz y seguridad internacional. Este comité opera bajo una dinámica de crisis en tiempo real, exigiendo respuestas inmediatas a conflictos geopolíticos.
                </p>
                <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-6">
                  <div>
                    <h4 className="text-slate-900 font-medium mb-2 text-xs uppercase tracking-wider">Naturaleza</h4>
                    <p>Resoluciones vinculantes y manejo de crisis imprevisibles durante la sesión.</p>
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-medium mb-2 text-xs uppercase tracking-wider">Cupos</h4>
                    <p>Limitados por la estructura oficial de la ONU (Miembros Permanentes y No Permanentes).</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-5 order-1 md:order-2">
              <div className="aspect-square bg-[#0F172A] relative overflow-hidden group">
                {/* Imagen Consejo de Seguridad */}
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c6/Dmitry_Medvedev_in_the_United_States_24_September_2009-8.jpg"
                  alt="Consejo de Seguridad de la ONU - Dmitry Medvedev en Estados Unidos, 24 Septiembre 2009"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                
                {/* Atribución de imagen - Wikimedia Commons (estilo minimalista) */}
                <div className="absolute bottom-3 left-3 text-white/50 text-[7px] tracking-wider">
                  Kremlin.ru · CC BY 4.0 · Wikimedia
                </div>
              
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Footer info - FÁCIL DE EDITAR */}
      <section className="container mx-auto px-6 max-w-5xl mt-20">
        <div className="bg-white border border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-400 tracking-wide">
            {/* EDITAR AQUÍ - Texto del PDF */}
            Para conocer los tópicos específicos de este año, consulte el documento oficial.
          </p>
          <a 
            href="/pdf/guia-modelo-2025.pdf" // EDITAR AQUÍ - Ruta del PDF
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-slate-900 pb-1 hover:text-slate-600 hover:border-slate-600 transition-colors"
          >
            Descargar PDF
          </a>
        </div>
        
        {/* Atribuciones completas (opcional - muy sutil) */}
        <div className="mt-4 text-center text-[6px] text-slate-300 uppercase tracking-widest">
          <span>Imágenes: Depositphotos (247273236) • Kremlin.ru / Wikimedia (CC BY 4.0)</span>
        </div>
      </section>
    </div>
  );
}