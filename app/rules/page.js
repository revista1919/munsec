"use client";

import { motion } from 'framer-motion';

// --- REGLAMENTO MUNSEC CEPAL 2026 (CONTENIDO OFICIAL) ---
const RULES_DATA = [
  {
    id: "mesa-y-roles",
    title: "Mesa Directiva y Roles",
    chapter: "Capítulo I",
    articles: "1.2 – 1.3",
    content: `
      <p class="lead">La Mesa es el equipo encargado de dirigir y supervisar el debate. Actúa como autoridad moderadora e imparcial, garantizando el orden, el respeto y el cumplimiento del reglamento sin intervenir en las posturas políticas.</p>
      <h3>Artículo 1: Presidencia y Vicepresidencia</h3>
      <p>La <strong>Presidencia</strong> es la máxima autoridad procedimental. Abre y cierra sesiones, otorga la palabra, resuelve mociones y aplica medidas disciplinarias. La <strong>Vicepresidencia</strong> apoya en la moderación, organización de listas de oradores y reemplaza a la Presidencia cuando sea necesario.</p>
      <h3>Artículo 2: Secretaría y Mensajería</h3>
      <p>La <strong>Secretaría</strong> mantiene el registro de oradores, votaciones y amonestaciones. Por su parte, la <strong>Mensajería Diplomática</strong> (elegida por mayoría simple) facilita el intercambio de notas escritas, las cuales deben ser revisadas previamente por la Mesa antes de su distribución.</p>
    `
  },
  {
    id: "protocolo-y-normativa",
    title: "Protocolo y Normativa",
    chapter: "Capítulo II",
    articles: "2.1 – 2.3",
    content: `
      <p class="lead">El desarrollo del modelo exige un lenguaje formal, respetuoso y acorde con el carácter diplomático de la instancia, promoviendo un espacio seguro e inclusivo.</p>
      <h3>Artículo 3: Protocolo Diplomático</h3>
      <p>Las intervenciones deben dirigirse a la Mesa («Honorable Mesa») y a las demás delegaciones («Estimada delegación»). Se debe emplear la tercera persona para referirse al Estado representado. No se tolerarán descalificaciones ni comentarios discriminatorios.</p>
      <h3>Artículo 4: Código de Vestimenta</h3>
      <p>Se exige vestimenta formal o semiformal (se acepta uniforme escolar), sin que esto represente una barrera económica:</p>
      <ul>
        <li><span class="li-strong">Parte Superior:</span> Camisas, blusas, poleras tipo polo, sweaters o chaquetas sobrias.</li>
        <li><span class="li-strong">Parte Inferior:</span> Pantalones de vestir, faldas o vestidos adecuados al contexto.</li>
        <li><span class="li-strong">Calzado:</span> Limpio y apropiado (no es obligatorio el uso de tacones o zapatos de vestir).</li>
      </ul>
      <h3>Artículo 5: Integridad Académica</h3>
      <p>La información presentada debe ser veraz y fundamentada. No se permite presentar trabajos de terceros como propios ni falsificar información. El uso de IA debe ajustarse a las instrucciones de la organización.</p>
    `
  },
  {
    id: "regimen-disciplinario",
    title: "Régimen Disciplinario",
    chapter: "Capítulo III",
    articles: "2.4",
    content: `
      <p class="lead">Las amonestaciones buscan resguardar el correcto desarrollo de las sesiones. Su aplicación será proporcional a la infracción y comunicada de forma clara y respetuosa.</p>
      <h3>Artículo 6: Faltas y Amonestaciones</h3>
      <ul class="sanctions-list">
        <li>
          <span class="li-strong">Primer Grado (Leves):</span> Uso reiterado de primera persona, uso indebido de dispositivos, incumplimiento del vestuario. <em>La acumulación de 5 afecta la evaluación.</em>
        </li>
        <li>
          <span class="li-strong">Segundo Grado (Graves):</span> Atrasos injustificados, interrupción del debate, plagio o falsificación. <em>La acumulación de 3 puede implicar exclusión de la sesión.</em>
        </li>
        <li>
          <span class="li-strong">Tercer Grado (Muy Graves):</span> Insultos graves, amenazas, acoso, agresiones físicas o discriminación de especial gravedad. <em>Evaluado caso a caso; puede implicar suspensión o exclusión del modelo.</em>
        </li>
      </ul>
    `
  },
  {
    id: "orden-del-debate",
    title: "Orden y Desarrollo",
    chapter: "Capítulo IV",
    articles: "3.1 – 3.5",
    content: `
      <p class="lead">El flujo del debate se rige por principios de igualdad soberana, diálogo y cooperación, asegurando que todas las delegaciones tengan la misma dignidad.</p>
      <h3>Artículo 7: Sesiones y Quórum</h3>
      <p>Para iniciar una <strong>Sesión Formal</strong> (debate oficial), se requiere un quórum de dos tercios de las delegaciones acreditadas. Para una <strong>Sesión Informal</strong> (negociación y redacción), se requiere la mayoría simple (50% + 1).</p>
      <h3>Artículo 8: Votaciones</h3>
      <p>Cada Estado tiene derecho a un voto. Las votaciones pueden ser por <strong>placard</strong> (levantando el cartel) o <strong>nominal</strong> (llamado individual). Los proyectos de resolución se aprueban por mayoría simple de los votos válidamente emitidos.</p>
    `
  },
  {
    id: "mociones-y-puntos",
    title: "Mociones y Puntos",
    chapter: "Capítulo V",
    articles: "4.1 – 4.2",
    content: `
      <p class="lead">Herramientas fundamentales para organizar el debate. Las mociones requieren votación; los puntos parlamentarios son consultas directas a la Mesa.</p>
      <h3>Artículo 9: Mociones Principales</h3>
      <p>Propuestas para modificar el flujo del debate (aprobadas por mayoría simple):</p>
      <ol>
        <li>Moción para establecer tiempos de discursos.</li>
        <li>Moción para abrir la lista de oradores o sentar agenda (tópicos).</li>
        <li>Moción para abrir sesión formal o informal.</li>
        <li>Moción para suspender la sesión o cerrar el debate.</li>
      </ol>
      <h3>Artículo 10: Puntos Parlamentarios</h3>
      <p>No requieren votación general. Se presentan directamente a la Mesa:</p>
      <ul>
        <li><span class="li-strong">Punto de Privilegio Personal:</span> Para situaciones que afectan la participación (ruido, necesidades personales).</li>
        <li><span class="li-strong">Punto de Orden:</span> Para señalar errores en la aplicación del reglamento.</li>
        <li><span class="li-strong">Derecho a Réplica:</span> Para responder a menciones confrontacionales u ofensivas directas.</li>
        <li><span class="li-strong">Punto de Duda Parlamentaria:</span> Para aclarar reglas o procedimientos.</li>
      </ul>
    `
  },
  {
    id: "documentacion-oficial",
    title: "Documentación Oficial",
    chapter: "Capítulo VI",
    articles: "5.1 – 5.6",
    content: `
      <p class="lead">Los documentos reflejan el trabajo colaborativo, la investigación y la negociación diplomática. Deben mantener un lenguaje formal y objetivo.</p>
      <h3>Artículo 11: Documento de Posición</h3>
      <p>Escrito individual que expone la postura oficial del Estado. <strong>Su entrega es voluntaria</strong> (fecha límite: sábado 31 de octubre de 2026, 15:00 hrs), pero es requisito para optar al premio "Mejor Documento de Posición". Formato: Times New Roman 11, máx. 2 planas.</p>
      <h3>Artículo 12: Documento de Trabajo y Resoluciones</h3>
      <p>El <strong>Documento de Trabajo</strong> organiza ideas y propuestas conjuntas. El <strong>Proyecto de Resolución</strong> es el documento final, estructurado en cláusulas preambulares (contexto) y operativas (acciones).</p>
      <p><em>Nota importante:</em> No se permite presentar cláusulas operativas previamente redactadas; estas deben construirse durante las sesiones. El plagio o falsificación es sancionado.</p>
    `
  },
  {
    id: "reconocimientos",
    title: "Reconocimientos",
    chapter: "Capítulo VII",
    articles: "6.1 – 6.4",
    content: `
      <p class="lead">Distinciones entregadas en la ceremonia de cierre por la Mesa y el equipo organizador, valorando la excelencia diplomática.</p>
      <h3>Artículo 13: Categorías de Premios</h3>
      <ul>
        <li><span class="li-strong">Mejor Delegación:</span> Desempeño integral sobresaliente en argumentación, negociación, liderazgo y respeto.</li>
        <li><span class="li-strong">Mejor Documento de Posición:</span> Calidad, profundidad de análisis y coherencia con la política exterior.</li>
        <li><span class="li-strong">Menciones Honoríficas:</span> Para delegaciones con desempeño destacado y actitud diplomática.</li>
        <li><span class="li-strong">Delegación Sobresaliente:</span> Reconocimiento a una actuación excepcional en aspectos particulares (negociación, iniciativa, etc.).</li>
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
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#4A90E2] font-bold">
                MUNSEC CEPAL 2026
              </span>
              <div className="h-[1px] w-12 bg-[#4A90E2]"></div>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-slate-900 mb-8 leading-tight tracking-tighter">
              Protocolo y <br className="hidden md:block"/> Reglamento
            </h1>
            <div className="h-[1px] w-24 bg-slate-900 mb-8"></div>
            <p className="text-slate-500 font-light max-w-2xl leading-relaxed text-base md:text-lg italic">
              "El diálogo, la negociación y la cooperación son herramientas esenciales para abordar las diferencias entre los países y avanzar hacia objetivos comunes."
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
                Este reglamento entra en vigor a partir de su publicación oficial y anula cualquier disposición anterior. La Mesa y el equipo organizador de MUNSEC poseen la facultad privativa de su interpretación y aplicación de medidas disciplinarias.
              </p>
              <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-white border-t border-white/10 pt-8 inline-block">
                Equipo MUNSEC — CEPAL 2026
              </div>
            </div>
            {/* Marca de agua sutil */}
            <div className="absolute -bottom-10 -right-10 font-serif text-[200px] text-white/[0.03] select-none pointer-events-none">
              UN
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
          text-align: justify;
        }

        .rules-typography strong {
          font-weight: 600;
          color: #0F172A;
        }

        .rules-typography em {
          color: #64748B;
          font-size: 0.95rem;
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
          font-weight: 300;
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
          display: inline-block;
          margin-right: 0.5rem;
        }

        /* Sanciones con diseño de 'Warning' sobrio */
        .rules-typography .sanctions-list li {
          border-left: 2px solid #F1F5F9;
          padding-left: 1.5rem;
          margin-bottom: 2rem;
          transition: border-color 0.3s ease;
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
          margin-bottom: 1.5rem;
        }
        .rules-typography ol li::before {
          content: counter(rule-counter) ".";
          position: absolute;
          left: -2rem;
          font-family: serif;
          font-style: italic;
          color: #4A90E2;
          font-weight: bold;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .rules-typography .lead {
            font-size: 1.1rem;
          }
          .rules-typography h3 {
            font-size: 1.5rem;
            margin-top: 3rem;
          }
          .rules-typography p {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}
