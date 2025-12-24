import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from '@/utils/validation';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';

type AuthMode = 'login' | 'register';

interface FormErrors {
  [key: string]: string;
}

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<AuthMode>(
    (searchParams.get('mode') as AuthMode) || 'login'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, searchParams]);

  // Update mode from URL
  useEffect(() => {
    const urlMode = searchParams.get('mode') as AuthMode;
    if (urlMode && (urlMode === 'login' || urlMode === 'register')) {
      setMode(urlMode);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setServerError(null);
  };

  const validateForm = (): boolean => {
    const schema = mode === 'login' ? loginSchema : registerSchema;
    const dataToValidate = mode === 'login' 
      ? { email: formData.email, password: formData.password }
      : formData;

    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as string;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    let result;
    if (mode === 'login') {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData.email, formData.password, formData.name);
    }

    if (result.success) {
      toast({
        title: mode === 'login' ? 'Welcome back!' : 'Account created!',
        description: mode === 'login' 
          ? 'You have successfully logged in.' 
          : 'Your account has been created successfully.',
      });
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    } else {
      setServerError(result.error || 'An error occurred. Please try again.');
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'login' ? 'register' : 'login';
    setMode(newMode);
    setErrors({});
    setServerError(null);
    navigate(`/auth?mode=${newMode}`, { replace: true });
  };

  return (
    <Layout>
      <div 
        className="container flex items-center justify-center py-12"
        data-testid="auth-page"
      >
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-card p-8 shadow-lg animate-scaleIn">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 
                className="font-display text-2xl font-bold text-foreground mb-2"
                data-testid="auth-title"
              >
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'login'
                  ? 'Sign in to access your account'
                  : 'Sign up to start shopping'}
              </p>
            </div>

            {/* Server Error */}
            {serverError && (
              <div 
                className="mb-6 flex items-center gap-3 rounded-lg bg-destructive/10 p-4 text-sm text-destructive animate-shake"
                data-testid="server-error"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" data-testid="auth-form">
              {/* Name Field (Register only) */}
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                      data-testid="name-input"
                    />
                  </div>
                  {errors.name && (
                    <p 
                      className="text-sm text-destructive"
                      data-testid="name-error"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                    data-testid="email-input"
                  />
                </div>
                {errors.email && (
                  <p 
                    className="text-sm text-destructive"
                    data-testid="email-error"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                    data-testid="password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="toggle-password-visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p 
                    className="text-sm text-destructive"
                    data-testid="password-error"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field (Register only) */}
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                      data-testid="confirm-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="toggle-confirm-password-visibility"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p 
                      className="text-sm text-destructive"
                      data-testid="confirm-password-error"
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
                data-testid="submit-button"
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-2 font-medium text-primary hover:underline"
                  data-testid="toggle-auth-mode"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Test Account Info */}
            {mode === 'login' && (
              <div 
                className="mt-6 rounded-lg bg-muted p-4 text-sm"
                data-testid="test-account-info"
              >
                <p className="font-medium mb-1">Test Account:</p>
                <p className="text-muted-foreground">
                  Email: <code className="bg-background px-1 rounded">test@example.com</code>
                </p>
                <p className="text-muted-foreground">
                  Password: <code className="bg-background px-1 rounded">Password123!</code>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
