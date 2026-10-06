'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  CONFIG_INSCRIPCION,
  verificarEstadoInscripciones,
  esModoPrueba,
} from '@/config/inscripcion';

// ============================================================
// COMPONENTES UI (FUERA del componente para evitar remounts)
// ============================================================

const CampoError = ({ mensaje }) => {
  if (!mensaje) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2 mt-2 pl-1"
    >
      <svg
        className="w-3.5 h-3.5 text-[#B22234] mt-0.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <span className="text-[11px] font-serif italic text-[#B22234] leading-snug">
        {mensaje}
      </span>
    </motion.div>
  );
};

const OficialInput = ({ label, type = 'text', error, id, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full" id={id}>
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
      {label}
    </label>
    <input
      type={type}
      className={`w-full bg-white border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-shadow rounded-sm ${
        error
          ? 'border-[#B22234] focus:border-[#B22234] focus:ring-[#B22234]'
          : 'border-slate-300 focus:border-[#003366] focus:ring-[#003366]'
      }`}
      {...props}
    />
    <CampoError mensaje={error} />
  </div>
);

const OficialSelect = ({ label, children, error, id, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full" id={id}>
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
      {label}
    </label>
    <select
      className={`w-full bg-white border px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-1 transition-shadow rounded-sm appearance-none cursor-pointer ${
        error
          ? 'border-[#B22234] focus:border-[#B22234] focus:ring-[#B22234]'
          : 'border-slate-300 focus:border-[#003366] focus:ring-[#003366]'
      }`}
      {...props}
    >
      {children}
    </select>
    <CampoError mensaje={error} />
  </div>
);

const OficialTextarea = ({ label, error, id, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full" id={id}>
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
      {label}
    </label>
    <textarea
      className={`w-full bg-white border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-shadow rounded-sm min-h-[100px] resize-y ${
        error
          ? 'border-[#B22234] focus:border-[#B22234] focus:ring-[#B22234]'
          : 'border-slate-300 focus:border-[#003366] focus:ring-[#003366]'
      }`}
      {...props}
    />
    <CampoError mensaje={error} />
  </div>
);

const BloqueConError = ({ error, id, children, className = '' }) => (
  <div
    id={id}
    className={`transition-all duration-300 ${
      error
        ? 'pl-3 border-l-2 border-[#B22234] bg-[#B22234]/[0.03] rounded-sm py-1'
        : ''
    } ${className}`}
  >
    {children}
    <CampoError mensaje={error} />
  </div>
);

const ModalTerminosLegales = ({ abierto, onCerrar, onAceptar }) => (
  <AnimatePresence>
    {abierto && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
        onClick={onCerrar}
      >
        <motion.div
          initial={{ scale: 0.98, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.98, opacity: 0, y: 10 }}
          className="bg-white max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-sm shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between z-10">
            <h2 className="text-lg font-serif font-semibold text-[#003366]">
              {CONFIG_INSCRIPCION.legal.tratamiento_datos.titulo}
            </h2>
            <button
              onClick={onCerrar}
              className="text-slate-400 hover:text-slate-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className="legal-content p-8 text-sm text-slate-700 leading-relaxed font-serif
              [&_h1]:text-2xl [&_h1]:font-serif [&_h1]:font-semibold [&_h1]:text-[#003366] [&_h1]:mt-6 [&_h1]:mb-3 [&_h1:first-child]:mt-0
              [&_h2]:text-xl [&_h2]:font-serif [&_h2]:font-semibold [&_h2]:text-[#003366] [&_h2]:mt-6 [&_h2]:mb-3
              [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#003366] [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:uppercase [&_h3]:tracking-wider
              [&_p]:my-3
              [&_strong]:font-semibold [&_strong]:text-slate-900
              [&_em]:italic
              [&_u]:underline
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ul]:space-y-1
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_ol]:space-y-1
              [&_li]:leading-relaxed
              [&_a]:text-[#418FDE] [&_a]:underline hover:[&_a]:text-[#003366]
              [&_blockquote]:border-l-2 [&_blockquote]:border-[#418FDE] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:my-4
              [&_hr]:border-slate-200 [&_hr]:my-6
              [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
              [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-50 [&_th]:p-2 [&_th]:text-left [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wider
              [&_td]:border [&_td]:border-slate-300 [&_td]:p-2
              [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono
            "
            dangerouslySetInnerHTML={{
              __html:
                CONFIG_INSCRIPCION.legal.tratamiento_datos.texto_completo ||
                CONFIG_INSCRIPCION.legal.tratamiento_datos.texto ||
                '',
            }}
          />

          <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-8 py-4 flex justify-end gap-3 z-10">
            <button
              onClick={onCerrar}
              className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors rounded-sm"
            >
              Cerrar
            </button>
            <button
              onClick={onAceptar}
              className="px-5 py-2.5 bg-[#003366] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#002244] transition-colors rounded-sm"
            >
              Aceptar
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function FormularioInscripcion() {
  const router = useRouter();

  const [modoPrueba, setModoPrueba] = useState(false);

  useEffect(() => {
    const prueba = esModoPrueba();
    setModoPrueba(prueba);

    const estado = verificarEstadoInscripciones(prueba);
    if (!estado.abiertas) {
      router.push('/register');
    }
  }, [router]);

  const [paso, setPaso] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [erroresCampos, setErroresCampos] = useState({});
  const [mostrarModalLegal, setMostrarModalLegal] = useState(false);

  const [formData, setFormData] = useState({
    // Paso 1
    tipo_establecimiento: '',
    pais_origen: 'Chile',
    pais_origen_otro: '',
    nombre_establecimiento: '',
    ciudad: '',
    direccion: '',
    telefono_establecimiento: '',

    // Paso 2
    profesor_nombre: '',
    profesor_apellido: '',
    profesor_rut: '',
    profesor_email: '',
    profesor_telefono: '',
    profesor_edad: '',
    profesor_asignatura: '',

    // Paso 3
    cantidad_delegaciones: 1,
    motivacion: '',
    experiencia_previa: 'no',
    experiencia_detalle: '',
    delegaciones: [
      {
        id: Date.now(),
        delegado_1: { nombre: '', rut: '', edad: '', curso: '' },
        delegado_2: { nombre: '', rut: '', edad: '', curso: '' },
        tiene_pareja: false,
        pais_preferencia_1: '',
        pais_preferencia_2: '',
        pais_preferencia_3: '',
      },
    ],

    // Paso 4
    requiere_apoyo: 'no',
    apoyo_delegado: '',
    apoyo_descripcion: '',
    apoyo_coordinacion: 'no',
    apoyo_observaciones: '',
    tiene_restriccion: 'no',
    restriccion_delegado: '',
    restriccion_tipo: [],
    restriccion_detalle: '',

    // Paso 5
    acepta_terminos: false,
    acepta_reglamento: false,
    acepta_datos: false,
  });

  const datosCargados = useRef(false);
  useEffect(() => {
    if (datosCargados.current) return;
    datosCargados.current = true;

    const guardado = localStorage.getItem('munsec_inscripcion');
    const pasoGuardado = localStorage.getItem('munsec_paso');

    if (guardado) {
      try {
        const datos = JSON.parse(guardado);
        if (!datos.delegaciones || !Array.isArray(datos.delegaciones) || datos.delegaciones.length === 0) {
          datos.delegaciones = [{
            id: Date.now(),
            delegado_1: { nombre: '', rut: '', edad: '', curso: '' },
            delegado_2: { nombre: '', rut: '', edad: '', curso: '' },
            tiene_pareja: false,
            pais_preferencia_1: '', pais_preferencia_2: '', pais_preferencia_3: '',
          }];
          datos.cantidad_delegaciones = 1;
        }
        if (datos.pais_origen_otro === undefined) datos.pais_origen_otro = '';
        if (datos.motivacion === undefined) datos.motivacion = '';
        if (datos.experiencia_previa === undefined) datos.experiencia_previa = 'no';
        if (datos.experiencia_detalle === undefined) datos.experiencia_detalle = '';
        if (datos.requiere_apoyo === undefined) datos.requiere_apoyo = 'no';
        if (datos.tiene_restriccion === undefined) datos.tiene_restriccion = 'no';
        if (!Array.isArray(datos.restriccion_tipo)) datos.restriccion_tipo = [];
        setFormData((prev) => ({ ...prev, ...datos }));
      } catch (e) {
        localStorage.removeItem('munsec_inscripcion');
        localStorage.removeItem('munsec_paso');
      }
    }
    if (pasoGuardado) setPaso(parseInt(pasoGuardado, 10));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('munsec_inscripcion', JSON.stringify(formData));
        localStorage.setItem('munsec_paso', paso.toString());
      } catch (e) {}
    }, 600);
    return () => clearTimeout(timer);
  }, [formData, paso]);

  const limpiarErrorCampo = (campoId) => {
    setErroresCampos((prev) => {
      if (!prev[campoId]) return prev;
      const copia = { ...prev };
      delete copia[campoId];
      return copia;
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    limpiarErrorCampo(name);
  };

  const handlePaisOrigenChange = (e) => {
    const valor = e.target.value;
    setFormData((prev) => ({
      ...prev,
      pais_origen: valor,
      pais_origen_otro: valor === 'Otro' ? prev.pais_origen_otro : '',
    }));
    limpiarErrorCampo('pais_origen');
    limpiarErrorCampo('pais_origen_otro');
  };

  const handleDelegadoChange = (delegacionIndex, delegadoKey, field, value) => {
    const nuevasDelegaciones = [...formData.delegaciones];
    nuevasDelegaciones[delegacionIndex] = {
      ...nuevasDelegaciones[delegacionIndex],
      [delegadoKey]: { ...nuevasDelegaciones[delegacionIndex][delegadoKey], [field]: value },
    };
    setFormData((prev) => ({ ...prev, delegaciones: nuevasDelegaciones }));
    const campoId = `deleg_${delegacionIndex}_${delegadoKey === 'delegado_1' ? 'd1' : 'd2'}_${field}`;
    limpiarErrorCampo(campoId);
  };

  const handlePreferenciaPaisDelegacion = (delegacionIndex, campo, valor) => {
    const nuevasDelegaciones = [...formData.delegaciones];
    nuevasDelegaciones[delegacionIndex] = { ...nuevasDelegaciones[delegacionIndex], [campo]: valor };
    setFormData((prev) => ({ ...prev, delegaciones: nuevasDelegaciones }));
    const num = campo.split('_').pop();
    limpiarErrorCampo(`deleg_${delegacionIndex}_pref${num}`);
  };

  const togglePareja = (delegacionIndex) => {
    const nuevasDelegaciones = [...formData.delegaciones];
    nuevasDelegaciones[delegacionIndex].tiene_pareja = !nuevasDelegaciones[delegacionIndex].tiene_pareja;
    if (!nuevasDelegaciones[delegacionIndex].tiene_pareja) {
      nuevasDelegaciones[delegacionIndex].delegado_2 = { nombre: '', rut: '', edad: '', curso: '' };
    }
    setFormData((prev) => ({ ...prev, delegaciones: nuevasDelegaciones }));
  };

  // ============================================================
  // 🔴 CAMBIO: sin límite real, usa el máximo del config (999)
  // ============================================================
  const actualizarCantidadDelegaciones = (cantidad) => {
    const minDeleg = CONFIG_INSCRIPCION.requisitos.delegacion.minimo || 1;
    const maxDeleg = CONFIG_INSCRIPCION.requisitos.delegacion.maximo || 999;
    const num = Math.max(minDeleg, Math.min(maxDeleg, parseInt(cantidad, 10) || minDeleg));

    const delegacionesActuales = [...formData.delegaciones];

    if (num > delegacionesActuales.length) {
      while (delegacionesActuales.length < num) {
        delegacionesActuales.push({
          id: Date.now() + delegacionesActuales.length,
          delegado_1: { nombre: '', rut: '', edad: '', curso: '' },
          delegado_2: { nombre: '', rut: '', edad: '', curso: '' },
          tiene_pareja: false,
          pais_preferencia_1: '', pais_preferencia_2: '', pais_preferencia_3: '',
        });
      }
    } else {
      delegacionesActuales.splice(num);
    }
    setFormData((prev) => ({ ...prev, cantidad_delegaciones: num, delegaciones: delegacionesActuales }));
    limpiarErrorCampo('cantidad_delegaciones');
  };

  const toggleRestriccionTipo = (tipo) => {
    setFormData((prev) => {
      const actual = prev.restriccion_tipo || [];
      const nuevos = actual.includes(tipo) ? actual.filter((t) => t !== tipo) : [...actual, tipo];
      return { ...prev, restriccion_tipo: nuevos };
    });
    limpiarErrorCampo('restriccion_tipo');
  };

  const validarRutSimple = (documento) => {
    if (!documento || documento.trim() === '') return true;
    const docLimpio = documento.replace(/[\.\-\s\/]/g, '').trim();
    return docLimpio === '' || docLimpio.length >= 5;
  };

  const obtenerPaisOrigenReal = () => {
    if (formData.pais_origen === 'Otro') return (formData.pais_origen_otro || '').trim();
    return formData.pais_origen;
  };

  const obtenerErroresPaso = (num) => {
    const errores = {};
    const add = (campo, msg) => {
      if (!errores[campo]) errores[campo] = msg;
    };

    switch (num) {
      case 1:
        if (!formData.tipo_establecimiento) add('tipo_establecimiento', 'Selecciona el tipo de colegio.');
        if (!formData.pais_origen) add('pais_origen', 'Selecciona el país de origen.');
        if (formData.pais_origen === 'Otro' && !(formData.pais_origen_otro || '').trim())
          add('pais_origen_otro', 'Especifica el nombre del país.');
        if (!formData.nombre_establecimiento) add('nombre_establecimiento', 'Ingresa el nombre del colegio.');
        if (!formData.ciudad) add('ciudad', 'Ingresa la ciudad.');
        break;

      case 2:
        if (!formData.profesor_nombre) add('profesor_nombre', 'Ingresa los nombres.');
        if (!formData.profesor_apellido) add('profesor_apellido', 'Ingresa los apellidos.');
        if (!formData.profesor_rut) add('profesor_rut', 'Ingresa el documento de identidad.');
        else if (!validarRutSimple(formData.profesor_rut)) add('profesor_rut', 'El documento no parece válido.');
        if (!formData.profesor_email) add('profesor_email', 'Ingresa el correo electrónico.');
        else if (!formData.profesor_email.includes('@')) add('profesor_email', 'El correo no es válido.');
        if (!formData.profesor_telefono) add('profesor_telefono', 'Ingresa el teléfono móvil.');
        break;

      case 3: {
        const minDeleg = CONFIG_INSCRIPCION.requisitos.delegacion.minimo;
        if (formData.cantidad_delegaciones < minDeleg) {
          add('cantidad_delegaciones', `Debe postular al menos ${minDeleg} delegación.`);
        }
        if (!formData.motivacion || formData.motivacion.trim().length < 20) {
          add('motivacion', 'Cuéntanos por qué quieren participar (mínimo 20 caracteres).');
        }
        if (formData.experiencia_previa === 'si' && !(formData.experiencia_detalle || '').trim()) {
          add('experiencia_detalle', 'Indica en qué modelos han participado antes.');
        }
        formData.delegaciones.forEach((del, i) => {
          const d1 = del.delegado_1;
          if (!d1.nombre) add(`deleg_${i}_d1_nombre`, 'Nombre del Delegado 1.');
          if (!d1.rut) add(`deleg_${i}_d1_rut`, 'Documento del Delegado 1.');
          else if (!validarRutSimple(d1.rut)) add(`deleg_${i}_d1_rut`, 'Documento inválido.');
          if (!d1.edad) add(`deleg_${i}_d1_edad`, 'Edad del Delegado 1.');
          if (!d1.curso) add(`deleg_${i}_d1_curso`, 'Curso del Delegado 1.');

          if (del.tiene_pareja) {
            const d2 = del.delegado_2;
            if (!d2.nombre) add(`deleg_${i}_d2_nombre`, 'Nombre del Delegado 2.');
            if (!d2.rut) add(`deleg_${i}_d2_rut`, 'Documento del Delegado 2.');
            else if (!validarRutSimple(d2.rut)) add(`deleg_${i}_d2_rut`, 'Documento inválido.');
            if (!d2.edad) add(`deleg_${i}_d2_edad`, 'Edad del Delegado 2.');
            if (!d2.curso) add(`deleg_${i}_d2_curso`, 'Curso del Delegado 2.');
            if (d1.rut && d2.rut && d1.rut === d2.rut)
              add(`deleg_${i}_d2_rut`, 'No pueden compartir documento con el Delegado 1.');
          }

          const prefs = [del.pais_preferencia_1, del.pais_preferencia_2, del.pais_preferencia_3];
          prefs.forEach((p, idx) => {
            if (!(p || '').trim()) add(`deleg_${i}_pref${idx + 1}`, `Indica la preferencia ${idx + 1}.`);
          });
          const limpias = prefs.map((p) => (p || '').trim().toLowerCase()).filter(Boolean);
          if (limpias.length === 3 && new Set(limpias).size !== 3) {
            add(`deleg_${i}_pref1`, 'Las 3 preferencias deben ser diferentes.');
          }
        });
        break;
      }

      case 4:
        if (formData.requiere_apoyo === 'si') {
          if (!formData.apoyo_delegado) add('apoyo_delegado', 'Indica a qué delegado corresponde.');
          if (!formData.apoyo_descripcion) add('apoyo_descripcion', 'Describe qué apoyo necesita.');
        }
        if (formData.tiene_restriccion === 'si') {
          if (!formData.restriccion_delegado) add('restriccion_delegado', 'Indica a qué delegado corresponde.');
          if (!formData.restriccion_tipo || formData.restriccion_tipo.length === 0)
            add('restriccion_tipo', 'Selecciona al menos un tipo de restricción.');
        }
        break;

      case 5:
        if (!formData.acepta_terminos) add('acepta_terminos', 'Debes aceptar los términos y condiciones.');
        if (!formData.acepta_reglamento) add('acepta_reglamento', 'Debes aceptar el reglamento interno.');
        if (!formData.acepta_datos) add('acepta_datos', 'Debes autorizar el uso de datos.');
        break;
    }

    return errores;
  };

  const irAlPrimerError = (errores) => {
    const primerCampo = Object.keys(errores)[0];
    if (!primerCampo) return;
    setTimeout(() => {
      const el = document.getElementById(primerCampo);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  };

  const siguientePaso = () => {
    const errores = obtenerErroresPaso(paso);
    if (Object.keys(errores).length > 0) {
      setErroresCampos(errores);
      setError('Revisa los campos marcados antes de continuar.');
      irAlPrimerError(errores);
      return;
    }
    setErroresCampos({});
    setError('');
    setPaso((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pasoAnterior = () => {
    setPaso((prev) => Math.max(prev - 1, 1));
    setError('');
    setErroresCampos({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const contarDelegados = () =>
    formData.delegaciones.reduce((acc, del) => acc + (del.tiene_pareja ? 2 : 1), 0);

  const enviarFormulario = async () => {
    const errores = obtenerErroresPaso(5);
    if (Object.keys(errores).length > 0) {
      setErroresCampos(errores);
      setError('Debes aceptar las declaraciones antes de enviar.');
      irAlPrimerError(errores);
      return;
    }

    try {
      setEnviando(true);
      setErroresCampos({});
      setError('');

      const datosParaEnviar = {
        ...formData,
        pais_origen: obtenerPaisOrigenReal(),
        __es_prueba: modoPrueba,
      };
      delete datosParaEnviar.pais_origen_otro;

      const response = await fetch('/api/inscripciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaEnviar),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error de conexión con el servidor central.');
      }
      setEnviado(true);
      localStorage.removeItem('munsec_inscripcion');
      localStorage.removeItem('munsec_paso');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  // ============================================================
  // 🔴 CAMBIO: textos guía coherentes en plural
  // ============================================================
  const textosGuia = {
    1: {
      titulo: 'I. Datos del Colegio',
      texto: 'Cuéntennos sobre su institución y desde dónde nos acompañan.',
    },
    2: {
      titulo: 'II. Profesor Responsable',
      texto: 'La persona adulta que estará a cargo y será nuestro contacto directo. Puede ser un apoderado en caso de que el alumno no esté en un establecimiento',
    },
    3: {
      titulo: 'III. Delegaciones y Motivación',
      texto: 'Quiénes participan, qué países les gustaría representar y por qué quieren ser parte de MUNSEC.',
    },
    4: {
      titulo: 'IV. Apoyos y Alimentación',
      texto: 'Para que todos estén cómodos durante el evento. Esta información no afecta la selección.',
    },
    5: {
      titulo: 'V. Confirmar Postulación',
      texto: 'Revisen todo y envíen su postulación. Recuerden: aquí no se paga nada.',
    },
  };

  // ============================================================
  // PANTALLA DE "ENVIADO"
  // ============================================================
  if (enviado) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4 font-sans selection:bg-[#418FDE] selection:text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white shadow-xl shadow-slate-200/50 rounded-sm border border-slate-200 p-12 relative overflow-hidden"
        >
          <div className={`absolute top-0 left-0 w-full h-1.5 ${modoPrueba ? 'bg-amber-400' : 'bg-[#003366]'}`} />

          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6">
              <img
                src="/munsec.png"
                alt="MUNSEC"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.src = 'https://www.munsec.org/munsec.png'; }}
              />
            </div>
            <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${modoPrueba ? 'text-amber-600' : 'text-[#418FDE]'}`}>
              {modoPrueba ? 'Envío de prueba' : 'Postulación recibida'}
            </span>
            <h2 className="font-serif text-3xl text-[#003366] mt-2 mb-4">
              {modoPrueba ? '¡Formulario de prueba enviado!' : '¡Gracias por postular!'}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-serif max-w-lg mx-auto">
              {modoPrueba ? (
                <>
                  El formulario funciona correctamente. Esta postulación quedó guardada como <strong>PRUEBA</strong> en Firestore y el equipo puede revisarla.
                </>
              ) : (
                <>
                  Recibimos correctamente la postulación de <strong>{formData.nombre_establecimiento}</strong>. Ahora nuestro equipo revisará todo y te contactará por correo.
                </>
              )}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-sm p-6 mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 pb-3 border-b border-slate-200">Resumen</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Profesor a cargo</span>
                <span className="font-medium text-slate-900">{formData.profesor_nombre} {formData.profesor_apellido}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">País de origen</span>
                <span className="font-medium text-slate-900">{obtenerPaisOrigenReal()}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Delegaciones</span>
                <span className="font-medium text-slate-900">{formData.cantidad_delegaciones} ({contarDelegados()} estudiantes)</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Sede</span>
                <span className="font-medium text-slate-900">CEPAL, Santiago</span>
              </div>
            </div>
          </div>

          {modoPrueba ? (
            <div className="border-l-4 border-amber-500 bg-amber-50 p-4 mb-8">
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Modo prueba:</strong> puedes volver a probar el formulario todas las veces que quieras con <code className="bg-amber-100 px-1 rounded">?prueba=1</code>. Los envíos de prueba quedan marcados en Firestore con <code className="bg-amber-100 px-1 rounded">es_prueba: true</code>.
              </p>
            </div>
          ) : (
            <div className="border-l-4 border-amber-500 bg-amber-50 p-4 mb-8">
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Ojo:</strong> revisen su correo (y la carpeta de spam). Los plazos para completar el registro final los enviaremos en la notificación de selección.
              </p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => window.close()}
              className="bg-[#003366] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 hover:bg-[#002244] transition-colors rounded-sm shadow-sm"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-800 font-sans selection:bg-[#418FDE] selection:text-white pb-20">
      <ModalTerminosLegales
        abierto={mostrarModalLegal}
        onCerrar={() => setMostrarModalLegal(false)}
        onAceptar={() => {
          setFormData((prev) => ({ ...prev, acepta_datos: true }));
          limpiarErrorCampo('acepta_datos');
          setMostrarModalLegal(false);
        }}
      />

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12">
              <img
                src="/munsec.png"
                alt="Logo MUNSEC"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.src = 'https://www.munsec.org/munsec.png'; }}
              />
            </div>
            <div className="hidden sm:block border-l border-slate-300 pl-4">
              <h1 className="text-xs font-bold text-[#003366] tracking-widest uppercase">
                MUNSEC {CONFIG_INSCRIPCION.año}
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-slate-400">
                CEPAL · Santiago · 2 y 3 de Noviembre
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold text-[#003366] uppercase tracking-widest">
              Paso {paso} de 5
            </span>
            <span className="text-[9px] text-[#418FDE] font-semibold uppercase tracking-wider">
              Postulación
            </span>
          </div>
        </div>
      </header>

      {modoPrueba && (
        <div className="sticky top-20 z-30 bg-[#003366] text-white">
          <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#418FDE] animate-pulse" />
            <p className="text-[11px] font-serif italic tracking-wide text-white/90">
              Vista previa del formulario · Los envíos no se registran como postulaciones reales
            </p>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 pt-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* SIDEBAR */}
          <aside className="hidden lg:block w-72 sticky top-32 flex-shrink-0">
            <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">
                Pasos de la postulación
              </h3>
              <nav className="space-y-1 relative">
                <div className="absolute left-[11px] top-4 bottom-4 w-px bg-slate-200 z-0" />
                {[1, 2, 3, 4, 5].map((num) => (
                  <div
                    key={num}
                    className={`relative z-10 flex items-start gap-4 p-2 transition-colors ${paso === num ? 'bg-slate-50' : ''}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border mt-0.5 transition-colors ${
                        paso === num
                          ? 'bg-[#003366] border-[#003366] text-white'
                          : paso > num
                          ? 'bg-white border-[#003366] text-[#003366]'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}
                    >
                      {paso > num ? '✓' : num}
                    </div>
                    <div>
                      <span
                        className={`block text-xs font-bold uppercase tracking-wider ${
                          paso === num ? 'text-[#003366]' : 'text-slate-500'
                        }`}
                      >
                        Paso {num}
                      </span>
                      <span
                        className={`block text-[11px] mt-0.5 ${
                          paso === num ? 'text-slate-700' : 'text-slate-400'
                        }`}
                      >
                        {num === 1 && 'Colegio'}
                        {num === 2 && 'Profesor'}
                        {num === 3 && 'Delegaciones'}
                        {num === 4 && 'Apoyos'}
                        {num === 5 && 'Confirmar'}
                      </span>
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            <div className="mt-6 bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
              <div className="h-1 bg-[#003366]" />
              <div className="p-5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  Lugar del evento
                </h4>
                <p className="font-serif font-bold text-[#003366] text-lg leading-tight mb-1">CEPAL</p>
                <p className="text-xs text-slate-600 leading-relaxed">Santiago de Chile</p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  <svg className="w-3.5 h-3.5 text-[#418FDE] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[11px] text-slate-500">2 y 3 de Noviembre</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#003366] text-white p-5 rounded-sm shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-[#418FDE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/80">Muy importante</h4>
              </div>
              <p className="text-xs leading-relaxed text-white/90 mb-3">
                Esto es una <strong>postulación</strong>. <strong>No se paga nada ahora.</strong>
              </p>
              <p className="text-xs leading-relaxed text-white/90">
                Si quedan seleccionados, les enviaremos un correo con un link para inscribirse y pagar.
              </p>
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">
                  Valores (solo si quedan):
                </p>
                <p className="text-xs text-white/90">$10.000 CLP <span className="text-white/60">(Chile)</span></p>
                <p className="text-xs text-white/90">US$20 <span className="text-white/60">(extranjero)</span></p>
              </div>
            </div>

            <div className="mt-6 bg-white border border-slate-200 p-5 rounded-sm shadow-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">¿Dudas?</h4>
              <p className="text-xs leading-relaxed text-slate-600">
                Escríbenos a <strong className="text-[#003366]">{CONFIG_INSCRIPCION.contact.email}</strong>
              </p>
            </div>
          </aside>

          {/* FORM */}
          <div className="w-full lg:w-[calc(100%-20rem)]">
            <div className="mb-8 border-b border-slate-200 pb-6">
              <motion.div
                key={paso}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-2xl font-serif font-semibold text-[#003366] mb-2">
                  {textosGuia[paso].titulo}
                </h2>
                <p className="text-sm text-slate-600 font-serif">{textosGuia[paso].texto}</p>
              </motion.div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-red-50 border-l-4 border-[#B22234] rounded-sm p-4 flex gap-3 items-start">
                    <svg className="w-5 h-5 text-[#B22234] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h4 className="text-xs font-bold text-[#B22234] uppercase tracking-wider">
                        Revisa lo siguiente
                      </h4>
                      <p className="text-sm text-red-800 mt-1 font-serif">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6 sm:p-10">

              {/* ==================== PASO 1 — COLEGIO ==================== */}
              {paso === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <BloqueConError error={erroresCampos.tipo_establecimiento} id="tipo_establecimiento">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                      Tipo de colegio *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label
                        className={`relative p-4 cursor-pointer border rounded-sm transition-all flex items-start gap-3 ${
                          formData.tipo_establecimiento === 'publico'
                            ? 'border-[#003366] bg-[#003366]/5 ring-1 ring-[#003366]'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="tipo_establecimiento"
                          value="publico"
                          checked={formData.tipo_establecimiento === 'publico'}
                          onChange={handleChange}
                          className="mt-1 accent-[#003366]"
                        />
                        <div>
                          <span className="block font-semibold text-slate-900 text-sm mb-0.5">
                            Público / Subvencionado
                          </span>
                          <span className="block text-[11px] text-slate-500">
                            Municipal, SLEP o con aporte del Estado.
                          </span>
                        </div>
                      </label>
                      <label
                        className={`relative p-4 cursor-pointer border rounded-sm transition-all flex items-start gap-3 ${
                          formData.tipo_establecimiento === 'privado'
                            ? 'border-[#003366] bg-[#003366]/5 ring-1 ring-[#003366]'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="tipo_establecimiento"
                          value="privado"
                          checked={formData.tipo_establecimiento === 'privado'}
                          onChange={handleChange}
                          className="mt-1 accent-[#003366]"
                        />
                        <div>
                          <span className="block font-semibold text-slate-900 text-sm mb-0.5">
                            Particular Pagado
                          </span>
                          <span className="block text-[11px] text-slate-500">Colegios privados.</span>
                        </div>
                      </label>
                    </div>
                  </BloqueConError>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OficialSelect
                      id="pais_origen"
                      error={erroresCampos.pais_origen}
                      label="País de origen *"
                      name="pais_origen"
                      value={formData.pais_origen}
                      onChange={handlePaisOrigenChange}
                    >
                      {['Chile', 'Argentina', 'Perú', 'Bolivia', 'Colombia', 'Brasil', 'Ecuador', 'Uruguay', 'Paraguay', 'Otro'].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </OficialSelect>
                    <OficialInput
                      id="nombre_establecimiento"
                      error={erroresCampos.nombre_establecimiento}
                      label="Nombre del colegio *"
                      name="nombre_establecimiento"
                      value={formData.nombre_establecimiento}
                      onChange={handleChange}
                      placeholder="Nombre oficial"
                    />
                  </div>

                  {formData.pais_origen === 'Otro' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <OficialInput
                        id="pais_origen_otro"
                        error={erroresCampos.pais_origen_otro}
                        label="¿Qué país? *"
                        name="pais_origen_otro"
                        value={formData.pais_origen_otro}
                        onChange={handleChange}
                        placeholder="Escribe el país"
                      />
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OficialInput
                      id="ciudad"
                      error={erroresCampos.ciudad}
                      label="Ciudad *"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      placeholder="Ej. Santiago"
                    />
                    <OficialInput
                      label="Dirección (opcional)"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      placeholder="Calle y número"
                    />
                  </div>
                  <OficialInput
                    label="Teléfono del colegio (opcional)"
                    name="telefono_establecimiento"
                    type="tel"
                    value={formData.telefono_establecimiento}
                    onChange={handleChange}
                    placeholder="+56 2 ..."
                  />
                </motion.div>
              )}

              {/* ==================== PASO 2 — PROFESOR ==================== */}
              {paso === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OficialInput
                      id="profesor_nombre"
                      error={erroresCampos.profesor_nombre}
                      label="Nombres *"
                      name="profesor_nombre"
                      value={formData.profesor_nombre}
                      onChange={handleChange}
                    />
                    <OficialInput
                      id="profesor_apellido"
                      error={erroresCampos.profesor_apellido}
                      label="Apellidos *"
                      name="profesor_apellido"
                      value={formData.profesor_apellido}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OficialInput
                      id="profesor_rut"
                      error={erroresCampos.profesor_rut}
                      label={obtenerPaisOrigenReal() === 'Chile' ? 'RUT *' : 'Pasaporte / ID *'}
                      name="profesor_rut"
                      value={formData.profesor_rut}
                      onChange={handleChange}
                    />
                    <OficialInput
                      label="Edad (opcional)"
                      name="profesor_edad"
                      type="number"
                      value={formData.profesor_edad}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OficialInput
                      id="profesor_email"
                      error={erroresCampos.profesor_email}
                      label="Correo electrónico *"
                      name="profesor_email"
                      type="email"
                      value={formData.profesor_email}
                      onChange={handleChange}
                      placeholder="usuario@colegio.cl"
                    />
                    <OficialInput
                      id="profesor_telefono"
                      error={erroresCampos.profesor_telefono}
                      label="Teléfono móvil *"
                      name="profesor_telefono"
                      type="tel"
                      value={formData.profesor_telefono}
                      onChange={handleChange}
                      placeholder="+56 9 ..."
                    />
                  </div>
                  <OficialInput
                    label="Asignatura o departamento (opcional)"
                    name="profesor_asignatura"
                    value={formData.profesor_asignatura}
                    onChange={handleChange}
                    placeholder="Ej. Historia"
                  />
                </motion.div>
              )}

              {/* ==================== PASO 3 — DELEGACIONES ==================== */}
              {paso === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                  <div className="space-y-6 pb-8 border-b border-slate-200">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-[#003366] mb-1">Cuéntennos de ustedes</h3>
                      <p className="text-xs text-slate-500">
                        Nos ayuda a conocerlos mejor. No hay respuestas incorrectas.
                      </p>
                    </div>

                    <OficialTextarea
                      id="motivacion"
                      error={erroresCampos.motivacion}
                      label="¿Por qué quieren participar en MUNSEC? *"
                      name="motivacion"
                      value={formData.motivacion}
                      onChange={handleChange}
                      placeholder="Cuéntennos qué les motiva, qué esperan aprender o vivir en el evento..."
                      maxLength={600}
                    />
                    <p className="text-[10px] text-slate-400 -mt-3 text-right">
                      {(formData.motivacion || '').length}/600
                    </p>

                    <BloqueConError error={erroresCampos.experiencia_previa} id="experiencia_previa">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                        ¿Han participado antes en algún modelo? *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label
                          className={`p-4 cursor-pointer border rounded-sm transition-all flex items-start gap-3 ${
                            formData.experiencia_previa === 'no'
                              ? 'border-[#003366] bg-[#003366]/5 ring-1 ring-[#003366]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="experiencia_previa"
                            value="no"
                            checked={formData.experiencia_previa === 'no'}
                            onChange={handleChange}
                            className="mt-1 accent-[#003366]"
                          />
                          <span className="text-sm font-medium text-slate-800">No, es nuestra primera vez</span>
                        </label>
                        <label
                          className={`p-4 cursor-pointer border rounded-sm transition-all flex items-start gap-3 ${
                            formData.experiencia_previa === 'si'
                              ? 'border-[#003366] bg-[#003366]/5 ring-1 ring-[#003366]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="experiencia_previa"
                            value="si"
                            checked={formData.experiencia_previa === 'si'}
                            onChange={handleChange}
                            className="mt-1 accent-[#003366]"
                          />
                          <span className="text-sm font-medium text-slate-800">Sí, ya hemos participado</span>
                        </label>
                      </div>
                    </BloqueConError>

                    <AnimatePresence>
                      {formData.experiencia_previa === 'si' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <OficialTextarea
                            id="experiencia_detalle"
                            error={erroresCampos.experiencia_detalle}
                            label="¿En cuáles? *"
                            name="experiencia_detalle"
                            value={formData.experiencia_detalle}
                            onChange={handleChange}
                            placeholder="Ej: MUNSEC 2024, Modelo ONU del colegio, etc."
                            maxLength={300}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 🔴 CAMBIO: input numérico con botones + / − */}
                  <BloqueConError
                    error={erroresCampos.cantidad_delegaciones}
                    id="cantidad_delegaciones"
                    className="bg-slate-50 border border-slate-200 rounded-sm p-5 flex flex-col sm:flex-row justify-between items-center gap-4"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">¿Cuántas delegaciones quieren postular?</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Pueden postular una o más delegaciones por establecimiento.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => actualizarCantidadDelegaciones(formData.cantidad_delegaciones - 1)}
                        disabled={formData.cantidad_delegaciones <= (CONFIG_INSCRIPCION.requisitos.delegacion.minimo || 1)}
                        className="w-9 h-9 flex items-center justify-center border border-slate-300 bg-white text-slate-700 hover:border-[#003366] hover:text-[#003366] transition-colors rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Quitar una delegación"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                        </svg>
                      </button>

                      <div className="w-20 text-center">
                        <input
                          type="number"
                          min={CONFIG_INSCRIPCION.requisitos.delegacion.minimo || 1}
                          value={formData.cantidad_delegaciones}
                          onChange={(e) => actualizarCantidadDelegaciones(e.target.value)}
                          onBlur={(e) => {
                            if (!e.target.value || parseInt(e.target.value, 10) < (CONFIG_INSCRIPCION.requisitos.delegacion.minimo || 1)) {
                              actualizarCantidadDelegaciones(CONFIG_INSCRIPCION.requisitos.delegacion.minimo || 1);
                            }
                          }}
                          className="w-full bg-white border border-slate-300 text-slate-900 font-semibold text-lg py-1.5 rounded-sm outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="block text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                          {formData.cantidad_delegaciones === 1 ? 'delegación' : 'delegaciones'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => actualizarCantidadDelegaciones(formData.cantidad_delegaciones + 1)}
                        className="w-9 h-9 flex items-center justify-center border border-slate-300 bg-white text-slate-700 hover:border-[#003366] hover:text-[#003366] transition-colors rounded-sm"
                        aria-label="Agregar una delegación"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    </div>
                  </BloqueConError>

                  <div className="space-y-8">
                    {formData.delegaciones.map((delegacion, delIndex) => (
                      <div key={delegacion.id} className="border border-slate-200 rounded-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                          <h4 className="font-serif font-bold text-[#003366] text-lg">Delegación {delIndex + 1}</h4>
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-800 transition-colors">
                              Van en pareja
                            </span>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${delegacion.tiene_pareja ? 'bg-[#003366]' : 'bg-slate-300'}`}>
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={delegacion.tiene_pareja}
                                onChange={() => togglePareja(delIndex)}
                              />
                              <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${delegacion.tiene_pareja ? 'translate-x-5' : ''}`} />
                            </div>
                          </label>
                        </div>

                        <div className="p-5">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                              <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#003366] pb-2 border-b border-slate-100">
                                Delegado 1
                              </h5>
                              <OficialInput
                                id={`deleg_${delIndex}_d1_nombre`}
                                error={erroresCampos[`deleg_${delIndex}_d1_nombre`]}
                                label="Nombre completo"
                                value={delegacion.delegado_1.nombre}
                                onChange={(e) => handleDelegadoChange(delIndex, 'delegado_1', 'nombre', e.target.value)}
                              />
                              <OficialInput
                                id={`deleg_${delIndex}_d1_rut`}
                                error={erroresCampos[`deleg_${delIndex}_d1_rut`]}
                                label={obtenerPaisOrigenReal() === 'Chile' ? 'RUT' : 'Doc. Identidad'}
                                value={delegacion.delegado_1.rut}
                                onChange={(e) => handleDelegadoChange(delIndex, 'delegado_1', 'rut', e.target.value)}
                              />
                              <div className="grid grid-cols-2 gap-4">
                                <OficialInput
                                  id={`deleg_${delIndex}_d1_edad`}
                                  error={erroresCampos[`deleg_${delIndex}_d1_edad`]}
                                  label="Edad"
                                  type="number"
                                  value={delegacion.delegado_1.edad}
                                  onChange={(e) => handleDelegadoChange(delIndex, 'delegado_1', 'edad', e.target.value)}
                                />
                                <OficialSelect
                                  id={`deleg_${delIndex}_d1_curso`}
                                  error={erroresCampos[`deleg_${delIndex}_d1_curso`]}
                                  label="Curso"
                                  value={delegacion.delegado_1.curso}
                                  onChange={(e) => handleDelegadoChange(delIndex, 'delegado_1', 'curso', e.target.value)}
                                >
                                  <option value="">Seleccione</option>
                                  <option value="1° Medio">1° Medio</option>
                                  <option value="2° Medio">2° Medio</option>
                                  <option value="3° Medio">3° Medio</option>
                                  <option value="4° Medio">4° Medio</option>
                                </OficialSelect>
                              </div>
                            </div>

                            {delegacion.tiene_pareja ? (
                              <div className="space-y-4">
                                <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#003366] pb-2 border-b border-slate-100">
                                  Delegado 2
                                </h5>
                                <OficialInput
                                  id={`deleg_${delIndex}_d2_nombre`}
                                  error={erroresCampos[`deleg_${delIndex}_d2_nombre`]}
                                  label="Nombre completo"
                                  value={delegacion.delegado_2.nombre}
                                  onChange={(e) => handleDelegadoChange(delIndex, 'delegado_2', 'nombre', e.target.value)}
                                />
                                <OficialInput
                                  id={`deleg_${delIndex}_d2_rut`}
                                  error={erroresCampos[`deleg_${delIndex}_d2_rut`]}
                                  label={obtenerPaisOrigenReal() === 'Chile' ? 'RUT' : 'Doc. Identidad'}
                                  value={delegacion.delegado_2.rut}
                                  onChange={(e) => handleDelegadoChange(delIndex, 'delegado_2', 'rut', e.target.value)}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                  <OficialInput
                                    id={`deleg_${delIndex}_d2_edad`}
                                    error={erroresCampos[`deleg_${delIndex}_d2_edad`]}
                                    label="Edad"
                                    type="number"
                                    value={delegacion.delegado_2.edad}
                                    onChange={(e) => handleDelegadoChange(delIndex, 'delegado_2', 'edad', e.target.value)}
                                  />
                                  <OficialSelect
                                    id={`deleg_${delIndex}_d2_curso`}
                                    error={erroresCampos[`deleg_${delIndex}_d2_curso`]}
                                    label="Curso"
                                    value={delegacion.delegado_2.curso}
                                    onChange={(e) => handleDelegadoChange(delIndex, 'delegado_2', 'curso', e.target.value)}
                                  >
                                    <option value="">Seleccione</option>
                                    <option value="1° Medio">1° Medio</option>
                                    <option value="2° Medio">2° Medio</option>
                                    <option value="3° Medio">3° Medio</option>
                                    <option value="4° Medio">4° Medio</option>
                                  </OficialSelect>
                                </div>
                              </div>
                            ) : (
                              <div className="border border-dashed border-slate-300 rounded-sm bg-slate-50 flex flex-col items-center justify-center text-center p-6 h-full">
                                <p className="text-xs font-semibold text-slate-500">Delegación individual</p>
                                <p className="text-[10px] text-slate-400 mt-1 max-w-[220px]">
                                  Si quieren, pueden activar el switch de arriba para agregar un segundo delegado.
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="bg-[#003366]/5 rounded-sm p-5 border border-[#003366]/10">
                            <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#003366] mb-2">
                              Preferencias de país
                            </h5>
                            <p className="text-[11px] text-slate-500 mb-4">
                              Escriban el nombre del país en español, con tildes si corresponde. Ej: España, México, Perú, República Checa, Estados Unidos.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {[1, 2, 3].map((pref) => (
                                <OficialInput
                                  key={pref}
                                  id={`deleg_${delIndex}_pref${pref}`}
                                  error={erroresCampos[`deleg_${delIndex}_pref${pref}`]}
                                  label={`Opción ${pref}`}
                                  value={delegacion[`pais_preferencia_${pref}`] || ''}
                                  onChange={(e) =>
                                    handlePreferenciaPaisDelegacion(delIndex, `pais_preferencia_${pref}`, e.target.value)
                                  }
                                  placeholder="Escribe un país"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ==================== PASO 4 — APOYOS Y ALIMENTACIÓN ==================== */}
              {paso === 4 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                  <div className="bg-[#418FDE]/5 border border-[#418FDE]/20 rounded-sm p-5">
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <strong>Esto no afecta la selección.</strong> Solo nos ayuda a prepararnos para que todos estén cómodos y bien atendidos durante el evento. La información se maneja de forma reservada y solo la ve el equipo que necesita saberla.
                    </p>
                  </div>

                  <section className="space-y-5">
                    <h3 className="font-serif text-lg font-semibold text-[#003366]">Apoyos especiales</h3>

                    <BloqueConError error={erroresCampos.requiere_apoyo} id="requiere_apoyo">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                        ¿Algún delegado necesita apoyo especial? *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label
                          className={`p-4 cursor-pointer border rounded-sm transition-all ${
                            formData.requiere_apoyo === 'no'
                              ? 'border-[#003366] bg-[#003366]/5 ring-1 ring-[#003366]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="requiere_apoyo"
                            value="no"
                            checked={formData.requiere_apoyo === 'no'}
                            onChange={handleChange}
                            className="mr-2 accent-[#003366]"
                          />
                          <span className="text-sm font-medium text-slate-800">No, ninguno</span>
                        </label>
                        <label
                          className={`p-4 cursor-pointer border rounded-sm transition-all ${
                            formData.requiere_apoyo === 'si'
                              ? 'border-[#003366] bg-[#003366]/5 ring-1 ring-[#003366]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="requiere_apoyo"
                            value="si"
                            checked={formData.requiere_apoyo === 'si'}
                            onChange={handleChange}
                            className="mr-2 accent-[#003366]"
                          />
                          <span className="text-sm font-medium text-slate-800">Sí, uno o más</span>
                        </label>
                      </div>
                    </BloqueConError>

                    <AnimatePresence>
                      {formData.requiere_apoyo === 'si' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden space-y-4"
                        >
                          <OficialInput
                            id="apoyo_delegado"
                            error={erroresCampos.apoyo_delegado}
                            label="¿A qué delegado corresponde? *"
                            name="apoyo_delegado"
                            value={formData.apoyo_delegado}
                            onChange={handleChange}
                            placeholder="Ej. Delegación 1 - Delegado 2 (Juan Pérez)"
                          />
                          <OficialTextarea
                            id="apoyo_descripcion"
                            error={erroresCampos.apoyo_descripcion}
                            label="¿Qué apoyo necesita? *"
                            name="apoyo_descripcion"
                            value={formData.apoyo_descripcion}
                            onChange={handleChange}
                            placeholder="Cuéntennos brevemente qué necesita para participar cómodamente."
                            maxLength={400}
                          />
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                              ¿Necesita coordinación previa con el equipo? *
                            </label>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="apoyo_coordinacion"
                                  value="no"
                                  checked={formData.apoyo_coordinacion === 'no'}
                                  onChange={handleChange}
                                  className="accent-[#003366]"
                                />
                                <span className="text-sm">No</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="apoyo_coordinacion"
                                  value="si"
                                  checked={formData.apoyo_coordinacion === 'si'}
                                  onChange={handleChange}
                                  className="accent-[#003366]"
                                />
                                <span className="text-sm">Sí</span>
                              </label>
                            </div>
                          </div>
                          {formData.apoyo_coordinacion === 'si' && (
                            <OficialTextarea
                              label="Observaciones o medio de contacto"
                              name="apoyo_observaciones"
                              value={formData.apoyo_observaciones}
                              onChange={handleChange}
                              placeholder="Ej: llamar al profesor X al +56 9..., o enviar instrucciones por correo"
                              maxLength={300}
                            />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>

                  <section className="space-y-5 pt-8 border-t border-slate-200">
                    <h3 className="font-serif text-lg font-semibold text-[#003366]">Alimentación</h3>

                    <BloqueConError error={erroresCampos.tiene_restriccion} id="tiene_restriccion">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                        ¿Alguien tiene restricciones alimenticias? *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label
                          className={`p-4 cursor-pointer border rounded-sm transition-all ${
                            formData.tiene_restriccion === 'no'
                              ? 'border-[#003366] bg-[#003366]/5 ring-1 ring-[#003366]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="tiene_restriccion"
                            value="no"
                            checked={formData.tiene_restriccion === 'no'}
                            onChange={handleChange}
                            className="mr-2 accent-[#003366]"
                          />
                          <span className="text-sm font-medium text-slate-800">No, ninguno</span>
                        </label>
                        <label
                          className={`p-4 cursor-pointer border rounded-sm transition-all ${
                            formData.tiene_restriccion === 'si'
                              ? 'border-[#003366] bg-[#003366]/5 ring-1 ring-[#003366]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="tiene_restriccion"
                            value="si"
                            checked={formData.tiene_restriccion === 'si'}
                            onChange={handleChange}
                            className="mr-2 accent-[#003366]"
                          />
                          <span className="text-sm font-medium text-slate-800">Sí, alguien tiene</span>
                        </label>
                      </div>
                    </BloqueConError>

                    <AnimatePresence>
                      {formData.tiene_restriccion === 'si' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden space-y-4"
                        >
                          <OficialInput
                            id="restriccion_delegado"
                            error={erroresCampos.restriccion_delegado}
                            label="¿A qué delegado corresponde? *"
                            name="restriccion_delegado"
                            value={formData.restriccion_delegado}
                            onChange={handleChange}
                            placeholder="Ej. Delegación 1 - Delegado 1 (María González)"
                          />

                          <BloqueConError error={erroresCampos.restriccion_tipo} id="restriccion_tipo">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                              Tipo de restricción * (pueden marcar varias)
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {[
                                'Alergia alimentaria',
                                'Intolerancia',
                                'Vegetariano/a',
                                'Vegano/a',
                                'Restricción religiosa o cultural',
                                'Otra',
                              ].map((tipo) => {
                                const activo = (formData.restriccion_tipo || []).includes(tipo);
                                return (
                                  <label
                                    key={tipo}
                                    className={`p-3 cursor-pointer border rounded-sm flex items-center gap-3 transition-all ${
                                      activo ? 'border-[#003366] bg-[#003366]/5' : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={activo}
                                      onChange={() => toggleRestriccionTipo(tipo)}
                                      className="accent-[#003366]"
                                    />
                                    <span className="text-sm text-slate-800">{tipo}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </BloqueConError>

                          <OficialTextarea
                            label="Detalles"
                            name="restriccion_detalle"
                            value={formData.restriccion_detalle}
                            onChange={handleChange}
                            placeholder="Ej: alergia severa a frutos secos; evitar lácteos; etc."
                            maxLength={300}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>
                </motion.div>
              )}

              {/* ==================== PASO 5 — CONFIRMAR ==================== */}
              {paso === 5 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="border border-slate-200 rounded-sm p-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 pb-3 border-b border-slate-200">
                      Resumen de la postulación
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Colegio</span>
                        <span className="font-medium text-slate-900">{formData.nombre_establecimiento}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Profesor a cargo</span>
                        <span className="font-medium text-slate-900">
                          {formData.profesor_nombre} {formData.profesor_apellido}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Delegaciones</span>
                        <span className="font-medium text-slate-900">
                          {formData.cantidad_delegaciones} ({contarDelegados()} estudiantes)
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Lugar</span>
                        <span className="font-medium text-slate-900">CEPAL, Santiago de Chile</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-[#003366]/20 bg-[#003366]/5 rounded-sm p-6">
                    <h3 className="text-xs font-bold text-[#003366] uppercase tracking-wider mb-4">Importante</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Esto es una <strong>postulación</strong>, no una inscripción. <strong>No se paga nada ahora.</strong>
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Si quedan seleccionados, les enviaremos un correo con un link para completar la inscripción y pagar en ese momento (<strong>$10.000 CLP</strong> en Chile / <strong>US$20</strong> si son extranjeros, por delegado).
                    </p>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                      Para finalizar
                    </h3>

                    <BloqueConError error={erroresCampos.acepta_terminos} id="acepta_terminos">
                      <label className="flex items-start gap-4 cursor-pointer p-4 border border-slate-200 rounded-sm hover:bg-slate-50 transition-colors">
                        <input
                          type="checkbox"
                          name="acepta_terminos"
                          checked={formData.acepta_terminos}
                          onChange={handleChange}
                          className="mt-0.5 accent-[#003366] w-4 h-4"
                        />
                        <span className="text-sm text-slate-700 leading-snug">
                          Aceptamos los términos y condiciones de MUNSEC.
                        </span>
                      </label>
                    </BloqueConError>

                    <BloqueConError error={erroresCampos.acepta_reglamento} id="acepta_reglamento">
                      <label className="flex items-start gap-4 cursor-pointer p-4 border border-slate-200 rounded-sm hover:bg-slate-50 transition-colors">
                        <input
                          type="checkbox"
                          name="acepta_reglamento"
                          checked={formData.acepta_reglamento}
                          onChange={handleChange}
                          className="mt-0.5 accent-[#003366] w-4 h-4"
                        />
                        <span className="text-sm text-slate-700 leading-snug">
                          Nos comprometemos a cumplir el reglamento interno del evento.
                        </span>
                      </label>
                    </BloqueConError>

                    <BloqueConError error={erroresCampos.acepta_datos} id="acepta_datos">
                      <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-sm">
                        <input
                          type="checkbox"
                          name="acepta_datos"
                          checked={formData.acepta_datos}
                          onChange={handleChange}
                          className="mt-0.5 accent-[#003366] w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <span
                            className="text-sm text-slate-700 leading-snug block cursor-pointer"
                            onClick={() => {
                              setFormData((p) => ({ ...p, acepta_datos: !p.acepta_datos }));
                              limpiarErrorCampo('acepta_datos');
                            }}
                          >
                            Autorizamos el uso de los datos entregados solo para organizar el evento.
                          </span>
                          <button
                            type="button"
                            onClick={() => setMostrarModalLegal(true)}
                            className="text-[10px] font-bold uppercase tracking-widest text-[#418FDE] mt-3 hover:text-[#003366] transition-colors"
                          >
                            Ver acuerdo completo
                          </button>
                        </div>
                      </div>
                    </BloqueConError>
                  </div>
                </motion.div>
              )}
            </div>

            {/* NAVEGACIÓN */}
            <div className="mt-8 flex items-center justify-between">
              <div>
                {paso > 1 && (
                  <button
                    type="button"
                    onClick={pasoAnterior}
                    className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#003366] transition-colors flex items-center gap-2 px-4 py-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Atrás
                  </button>
                )}
              </div>

              <div>
                {paso < 5 ? (
                  <button
                    type="button"
                    onClick={siguientePaso}
                    className="bg-[#003366] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 hover:bg-[#002244] transition-colors rounded-sm shadow-sm flex items-center gap-2"
                  >
                    Siguiente
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={enviarFormulario}
                    disabled={enviando}
                    className="bg-[#003366] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 hover:bg-[#002244] transition-colors rounded-sm shadow-sm disabled:bg-slate-400 flex items-center gap-3"
                  >
                    {enviando && (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {enviando ? 'Enviando...' : 'Enviar postulación'}
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
