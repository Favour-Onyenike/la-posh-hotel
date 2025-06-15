
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  Tv, 
  Bath, 
  AirVent, 
  Clock,
  Utensils
} from 'lucide-react';

const RoomsAmenities = () => {
  return (
    <section className="section-padding bg-white py-16">
      <div className="hotel-container">
        <div className="max-w-7xl mx-auto">
          <h2 className="hotel-title text-center mb-8">Standard Room Amenities</h2>
          <p className="text-center mb-12 max-w-3xl mx-auto text-gray-700">
            Every room at La Posh Signature Hotel & Suites comes equipped with these standard amenities
            to ensure your comfort and convenience.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="flex items-start gap-4 p-6">
                <Wifi className="text-hotel-gold" />
                <div>
                  <h3 className="font-medium mb-1">Wi-Fi Access</h3>
                  <p className="text-sm text-gray-600">Complimentary internet access throughout your stay</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="flex items-start gap-4 p-6">
                <AirVent className="text-hotel-gold" />
                <div>
                  <h3 className="font-medium mb-1">Air Conditioning</h3>
                  <p className="text-sm text-gray-600">Individually controlled climate system</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="flex items-start gap-4 p-6">
                <Tv className="text-hotel-gold" />
                <div>
                  <h3 className="font-medium mb-1">TV</h3>
                  <p className="text-sm text-gray-600">Flat-screen television with satellite channels</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="flex items-start gap-4 p-6">
                <Bath className="text-hotel-gold" />
                <div>
                  <h3 className="font-medium mb-1">Luxury Bathroom</h3>
                  <p className="text-sm text-gray-600">Premium bath amenities and plush towels</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="flex items-start gap-4 p-6">
                <Utensils className="text-hotel-gold" />
                <div>
                  <h3 className="font-medium mb-1">Free Breakfast</h3>
                  <p className="text-sm text-gray-600">Complimentary breakfast included with all rooms</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="flex items-start gap-4 p-6">
                <Clock className="text-hotel-gold" />
                <div>
                  <h3 className="font-medium mb-1">Room Service</h3>
                  <p className="text-sm text-gray-600">Available daily from 6:00 AM to 11:00 PM</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4">Executive & Premium Rooms</h3>
            <p className="text-gray-700 mb-6">
              Our Amber and Emerald rooms include additional amenities:
            </p>
            <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
              <Badge variant="outline" className="bg-gray-50 px-3 py-1">Mini Gym Access</Badge>
              <Badge variant="outline" className="bg-gray-50 px-3 py-1">Mini Refrigerator (Emerald only)</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomsAmenities;
