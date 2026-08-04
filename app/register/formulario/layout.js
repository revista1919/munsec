export const metadata = {
  title: 'Formulario de Inscripción - MUNSEC',
  description: 'Completa tu inscripción para participar en MUNSEC'
};

export default function FormularioLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}