'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CONFIG_INSCRIPCION, verificarEstadoInscripciones } from '@/config/inscripcion';

export default function FormularioInscripcion() {
  const router = useRouter();

  useEffect(() => {
    const estado = verificarEstadoInscripciones();
    if (!estado.abiertas) {
      router.push('/register');
    }
  }, [router]);

  // Estados del flujo
  const [paso, setPaso] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  
  // 🔥 NUEVO: Estado para el modal de términos legales
  const [mostrarModalLegal, setMostrarModalLegal] = useState(false);
  
  // 🔥 NUEVO: Estados para becas
  const [tieneBeca, setTieneBeca] = useState(false);
  const [codigoBeca, setCodigoBeca] = useState('');
  const [becaTotal, setBecaTotal] = useState(false); // true = beca total, false = solo descuento
  const [comprobanteBeca, setComprobanteBeca] = useState(null); // base64
  const [comprobanteBecaNombre, setComprobanteBecaNombre] = useState(null);

  // Datos del formulario
  const [formData, setFormData] = useState({
    tipo_establecimiento: '',
    nombre_establecimiento: '',
    pais_origen: 'Chile',
    ciudad: '',
    direccion: '',
    telefono_establecimiento: '',

    profesor_nombre: '',
    profesor_apellido: '',
    profesor_rut: '',
    profesor_email: '',
    profesor_telefono: '',
    profesor_edad: '',
    profesor_asignatura: '',

    cantidad_delegaciones: 1,
    delegaciones: [
      {
        id: Date.now(),
        delegado_1: {
          nombre: '',
          rut: '',
          edad: '',
          curso: '',
          pais_preferencia_1: '',
          pais_preferencia_2: '',
          pais_preferencia_3: '',
        },
        delegado_2: {
          nombre: '',
          rut: '',
          edad: '',
          curso: '',
          pais_preferencia_1: '',
          pais_preferencia_2: '',
          pais_preferencia_3: '',
        },
        tiene_pareja: false,
        pais_preferencia_1: '',
        pais_preferencia_2: '',
        pais_preferencia_3: '',
      },
    ],

    comprobante_base64: null,
    comprobante_nombre: null,

    acepta_terminos: false,
    acepta_reglamento: false,
    acepta_datos: false,
  });

  // Cargar almacenamiento local
  useEffect(() => {
    const guardado = localStorage.getItem('munsec_inscripcion');
    const pasoGuardado = localStorage.getItem('munsec_paso');
    const becaGuardada = localStorage.getItem('munsec_beca');

    if (guardado) {
      try {
        const datos = JSON.parse(guardado);
        if (!datos.delegaciones || !Array.isArray(datos.delegaciones) || datos.delegaciones.length === 0) {
          datos.delegaciones = [
            {
              id: Date.now(),
              delegado_1: {
                nombre: '',
                rut: '',
                edad: '',
                curso: '',
                pais_preferencia_1: '',
                pais_preferencia_2: '',
                pais_preferencia_3: '',
              },
              delegado_2: {
                nombre: '',
                rut: '',
                edad: '',
                curso: '',
                pais_preferencia_1: '',
                pais_preferencia_2: '',
                pais_preferencia_3: '',
              },
              tiene_pareja: false,
              pais_preferencia_1: '',
              pais_preferencia_2: '',
              pais_preferencia_3: '',
            },
          ];
          datos.cantidad_delegaciones = 1;
        }
        setFormData(datos);
      } catch (e) {
        localStorage.removeItem('munsec_inscripcion');
        localStorage.removeItem('munsec_paso');
      }
    }
    if (pasoGuardado) setPaso(parseInt(pasoGuardado, 10));
    
    if (becaGuardada) {
      try {
        const beca = JSON.parse(becaGuardada);
        setTieneBeca(beca.tieneBeca);
        setCodigoBeca(beca.codigoBeca);
        setBecaTotal(beca.becaTotal);
      } catch (e) {
        localStorage.removeItem('munsec_beca');
      }
    }
  }, []);

  // Guardado automático con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('munsec_inscripcion', JSON.stringify(formData));
      localStorage.setItem('munsec_paso', paso.toString());
      localStorage.setItem('munsec_beca', JSON.stringify({
  tieneBeca,
  codigoBeca,
  becaTotal
}));
      setGuardando(true);
      setTimeout(() => setGuardando(false), 1000);
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, paso, tieneBeca, codigoBeca, becaTotal]);

  // Manejadores
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDelegadoChange = (delegacionIndex, delegadoKey, field, value) => {
    const nuevasDelegaciones = [...formData.delegaciones];
    nuevasDelegaciones[delegacionIndex] = {
      ...nuevasDelegaciones[delegacionIndex],
      [delegadoKey]: {
        ...nuevasDelegaciones[delegacionIndex][delegadoKey],
        [field]: value,
      },
    };
    setFormData((prev) => ({ ...prev, delegaciones: nuevasDelegaciones }));
  };

  const handlePreferenciaPaisDelegacion = (delegacionIndex, campo, valor) => {
    const nuevasDelegaciones = [...formData.delegaciones];
    nuevasDelegaciones[delegacionIndex] = {
      ...nuevasDelegaciones[delegacionIndex],
      [campo]: valor,
    };
    setFormData((prev) => ({ ...prev, delegaciones: nuevasDelegaciones }));
  };

  const togglePareja = (delegacionIndex) => {
    const nuevasDelegaciones = [...formData.delegaciones];
    nuevasDelegaciones[delegacionIndex].tiene_pareja = !nuevasDelegaciones[delegacionIndex].tiene_pareja;

    if (!nuevasDelegaciones[delegacionIndex].tiene_pareja) {
      nuevasDelegaciones[delegacionIndex].delegado_2 = {
        nombre: '',
        rut: '',
        edad: '',
        curso: '',
        pais_preferencia_1: '',
        pais_preferencia_2: '',
        pais_preferencia_3: '',
      };
    }

    setFormData((prev) => ({ ...prev, delegaciones: nuevasDelegaciones }));
  };

  const actualizarCantidadDelegaciones = (cantidad) => {
    const num = Math.max(1, Math.min(5, parseInt(cantidad, 10) || 1));
    const delegacionesActuales = [...formData.delegaciones];

    if (num > delegacionesActuales.length) {
      while (delegacionesActuales.length < num) {
        delegacionesActuales.push({
          id: Date.now() + delegacionesActuales.length,
          delegado_1: {
            nombre: '',
            rut: '',
            edad: '',
            curso: '',
            pais_preferencia_1: '',
            pais_preferencia_2: '',
            pais_preferencia_3: '',
          },
          delegado_2: {
            nombre: '',
            rut: '',
            edad: '',
            curso: '',
            pais_preferencia_1: '',
            pais_preferencia_2: '',
            pais_preferencia_3: '',
          },
          tiene_pareja: false,
          pais_preferencia_1: '',
          pais_preferencia_2: '',
          pais_preferencia_3: '',
        });
      }
    } else {
      delegacionesActuales.splice(num);
    }

    setFormData((prev) => ({
      ...prev,
      cantidad_delegaciones: num,
      delegaciones: delegacionesActuales,
    }));
  };

  const handleComprobante = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('El archivo seleccionado excede el límite máximo de 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        comprobante_base64: event.target.result,
        comprobante_nombre: file.name,
      }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  // 🔥 NUEVO: Manejar comprobante de beca
  const handleComprobanteBeca = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('El archivo de beca excede el límite máximo de 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setComprobanteBeca(event.target.result);
      setComprobanteBecaNombre(file.name);
      setError('');
    };
    reader.readAsDataURL(file);
  };

