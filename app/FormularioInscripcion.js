'use client';
import { useState, useEffect } from 'react'; // ← AGREGA useState AQUÍ
import { motion, AnimatePresence } from 'framer-motion';
import { CONFIG_INSCRIPCION } from '@/config/inscripcion';
import { useRouter } from 'next/navigation';
import { verificarEstadoInscripciones } from '@/config/inscripcion';
export default function FormularioInscripcion() {
  const router = useRouter();
  
  // Verificar si las inscripciones están abiertas
  useEffect(() => {
    const estado = verificarEstadoInscripciones();
    if (!estado.abiertas) {
      router.push('/register');
    }
  }, []);
  // Estados del formulario
  const [paso, setPaso] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    // Paso 1: Establecimiento
    tipo_establecimiento: '',
    nombre_establecimiento: '',
    pais_origen: 'Chile',
    ciudad: '',
    direccion: '',
    telefono_establecimiento: '',
    
    // Paso 2: Profesor responsable
    profesor_nombre: '',
    profesor_apellido: '',
    profesor_rut: '',
    profesor_email: '',
    profesor_telefono: '',
    profesor_edad: '',
    profesor_asignatura: '',
    
    // Paso 3: Delegación
    es_delegacion: false,
    cantidad_delegados: 2,
    delegados: [], // Array de {nombre, rut, edad, curso, pais_preferencia_1, pais_preferencia_2, pais_preferencia_3}
    
    // Paso 4: Pago
    comprobante_base64: null,
    comprobante_nombre: null,
    
    // Términos
    acepta_terminos: false,
    acepta_reglamento: false,
    acepta_datos: false
  });

  // Cargar datos guardados
  useEffect(() => {
    const guardado = localStorage.getItem('munsec_inscripcion');
    const pasoGuardado = localStorage.getItem('munsec_paso');
    
    if (guardado) {
      try {
        setFormData(JSON.parse(guardado));
      } catch (e) {
        console.error('Error al cargar datos guardados');
      }
    }
    if (pasoGuardado) setPaso(parseInt(pasoGuardado));
  }, []);

  // Guardar automáticamente
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('munsec_inscripcion', JSON.stringify(formData));
      localStorage.setItem('munsec_paso', paso.toString());
      setGuardando(true);
      setTimeout(() => setGuardando(false), 800);
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, paso]);

  // Manejar cambios en campos simples
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejar cambios en delegados
  const handleDelegadoChange = (index, field, value) => {
    const nuevosDelegados = [...formData.delegados];
    nuevosDelegados[index] = {
      ...nuevosDelegados[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, delegados: nuevosDelegados }));
  };

  // Agregar/Eliminar delegados
  const actualizarCantidadDelegados = (cantidad) => {
    const num = Math.max(2, Math.min(10, parseInt(cantidad) || 2));
    const delegadosActuales = [...formData.delegados];
    
    if (num > delegadosActuales.length) {
      // Agregar delegados
      while (delegadosActuales.length < num) {
        delegadosActuales.push({
          nombre: '',
          rut: '',
          edad: '',
          curso: '',
          pais_preferencia_1: '',
          pais_preferencia_2: '',
          pais_preferencia_3: ''
        });
      }
    } else {
      // Eliminar delegados
      delegadosActuales.splice(num);
    }
    
    setFormData(prev => ({
      ...prev,
      cantidad_delegados: num,
      delegados: delegadosActuales
    }));
  };

  // Convertir imagen a Base64
  const handleComprobante = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen debe ser menor a 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        comprobante_base64: event.target.result,
        comprobante_nombre: file.name
      }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  // Validar cada paso
  const validarPaso = (num) => {
    switch(num) {
      case 1:
        if (!formData.tipo_establecimiento || !formData.nombre_establecimiento || 
            !formData.ciudad || !formData.pais_origen) {
          throw new Error('Completa todos los campos obligatorios del establecimiento');
        }
        break;
      case 2:
        if (!formData.profesor_nombre || !formData.profesor_rut || 
            !formData.profesor_email || !formData.profesor_telefono) {
          throw new Error('Completa todos los datos del profesor responsable');
        }
        if (!formData.profesor_email.includes('@')) {
          throw new Error('Ingresa un email válido para el profesor');
        }
        // Validar RUT chileno básico
        if (formData.pais_origen === 'Chile' && !validarRut(formData.profesor_rut)) {
          throw new Error('El RUT ingresado no es válido');
        }
        break;
      case 3:
        if (formData.delegados.length === 0) {
          throw new Error('Debes inscribir al menos 2 delegados');
        }
        for (let i = 0; i < formData.delegados.length; i++) {
          const d = formData.delegados[i];
          if (!d.nombre || !d.rut || !d.edad || !d.curso || 
              !d.pais_preferencia_1 || !d.pais_preferencia_2 || !d.pais_preferencia_3) {
            throw new Error(`Completa todos los datos del delegado ${i + 1}`);
          }
          if (formData.pais_origen === 'Chile' && !validarRut(d.rut)) {
            throw new Error(`RUT inválido del delegado ${i + 1}`);
          }
        }
        break;
      case 4:
        if (!formData.comprobante_base64) {
          throw new Error('Debes subir el comprobante de pago');
        }
        if (!formData.acepta_terminos || !formData.acepta_reglamento || !formData.acepta_datos) {
          throw new Error('Debes aceptar todos los términos y condiciones');
        }
        break;
    }
  };

  // Validar RUT chileno
  const validarRut = (rut) => {
    if (!rut) return false;
    // Limpiar el RUT
    const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    if (rutLimpio.length < 8) return false;
    
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);
    
    let suma = 0;
    let multiplo = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    
    return dv === dvCalculado;
  };

  // Navegación entre pasos
  const siguientePaso = () => {
    try {
      validarPaso(paso);
      setPaso(prev => Math.min(prev + 1, 5));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const pasoAnterior = () => {
    setPaso(prev => Math.max(prev - 1, 1));
    setError('');
  };

  // Calcular monto a pagar
  const calcularMonto = () => {
    const tipo = formData.tipo_establecimiento;
    const esDelegacion = formData.es_delegacion;
    const cantidad = formData.cantidad_delegados || 2;
    
    if (tipo === 'publico') {
      return esDelegacion ? CONFIG_INSCRIPCION.pago.valores.publico.delegacion * cantidad 
                          : CONFIG_INSCRIPCION.pago.valores.publico.delegado;
    } else if (tipo === 'privado') {
      return esDelegacion ? CONFIG_INSCRIPCION.pago.valores.privado.delegacion * cantidad 
                          : CONFIG_INSCRIPCION.pago.valores.privado.delegado;
    }
    return 0;
  };

  // Enviar formulario
  const enviarFormulario = async () => {
    try {
      validarPaso(4);
      setEnviando(true);
      
      const response = await fetch('/api/inscripciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al enviar');
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

  // Pantalla de éxito
  if (enviado) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-white flex items-center justify-center p-8"
      >
        <div className="max-w-2xl text-center">
          <div className="text-7xl mb-8">🎉</div>
          <h2 className="font-serif text-4xl text-slate-900 mb-6">
            ¡Inscripción Exitosa!
          </h2>
          <div className="bg-green-50 border border-green-200 p-8 rounded-lg mb-8 text-left">
            <h3 className="font-semibold text-green-800 mb-4">Resumen de tu inscripción:</h3>
            <div className="space-y-2 text-sm text-green-700">
              <p><strong>Establecimiento:</strong> {formData.nombre_establecimiento}</p>
              <p><strong>Profesor:</strong> {formData.profesor_nombre} {formData.profesor_apellido}</p>
              <p><strong>Delegados:</strong> {formData.delegados.length}</p>
              <p><strong>Monto:</strong> ${calcularMonto().toLocaleString('es-CL')} CLP</p>
              <p><strong>Estado:</strong> Pendiente de verificación</p>
            </div>
          </div>
          <p className="text-slate-600 mb-4">
            Revisaremos tu comprobante y confirmaremos tu inscripción en 24-48 horas hábiles.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            Te enviaremos un correo a {formData.profesor_email} con la confirmación.
          </p>
          <button
            onClick={() => window.close()}
            className="bg-slate-900 text-white px-8 py-3 rounded hover:bg-slate-800"
          >
            Cerrar ventana
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-serif text-slate-900">
                Inscripción MUNSEC {CONFIG_INSCRIPCION.año}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {CONFIG_INSCRIPCION.evento.fecha} · {CONFIG_INSCRIPCION.evento.lugar}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Paso {paso} de 4</div>
              <div className="w-32 h-2 bg-slate-200 rounded-full mt-2">
                <div 
                  className="h-full bg-[#4A90E2] rounded-full transition-all duration-500"
                  style={{ width: `${(paso / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Indicador de guardado */}
      <AnimatePresence>
        {guardando && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-20 right-4 bg-white shadow-lg px-4 py-2 rounded-lg text-sm text-slate-600 z-50"
          >
            💾 Guardado automático
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div className="max-w-5xl mx-auto px-6 mt-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">✕</button>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        
        {/* PASO 1: ESTABLECIMIENTO */}
        {paso === 1 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-serif text-slate-900 mb-8">📋 Datos del Establecimiento</h2>
            
            <div className="bg-white p-8 rounded-lg shadow-sm space-y-6">
              {/* Tipo de establecimiento */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Tipo de establecimiento *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                    formData.tipo_establecimiento === 'publico' 
                      ? 'border-[#4A90E2] bg-blue-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="tipo_establecimiento"
                      value="publico"
                      checked={formData.tipo_establecimiento === 'publico'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="text-center">
                      <div className="text-2xl mb-2">🏫</div>
                      <div className="font-semibold text-slate-900">Público/Subvencionado</div>
                      <div className="text-xs text-slate-500 mt-1">Municipal o particular subvencionado</div>
                    </div>
                  </label>
                  
                  <label className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                    formData.tipo_establecimiento === 'privado' 
                      ? 'border-[#4A90E2] bg-blue-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="tipo_establecimiento"
                      value="privado"
                      checked={formData.tipo_establecimiento === 'privado'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="text-center">
                      <div className="text-2xl mb-2">🏛️</div>
                      <div className="font-semibold text-slate-900">Privado</div>
                      <div className="text-xs text-slate-500 mt-1">Particular pagado</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* País de origen */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  País de origen de los estudiantes *
                </label>
                <select
                  name="pais_origen"
                  value={formData.pais_origen}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:border-[#4A90E2] outline-none"
                >
                  <option value="Chile">Chile</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Perú">Perú</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              {/* Nombre del establecimiento */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre del establecimiento *
                </label>
                <input
                  type="text"
                  name="nombre_establecimiento"
                  value={formData.nombre_establecimiento}
                  onChange={handleChange}
                  placeholder="Ej: Liceo Nacional de Maipú"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:border-[#4A90E2] outline-none"
                />
              </div>

              {/* Ciudad y dirección */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    placeholder="Ej: Santiago"
                    className="w-full p-3 border border-slate-200 rounded-lg focus:border-[#4A90E2] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Dirección del establecimiento"
                    className="w-full p-3 border border-slate-200 rounded-lg focus:border-[#4A90E2] outline-none"
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teléfono del establecimiento
                </label>
                <input
                  type="tel"
                  name="telefono_establecimiento"
                  value={formData.telefono_establecimiento}
                  onChange={handleChange}
                  placeholder="+56 2 1234 5678"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:border-[#4A90E2] outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* PASO 2: PROFESOR RESPONSABLE */}
        {paso === 2 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-serif text-slate-900 mb-8">👨‍🏫 Profesor Responsable</h2>
            
            <div className="bg-white p-8 rounded-lg shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="profesor_nombre"
                    value={formData.profesor_nombre}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:border-[#4A90E2] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="profesor_apellido"
                    value={formData.profesor_apellido}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:border-[#4A90E2] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    RUT *
                  </label>
                  <input
                    type="text"
                    name="profesor_rut"
                    value={formData.profesor_rut}
                    onChange={handleChange}
                    placeholder="12.345.678-9"
                    className="w-full p-3 border border-slate-200 rounded-lg focus:border-[#4A90E2] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Edad
                  </label>
                  <input
                    type="number"
                    name="profesor_edad"
                    value={formData.profesor_edad}
                    onChange={handleChange}
                    min="22"
                    max="70"
                    className="w-full p-3 border border-slate-200 rounded-lg focus:border-[#4A90E2] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="profesor_email"
                    value={formData.profesor_email}
                    onChange={handleChange}
                    placeholder="profesor@colegio.cl"
                    className="w-full p-3 border border-slate-200 rounded-lg focus:border-[#4A90E2] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="profesor_telefono"
                    value={formData.profesor_telefono}
                    onChange={handleChange}
                    placeholder="+56 9 1234 5678"
                    className="w-full p-3 border border-slate-200 rounded-lg focus:border-[#4A90E2] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Asignatura que imparte
                </label>
                <input
                  type="text"
                  name="profesor_asignatura"
                  value={formData.profesor_asignatura}
                  onChange={handleChange}
                  placeholder="Ej: Historia, Lenguaje, etc."
                  className="w-full p-3 border border-slate-200 rounded-lg focus:border-[#4A90E2] outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* PASO 3: DELEGADOS */}
        {paso === 3 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-serif text-slate-900 mb-8">👥 Delegados</h2>
            
            <div className="bg-white p-8 rounded-lg shadow-sm space-y-6">
              {/* ¿Es delegación? */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="es_delegacion"
                    checked={formData.es_delegacion}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#4A90E2] rounded"
                  />
                  <span className="text-slate-700">
                    Inscribir como delegación (más de 2 estudiantes)
                  </span>
                </label>
              </div>

              {/* Cantidad de delegados */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cantidad de delegados *
                </label>
                <input
                  type="number"
                  value={formData.cantidad_delegados}
                  onChange={(e) => actualizarCantidadDelegados(e.target.value)}
                  min="2"
                  max="10"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:border-[#4A90E2] outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Mínimo 2, máximo 10 delegados por establecimiento
                </p>
              </div>

              {/* Formularios de delegados */}
              <div className="space-y-8">
                {formData.delegados.map((delegado, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Delegado {index + 1}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          value={delegado.nombre}
                          onChange={(e) => handleDelegadoChange(index, 'nombre', e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded focus:border-[#4A90E2] outline-none text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          RUT *
                        </label>
                        <input
                          type="text"
                          value={delegado.rut}
                          onChange={(e) => handleDelegadoChange(index, 'rut', e.target.value)}
                          placeholder="12.345.678-9"
                          className="w-full p-2 border border-slate-200 rounded focus:border-[#4A90E2] outline-none text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Edad *
                        </label>
                        <input
                          type="number"
                          value={delegado.edad}
                          onChange={(e) => handleDelegadoChange(index, 'edad', e.target.value)}
                          min="14"
                          max="18"
                          className="w-full p-2 border border-slate-200 rounded focus:border-[#4A90E2] outline-none text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Curso *
                        </label>
                        <select
                          value={delegado.curso}
                          onChange={(e) => handleDelegadoChange(index, 'curso', e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded focus:border-[#4A90E2] outline-none text-sm"
                        >
                          <option value="">Seleccionar</option>
                          <option value="1° Medio">1° Medio</option>
                          <option value="2° Medio">2° Medio</option>
                          <option value="3° Medio">3° Medio</option>
                          <option value="4° Medio">4° Medio</option>
                        </select>
                      </div>
                    </div>

                    {/* Preferencias de país - SOLO ASAMBLEA GENERAL */}
                    <div className="mt-4">
                      <label className="block text-xs font-medium text-slate-600 mb-2">
                        Preferencias de país (Asamblea General) *
                      </label>
                      <p className="text-xs text-slate-400 mb-3">
                        Selecciona 3 países en orden de preferencia. No se pueden repetir.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[1, 2, 3].map((pref) => (
                          <div key={pref}>
                            <label className="block text-xs text-slate-500 mb-1">
                              Opción {pref}
                            </label>
                            <select
                              value={delegado[`pais_preferencia_${pref}`]}
                              onChange={(e) => handleDelegadoChange(index, `pais_preferencia_${pref}`, e.target.value)}
                              className="w-full p-2 border border-slate-200 rounded focus:border-[#4A90E2] outline-none text-sm"
                            >
                              <option value="">Seleccionar país</option>
                              {CONFIG_INSCRIPCION.comisiones[0].paises_disponibles.map(pais => (
                                <option key={pais} value={pais}>{pais}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen de precios */}
              {formData.tipo_establecimiento && (
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">Resumen de pago</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>Tipo: {formData.tipo_establecimiento === 'publico' ? 'Público/Subvencionado' : 'Privado'}</p>
                    <p>Cantidad de delegados: {formData.delegados.length}</p>
                    <p className="text-lg font-bold mt-3">
                      Total: ${calcularMonto().toLocaleString('es-CL')} CLP
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* PASO 4: PAGO Y CONFIRMACIÓN */}
        {paso === 4 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-serif text-slate-900 mb-8">💳 Pago y Confirmación</h2>
            
            <div className="space-y-8">
              {/* Datos bancarios */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Datos de la cuenta</h3>
                <div className="bg-slate-900 text-white p-6 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Banco:</span>
                    <span className="font-semibold">{CONFIG_INSCRIPCION.pago.cuenta.banco}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tipo:</span>
                    <span className="font-semibold">{CONFIG_INSCRIPCION.pago.cuenta.tipo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Número:</span>
                    <span className="font-semibold text-xl">{CONFIG_INSCRIPCION.pago.cuenta.numero}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Titular:</span>
                    <span className="font-semibold">{CONFIG_INSCRIPCION.pago.cuenta.titular}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">RUT:</span>
                    <span className="font-semibold">{CONFIG_INSCRIPCION.pago.cuenta.rut}</span>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Monto a transferir:</strong> ${calcularMonto().toLocaleString('es-CL')} CLP
                  </p>
                  <p className="text-xs text-yellow-600 mt-2">
                    {CONFIG_INSCRIPCION.pago.mensaje}
                  </p>
                </div>
              </div>

              {/* Subir comprobante */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Comprobante de pago *</h3>
                
                {!formData.comprobante_base64 ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleComprobante}
                      className="hidden"
                      id="comprobante-input"
                    />
                    <label htmlFor="comprobante-input" className="cursor-pointer">
                      <div className="text-4xl mb-4">📎</div>
                      <p className="text-slate-600 mb-2">Subir comprobante de transferencia</p>
                      <p className="text-xs text-slate-400">JPG, PNG o WebP · Máx. 2MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">✅</span>
                        <div>
                          <p className="font-medium text-green-800">{formData.comprobante_nombre}</p>
                          <p className="text-xs text-green-600">Comprobante cargado correctamente</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          comprobante_base64: null,
                          comprobante_nombre: null
                        }))}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                    <img 
                      src={formData.comprobante_base64} 
                      alt="Comprobante" 
                      className="max-h-48 rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>

              {/* Términos y condiciones */}
              <div className="bg-white p-8 rounded-lg shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Términos y condiciones</h3>
                
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="acepta_terminos"
                    checked={formData.acepta_terminos}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-[#4A90E2] rounded"
                  />
                  <span className="text-sm text-slate-600">
                    Acepto los términos y condiciones de participación en MUNSEC {CONFIG_INSCRIPCION.año}
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="acepta_reglamento"
                    checked={formData.acepta_reglamento}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-[#4A90E2] rounded"
                  />
                  <span className="text-sm text-slate-600">
                    He leído y acepto el reglamento interno de MUNSEC y me comprometo a que todos los delegados lo cumplan
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="acepta_datos"
                    checked={formData.acepta_datos}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-[#4A90E2] rounded"
                  />
                  <span className="text-sm text-slate-600">
                    Autorizo el tratamiento de los datos personales aquí proporcionados para fines exclusivos de la organización de MUNSEC {CONFIG_INSCRIPCION.año}
                  </span>
                </label>
              </div>
            </div>
          </motion.div>
        )}

        {/* Botones de navegación */}
        <div className="flex justify-between mt-8">
          {paso > 1 && (
            <button
              onClick={pasoAnterior}
              className="px-8 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              ← Anterior
            </button>
          )}
          
          {paso < 4 ? (
            <button
              onClick={siguientePaso}
              className="ml-auto bg-[#4A90E2] text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={enviarFormulario}
              disabled={enviando}
              className="ml-auto bg-green-600 text-white px-12 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {enviando ? 'Enviando...' : '✅ Confirmar inscripción'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}