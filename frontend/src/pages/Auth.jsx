import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  
  // Sign Up State
  const [signUpData, setSignUpData] = useState({
    full_name: '',
    email: '',
    phone: '',
    college: '',
    course: '',
    password: ''
  });

  // Sign In State
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('token');
    if (token) {
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      navigate(redirectTo);
    }
  }, [navigate, searchParams]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/signup`, signUpData);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Account created successfully!');
      
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      navigate(redirectTo);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/signin`, signInData);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Signed in successfully!');
      
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      navigate(redirectTo);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-dark)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Back to Home Button */}
      <Button
        variant="ghost"
        className="absolute top-8 left-8 z-20 text-white hover:text-purple-400"
        onClick={() => navigate('/')}
        data-testid="back-to-home-auth"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="m12 19-7-7 7-7"/>
          <path d="M19 12H5"/>
        </svg>
        Back to Home
      </Button>

      <Card className="w-full max-w-md relative z-10" style={{ background: 'rgba(15, 10, 30, 0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gradient" style={{ fontFamily: 'Exo 2, sans-serif' }}>FunkFest Frenzy</CardTitle>
          <CardDescription className="text-gray-300">Join the ultimate college fest experience</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <TabsTrigger value="signin" data-testid="signin-tab" className="text-gray-200 data-[state=active]:text-white">Sign In</TabsTrigger>
              <TabsTrigger value="signup" data-testid="signup-tab" className="text-gray-200 data-[state=active]:text-white">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" data-testid="signin-form">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-gray-200">Email</Label>
                  <Input
                    id="signin-email"
                    data-testid="signin-email-input"
                    type="email"
                    placeholder="your.email@college.edu"
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    data-testid="signin-password-input"
                    type="password"
                    placeholder="••••••••"
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  data-testid="signin-submit-button"
                  className="w-full bg-gradient-primary hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" data-testid="signup-form">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    data-testid="signup-fullname-input"
                    type="text"
                    placeholder="John Doe"
                    value={signUpData.full_name}
                    onChange={(e) => setSignUpData({ ...signUpData, full_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    data-testid="signup-email-input"
                    type="email"
                    placeholder="your.email@college.edu"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    data-testid="signup-phone-input"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={signUpData.phone}
                    onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="college">College Name</Label>
                  <Input
                    id="college"
                    data-testid="signup-college-input"
                    type="text"
                    placeholder="ABC University"
                    value={signUpData.college}
                    onChange={(e) => setSignUpData({ ...signUpData, college: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Course/Branch</Label>
                  <Input
                    id="course"
                    data-testid="signup-course-input"
                    type="text"
                    placeholder="Computer Science"
                    value={signUpData.course}
                    onChange={(e) => setSignUpData({ ...signUpData, course: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    data-testid="signup-password-input"
                    type="password"
                    placeholder="••••••••"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  data-testid="signup-submit-button"
                  className="w-full bg-gradient-primary hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
