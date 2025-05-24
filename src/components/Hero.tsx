
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section id="inicio" className="pt-16 min-h-screen bg-gradient-to-br from-warm-white via-pastel-pink/10 to-pastel-purple/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenido textual */}
          <div className="space-y-8 animate-slide-in-left">
            <div className="space-y-4">
              <h1 className="font-playfair text-5xl lg:text-6xl font-bold text-charcoal leading-tight">
                Endulzamos tus días con{' '}
                <span className="text-pastel-purple">amor</span>{' '}
                y <span className="text-pastel-pink">sabor</span>
              </h1>
              <p className="font-inter text-xl text-charcoal/80 leading-relaxed">
                Repostería artesanal chilena creada por Inelia Fernández, técnica en gastronomía 
                con más de 20 años endulzando momentos especiales.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-pastel-purple hover:bg-pastel-purple/90 text-white font-inter font-medium px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
                >
                  Conoce nuestros productos
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-pastel-pink text-charcoal hover:bg-pastel-pink/10 font-inter font-medium px-8 py-3 rounded-full transition-all duration-300"
                >
                  Ver historia
                </Button>
              </div>
              
              <div className="flex items-center space-x-6 text-sm font-inter text-charcoal/70">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pastel-purple rounded-full"></div>
                  <span>+20 años de experiencia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pastel-pink rounded-full"></div>
                  <span>Productos artesanales</span>
                </div>
              </div>
            </div>
          </div>

          {/* Imagen hero */}
          <div className="relative animate-scale-in">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Deliciosos productos de repostería artesanal"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent"></div>
            </div>
            
            {/* Elementos decorativos flotantes */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-pastel-pink/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pastel-purple/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="text-center pb-8">
        <div className="inline-flex flex-col items-center space-y-2 text-charcoal/50">
          <span className="font-inter text-sm">Descubre más</span>
          <div className="w-px h-8 bg-gradient-to-b from-charcoal/30 to-transparent animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
