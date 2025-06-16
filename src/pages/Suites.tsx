import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SuiteCard from "@/components/Suites/SuiteCard";
import SuitesHero from "@/components/Suites/SuitesHero";
import SuitesAmenities from "@/components/Suites/SuitesAmenities";
import SuitesLoading from "@/components/Suites/SuitesLoading";
import SuitesCTA from "@/components/Suites/SuitesCTA";
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types/supabase";

const Suites = () => {
  const [suites, setSuites] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to get the correct image path for production
  const getImagePath = (imageName: string) => {
    const isProduction = import.meta.env.PROD;
    return isProduction ? `/la-posh-hotel/lovable-uploads/${imageName}` : `/lovable-uploads/${imageName}`;
  };
  
  useEffect(() => {
    fetchSuites();
  }, []);

  const fetchSuites = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_type', 'suite')
        .order('name', { ascending: true })
        .order('room_number', { ascending: true });

      if (error) {
        console.error('Error fetching suites:', error);
        return;
      }

      // Ensure all suites have proper typing for availability_status
      const suitesWithProperTypes = (data || []).map(suite => ({
        ...suite,
        availability_status: suite.availability_status as Room['availability_status']
      }));

      setSuites(suitesWithProperTypes as Room[]);
    } catch (error) {
      console.error('Error fetching suites:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBookNow = () => {
    navigate('/booking');
  };
  
  if (loading) {
    return <SuitesLoading />;
  }
  
  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-16">
        <SuitesHero getImagePath={getImagePath} />

        {/* Introduction */}
        <section className="section-padding bg-white py-16">
          <div className="hotel-container">
            <div className="max-w-6xl mx-auto">
              <div className="prose prose-lg max-w-none text-center mb-12">
                <p className="mb-6 text-black text-lg leading-relaxed">
                  Our suites offer the ultimate in luxury and comfort, featuring separate living areas,
                  premium amenities, and personalized service to make your stay truly memorable.
                </p>
                <p className="text-black text-lg leading-relaxed">
                  Each suite is meticulously designed to provide a sophisticated atmosphere
                  where you can unwind in style and elegance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Suites Section */}
        <section className="section-padding bg-hotel-beige py-16">
          <div className="hotel-container">
            <div className="max-w-7xl mx-auto">
              <h2 className="hotel-title text-center mb-12">Premium Suites</h2>
              {suites.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No suites available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suites.map((suite) => (
                    <SuiteCard key={suite.id} suite={suite} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <SuitesAmenities />
        <SuitesCTA onBookNow={handleBookNow} />
      </div>
      <Footer />
    </>
  );
};

export default Suites;
