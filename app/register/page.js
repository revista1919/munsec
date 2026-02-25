"use client";

import { motion } from 'framer-motion';

// --- CONFIGURACIÓN DE LA CONVOCATORIA (EDITAR AQUÍ) ---
const REGISTRATION_CONFIG = {
  isOpen: false, // Cambiar a false para cerrar inscripciones
  contactEmail: "contact@munsec.com",
  // Array de comisiones/formularios disponibles
  commissions: [
    {
      id: "general-assembly",
      name: "Asamblea General",
      nameEn: "General Assembly",
      spanishName: "Asamblea General",
      isActive: false, // true para mostrar, false para ocultar
      formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSd1asdasd/viewform?embedded=true",
      deadline: "15 de mayo, 2025",
      fee: {
        publicSchool: {
          individual: "$10.000 CLP",
          delegation: "$8.000 CLP (por delegado)"
        },
        privateSchool: {
          individual: "$15.000 CLP",
          delegation: "$12.000 CLP (por delegado)"
        }
      }
    },
    {
      id: "security-council",
      name: "Consejo de Seguridad",
      nameEn: "Security Council",
      spanishName: "Consejo de Seguridad",
      isActive: false,
      formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSd2asdasd/viewform?embedded=true",
      deadline: "10 de mayo, 2025",
      fee: {
        publicSchool: {
          individual: "$10.000 CLP",
          delegation: "$8.000 CLP (por delegado)"
        },
        privateSchool: {
          individual: "$15.000 CLP",
          delegation: "$12.000 CLP (por delegado)"
        }
      }
    },
    {
      id: "human-rights",
      name: "Consejo de Derechos Humanos",
      nameEn: "Human Rights Council",
      spanishName: "Consejo de Derechos Humanos",
      isActive: false, // Esta comisión no se muestra
      formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSd3asdasd/viewform?embedded=true",
      deadline: "12 de mayo, 2025",
      fee: {
        publicSchool: {
          individual: "$10.000 CLP",
          delegation: "$8.000 CLP (por delegado)"
        },
        privateSchool: {
          individual: "$15.000 CLP",
          delegation: "$12.000 CLP (por delegado)"
        }
      }
    }
  ]
};
// -------------------------------------------------------

// Función para obtener el año actual automáticamente
const getCurrentYear = () => {
  return new Date().getFullYear();
};

