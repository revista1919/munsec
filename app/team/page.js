"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { useState } from 'react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.7, 
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.9, 
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

const TeamMember = ({ name, role, bio, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [imgError, setImgError] = useState(false);
  const imageSrc = imgError 
    ? "https://via.placeholder.com/600x800?text=MUNSEC" 
    : `/team/${name.toLowerCase().replace(/ /g, '-')}.jpg`;

  return (
    <motion.div 
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={index}
      className="group relative w-full max-w-[280px] mx-auto sm:max-w-none"
    >
      <div className="aspect-[3/4] bg-slate-100 overflow-hidden mb-4 sm:mb-6 border border-slate-200 relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full relative"
        >
          <Image 
            src={`/munsec${imageSrc}`}
            alt={name}
            fill
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 33vw, 280px"
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            onError={() => setImgError(true)}
          />
        </motion.div>
        <motion.div 
          className="absolute inset-0 bg-[#4A90E2]/0 group-hover:bg-[#4A90E2]/5 transition-colors duration-700"
          initial={false}
        />
      </div>
      <motion.div 
        className="space-y-1.5 sm:space-y-2 text-center sm:text-left"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <span className="text-[#4A90E2] text-[8px] sm:text-[9px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold block">
          {role}
        </span>
        <h3 className="font-serif text-lg sm:text-xl text-slate-900 group-hover:text-[#4A90E2] transition-colors duration-300 leading-tight">
          {name}
        </h3>
        <motion.div 
          className="w-8 h-[1px] bg-slate-300 mx-auto sm:mx-0 group-hover:w-12 transition-all duration-500"
          whileHover={{ width: 48, backgroundColor: "#4A90E2" }}
        />
        <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed font-light max-w-[250px] mx-auto sm:mx-0">
          {bio}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default function Team() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [groupRef, groupInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [groupImgError, setGroupImgError] = useState(false);

  const adminCommittee = [
    { name: "Rafaela Pérez", role: "Comité Administrativo", bio: "bio de Rafaela Pérez." },
    { name: "Camilo Jiménez", role: "Comité Administrativo", bio: "bio de Camilo Jiménez." },
    { name: "Trinidad Elgueta", role: "Comité Administrativo", bio: "bio de Trinidad Elgueta." },
    { name: "Emilia Barría", role: "Comité Administrativo", bio: "bio de Emilia Barría." },
    { name: "Karen Briceño", role: "Comité Administrativo", bio: "bio de Karen Briceño." },
  ];

  const technicalCommissions = [
    { name: "Javier Vergara", role: "Comisión de Finanzas", bio: "bio de Javier Vergara." },
    { name: "Matías Valdés", role: "Comisión de Redacción", bio: "bio de Matías Valdés." },
    { name: "Amaro Reyes", role: "Comisión Eventos", bio: "bio de Amaro Reyes." },
  ];

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* Hero / Título */}
      <motion.header 
        ref={heroRef}
        className="pt-20 sm:pt-32 pb-12 sm:pb-16 border-b border-slate-100"
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.span 
            className="text-slate-400 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.5em] block mb-3 sm:mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Organización
          </motion.span>
          <motion.h1 
            className="font-serif text-4xl sm:text-5xl md:text-6xl text-slate-900 italic leading-tight sm:leading-none"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Cuerpo <br className="block sm:hidden" />Organizador
          </motion.h1>
        </div>
      </motion.header>

      {/* Foto Grupal */}
      <section className="py-12 sm:py-20" ref={groupRef}>
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div 
            variants={scaleIn}
            initial="hidden"
            animate={groupInView ? "visible" : "hidden"}
            className="relative aspect-video bg-slate-100 overflow-hidden border border-slate-200"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full relative"
            >
              <Image 
                src={`/munsec${groupImgError ? "https://via.placeholder.com/1920x1080?text=Fotografía+Equipo+MUNSEC" : "/munsec/team-full.jpg"}`}
                alt="Equipo MUNSEC" 
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover opacity-80"
                onError={() => setGroupImgError(true)}
              />
            </motion.div>
            <motion.div 
              className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 bg-white p-3 sm:p-6 border border-slate-200 shadow-sm"
              initial={{ opacity: 0, x: -15 }}
              animate={groupInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500"></p>
              <p className="text-[10px] sm:text-xs text-slate-400">Santiago, 2026</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Comité Administrativo */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div 
            className="mb-10 sm:mb-16 text-center sm:text-left"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#4A90E2] font-bold mb-2">
              Consejo Directivo
            </h2>
            <p className="font-serif text-2xl sm:text-3xl text-slate-900 font-light">
              Comité Administrativo
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12"
          >
            {adminCommittee.map((member, i) => (
              <TeamMember key={i} {...member} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Comisiones Técnicas */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div 
            className="mb-10 sm:mb-16 text-center sm:text-left"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-slate-400 font-bold mb-2">
              Operaciones
            </h2>
            <p className="font-serif text-2xl sm:text-3xl text-slate-900 font-light">
              Comisiones Técnicas
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 justify-items-center"
          >
            {technicalCommissions.map((member, i) => (
              <TeamMember key={i} {...member} index={i + adminCommittee.length} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Cierre */}
      <motion.section 
        className="py-20 sm:py-32 border-t border-slate-100"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
          <motion.p 
            className="text-slate-400 text-sm sm:text-base italic font-serif mb-6 sm:mb-8 px-4"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            "La organización se nutre de la colaboración de estudiantes comprometidos con el fortalecimiento del debate público en Chile."
          </motion.p>
          <motion.div 
            className="w-12 h-[1px] bg-[#4A90E2] mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </div>
      </motion.section>
    </div>
  );
}