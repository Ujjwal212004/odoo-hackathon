import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { CheckCircle2, Shield, Clock, BarChart3 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    localStorage.setItem('af_auth', 'true');
    navigate('/dashboard');
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
          <div className="flex items-center gap-3">
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
            className="text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em]"
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
            ].map((point) => (
              <div key={point.title} className="flex items-start gap-4">
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
          <div className="flex items-center gap-2 pt-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--status-success)' }} />
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Trusted by operations teams managing 50,000+ assets worldwide
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  RIGHT PANEL – Sign-in form                                  */}
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
              Sign in to AssetFlow
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Enter your credentials to access the platform.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-xs font-medium no-underline"
                  style={{ color: 'var(--status-info)' }}
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Sign in
            </Button>
          </form>

          {/* Footer help text */}
          <p className="text-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Don&apos;t have an account?{' '}
            <a
              href="#"
              className="font-medium no-underline"
              style={{ color: 'var(--primary-navy)' }}
            >
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
