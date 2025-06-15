
import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactInfo = () => {
  return (
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
  );
};

export default ContactInfo;
