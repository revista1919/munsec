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

  // Verificar si estamos en la página del formulario
  const isFormularioPage = pathname === '/register/formulario';
  const isConfirmacionPage = pathname === '/confirmacion';

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
        {/* Header - Solo se muestra si NO es la página del formulario */}
        {!isFormularioPage && !isConfirmacionPage && (
          <header 
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${
              scrolled 
                ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' 
                : 'bg-transparent py-6'
            }`}
          >
            <div className="container-custom flex justify-between items-center">
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`nav-link ${
                      pathname === item.path 
                        ? 'text-[#009EDB] font-bold' 
                        : 'text-slate-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden flex flex-col gap-1.5 p-2"
                aria-label="Menú de navegación"
              >
                <span className={`block w-6 h-0.5 bg-slate-900 transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}></span>
                <span className={`block w-6 h-0.5 bg-slate-900 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}></span>
                <span className={`block w-6 h-0.5 bg-slate-900 transition-all duration-300 ${
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
                  className="lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-100"
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
                          className={`block py-2 text-sm uppercase tracking-[0.15em] font-medium transition-colors ${
                            pathname === item.path 
                              ? 'text-[#009EDB]' 
                              : 'text-slate-700 hover:text-[#009EDB]'
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
        )}

        {/* Main Content - Sin padding-top en el formulario */}
        <main className={`${isFormularioPage ? '' : 'pt-24'} min-h-screen`}>
          {children}
        </main>

        {/* Footer - Solo se muestra si NO es la página del formulario */}
        {!isFormularioPage && !isConfirmacionPage && (
          <footer className="bg-[#0F172A] text-white mt-24">
            <div className="container-custom py-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                
                {/* Brand Column */}
                <div className="col-span-1 md:col-span-2 flex flex-col items-start">
                  <div className="mb-6">
                    <Image 
                      src="/munsec.png" 
                      alt="MUNSEC Logo" 
                      width={80}
                      height={80}
                      className="object-contain brightness-110"
                    />
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                    Somos el modelo de Naciones Unidas para estudiantes de secundaria en Chile. 
                    Fomentamos el interés por la diplomacia, la política internacional y el trabajo 
                    en equipo entre los jóvenes, especialmente en la educación pública.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="font-serif text-xl mb-6 border-b border-[#009EDB]/30 pb-2">Explora</h4>
                  <ul className="space-y-3">
                    <li><Link href="/about" className="text-slate-300 hover:text-[#009EDB] text-sm transition-colors">Sobre Nosotros</Link></li>
                    <li><Link href="/team" className="text-slate-300 hover:text-[#009EDB] text-sm transition-colors">Nuestro Equipo</Link></li>
                    <li><Link href="/archive" className="text-slate-300 hover:text-[#009EDB] text-sm transition-colors">Ediciones Pasadas</Link></li>
                    <li><Link href="/rules" className="text-slate-300 hover:text-[#009EDB] text-sm transition-colors">Reglamento</Link></li>
                  </ul>
                </div>

                {/* Contacto */}
                <div>
                  <h4 className="font-serif text-xl mb-6 border-b border-[#009EDB]/30 pb-2">Contacto</h4>
                  <ul className="space-y-3 mb-6">
                    <li className="text-slate-300 text-sm">Santiago, Chile</li>
                    <li>
                      <a href="mailto:contacto@munsec.org" className="text-[#009EDB] hover:text-white transition-colors text-sm break-all">
                        contacto@munsec.org
                      </a>
                    </li>
                  </ul>
                  <div className="flex gap-4">
                    {/* Instagram SVG */}
                    <a 
                      href="https://www.instagram.com/munsec.chile/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-[#009EDB] transition-all duration-300 group"
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
              <div className="border-t border-slate-700/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
                <p>© {new Date().getFullYear()} MUNSEC. Todos los derechos reservados.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                  <Link href="/rules" className="hover:text-white transition-colors">Reglamento</Link>
                  <Link href="/contact" className="hover:text-white transition-colors">Contacto</Link>
                </div>
              </div>
            </div>
          </footer>
        )}
      </body>
    </html>
  );
}