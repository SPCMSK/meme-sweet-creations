
import React from 'react';

const HistorySection = () => {
  const milestones = [
    {
      year: "2003",
      title: "Los Inicios",
      description: "Inelia comienza en su cocina casera con recetas heredadas de su abuela"
    },
    {
      year: "2008",
      title: "Formación Profesional",
      description: "Se titula como técnica chef ejecutiva especializada en repostería"
    },
    {
      year: "2015",
      title: "Expansión del Negocio",
      description: "Abre su primer local y comienza a atender eventos especiales"
    },
    {
      year: "2023",
      title: "Delicias de Meme",
      description: "Consolida su marca y lanza la tienda online con productos artesanales"
    }
  ];

  return (
    <section id="historia" className="py-20 bg-gradient-to-br from-pastel-pink/5 to-pastel-purple/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Imagen de Inelia */}
          <div className="relative animate-scale-in">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Inelia Fernández, fundadora de Delicias de Meme"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-playfair text-2xl font-bold">Inelia Fernández</h3>
                <p className="font-inter text-lg opacity-90">Fundadora y Chef Pastelera</p>
              </div>
            </div>
            
            {/* Elementos decorativos */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-pastel-purple/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-pastel-pink/30 rounded-full blur-xl animate-pulse delay-1000"></div>
          </div>

          {/* Contenido de historia */}
          <div className="space-y-8 animate-slide-in-left">
            <div>
              <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-charcoal mb-6">
                Nuestra <span className="text-pastel-purple">Historia</span>
              </h2>
              <p className="font-inter text-lg text-charcoal/80 leading-relaxed mb-6">
                Delicias de Meme, fundado por Inelia Fernández, técnica chef ejecutiva especializada 
                en repostería, comienza desde muy pequeña en la cocina con recetas heredadas y 
                sabores innovadores que han endulzado la vida de cientos de personas.
              </p>
              <p className="font-inter text-lg text-charcoal/80 leading-relaxed">
                Con más de 20 años de experiencia, cada producto refleja la pasión por la repostería 
                artesanal y el compromiso con la calidad que caracteriza nuestro trabajo.
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              <h3 className="font-playfair text-2xl font-semibold text-charcoal mb-4">
                Nuestro Recorrido
              </h3>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div 
                    key={milestone.year}
                    className="flex items-start space-x-4 group"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="flex-shrink-0 w-16 h-16 bg-pastel-purple/10 rounded-full flex items-center justify-center border-2 border-pastel-purple/20 group-hover:border-pastel-purple/50 transition-colors duration-300">
                      <span className="font-inter font-bold text-sm text-pastel-purple">
                        {milestone.year}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-playfair text-lg font-semibold text-charcoal group-hover:text-pastel-purple transition-colors duration-300">
                        {milestone.title}
                      </h4>
                      <p className="font-inter text-charcoal/70 text-sm">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
