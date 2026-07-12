import { Link, useNavigate, useLocation } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';
import {
  CheckCircle2,
  ArrowRight,
  Package,
  CalendarDays,
  Wrench,
  BarChart3,
  ClipboardCheck,
  ArrowLeftRight,
  Shield,
  Clock,
  Bell,
  UserCheck,
  FileCheck,
  Activity,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  PreviewShell – mini dashboard chrome used in hero & showcase       */
/* ------------------------------------------------------------------ */
function PreviewShell({ children, title = 'Dashboard' }: { children: React.ReactNode; title?: string }) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--elevated)' }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--surface)' }}
      >
        <span className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#EF4444' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#22C55E' }} />
        </span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-[0.6875rem] font-medium tracking-wide ml-1 border-0 bg-transparent p-0 cursor-pointer outline-none hover:text-[var(--primary-navy)] transition-colors"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {title}
        </button>
      </div>
      {/* Body */}
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared tiny components                                             */
/* ------------------------------------------------------------------ */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[0.6875rem] font-medium tracking-[0.2em] uppercase"
      style={{ color: 'var(--status-info)' }}
    >
      {children}
    </span>
  );
}

function MiniKpiCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div
      className="rounded-[10px] border px-3 py-2.5"
      style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--elevated)' }}
    >
      <p className="text-[0.625rem] font-medium mb-0.5" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </p>
      <p className="text-lg font-semibold" style={{ color: accent || 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Landing Page                                                       */
/* ------------------------------------------------------------------ */
export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--canvas)' }}>
      {/* ============================================================ */}
      {/*  1 · NAVIGATION BAR                                          */}
      {/* ============================================================ */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border-default)' }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 no-underline">
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
          </Link>

          {/* Links + CTAs */}
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6">
              {['Platform', 'Modules'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium transition-colors no-underline"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-navy)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {item}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-[var(--accent-brass)] hover:text-white hover:border-[var(--accent-brass)] transition-colors duration-200"
                >
                  Explore Platform
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10 space-y-16">
        {/* ============================================================ */}
        {/*  2 · HERO                                                    */}
        {/* ============================================================ */}
        <section
          className="rounded-2xl border p-8 lg:p-12"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-default)' }}
        >
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
            {/* Left */}
            <div className="space-y-6">
              <SectionLabel>Enterprise Asset &amp; Resource Management Platform</SectionLabel>
              <h1
                className="text-[2.75rem] lg:text-[3.25rem] font-semibold leading-[1.05] tracking-[-0.03em]"
                style={{ color: 'var(--primary-navy)' }}
              >
                Operational clarity for every asset your organization owns.
              </h1>
              <p className="text-base leading-relaxed max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                AssetFlow gives operations teams a single system to register, allocate, maintain,
                and retire every physical and digital asset — replacing spreadsheets, email chains,
                and disconnected tools.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    className="hover:bg-[var(--accent-brass)] hover:border-[var(--accent-brass)] transition-colors duration-200"
                  >
                    Explore Platform
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-col gap-2.5 pt-2">
                {[
                  'Full asset lifecycle management',
                  'Role-based access & audit trail',
                  'No credit card required to start',
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--status-success)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Preview shell */}
            <PreviewShell title="AssetFlow · Overview">
              {/* KPI row */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <MiniKpiCard label="Available" value="1,284" accent="var(--status-success)" />
                <MiniKpiCard label="Allocated" value="862" accent="var(--primary-navy)" />
                <MiniKpiCard label="Resources" value="96" accent="var(--status-info)" />
                <MiniKpiCard label="Pending" value="14" accent="var(--status-warning)" />
              </div>

              {/* Mini table */}
              <div className="rounded-[10px] border overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
                <table className="w-full text-[0.6875rem]">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--surface)' }}>
                      {['Asset', 'Type', 'Status'].map((h) => (
                        <th
                          key={h}
                          className="text-left px-3 py-2 font-medium"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { asset: 'MBP-4291', type: 'Laptop', status: 'Allocated' },
                      { asset: 'DSK-1034', type: 'Monitor', status: 'Available' },
                      { asset: 'VHL-0887', type: 'Vehicle', status: 'Maintenance' },
                    ].map((row) => (
                      <tr
                        key={row.asset}
                        className="border-t"
                        style={{ borderColor: 'var(--border-default)' }}
                      >
                        <td className="px-3 py-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                          {row.asset}
                        </td>
                        <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>
                          {row.type}
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant="outline" className="text-[0.625rem]">
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </PreviewShell>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  3 · PROBLEM                                                 */}
        {/* ============================================================ */}
        <section id="platform" className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
          <div className="space-y-4 lg:sticky lg:top-24">
            <SectionLabel>The Problem</SectionLabel>
            <h2
              className="text-[1.75rem] lg:text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em]"
              style={{ color: 'var(--primary-navy)' }}
            >
              Fragmented systems make a simple task feel expensive.
            </h2>
          </div>
          <div className="grid gap-4">
            {[
              {
                title: 'Spreadsheet chaos',
                desc: 'Critical asset data lives in dozens of spreadsheets, each with its own conventions, access rules, and version history — or lack thereof.',
              },
              {
                title: 'Disconnected tools',
                desc: 'Procurement, maintenance, and allocation live in separate systems that never share context, forcing teams to copy-paste between windows.',
              },
              {
                title: 'Lost accountability',
                desc: 'Without a single source of truth, nobody knows who has what. Assets go missing, maintenance lapses, and audits become fire-drills.',
              },
            ].map((card) => (
              <Card
                key={card.title}
                className="p-5 border"
                style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--elevated)' }}
              >
                <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {card.desc}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/*  4 · LIFECYCLE                                               */}
        {/* ============================================================ */}
        <section
          className="rounded-2xl border p-8 lg:p-10"
          style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border-default)' }}
        >
          <div className="space-y-4 mb-8">
            <SectionLabel>Complete Lifecycle</SectionLabel>
            <h2
              className="text-[1.75rem] lg:text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em]"
              style={{ color: 'var(--primary-navy)' }}
            >
              One system from registration to retirement.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {['Register', 'Allocate', 'Maintain', 'Audit', 'Analyze', 'Retire'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-3">
                <span
                  className="rounded-full px-5 py-2 text-sm font-medium border"
                  style={{
                    borderColor: 'var(--border-default)',
                    color: 'var(--primary-navy)',
                    backgroundColor: 'var(--surface)',
                  }}
                >
                  {step}
                </span>
                {i < arr.length - 1 && (
                  <ArrowRight className="w-4 h-4 shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/*  5 · MODULES                                                 */}
        {/* ============================================================ */}
        <section id="modules">
          <div className="space-y-4 mb-8">
            <SectionLabel>Platform Modules</SectionLabel>
            <h2
              className="text-[1.75rem] lg:text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em]"
              style={{ color: 'var(--primary-navy)' }}
            >
              Purpose-built modules that work together.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[
              {
                icon: Package,
                title: 'Assets',
                desc: 'Central registry for every physical and digital asset — with custom fields, categories, and QR support.',
              },
              {
                icon: CalendarDays,
                title: 'Bookings',
                desc: 'Calendar-driven reservation system for shared resources — rooms, vehicles, equipment, and more.',
              },
              {
                icon: Wrench,
                title: 'Maintenance',
                desc: 'Schedule preventive tasks, log repairs, and track service history to maximize asset lifespan.',
              },
              {
                icon: BarChart3,
                title: 'Reports',
                desc: 'Pre-built and custom reports covering utilization, depreciation, cost-of-ownership, and compliance.',
              },
              {
                icon: ClipboardCheck,
                title: 'Audit',
                desc: 'Structured audit workflows with evidence capture, discrepancy tracking, and exportable reports.',
              },
              {
                icon: ArrowLeftRight,
                title: 'Allocation',
                desc: 'Assign assets to people, teams, or locations — with approval chains and automatic notifications.',
              },
            ].map((mod) => (
              <Card
                key={mod.title}
                className="p-5 border"
                style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--elevated)' }}
              >
                <div
                  className="w-10 h-10 rounded-[10px] border flex items-center justify-center mb-4"
                  style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--surface)' }}
                >
                  <mod.icon className="w-5 h-5" style={{ color: 'var(--primary-navy)' }} />
                </div>
                <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  {mod.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {mod.desc}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/*  6 · DASHBOARD SHOWCASE                                      */}
        {/* ============================================================ */}
        <section className="grid lg:grid-cols-2 gap-6">
          {/* Left — Dashboard preview */}
          <Card
            className="p-6 border"
            style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--surface)' }}
          >
            <div className="space-y-4 mb-5">
              <SectionLabel>Live Dashboard</SectionLabel>
              <h3
                className="text-lg font-semibold"
                style={{ color: 'var(--primary-navy)' }}
              >
                Everything at a glance
              </h3>
            </div>
            {/* Mini KPIs */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              <MiniKpiCard label="Total Assets" value="2,146" />
              <MiniKpiCard label="Active Users" value="312" />
              <MiniKpiCard label="This Month" value="+48" accent="var(--status-success)" />
              <MiniKpiCard label="Alerts" value="3" accent="var(--status-warning)" />
            </div>
            {/* Allocation health */}
            <div
              className="rounded-[10px] border p-3"
              style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--elevated)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.6875rem] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Allocation Health
                </span>
                <span className="text-[0.6875rem] font-semibold" style={{ color: 'var(--status-success)' }}>
                  87%
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--surface)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: '87%', backgroundColor: 'var(--status-success)' }}
                />
              </div>
            </div>
          </Card>

          {/* Right — Day in the Life */}
          <Card
            className="p-6 border"
            style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--elevated)' }}
          >
            <div className="space-y-4 mb-5">
              <SectionLabel>Workflow</SectionLabel>
              <h3
                className="text-lg font-semibold"
                style={{ color: 'var(--primary-navy)' }}
              >
                A day in the life
              </h3>
            </div>
            <div className="space-y-4">
              {[
                { time: '08:15', icon: Bell, text: 'Maintenance reminder: HVAC-012 service overdue' },
                { time: '09:30', icon: UserCheck, text: 'New allocation request from Engineering team' },
                { time: '10:00', icon: FileCheck, text: 'Quarterly audit report auto-generated' },
                { time: '11:45', icon: Package, text: '12 new laptops registered via bulk import' },
                { time: '14:00', icon: Activity, text: 'Utilization alert: Server Room B at 94% capacity' },
                { time: '16:30', icon: ClipboardCheck, text: 'Audit discrepancy resolved by Facilities' },
              ].map((event) => (
                <div key={event.time} className="flex items-start gap-3">
                  <span
                    className="text-[0.6875rem] font-medium pt-0.5 w-10 shrink-0"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {event.time}
                  </span>
                  <div
                    className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0"
                    style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--surface)' }}
                  >
                    <event.icon className="w-4 h-4" style={{ color: 'var(--primary-navy)' }} />
                  </div>
                  <span className="text-sm leading-snug pt-1" style={{ color: 'var(--text-secondary)' }}>
                    {event.text}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ============================================================ */}
        {/*  7 · FEATURE GRID                                            */}
        {/* ============================================================ */}
        <section
          className="rounded-2xl border p-8 lg:p-10"
          style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border-default)' }}
        >
          <div className="space-y-4 mb-8">
            <SectionLabel>Capabilities</SectionLabel>
            <h2
              className="text-[1.75rem] lg:text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em]"
              style={{ color: 'var(--primary-navy)' }}
            >
              Built for the way operations teams actually work.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
            {[
              'Custom fields & categories',
              'Role-based permissions',
              'Automated depreciation',
              'QR / barcode scanning',
              'Bulk import & export',
              'Email & Slack alerts',
              'Multi-location support',
              'Complete audit trail',
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-2.5">
                <CheckCircle2
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: 'var(--status-success)' }}
                />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/*  8 · FINAL CTA                                               */}
        {/* ============================================================ */}
        <section className="rounded-2xl p-10 lg:p-14" style={{ backgroundColor: 'var(--primary-navy)' }}>
          <div className="max-w-2xl mx-auto text-center space-y-5">
            <span
              className="text-[0.6875rem] font-medium tracking-[0.2em] uppercase"
              style={{ color: 'var(--accent-brass)' }}
            >
              Get Started
            </span>
            <h2 className="text-[1.75rem] lg:text-[2.25rem] font-semibold leading-[1.1] text-white">
              Operational clarity starts here.
            </h2>
            <p className="text-sm leading-relaxed text-white/70 max-w-md mx-auto">
              Join hundreds of operations teams who replaced spreadsheets and disconnected tools
              with a single, purpose-built platform.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="bg-white text-[var(--primary-navy)] hover:bg-[var(--accent-brass)] hover:text-white border border-transparent transition-all duration-200"
                >
                  Explore Platform
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/*  9 · FOOTER                                                  */}
      {/* ============================================================ */}
      <footer className="border-t" style={{ borderColor: 'var(--border-default)' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 border-0 bg-transparent cursor-pointer p-0 text-left outline-none hover:opacity-80 transition-opacity"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: 'var(--primary-navy)', color: '#FFFFFF' }}
            >
              AF
            </div>
            <span
              className="tracking-[0.18em] uppercase font-semibold text-[0.75rem]"
              style={{ color: 'var(--primary-navy)' }}
            >
              ASSETFLOW
            </span>
          </button>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              © {new Date().getFullYear()} AssetFlow. All rights reserved.
            </span>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Enterprise asset management, simplified.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