// 🔥 ULTRA FLEXIBLE: Validador mega permisivo, acepta casi todo
const validarRutSimple = (documento) => {
  // Si está vacío, lo aceptamos sin problema
  if (!documento || documento.trim() === '') return true;
  
  // Limpiar: quitar puntos, guiones, espacios, barras, todo
  const docLimpio = documento
    .replace(/\./g, '')
    .replace(/-/g, '')
    .replace(/\s/g, '')
    .replace(/\//g, '')
    .trim();
  
  // Si después de limpiar no queda nada, ok
  if (docLimpio === '') return true;
  
  // Aceptamos cualquier cosa con 5 o más caracteres
  // Esto cubre RUT, DNI, pasaporte, etc.
  if (docLimpio.length >= 5) return true;
  
  // Solo rechazamos si es demasiado corto (probable error)
  return false;
};


  const validarPaso = (num) => {
    switch (num) {
      case 1:
        if (!formData.tipo_establecimiento || !formData.nombre_establecimiento || !formData.ciudad || !formData.pais_origen) {
          throw new Error('Debe completar todos los campos obligatorios correspondientes al establecimiento.');
        }
        break;
      case 2:
        if (!formData.profesor_nombre || !formData.profesor_rut || !formData.profesor_email || !formData.profesor_telefono) {
          throw new Error('Debe ingresar la información requerida del docente responsable.');
        }
        if (!formData.profesor_email.includes('@')) {
          throw new Error('El correo electrónico indicado para el docente no es válido.');
        }
        // Validación de RUT más relajada
        if (!validarRutSimple(formData.profesor_rut)) {
          throw new Error('El número de documento de identidad ingresado para el docente no parece ser válido. Por favor verifica.');
        }
        break;
      case 3:
        // 🔥 Leer mínimos y máximos desde config
        const minDeleg = CONFIG_INSCRIPCION.requisitos.delegacion.minimo;
        const maxDeleg = CONFIG_INSCRIPCION.requisitos.delegacion.maximo;
        
        if (formData.cantidad_delegaciones < minDeleg || formData.cantidad_delegaciones > maxDeleg) {
          throw new Error(`La cantidad de delegaciones debe estar entre ${minDeleg} y ${maxDeleg}.`);
        }
        
        for (let i = 0; i < formData.delegaciones.length; i++) {
          const del = formData.delegaciones[i];
          const d1 = del.delegado_1;

          if (!d1.nombre || !d1.rut || !d1.edad || !d1.curso) {
            throw new Error(`Complete todos los campos del Delegado 1 en la Delegación ${i + 1}.`);
          }
          if (!validarRutSimple(d1.rut)) {
            throw new Error(`El documento de identidad del Delegado 1 en la Delegación ${i + 1} no parece válido.`);
          }

          if (del.tiene_pareja) {
            const d2 = del.delegado_2;
            if (!d2.nombre || !d2.rut || !d2.edad || !d2.curso) {
              throw new Error(`Complete todos los campos del Delegado 2 en la Delegación ${i + 1}.`);
            }
            if (!validarRutSimple(d2.rut)) {
              throw new Error(`El documento de identidad del Delegado 2 en la Delegación ${i + 1} no parece válido.`);
            }
            if (d1.rut === d2.rut) {
              throw new Error(`Los representantes de la Delegación ${i + 1} no pueden tener el mismo documento de identificación.`);
            }
          }
          
          if (!del.pais_preferencia_1 || !del.pais_preferencia_2 || !del.pais_preferencia_3) {
            throw new Error(`Debe seleccionar las 3 preferencias de país para la Delegación ${i + 1}.`);
          }
        }
        break;
      case 4:
        // Validación de pago según situación
        if (tieneBeca) {
  if (!codigoBeca || codigoBeca.trim() === '') {
    throw new Error('Si tienes beca, debes ingresar el código que te fue entregado.');
  }
  if (becaTotal) {
            // Beca total: solo necesita comprobante de correo
            if (!comprobanteBeca) {
              throw new Error('Para beca total, debe subir una imagen del correo de confirmación de su beca.');
            }
          } else {
            // Descuento: necesita comprobante de pago con descuento
            if (!formData.comprobante_base64) {
              throw new Error('Debe adjuntar el comprobante de pago con el descuento aplicado.');
            }
          }
        } else {
          // Sin beca: pago normal
          if (!formData.comprobante_base64) {
            throw new Error('Debe adjuntar el comprobante oficial de transferencia bancaria.');
          }
        }
        
        if (!formData.acepta_terminos || !formData.acepta_reglamento || !formData.acepta_datos) {
          throw new Error('Para concluir la inscripción, debe aceptar todos los acuerdos y términos requeridos.');
        }
        break;
    }
  };

  const siguientePaso = () => {
    try {
      validarPaso(paso);
      setPaso((prev) => Math.min(prev + 1, 5));
      setError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message);
    }
  };

  const pasoAnterior = () => {
    setPaso((prev) => Math.max(prev - 1, 1));
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🔥 ACTUALIZADO: Calcular monto con diferenciación por país y becas
  const calcularMonto = () => {
    const tipo = formData.tipo_establecimiento;
    if (!tipo) return { total: 0, moneda: 'CLP', descripcion: '' };
    
    // Determinar si es extranjero
    const esExtranjero = formData.pais_origen !== 'Chile';
    
    // Obtener valores según tipo y país
    let precioPorPersona;
    let moneda;
    let descripcion;
    
    if (esExtranjero) {
      const valoresExt = CONFIG_INSCRIPCION.pago.valores_extranjero;
      precioPorPersona = tipo === 'publico' ? valoresExt.publico.delegado : valoresExt.privado.delegado;
      moneda = 'USD';
      descripcion = tipo === 'publico' ? valoresExt.publico.descripcion : valoresExt.privado.descripcion;
    } else {
      const valoresNac = CONFIG_INSCRIPCION.pago.valores;
      precioPorPersona = tipo === 'publico' ? valoresNac.publico.delegado : valoresNac.privado.delegado;
      moneda = 'CLP';
      descripcion = tipo === 'publico' ? valoresNac.publico.descripcion : valoresNac.privado.descripcion;
    }
    
    // Calcular total base
    let total = 0;
    formData.delegaciones.forEach((del) => {
      total += precioPorPersona;
      if (del.tiene_pareja) total += precioPorPersona;
    });
    
    // Aplicar descuento de beca si corresponde
    if (tieneBeca && !becaTotal) {
      const descuento = CONFIG_INSCRIPCION.pago.becas.descuento_porcentaje;
      total = total - (total * descuento / 100);
      descripcion += ` (con ${descuento}% de descuento por beca)`;
    } else if (tieneBeca && becaTotal) {
      total = 0;
      descripcion = 'Beca total - Sin costo';
    }
    
    return { total, moneda, descripcion };
  };

  const contarDelegados = () => {
    let total = 0;
    formData.delegaciones.forEach((del) => {
      total += 1;
      if (del.tiene_pareja) total += 1;
    });
    return total;
  };

  const enviarFormulario = async () => {
    try {
      validarPaso(4);
      setEnviando(true);
      
      // Preparar datos completos incluyendo beca
      const datosCompletos = {
  ...formData,
  beca: {
    tieneBeca,
    codigoBeca,
    becaTotal,
    comprobanteBeca,
    comprobanteBecaNombre
  },
  monto: calcularMonto()
};

      const response = await fetch('/api/inscripciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCompletos),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al enviar la solicitud al servidor.');
      }

      setEnviado(true);
      localStorage.removeItem('munsec_inscripcion');
      localStorage.removeItem('munsec_paso');
      localStorage.removeItem('munsec_beca');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  // Obtener monto calculado
  const montoCalculado = calcularMonto();

  // --------------------------------------------------------------------------
  // MODAL DE TÉRMINOS LEGALES
  // --------------------------------------------------------------------------
  const ModalTerminosLegales = () => (
    <AnimatePresence>
      {mostrarModalLegal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setMostrarModalLegal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-slate-300 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-slate-900">
                {CONFIG_INSCRIPCION.legal.tratamiento_datos.titulo}
              </h2>
              <button
                onClick={() => setMostrarModalLegal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 text-sm text-slate-700 leading-relaxed whitespace-pre-line font-serif">
              {CONFIG_INSCRIPCION.legal.tratamiento_datos.texto_completo}
            </div>
            
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => setMostrarModalLegal(false)}
                className="flex-1 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, acepta_datos: true }));
                  setMostrarModalLegal(false);
                }}
                className="flex-1 px-4 py-2 bg-[#009EDB] text-white text-sm font-medium hover:bg-[#0072CE] transition-colors"
              >
                Aceptar y Continuar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // --------------------------------------------------------------------------
  // PANTALLA DE ÉXITO
  // --------------------------------------------------------------------------
  if (enviado) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full bg-white border border-slate-300 shadow-sm p-8 md:p-12 text-center"
        >
          <div className="w-16 h-16 bg-[#009EDB]/10 text-[#009EDB] flex items-center justify-center rounded-full mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <span className="text-xs font-semibold tracking-widest uppercase text-[#009EDB]">Registro Oficial</span>
          <h2 className="font-serif text-3xl text-slate-900 mt-2 mb-6">Inscripción Registrada con Éxito</h2>

          <div className="bg-slate-50 border border-slate-200 p-6 rounded text-left mb-8 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">
              Resumen de la solicitud
            </h3>
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Institución:</span>
                <span className="font-medium text-slate-900">{formData.nombre_establecimiento}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Docente a cargo:</span>
                <span className="font-medium text-slate-900">
                  {formData.profesor_nombre} {formData.profesor_apellido}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">País de origen:</span>
                <span className="font-medium text-slate-900">{formData.pais_origen}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delegaciones:</span>
                <span className="font-medium text-slate-900">{formData.cantidad_delegaciones}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total delegados:</span>
                <span className="font-medium text-slate-900">{contarDelegados()}</span>
              </div>
              {tieneBeca && (
                <div className="flex justify-between bg-amber-50 p-2 rounded">
                  <span className="text-amber-700">Beca aplicada:</span>
                  <span className="font-medium text-amber-700">
                    {becaTotal ? 'Beca Total' : `${CONFIG_INSCRIPCION.pago.becas.descuento_porcentaje}% de descuento`}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                <span className="text-slate-500">Monto total:</span>
                <span className="font-bold text-[#009EDB]">
                  {montoCalculado.total === 0 
                    ? 'Beca completa' 
                    : `${montoCalculado.moneda === 'USD' ? 'USD $' : '$'}${montoCalculado.total.toLocaleString('es-CL')} ${montoCalculado.moneda}`}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            El comité organizador verificará la documentación y emitirá la confirmación oficial. 
            {tieneBeca && ' El equipo verificará internamente los datos de tu beca.'}
          </p>
          <p className="text-xs text-slate-500 mb-2">
            La fecha de entrega de credenciales y asignaciones será comunicada próximamente a través de los canales oficiales.
          </p>
          <p className="text-xs text-slate-500 mb-8">
            Se ha remitido un comprobante preliminar a <span className="font-semibold text-slate-700">{formData.profesor_email}</span>.
          </p>

          <button
            onClick={() => window.close()}
            className="w-full sm:w-auto bg-[#009EDB] text-white text-sm font-medium px-8 py-3.5 hover:bg-[#0072CE] transition-colors shadow-sm"
          >
            Finalizar y cerrar ventana
          </button>
        </motion.div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // INTERFAZ PRINCIPAL DEL FORMULARIO
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 font-sans pb-20">
      {/* Modal de términos legales */}
      <ModalTerminosLegales />
      
      {/* Barra superior estilo Naciones Unidas */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#009EDB]" />
              <span className="text-xs font-semibold tracking-widest uppercase text-slate-500">
                Modelo de Naciones Unidas
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-serif font-bold text-slate-900 mt-0.5">
              Formulario Oficial de Registro — MUNSEC {CONFIG_INSCRIPCION.año}
            </h1>
          </div>

          {/* Indicador de proceso */}
          <div className="flex items-center sm:block justify-between border-t sm:border-0 pt-2 sm:pt-0 border-slate-100">
            <div className="text-xs font-medium text-slate-500 sm:text-right">
              Etapa <span className="text-slate-900 font-bold">{paso}</span> de 4
            </div>
            <div className="w-36 h-1.5 bg-slate-200 rounded-full sm:mt-1.5 overflow-hidden">
              <div
                className="h-full bg-[#009EDB] transition-all duration-300 ease-out"
                style={{ width: `${(paso / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Indicador flotante de autoguardado */}
      <AnimatePresence>
        {guardando && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2.5 rounded shadow-lg text-xs tracking-wide flex items-center gap-2 z-50 border border-slate-700"
          >
            <span className="w-2 h-2 rounded-full bg-[#009EDB] animate-pulse" />
            Guardando progreso de inscripción...
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {/* Banner de error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-red-50 border-l-4 border-red-600 p-4 shadow-sm flex justify-between items-start"
            >
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-800">Aviso de Validación</h4>
                  <p className="text-sm text-red-700 mt-0.5">{error}</p>
                </div>
              </div>
              <button onClick={() => setError('')} className="text-red-500 hover:text-red-800 text-sm font-semibold px-2">
                Cerrar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PASO 1: ESTABLECIMIENTO */}
        {paso === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#009EDB]">Sección I</span>
              <h2 className="text-2xl font-serif text-slate-900 mt-1">Identificación de la Institución Educativa</h2>
              <p className="text-sm text-slate-500 mt-1">
                Ingrese los antecedentes generales del establecimiento que patrocinará a la delegación.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
              {/* Tipo de establecimiento */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3">
                  Clasificación Institucional *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className={`border p-5 cursor-pointer transition-all flex flex-col justify-between ${
                      formData.tipo_establecimiento === 'publico'
                        ? 'border-[#009EDB] bg-[#009EDB]/5 ring-1 ring-[#009EDB]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-serif font-semibold text-slate-900 text-base">
                        Público o Particular Subvencionado
                      </span>
                      <input
                        type="radio"
                        name="tipo_establecimiento"
                        value="publico"
                        checked={formData.tipo_establecimiento === 'publico'}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#009EDB] border-slate-300 focus:ring-[#009EDB]"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Establecimientos municipales, SLEP, de administración delegada o con subvención estatal.
                    </p>
                  </label>

                  <label
                    className={`border p-5 cursor-pointer transition-all flex flex-col justify-between ${
                      formData.tipo_establecimiento === 'privado'
                        ? 'border-[#009EDB] bg-[#009EDB]/5 ring-1 ring-[#009EDB]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-serif font-semibold text-slate-900 text-base">
                        Particular Pagado
                      </span>
                      <input
                        type="radio"
                        name="tipo_establecimiento"
                        value="privado"
                        checked={formData.tipo_establecimiento === 'privado'}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#009EDB] border-slate-300 focus:ring-[#009EDB]"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Colegios privados de financiamiento autónomo e instituciones internacionales.
                    </p>
                  </label>
                </div>
              </div>

              {/* País de origen */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  País de Origen de la Delegación *
                </label>
                <select
                  name="pais_origen"
                  value={formData.pais_origen}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] focus:ring-1 focus:ring-[#009EDB] outline-none"
                >
                  <option value="Chile">Chile</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Perú">Perú</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Brasil">Brasil</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Otro">Otro</option>
                </select>
                {formData.pais_origen !== 'Chile' && (
                  <p className="text-xs text-amber-600 mt-1">
                    Como delegación extranjera, los valores se calcularán en dólares estadounidenses (USD).
                  </p>
                )}
              </div>

              {/* Nombre de la institución */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Nombre del Establecimiento *
                </label>
                <input
                  type="text"
                  name="nombre_establecimiento"
                  value={formData.nombre_establecimiento}
                  onChange={handleChange}
                  placeholder="Ej. Instituto Nacional General José Miguel Carrera"
                  className="w-full p-3 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] focus:ring-1 focus:ring-[#009EDB] outline-none"
                />
              </div>

              {/* Ubicación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Ciudad de Origen *
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    placeholder="Ej. Santiago"
                    className="w-full p-3 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] focus:ring-1 focus:ring-[#009EDB] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Dirección Institucional
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Calle y numeración oficial"
                    className="w-full p-3 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] focus:ring-1 focus:ring-[#009EDB] outline-none"
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Teléfono de la Institución
                </label>
                <input
                  type="tel"
                  name="telefono_establecimiento"
                  value={formData.telefono_establecimiento}
                  onChange={handleChange}
                  placeholder="+56 2 2000 0000"
                  className="w-full p-3 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] focus:ring-1 focus:ring-[#009EDB] outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* PASO 2: PROFESOR RESPONSABLE */}
        {paso === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#009EDB]">Sección II</span>
              <h2 className="text-2xl font-serif text-slate-900 mt-1">Docente Asesor y Enlace Oficial</h2>
              <p className="text-sm text-slate-500 mt-1">
                Antecedentes de la persona encargada que actuará como vínculo entre el establecimiento y la Secretaría General.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    name="profesor_nombre"
                    value={formData.profesor_nombre}
                    onChange={handleChange}
                    placeholder="Nombres completos"
                    className="w-full p-3 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] focus:ring-1 focus:ring-[#009EDB] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    name="profesor_apellido"
                    value={formData.profesor_apellido}
                    onChange={handleChange}
                    placeholder="Apellidos completos"
                    className="w-full p-3 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] focus:ring-1 focus:ring-[#009EDB] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    {formData.pais_origen === 'Chile' ? 'RUT' : 'Documento de Identidad'} *
                  </label>
                  <input
                    type="text"
                    name="profesor_rut"
                    value={formData.profesor_rut}
                    onChange={handleChange}
                    placeholder={formData.pais_origen === 'Chile' ? '12.345.678-9' : 'N° de documento'}
                    className="w-full p-3 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] focus:ring-1 focus:ring-[#009EDB] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Edad
                  </label>
                  <input
                    type="number"
                    name="profesor_edad"
                    value={formData.profesor_edad}
                    onChange={handleChange}
                    min="22"
                    max="80"
                    placeholder="Años"
                    className="w-full p-3 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] focus:ring-1 focus:ring-[#009EDB] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Correo Electrónico Institucional *
                  </label>
                  <input
                    type="email"
                    name="profesor_email"
                    value={formData.profesor_email}
                    onChange={handleChange}
                    placeholder="profesor@colegio.cl"
                    className="w-full p-3 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] focus:ring-1 focus:ring-[#009EDB] outline-none"
                  />
                  <p className="text-xs text-slate-400 mt-1">A este correo se enviarán las credenciales y resoluciones.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Teléfono Móvil de Contacto *
                  </label>
                  <input
                    type="tel"
                    name="profesor_telefono"
                    value={formData.profesor_telefono}
                    onChange={handleChange}
                    placeholder="+56 9 0000 0000"
                    className="w-full p-3 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] focus:ring-1 focus:ring-[#009EDB] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Departamento o Asignatura Académica
                </label>
                <input
                  type="text"
                  name="profesor_asignatura"
                  value={formData.profesor_asignatura}
                  onChange={handleChange}
                  placeholder="Ej. Historia, Geografía y Ciencias Sociales"
                  className="w-full p-3 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] focus:ring-1 focus:ring-[#009EDB] outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* PASO 3: DELEGACIONES */}
        {paso === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#009EDB]">Sección III</span>
              <h2 className="text-2xl font-serif text-slate-900 mt-1">Conformación de Delegaciones y Asignaciones</h2>
              <p className="text-sm text-slate-500 mt-1">
                Configure el número de delegaciones de su establecimiento e indique los delegados y las preferencias de país.
              </p>
            </div>

            {/* Panel de información técnica */}
            <div className="bg-slate-900 text-slate-200 border-l-4 border-[#009EDB] p-4 text-xs sm:text-sm leading-relaxed">
              <span className="font-bold text-white uppercase tracking-wider block mb-1">Normativa de Representación</span>
              Cada delegación representa un Estado miembro de las Naciones Unidas. Puede componerse de manera{' '}
              <strong className="text-white">individual (1 delegado)</strong> o <strong className="text-white">dual (2 delegados en pareja)</strong>. Las representaciones individuales serán emparejadas por el Comité Organizador según disponibilidad. Las preferencias de país se asignan <strong className="text-white">por delegación</strong>, no por persona.
            </div>

            {/* Selector superior de cantidad - 🔥 Usando mínimos/máximos del config */}
            <div className="bg-white border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-sm font-serif font-bold text-slate-900">
                  Total de delegaciones a registrar
                </label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Permitido entre {CONFIG_INSCRIPCION.requisitos.delegacion.minimo} y {CONFIG_INSCRIPCION.requisitos.delegacion.maximo} delegaciones por institución educativa en esta fase.
                </p>
              </div>

              <div className="w-full sm:w-32">
                <select
                  value={formData.cantidad_delegaciones}
                  onChange={(e) => actualizarCantidadDelegaciones(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 text-sm font-semibold text-slate-900 focus:border-[#009EDB] outline-none"
                >
                  {Array.from(
                    { length: CONFIG_INSCRIPCION.requisitos.delegacion.maximo - CONFIG_INSCRIPCION.requisitos.delegacion.minimo + 1 },
                    (_, i) => i + CONFIG_INSCRIPCION.requisitos.delegacion.minimo
                  ).map((num) => (
                    <option key={num} value={num}>
                      {num} Delegación{num > 1 ? 'es' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Listado dinámico de delegaciones */}
            <div className="space-y-6">
              {formData.delegaciones.map((delegacion, delIndex) => (
                <div key={delegacion.id} className="bg-white border border-slate-200 shadow-xs">
                  {/* Encabezado de la delegación */}
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#009EDB]">
                        Asignación Diplomática
                      </span>
                      <h3 className="text-lg font-serif font-bold text-slate-900">
                        Delegación {delIndex + 1}
                      </h3>
                    </div>

                    {/* Switch formal individual / pareja */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-600">
                        {delegacion.tiene_pareja ? 'Representación en Pareja (2)' : 'Representación Individual (1)'}
                      </span>
                      <button
                        type="button"
                        onClick={() => togglePareja(delIndex)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          delegacion.tiene_pareja ? 'bg-[#009EDB]' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-xs ${
                            delegacion.tiene_pareja ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-8">
                    {/* DELEGADO 1 */}
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                          Delegado Titular 1
                        </h4>
                        {!delegacion.tiene_pareja && (
                          <span className="text-xs text-slate-400 italic">Pareja asignada por MUNSEC</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-slate-600 mb-1">Nombre Completo *</label>
                          <input
                            type="text"
                            value={delegacion.delegado_1.nombre}
                            onChange={(e) => handleDelegadoChange(delIndex, 'delegado_1', 'nombre', e.target.value)}
                            className="w-full p-2.5 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            {formData.pais_origen === 'Chile' ? 'RUT *' : 'Doc. Identidad *'}
                          </label>
                          <input
                            type="text"
                            placeholder={formData.pais_origen === 'Chile' ? '12.345.678-9' : 'N° documento'}
                            value={delegacion.delegado_1.rut}
                            onChange={(e) => handleDelegadoChange(delIndex, 'delegado_1', 'rut', e.target.value)}
                            className="w-full p-2.5 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Edad *</label>
                            <input
                              type="number"
                              min={CONFIG_INSCRIPCION.requisitos.edad.minimo}
                              max={CONFIG_INSCRIPCION.requisitos.edad.maximo}
                              value={delegacion.delegado_1.edad}
                              onChange={(e) => handleDelegadoChange(delIndex, 'delegado_1', 'edad', e.target.value)}
                              className="w-full p-2.5 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Curso *</label>
                            <select
                              value={delegacion.delegado_1.curso}
                              onChange={(e) => handleDelegadoChange(delIndex, 'delegado_1', 'curso', e.target.value)}
                              className="w-full p-2.5 bg-white border border-slate-300 text-xs sm:text-sm text-slate-800 focus:border-[#009EDB] outline-none"
                            >
                              <option value="">-</option>
                              <option value="1° Medio">1° Medio</option>
                              <option value="2° Medio">2° Medio</option>
                              <option value="3° Medio">3° Medio</option>
                              <option value="4° Medio">4° Medio</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DELEGADO 2 (CONDICIONAL) */}
                    {delegacion.tiene_pareja && (
                      <div className="border-t-2 border-slate-100 pt-6">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#009EDB]">
                            Delegado Titular 2 (Pareja Diplomática)
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-slate-600 mb-1">Nombre Completo *</label>
                            <input
                              type="text"
                              value={delegacion.delegado_2.nombre}
                              onChange={(e) => handleDelegadoChange(delIndex, 'delegado_2', 'nombre', e.target.value)}
                              className="w-full p-2.5 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                              {formData.pais_origen === 'Chile' ? 'RUT *' : 'Doc. Identidad *'}
                            </label>
                            <input
                              type="text"
                              placeholder={formData.pais_origen === 'Chile' ? '12.345.678-9' : 'N° documento'}
                              value={delegacion.delegado_2.rut}
                              onChange={(e) => handleDelegadoChange(delIndex, 'delegado_2', 'rut', e.target.value)}
                              className="w-full p-2.5 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">Edad *</label>
                              <input
                                type="number"
                                min={CONFIG_INSCRIPCION.requisitos.edad.minimo}
                                max={CONFIG_INSCRIPCION.requisitos.edad.maximo}
                                value={delegacion.delegado_2.edad}
                                onChange={(e) => handleDelegadoChange(delIndex, 'delegado_2', 'edad', e.target.value)}
                                className="w-full p-2.5 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">Curso *</label>
                              <select
                                value={delegacion.delegado_2.curso}
                                onChange={(e) => handleDelegadoChange(delIndex, 'delegado_2', 'curso', e.target.value)}
                                className="w-full p-2.5 bg-white border border-slate-300 text-xs sm:text-sm text-slate-800 focus:border-[#009EDB] outline-none"
                              >
                                <option value="">-</option>
                                <option value="1° Medio">1° Medio</option>
                                <option value="2° Medio">2° Medio</option>
                                <option value="3° Medio">3° Medio</option>
                                <option value="4° Medio">4° Medio</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PREFERENCIAS DE PAÍS A NIVEL DELEGACIÓN */}
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Preferencias de País para esta Delegación *
                      </label>
                      <p className="text-xs text-slate-400 mb-3">
                        Seleccione 3 países en orden de prioridad. Estas preferencias aplican para toda la delegación.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[1, 2, 3].map((pref) => (
                          <div key={pref}>
                            <span className="block text-xs text-slate-400 mb-1">Prioridad {pref}</span>
                            <select
                              value={delegacion[`pais_preferencia_${pref}`] || ''}
                              onChange={(e) =>
                                handlePreferenciaPaisDelegacion(
                                  delIndex,
                                  `pais_preferencia_${pref}`,
                                  e.target.value
                                )
                              }
                              className="w-full p-2.5 bg-white border border-slate-300 text-sm text-slate-800 focus:border-[#009EDB] outline-none"
                            >
                              <option value="">Seleccionar Estado...</option>
                              {CONFIG_INSCRIPCION.comisiones[0].paises_disponibles.map((pais) => (
                                <option key={pais} value={pais}>
                                  {pais}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cuadro de resumen institucional */}
            {formData.tipo_establecimiento && (
              <div className="bg-white border border-slate-300 p-6 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#009EDB] block mb-2">
                  Cuadro Resumen de Inscripción
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                  <div className="pt-2 sm:pt-0">
                    <span className="text-xs text-slate-500 block">Tipo de arancel</span>
                    <span className="font-semibold text-slate-800">
                      {montoCalculado.descripcion || 'Pendiente'}
                    </span>
                  </div>
                  <div className="pt-2 sm:pt-0 sm:pl-4">
                    <span className="text-xs text-slate-500 block">N° Delegaciones</span>
                    <span className="font-semibold text-slate-800">{formData.cantidad_delegaciones}</span>
                  </div>
                  <div className="pt-2 sm:pt-0 sm:pl-4">
                    <span className="text-xs text-slate-500 block">Estudiantes totales</span>
                    <span className="font-semibold text-slate-800">{contarDelegados()} delegados</span>
                  </div>
                  <div className="pt-2 sm:pt-0 sm:pl-4">
                    <span className="text-xs text-slate-500 block">Aporte institucional total</span>
                    <span className="font-serif font-bold text-lg text-[#009EDB]">
                      {montoCalculado.total === 0 
                        ? 'Beca completa' 
                        : `${montoCalculado.moneda === 'USD' ? 'USD $' : '$'}${montoCalculado.total.toLocaleString('es-CL')} ${montoCalculado.moneda}`}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* PASO 4: PAGO, BECAS Y CONFIRMACIÓN */}
        {paso === 4 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#009EDB]">Sección IV</span>
              <h2 className="text-2xl font-serif text-slate-900 mt-1">Acreditación Financiera y Términos</h2>
              <p className="text-sm text-slate-500 mt-1">
                Verifique los datos bancarios, configure su situación de pago o beca, y adjunte la documentación requerida.
              </p>
            </div>

            {/* 🔥 SECCIÓN DE BECAS - VERIFICACIÓN MANUAL POR EL EQUIPO */}
{CONFIG_INSCRIPCION.pago.becas.habilitadas && (
  <div className="bg-white border border-slate-200 p-6 shadow-xs">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          ¿Cuentas con una beca o descuento?
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Si te fue otorgado un código de beca, ingrésalo aquí. El equipo lo verificará posteriormente.
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          setTieneBeca(!tieneBeca);
          if (tieneBeca) {
            setCodigoBeca('');
            setBecaTotal(false);
            setComprobanteBeca(null);
            setComprobanteBecaNombre(null);
          }
        }}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          tieneBeca ? 'bg-amber-500' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-xs ${
            tieneBeca ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>

    {tieneBeca && (
      <div className="space-y-4 border-t border-slate-200 pt-4">
        {/* Código de beca - solo se guarda, no se verifica */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">
            Código de Beca
          </label>
          <input
            type="text"
            value={codigoBeca}
            onChange={(e) => setCodigoBeca(e.target.value)}
            placeholder="Ingresa el código que te fue entregado"
            className="w-full p-2.5 bg-white border border-slate-300 text-sm focus:border-[#009EDB] outline-none"
          />
          <p className="text-xs text-slate-400 mt-1">
            Este código será verificado manualmente por el equipo organizador.
          </p>
        </div>

        {/* Tipo de beca */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">
            Tipo de Beca *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              className={`border p-4 cursor-pointer transition-all ${
                becaTotal
                  ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-sm font-semibold text-slate-900">Beca Total (100%)</span>
                <input
                  type="radio"
                  name="tipo_beca"
                  checked={becaTotal}
                  onChange={() => setBecaTotal(true)}
                  className="h-4 w-4 text-amber-500 border-slate-300"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Cubre el 100% del valor. Debes subir el correo de confirmación.
              </p>
            </label>
            <label
              className={`border p-4 cursor-pointer transition-all ${
                !becaTotal
                  ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  Descuento Parcial
                </span>
                <input
                  type="radio"
                  name="tipo_beca"
                  checked={!becaTotal}
                  onChange={() => setBecaTotal(false)}
                  className="h-4 w-4 text-amber-500 border-slate-300"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Descuento sobre el valor total. Debes pagar la diferencia y subir el comprobante.
              </p>
            </label>
          </div>
        </div>

        {/* Subir comprobante de beca total */}
        {becaTotal && (
          <div className="border-t border-slate-200 pt-4">
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Comprobante de Beca Total *
            </label>
            <p className="text-xs text-slate-400 mb-3">
              Sube una foto o captura del correo de confirmación de tu beca.
            </p>
            {!comprobanteBeca ? (
              <div className="border-2 border-dashed border-slate-300 p-6 text-center bg-slate-50">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleComprobanteBeca}
                  className="hidden"
                  id="comprobante-beca-input"
                />
                <label htmlFor="comprobante-beca-input" className="cursor-pointer block">
                  <span className="text-sm font-semibold text-slate-800">
                    Adjuntar comprobante de beca
                  </span>
                  <span className="block text-xs text-slate-500 mt-1">
                    JPG, PNG o WebP — Máx. 2 MB
                  </span>
                </label>
              </div>
            ) : (
              <div className="border border-slate-200 p-4 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate">{comprobanteBecaNombre}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setComprobanteBeca(null);
                      setComprobanteBecaNombre(null);
                    }}
                    className="text-xs text-red-600 underline hover:text-red-800"
                  >
                    Reemplazar
                  </button>
                </div>
                <div className="mt-2 max-h-48 overflow-hidden border border-slate-200 flex items-center justify-center bg-white">
                  <img
                    src={comprobanteBeca}
                    alt="Comprobante de beca"
                    className="max-h-48 w-auto object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )}
  </div>
)}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Información bancaria - Solo si no es beca total */}
              {(!tieneBeca || !tieneBeca || !becaTotal) && (
                <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                      Coordenadas de Transferencia Bancaria
                    </h3>

                    <div className="bg-slate-900 text-white p-6 space-y-3 font-mono text-sm">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400 font-sans text-xs">Banco receptor</span>
                        <span className="font-semibold">{CONFIG_INSCRIPCION.pago.cuenta.banco}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400 font-sans text-xs">Tipo de cuenta</span>
                        <span className="font-semibold">{CONFIG_INSCRIPCION.pago.cuenta.tipo}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400 font-sans text-xs">Número de cuenta</span>
                        <span className="font-bold text-base text-[#009EDB]">{CONFIG_INSCRIPCION.pago.cuenta.numero}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400 font-sans text-xs">Titular de cuenta</span>
                        <span className="font-semibold text-xs text-right">{CONFIG_INSCRIPCION.pago.cuenta.titular}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-sans text-xs">RUT o Identificador</span>
                        <span className="font-semibold">{CONFIG_INSCRIPCION.pago.cuenta.rut}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-semibold text-slate-700">Total a transferir:</span>
                      <span className="font-serif font-bold text-xl text-[#009EDB]">
                        {montoCalculado.total === 0 
                          ? 'Beca completa' 
                          : `${montoCalculado.moneda === 'USD' ? 'USD $' : '$'}${montoCalculado.total.toLocaleString('es-CL')} ${montoCalculado.moneda}`}
                      </span>
                    </div>
                    {tieneBeca && !becaTotal && (
                      <p className="text-xs text-amber-600 mt-1">
                        Monto con {CONFIG_INSCRIPCION.pago.becas.descuento_porcentaje}% de descuento aplicado.
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-2">{CONFIG_INSCRIPCION.pago.mensaje}</p>
                  </div>
                </div>
              )}

              {/* Subida del comprobante - Solo si no es beca total */}
              {(!tieneBeca || !tieneBeca || !becaTotal) && (
                <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                      Respaldo Digital del Pago *
                    </h3>

                    {!formData.comprobante_base64 ? (
                      <div className="border-2 border-dashed border-slate-300 p-8 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleComprobante}
                          className="hidden"
                          id="comprobante-input"
                        />
                        <label htmlFor="comprobante-input" className="cursor-pointer block">
                          <div className="w-10 h-10 border border-slate-300 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                          </div>
                          <span className="block text-sm font-semibold text-slate-800">
                            Adjuntar comprobante de transferencia
                          </span>
                          <span className="block text-xs text-slate-500 mt-1">
                            Formatos admitidos: JPG, PNG o WebP — Peso máximo 2 MB
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="border border-slate-200 p-4 bg-slate-50 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                                {formData.comprobante_nombre}
                              </p>
                              <p className="text-[11px] text-slate-500">Documento cargado correctamente</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                comprobante_base64: null,
                                comprobante_nombre: null,
                              }))
                            }
                            className="text-xs font-semibold text-red-600 hover:text-red-800 underline"
                          >
                            Reemplazar
                          </button>
                        </div>
                        <div className="max-h-48 overflow-hidden border border-slate-200 flex items-center justify-center bg-white">
                          <img
                            src={formData.comprobante_base64}
                            alt="Comprobante de pago"
                            className="max-h-48 w-auto object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Declaraciones juradas y términos */}
                  <div className="mt-6 border-t border-slate-200 pt-6 space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acepta_terminos"
                        checked={formData.acepta_terminos}
                        onChange={handleChange}
                        className="mt-0.5 h-4 w-4 text-[#009EDB] border-slate-300 focus:ring-[#009EDB]"
                      />
                      <span className="text-xs text-slate-600 leading-tight">
                        Acepto formalmente los términos y condiciones de participación de MUNSEC {CONFIG_INSCRIPCION.año}.
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acepta_reglamento"
                        checked={formData.acepta_reglamento}
                        onChange={handleChange}
                        className="mt-0.5 h-4 w-4 text-[#009EDB] border-slate-300 focus:ring-[#009EDB]"
                      />
                      <span className="text-xs text-slate-600 leading-tight">
                        Certifico que he leído y acepto el Reglamento Interno para Delegados e Instituciones.
                      </span>
                    </label>

                    {/* 🔥 NUEVO: Acuerdo de datos con modal */}
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="acepta_datos"
                        checked={formData.acepta_datos}
                        onChange={handleChange}
                        className="mt-0.5 h-4 w-4 text-[#009EDB] border-slate-300 focus:ring-[#009EDB]"
                      />
                      <div className="flex-1">
                        <span className="text-xs text-slate-600 leading-tight">
                          {CONFIG_INSCRIPCION.legal.tratamiento_datos.checkbox_texto}
                        </span>
                        <button
                          type="button"
                          onClick={() => setMostrarModalLegal(true)}
                          className="block text-xs text-[#009EDB] underline hover:text-[#0072CE] mt-1"
                        >
                          Leer acuerdo completo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Si es beca total, mostrar solo los términos */}
              {tieneBeca && becaTotal && (
                <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                    Términos y Condiciones
                  </h3>
                  
                  <div className="bg-amber-50 border border-amber-200 p-4 mb-6">
                    <p className="text-sm text-amber-800 font-semibold">Beca Total Aplicada</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Has aplicado una beca del 100%. El equipo de MUNSEC verificará internamente tu documentación.
                      No se requiere pago adicional.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acepta_terminos"
                        checked={formData.acepta_terminos}
                        onChange={handleChange}
                        className="mt-0.5 h-4 w-4 text-[#009EDB] border-slate-300 focus:ring-[#009EDB]"
                      />
                      <span className="text-xs text-slate-600 leading-tight">
                        Acepto formalmente los términos y condiciones de participación de MUNSEC {CONFIG_INSCRIPCION.año}.
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acepta_reglamento"
                        checked={formData.acepta_reglamento}
                        onChange={handleChange}
                        className="mt-0.5 h-4 w-4 text-[#009EDB] border-slate-300 focus:ring-[#009EDB]"
                      />
                      <span className="text-xs text-slate-600 leading-tight">
                        Certifico que he leído y acepto el Reglamento Interno para Delegados e Instituciones.
                      </span>
                    </label>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="acepta_datos"
                        checked={formData.acepta_datos}
                        onChange={handleChange}
                        className="mt-0.5 h-4 w-4 text-[#009EDB] border-slate-300 focus:ring-[#009EDB]"
                      />
                      <div className="flex-1">
                        <span className="text-xs text-slate-600 leading-tight">
                          {CONFIG_INSCRIPCION.legal.tratamiento_datos.checkbox_texto}
                        </span>
                        <button
                          type="button"
                          onClick={() => setMostrarModalLegal(true)}
                          className="block text-xs text-[#009EDB] underline hover:text-[#0072CE] mt-1"
                        >
                          Leer acuerdo completo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 🔥 Nota sobre fechas de entrega */}
            <div className="bg-slate-100 border border-slate-200 p-4 text-center">
              <p className="text-xs text-slate-600">
                Las fechas de entrega de credenciales, asignaciones de países y comisiones serán comunicadas 
                próximamente a través de los canales oficiales de MUNSEC. Mantente atento a tu correo electrónico 
                y a nuestras redes sociales.
              </p>
            </div>
          </motion.div>
        )}

        {/* Barra inferior de navegación */}
        <div className="mt-8 pt-6 border-t border-slate-300 flex items-center justify-between">
          <div>
            {paso > 1 && (
              <button
                type="button"
                onClick={pasoAnterior}
                className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors shadow-xs"
              >
                Anterior
              </button>
            )}
          </div>

          <div>
            {paso < 4 ? (
              <button
                type="button"
                onClick={siguientePaso}
                className="bg-[#009EDB] text-white px-8 py-2.5 text-sm font-semibold hover:bg-[#0072CE] transition-colors shadow-xs"
              >
                Continuar
              </button>
            ) : (
              <button
                type="button"
                onClick={enviarFormulario}
                disabled={enviando}
                className="bg-slate-900 text-white px-8 py-3 text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-sm"
              >
                {enviando ? 'Transmitiendo solicitud...' : 'Confirmar e Inscribir Delegación'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}