"use client";

import React, { createContext, useContext } from "react";

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

const translations: TranslationDictionary = {
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
};

interface LanguageContextProps {
  t: <T extends keyof TranslationDictionary>(
    section: T
  ) => TranslationDictionary[T];
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const t = <T extends keyof TranslationDictionary>(
    section: T
  ): TranslationDictionary[T] => {
    const key = section as string;
    if (key === "__proto__" || key === "constructor") {
      throw new Error("Unsafe property access");
    }
    if (Object.prototype.hasOwnProperty.call(translations, section)) {
      return translations[section];
    }
    throw new Error(`Invalid translation section: ${section}`);
  };

  return (
    <LanguageContext.Provider value={{ t }}>
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
