import HomeClient from './page';

export const metadata = {
  title: 'MUNSEC - Modelo de Naciones Unidas para Secundarios de Chile.',
  description: 'Somos el modelo de Naciones Unidas para estudiantes de secundaria en Chile. Nuestro objetivo es fomentar el interés por la diplomacia, la política internacional y el trabajo en equipo entre los jóvenes, especialmente en la educación pública. Ofrecemos a los estudiantes la oportunidad de desarrollar habilidades de debate, negociación y liderazgo mientras aprenden sobre temas globales y actuales.',
};

export default function HomeServer() {
  return <HomeClient />;
}