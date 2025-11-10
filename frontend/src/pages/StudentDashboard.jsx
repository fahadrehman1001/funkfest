import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';
import { Ticket, Calendar, MapPin, IndianRupee } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);

  useEffect(() => {
    fetchMyTickets();
    fetchEvents();
  }, []);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchMyTickets = async () => {
    try {
      const response = await axios.get(`${API}/registrations/my-tickets`, getAuthHeaders());
      setTickets(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please sign in to continue');
        navigate('/auth');
      } else {
        toast.error('Failed to fetch tickets');
      }
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/events`);
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const isAlreadyRegistered = (eventId) => {
    return tickets.some(ticket => ticket.event_id === eventId);
  };

  const handleRegisterClick = (eventId) => {
    navigate(`/payment/${eventId}`);
  };

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setTicketDialogOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2" style={{ fontFamily: 'Exo 2, sans-serif' }} data-testid="student-dashboard-title">My Dashboard</h1>
          <p className="text-gray-400">Manage your tickets and explore events</p>
        </div>

        {/* My Tickets Section */}
        <section className="mb-12" data-testid="my-tickets-section">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Ticket className="text-purple-500" />
            My Tickets
          </h2>
          {tickets.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="py-12 text-center">
                <p className="text-gray-400 mb-4">You haven't registered for any events yet</p>
                <Button className="bg-gradient-primary" onClick={() => document.getElementById('available-events')?.scrollIntoView({ behavior: 'smooth' })}>
                  Browse Events
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="glass-card hover-lift cursor-pointer"
                  data-testid={`ticket-card-${ticket.id}`}
                  onClick={() => handleTicketClick(ticket)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{ticket.event?.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {ticket.event?.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-xl font-bold text-gradient" data-testid={`ticket-code-${ticket.id}`}>
                        {ticket.ticket_code}
                      </div>
                      <Badge className="bg-green-500">Confirmed</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Available Events Section */}
        <section id="available-events" data-testid="available-events-section">
          <h2 className="text-2xl font-bold mb-6">Available Events</h2>
          {loading ? (
            <div className="text-center py-12">Loading events...</div>
          ) : events.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="py-12 text-center">
                <p className="text-gray-400">No events available at the moment</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const registered = isAlreadyRegistered(event.id);
                return (
                  <Card key={event.id} className="glass-card hover-lift" data-testid={`event-card-${event.id}`}>
                    {event.image_url && (
                      <img src={event.image_url} alt={event.name} className="w-full h-48 object-cover rounded-t-lg" />
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{event.name}</CardTitle>
                        {registered && <Badge className="bg-green-500" data-testid={`registered-badge-${event.id}`}>Registered</Badge>}
                      </div>
                      <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-lg font-bold">
                        <IndianRupee className="h-5 w-5" />
                        {event.price}
                      </div>
                      <Button
                        className="w-full bg-gradient-primary"
                        data-testid={`register-button-${event.id}`}
                        onClick={() => handleRegisterClick(event.id)}
                        disabled={registered}
                      >
                        {registered ? 'Already Registered' : 'Register & Pay'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Ticket Detail Dialog */}
        <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
          <DialogContent className="glass-card" data-testid="ticket-detail-dialog">
            <DialogHeader>
              <DialogTitle>Ticket Details</DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-6 py-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{selectedTicket.event?.name}</h3>
                  <p className="text-gray-400">{selectedTicket.event?.location}</p>
                </div>
                <div className="flex justify-center">
                  <div className="bg-white p-6 rounded-lg">
                    <div className="text-5xl font-mono font-bold text-black" data-testid="ticket-code-large">
                      {selectedTicket.ticket_code}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Event Date:</span>
                    <span className="font-medium">{selectedTicket.event?.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount Paid:</span>
                    <span className="font-medium">₹{selectedTicket.payment_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <Badge className="bg-green-500">{selectedTicket.payment_status}</Badge>
                  </div>
                </div>
                <p className="text-xs text-center text-gray-500">Show this ticket code at the event entrance</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StudentDashboard;
