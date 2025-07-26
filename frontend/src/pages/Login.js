import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Factory, Zap, TrendingUp } from 'lucide-react';

const Login = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const demoLogin = () => {
    setFormData({ email: 'demo@opex.com', password: 'demo123' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-white space-y-8 p-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Factory size={48} className="text-blue-200" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                OpEx Manager
              </h1>
            </div>
            <p className="text-xl text-blue-100 font-light">
              Transform your manufacturing operations with intelligent excellence management
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Zap className="text-yellow-300" size={24} />
              <div>
                <h3 className="font-semibold text-lg">Streamlined Workflows</h3>
                <p className="text-blue-100">4-stage approval process with digital signatures</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <TrendingUp className="text-green-300" size={24} />
              <div>
                <h3 className="font-semibold text-lg">Real-time Analytics</h3>
                <p className="text-blue-100">Track KPIs, savings, and performance metrics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold text-slate-800">Welcome Back</CardTitle>
            <p className="text-slate-600">Sign in to access your OpEx dashboard</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 hover:scale-[1.02] shadow-lg"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or try demo</span>
              </div>
            </div>

            <Button 
              onClick={demoLogin}
              variant="outline" 
              className="w-full h-12 border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200"
            >
              Use Demo Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;