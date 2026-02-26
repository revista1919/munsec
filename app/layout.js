"use client";

import './globals.css';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Sobre MUNSEC', path: '/about' },
    { name: 'Equipo', path: '/team' },
    { name: 'Comités', path: '/committees' },
    { name: 'Archivo', path: '/archive' },
    { name: 'Reglamento', path: '/rules' },
    { name: 'Aliados', path: '/partner' },
    { name: 'Inscripciones', path: '/register' },
    { name: 'Contacto', path: '/contact' },
  ];

  return (
    <html lang="es">
      <body className="antialiased">
        {/* Header */}
        <header 
          className={`fixed top-0 w-full z-50 transition-all duration-500 ${
            scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'
          }`}
        >
          <div className="container-custom flex justify-between items-center">
           

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`nav-link relative group text-sm font-medium transition-colors ${
                    pathname === item.path ? 'text-[#4A90E2]' : 'text-[#1E3A5F]'
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4A90E2] transition-all duration-300 group-hover:w-full ${
                    pathname === item.path ? 'w-full' : ''
                  }`}></span>
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden flex flex-col gap-1.5 p-2"
            >
              <span className={`w-6 h-0.5 bg-[#1E3A5F] transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}></span>
              <span className={`w-6 h-0.5 bg-[#1E3A5F] transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}></span>
              <span className={`w-6 h-0.5 bg-[#1E3A5F] transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}></span>
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-100"
              >
                <div className="container-custom py-8 flex flex-col space-y-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.path}
                        className={`block py-2 text-base uppercase tracking-wider ${
                          pathname === item.path 
                            ? 'text-[#4A90E2] font-medium' 
                            : 'text-gray-700 hover:text-[#4A90E2]'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Main Content */}
        <main className="pt-24 min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[#1E3A5F] text-white mt-24">
          <div className="container-custom py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              
              {/* Brand Column */}
              <div className="col-span-1 md:col-span-2 flex flex-col items-start">
                <div className="mb-6">
                  <Image 
                    src="/munsec/munsec.png" 
                    alt="MUNSEC Logo" 
                    className="h-20 w-auto object-contain brightness-110" 
                  />
                </div>
                <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                  Somos el modelo de Naciones Unidas para estudiantes de secundaria en Chile. 
                  Fomentamos el interés por la diplomacia, la política internacional y el trabajo 
                  en equipo entre los jóvenes, especialmente en la educación pública.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-serif text-xl mb-6 border-b border-[#4A90E2]/30 pb-2">Explora</h4>
                <ul className="space-y-3">
                  <li><Link href="/about" className="text-gray-300 hover:text-[#4A90E2] text-sm transition-colors">Sobre Nosotros</Link></li>
                  <li><Link href="/team" className="text-gray-300 hover:text-[#4A90E2] text-sm transition-colors">Nuestro Equipo</Link></li>
                  <li><Link href="/archive" className="text-gray-300 hover:text-[#4A90E2] text-sm transition-colors">Ediciones Pasadas</Link></li>
                  <li><Link href="/rules" className="text-gray-300 hover:text-[#4A90E2] text-sm transition-colors">Reglamento</Link></li>
                </ul>
              </div>

              {/* Contacto */}
              <div>
                <h4 className="font-serif text-xl mb-6 border-b border-[#4A90E2]/30 pb-2">Contacto</h4>
                <ul className="space-y-3 mb-6">
                  <li className="text-gray-300 text-sm">Santiago, Chile</li>
                  <li>
                    <a href="mailto:contact@munsec.com" className="text-[#4A90E2] hover:text-white transition-colors text-sm break-all">
                      contact@munsec.com
                    </a>
                  </li>
                </ul>
                <div className="flex gap-4">
                  {/* Instagram SVG Optimizado */}
                  <a 
                    href="https://www.instagram.com/munsec.chile/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 p-2.5 rounded-full text-gray-300 hover:text-white hover:bg-[#4A90E2] transition-all duration-300 group"
                    aria-label="Síguenos en Instagram"
                  >
                    <svg 
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
              <p>© {new Date().getFullYear()} MUNSEC. Todos los derechos reservados.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <Link href="/rules" className="hover:text-white transition-colors">Reglamento</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Contacto</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}