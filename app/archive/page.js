"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
const archives = [
  {
    year: "2025",
    edition: "I Edición",
    location: "Campus Juan Gómez Millas, Universidad de Chile",
    driveLink: "https://drive.google.com/...", // Tu link de Drive aquí
    coverImage: "/archive-2025.jpg",
    summary: "Colección de fotos de la primera edición de MUNSEC."
  }
  // Archivos de años anteriores eliminados por solicitud
];

export default function Gallery() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Header Seccion */}
      <header className="pt-32 pb-20 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <span className="text-[#4A90E2] text-[10px] uppercase tracking-[0.5em] font-bold block mb-4">
            Memoria Institucional
          </span>
          <h1 className="font-serif text-5xl text-slate-900 mb-6">Edición 2025</h1>
          <p className="text-slate-500 font-light max-w-xl leading-relaxed text-sm italic">
            "El registro visual de MUNSEC 2025 documenta la evolución académica y el compromiso cívico de las delegaciones participantes."
          </p>
        </div>
      </header>

      {/* Grid de Archivos - Solo 2025 */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="grid md:grid-cols-1 gap-12">
            {archives.map((item, index) => (
              <motion.a
                key={item.year}
                href={item.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative block bg-white border border-slate-200 overflow-hidden hover:border-slate-400 transition-all duration-500"
              >
                {/* Imagen de Fondo / Overlay */}
                <div className="aspect-video relative overflow-hidden bg-slate-900">
                  <Image
                    src={`/munsec${item.coverImage}`} 
                    alt={`MUNSEC ${item.year}`}
                    className="w-full h-full object-cover opacity-60 grayscale group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/800x450?text=MUNSEC+"+item.year; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  
                  {/* Badge de Año */}
                  <div className="absolute top-6 left-6">
                    <span className="text-white font-serif text-3xl tracking-tighter">{item.year}</span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#4A90E2] font-bold">
                        {item.edition}
                      </h3>
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">
                        {item.location}
                      </p>
                    </div>
                    <div className="text-slate-300 group-hover:text-[#4A90E2] transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                      </svg>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm font-light leading-relaxed">
                    {item.summary}
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-900">
                      Acceder al registro completo
                    </span>
                    <div className="h-[1px] flex-grow bg-slate-100"></div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Nota legal - Modificada para cubrir legalmente */}
      <section className="py-20 border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] leading-relaxed max-w-2xl mx-auto">
            El material aquí contenido es de carácter institucional y su uso debe respetar los fines académicos y formativos para los que fue creado. 
            Se prohíbe su reproducción, distribución o uso inapropiado sin autorización expresa de la organización. 
            El acceso a estos archivos implica la aceptación de estos términos.
          </p>
        </div>
      </section>
    </div>
  );
}