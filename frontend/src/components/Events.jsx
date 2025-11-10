import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, IndianRupee, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

const Events = ({ events, loading }) => {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Separate events into main and small
  const mainEvents = events.filter(event => event.price >= 500);
  const smallEvents = events.filter(event => event.price < 500);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (loading) {
    return (
      <section id="events-section" className="py-20 px-4" data-testid="events-section">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section id="events-section" className="py-20 px-4" data-testid="events-section">
        <div className="container mx-auto">
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400 text-lg">No events available at the moment. Check back soon!</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="events-section" className="py-20 px-4" data-testid="events-section">
      <div className="container mx-auto">
        {/* Main Events Slider */}
        {mainEvents.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2
                className="text-3xl sm:text-4xl font-bold text-gradient mb-4"
                style={{ fontFamily: 'Exo 2, sans-serif' }}
              >
                Main Events
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Experience the biggest and most spectacular events of FunkFest Frenzy
              </p>
            </div>

            <div className="relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-6">
                  {mainEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_80%] lg:flex-[0_0_60%]"
                      data-testid={`main-event-card-${event.id}`}
                    >
                      <Card className="glass-card hover-lift h-full">
                        {event.image_url && (
                          <img
                            src={event.image_url}
                            alt={event.name}
                            className="w-full h-64 object-cover rounded-t-lg"
                          />
                        )}
                        <CardHeader>
                          <CardTitle className="text-2xl">{event.name}</CardTitle>
                          <CardDescription className="text-base">{event.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="h-5 w-5 text-purple-500" />
                            <span className="text-base">{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <MapPin className="h-5 w-5 text-pink-500" />
                            <span className="text-base">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-2xl font-bold">
                            <IndianRupee className="h-6 w-6 text-orange-500" />
                            {event.price}
                          </div>
                          <Button
                            data-testid={`register-main-event-${event.id}`}
                            className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6"
                            onClick={() => navigate(`/auth?redirect=/payment/${event.id}`)}
                          >
                            Register Now
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              {mainEvents.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border-purple-500 hover:bg-purple-500/20 disabled:opacity-30"
                    onClick={scrollPrev}
                    disabled={!canScrollPrev}
                    data-testid="slider-prev"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border-purple-500 hover:bg-purple-500/20 disabled:opacity-30"
                    onClick={scrollNext}
                    disabled={!canScrollNext}
                    data-testid="slider-next"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Small Events Grid */}
        {smallEvents.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h2
                className="text-3xl sm:text-4xl font-bold text-gradient mb-4"
                style={{ fontFamily: 'Exo 2, sans-serif' }}
              >
                Workshop & Mini Events
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Join our exciting workshops and mini competitions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {smallEvents.map((event, index) => (
                <Card
                  key={event.id}
                  className="glass-card hover-lift animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  data-testid={`small-event-card-${event.id}`}
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
                      data-testid={`register-small-event-${event.id}`}
                      className="w-full bg-gradient-primary hover:opacity-90 mt-4"
                      onClick={() => navigate(`/auth?redirect=/payment/${event.id}`)}
                    >
                      Register Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
