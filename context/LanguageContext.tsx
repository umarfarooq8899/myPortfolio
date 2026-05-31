"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "es";

interface TranslationDictionary {
  navbar: {
    about: string;
    projects: string;
    expertise: string;
    contact: string;
    letsTalk: string;
  };
  hero: {
    hello: string;
    firstName: string;
    lastName: string;
    mern: string;
    react: string;
    node: string;
    desc: string;
    viewProjects: string;
    getInTouch: string;
    scroll: string;
  };
  about: {
    sectionTitle: string;
    heading1: string;
    heading2: string;
    para1: string;
    para2: string;
    para3: string;
    projectsBuilt: string;
    monthsExp: string;
    techStack: string;
    coffeeCups: string;
  };
  projects: {
    sectionTitle: string;
    umii: {
      subtitle: string;
      description: string;
    };
    aiDisaster: {
      subtitle: string;
      description: string;
    };
    umiiShoes: {
      subtitle: string;
      description: string;
    };
    margallaEstate: {
      subtitle: string;
      description: string;
    };
    safarBot: {
      subtitle: string;
      description: string;
    };
  };
  tech: {
    sectionTitle: string;
    coreStack: string;
    toolsTitle: string;
    toolsSubtitle: string;
    desc: string;
  };
  contact: {
    sectionTitle: string;
    heading1: string;
    heading2: string;
    desc: string;
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    successMsg: string;
    errorMsg: string;
    sendBtn: string;
    sendingBtn: string;
  };
  footer: {
    builtWith: string;
    mernStack: string;
  };
}

