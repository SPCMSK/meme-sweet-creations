
import React, { useState } from 'react';
import { ShoppingCart, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const navigationItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Productos', href: '/productos' },
    { name: 'Club Delicias', href: '/club-delicias' },
    { name: 'Historia', href: '#historia' },
    { name: 'Testimonios', href: '#testimonios' },
    { name: 'Encargos', href: '#encargos' },
  ];

  const handleAuthAction = () => {
    navigate('/auth');
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      // Scroll to section on home page
      if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(href);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
    setIsMenuOpen(false);
  };

  const renderAuthSection = (isMobile = false) => {
    if (loading) {
      return (
        <Button
          variant="ghost"
          className={`${isMobile ? 'w-full justify-start text-left' : ''} text-charcoal`}
          disabled
        >
          Cargando...
        </Button>
      );
    }

    if (user) {
      return <UserMenu />;
    } else {
      return (
        <Button
          onClick={handleAuthAction}
          variant="outline"
          size="sm"
          className={`${isMobile ? 'w-full justify-start text-left' : ''} border-pastel-pink text-charcoal hover:bg-pastel-pink/10`}
        >
          <LogIn size={18} className="mr-2" />
          Iniciar Sesión
        </Button>
      );
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-warm-white/95 backdrop-blur-sm border-b border-pastel-pink/20 z-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="font-playfair text-2xl font-bold text-charcoal cursor-pointer"
                onClick={() => navigate('/')}>
              Delicias de <span className="text-pastel-purple">Meme</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="font-inter text-charcoal hover:text-pastel-purple transition-colors duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pastel-purple transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
            </div>
          </div>

          {/* Cart, Auth (Desktop) and Mobile menu button */}
          <div className="flex items-center space-x-4">
            {/* Auth Section para Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {renderAuthSection()}
            </div>

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
                className="text-charcoal hover:text-pastel-purple transition-colors duration-300 p-2 rounded-md"
              >
                {isMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-warm-white border-t border-pastel-pink/20">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left px-3 py-2 font-inter text-charcoal hover:text-pastel-purple transition-colors duration-300"
                >
                  {item.name}
                </button>
              ))}
              {/* Separador y Auth Section para Mobile */}
              <div className="border-t border-pastel-pink/30 my-2"></div>
              <div className="px-1 py-1 space-y-1">
                {renderAuthSection(true)}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
