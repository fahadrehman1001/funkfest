import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, IndianRupee } from 'lucide-react';

const Events = ({ events, loading }) => {
  const navigate = useNavigate();

  return (
    <section id="events-section" className="py-20 px-4" data-testid="events-section">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold text-gradient mb-4"
            style={{ fontFamily: 'Exo 2, sans-serif' }}
          >
            Upcoming Events
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover amazing events lined up for you. From music to tech, we've got it all!
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400 text-lg">No events available at the moment. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <Card
                key={event.id}
                className="glass-card hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`event-card-${event.id}`}
              >
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{event.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="h-4 w-4 text-pink-500" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-lg font-bold">
                    <IndianRupee className="h-5 w-5 text-orange-500" />
                    {event.price}
                  </div>
                  <Button
                    data-testid={`register-event-${event.id}`}
                    className="w-full bg-gradient-primary hover:opacity-90 mt-4"
                    onClick={() => navigate(`/auth?redirect=/payment/${event.id}`)}
                  >
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
