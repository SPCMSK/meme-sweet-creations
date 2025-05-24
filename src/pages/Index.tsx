
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductGallery from '@/components/ProductGallery';
import HistorySection from '@/components/HistorySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CustomOrdersSection from '@/components/CustomOrdersSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      <Hero />
      <ProductGallery />
      <HistorySection />
      <TestimonialsSection />
      <CustomOrdersSection />
      <Footer />
    </div>
  );
};

export default Index;