const translations: Record<Language, TranslationDictionary> = {
  en: {
    navbar: {
      about: "About",
      projects: "Projects",
      expertise: "Expertise",
      contact: "Contact",
      letsTalk: "Let's Talk",
    },
    hero: {
      hello: "<Hello World />",
      firstName: "UMAR",
      lastName: "FAROOQ",
      mern: "MERN Stack Developer",
      react: "React Specialist",
      node: "Node.js Engineer",
      desc: "Crafting scalable digital experiences with MongoDB, Express.js, React, and Node.js — the complete MERN stack.",
      viewProjects: "View Projects",
      getInTouch: "Get In Touch",
      scroll: "Scroll",
    },
    about: {
      sectionTitle: "About",
      heading1: "Building the future,",
      heading2: "one line at a time.",
      para1: "I'm a MERN Stack Developer with a passion for building scalable, production-grade web applications. My work spans from designing elegant React frontends to architecting robust Node.js and Express.js backend systems with MongoDB databases.",
      para2: "With deep expertise in the MERN ecosystem — MongoDB, Express.js, React, and Node.js — I craft full-stack digital experiences that are not only visually stunning but also performant and accessible.",
      para3: "When I'm not coding, you'll find me exploring new JavaScript libraries, building REST APIs, or deep-diving into database optimization and application architecture.",
      projectsBuilt: "Projects Built",
      monthsExp: "Months Exp",
      techStack: "Tech Stack",
      coffeeCups: "Coffee Cups",
    },
    projects: {
      sectionTitle: "Projects",
      umii: {
        subtitle: "E-Commerce Platform",
        description: "Modern clothing e-commerce platform offering a curated selection of apparel with a seamless shopping experience.",
      },
      aiDisaster: {
        subtitle: "AI Relief System",
        description: "An advanced platform for disaster prediction and relief coordination, utilizing machine learning algorithms to forecast and manage emergency responses.",
      },
      umiiShoes: {
        subtitle: "Luxury Footwear Store",
        description: "A premium e-commerce storefront for luxury footwear, featuring elegant UI design, smooth animations, and optimized performance.",
      },
      margallaEstate: {
        subtitle: "Real Estate Platform",
        description: "A premium real estate platform showcasing properties in the Margalla Hills, featuring elegant UI design, smooth animations, and optimized performance.",
      },
      safarBot: {
        subtitle: "AI-based Bus Booking Bot",
        description: "An AI-powered conversational bot for seamless bus ticket booking, helping users find routes, check schedules, and reserve seats with ease.",
      },
    },
    tech: {
      sectionTitle: "Expertise",
      coreStack: "Core\nStack",
      toolsTitle: "Tools &",
      toolsSubtitle: "Technologies",
      desc: "A comprehensive MERN stack toolkit for building modern, scalable full-stack web applications — from React frontends to Node.js backends with MongoDB databases.",
    },
    contact: {
      sectionTitle: "Contact",
      heading1: "Let's build",
      heading2: "something great.",
      desc: "Have a project in mind or want to collaborate? I'm always open to discussing new opportunities, creative ideas, or just a friendly chat.",
      nameLabel: "Name",
      emailLabel: "Email",
      messageLabel: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "your@email.com",
      messagePlaceholder: "Tell me about your project...",
      successMsg: "Message sent — thank you!",
      errorMsg: "Something went wrong",
      sendBtn: "Send Message",
      sendingBtn: "Sending...",
    },
    footer: {
      builtWith: "Built with",
      mernStack: "& MERN Stack",
    },
  },
  es: {
    navbar: {
      about: "Sobre Mí",
      projects: "Proyectos",
      expertise: "Experiencia",
      contact: "Contacto",
      letsTalk: "Hablemos",
    },
    hero: {
      hello: "<Hola Mundo />",
      firstName: "UMAR",
      lastName: "FAROOQ",
      mern: "Desarrollador MERN",
      react: "Especialista en React",
      node: "Ingeniero de Node.js",
      desc: "Creando experiencias digitales escalables con MongoDB, Express.js, React y Node.js — el stack MERN completo.",
      viewProjects: "Ver Proyectos",
      getInTouch: "Contactar",
      scroll: "Bajar",
    },
    about: {
      sectionTitle: "Sobre Mí",
      heading1: "Construyendo el futuro,",
      heading2: "línea por línea.",
      para1: "Soy un Desarrollador MERN apasionado por crear aplicaciones web escalables y de nivel de producción. Mi trabajo abarca desde el diseño de elegantes interfaces en React hasta la arquitectura de sistemas robustos en Node.js y Express.js con bases de datos MongoDB.",
      para2: "Con una profunda experiencia en el ecosistema MERN (MongoDB, Express.js, React y Node.js), diseño experiencias digitales de pila completa que no solo son visualmente atractivas sino también eficientes y accesibles.",
      para3: "Cuando no estoy programando, me encontrarás explorando nuevas librerías de JavaScript, construyendo APIs REST o profundizando en la optimización de bases de datos y la arquitectura de aplicaciones.",
      projectsBuilt: "Proyectos Creados",
      monthsExp: "Meses de Exp.",
      techStack: "Tecnologías",
      coffeeCups: "Tazas de Café",
    },
    projects: {
      sectionTitle: "Proyectos",
      umii: {
        subtitle: "Plataforma de Comercio Electrónico",
        description: "Plataforma moderna de comercio electrónico de ropa que ofrece una selección curada de prendas con una experiencia de compra fluida.",
      },
      aiDisaster: {
        subtitle: "Sistema de Alivio ante Desastres IA",
        description: "Una plataforma avanzada para la predicción de desastres y la coordinación de ayuda, que utiliza algoritmos de aprendizaje automático para pronosticar y gestionar respuestas de emergencia.",
      },
      umiiShoes: {
        subtitle: "Tienda de Calzado de Lujo",
        description: "Una tienda de comercio electrónico premium para calzado de lujo, que presenta un diseño de interfaz de usuario elegante, animaciones fluidas y rendimiento optimizado.",
      },
      margallaEstate: {
        subtitle: "Plataforma de Bienes Raíces",
        description: "Una plataforma inmobiliaria premium que muestra propiedades en Margalla Hills, con un diseño de interfaz de usuario elegante, animaciones fluidas y rendimiento optimizado.",
      },
      safarBot: {
        subtitle: "Bot de Reserva de Autobuses con IA",
        description: "Un asistente conversacional inteligente para la reserva de boletos de autobús, que ayuda a los usuarios a consultar horarios, encontrar rutas y asegurar asientos sin esfuerzo.",
      },
    },
    tech: {
      sectionTitle: "Experiencia",
      coreStack: "Stack\nPrincipal",
      toolsTitle: "Herramientas y",
      toolsSubtitle: "Tecnologías",
      desc: "Un conjunto de herramientas completo del stack MERN para crear aplicaciones web de pila completa modernas y escalables, desde frontends en React hasta backends en Node.js con bases de datos MongoDB.",
    },
    contact: {
      sectionTitle: "Contacto",
      heading1: "Construyamos",
      heading2: "algo grandioso.",
      desc: "¿Tienes un proyecto en mente o quieres colaborar? Siempre estoy abierto a discutir nuevas oportunidades, ideas creativas o simplemente charlar.",
      nameLabel: "Nombre",
      emailLabel: "Correo Electrónico",
      messageLabel: "Mensaje",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "tu@correo.com",
      messagePlaceholder: "Cuéntame sobre tu proyecto...",
      successMsg: "¡Mensaje enviado — gracias!",
      errorMsg: "Algo salió mal",
      sendBtn: "Enviar Mensaje",
      sendingBtn: "Enviando...",
    },
    footer: {
      builtWith: "Creado con",
      mernStack: "y Stack MERN",
    },
  },
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: <T extends keyof TranslationDictionary>(
    section: T
  ) => TranslationDictionary[T];
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("en");

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem("portfolio_lang") as Language;
    if (saved === "en" || saved === "es") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("portfolio_lang", lang);
  };

  const t = <T extends keyof TranslationDictionary>(
    section: T
  ): TranslationDictionary[T] => {
    const dict = translations[language];
    const key = section as string;
    if (key === "__proto__" || key === "constructor") {
      throw new Error("Unsafe property access");
    }
    if (Object.prototype.hasOwnProperty.call(dict, section)) {
      return dict[section];
    }
    throw new Error(`Invalid translation section: ${section}`);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
