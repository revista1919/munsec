export const metadata = {
  metadataBase: new URL("https://www.munsec.org"),

  title: {
    default: "MUNSEC · Modelo de Naciones Unidas para Estudiantes Secundarios de Chile",
    template: "%s | MUNSEC Chile"
  },

  description:
    "MUNSEC es un Modelo de Naciones Unidas para estudiantes secundarios de Chile. Promovemos la diplomacia, el debate, la participación ciudadana, el pensamiento crítico y la formación de líderes jóvenes mediante simulaciones de las Naciones Unidas.",

  openGraph: {
    title: "MUNSEC · Modelo de Naciones Unidas",
    description:
      "Modelo de Naciones Unidas para estudiantes secundarios de Chile. Debate, diplomacia y formación ciudadana.",
    url: "https://www.munsec.org",
    siteName: "MUNSEC Chile",
    images: [
      {
        url: "/munsec.png",
        width: 1200,
        height: 630,
        alt: "MUNSEC · Modelo de Naciones Unidas para Estudiantes Secundarios de Chile"
      }
    ],
    locale: "es_CL",
    type: "website"
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico"
  },

  applicationName: "MUNSEC Chile",

  keywords: [
    // Español
    "MUNSEC",
    "Modelo de Naciones Unidas",
    "Modelo Naciones Unidas Chile",
    "ONU secundarios Chile",
    "debate escolar",
    "educación pública Chile",
    "simulación diplomática",
    "formación ciudadana",
    "pensamiento crítico",
    "estudiantes secundarios",
    "liderazgo juvenil",
    "Chile",
    "Santiago",

    // Inglés
    "Model United Nations",
    "Model UN Chile",
    "MUN Conference Chile",
    "High School MUN",
    "Student Diplomacy",
    "United Nations Simulation",
    "MUN Latin America"
  ],

  authors: [
    {
      name: "MUNSEC · Organización",
      url: "https://www.munsec.org/team"
    }
  ],

  creator: "MUNSEC · Secretaría General",

  publisher: "MUNSEC",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },

  verification: {
    google: "verification_token_munsec"
  },

  category: "education",

  alternates: {
    canonical: "https://www.munsec.org",
    languages: {
      "es-CL": "https://www.munsec.org"
    }
  },

  other: {
    "og:region": "Chile",
    "og:country-name": "Chile"
  }
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "MUNSEC",
    alternateName: "Modelo de Naciones Unidas para Estudiantes Secundarios de Chile",
    url: "https://www.munsec.org",
    logo: "https://www.munsec.org/munsec.png",
    description:
      "Modelo de Naciones Unidas para estudiantes secundarios de Chile enfocado en diplomacia, debate, participación ciudadana y pensamiento crítico.",
    areaServed: {
      "@type": "Country",
      name: "Chile"
    },
    sameAs: [
      "https://www.instagram.com/munsec.chile/"
    ]
  };

  return (
    <html lang="es">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />
        {children}
      </body>
    </html>
  );
}