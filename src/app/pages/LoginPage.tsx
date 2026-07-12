import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { CheckCircle2, Shield, Clock, BarChart3, Loader2 } from 'lucide-react';
import { apiLogin, apiRegister, ApiError } from '@/app/lib/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
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
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center text-base font-bold"
              style={{ backgroundColor: 'var(--primary-navy)', color: '#FFFFFF' }}
            >
              AF
            </div>
            <span
              className="tracking-[0.18em] uppercase font-semibold text-[0.875rem]"
              style={{ color: 'var(--primary-navy)' }}
            >
              ASSETFLOW
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] animate-fade-in stagger-1"
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
                  className="w-10 h-10 rounded-[10px] border flex items-center justify-center shrink-0"
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
      {/*  RIGHT PANEL – Sign-in / Sign-up form                        */}
      {/* ============================================================ */}
      <div
        className="w-full lg:w-[480px] shrink-0 border-l flex items-center justify-center px-8 py-12"
        style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border-default)' }}
      >
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo (only visible on small screens) */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: 'var(--primary-navy)', color: '#FFFFFF' }}
            >
              AF
            </div>
            <span
              className="tracking-[0.18em] uppercase font-semibold text-[0.8125rem]"
              style={{ color: 'var(--primary-navy)' }}
            >
              ASSETFLOW
            </span>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2
              className="text-xl font-semibold"
              style={{ color: 'var(--primary-navy)' }}
            >
              {isSignUp ? 'Create an account' : 'Sign in to AssetFlow'}
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {isSignUp
                ? 'Get started with a 14-day free enterprise trial.'
                : 'Enter your credentials to access the platform.'}
            </p>
          </div>

          {/* Error messages */}
          {errorMsg && (
            <div
              className="rounded-[10px] border p-3 text-xs font-medium"
              style={{
                backgroundColor: 'var(--status-danger-bg)',
                borderColor: 'var(--status-danger-border)',
                color: 'var(--status-danger)',
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Forms */}
          {!isSignUp ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
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
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
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
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          )}

          {/* Toggle button */}
          <div className="text-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSignUp(false);
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
                    setIsSignUp(true);
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
        </div>
      </div>
    </div>
  );
}
