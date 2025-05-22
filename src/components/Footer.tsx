
import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-hotel-navy text-white pt-16 pb-8">
      <div className="hotel-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Hotel Info */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">Luxe Haven</h3>
            <p className="mb-4 text-gray-300">
              Experience luxury redefined in the heart of the city. Our hotel combines
              elegant design with impeccable service to create unforgettable stays.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-hotel-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-hotel-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-hotel-gold transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-hotel-gold transition-colors">About</Link>
              </li>
              <li>
                <Link to="/rooms" className="text-gray-300 hover:text-hotel-gold transition-colors">Rooms & Suites</Link>
              </li>
              <li>
                <Link to="/dining" className="text-gray-300 hover:text-hotel-gold transition-colors">Dining</Link>
              </li>
              <li>
                <Link to="/amenities" className="text-gray-300 hover:text-hotel-gold transition-colors">Amenities</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-hotel-gold transition-colors">Gallery</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 mt-1 text-hotel-gold" />
                <span className="text-gray-300">123 Luxury Avenue, Downtown, City 10001</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-hotel-gold" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-hotel-gold" />
                <span className="text-gray-300">info@luxehaven.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-300 mb-4">Subscribe to receive our latest offers and updates</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 bg-hotel-navy border border-gray-600 text-white focus:outline-none focus:border-hotel-gold flex-grow"
              />
              <button className="bg-hotel-gold px-4 py-2 text-white hover:bg-white hover:text-hotel-navy transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Luxe Haven Hotel. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-hotel-gold transition-colors">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="hover:text-hotel-gold transition-colors">Terms & Conditions</a>
              <span>|</span>
              <a href="#" className="hover:text-hotel-gold transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
