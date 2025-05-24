import React, { useState, useEffect } from 'react'; // useEffect podría ser necesario si usas useAuth con efectos secundarios directos aquí
import { ShoppingCart, LogIn, User, LogOut } from 'lucide-react'; // Añadido LogIn, User, LogOut
import { Button } from '@/components/ui/button';

// IMPORTACIONES CLAVE PARA LA AUTENTICACIÓN
import { useAuth } from 'src/contexts/AuthContext'; // Ajusta la ruta si es diferente
import { signInWithGoogle } from 'src/auth/authService'; // Ajusta la ruta si es diferente

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0); // Dejamos tu estado del carrito

  // LÓGICA DE AUTENTICACIÓN
  const { user, loading, signOut } = useAuth(); // Obtén el estado del usuario y la función signOut

  const navigationItems = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Productos', href: '#productos' },
    { name: 'Historia', href: '#historia' },
    { name: 'Testimonios', href: '#testimonios' },
    { name: 'Encargos', href: '#encargos' },
    { name: 'Club Delicias', href: '#club' }
  ];

  // Componente o función para renderizar los botones/info de autenticación
  // para no repetir código en desktop y mobile.
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
      return (
        <>
          <span className={`font-inter text-charcoal ${isMobile ? 'block py-2 px-3' : 'mr-3 hidden sm:inline'}`}>
            Hola, {user.user_metadata?.full_name || user.email?.split('@')[0]}
          </span>
          <Button
            onClick={async () => {
              await signOut();
              if (isMobile) setIsMenuOpen(false); // Cierra el menú móvil al hacer logout
            }}
            variant="outline"
            size="sm"
            className={`${isMobile ? 'w-full justify-start text-left' : ''} border-pastel-pink text-charcoal hover:bg-pastel-pink/10`}
          >
            <LogOut size={18} className="mr-2" />
            Salir
          </Button>
        </>
      );
    } else {
      return (
        <Button
          onClick={async () => {
            await signInWithGoogle();
            if (isMobile) setIsMenuOpen(false); // Cierra el menú móvil después de intentar iniciar sesión
          }}
          variant="outline"
          size="sm"
          className={`${isMobile ? 'w-full justify-start text-left' : ''} border-pastel-pink text-charcoal hover:bg-pastel-pink/10`}
        >
          <LogIn size={18} className="mr-2" />
          Ingresar con Google
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
                className="text-charcoal hover:text-pastel-purple transition-colors duration-300 p-2 rounded-md" // Añadido padding y rounded para mejor click target
              >
                {isMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> {/* Icono X cuando está abierto */}
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /> {/* Icono Hamburguesa */}
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
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 font-inter text-charcoal hover:text-pastel-purple transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              {/* Separador y Auth Section para Mobile */}
              <div className="border-t border-pastel-pink/30 my-2"></div>
              <div className="px-1 py-1 space-y-1"> {/* Ajustado padding si es necesario */}
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
