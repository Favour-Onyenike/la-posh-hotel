
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface EventsListProps {
  events: Event[] | undefined;
  isLoading: boolean;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const EventsList = ({ events, isLoading, onEdit, onDelete, isDeleting }: EventsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Events List</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading events...</p>
        ) : events && events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.event_date), "PPP 'at' p")}
                  </p>
                  {event.description && (
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(event)}>
                    <Edit size={14} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => onDelete(event.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No events found. Create your first event!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsList;
