
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const TestimonialsSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: ''
  });

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "María González",
      rating: 5,
      comment: "Los alfajores de Inelia son simplemente increíbles. La textura perfecta y el dulce de leche casero los hace únicos. ¡Los mejores de Santiago!",
      date: "2024-01-15"
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      rating: 5,
      comment: "Pedí una torta para el cumpleaños de mi hija y fue todo un éxito. Hermosa presentación y sabor excepcional. Definitivamente volveré a comprar.",
      date: "2024-01-20"
    },
    {
      id: 3,
      name: "Ana Torres",
      rating: 5,
      comment: "La atención personalizada y la calidad de los productos superó mis expectativas. Los cupcakes estaban deliciosos y frescos.",
      date: "2024-02-01"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index}
        className={index < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nuevo testimonio:', formData);
    // Aquí se enviaría el formulario
    setShowForm(false);
    setFormData({ name: '', email: '', rating: 5, comment: '' });
  };

  return (
    <section id="testimonios" className="py-20 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-charcoal mb-4">
            Lo que dicen nuestros <span className="text-pastel-purple">clientes</span>
          </h2>
          <p className="font-inter text-lg text-charcoal/70 max-w-2xl mx-auto">
            La satisfacción de nuestros clientes es nuestro mayor orgullo. 
            Lee sus experiencias con nuestros productos artesanales.
          </p>
        </div>

        {/* Grid de testimonios */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-playfair text-lg font-semibold text-charcoal">
                  {testimonial.name}
                </h3>
                <div className="flex text-sm">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              
              <p className="font-inter text-charcoal/80 text-sm leading-relaxed mb-4">
                "{testimonial.comment}"
              </p>
              
              <div className="text-xs font-inter text-charcoal/50">
                {new Date(testimonial.date).toLocaleDateString('es-CL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Formulario de testimonios */}
        <div className="text-center">
          {!showForm ? (
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-pastel-purple hover:bg-pastel-purple/90 text-white font-inter font-medium px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
            >
              Deja tu testimonio
            </Button>
          ) : (
            <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-lg animate-scale-in">
              <h3 className="font-playfair text-xl font-semibold text-charcoal mb-4">
                Comparte tu experiencia
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="border-pastel-pink/30 focus:border-pastel-purple"
                />
                
                <Input
                  type="email"
                  placeholder="Tu email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="border-pastel-pink/30 focus:border-pastel-purple"
                />
                
                <div>
                  <label className="block font-inter text-sm text-charcoal/70 mb-2">
                    Calificación
                  </label>
                  <select 
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                    className="w-full p-2 border border-pastel-pink/30 rounded-lg focus:border-pastel-purple focus:outline-none"
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>
                        {num} estrella{num !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Textarea
                  placeholder="Cuéntanos tu experiencia..."
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  required
                  className="border-pastel-pink/30 focus:border-pastel-purple min-h-[100px]"
                />
                
                <div className="flex gap-3">
                  <Button 
                    type="submit"
                    className="flex-1 bg-pastel-purple hover:bg-pastel-purple/90 text-white rounded-full"
                  >
                    Enviar testimonio
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="border-pastel-pink text-charcoal hover:bg-pastel-pink/10 rounded-full"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
