import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin } from 'lucide-react';

const Schedule = () => {
  const scheduleData = [
    {
      day: 'Day 1',
      date: 'March 15, 2024',
      events: [
        { time: '10:00 AM', name: 'Opening Ceremony', venue: 'Main Auditorium' },
        { time: '12:00 PM', name: 'Battle of Bands', venue: 'Open Air Theatre' },
        { time: '03:00 PM', name: 'Dance Competition', venue: 'Cultural Hall' },
        { time: '06:00 PM', name: 'Stand-up Comedy Night', venue: 'Amphitheatre' }
      ]
    },
    {
      day: 'Day 2',
      date: 'March 16, 2024',
      events: [
        { time: '10:00 AM', name: 'Tech Hackathon', venue: 'Computer Lab' },
        { time: '01:00 PM', name: 'Fashion Show', venue: 'Main Stage' },
        { time: '04:00 PM', name: 'DJ Night Prep', venue: 'Open Ground' },
        { time: '07:00 PM', name: 'Celebrity DJ Night', venue: 'Open Ground' }
      ]
    },
    {
      day: 'Day 3',
      date: 'March 17, 2024',
      events: [
        { time: '11:00 AM', name: 'Sports Competitions', venue: 'Sports Complex' },
        { time: '02:00 PM', name: 'Art Exhibition', venue: 'Gallery Hall' },
        { time: '05:00 PM', name: 'Prize Distribution', venue: 'Main Auditorium' },
        { time: '08:00 PM', name: 'Grand Finale Concert', venue: 'Main Stage' }
      ]
    }
  ];

  return (
    <section className="py-20 px-4" style={{ background: 'var(--bg-dark)' }} data-testid="schedule-section">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold text-gradient mb-4"
            style={{ fontFamily: 'Exo 2, sans-serif' }}
          >
            3-Day Schedule
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Plan your fest experience with our detailed schedule
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {scheduleData.map((day, dayIndex) => (
            <Card
              key={dayIndex}
              className="glass-card animate-fade-in-up"
              style={{ animationDelay: `${dayIndex * 0.2}s` }}
              data-testid={`schedule-day-${dayIndex + 1}`}
            >
              <CardHeader className="text-center border-b border-purple-500/20">
                <CardTitle className="text-2xl text-gradient">{day.day}</CardTitle>
                <p className="text-sm text-gray-400">{day.date}</p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {day.events.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="relative pl-8 pb-4 border-l-2 border-purple-500/30 last:border-l-0 last:pb-0"
                      data-testid={`event-${dayIndex}-${eventIndex}`}
                    >
                      <div className="absolute left-[-9px] top-0 w-4 h-4 bg-gradient-primary rounded-full"></div>
                      <div className="flex items-center gap-2 text-sm text-purple-400 mb-1">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </div>
                      <div className="font-semibold mb-1">{event.name}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {event.venue}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
