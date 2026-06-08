"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { useState } from 'react';

// --- ANIMACIONES ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

// --- CONFIGURACIÓN DE JERARQUÍAS VISUALES ---
const rankStyles = {
  founder: {
    height: "h-[380px] sm:h-[460px]",
    maxWidth: "max-w-[320px]",
    nameText: "text-2xl sm:text-3xl font-serif text-slate-900",
    roleText: "text-[#418FDE] text-[10px] tracking-[0.3em] font-bold",
    accentLine: "bg-[#418FDE]",
    hoverLineWidth: "w-16"
  },
  committee: {
    height: "h-[300px] sm:h-[360px]",
    maxWidth: "max-w-[280px]",
    nameText: "text-xl sm:text-2xl font-serif text-slate-800",
    roleText: "text-slate-500 text-[9px] tracking-[0.25em] font-bold",
    accentLine: "bg-slate-800",
    hoverLineWidth: "w-12"
  },
  collaborator: {
    height: "h-[240px] sm:h-[280px]",
    maxWidth: "max-w-[220px]",
    nameText: "text-lg sm:text-xl font-serif text-slate-700",
    roleText: "text-slate-400 text-[8px] tracking-[0.2em] font-semibold",
    accentLine: "bg-slate-400",
    hoverLineWidth: "w-8"
  }
};

// --- COMPONENTE DE MIEMBRO ---
const TeamMember = ({ name, role, rank = "collaborator", index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [imgError, setImgError] = useState(false);
  
  const imageSrc = imgError
  ? `https://via.placeholder.com/600x800`
  : `/team/${name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/ /g, "-")}.jpg`;

  const style = rankStyles[rank];

  return (
    <motion.div 
      ref={ref}
      variants={fadeInUp}
      className={`group relative w-full mx-auto ${style.maxWidth}`}
    >
      <div className={`w-full ${style.height} bg-slate-100 overflow-hidden mb-5 border border-slate-200 relative shadow-sm transition-shadow duration-500 group-hover:shadow-md`}>
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full h-full relative"
        >
          <Image 
            src={imageSrc}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            onError={() => setImgError(true)}
          />
        </motion.div>
        {/* Capa de tinte azul diplomático al pasar el hover */}
        <div className="absolute inset-0 bg-[#418FDE]/0 group-hover:bg-[#418FDE]/10 transition-colors duration-700 pointer-events-none" />
      </div>

      <motion.div className="space-y-2 text-center">
        <span className={`${style.roleText} uppercase block`}>
          {role}
        </span>
        <h3 className={`${style.nameText} transition-colors duration-300 leading-tight`}>
          {name}
        </h3>
        <motion.div 
          className={`h-[1px] mx-auto transition-all duration-700 ${style.accentLine}`}
          initial={{ width: "20px" }}
          whileHover={{ width: style.hoverLineWidth.replace('w-', '') + 'rem' }} // Truco visual para expandir la línea
        />
      </motion.div>
    </motion.div>
  );
};

// --- DATA ---
const founders = [
  { name: "Anastacia Díaz", role: "Órgano Fundador" },
  { name: "Rafaela Pérez", role: "Órgano Fundador" },
  { name: "Camilo Jiménez", role: "Órgano Fundador" },
  { name: "Emilia Barría", role: "Órgano Fundador" },
  { name: "Trinidad Elgueta", role: "Órgano Fundador" }
];

const committee = [
  { name: "Anastacia Díaz", role: "Directiva Administrativa" },
  { name: "Camilo Jiménez", role: "Directiva Administrativa" },
  { name: "Emilia Barría", role: "Directiva Administrativa" },
  { name: "Rafaela Pérez", role: "Directiva Administrativa" }
];

const collaborators = [
  { name: "Javier Vergara", role: "Cuerpo de Colaboradores" },
  { name: "Karen Briceño", role: "Cuerpo de Colaboradores" },
  { name: "Matías Valdez", role: "Cuerpo de Colaboradores" },
  { name: "Laura", role: "Cuerpo de Colaboradores" }
];

// --- VISTA PRINCIPAL ---
export default function Team() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="bg-[#FCFDFD] min-h-screen overflow-x-hidden selection:bg-[#418FDE] selection:text-white">
      
      {/* Título Oficial (Estilo Resolución ONU) */}
      <motion.header 
        ref={heroRef}
        className="pt-24 sm:pt-36 pb-16 sm:pb-20 border-b border-slate-200 bg-white"
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl text-center">
          <motion.div 
            className="w-16 h-[2px] bg-[#418FDE] mx-auto mb-8"
            initial={{ width: 0 }}
            animate={heroInView ? { width: 64 } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.h1 
            className="font-serif text-4xl sm:text-5xl md:text-6xl text-slate-900 leading-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Cuerpo Organizador
          </motion.h1>
          <motion.p
            className="text-slate-500 font-serif italic text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            "Estructura delegada para la administración, fomento y desarrollo de nuestras comisiones operativas."
          </motion.p>
        </div>
      </motion.header>

      {/* Rango 1: Fundadores (Gran Escala) */}
      <section className="py-24 sm:py-32 relative bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="text-center mb-16 sm:mb-24">
           
            <h3 className="font-serif text-3xl sm:text-4xl text-slate-900">Fundadores</h3>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-wrap justify-center gap-8 sm:gap-12"
          >
            {founders.map((member, i) => (
              <div key={i} className="w-full sm:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2.5rem)] xl:w-[calc(20%-2rem)]">
                <TeamMember {...member} rank="founder" index={i} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Rango 2: Comité Administrativo (Escala Media) */}
      <section className="py-20 sm:py-28 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-14 sm:mb-20">
            <h3 className="font-serif text-2xl sm:text-3xl text-slate-900">Comité Administrativo</h3>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-wrap justify-center gap-8 sm:gap-12 lg:gap-16"
          >
            {committee.map((member, i) => (
              <div key={i} className="w-full sm:w-[calc(50%-2rem)] md:w-[calc(25%-2rem)]">
                <TeamMember {...member} rank="committee" index={i} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Rango 3: Colaboradores (Escala Compacta) */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-slate-400 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold mb-3">
              Operaciones y Ejecución
            </h2>
            <h3 className="font-serif text-xl sm:text-2xl text-slate-800">Cuerpo de Colaboradores</h3>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-wrap justify-center gap-6 sm:gap-10"
          >
            {collaborators.map((member, i) => (
              <div key={i} className="w-[calc(50%-1rem)] sm:w-[calc(25%-1.5rem)]">
                <TeamMember {...member} rank="collaborator" index={i} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Cierre Diplomático */}
      <motion.footer 
        className="py-16 sm:py-20 bg-slate-900 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6 max-w-2xl">
          <Image 
            src="/munsec-logo-white.svg" // Asegúrate de tener este logo o quita esta etiqueta
            alt="Logo" 
            width={40} 
            height={40} 
            className="mx-auto mb-6 opacity-50"
            onError={(e) => e.target.style.display = 'none'}
          />
          <p className="text-slate-400 text-xs sm:text-sm uppercase tracking-[0.3em] font-light">
            Estructura Oficial • MUNSEC 2026
          </p>
        </div>
      </motion.footer>
    </div>
  );
}