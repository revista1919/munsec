"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Users, School, ScrollText, HeartPulse } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export default function About() {
  const [scrolled, setScrolled] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const impactMetrics = [
    {
      icon: Users,
      value: '+100',
      description: `Participantes en la edición ${currentYear}`
    },
    {
      icon: School,
      value: '+20',
      description: 'Participación de colegios, 9 de ellos públicos.'
    },
    {
      icon: ScrollText,
      value: '+50',
      description: 'Delegaciones en AG'
    },
    {
      icon: HeartPulse,
      value: '+60',
      description: 'Voluntarios en la organización'
    }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] sm:h-[70vh] md:h-[60vh] min-h-[500px] flex items-center justify-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/munsec-about.jpg" 
            alt="Asamblea MUNSEC" 
            fill
            className="object-cover opacity-80 sm:opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-[#0F172A]/40"></div>
        </div>

        <div className="relative z-10 container-custom text-center">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-3xl mx-auto px-4 sm:px-0"
          >
            <p className="text-base sm:text-lg md:text-xl text-slate-200 font-light leading-relaxed mb-12">
              MUNSEC opera como una instancia de formación complementaria al currículo escolar, 
              donde los estudiantes secundarios de Chile pueden participar en debates sobre temas de política internacional.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden sm:block">
          <div className="w-[1px] h-14 bg-gradient-to-b from-[#009EDB] to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* 1. ¿Quiénes Somos? */}
      <section id="quienes-somos" className="py-20 sm:py-24 md:py-32 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-start">
            
            <div className="md:col-span-6 space-y-8">
              <span className="section-subtitle block">
                1. ¿Quiénes Somos?
              </span>
              
              <div className="text-slate-700 leading-relaxed space-y-6 text-base sm:text-lg">
                <p>
                  <span className="text-slate-900 font-semibold">MUNSEC</span> es un modelo de Naciones Unidas organizado por estudiantes del <span className="text-slate-900 font-medium">Liceo N.1 Javiera Carrera</span> y del <span className="text-slate-900 font-medium">Instituto Nacional</span>.
                </p>
                <p>
                  Buscamos formar liderazgos juveniles, promover el pensamiento crítico y fortalecer la participación ciudadana a través del diálogo, la negociación y la cooperación internacional.
                </p>
              </div>
              
            </div>

            <div className="md:col-span-6">
              <div className="aspect-[4/3] relative bg-slate-100 shadow-xl overflow-hidden">
                <Image
                  src="/students-voting-placeholder.jpg"
                  alt="Estudiantes participando en la votación de la asamblea MUNSEC"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primera Edición / Inicios */}
      <section className="py-20 sm:py-24 bg-[#0F172A] text-white relative overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#009EDB]/5 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#009EDB]/5 rounded-full blur-3xl opacity-60"></div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="space-y-6">
              <span className="section-subtitle block">
                Inicios
              </span>
              <h2 className="section-title text-white">
                Primera edición<br />
                <span className="text-[#009EDB]">MUNSEC 2025</span>
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Inicialmente concebido con la Universidad de Chile, la primera edición de MUNSEC superó ampliamente las expectativas de convocatoria. Decenas de delegaciones de establecimientos secundarios se inscribieron para participar, consolidando el interés por este espacio de formación diplomática. El modelo se realizó exitosamente en el campus Juan Gómez Milla de la Universidad de Chile, marcando el inicio de un proyecto que continúa expandiéndose.
              </p>
            </div>
            
            <div className="card-oficial bg-white/5 backdrop-blur-sm border-white/10 p-8 sm:p-10 shadow-2xl">
              <p className="text-sm text-slate-400 uppercase tracking-widest mb-10">Hitos 2025</p>
              <ul className="space-y-6">
                {[
                  'Convocatoria abierta a establecimientos públicos y privados',
                  'Participación de decenas de delegaciones',
                  'Modelo realizado en campus Juan Gómez Milla',
                  'Respuesta sorprendente de la comunidad escolar'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm sm:text-base text-slate-200">
                    <span className="w-6 h-[1.5px] bg-[#009EDB]"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Nuestro Impacto */}
      <section id="impacto" className="py-24 sm:py-32 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <span className="section-subtitle block text-center mb-4">
              2. Nuestro Impacto
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-20 sm:mb-24">
            {impactMetrics.map((metric, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-oficial text-center hover:border-[#009EDB] group"
              >
                <div className="flex justify-center mb-8">
                  <metric.icon className="w-12 h-12 text-[#009EDB] group-hover:scale-110 transition-transform duration-300" strokeWidth={1} />
                </div>
                <div className="text-5xl sm:text-6xl font-extrabold text-slate-900 mb-4 tracking-tighter">
                  {metric.value}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed px-2">
                  {metric.description}
                </p>
                <div className="w-16 h-[2px] bg-[#009EDB]/30 mx-auto mt-8 group-hover:bg-[#009EDB]/60 transition-colors"></div>
              </motion.div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-0">
            <div className="bg-[#FAF8F4] p-10 sm:p-12 border-l-4 border-[#009EDB] shadow-xl relative">
              <span className="text-9xl font-serif text-[#009EDB]/10 absolute -top-8 -left-2">&ldquo;</span>
              <p className="text-slate-800 text-lg sm:text-xl font-light leading-relaxed relative z-10 italic">
                &laquo;MUNSEC es una oportunidad para decirle a Chile que la educación pública no está muerta. Sigue viva en cada estudiante que, con esfuerzo y sueños grandes, demuestra que la calidad educativa no debería depender de la capacidad de pago de una familia. Sino del derecho a aprender y desarrollarse plenamente&raquo;.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proyección / Expansión */}
      <section className="py-20 sm:py-24 md:py-32 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
            <span className="section-subtitle block text-center">
              Proyección
            </span>
            <h2 className="section-title">
              Expansión del proyecto
            </h2>
            <p className="text-slate-600 text-base sm:text-lg md:text-xl px-4 sm:px-0 font-light">
              MUNSEC mantiene su compromiso con la calidad académica y la participación estudiantil, 
              consolidando alianzas que permitan ampliar el alcance de sus actividades.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2 sm:px-0">
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
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-oficial relative group hover:border-[#009EDB]"
              >
                <span className="text-6xl sm:text-7xl font-extrabold text-slate-100 group-hover:text-[#009EDB]/10 transition-colors absolute top-6 right-6 tracking-tighter">
                  {item.number}
                </span>
                <div className="relative z-10 pt-6">
                  <h3 className="font-semibold text-xl sm:text-2xl text-slate-900 mb-3 tracking-tight">{item.title}</h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-[#009EDB] group-hover:w-full transition-all duration-500"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre institucional */}
      <section className="pb-24 sm:pb-32 bg-white">
        <div className="container-custom">
          <div className="border-t border-slate-100 pt-16 sm:pt-20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-8 sm:gap-12">
              <div className="text-center sm:text-left">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-3 font-semibold">Consultas institucionales</p>
                <Link 
                  href="/contact" 
                  className="text-lg sm:text-xl md:text-2xl text-slate-900 font-semibold border-b-2 border-slate-200 hover:border-[#009EDB] transition-colors tracking-tight"
                >
                  contacto@munsec.org
                </Link>
              </div>
              
              <Link href="/contact" className="btn-navy">
                Contáctanos ahora
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}