"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Animaciones más lentas y fluidas para un tono más sobrio
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Home() {
  return (
    <div className="overflow-hidden bg-[#F8FAFC]">
      {/* Hero Section - Estilo Documental */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#0F172A]">
        {/* Background Image con tratamiento de imagen "Documental" - CORREGIDO con ruta relativa */}
        <div className="absolute inset-0 z-0">
          <Image
            src="./munsec.jpg" 
            alt="Asamblea MUNSEC" 
            fill
            className="object-cover opacity-40 grayscale-[30%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/80 to-[#0F172A]"></div>
        </div>

        {/* Logo centrado */}
{/* Logo centrado y más grande */}
<motion.div 
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, delay: 0.3 }}
  className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20"
>
  <div className="relative w-16 h-16 md:w-20 md:h-20">
    <Image
      src="./munsec.png"
      alt="MUNSEC Logo"
      fill
      className="object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
    />
  </div>
</motion.div>
        {/* Content - Adaptado para móvil */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="relative z-10 text-center px-6 sm:px-4 max-w-5xl mx-auto w-full"
        >
          <motion.span 
            variants={fadeIn}
            className="text-[#4A90E2] text-[10px] md:text-xs uppercase tracking-[0.5em] mb-6 md:mb-8 block font-semibold"
          >
            Modelo de Naciones Unidas para Secundarios
          </motion.span>
          
          <motion.h1 
            variants={fadeIn}
            className="font-serif text-5xl sm:text-6xl md:text-8xl text-white mb-6 md:mb-8 tracking-tight"
          >
            MUNSEC
          </motion.h1>
          
          <motion.div 
            variants={fadeIn}
            className="w-12 h-[1px] bg-slate-500 mx-auto mb-8 md:mb-10"
          />
          
          <motion.p 
            variants={fadeIn}
            className="text-sm sm:text-base md:text-lg text-slate-300 font-light max-w-3xl mx-auto leading-relaxed px-4 md:px-0 mb-10 md:mb-12"
          >
            Somos el modelo de Naciones Unidas para estudiantes de secundaria en Chile. Un espacio donde jóvenes aprenden sobre diplomacia, política internacional y trabajo en equipo.
          </motion.p>
          
          <motion.div 
            variants={fadeIn}
            className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center px-4 md:px-0"
          >
            <Link href="/about" className="text-white text-xs uppercase tracking-[0.2em] border-b border-[#4A90E2] pb-1 hover:text-[#4A90E2] transition-colors">
              Conoce más
            </Link>
            <Link href="/register" className="bg-[#4A90E2] text-white px-8 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-blue-600 transition-all w-full md:w-auto text-center">
              Inscripciones 2025
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator Minimalista - CORREGIDO: eliminado el bug de línea saltarina */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#4A90E2] to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* About Section - Adaptado para móvil */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container-custom px-6 md:px-4 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="order-2 lg:order-1"
            >
              <span className="text-[#4A90E2] text-[10px] uppercase tracking-[0.4em] font-bold">Quiénes somos</span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-slate-900 mt-4 mb-6 md:mb-8 leading-snug">
                Un espacio para estudiantes <span className="text-[#4A90E2]">secundarios</span>
              </h2>
              <div className="space-y-4 md:space-y-6 text-slate-600 text-sm md:text-base leading-relaxed">
                <p>
                  En MUNSEC creemos que la diplomacia y el debate deberían estar al alcance de todos los jóvenes, sin importar su contexto. Por eso trabajamos especialmente con estudiantes de la educación pública, ofreciéndoles un espacio para desarrollar habilidades que van más allá del aula.
                </p>
                <p>
                  No se trata solo de simular ser diplomáticos por un par de días. Se trata de entender que sus voces importan, que pueden negociar, liderar y proponer soluciones a problemas reales. Eso es lo que hacemos en cada edición.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/about" className="bg-slate-900 text-white px-8 py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-slate-800 transition-all inline-block w-full sm:w-auto text-center">
                  Leer nuestra historia
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative order-1 lg:order-2"
            >
              <div className="aspect-[4/3] border border-slate-100 p-4 relative">
                <Image
                  src="./munsec-debate.jpg" 
                  alt="Debate en MUNSEC" 
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-10 h-[1px] bg-[#4A90E2]"></div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400"></p>
              </div>
              {/* Testimonio - Solo visible en desktop */}
              <div className="absolute -bottom-6 -right-6 bg-[#4A90E2] p-8 max-w-xs hidden lg:block">
                <p className="text-white font-serif text-xl italic">
                  "Lo mejor de MUNSEC es que te das cuenta que puedes hablar y que te escuchen, aunque seas de un liceo público."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Áreas de Trabajo - Adaptado para móvil */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container-custom px-6 md:px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-20"
          >
            <span className="text-[#4A90E2] text-[10px] uppercase tracking-[0.4em] font-bold">Qué ofrecemos</span>
            <h2 className="font-serif text-3xl md:text-4xl text-slate-900 mt-4 italic">Ejes de participación</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-[1px] bg-transparent md:bg-slate-200 border-0 md:border md:border-slate-200">
            {[
              {
                title: 'Debate y Diplomacia',
                desc: 'Aprendes a argumentar, negociar y redactar resoluciones como en la ONU real.'
              },
              {
                title: 'Temas Internacionales',
                desc: 'Desde cambios estructurales hasta derechos humanos, siempre con temas que importan.'
              },
              {
                title: 'Red de Contactos',
                desc: 'Conoces estudiantes de todo Chile con intereses parecidos a los tuyos.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ backgroundColor: '#F8FAFC' }}
                className="bg-white p-8 md:p-12 transition-colors border border-slate-200 md:border-0 mb-4 md:mb-0"
              >
                <span className="text-slate-300 font-serif text-xl mb-4 md:mb-6 block">0{index + 1}</span>
                <h3 className="font-serif text-lg md:text-xl text-slate-900 mb-3 md:mb-4">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final - Adaptado para móvil */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container-custom px-6 md:px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="border border-slate-900 p-8 md:p-20">
              <span className="text-[#4A90E2] text-[10px] uppercase tracking-[0.4em] font-bold mb-4 md:mb-6 block">
                ¿Te interesa?
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-slate-900 mb-6 md:mb-8">
                Súmate a la próxima edición
              </h2>
              <p className="text-slate-600 mb-8 md:mb-12 max-w-xl mx-auto text-sm leading-relaxed px-4 md:px-0">
                Revisa si las inscripciones para MUNSEC están abiertas. Si tienes entre 14 y 18 años y quieres vivir la experiencia, este es tu momento.
              </p>
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-stretch md:items-center px-4 md:px-0">
                <Link href="/register" className="bg-slate-900 text-white px-8 md:px-12 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-slate-800 transition-all w-full md:w-auto text-center">
                  Inscribirme ahora
                </Link>
                <Link href="/contact" className="text-slate-900 text-[10px] uppercase tracking-[0.3em] font-bold border-b border-slate-900 pb-1 hover:text-slate-500 hover:border-slate-500 transition-all text-center md:text-left">
                  Tener más info
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}