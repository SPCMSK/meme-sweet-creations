
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface OrderForm {
  fullName: string;
  whatsapp: string;
  product: string;
  desiredDate: string;
  observations: string;
  voucher: File | null;
}

const CustomOrdersSection = () => {
  const [formData, setFormData] = useState<OrderForm>({
    fullName: '',
    whatsapp: '',
    product: '',
    desiredDate: '',
    observations: '',
    voucher: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const productOptions = [
    'Torta personalizada',
    'Cupcakes temáticos',
    'Alfajores personalizados',
    'Mesa de dulces',
    'Donuts especiales',
    'Cheesecake',
    'Otro (especificar en observaciones)'
  ];

  const handleInputChange = (field: keyof OrderForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      voucher: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Aquí se guardarían los datos en base de datos o se enviarían por email
      console.log('Datos del encargo:', formData);

      // Crear mensaje para WhatsApp
      const message = `Hola! Te escribo desde el sitio web de Delicias de Meme.

*Solicitud de Encargo Personalizado:*

👤 *Nombre:* ${formData.fullName}
📱 *WhatsApp:* ${formData.whatsapp}
🧁 *Producto:* ${formData.product}
📅 *Fecha deseada:* ${formData.desiredDate}
📝 *Observaciones:* ${formData.observations}

¿Podrías confirmarme disponibilidad y enviarme el presupuesto?

¡Gracias!`;

      // Abrir WhatsApp con el mensaje precargado
      const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      // Limpiar formulario
      setFormData({
        fullName: '',
        whatsapp: '',
        product: '',
        desiredDate: '',
        observations: '',
        voucher: null
      });

      alert('Tu solicitud ha sido enviada. Te contactaremos por WhatsApp pronto.');

    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      alert('Hubo un error al enviar tu solicitud. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="encargos" className="py-20 bg-gradient-to-br from-pastel-purple/5 to-pastel-pink/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-charcoal mb-4">
            Encargos <span className="text-pastel-purple">Personalizados</span>
          </h2>
          <p className="font-inter text-lg text-charcoal/70 max-w-2xl mx-auto">
            ¿Tienes una ocasión especial? Creamos productos únicos adaptados a tus necesidades. 
            Completa el formulario y nos contactaremos contigo por WhatsApp.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl shadow-xl p-8 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-inter font-medium text-charcoal mb-2">
                  Nombre completo *
                </label>
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                  placeholder="Ingresa tu nombre completo"
                  className="border-pastel-pink/30 focus:border-pastel-purple transition-colors"
                />
              </div>

              <div>
                <label className="block font-inter font-medium text-charcoal mb-2">
                  Número de WhatsApp *
                </label>
                <Input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  required
                  placeholder="+56 9 1234 5678"
                  className="border-pastel-pink/30 focus:border-pastel-purple transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-inter font-medium text-charcoal mb-2">
                Producto deseado *
              </label>
              <select
                value={formData.product}
                onChange={(e) => handleInputChange('product', e.target.value)}
                required
                className="w-full p-3 border border-pastel-pink/30 rounded-lg focus:border-pastel-purple focus:outline-none transition-colors font-inter"
              >
                <option value="">Selecciona un producto</option>
                {productOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-inter font-medium text-charcoal mb-2">
                Fecha deseada *
              </label>
              <Input
                type="date"
                value={formData.desiredDate}
                onChange={(e) => handleInputChange('desiredDate', e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="border-pastel-pink/30 focus:border-pastel-purple transition-colors"
              />
            </div>

            <div>
              <label className="block font-inter font-medium text-charcoal mb-2">
                Subir voucher o imagen de referencia
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="w-full p-3 border border-pastel-pink/30 rounded-lg focus:border-pastel-purple focus:outline-none transition-colors font-inter file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-pastel-purple file:text-white hover:file:bg-pastel-purple/90"
              />
              <p className="text-xs font-inter text-charcoal/50 mt-1">
                Formatos permitidos: JPG, PNG, PDF (máx. 5MB)
              </p>
            </div>

            <div>
              <label className="block font-inter font-medium text-charcoal mb-2">
                Observaciones
              </label>
              <Textarea
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                placeholder="Describe detalles adicionales: sabores preferidos, colores, decoración especial, cantidad de personas, etc."
                className="border-pastel-pink/30 focus:border-pastel-purple transition-colors min-h-[120px]"
              />
            </div>

            <div className="bg-pastel-pink/10 rounded-lg p-4">
              <h3 className="font-playfair font-semibold text-charcoal mb-2">
                ¿Cómo funciona?
              </h3>
              <ul className="font-inter text-sm text-charcoal/70 space-y-1">
                <li>1. Completas este formulario con los detalles de tu encargo</li>
                <li>2. Al enviarlo, se abrirá WhatsApp con tu solicitud</li>
                <li>3. Te contactaremos para confirmar detalles y precio</li>
                <li>4. Una vez confirmado, coordinamos el retiro en tienda</li>
              </ul>
            </div>

            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pastel-purple hover:bg-pastel-purple/90 text-white font-inter font-medium py-3 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar solicitud por WhatsApp'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CustomOrdersSection;
