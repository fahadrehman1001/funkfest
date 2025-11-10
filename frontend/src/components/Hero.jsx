import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const scrollToEvents = () => {
    document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      data-testid="hero-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))`
      }}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1609162282955-a2568cc10704?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxjb2xsZWdlJTIwZmVzdCUyMGNlbGVicmF0aW9ufGVufDB8fHx8MTc2Mjc5NjMyMnww&ixlib=rb-4.1.0&q=85"
          alt="Festival Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-dark)]/50 to-[var(--bg-dark)]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in-up">
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          style={{ fontFamily: 'Exo 2, sans-serif' }}
          data-testid="hero-title"
        >
          Welcome to <span className="text-gradient">FunkFest Frenzy</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Experience the ultimate college fest celebration! Music, dance, competitions, and unforgettable memories await you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            data-testid="hero-register-button"
            className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6 animate-glow-pulse"
            onClick={() => navigate('/auth')}
          >
            Register Now
          </Button>
          <Button
            data-testid="hero-view-events-button"
            variant="outline"
            className="text-lg px-8 py-6 border-purple-500 hover:bg-purple-500/10"
            onClick={scrollToEvents}
          >
            View Events
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
          <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">3</div>
            <div className="text-sm text-gray-400">Days of Fun</div>
          </div>
          <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">50+</div>
            <div className="text-sm text-gray-400">Events</div>
          </div>
          <div className="animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">5000+</div>
            <div className="text-sm text-gray-400">Participants</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
