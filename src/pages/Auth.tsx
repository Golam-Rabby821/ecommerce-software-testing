import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { loginSchema, registerSchema } from '@/utils/validation';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Sparkles } from 'lucide-react';

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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, searchParams]);

  useEffect(() => {
    const urlMode = searchParams.get('mode') as AuthMode;
    if (urlMode && (urlMode === 'login' || urlMode === 'register')) {
      setMode(urlMode);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError(null);
  };

  const validateForm = (): boolean => {
    const schema = mode === 'login' ? loginSchema : registerSchema;
    const dataToValidate =
      mode === 'login'
        ? { email: formData.email, password: formData.password }
        : formData;

    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
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

    const result =
      mode === 'login'
        ? await login(formData.email, formData.password)
        : await register(formData.email, formData.password, formData.name);

    if (result.success) {
      toast({
        title: mode === 'login' ? 'Welcome back!' : 'Account created!',
        description:
          mode === 'login'
            ? 'You have successfully logged in.'
            : 'Your account has been created successfully.',
      });
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    } else {
      setServerError(result.error || 'An error occurred. Please try again.');
    }
  };

  const handleFillTestCredentials = () => {
    setFormData((prev) => ({
      ...prev,
      email: 'test@example.com',
      password: 'Password123!',
    }));
    setErrors({});
    setServerError(null);
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
      <div className="container flex items-center justify-center py-12" data-testid="auth-page">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-border bg-card p-8 shadow-sm animate-scaleIn">
            <div className="mb-7 text-center">
              <p className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold mb-1.5">
                {mode === 'login' ? 'Session Access' : 'New Profile'}
              </p>
              <h1
                className="font-display text-2xl font-bold text-foreground mb-1"
                data-testid="auth-title"
              >
                {mode === 'login' ? 'Sign In to TechStore' : 'Create Account'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mode === 'login'
                  ? 'Access checkout, order history, and account preferences'
                  : 'Register a local test session account'}
              </p>
            </div>

            {serverError && (
              <div
                role="alert"
                className="mb-6 flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive animate-shake"
                data-testid="server-error"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4" data-testid="auth-form">
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                      data-testid="name-input"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-destructive" data-testid="name-error">
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                    data-testid="email-input"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive" data-testid="email-error">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
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
                    aria-label={showPassword ? 'Mask input visibility' : 'Reveal input visibility'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive" data-testid="password-error">
                    {errors.password}
                  </p>
                )}
              </div>

              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
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
                      aria-label={showConfirmPassword ? 'Mask confirmation visibility' : 'Reveal confirmation visibility'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive" data-testid="confirm-password-error">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

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

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-2 font-semibold text-foreground underline underline-offset-4 hover:text-accent"
                  data-testid="toggle-auth-mode"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {mode === 'login' && (
              <div
                className="mt-6 rounded-md border border-border bg-secondary/50 p-4 text-xs space-y-2"
                data-testid="test-account-info"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold uppercase tracking-wider text-foreground">
                    QA Sandbox Account
                  </span>
                  <button
                    type="button"
                    onClick={handleFillTestCredentials}
                    data-testid="fill-test-credentials"
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-accent hover:underline"
                  >
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    Auto-fill
                  </button>
                </div>
                <div className="font-mono text-muted-foreground space-y-0.5">
                  <p>
                    email: <span className="text-foreground">test@example.com</span>
                  </p>
                  <p>
                    pass:  <span className="text-foreground">Password123!</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
