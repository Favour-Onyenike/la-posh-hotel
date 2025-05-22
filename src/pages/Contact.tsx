
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon!",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-16">
        {/* Hero Section with Background Image - matching About and Gallery pages */}
        <section 
          className="py-24 md:py-32 lg:py-40 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: "url('/lovable-uploads/e9be561a-1ed6-476f-aab8-fd04aaef0620.png')" }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="hotel-container relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h1 className="hotel-title mb-6 text-white text-4xl md:text-5xl lg:text-6xl font-bold">Contact Us</h1>
              <p className="text-xl md:text-2xl text-white">
                We'd love to hear from you
              </p>
              <div className="flex justify-center gap-2 mt-8">
                <Star className="text-hotel-gold" size={24} />
                <Star className="text-hotel-gold" size={24} />
                <Star className="text-hotel-gold" size={24} />
                <Star className="text-hotel-gold" size={24} />
                <Star className="text-hotel-gold" size={24} />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information and Form */}
        <section className="bg-white py-16">
          <div className="hotel-container max-w-6xl mx-auto">
            <div className="flex items-center mb-12">
              <div className="h-0.5 bg-hotel-gold w-12 mr-4"></div>
              <h2 className="hotel-subtitle text-black text-3xl uppercase font-bold">GET IN TOUCH</h2>
              <div className="h-0.5 bg-hotel-gold w-12 ml-4"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-2xl mb-4 font-semibold text-gray-800">Contact Information</h3>
                  <p className="text-gray-600 mb-8">
                    We're always ready to assist you with any inquiries about bookings, services, or special requests. 
                    Here's how you can reach us:
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-hotel-gold space-y-6">
                  <div className="flex items-start">
                    <div className="bg-hotel-gold p-3 rounded-full mr-4">
                      <MapPin className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 mb-1">Our Location</h4>
                      <p className="text-gray-600">5 Poultry Road by Labrix, Abraka, Delta State</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-hotel-gold p-3 rounded-full mr-4">
                      <Phone className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 mb-1">Phone Number</h4>
                      <p className="text-gray-600">+234 905 212 9939</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-hotel-gold p-3 rounded-full mr-4">
                      <Mail className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 mb-1">Email Address</h4>
                      <p className="text-gray-600">laposhsignaturesuites@gmail.com</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6">
                  <h3 className="font-serif text-2xl mb-4 font-semibold text-gray-800">Business Hours</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span className="font-medium">24 Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span className="font-medium">24 Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="font-medium">24 Hours</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
                <h3 className="font-serif text-2xl mb-6 font-semibold text-center">Send Us a Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700">Your Name</label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full border-gray-300 focus:border-hotel-gold focus:ring-hotel-gold"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">Your Email</label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full border-gray-300 focus:border-hotel-gold focus:ring-hotel-gold"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this regarding?"
                      className="w-full border-gray-300 focus:border-hotel-gold focus:ring-hotel-gold"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700">Your Message</label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Type your message here..."
                      className="w-full h-32 border-gray-300 focus:border-hotel-gold focus:ring-hotel-gold"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-hotel-gold hover:bg-amber-600 text-white transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span>Send Message</span>
                        <Send className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* Map Section */}
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