export default function Register() {
  const { isOpen, commissions, contactEmail } = REGISTRATION_CONFIG;
  const currentYear = getCurrentYear();
  
  // Filtrar solo las comisiones activas
  const activeCommissions = commissions.filter(commission => commission.isActive);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Header Institucional */}
      <header className="pt-32 pb-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <span className="text-[#4A90E2] text-[10px] uppercase tracking-[0.5em] font-bold block mb-4">
            Proceso de Admisión
          </span>
          <h1 className="font-serif text-5xl text-slate-900 mb-6">
            Inscripción {currentYear}
          </h1>
          {isOpen && activeCommissions.length > 1 && (
            <p className="text-slate-500 font-light max-w-2xl leading-relaxed">
              Selecciona la comisión en la que deseas participar. Cada comisión tiene su propio formulario de inscripción y fecha límite.
            </p>
          )}
        </div>
      </header>

      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          {!isOpen ? (
            /* PANTALLA DE INSCRIPCIONES CERRADAS */
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="bg-white border border-slate-200 p-12 md:p-20 text-center max-w-5xl mx-auto"
            >
              <div className="w-12 h-[1px] bg-slate-300 mx-auto mb-8"></div>
              <h2 className="font-serif text-3xl text-slate-900 mb-6 italic">Convocatoria cerrada</h2>
              <p className="text-slate-500 font-light max-w-md mx-auto leading-relaxed mb-10">
                Actualmente no existen procesos de acreditación vigentes. Las fechas para la edición {currentYear} serán publicadas a través de nuestros canales oficiales.
              </p>
              <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                Consultas: {contactEmail}
              </div>
            </motion.div>
          ) : (
            /* PANTALLA DE INSCRIPCIONES ABIERTAS - Múltiples comisiones */
            <div className="space-y-24">
              {activeCommissions.map((commission, index) => (
                <div key={commission.id} className="scroll-mt-24" id={commission.id}>
                  {/* Título de la comisión */}
                  <div className="mb-10 border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[#4A90E2] text-[10px] uppercase tracking-[0.5em] font-bold">
                        Comisión
                      </span>
                      <span className="text-xs text-slate-400">
                        {commission.nameEn}
                      </span>
                    </div>
                    <h2 className="font-serif text-3xl text-slate-900">
                      {commission.spanishName}
                    </h2>
                  </div>

                  {/* Grid de contenido de la comisión */}
                  <div className="grid lg:grid-cols-12 gap-16">
                    
                    {/* Columna de Información (30%) */}
                    <aside className="lg:col-span-4 space-y-12">
                      <section>
                        <h3 className="text-[10px] uppercase tracking-[0.3em] text-slate-900 font-bold mb-6 border-b border-slate-200 pb-2">
                          Aranceles {currentYear} - {commission.spanishName}
                        </h3>
                        <div className="space-y-6">
                          {/* Precios diferenciados por tipo de colegio */}
                          <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Colegios Públicos</p>
                            <div className="space-y-3 pl-2">
                              <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Individual</p>
                                <p className="font-serif text-xl text-slate-900">{commission.fee.publicSchool.individual}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Delegaciones</p>
                                <p className="font-serif text-xl text-slate-900">{commission.fee.publicSchool.delegation}</p>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-slate-200 pt-4">
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Colegios Privados</p>
                            <div className="space-y-3 pl-2">
                              <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Individual</p>
                                <p className="font-serif text-xl text-slate-900">{commission.fee.privateSchool.individual}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Delegaciones</p>
                                <p className="font-serif text-xl text-slate-900">{commission.fee.privateSchool.delegation}</p>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-slate-500 italic pt-2">
                            * Precios diferenciados según tipo de institución educativa
                          </p>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-[10px] uppercase tracking-[0.3em] text-slate-900 font-bold mb-6 border-b border-slate-200 pb-2">
                          Plazos
                        </h3>
                        <div className="space-y-4 text-sm font-light text-slate-600">
                          <p>
                            <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1">Cierre de inscripciones</span>
                            <span className="text-slate-900 font-medium text-base">{commission.deadline}</span>
                          </p>
                          <p>
                            <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1">Asignación de países</span>
                            <span className="text-slate-900 font-medium text-base">72 horas posteriores al pago</span>
                          </p>
                        </div>
                      </section>

                      <div className="p-6 bg-slate-900 text-white">
                        <p className="text-[10px] uppercase tracking-widest mb-4 text-slate-400">Nota técnica</p>
                        <p className="text-xs leading-relaxed font-light">
                          Al completar el formulario de {commission.spanishName}, el delegado se compromete a respetar el reglamento interno y los protocolos de debate específicos de esta comisión.
                        </p>
                      </div>

                      {/* Indicador visual de scroll entre comisiones (solo si hay más de una) */}
                      {activeCommissions.length > 1 && index < activeCommissions.length - 1 && (
                        <div className="hidden lg:block text-center mt-8">
                          <span className="text-[8px] uppercase tracking-[0.5em] text-slate-300">
                            ↓ Siguiente comisión ↓
                          </span>
                        </div>
                      )}
                    </aside>

                    {/* Columna del Formulario (70%) */}
                    <div className="lg:col-span-8">
                      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden min-h-[800px] flex flex-col">
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                          <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                          </div>
                          <span className="text-[9px] uppercase tracking-widest text-slate-400">
                            {commission.spanishName} - Formulario Oficial de Acreditación {currentYear}
                          </span>
                        </div>
                        
                        {/* Iframe del Formulario */}
                        <div className="flex-grow">
                          <iframe
                            src={commission.formUrl}
                            className="w-full h-full min-h-[800px]"
                            frameBorder="0"
                            marginHeight="0"
                            marginWidth="0"
                            title={`Formulario ${commission.name}`}
                          >
                            Cargando formulario...
                          </iframe>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Separador entre comisiones (excepto después de la última) */}
                  {index < activeCommissions.length - 1 && (
                    <div className="mt-24 border-t border-slate-200 pt-24">
                      <div className="text-center">
                        <span className="text-[10px] uppercase tracking-[0.5em] text-slate-400 bg-white px-4">
                          {commission.nameEn} · {activeCommissions[index + 1].nameEn}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}