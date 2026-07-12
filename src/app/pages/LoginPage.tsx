import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { CheckCircle2, Shield, Clock, BarChart3, User, UserPlus, ArrowLeft, Loader2 } from 'lucide-react';
import { apiLogin, apiRegister, ApiError } from '@/app/lib/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialMode = location.state?.mode === 'signup'
    ? 'signup'
    : location.state?.mode === 'login'
      ? 'login'
      : 'choose';
  const [viewMode, setViewMode] = useState<'choose' | 'login' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup State
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Error / Status Message
  const [errorMsg, setErrorMsg] = useState('');

  async function handleLoginSubmit(e: FormEvent) {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please fill in all credentials.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const user = await apiLogin(loginEmail, loginPassword);
      localStorage.setItem('af_company_name', companyName || 'AssetFlow');
      localStorage.setItem('af_user_name', user.full_name);
      localStorage.setItem('af_user_role', user.role?.name === 'admin' ? 'Administrator' : user.role?.name === 'manager' ? 'Manager' : 'Employee');
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.detail);
      } else {
        setErrorMsg('Unable to connect to server. Please ensure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSignupSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fullName || !signupEmail || !companyName || !signupPassword || !confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (signupPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const user = await apiRegister(signupEmail, fullName, signupPassword);
      localStorage.setItem('af_company_name', companyName);
      localStorage.setItem('af_user_name', user.full_name);
      localStorage.setItem('af_user_role', user.role?.name === 'admin' ? 'Administrator' : 'Employee');
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.detail);
      } else {
        setErrorMsg('Unable to connect to server. Please ensure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--canvas)' }}>
      {/* ============================================================ */}
      {/*  LEFT PANEL – Branding                                       */}
      {/* ============================================================ */}
      <div
        className="hidden lg:flex flex-1 flex-col justify-center px-16 xl:px-24"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="max-w-md space-y-10">
          {/* Logo mark */}
          <div className="flex items-center gap-3 animate-fade-in">
            <img
              src="/LOGO.jpeg"
              alt="Poppy Logo"
              className="w-11 h-11 rounded-lg object-cover"
            />
            <span
              className="tracking-[0.18em] uppercase font-semibold text-[0.875rem]"
              style={{ color: 'var(--primary-navy)' }}
            >
              POPPY
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-[2rem] font-semibold leading-[1.15]  animate-fade-in stagger-1"
            style={{ color: 'var(--primary-navy)' }}
          >
            Operational clarity for every asset your organization owns.
          </h1>

          {/* Trust points */}
          <div className="space-y-5">
            {[
              {
                icon: Shield,
                title: 'Enterprise-grade security',
                desc: 'Role-based access control, SSO, and complete audit logging.',
              },
              {
                icon: Clock,
                title: 'Real-time visibility',
                desc: 'Track every asset from registration through retirement in one place.',
              },
              {
                icon: BarChart3,
                title: 'Actionable insights',
                desc: 'Utilization reports, depreciation tracking, and compliance dashboards.',
              },
            ].map((point, index) => (
              <div key={point.title} className={`flex items-start gap-4 animate-fade-in stagger-${index + 2}`}>
                <div
                  className="w-10 h-10 rounded-[8px] border flex items-center justify-center shrink-0"
                  style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--elevated)' }}
                >
                  <point.icon className="w-5 h-5" style={{ color: 'var(--primary-navy)' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                    {point.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {point.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="flex items-center gap-2 pt-2 animate-fade-in stagger-5">
            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--status-success)' }} />
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Trusted by operations teams managing 50,000+ assets worldwide
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  RIGHT PANEL – Selection or login/signup form               */}
      {/* ============================================================ */}
      <div
        className="w-full lg:w-[480px] shrink-0 border-l flex items-center justify-center px-8 py-12"
        style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border-default)' }}
      >
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo (only visible on small screens) */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <img
              src="/LOGO.jpeg"
              alt="Poppy Logo"
              className="w-9 h-9 rounded-lg object-cover"
            />
            <span
              className="tracking-[0.18em] uppercase font-semibold text-[0.8125rem]"
              style={{ color: 'var(--primary-navy)' }}
            >
              POPPY
            </span>
          </div>

          {/* Back button (only shown when not on choice screen) */}
          {viewMode !== 'choose' && (
            <button
              onClick={() => {
                setViewMode('choose');
                setErrorMsg('');
              }}
              className="flex items-center gap-1.5 text-[0.75rem] font-medium transition-colors border-0 bg-transparent p-0 cursor-pointer outline-none mb-2"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-navy)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
              disabled={loading}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to options</span>
            </button>
          )}

          {/* Header */}
          <div className="space-y-2">
            <h2
              className="text-xl font-semibold"
              style={{ color: 'var(--primary-navy)' }}
            >
              {viewMode === 'signup'
                ? 'Create an account'
                : viewMode === 'login'
                  ? 'Sign in to POPPY'
                  : 'Welcome to POPPY'}
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {viewMode === 'signup'
                ? 'Get started with a 14-day free enterprise trial.'
                : viewMode === 'login'
                  ? 'Enter your credentials to access the platform.'
                  : 'Please select how you would like to proceed.'}
            </p>
          </div>

          {/* Error messages */}
          {errorMsg && (
            <div
              className="rounded-[8px] border p-3 text-xs font-medium"
              style={{
                backgroundColor: 'var(--status-danger-bg)',
                borderColor: 'var(--status-danger-border)',
                color: 'var(--status-danger)',
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Selection View */}
          {viewMode === 'choose' && (
            <div className="space-y-4 pt-2 animate-fade-in">
              <button
                onClick={() => setViewMode('login')}
                className="w-full text-left p-5 rounded-xl border transition-all duration-200 group flex items-start gap-4 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-navy)]"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border-default)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-brass)';
                  e.currentTarget.style.backgroundColor = 'var(--elevated)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.backgroundColor = 'var(--surface)';
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    backgroundColor: 'rgba(20, 33, 61, 0.06)',
                    color: 'var(--primary-navy)',
                  }}
                >
                  <User className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4
                    className="font-semibold text-sm transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Returning User
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    I already have an account and want to sign in to access my dashboard.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setViewMode('signup')}
                className="w-full text-left p-5 rounded-xl border transition-all duration-200 group flex items-start gap-4 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-navy)]"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border-default)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-brass)';
                  e.currentTarget.style.backgroundColor = 'var(--elevated)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.backgroundColor = 'var(--surface)';
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    backgroundColor: 'rgba(20, 33, 61, 0.06)',
                    color: 'var(--primary-navy)',
                  }}
                >
                  <UserPlus className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4
                    className="font-semibold text-sm transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    New User / Sign Up
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    I want to register a new organization and start a 14-day free trial.
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* Login Form */}
          {viewMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="loginEmail">Email address</Label>
                <Input
                  id="loginEmail"
                  type="email"
                  placeholder="you@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="loginPassword">Password</Label>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setErrorMsg('Password reset is not enabled in this sandbox.'); }}
                    className="text-xs font-medium no-underline"
                    style={{ color: 'var(--status-info)' }}
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="loginPassword"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          )}

          {/* Signup Form */}
          {viewMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Alicia Chen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="signupEmail">Email address</Label>
                <Input
                  id="signupEmail"
                  type="email"
                  placeholder="you@company.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Meridian Industries"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="signupPassword">Password</Label>
                <Input
                  id="signupPassword"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full mt-2" size="lg" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          )}

          {/* Toggle footer links */}
          {viewMode !== 'choose' && (
            <div className="text-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {viewMode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setViewMode('login');
                      setErrorMsg('');
                    }}
                    className="font-medium no-underline"
                    style={{ color: 'var(--primary-navy)' }}
                  >
                    Sign in
                  </a>
                </>
              ) : (
                <>
                  Don&apos;t have an account yet?{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setViewMode('signup');
                      setErrorMsg('');
                    }}
                    className="font-medium no-underline"
                    style={{ color: 'var(--primary-navy)' }}
                  >
                    Sign up
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
