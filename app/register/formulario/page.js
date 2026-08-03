import FormularioInscripcion from '@/components/FormularioInscripcion';

export const metadata = {
  title: 'Formulario de Inscripción - MUNSEC',
  description: 'Completa tu inscripción para participar en MUNSEC'
};

export default function FormularioPage() {
  return (
    <div className="min-h-screen bg-white">
      <FormularioInscripcion />
    </div>
  );
}