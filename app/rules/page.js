"use client";

import { motion } from 'framer-motion';

// --- REGLAMENTO MUNSEC (EDITAR AQUÍ EL CONTENIDO) ---
// El texto puede incluir HTML como si viniera de un editor Quill (negritas, listas, etc.)
const RULES_DATA = [
  {
    id: "disposiciones-generales",
    title: "Disposiciones Generales",
    content: `
      <p class="lead">El presente reglamento establece las normas que regirán las sesiones del <strong>Modelo de Naciones Unidas de Santiago, MUNSEC</strong>. Su cumplimiento es obligatorio para todas las delegaciones, miembros de la mesa y organización.</p>
      <h3>Artículo 1: De la naturaleza del modelo</h3>
      <p>MUNSEC es un ejercicio académico y de simulación diplomática, sin fines de lucro, organizado por estudiantes y para estudiantes. Busca fomentar el pensamiento crítico, la oratoria y el entendimiento de las relaciones internacionales.</p>
      <h3>Artículo 2: De los participantes</h3>
      <p>Los participantes se dividen en:</p>
      <ul>
        <li><span class="li-strong">Delegaciones:</span> Representantes de los Estados miembros y observadores.</li>
        <li><span class="li-strong">Mesa Directiva:</span> Presidente y Moderador, encargados de dirigir el comité y velar por el cumplimiento de este reglamento.</li>
        <li><span class="li-strong">Secretaría General:</span> Autoridad máxima durante el evento, responsable de la interpretación del reglamento.</li>
      </ul>
    `
  },
  {
    id: "procedimiento-de-debate",
    title: "Procedimiento de Debate",
    content: `
      <p class="lead">El debate en los comités de MUNSEC sigue el flujo establecido, inspirado en el manual de procedimiento de las Naciones Unidas, pero adaptado para un modelo académico de excelencia.</p>
      <h3>Artículo 3: Lista de Oradores</h3>
      <p>Al inicio del comité, se establecerá la <strong>Lista de Oradores</strong> para debatir el tópico en cuestión. Los delegados podrán incluirse o retirarse de la lista mediante el envío de una nota a la mesa.</p>
      <h3>Artículo 4: Caucus</h3>
      <p>El caucus (debate moderado o informal) puede ser solicitado por cualquier delegado. La moción debe especificar:</p>
      <ol>
        <li><span class="li-num">Duración total</span> del caucus.</li>
        <li><span class="li-num">Tiempo de intervención</span> por delegado (en caso de ser moderado).</li>
        <li><span class="li-num">Propósito específico</span> del debate.</li>
      </ol>
      <p>La moción será votada y requerirá mayoría simple para ser aprobada.</p>
      <h3>Artículo 5: Documentos de Trabajo</h3>
      <p>Los proyectos de resolución y documentos de trabajo deben ser redactados siguiendo el formato oficial de MUNSEC y contar con el número mínimo de firmantes (establecido por la mesa) para ser introducidos.</p>
    `
  },
  {
    id: "protocolo-de-conducta",
    title: "Protocolo de Conducta",
    content: `
      <p class="lead">La excelencia académica va de la mano con el respeto y la diplomacia. Todos los participantes mantendrán una conducta intachable durante el evento.</p>
      <h3>Artículo 6: Vestimenta</h3>
      <p>Se requiere el uso de <strong>vestimenta formal</strong> (traje, corbata, vestido sastre) durante todas las sesiones de trabajo. No se permitirá el ingreso a las salas con vestimenta informal.</p>
      <h3>Artículo 7: Uso de dispositivos electrónicos</h3>
      <p>El uso de laptops y tablets está permitido exclusivamente para la redacción de documentos y la investigación. Queda estrictamente prohibido el uso de teléfonos móviles durante las sesiones, salvo en casos de emergencia previamente autorizados por la mesa.</p>
      <h3>Artículo 8: Faltas y sanciones</h3>
      <p>Las faltas al reglamento o el irrespeto hacia otro delegado o miembro de la organización serán sancionadas de la siguiente manera:</p>
      <ul class="sanctions-list">
        <li><span class="li-strong">Primera falta:</span> Llamado de atención verbal por parte de la mesa.</li>
        <li><span class="li-strong">Segunda falta:</span> Nota diplomática de advertencia.</li>
        <li><span class="li-strong">Tercera falta:</span> Expulsión del comité y citación con la Secretaría General.</li>
      </ul>
    `
  }
];
// ---------------------------------------------------------------

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export default function Rules() {
  return (
    <div className="bg-[#F5F7FA] min-h-screen pb-32">
      {/* Header */}
      <header className="pt-32 pb-20 bg-white border-b border-[#E8EFF5]">
        <div className="container mx-auto px-6 max-w-5xl">
          <span className="text-[#2B5F8A] text-[11px] uppercase tracking-[0.4em] font-medium block mb-5">
            Normativa oficial
          </span>
          <h1 className="font-serif text-6xl text-[#1A2E40] mb-6 tracking-tight">Reglamento MUNSEC</h1>
          <p className="text-[#4A5F73] font-light max-w-2xl leading-relaxed text-base">
            El siguiente compendio de reglas ha sido elaborado para garantizar un debate de excelencia, organizado y fiel a los principios de la diplomacia. Su lectura y comprensión son responsabilidad de cada delegación.
          </p>
        </div>
      </header>

      {/* Lista de Artículos del Reglamento */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-5xl space-y-16">
          {RULES_DATA.map((rule, index) => (
            <motion.article
              key={rule.id}
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="bg-white border border-[#E0E8F0] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="grid md:grid-cols-12">
                {/* Título del Artículo (Lateral) - JERARQUÍA VISUAL */}
                <div className="md:col-span-4 p-12 border-b md:border-b-0 md:border-r border-[#E0E8F0] bg-[#F9FCFE] flex flex-col justify-start">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#6B89A3] font-medium mb-3">
                    {index === 0 ? 'Capítulo I' : index === 1 ? 'Capítulo II' : 'Capítulo III'}
                  </span>
                  <h2 className="font-serif text-4xl text-[#1A2E40] leading-tight tracking-tight">
                    {rule.title}
                  </h2>
                  <div className="mt-8 w-16 h-[2px] bg-[#2B5F8A] opacity-30"></div>
                  <p className="mt-6 text-[13px] text-[#6B89A3] uppercase tracking-wider font-medium">
                    Artículos {index === 0 ? '1–2' : index === 1 ? '3–5' : '6–8'}
                  </p>
                </div>

                {/* Contenido HTML - JERARQUÍA TIPOGRÁFICA OBSESIVA */}
                <div className="md:col-span-8 p-12">
                  <div 
                    className="rules-content"
                    dangerouslySetInnerHTML={{ __html: rule.content }} 
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Sección de Aceptación y Fe de Erratas */}
      <section className="container mx-auto px-6 max-w-5xl">
        <div className="border border-[#D0DDEB] p-16 text-center bg-white">
          <div className="w-20 h-[2px] bg-[#2B5F8A] mx-auto mb-8 opacity-40"></div>
          <h3 className="font-serif text-3xl text-[#1A2E40] mb-6 font-light italic tracking-wide">
            Fe de Erratas y Modificaciones
          </h3>
          <p className="text-[#4A5F73] text-sm font-light max-w-xl mx-auto mb-8 leading-relaxed tracking-wide">
            La Secretaría General de MUNSEC se reserva el derecho de interpretar el presente reglamento y de emitir comunicados oficiales para su aclaración o modificación, los cuales serán oportunamente informados a las delegaciones.
          </p>
          <div className="inline-block border-b border-[#1A2E40] pb-1">
            <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-[#1A2E40]">
              Versión 2025 — Vigente para la próxima sesión
            </span>
          </div>
        </div>
      </section>

      {/* ESTILOS OBSESIVOS - JERARQUÍA TIPOGRÁFICA PERFECTA */}
      <style jsx>{`
        .rules-content {
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #2A4059;
        }
        
        /* Párrafo inicial con jerarquía */
        .rules-content .lead {
          font-size: 1.1875rem !important;
          line-height: 1.65 !important;
          color: #1A2E40 !important;
          font-weight: 400 !important;
          margin-bottom: 2rem !important;
          letter-spacing: -0.01em !important;
          border-left: 3px solid #2B5F8A !important;
          padding-left: 1.25rem !important;
          font-style: normal !important;
        }
        
        /* TÍTULOS - AHORA GRANDES Y CON PRESENCIA */
        .rules-content h3 {
          font-size: 2rem !important;
          font-weight: 500 !important;
          color: #0A1A2A !important;
          font-family: 'Times New Roman', Georgia, Garamond, serif !important;
          margin-top: 2.5rem !important;
          margin-bottom: 1.25rem !important;
          line-height: 1.2 !important;
          letter-spacing: -0.02em !important;
          border-bottom: 1px solid #E0E8F0 !important;
          padding-bottom: 0.5rem !important;
        }
        
        .rules-content h3:first-of-type {
          margin-top: 0 !important;
        }
        
        /* Párrafos regulares */
        .rules-content p {
          font-size: 1.0625rem !important;
          line-height: 1.7 !important;
          color: #2F4057 !important;
          margin-bottom: 1.5rem !important;
          font-weight: 350 !important;
        }
        
        /* LISTAS - CON ESTILO */
        .rules-content ul, 
        .rules-content ol {
          margin-top: 1rem !important;
          margin-bottom: 2rem !important;
          padding-left: 1.75rem !important;
        }
        
        .rules-content li {
          font-size: 1.0625rem !important;
          line-height: 1.7 !important;
          color: #2F4057 !important;
          margin-bottom: 0.75rem !important;
          font-weight: 350 !important;
          padding-left: 0.5rem !important;
        }
        
        /* Elementos destacados en listas */
        .rules-content .li-strong {
          font-weight: 600 !important;
          color: #1A2E40 !important;
          display: inline-block !important;
          min-width: 7.5rem !important;
        }
        
        .rules-content .li-num {
          font-weight: 600 !important;
          color: #1A2E40 !important;
          display: inline-block !important;
        }
        
        /* Lista de sanciones con espaciado especial */
        .rules-content .sanctions-list li {
          border-left: 2px solid #D0DDEB !important;
          padding-left: 1rem !important;
          margin-left: 0.5rem !important;
        }
        
        /* Negritas en general */
        .rules-content strong {
          color: #0A1A2A !important;
          font-weight: 600 !important;
          letter-spacing: -0.01em !important;
        }
        
        /* Listas ordenadas con números estilizados */
        .rules-content ol {
          list-style: none !important;
          counter-reset: custom-counter !important;
        }
        
        .rules-content ol li {
          counter-increment: custom-counter !important;
          position: relative !important;
        }
        
        .rules-content ol li::before {
          content: counter(custom-counter) "." !important;
          color: #2B5F8A !important;
          font-weight: 500 !important;
          position: absolute !important;
          left: -1.75rem !important;
          font-size: 1rem !important;
        }
        
        /* Listas no ordenadas con viñeta elegante */
        .rules-content ul li {
          position: relative !important;
        }
        
        .rules-content ul li::before {
          content: "—" !important;
          color: #8AA5C0 !important;
          font-weight: 300 !important;
          position: absolute !important;
          left: -1.25rem !important;
          font-size: 1rem !important;
        }
        
        /* Espaciado entre elementos */
        .rules-content h3 + p,
        .rules-content h3 + ul,
        .rules-content h3 + ol {
          margin-top: 0.5rem !important;
        }
        
        /* Pequeños detalles tipográficos */
        .rules-content p:last-of-type {
          margin-bottom: 0 !important;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .rules-content h3 {
            font-size: 1.75rem !important;
          }
          .rules-content .lead {
            font-size: 1.125rem !important;
          }
        }
      `}</style>
    </div>
  );
}