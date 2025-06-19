
import React from 'react';
import { Room } from '@/types/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Wifi, Car, Coffee, Tv, Wind } from 'lucide-react';

interface RoomsListProps {
  filteredRooms: Room[];
  loading: boolean;
  onBookRoom: (room: Room) => void;
  showBookingButton?: boolean;
}

const RoomsList = ({ filteredRooms, loading, onBookRoom, showBookingButton = true }: RoomsListProps) => {
  const getFeatureIcon = (feature: string) => {
    const lowerFeature = feature.toLowerCase();
    if (lowerFeature.includes('wifi') || lowerFeature.includes('internet')) return <Wifi className="h-4 w-4" />;
    if (lowerFeature.includes('parking')) return <Car className="h-4 w-4" />;
    if (lowerFeature.includes('coffee') || lowerFeature.includes('breakfast')) return <Coffee className="h-4 w-4" />;
    if (lowerFeature.includes('tv') || lowerFeature.includes('television')) return <Tv className="h-4 w-4" />;
    if (lowerFeature.includes('ac') || lowerFeature.includes('air')) return <Wind className="h-4 w-4" />;
    return null;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredRooms.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">No rooms found</h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more rooms.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRooms.map((room) => (
        <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="p-0">
            {room.image_url && (
              <img 
                src={room.image_url} 
                alt={room.name}
                className="w-full h-48 object-cover"
              />
            )}
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <CardTitle className="text-xl">{room.name}</CardTitle>
                <p className="text-sm text-gray-600">{room.room_number}</p>
                <Badge variant="outline" className="mt-1 capitalize">
                  {room.room_type}
                </Badge>
              </div>

              {room.description && (
                <p className="text-gray-600 text-sm line-clamp-2">
                  {room.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>Up to {room.capacity} guests</span>
                <Badge 
                  variant={room.availability_status === 'available' ? 'default' : 'secondary'}
                  className="ml-auto"
                >
                  {room.availability_status}
                </Badge>
              </div>

              {room.features && room.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {room.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {getFeatureIcon(feature)}
                      <span>{feature}</span>
                    </div>
                  ))}
                  {room.features.length > 4 && (
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      +{room.features.length - 4} more
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <span className="text-2xl font-bold">₦{room.price_per_night.toLocaleString()}</span>
                  <span className="text-gray-600 text-sm">/night</span>
                </div>
                <Button 
                  variant="hotel" 
                  onClick={() => onBookRoom(room)}
                  disabled={room.availability_status !== 'available' || !showBookingButton}
                  className="min-w-[100px]"
                >
                  {!showBookingButton ? 'Complete Filters' : 'Book Now'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RoomsList;
