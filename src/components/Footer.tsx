
import React from 'react';
import { Instagram, Map } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-charcoal text-white">
      {/* Sección principal del footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <h3 className="font-playfair text-2xl font-bold">
              Delicias de <span className="text-pastel-purple">Meme</span>
            </h3>
            <p className="font-inter text-gray-300 text-sm leading-relaxed">
              Repostería artesanal chilena con más de 20 años de experiencia. 
              Endulzamos tus días con amor y sabor.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/deliciasmeme" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pastel-pink transition-colors duration-300"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="#mapa" 
                className="text-gray-300 hover:text-pastel-pink transition-colors duration-300"
              >
                <Map size={24} />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4 text-pastel-pink">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2 font-inter text-sm">
              <li>
                <a href="#inicio" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#productos" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Productos
                </a>
              </li>
              <li>
                <a href="#historia" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Nuestra Historia
                </a>
              </li>
              <li>
                <a href="#encargos" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Encargos Personalizados
                </a>
              </li>
              <li>
                <a href="#club" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Club Delicias
                </a>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4 text-pastel-pink">
              Contacto
            </h4>
            <div className="space-y-2 font-inter text-sm text-gray-300">
              <p>📧 info@deliciasmeme.cl</p>
              <p>📱 +56 9 1234 5678</p>
              <p>📍 Santiago, Chile</p>
              <p>🕒 Lun - Sáb: 9:00 - 19:00</p>
            </div>
          </div>

          {/* Mapa */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4 text-pastel-pink">
              Ubicación
            </h4>
            <div className="bg-gray-800 rounded-lg p-4 h-32 flex items-center justify-center">
              <div className="text-center">
                <Map size={32} className="text-pastel-purple mx-auto mb-2" />
                <p className="font-inter text-xs text-gray-300">
                  Mapa de Google Maps
                  <br />
                  <span className="text-pastel-pink">Ver ubicación</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Línea separadora */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="font-inter text-sm text-gray-400">
              © 2024 Delicias de Meme. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6 font-inter text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Términos y Condiciones
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
