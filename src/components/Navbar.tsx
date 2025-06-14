
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AdminLoginLink from "@/components/AdminLoginLink";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleNavClick = () => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  };

  const handleBookNow = () => {
    navigate('/booking');
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Facilities", href: "/facilities" },
    { name: "Rooms", href: "/rooms" },
    { name: "Suites", href: "/suites" },
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
          <Link to="/" className="flex items-center" onClick={handleNavClick}>
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
                    "font-medium transition-colors duration-300 text-black hover:text-hotel-gold",
                    location.pathname === link.href && "border-b-2 border-hotel-gold"
                  )}
                  onClick={handleNavClick}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Buttons on the right */}
          <div className="hidden md:flex items-center space-x-4">
            <AdminLoginLink />
            <Button 
              className="bg-hotel-gold hover:bg-transparent hover:text-hotel-gold text-white"
              variant="default"
              onClick={handleBookNow}
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 focus:outline-none text-black"
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
                  className={cn(
                    "py-3 px-4 text-black font-medium hover:text-hotel-gold",
                    location.pathname === link.href && "border-l-4 border-hotel-gold"
                  )}
                  onClick={handleNavClick}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center justify-between px-4 py-3 gap-4">
                <AdminLoginLink />
                <Button 
                  className="bg-hotel-gold hover:bg-transparent hover:text-hotel-gold text-white"
                  onClick={handleBookNow}
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
