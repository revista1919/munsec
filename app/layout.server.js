export const metadata = {
  metadataBase: new URL("https://www.revistacienciasestudiantes.com/munsec"),

  title: {
    default: "MUNSEC · Modelo de Naciones Unidas para Secundarios de Chile",
    template: "%s | MUNSEC Chile"
  },

  description:
    "MUNSEC es el Modelo de Naciones Unidas para estudiantes secundarios de Chile, con vocación de educación pública y participación ciudadana. Formamos delegados con pensamiento crítico y vocación diplomática.",

  openGraph: {
    title: "MUNSEC · Modelo de Naciones Unidas",
    description:
      "Simulación de UN para secundarios chilenos. Debate, diplomacia y formación ciudadana con enfoque en educación pública.",
    url: "https://www.revistacienciasestudiantes.com/munsec",
    siteName: "MUNSEC Chile",
    images: [
      {
        url: "/munsec.png",
        width: 1200,
        height: 630,
        alt: "MUNSEC · Modelo de Naciones Unidas para Secundarios de Chile"
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
    "MUNSEC",
    "Modelo de Naciones Unidas",
    "ONU secundarios Chile",
    "debate escolar",
    "educación pública Chile",
    "simulación diplomática",
    "formación ciudadana",
    "pensamiento crítico",
    "estudiantes secundarios",
    "Chile",
    "Santiago"
  ],

  authors: [
    { name: "MUNSEC · Organización", url: "https://www.revistacienciasestudiantes.com/munsec/team" }
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
    google: "verification_token_munsec", // Reemplazar con el token real cuando lo tengan
  },

  category: "educación",

  alternates: {
    canonical: "https://www.revistacienciasestudiantes.com/munsec",
    languages: {
      "es-CL": "https://www.revistacienciasestudiantes.com/munsec",
    },
  },

  // Para que aparezca como resultado enriquecido en Google
  other: {
    "og:region": "Chile",
    "og:country-name": "Chile",
  }
};