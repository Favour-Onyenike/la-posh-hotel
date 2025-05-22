
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Rooms", href: "/rooms" },
    { name: "Dining", href: "/dining" },
    { name: "Amenities", href: "/amenities" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white",
        isScrolled
          ? "shadow-md py-2"
          : "py-4"
      )}
    >
      <div className="hotel-container">
        <div className="flex items-center justify-between">
          {/* Logo on the left */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/bbd7d628-218e-45e5-a2f6-5dd221ccc495.png" 
              alt="LA POSH Signature Suites" 
              className="h-12 md:h-16"
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-6">
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "font-medium transition-colors duration-300 hover:text-hotel-gold text-hotel-navy"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Buttons on the right */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-white"
              variant="default"
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 focus:outline-none text-hotel-navy"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md animate-fade-in">
            <div className="flex flex-col py-4 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="py-3 px-4 text-hotel-navy font-medium hover:bg-hotel-beige hover:text-hotel-gold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="px-4 py-3">
                <Button 
                  className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-white w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
