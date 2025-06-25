
import React from "react";

const ContactMap = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="hotel-container">
        <div className="flex items-center mb-12">
          <div className="h-0.5 bg-hotel-gold w-12 mr-4"></div>
          <h2 className="hotel-subtitle text-black text-3xl uppercase font-bold">FIND US</h2>
          <div className="h-0.5 bg-hotel-gold w-12 ml-4"></div>
        </div>
        
        <div className="shadow-xl rounded-lg overflow-hidden">
          <div className="aspect-video w-full">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7944.010875955084!2d6.099631627398713!3d5.7868529316544615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1041dd417a5874a9%3A0xef4b49094cab2dda!2sAbraka%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1590908411317!5m2!1sen!2sng" 
              className="w-full h-full border-0" 
              style={{ border: 0 }}
              allowFullScreen 
              loading="lazy"
              title="La-Posh Hotel Location Map"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
