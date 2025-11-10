import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, UserCircle, Shield } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gradient-card backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            className="text-2xl font-bold text-gradient cursor-pointer"
            style={{ fontFamily: 'Exo 2, sans-serif' }}
            onClick={() => navigate('/')}
            data-testid="logo"
          >
            FunkFest Frenzy
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {!user ? (
              <Button
                data-testid="signin-button"
                className="bg-gradient-primary"
                onClick={() => navigate('/auth')}
              >
                Sign In / Sign Up
              </Button>
            ) : (
              <>
                <Button
                  data-testid="dashboard-button"
                  variant={isActive('/dashboard') ? 'default' : 'ghost'}
                  className={isActive('/dashboard') ? 'bg-gradient-primary' : ''}
                  onClick={() => navigate('/dashboard')}
                >
                  <UserCircle className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                {user.is_admin && (
                  <Button
                    data-testid="admin-panel-button"
                    variant={isActive('/admin') ? 'default' : 'ghost'}
                    className={isActive('/admin') ? 'bg-gradient-primary' : ''}
                    onClick={() => navigate('/admin')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Button>
                )}
                <Button
                  data-testid="signout-button"
                  variant="ghost"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
