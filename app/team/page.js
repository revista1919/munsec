"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { useState } from 'react';

// Variantes de animación
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

// Componente individual de miembro del equipo con mejoras visuales del Código 2
const TeamMember = ({ name, role, bio, index, rank }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [imgError, setImgError] = useState(false);
  const imageSrc = imgError 
    ? "https://via.placeholder.com/600x800?text=MUNSEC" 
    : `/team/${name.toLowerCase().replace(/ /g, '-')}.jpg`;

  // Jerarquía visual según tipo de miembro
  const rankStyles = {
    admin: {
      color: "text-[#005bbb]",
      bgHover: "group-hover:bg-[#005bbb]/10",
      lineColor: "bg-[#005bbb]",
      borderColor: "border-[#005bbb]/20"
    },
    technical: {
      color: "text-slate-500",
      bgHover: "group-hover:bg-slate-800/5",
      lineColor: "bg-slate-400",
      borderColor: "border-slate-200"
    }
  };

  const style = rankStyles[rank] || rankStyles.technical;

  return (
    <motion.div 
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={index}
      className="group relative w-full max-w-[280px] mx-auto sm:max-w-none flex flex-col items-center"
    >
      {/* Contenedor de imagen con marco mejorado */}
      <div className={`w-full aspect-[3/4] max-h-[340px] bg-slate-50 overflow-hidden mb-5 border ${style.borderColor} relative p-1`}>
        <div className="w-full h-full relative overflow-hidden border border-slate-200">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-full relative"
          >
            <Image 
              src={imageSrc.startsWith('/team') ? `/munsec${imageSrc}` : imageSrc}
              alt={name}
              fill
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 33vw, 280px"
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              onError={() => setImgError(true)}
            />
          </motion.div>
          <div className={`absolute inset-0 transition-colors duration-700 ${style.bgHover}`} />
        </div>
      </div>

      {/* Información del miembro */}
      <motion.div 
        className="space-y-2 text-center w-full"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <span className={`${style.color} text-[9px] uppercase tracking-[0.25em] font-semibold block`}>
          {role}
        </span>
        <h3 className="font-serif text-lg sm:text-xl text-slate-900 group-hover:text-slate-600 transition-colors duration-300">
          {name}
        </h3>
        <motion.div 
          className={`h-[1px] mx-auto transition-all duration-500 ${style.lineColor}`}
          initial={{ width: "20px" }}
          whileHover={{ width: "60px" }}
        />
        {bio && (
          <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed font-light max-w-[220px] mx-auto pt-2">
            {bio}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default function Team() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [groupRef, groupInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [groupImgError, setGroupImgError] = useState(false);

  // Datos originales del Código 1 preservados
  const adminCommittee = [
    { name: "Rafaela Pérez", role: "Comité Administrativo", bio: "bio de Rafaela Pérez." },
    { name: "Camilo Jiménez", role: "Comité Administrativo", bio: "bio de Camilo Jiménez." },
    { name: "Trinidad Elgueta", role: "Comité Administrativo", bio: "bio de Trinidad Elgueta." },
    { name: "Emilia Barría", role: "Comité Administrativo", bio: "bio de Emilia Barría." },
  ];

  const technicalCommissions = [
    { name: "Karen Briceño", role: "Comisión de Finanzas", bio: "bio de Karen Briceño." },
    { name: "Javier Vergara", role: "Comisión de Finanzas", bio: "Estudiante de Cuarto Medio del Colegio Curimón de San Felipe, interesado principalmente en economía y teoría política." },
    { name: "Matías Valdés", role: "Comisión de Redacción", bio: "bio de Matías Valdés." },
    { name: "Amaro Reyes", role: "Comisión Eventos", bio: "bio de Amaro Reyes." },
  ];

  return (
    <div className="bg-[#F8F9FA] min-h-screen overflow-x-hidden font-sans text-slate-800">
      
      {/* HERO SECTION - Mejorado con estética del Código 2 */}
      <motion.header 
        ref={heroRef}
        className="pt-24 sm:pt-36 pb-16 sm:pb-20 bg-white border-b border-slate-200 relative"
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl text-center">
          {/* Icono decorativo estilo ONU */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={heroInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center mb-6 text-[#4A90E2]"
          >
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s-8-4.5-8-11.8A6 6 0 0 1 12 2a6 6 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
              <path d="M12 22v-6" />
              <path d="M8.5 12.5 12 16l3.5-3.5" />
              <path d="M10 9.5 12 11l2-1.5" />
            </svg>
          </motion.div>

          <motion.span 
            className="text-[#4A90E2] text-[10px] sm:text-[11px] uppercase tracking-[0.4em] sm:tracking-[0.6em] block mb-4 font-semibold"
            initial={{ opacity: 0, x: -20 }}
            animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Organización
          </motion.span>
          <motion.h1 
            className="font-serif text-4xl sm:text-5xl md:text-6xl text-slate-900 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Cuerpo <span className="italic text-[#4A90E2]">Organizador</span>
          </motion.h1>
          <div className="w-24 h-[1px] bg-slate-300 mx-auto mt-8" />
        </div>
      </motion.header>

      {/* Foto Grupal - Preservada del Código 1 */}
      <section className="py-12 sm:py-20 bg-white" ref={groupRef}>
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
                src={groupImgError ? "https://via.placeholder.com/1920x1080?text=Fotografía+Equipo+MUNSEC" : "/team-full.jpg"}
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

      {/* Comité Administrativo - Mejorado con estilos del Código 2 */}
      <section className="py-20 sm:py-28 bg-[#F4F6F8] border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 mb-3">Comité Administrativo</h2>
            <p className="text-[#005bbb] text-[10px] uppercase tracking-[0.3em] font-bold">Consejo Directivo</p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 justify-items-center"
          >
            {adminCommittee.map((member, i) => (
              <TeamMember key={i} {...member} index={i} rank="admin" />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Comisiones Técnicas - Mejorado con estilos del Código 2 */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 mb-3">Comisiones Técnicas</h2>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-bold">Operaciones</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 justify-items-center"
          >
            {technicalCommissions.map((member, i) => (
              <TeamMember key={i} {...member} index={i + adminCommittee.length} rank="technical" />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer/Cierre - Mejorado con estética del Código 2 */}
      <motion.section 
        className="py-16 bg-[#4A90E2] text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.p 
            className="text-white/80 text-sm sm:text-base font-serif italic mb-6"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            "La organización se nutre de la colaboración de estudiantes comprometidos con el fortalecimiento del debate público en Chile."
          </motion.p>
          <motion.div 
            className="w-16 h-[1px] bg-white/30 mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </div>
      </motion.section>
    </div>
  );
}