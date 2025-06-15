
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { GalleryItem } from "@/types/supabase";

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  // Helper function to get proper image paths for GitHub Pages deployment
  const getImagePath = (imageName: string) => {
    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages ? '/la-posh-hotel-app' : '';
    return `${basePath}/lovable-uploads/${imageName}`;
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gallery images:', error);
        return;
      }

      setGalleryImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handler to open the enlarged image modal
  const handleImageClick = (image: string) => {
    setEnlargedImage(image);
  };

  // Handler to close the enlarged image modal
  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-24 md:pt-28 lg:pt-32 pb-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Loading gallery...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-16">
        {/* Hero Section with Background Image - matching About page */}
        <section 
          className="py-24 md:py-32 lg:py-40 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: `url('${getImagePath('e9be561a-1ed6-476f-aab8-fd04aaef0620.png')}')` }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="hotel-container relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h1 className="hotel-title mb-6 text-white text-4xl md:text-5xl lg:text-6xl font-bold">Our Gallery</h1>
              <p className="text-xl md:text-2xl text-white">
                Experience the beauty of La Posh through our lens
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
        
        {/* Main Gallery Grid - Updated grid layout for mobile */}
        <section className="bg-gray-50 py-16">
          <div className="hotel-container max-w-6xl mx-auto">
            <div className="flex items-center mb-12">
              <div className="h-0.5 bg-hotel-gold w-12 mr-4"></div>
              <h2 className="hotel-subtitle text-black text-3xl uppercase font-bold">PHOTO GALLERY</h2>
              <div className="h-0.5 bg-hotel-gold w-12 ml-4"></div>
            </div>
            
            {galleryImages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No images available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                {galleryImages.map((item) => (
                  <div 
                    key={item.id}
                    className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group h-24 sm:h-48 md:h-64 cursor-pointer"
                    onClick={() => handleImageClick(item.image_url)}
                  >
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-hotel-beige py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="hotel-title mb-6">Experience La Posh in Person</h2>
            <p className="text-lg mb-8 text-gray-700 max-w-2xl mx-auto">
              These images only offer a glimpse of the luxury and comfort that awaits you at La Posh Signature Hotel & Suites. Book your stay today to experience it firsthand.
            </p>
          </div>
        </section>
      </div>

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={closeEnlargedImage}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <Button
              variant="outline"
              size="icon"
              className="absolute -top-12 right-0 md:right-auto md:top-0 md:-right-12 bg-white/30 hover:bg-white/50 backdrop-blur-sm z-10"
              onClick={closeEnlargedImage}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
            <img 
              src={enlargedImage} 
              alt="Enlarged view"
              className="w-full h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
};

export default Gallery;
