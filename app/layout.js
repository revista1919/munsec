"use client";

import './globals.css';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

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
                  className={`nav-link relative group ${
                    pathname === item.path ? 'text-[#4A90E2]' : ''
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
        <main className="pt-24">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[#1E3A5F] text-white mt-24">
          <div className="container-custom py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Brand */}
              <div className="col-span-1 md:col-span-2">
                <img src="/munsec.png" alt="MUNSEC" className="h-16 w-auto brightness-100" />

                <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                  Somos el modelo de Naciones Unidas para estudiantes de secundaria en Chile. 
                  Fomentamos el interés por la diplomacia, la política internacional y el trabajo 
                  en equipo entre los jóvenes, especialmente en la educación pública.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-serif text-xl mb-6">Explora</h4>
                <ul className="space-y-3">
                  <li><Link href="/about" className="text-gray-300 hover:text-white text-sm transition-colors">Sobre Nosotros</Link></li>
                  <li><Link href="/team" className="text-gray-300 hover:text-white text-sm transition-colors">Nuestro Equipo</Link></li>
                  <li><Link href="/archive" className="text-gray-300 hover:text-white text-sm transition-colors">Ediciones Pasadas</Link></li>
                  <li><Link href="/rules" className="text-gray-300 hover:text-white text-sm transition-colors">Reglamento</Link></li>
                </ul>
              </div>

              {/* Contacto - Sin teléfono, solo Instagram */}
              <div>
                <h4 className="font-serif text-xl mb-6">Contacto</h4>
                <ul className="space-y-3">
                  <li className="text-gray-300 text-sm">Santiago, Chile</li>
                  <li>
                    <a href="mailto:info@munsec.cl" className="text-[#4A90E2] hover:underline text-sm">
                      contact@munsec.com
                    </a>
                  </li>
                </ul>
                <div className="flex gap-4 mt-6">
                  {/* Solo Instagram - SVG mejorado y funcional */}
                  <a 
                    href="https://www.instagram.com/munsec.chile/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors group"
                    aria-label="Síguenos en Instagram"
                  >
                    <svg 
                      className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.67.014-4.947.072-1.525.069-2.877.367-3.914 1.404-1.037 1.037-1.335 2.389-1.404 3.914-.058 1.277-.072 1.688-.072 4.947s.014 3.67.072 4.947c.069 1.525.367 2.877 1.404 3.914 1.037 1.037 2.389 1.335 3.914 1.404 1.277.058 1.688.072 4.947.072s3.67-.014 4.947-.072c1.525-.069 2.877-.367 3.914-1.404 1.037-1.037 1.335-2.389 1.404-3.914.058-1.277.072-1.688.072-4.947s-.014-3.67-.072-4.947c-.069-1.525-.367-2.877-1.404-3.914-1.037-1.037-2.389-1.335-3.914-1.404-1.277-.058-1.688-.072-4.947-.072z"/>
                      <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zM18.406 4.855a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar - Año actualizado automáticamente */}
            <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
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