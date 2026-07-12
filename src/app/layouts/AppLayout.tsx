import { Outlet, Link, useLocation } from 'react-router';
import {
  LayoutDashboard, Package, UserCheck, ArrowLeftRight,
  CalendarDays, Wrench, ClipboardCheck, BarChart3,
  Bell, Settings, Search, LogOut, ChevronRight,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Package, UserCheck, ArrowLeftRight,
  CalendarDays, Wrench, ClipboardCheck, BarChart3,
  Bell, Settings,
};

const navigationGroups = [
  {
    label: 'Core',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
      { label: 'Assets', path: '/assets', icon: 'Package' },
      { label: 'Allocation', path: '/allocation', icon: 'UserCheck' },
      { label: 'Transfer', path: '/transfer', icon: 'ArrowLeftRight' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Booking', path: '/booking', icon: 'CalendarDays' },
      { label: 'Maintenance', path: '/maintenance', icon: 'Wrench' },
      { label: 'Audit', path: '/audit', icon: 'ClipboardCheck' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Reports', path: '/reports', icon: 'BarChart3' },
      { label: 'Notifications', path: '/notifications', icon: 'Bell' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', path: '/settings', icon: 'Settings' },
    ],
  },
];

const breadcrumbLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  assets: 'Assets',
  allocation: 'Allocation',
  transfer: 'Transfer',
  booking: 'Booking',
  maintenance: 'Maintenance',
  audit: 'Audit',
  reports: 'Reports',
  notifications: 'Notifications',
  settings: 'Settings',
};

function SidebarNav() {
  const location = useLocation();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 flex w-[240px] flex-col border-r"
      style={{
        backgroundColor: 'var(--sidebar-bg)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div
          className="flex size-9 items-center justify-center rounded-lg text-xs font-semibold"
          style={{
            backgroundColor: 'var(--primary-navy)',
            color: 'var(--text-inverse)',
            letterSpacing: '0.12em',
          }}
        >
          AF
        </div>
        <div>
          <div
            className="text-[0.8125rem] font-semibold uppercase"
            style={{
              color: 'var(--primary-navy)',
              letterSpacing: '0.18em',
            }}
          >
            AssetFlow
          </div>
          <div
            className="text-[0.6875rem]"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Enterprise Platform
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {navigationGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <div
              className="mb-1.5 px-3 text-[0.6875rem] font-medium uppercase"
              style={{
                color: 'var(--text-tertiary)',
                letterSpacing: '0.14em',
              }}
            >
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = iconMap[item.icon];
                const isActive = location.pathname === item.path ||
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[0.8125rem] font-medium transition-colors"
                    style={{
                      backgroundColor: isActive ? 'rgba(23, 42, 69, 0.07)' : 'transparent',
                      color: isActive ? 'var(--primary-navy)' : 'var(--text-secondary)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(23, 42, 69, 0.04)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    {Icon && <Icon className="size-[18px]" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div
        className="border-t px-4 py-4"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex size-8 items-center justify-center rounded-full text-xs font-medium"
            style={{
              backgroundColor: 'var(--primary-navy)',
              color: 'var(--text-inverse)',
            }}
          >
            AC
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="truncate text-[0.8125rem] font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Alicia Chen
            </div>
            <div
              className="truncate text-[0.6875rem]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Operations Director
            </div>
          </div>
          <Link
            to="/"
            className="flex size-7 items-center justify-center rounded-md transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            title="Sign out"
          >
            <LogOut className="size-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  return (
    <header
      className="sticky top-0 z-20 flex h-14 items-center justify-between border-b px-8"
      style={{
        backgroundColor: 'var(--elevated)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[0.8125rem]">
        {segments.map((segment, index) => {
          const label = breadcrumbLabels[segment] || segment;
          const isLast = index === segments.length - 1;
          return (
            <span key={segment} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  className="size-3.5"
                  style={{ color: 'var(--text-tertiary)' }}
                />
              )}
              <span
                className={isLast ? 'font-medium' : ''}
                style={{
                  color: isLast ? 'var(--text-primary)' : 'var(--text-tertiary)',
                }}
              >
                {label}
              </span>
            </span>
          );
        })}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-2 rounded-[10px] border px-3 py-1.5 text-[0.8125rem]"
          style={{
            borderColor: 'var(--border-default)',
            backgroundColor: 'var(--canvas)',
            color: 'var(--text-tertiary)',
          }}
        >
          <Search className="size-3.5" />
          <span>Search assets…</span>
          <kbd
            className="ml-4 rounded border px-1.5 py-0.5 text-[0.625rem] font-medium"
            style={{
              borderColor: 'var(--border-default)',
              color: 'var(--text-tertiary)',
            }}
          >
            ⌘K
          </kbd>
        </div>
        <Link
          to="/notifications"
          className="flex size-8 items-center justify-center rounded-[10px] border transition-colors"
          style={{
            borderColor: 'var(--border-default)',
            color: 'var(--text-secondary)',
          }}
        >
          <Bell className="size-4" />
        </Link>
      </div>
    </header>
  );
}

export default function AppLayout() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--canvas)' }}>
      <SidebarNav />
      <div className="pl-[240px]">
        <TopBar />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
