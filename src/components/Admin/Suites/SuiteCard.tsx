
import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Room } from '@/types/supabase';

interface SuiteCardProps {
  suite: Room;
  onEdit: (suite: Room) => void;
  onDelete: (suite: Room) => void;
  onStatusUpdate: (suiteId: string, status: Room['availability_status']) => void;
  onPriceUpdate: (suiteId: string, price: number) => void;
}

const SuiteCard: React.FC<SuiteCardProps> = ({
  suite,
  onEdit,
  onDelete,
  onStatusUpdate,
  onPriceUpdate,
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <img
          src={suite.image_url || '/placeholder.svg'}
          alt={suite.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute right-2 top-2 rounded-md bg-white px-2 py-1 text-xs font-medium shadow">
          {suite.name} {suite.room_number}
        </div>
        <div className="absolute left-2 top-2">
          <Badge className={suite.availability_status === 'available' ? 'bg-green-500' : 'bg-red-500'}>
            {suite.availability_status === 'available' ? 'Available' : 'Taken'}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1 text-lg">{suite.name}</CardTitle>
          <div className="flex items-center gap-2">
            <p className="font-bold text-primary">₦{Number(suite.price_per_night).toLocaleString()}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {suite.description}
        </p>
        <div className="mt-2 flex items-center">
          <p className="text-sm">Capacity: <span className="font-medium">{suite.capacity} guests</span></p>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {suite.features && suite.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="rounded-full bg-muted px-2 py-1 text-xs">
              {feature}
            </span>
          ))}
          {suite.features && suite.features.length > 3 && (
            <span className="rounded-full bg-muted px-2 py-1 text-xs">
              +{suite.features.length - 3} more
            </span>
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor={`price-${suite.id}`} className="text-xs">Update Price (₦)</Label>
            <div className="flex gap-1">
              <Input 
                id={`price-${suite.id}`} 
                type="number" 
                min="0" 
                step="0.01"
                defaultValue={suite.price_per_night}
                className="h-8 text-xs"
                onBlur={(e) => {
                  if (e.target.value && parseFloat(e.target.value) !== suite.price_per_night) {
                    onPriceUpdate(suite.id, parseFloat(e.target.value));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    onPriceUpdate(suite.id, parseFloat(e.currentTarget.value));
                  }
                }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor={`status-${suite.id}`} className="text-xs">Availability</Label>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={suite.availability_status === 'available' ? 'default' : 'outline'} 
                className={`h-8 w-full ${suite.availability_status === 'available' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                onClick={() => onStatusUpdate(suite.id, 'available')}
              >
                Available
              </Button>
              <Button 
                size="sm"
                variant={suite.availability_status === 'taken' ? 'default' : 'outline'}
                className={`h-8 w-full ${suite.availability_status === 'taken' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                onClick={() => onStatusUpdate(suite.id, 'taken')}
              >
                Taken
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex w-full justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(suite)}
          >
            <Edit size={16} className="mr-1" /> Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(suite)}
          >
            <Trash2 size={16} className="mr-1" /> Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SuiteCard;
