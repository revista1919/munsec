"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

// --- CONFIGURACIÓN DE ALIANZAS (EDITAR AQUÍ PARA AGREGAR MÁS) ---
const PARTNERS_DATA = [
  {
    id: "cepal",
    name: "CEPAL",
    fullName: "Comisión Económica para América Latina y el Caribe",
    logo: "/logos/cepal.png", 
    description: "Principal organismo regional de las Naciones Unidas encargado de promover el desarrollo económico y social de la región. La colaboración con MUNSEC se basa en compartir instalaciones para una próxima edición especial.",
    collaborationType: "Colaboración en instalaciones y recursos técnicos",
    hasTeamPhoto: true,
    teamPhoto: "/photos/team-cepal.jpg", // Foto del equipo con la institución
    photoCaption: "Delegación organizadora de MUNSEC en las dependencias de la CEPAL, Santiago."
  }
  // {
  //   id: "nuevo-aliado",
  //   name: "Nombre",
  //   fullName: "Nombre Completo Institución",
  //   logo: "/logos/logo.png",
  //   description: "Descripción sobria de la alianza.",
  //   collaborationType: "Tipo de convenio",
  //   hasTeamPhoto: false,
  //   teamPhoto: "",
  //   photoCaption: ""
  // }
];
// ---------------------------------------------------------------

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

// Componente para el logo con manejo de errores
const PartnerLogo = ({ src, name }) => {
  const [logoError, setLogoError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  if (logoError) {
    return <span className="font-serif text-2xl font-bold text-slate-300 uppercase tracking-tighter">
      {name}
    </span>;
  }

  return (
    <div className="relative h-16 w-32">
      <Image
        src={`/munsec${src}`}
        alt={name}
        fill
        sizes="(max-width: 768px) 128px, 128px"
        className="object-contain"
        onError={() => setLogoError(true)}
        onLoad={() => setShowFallback(true)}
      />
    </div>
  );
};

// Componente para la foto del equipo
const TeamPhoto = ({ src, caption }) => {
  const [photoError, setPhotoError] = useState(false);

  if (photoError) {
    return (
      <div className="h-full min-h-[400px] flex items-center justify-center bg-slate-100">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
          Imagen no disponible
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-hidden relative group">
        <Image
          src={`/munsec${src}`}
          alt={caption}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
          onError={() => setPhotoError(true)}
        />
      </div>
      <div className="p-6 bg-white border-t border-slate-100">
        <p className="text-[10px] text-slate-400 italic tracking-wide">
          {caption}
        </p>
      </div>
    </div>
  );
};

export default function Partners() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-32">
      {/* Header */}
      <header className="pt-32 pb-20 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <span className="text-[#4A90E2] text-[10px] uppercase tracking-[0.5em] font-bold block mb-4">
            Relaciones Exteriores
          </span>
          <h1 className="font-serif text-5xl text-slate-900 mb-6">Vinculación Institucional</h1>
          <p className="text-slate-500 font-light max-w-2xl leading-relaxed text-sm">
            MUNSEC establece alianzas estratégicas con organismos internacionales y entidades académicas para garantizar el estándar técnico de nuestras sesiones y vincular a los estudiantes con el ejercicio real de la diplomacia regional.
          </p>
        </div>
      </header>

      {/* Lista de Aliados */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-5xl space-y-24">
          {PARTNERS_DATA.map((partner, index) => (
            <motion.div 
              key={partner.id}
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="bg-white border border-slate-200 overflow-hidden"
            >
              <div className="grid md:grid-cols-12">
                {/* Información de la Institución */}
                <div className="md:col-span-5 p-12 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="h-16 w-32 mb-10 flex items-center grayscale">
                      <PartnerLogo src={partner.logo} name={partner.name} />
                    </div>
                    <h2 className="font-serif text-2xl text-slate-900 mb-2">{partner.fullName}</h2>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#4A90E2] font-bold">
                      {partner.collaborationType}
                    </span>
                    <p className="mt-8 text-slate-600 text-sm leading-relaxed font-light">
                      {partner.description}
                    </p>
                  </div>
                </div>

                {/* Registro Visual (Si existe) */}
                <div className="md:col-span-7 bg-slate-50 p-1">
                  {partner.hasTeamPhoto ? (
                    <div className="h-full">
                      <TeamPhoto src={partner.teamPhoto} caption={partner.photoCaption} />
                    </div>
                  ) : (
                    <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-slate-200 m-8">
                      <p className="text-[10px] uppercase tracking-widest text-slate-300 font-bold">
                        Archivo Visual en Proceso
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Seccion de Colaboración Activa */}
      <section className="container mx-auto px-6 max-w-5xl">
        <div className="border border-slate-900 p-12 text-center bg-white">
          <h3 className="font-serif text-2xl text-slate-900 mb-6 italic">Protocolo de Alianzas</h3>
          <p className="text-slate-500 text-sm font-light max-w-xl mx-auto mb-8 leading-relaxed">
            Nuestra institución se encuentra en un proceso constante de expansión de su red de colaboración. Buscamos establecer vínculos con organismos que compartan nuestra visión de descentralización y fortalecimiento de la educación pública.
          </p>
          <div className="inline-block border-b border-slate-900 pb-1">
            <a href="mailto:contact@munsec.com" className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-900">
              Solicitar información de vinculación
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}