"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
};

export default function About() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Hero Section - Optimizado para móvil */}
      <section className="relative h-[90vh] sm:h-[80vh] md:h-[70vh] min-h-[600px] sm:min-h-[500px] flex items-center justify-center bg-[#0F172A] overflow-hidden">
        {/* Background Image - CORREGIDO: añadido fill */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/munsec/munsec-about.jpg" 
            alt="Asamblea MUNSEC" 
            fill
            className="object-cover opacity-90 sm:opacity-100"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/90 to-[#0F172A]/60"></div>
        </div>

        {/* Contenido del Hero - Padding ajustado para móvil */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-5xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white mb-4 sm:mb-6 md:mb-8 leading-tight"
          >
            Iniciativa de <br className="hidden xs:block" />
            <span className="text-[#4A90E2]">formación diplomática</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl mx-auto px-2 sm:px-0"
          >
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 font-light leading-relaxed mb-8 sm:mb-10 md:mb-12">
              MUNSEC opera como una instancia de formación complementaria al currículo escolar, 
              donde los estudiantes secundarios de Chile pueden participar en debates sobre temas de política internacional.
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator - Oculto en móviles muy pequeños */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        >
          <div className="w-[1px] h-12 sm:h-16 bg-gradient-to-b from-[#4A90E2] to-transparent"></div>
        </motion.div>
      </section>

      {/* Origen - Stack vertical en móvil */}
      <section id="origen" className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-16">
            <div className="md:col-span-5">
              <div className="md:sticky md:top-32">
                <span className="text-[#4A90E2] text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-bold block mb-4 sm:mb-6">
                  Origen
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-slate-900 mb-6 sm:mb-8 leading-tight">
                  Iniciativa fundada por estudiantes de la educación pública
                </h2>
                <div className="w-16 sm:w-20 h-[2px] bg-[#4A90E2]"></div>
              </div>
            </div>
            <div className="md:col-span-7 space-y-6 sm:space-y-8 text-slate-600 leading-relaxed">
              <motion.div 
                variants={fadeIn} 
                initial="initial" 
                whileInView="animate" 
                viewport={{ once: true, margin: "-50px" }}
                className="text-base sm:text-lg"
              >
                <p className="mb-4 sm:mb-6">
                  El proyecto nace de la necesidad de contar con espacios de formación en diplomacia y debate accesibles para estudiantes de educación pública. Tras participar en instancias universitarias, un grupo de estudiantes secundarios del <span className="text-slate-900 font-medium">Liceo 1 Javiera Carrera</span> y el <span className="text-slate-900 font-medium">Instituto Nacional</span> identificó la oportunidad de diseñar un modelo propio.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

            {/* Primera Edición - Reemplaza al bloque de CEPAL */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#0F172A] text-white relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-[#4A90E2]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-[#4A90E2]/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div>
              <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 border border-[#4A90E2] text-[#4A90E2] text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold mb-6 sm:mb-8">
                Inicios
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-8 leading-tight">
                Primera edición<br />
                <span className="text-[#4A90E2]">MUNSEC 2025</span>
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6 lg:mb-0">
                Inicialmente concebido con la Universidad de Chile, la primera edición de MUNSEC superó ampliamente las expectativas de convocatoria. Decenas de delegaciones de establecimientos secundarios se inscribieron para participar, consolidando el interés por este espacio de formación diplomática. El modelo se realizó exitosamente en el campus Juan Gómez Milla de la Universidad de Chile, marcando el inicio de un proyecto que continúa expandiéndose.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 sm:p-8 md:p-10 border border-white/10">
              <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider mb-6 sm:mb-8">Hitos 2025</p>
              <ul className="space-y-4 sm:space-y-6">
                {[
                  'Convocatoria abierta a establecimientos públicos y privados',
                  'Participación de decenas de delegaciones',
                  'Modelo realizado en campus Juan Gómez Milla',
                  'Respuesta sorprendente de la comunidad escolar'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base text-slate-300">
                    <span className="text-[#4A90E2] text-lg sm:text-xl font-bold">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Enfoque actual - Cards responsivas */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-[#4A90E2] text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-bold block mb-3 sm:mb-4">
              Proyección
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-slate-900 mb-4 sm:mb-6">
              Expansión del proyecto
            </h2>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg px-4 sm:px-0">
              MUNSEC mantiene su compromiso con la calidad académica y la participación estudiantil, 
              consolidando alianzas que permitan ampliar el alcance de sus actividades.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
            {[
              {
                number: '01',
                title: 'Cobertura nacional',
                desc: 'Participación de establecimientos de diversas regiones y dependencias'
              },
              {
                number: '02',
                title: 'Formación continua',
                desc: 'Capacitación para delegados para el modelo'
              },
              {
                number: '03',
                title: 'Red de egresados',
                desc: 'Nuestros participantes siguen conectados a través de una comunidad activa'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-6 sm:p-8 bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:border-[#4A90E2] hover:shadow-lg transition-all duration-500"
              >
                <span className="text-4xl sm:text-5xl md:text-6xl font-serif text-slate-200 group-hover:text-[#4A90E2]/20 transition-colors absolute top-3 sm:top-4 right-3 sm:right-4">
                  {item.number}
                </span>
                <div className="relative z-10">
                  <h3 className="font-serif text-lg sm:text-xl text-slate-900 mb-2 sm:mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4A90E2] group-hover:w-full transition-all duration-500"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre institucional - Responsive */}
      <section className="pb-16 sm:pb-20 md:pb-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="border-t border-slate-200 pt-12 sm:pt-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-8">
              <div className="w-full sm:w-auto">
                <p className="text-[8px] sm:text-xs uppercase tracking-widest text-slate-400 mb-2">Consultas institucionales</p>
                <Link 
                  href="/contact" 
                  className="text-lg sm:text-xl text-slate-900 border-b-2 border-slate-300 hover:border-[#4A90E2] transition-colors font-serif block sm:inline-block"
                >
                  contacto@munsec.com
                </Link>
              </div>
              
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}