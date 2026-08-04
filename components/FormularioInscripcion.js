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
  
  // Estado para el modal de términos legales
  const [mostrarModalLegal, setMostrarModalLegal] = useState(false);
  
  // Estados para becas
  const [tieneBeca, setTieneBeca] = useState(false);
  const [codigoBeca, setCodigoBeca] = useState('');
  const [becaTotal, setBecaTotal] = useState(false); 
  const [comprobanteBeca, setComprobanteBeca] = useState(null); 
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
          nombre: '', rut: '', edad: '', curso: '',
          pais_preferencia_1: '', pais_preferencia_2: '', pais_preferencia_3: '',
        },
        delegado_2: {
          nombre: '', rut: '', edad: '', curso: '',
          pais_preferencia_1: '', pais_preferencia_2: '', pais_preferencia_3: '',
        },
        tiene_pareja: false,
        pais_preferencia_1: '', pais_preferencia_2: '', pais_preferencia_3: '',
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
              delegado_1: { nombre: '', rut: '', edad: '', curso: '', pais_preferencia_1: '', pais_preferencia_2: '', pais_preferencia_3: '' },
              delegado_2: { nombre: '', rut: '', edad: '', curso: '', pais_preferencia_1: '', pais_preferencia_2: '', pais_preferencia_3: '' },
              tiene_pareja: false,
              pais_preferencia_1: '', pais_preferencia_2: '', pais_preferencia_3: '',
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
      localStorage.setItem('munsec_beca', JSON.stringify({ tieneBeca, codigoBeca, becaTotal }));
      setGuardando(true);
      setTimeout(() => setGuardando(false), 1000);
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, paso, tieneBeca, codigoBeca, becaTotal]);

  // Manejadores
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleDelegadoChange = (delegacionIndex, delegadoKey, field, value) => {
    const nuevasDelegaciones = [...formData.delegaciones];
    nuevasDelegaciones[delegacionIndex] = {
      ...nuevasDelegaciones[delegacionIndex],
      [delegadoKey]: { ...nuevasDelegaciones[delegacionIndex][delegadoKey], [field]: value },
    };
    setFormData((prev) => ({ ...prev, delegaciones: nuevasDelegaciones }));
  };

  const handlePreferenciaPaisDelegacion = (delegacionIndex, campo, valor) => {
    const nuevasDelegaciones = [...formData.delegaciones];
    nuevasDelegaciones[delegacionIndex] = { ...nuevasDelegaciones[delegacionIndex], [campo]: valor };
    setFormData((prev) => ({ ...prev, delegaciones: nuevasDelegaciones }));
  };

  const togglePareja = (delegacionIndex) => {
    const nuevasDelegaciones = [...formData.delegaciones];
    nuevasDelegaciones[delegacionIndex].tiene_pareja = !nuevasDelegaciones[delegacionIndex].tiene_pareja;

    if (!nuevasDelegaciones[delegacionIndex].tiene_pareja) {
      nuevasDelegaciones[delegacionIndex].delegado_2 = {
        nombre: '', rut: '', edad: '', curso: '',
        pais_preferencia_1: '', pais_preferencia_2: '', pais_preferencia_3: '',
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
          delegado_1: { nombre: '', rut: '', edad: '', curso: '', pais_preferencia_1: '', pais_preferencia_2: '', pais_preferencia_3: '' },
          delegado_2: { nombre: '', rut: '', edad: '', curso: '', pais_preferencia_1: '', pais_preferencia_2: '', pais_preferencia_3: '' },
          tiene_pareja: false,
          pais_preferencia_1: '', pais_preferencia_2: '', pais_preferencia_3: '',
        });
      }
    } else {
      delegacionesActuales.splice(num);
    }
    setFormData((prev) => ({ ...prev, cantidad_delegaciones: num, delegaciones: delegacionesActuales }));
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
      setFormData((prev) => ({ ...prev, comprobante_base64: event.target.result, comprobante_nombre: file.name }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

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

  const validarRutSimple = (documento) => {
    if (!documento || documento.trim() === '') return true;
    const docLimpio = documento.replace(/[\.\-\s\/]/g, '').trim();
    if (docLimpio === '') return true;
    if (docLimpio.length >= 5) return true;
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
          throw new Error('Debe ingresar la información requerida del profesor responsable.');
        }
        if (!formData.profesor_email.includes('@')) {
          throw new Error('El correo electrónico indicado para el profesor no es válido.');
        }
        if (!validarRutSimple(formData.profesor_rut)) {
          throw new Error('El número de documento de identidad ingresado para el profesor no parece válido. Por favor verifique.');
        }
        break;
      case 3:
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
          if (!validarRutSimple(d1.rut)) throw new Error(`El documento del Delegado 1 en la Delegación ${i + 1} no parece válido.`);
          if (del.tiene_pareja) {
            const d2 = del.delegado_2;
            if (!d2.nombre || !d2.rut || !d2.edad || !d2.curso) throw new Error(`Complete todos los campos del Delegado 2 en la Delegación ${i + 1}.`);
            if (!validarRutSimple(d2.rut)) throw new Error(`El documento del Delegado 2 en la Delegación ${i + 1} no parece válido.`);
            if (d1.rut === d2.rut) throw new Error(`Los representantes de la Delegación ${i + 1} no pueden tener el mismo documento.`);
          }
          if (!del.pais_preferencia_1 || !del.pais_preferencia_2 || !del.pais_preferencia_3) {
            throw new Error(`Debe seleccionar las 3 preferencias de país para la Delegación ${i + 1}.`);
          }
        }
        break;
      case 4:
        if (tieneBeca) {
          if (!codigoBeca || codigoBeca.trim() === '') throw new Error('Si tiene beca, debe ingresar el código asignado.');
          if (becaTotal && !comprobanteBeca) throw new Error('Para beca total, debe adjuntar el correo de confirmación oficial.');
          if (!becaTotal && !formData.comprobante_base64) throw new Error('Debe adjuntar el comprobante de pago con el descuento aplicado.');
        } else {
          if (!formData.comprobante_base64) throw new Error('Debe adjuntar el comprobante oficial de transferencia bancaria.');
        }
        if (!formData.acepta_terminos || !formData.acepta_reglamento || !formData.acepta_datos) {
          throw new Error('Para finalizar la inscripción, debe aceptar todos los acuerdos y normativas requeridas.');
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pasoAnterior = () => {
    setPaso((prev) => Math.max(prev - 1, 1));
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calcularMonto = () => {
    const tipo = formData.tipo_establecimiento;
    if (!tipo) return { total: 0, moneda: 'CLP', descripcion: '' };
    
    const esExtranjero = formData.pais_origen !== 'Chile';
    let precioPorPersona, moneda, descripcion;
    
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
    
    let total = 0;
    formData.delegaciones.forEach((del) => {
      total += precioPorPersona;
      if (del.tiene_pareja) total += precioPorPersona;
    });
    
    if (tieneBeca && !becaTotal) {
      const descuento = CONFIG_INSCRIPCION.pago.becas.descuento_porcentaje;
      total = total - (total * descuento / 100);
      descripcion += ` (Descuento institucional del ${descuento}%)`;
    } else if (tieneBeca && becaTotal) {
      total = 0;
      descripcion = 'Cobertura Total - Beca Institucional';
    }
    
    return { total, moneda, descripcion };
  };

  const contarDelegados = () => {
    return formData.delegaciones.reduce((acc, del) => acc + (del.tiene_pareja ? 2 : 1), 0);
  };

  const enviarFormulario = async () => {
    try {
      validarPaso(4);
      setEnviando(true);
      const datosCompletos = {
        ...formData,
        beca: { tieneBeca, codigoBeca, becaTotal, comprobanteBeca, comprobanteBecaNombre },
        monto: calcularMonto()
      };

      const response = await fetch('/api/inscripciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCompletos),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error de conexión con el servidor central.');
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

  const montoCalculado = calcularMonto();

  // Textos dinámicos para la guía lateral
  const textosGuia = {
    1: { titulo: "Identificación de la Institución", texto: "El primer paso para participar comienza por su establecimiento. Complete los datos de la institución que representará a sus estudiantes." },
    2: { titulo: "Profesor Responsable", texto: "La comunicación directa es fundamental. Indique quién estará a cargo de guiar y supervisar a los participantes durante todo el proceso." },
    3: { titulo: "Registro de Delegaciones", texto: "Configure su equipo. Asigne los representantes y las preferencias de países. Cada estudiante es importante en el desarrollo del evento." },
    4: { titulo: "Confirmación y Pago", texto: "El último paso para completar su registro. Adjunte el comprobante de pago o la documentación de beca correspondiente." }
  };

  // Componente Input Reutilizable
  const InputEditorial = ({ label, type = "text", ...props }) => (
    <div className="relative group">
      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</label>
      <input
        type={type}
        className="w-full bg-slate-50/50 border-0 border-b-2 border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-[#003366] focus:ring-0 transition-all outline-none"
        {...props}
      />
    </div>
  );

  const SelectEditorial = ({ label, children, ...props }) => (
    <div className="relative group">
      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</label>
      <select
        className="w-full bg-slate-50/50 border-0 border-b-2 border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-[#003366] focus:ring-0 transition-all outline-none appearance-none cursor-pointer"
        {...props}
      >
        {children}
      </select>
    </div>
  );


  // MODAL LEGAL
  const ModalTerminosLegales = () => (
    <AnimatePresence>
      {mostrarModalLegal && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setMostrarModalLegal(false)}
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 20 }}
            className="bg-white max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-none shadow-2xl border-t-4 border-[#003366]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 px-8 py-6 flex items-center justify-between">
              <h2 className="text-xl font-serif text-[#003366]">{CONFIG_INSCRIPCION.legal.tratamiento_datos.titulo}</h2>
              <button onClick={() => setMostrarModalLegal(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 text-sm text-slate-600 leading-relaxed whitespace-pre-line font-serif">
              {CONFIG_INSCRIPCION.legal.tratamiento_datos.texto_completo}
            </div>
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-8 py-5 flex gap-4">
              <button onClick={() => setMostrarModalLegal(false)} className="flex-1 px-4 py-3 bg-white border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors">
                Cerrar Documento
              </button>
              <button onClick={() => { setFormData(prev => ({ ...prev, acepta_datos: true })); setMostrarModalLegal(false); }} className="flex-1 px-4 py-3 bg-[#003366] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#002244] transition-colors">
                Aceptar y Confirmar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // PANTALLA DE CONFIRMACIÓN
  if (enviado) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4 font-sans">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl w-full bg-white shadow-xl border border-slate-200 p-10 relative overflow-hidden">
          {/* Marca de agua decorativa */}
          <div className="absolute -right-20 -top-20 opacity-[0.03] pointer-events-none">
            <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          
          <div className="border-b-2 border-[#003366] pb-6 mb-8 text-center relative z-10">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#418FDE]">Confirmación de Secretaría</span>
            <h2 className="font-serif text-3xl text-[#003366] mt-2">Inscripción Exitosa</h2>
          </div>

          <div className="space-y-6 relative z-10">
            <p className="text-sm text-slate-600 leading-relaxed text-justify font-serif">
              Por la presente se certifica que la solicitud de inscripción presentada por la institución <strong>{formData.nombre_establecimiento}</strong> ha sido ingresada correctamente en los registros oficiales del Modelo de Naciones Unidas para Secundarios.
            </p>

            <div className="bg-slate-50 border border-slate-200 p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-200">Resumen de la Solicitud</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-slate-500">Profesor a Cargo:</div>
                <div className="font-medium text-slate-900 text-right">{formData.profesor_nombre} {formData.profesor_apellido}</div>
                <div className="text-slate-500">País de Origen:</div>
                <div className="font-medium text-slate-900 text-right">{formData.pais_origen}</div>
                <div className="text-slate-500">Total de Participantes:</div>
                <div className="font-medium text-slate-900 text-right">{formData.cantidad_delegaciones} Delegaciones ({contarDelegados()} estudiantes)</div>
                <div className="text-slate-500 pt-4 border-t border-slate-200">Monto Total:</div>
                <div className="font-bold text-[#003366] text-right pt-4 border-t border-slate-200">
                  {montoCalculado.total === 0 ? 'Beca Institucional' : `${montoCalculado.moneda === 'USD' ? 'USD $' : '$'}${montoCalculado.total.toLocaleString('es-CL')} ${montoCalculado.moneda}`}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center italic">
              Se ha enviado un comprobante preliminar y los próximos pasos al correo institucional registrado ({formData.profesor_email}).
            </p>
          </div>

          <div className="mt-10 text-center">
            <button onClick={() => window.close()} className="bg-[#003366] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-[#002244] transition-colors">
              Finalizar y Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-slate-800 font-sans selection:bg-[#418FDE] selection:text-white">
      <ModalTerminosLegales />
      
      {/* ENCABEZADO INSTITUCIONAL */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center">
  <img 
    src="https://www.munsec.org/munsec.png" 
    alt="Logo MUNSEC" 
    className="w-full h-full object-contain"
  />
</div>
            <div>
              <h1 className="text-sm font-bold text-[#003366] tracking-wide">MUNSEC {CONFIG_INSCRIPCION.año}</h1>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Portal de Inscripción Oficial</span>
            </div>
          </div>
          
          {/* Barra de progreso (Móvil) */}
          <div className="lg:hidden flex items-center gap-3">
            <span className="text-xs font-bold text-[#003366]">Paso {paso}/4</span>
            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#418FDE] transition-all" style={{ width: `${(paso / 4) * 100}%` }} />
            </div>
          </div>
        </div>
      </header>

      {/* NOTIFICACIÓN DE GUARDADO AUTOMÁTICO */}
      <AnimatePresence>
        {guardando && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-20 right-6 bg-white border border-slate-200 shadow-lg px-4 py-3 flex items-center gap-3 z-50">
            <div className="w-2 h-2 rounded-full bg-[#418FDE] animate-ping" />
            <span className="text-xs font-medium text-slate-600">Guardando información...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* COLUMNA LATERAL: GUÍA DE AYUDA */}
          <div className="hidden lg:block w-1/3 sticky top-32 space-y-8">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#418FDE] mb-2">Progreso del Registro</p>
              <div className="h-1 w-full bg-slate-200 overflow-hidden mb-6">
                <div className="h-full bg-[#003366] transition-all duration-700 ease-out" style={{ width: `${(paso / 4) * 100}%` }} />
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={paso}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-serif text-[#003366] mb-4 leading-tight">
                    {textosGuia[paso].titulo}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed font-serif">
                    {textosGuia[paso].texto}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nota de ayuda adicional */}
            <div className="p-5 bg-white border-l-2 border-[#418FDE] shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Información Importante</span>
              <p className="text-xs text-slate-500 leading-relaxed">
                {paso === 1 && "Verifique que el nombre de la institución sea el oficial, ya que así figurará en los documentos y certificados."}
                {paso === 2 && "El profesor a cargo será el único medio autorizado para recibir información y modificaciones sobre las asignaciones."}
                {paso === 3 && "Las delegaciones individuales serán agrupadas estratégicamente por el Comité Organizador según disponibilidad."}
                {paso === 4 && "Los documentos adjuntos deben ser legibles. Evite recortes que omitan códigos de transacción o datos importantes."}
              </p>
            </div>
          </div>

          {/* COLUMNA PRINCIPAL: FORMULARIO */}
          <div className="w-full lg:w-2/3">
            
            {/* Aviso de Errores */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
                  <div className="bg-red-50 border-l-4 border-red-600 p-5 shadow-sm flex justify-between items-start">
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-red-800">Corrección Necesaria</h4>
                      <p className="text-sm text-red-700 mt-1 font-serif">{error}</p>
                    </div>
                    <button onClick={() => setError('')} className="text-red-400 hover:text-red-700 text-xl font-light">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-12">
              
              {/* PASO 1: DATOS DEL ESTABLECIMIENTO */}
              {paso === 1 && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                  <div className="lg:hidden mb-8 border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-serif text-[#003366]">{textosGuia[paso].titulo}</h2>
                    <p className="text-sm text-slate-500 mt-2">{textosGuia[paso].texto}</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4">Tipo de Establecimiento *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className={`relative p-5 cursor-pointer border-2 transition-all ${formData.tipo_establecimiento === 'publico' ? 'border-[#003366] bg-slate-50' : 'border-slate-100 hover:border-slate-300'}`}>
                        <input type="radio" name="tipo_establecimiento" value="publico" checked={formData.tipo_establecimiento === 'publico'} onChange={handleChange} className="absolute opacity-0" />
                        <span className="block font-serif font-semibold text-[#003366] text-base mb-1">Público / Subvencionado</span>
                        <span className="block text-xs text-slate-500 leading-tight">Establecimientos municipales, SLEP o con aporte estatal.</span>
                      </label>
                      <label className={`relative p-5 cursor-pointer border-2 transition-all ${formData.tipo_establecimiento === 'privado' ? 'border-[#003366] bg-slate-50' : 'border-slate-100 hover:border-slate-300'}`}>
                        <input type="radio" name="tipo_establecimiento" value="privado" checked={formData.tipo_establecimiento === 'privado'} onChange={handleChange} className="absolute opacity-0" />
                        <span className="block font-serif font-semibold text-[#003366] text-base mb-1">Particular Pagado</span>
                        <span className="block text-xs text-slate-500 leading-tight">Colegios privados e instituciones internacionales.</span>
                      </label>
                    </div>
                  </div>

                  <SelectEditorial label="País de Origen *" name="pais_origen" value={formData.pais_origen} onChange={handleChange}>
                    {['Chile', 'Argentina', 'Perú', 'Bolivia', 'Colombia', 'Brasil', 'Ecuador', 'Uruguay', 'Paraguay', 'Otro'].map(p => <option key={p} value={p}>{p}</option>)}
                  </SelectEditorial>

                  <InputEditorial label="Nombre de la Institución *" name="nombre_establecimiento" value={formData.nombre_establecimiento} onChange={handleChange} placeholder="Ej. Instituto Nacional" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputEditorial label="Ciudad *" name="ciudad" value={formData.ciudad} onChange={handleChange} placeholder="Ciudad de origen" />
                    <InputEditorial label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Calle y número" />
                  </div>

                  <InputEditorial label="Teléfono de Contacto Institucional" name="telefono_establecimiento" type="tel" value={formData.telefono_establecimiento} onChange={handleChange} placeholder="+56 2 0000 0000" />
                </motion.div>
              )}

              {/* PASO 2: DATOS DEL PROFESOR */}
              {paso === 2 && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div className="lg:hidden mb-8 border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-serif text-[#003366]">{textosGuia[paso].titulo}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputEditorial label="Nombres del Profesor *" name="profesor_nombre" value={formData.profesor_nombre} onChange={handleChange} />
                    <InputEditorial label="Apellidos *" name="profesor_apellido" value={formData.profesor_apellido} onChange={handleChange} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputEditorial label={formData.pais_origen === 'Chile' ? 'RUT *' : 'Pasaporte / ID *'} name="profesor_rut" value={formData.profesor_rut} onChange={handleChange} />
                    <InputEditorial label="Edad (Años)" name="profesor_edad" type="number" value={formData.profesor_edad} onChange={handleChange} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputEditorial label="Correo Electrónico de Contacto *" name="profesor_email" type="email" value={formData.profesor_email} onChange={handleChange} />
                    <InputEditorial label="Teléfono Móvil Directo *" name="profesor_telefono" type="tel" value={formData.profesor_telefono} onChange={handleChange} />
                  </div>
                  
                  <InputEditorial label="Departamento o Asignatura" name="profesor_asignatura" value={formData.profesor_asignatura} onChange={handleChange} placeholder="Ej. Historia y Ciencias Sociales" />
                </motion.div>
              )}

              {/* PASO 3: DELEGACIONES */}
              {paso === 3 && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                  <div className="lg:hidden mb-8 border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-serif text-[#003366]">{textosGuia[paso].titulo}</h2>
                  </div>

                  <div className="bg-slate-50 p-6 border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                      <h3 className="font-serif text-[#003366] font-bold text-lg">Cantidad de Delegaciones</h3>
                      <p className="text-xs text-slate-500">Mínimo {CONFIG_INSCRIPCION.requisitos.delegacion.minimo} — Máximo {CONFIG_INSCRIPCION.requisitos.delegacion.maximo}</p>
                    </div>
                    <select
                      value={formData.cantidad_delegaciones}
                      onChange={(e) => actualizarCantidadDelegaciones(e.target.value)}
                      className="bg-white border-2 border-[#003366] text-[#003366] font-bold text-center w-32 h-12 outline-none cursor-pointer"
                    >
                      {Array.from({ length: CONFIG_INSCRIPCION.requisitos.delegacion.maximo - CONFIG_INSCRIPCION.requisitos.delegacion.minimo + 1 }, (_, i) => i + CONFIG_INSCRIPCION.requisitos.delegacion.minimo).map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Delegación' : 'Delegaciones'}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-12">
                    {formData.delegaciones.map((delegacion, delIndex) => (
                      <div key={delegacion.id} className="relative pt-6">
                        <div className="absolute top-0 left-0 w-16 h-1 bg-[#418FDE]"></div>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                          <h3 className="text-xl font-serif text-[#003366] font-bold">Delegación {delIndex + 1}</h3>
                          
                          <label className="flex items-center gap-3 cursor-pointer bg-slate-50 px-4 py-2 border border-slate-200 hover:bg-slate-100 transition-colors">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Representación en Pareja</span>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${delegacion.tiene_pareja ? 'bg-[#003366]' : 'bg-slate-300'}`}>
                              <input type="checkbox" className="sr-only" checked={delegacion.tiene_pareja} onChange={() => togglePareja(delIndex)} />
                              <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${delegacion.tiene_pareja ? 'translate-x-5' : ''}`} />
                            </div>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          <div className="p-6 border border-slate-100 bg-white shadow-sm space-y-5">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#418FDE]">Representante Titular</span>
                            <InputEditorial label="Nombre Completo" value={delegacion.delegado_1.nombre} onChange={(e) => handleDelegadoChange(delIndex, 'delegado_1', 'nombre', e.target.value)} />
                            <InputEditorial label={formData.pais_origen === 'Chile' ? 'RUT' : 'Doc. de Identidad'} value={delegacion.delegado_1.rut} onChange={(e) => handleDelegadoChange(delIndex, 'delegado_1', 'rut', e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                              <InputEditorial label="Edad" type="number" min={CONFIG_INSCRIPCION.requisitos.edad.minimo} max={CONFIG_INSCRIPCION.requisitos.edad.maximo} value={delegacion.delegado_1.edad} onChange={(e) => handleDelegadoChange(delIndex, 'delegado_1', 'edad', e.target.value)} />
                              <SelectEditorial label="Curso" value={delegacion.delegado_1.curso} onChange={(e) => handleDelegadoChange(delIndex, 'delegado_1', 'curso', e.target.value)}>
                                <option value="">- Seleccione -</option>
                                <option value="1° Medio">1° Medio</option>
                                <option value="2° Medio">2° Medio</option>
                                <option value="3° Medio">3° Medio</option>
                                <option value="4° Medio">4° Medio</option>
                              </SelectEditorial>
                            </div>
                          </div>

                          {delegacion.tiene_pareja ? (
                            <div className="p-6 border border-slate-100 bg-slate-50/50 shadow-sm space-y-5">
                              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#003366]">Compañero de Delegación</span>
                              <InputEditorial label="Nombre Completo" value={delegacion.delegado_2.nombre} onChange={(e) => handleDelegadoChange(delIndex, 'delegado_2', 'nombre', e.target.value)} />
                              <InputEditorial label={formData.pais_origen === 'Chile' ? 'RUT' : 'Doc. de Identidad'} value={delegacion.delegado_2.rut} onChange={(e) => handleDelegadoChange(delIndex, 'delegado_2', 'rut', e.target.value)} />
                              <div className="grid grid-cols-2 gap-4">
                                <InputEditorial label="Edad" type="number" value={delegacion.delegado_2.edad} onChange={(e) => handleDelegadoChange(delIndex, 'delegado_2', 'edad', e.target.value)} />
                                <SelectEditorial label="Curso" value={delegacion.delegado_2.curso} onChange={(e) => handleDelegadoChange(delIndex, 'delegado_2', 'curso', e.target.value)}>
                                  <option value="">- Seleccione -</option>
                                  <option value="1° Medio">1° Medio</option>
                                  <option value="2° Medio">2° Medio</option>
                                  <option value="3° Medio">3° Medio</option>
                                  <option value="4° Medio">4° Medio</option>
                                </SelectEditorial>
                              </div>
                            </div>
                          ) : (
                            <div className="p-6 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center opacity-70">
                              <div className="w-12 h-12 mb-2 text-slate-300">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                </svg>
                              </div>
                              <p className="text-xs font-serif text-slate-500">Delegación individual.<br/>El Comité Organizador asignará un compañero.</p>
                            </div>
                          )}
                        </div>

                        {/* Preferencias de Países */}
                        <div className="bg-white border-l-4 border-[#003366] pl-6 py-2">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600 mb-4">Preferencias de Países Solicitados</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[1, 2, 3].map((pref) => (
                              <SelectEditorial key={pref} label={`Prioridad ${pref}`} value={delegacion[`pais_preferencia_${pref}`] || ''} onChange={(e) => handlePreferenciaPaisDelegacion(delIndex, `pais_preferencia_${pref}`, e.target.value)}>
                                <option value="">Seleccionar País...</option>
                                {CONFIG_INSCRIPCION.comisiones[0].paises_disponibles.map(pais => <option key={pais} value={pais}>{pais}</option>)}
                              </SelectEditorial>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* PASO 4: PAGO Y CONFIRMACIÓN */}
              {paso === 4 && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                  <div className="lg:hidden mb-8 border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-serif text-[#003366]">{textosGuia[paso].titulo}</h2>
                  </div>

                  {/* Sección Becas */}
                  {CONFIG_INSCRIPCION.pago.becas.habilitadas && (
                    <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                        <div>
                          <h3 className="font-serif font-bold text-lg text-[#003366]">Gestión de Becas</h3>
                          <p className="text-xs text-slate-500">Sujeta a verificación por parte del equipo organizador.</p>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Aplicar Código</span>
                          <div className={`w-10 h-5 rounded-full relative transition-colors ${tieneBeca ? 'bg-[#003366]' : 'bg-slate-300'}`}>
                            <input type="checkbox" className="sr-only" checked={tieneBeca} onChange={() => {
                              setTieneBeca(!tieneBeca);
                              if (tieneBeca) { setCodigoBeca(''); setBecaTotal(false); setComprobanteBeca(null); setComprobanteBecaNombre(null); }
                            }} />
                            <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${tieneBeca ? 'translate-x-5' : ''}`} />
                          </div>
                        </label>
                      </div>

                      <AnimatePresence>
                        {tieneBeca && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-6 pt-4 border-t border-slate-200 overflow-hidden">
                            <InputEditorial label="Código de Beca" value={codigoBeca} onChange={(e) => setCodigoBeca(e.target.value)} placeholder="Ej. B-MUNSEC-26" />
                            
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">Cobertura Asignada</label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className={`p-4 border cursor-pointer transition-all ${becaTotal ? 'border-[#003366] bg-white ring-1 ring-[#003366]' : 'border-slate-200 bg-white/50'}`}>
                                  <div className="flex items-center justify-between">
                                    <span className="font-serif font-semibold text-sm">Cobertura Total (100%)</span>
                                    <input type="radio" checked={becaTotal} onChange={() => setBecaTotal(true)} className="accent-[#003366]" />
                                  </div>
                                </label>
                                <label className={`p-4 border cursor-pointer transition-all ${!becaTotal ? 'border-[#003366] bg-white ring-1 ring-[#003366]' : 'border-slate-200 bg-white/50'}`}>
                                  <div className="flex items-center justify-between">
                                    <span className="font-serif font-semibold text-sm">Descuento Parcial</span>
                                    <input type="radio" checked={!becaTotal} onChange={() => setBecaTotal(false)} className="accent-[#003366]" />
                                  </div>
                                </label>
                              </div>
                            </div>

                            {becaTotal && (
                              <div>
                                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Documento Adjunto (Correo de confirmación)</label>
                                {!comprobanteBeca ? (
                                  <label className="border-2 border-dashed border-slate-300 p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-colors">
                                    <input type="file" accept="image/*" onChange={handleComprobanteBeca} className="hidden" />
                                    <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                    <span className="text-sm font-semibold text-[#003366]">Subir documento</span>
                                    <span className="text-xs text-slate-400 mt-1">JPG, PNG (Máx 2MB)</span>
                                  </label>
                                ) : (
                                  <div className="border border-slate-200 p-4 bg-white flex items-center justify-between">
                                    <span className="text-xs font-semibold text-[#003366] truncate">{comprobanteBecaNombre}</span>
                                    <button type="button" onClick={() => { setComprobanteBeca(null); setComprobanteBecaNombre(null); }} className="text-[10px] uppercase font-bold text-red-500 hover:text-red-700">Eliminar</button>
                                  </div>
                                )}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Resumen de Pago */}
                  {(!tieneBeca || !becaTotal) && (
                    <div className="border border-slate-200 p-6 sm:p-8">
                      <h3 className="font-serif font-bold text-lg text-[#003366] mb-6">Detalle de Pago</h3>
                      
                      <div className="bg-[#0A1930] text-slate-300 p-6 font-mono text-sm space-y-2 mb-6">
                        <div className="flex justify-between pb-2 border-b border-slate-700"><span>Banco</span> <span className="text-white">{CONFIG_INSCRIPCION.pago.cuenta.banco}</span></div>
                        <div className="flex justify-between pb-2 border-b border-slate-700"><span>Tipo de Cuenta</span> <span className="text-white">{CONFIG_INSCRIPCION.pago.cuenta.tipo}</span></div>
                        <div className="flex justify-between pb-2 border-b border-slate-700"><span>Número de Cuenta</span> <span className="text-white font-bold">{CONFIG_INSCRIPCION.pago.cuenta.numero}</span></div>
                        <div className="flex justify-between pb-2 border-b border-slate-700"><span>Titular</span> <span className="text-white text-right">{CONFIG_INSCRIPCION.pago.cuenta.titular}</span></div>
                        <div className="flex justify-between"><span>RUT</span> <span className="text-white">{CONFIG_INSCRIPCION.pago.cuenta.rut}</span></div>
                      </div>

                      <div className="flex items-end justify-between border-b-2 border-[#003366] pb-4 mb-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Monto Total a Pagar</span>
                        <span className="font-serif text-3xl font-bold text-[#003366]">
                          {montoCalculado.moneda === 'USD' ? 'USD $' : '$'}{montoCalculado.total.toLocaleString('es-CL')}
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Comprobante de Transferencia *</label>
                        {!formData.comprobante_base64 ? (
                          <label className="border-2 border-dashed border-slate-300 p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-white transition-colors">
                            <input type="file" accept="image/*" onChange={handleComprobante} className="hidden" />
                            <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <span className="text-sm font-semibold text-[#003366]">Adjuntar Comprobante</span>
                            <span className="text-xs text-slate-400 mt-1">Legible y completo (Máx 2MB)</span>
                          </label>
                        ) : (
                          <div className="border border-slate-200 p-4 bg-white flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              <span className="text-xs font-semibold text-emerald-600 truncate">{formData.comprobante_nombre}</span>
                            </div>
                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, comprobante_base64: null, comprobante_nombre: null }))} className="text-[10px] uppercase font-bold text-red-500 hover:text-red-700">Reemplazar</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Si es beca total, mostrar panel informativo */}
                  {tieneBeca && becaTotal && (
                    <div className="bg-amber-50 border border-amber-200 p-6">
                      <h3 className="font-serif font-bold text-lg text-amber-800 mb-2">Beca Total Aplicada</h3>
                      <p className="text-sm text-amber-700">
                        Has aplicado una beca del 100%. El equipo de MUNSEC verificará internamente tu documentación.
                        No se requiere pago adicional.
                      </p>
                    </div>
                  )}

                  {/* Aceptación de Términos */}
                  <div className="space-y-4 pt-6 border-t-2 border-slate-100">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-6">Declaración y Aceptación</h3>
                    
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="pt-1">
                        <input type="checkbox" name="acepta_terminos" checked={formData.acepta_terminos} onChange={handleChange} className="w-4 h-4 accent-[#003366]" />
                      </div>
                      <span className="text-sm text-slate-600 leading-snug group-hover:text-slate-900 transition-colors font-serif">
                        Acepto los términos y condiciones de participación establecidos para la presente edición de MUNSEC.
                      </span>
                    </label>

                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="pt-1">
                        <input type="checkbox" name="acepta_reglamento" checked={formData.acepta_reglamento} onChange={handleChange} className="w-4 h-4 accent-[#003366]" />
                      </div>
                      <span className="text-sm text-slate-600 leading-snug group-hover:text-slate-900 transition-colors font-serif">
                        Declaro haber informado a los participantes sobre el Reglamento Interno y asumo la responsabilidad de su cumplimiento.
                      </span>
                    </label>

                    <div className="flex items-start gap-4">
                      <div className="pt-1">
                        <input type="checkbox" name="acepta_datos" checked={formData.acepta_datos} onChange={handleChange} className="w-4 h-4 accent-[#003366]" />
                      </div>
                      <div>
                        <span className="text-sm text-slate-600 leading-snug block font-serif">
                          Autorizo el tratamiento de datos personales e institucionales para los fines exclusivos del desarrollo del evento.
                        </span>
                        <button type="button" onClick={() => setMostrarModalLegal(true)} className="text-[11px] font-bold uppercase tracking-widest text-[#418FDE] mt-2 hover:text-[#003366] transition-colors">
                          Revisar Documento Legal Completo
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* BARRA DE NAVEGACIÓN INFERIOR */}
            <div className="mt-10 flex items-center justify-between">
              <div>
                {paso > 1 && (
                  <button type="button" onClick={pasoAnterior} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#003366] transition-colors py-2">
                    <svg className="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Volver a Sección Anterior
                  </button>
                )}
              </div>
              
              <div>
                {paso < 4 ? (
                  <button type="button" onClick={siguientePaso} className="bg-[#003366] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-[#002244] transition-colors shadow-lg shadow-[#003366]/20 flex items-center gap-2">
                    Continuar
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                ) : (
                  <button type="button" onClick={enviarFormulario} disabled={enviando} className="bg-[#003366] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-[#002244] transition-colors disabled:bg-slate-400 disabled:shadow-none shadow-lg shadow-[#003366]/30 flex items-center gap-3">
                    {enviando && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    {enviando ? 'Enviando Información...' : 'Finalizar y Enviar Inscripción'}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}