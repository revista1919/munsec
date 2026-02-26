"use client";

import { motion } from 'framer-motion';

// --- REGLAMENTO MUNSEC (CONTENIDO EDITABLE) ---
const RULES_DATA = [
  {
    id: "disposiciones-generales",
    title: "Disposiciones Generales",
    chapter: "Capítulo I",
    articles: "1–2",
    content: `
      <p class="lead">El presente cuerpo normativo constituye el marco jurídico supremo que regirá las sesiones del <strong>Modelo de Naciones Unidas de Santiago, MUNSEC</strong>.</p>
      <h3>Artículo 1: Naturaleza Institucional</h3>
      <p>MUNSEC se define como una plataforma de alta exigencia académica y simulación diplomática. Su objetivo es la formación de líderes a través del rigor intelectual y el respeto irrestricto a los protocolos internacionales.</p>
      <h3>Artículo 2: Estructura de Participantes</h3>
      <p>La jerarquía del modelo se organiza bajo los siguientes estamentos:</p>
      <ul>
        <li><span class="li-strong">Delegaciones:</span> Sujetos de derecho internacional representados por estudiantes acreditados.</li>
        <li><span class="li-strong">Mesa Directiva:</span> Órgano rector del debate, con potestad absoluta sobre el flujo de la sesión.</li>
        <li><span class="li-strong">Secretaría General:</span> Máxima instancia de interpretación reglamentaria y resolución de conflictos.</li>
      </ul>
    `
  },
  {
    id: "procedimiento-de-debate",
    title: "Procedimiento de Debate",
    chapter: "Capítulo II",
    articles: "3–5",
    content: `
      <p class="lead">El flujo del debate se rige por principios de equidad, celeridad y orden parlamentario estricto.</p>
      <h3>Artículo 3: Lista de Oradores</h3>
      <p>Es el mecanismo primario de participación. La inclusión en la lista es un acto formal que faculta al delegado para el uso de la palabra según los tiempos establecidos por la Mesa.</p>
      <h3>Artículo 4: Instancias de Caucus</h3>
      <p>Los delegados podrán proponer mociones para alterar la modalidad de debate:</p>
      <ol>
        <li><span class="li-num">Caucus Moderado:</span> Debate dirigido sobre ejes temáticos específicos.</li>
        <li><span class="li-num">Caucus Informal:</span> Espacio de negociación directa para la redacción de documentos.</li>
      </ol>
      <p>Toda moción requiere de una justificación técnica y la aprobación por mayoría simple del comité.</p>
      <h3>Artículo 5: Documentación Oficial</h3>
      <p>Solo se admitirán Proyectos de Resolución que cumplan con los estándares de formato, preámbulos y cláusulas operativas definidos en la Guía de Protocolo.</p>
    `
  },
  {
    id: "protocolo-de-conducta",
    title: "Protocolo de Conducta",
    chapter: "Capítulo III",
    articles: "6–8",
    content: `
      <p class="lead">La integridad del modelo depende del comportamiento ético y la presencia profesional de sus miembros.</p>
      <h3>Artículo 6: Código de Vestimenta (Dress Code)</h3>
      <p>Se exige <strong>Vestimenta Formal de Negocios (Western Business Attire)</strong>. La sobriedad en la vestimenta es un reflejo del respeto hacia la institución representada.</p>
      <h3>Artículo 7: Tecnologías de la Información</h3>
      <p>Los dispositivos electrónicos son herramientas de investigación. El uso indebido para fines ajenos al debate resultará en la confiscación inmediata del equipo durante la sesión.</p>
      <h3>Artículo 8: Régimen Disciplinario</h3>
      <p>Cualquier transgresión a la investidura del modelo será procesada mediante:</p>
      <ul class="sanctions-list">
        <li><span class="li-strong">Amonestación:</span> Advertencia formal registrada en el acta del comité.</li>
        <li><span class="li-strong">Censura:</span> Suspensión del derecho a voto y uso de la palabra.</li>
        <li><span class="li-strong">Expulsión:</span> Retiro inmediato de las credenciales y exclusión del evento.</li>
      </ul>
    `
  }
];

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export default function Rules() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Header Estilo Editorial */}
      <header className="pt-32 pb-20 bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <span className="text-[#4A90E2] text-[10px] md:text-[11px] uppercase tracking-[0.5em] font-bold block mb-6">
              Instrumento Jurídico v.2025
            </span>
            <h1 className="font-serif text-5xl md:text-7xl text-slate-900 mb-8 leading-tight tracking-tighter">
              Reglamento <br className="hidden md:block"/> Académico
            </h1>
            <div className="h-[1px] w-24 bg-slate-900 mb-8"></div>
            <p className="text-slate-500 font-light max-w-2xl leading-relaxed text-base md:text-lg italic">
              "El orden es el requisito indispensable para la libertad del pensamiento y la excelencia del debate."
            </p>
          </motion.div>
        </div>
      </header>

      {/* Contenido del Reglamento */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 max-w-5xl space-y-24 md:space-y-40">
          {RULES_DATA.map((rule, index) => (
            <motion.article
              key={rule.id}
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              <div className="grid md:grid-cols-12 gap-8 md:gap-16">
                {/* Lateral: Metadatos del Capítulo */}
                <div className="md:col-span-4">
                  <div className="sticky top-32">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold block mb-4">
                      {rule.chapter}
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl text-slate-900 mb-6 leading-none">
                      {rule.title}
                    </h2>
                    <p className="text-[11px] uppercase tracking-widest text-[#4A90E2] font-semibold border-l-2 border-[#4A90E2] pl-4">
                      Artículos {rule.articles}
                    </p>
                  </div>
                </div>

                {/* Contenido Principal */}
                <div className="md:col-span-8">
                  <div 
                    className="rules-typography"
                    dangerouslySetInnerHTML={{ __html: rule.content }} 
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Footer de Firma y Autoridad */}
      <section className="pb-32 px-6">
        <div className="container mx-auto max-w-5xl border-t border-slate-200 pt-20">
          <div className="bg-slate-900 text-white p-10 md:p-20 relative overflow-hidden">
            <div className="relative z-10 text-center">
              <span className="text-[10px] uppercase tracking-[0.5em] text-slate-400 block mb-8">Certificación Oficial</span>
              <h3 className="font-serif text-3xl mb-8 italic">Vigencia y Aplicación</h3>
              <p className="text-slate-400 text-sm font-light max-w-xl mx-auto leading-relaxed mb-12">
                Este reglamento entra en vigor a partir de su publicación oficial y anula cualquier disposición anterior. La Secretaría General posee la facultad privativa de su interpretación.
              </p>
              <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-white border-t border-white/10 pt-8 inline-block">
                Secretaría General — MUNSEC 2025
              </div>
            </div>
            {/* Marca de agua sutil */}
            <div className="absolute -bottom-10 -right-10 font-serif text-[200px] text-white/[0.03] select-none pointer-events-none">
              SEC
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .rules-typography {
          color: #334155;
          line-height: 1.8;
        }
        
        .rules-typography .lead {
          font-family: 'Inter', sans-serif;
          font-size: 1.25rem;
          color: #0F172A;
          font-weight: 300;
          margin-bottom: 3rem;
          line-height: 1.6;
        }

        .rules-typography h3 {
          font-family: 'Times New Roman', serif;
          font-size: 1.75rem;
          color: #0F172A;
          margin-top: 4rem;
          margin-bottom: 1.5rem;
          font-style: italic;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 0.75rem;
        }

        .rules-typography h3:first-of-type {
          margin-top: 0;
        }

        .rules-typography p {
          font-size: 1.05rem;
          margin-bottom: 1.5rem;
          font-weight: 300;
        }

        .rules-typography strong {
          font-weight: 600;
          color: #0F172A;
        }

        .rules-typography ul, .rules-typography ol {
          margin: 2rem 0;
          padding-left: 1.5rem;
        }

        .rules-typography li {
          margin-bottom: 1rem;
          font-size: 1rem;
          position: relative;
          list-style: none;
        }

        /* Viñetas personalizadas y elegantes */
        .rules-typography ul li::before {
          content: "—";
          position: absolute;
          left: -1.5rem;
          color: #4A90E2;
          font-weight: bold;
        }

        .rules-typography .li-strong {
          font-weight: 600;
          color: #0F172A;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 0.25rem;
        }

        /* Sanciones con diseño de 'Warning' sobrio */
        .rules-typography .sanctions-list li {
          border-left: 2px solid #F1F5F9;
          padding-left: 1.5rem;
          margin-bottom: 2rem;
        }

        .rules-typography .sanctions-list li:hover {
          border-left-color: #4A90E2;
        }

        /* Contadores para listas ordenadas */
        .rules-typography ol {
          counter-reset: rule-counter;
        }
        .rules-typography ol li {
          counter-increment: rule-counter;
        }
        .rules-typography ol li::before {
          content: counter(rule-counter) ".";
          position: absolute;
          left: -2rem;
          font-family: serif;
          font-style: italic;
          color: #4A90E2;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .rules-typography .lead {
            font-size: 1.1rem;
          }
          .rules-typography h3 {
            font-size: 1.5rem;
            margin-top: 3rem;
          }
        }
      `}</style>
    </div>
  );
}