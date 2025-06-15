
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ContactHero from "@/components/Contact/ContactHero";
import ContactInfo from "@/components/Contact/ContactInfo";
import ContactForm from "@/components/Contact/ContactForm";
import ContactMap from "@/components/Contact/ContactMap";

const Contact = () => {
  // Helper function to get the correct image path for production
  const getImagePath = (imageName: string) => {
    const isProduction = import.meta.env.PROD;
    return isProduction ? `/la-posh-hotel/lovable-uploads/${imageName}` : `/lovable-uploads/${imageName}`;
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-16">
        <ContactHero getImagePath={getImagePath} />

        {/* Contact Information and Form */}
        <section className="bg-white py-16">
          <div className="hotel-container max-w-6xl mx-auto">
            <div className="flex items-center mb-12">
              <div className="h-0.5 bg-hotel-gold w-12 mr-4"></div>
              <h2 className="hotel-subtitle text-black text-3xl uppercase font-bold">GET IN TOUCH</h2>
              <div className="h-0.5 bg-hotel-gold w-12 ml-4"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              <ContactInfo />
              <ContactForm />
            </div>
          </div>
        </section>
        
        <ContactMap />
        
        {/* CTA Section */}
        <section className="bg-hotel-beige py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="hotel-title mb-6">Book Your Stay Today</h2>
            <p className="text-lg mb-8 text-gray-700 max-w-2xl mx-auto">
              Experience the luxury and comfort of La-Posh Signature Hotel & Suites. We look forward to welcoming you!
            </p>
            <Button className="bg-hotel-gold hover:bg-amber-600 text-white px-8 py-6 text-lg">
              Make a Reservation
            </Button>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
