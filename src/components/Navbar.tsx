
import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);

  const navigationItems = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Productos', href: '#productos' },
    { name: 'Historia', href: '#historia' },
    { name: 'Testimonios', href: '#testimonios' },
    { name: 'Encargos', href: '#encargos' },
    { name: 'Club Delicias', href: '#club' }
  ];

  return (
    <nav className="fixed top-0 w-full bg-warm-white/95 backdrop-blur-sm border-b border-pastel-pink/20 z-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="font-playfair text-2xl font-bold text-charcoal">
              Delicias de <span className="text-pastel-purple">Meme</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="font-inter text-charcoal hover:text-pastel-purple transition-colors duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pastel-purple transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Cart and Mobile menu button */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="relative border-pastel-pink text-charcoal hover:bg-pastel-pink/10"
            >
              <ShoppingCart size={18} />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-pastel-purple text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-charcoal hover:text-pastel-purple transition-colors duration-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-warm-white border-t border-pastel-pink/20">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 font-inter text-charcoal hover:text-pastel-purple transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
