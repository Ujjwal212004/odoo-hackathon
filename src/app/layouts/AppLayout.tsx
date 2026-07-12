import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import {
  LayoutDashboard, Package, UserCheck, ArrowLeftRight,
  CalendarDays, Wrench, ClipboardCheck, BarChart3,
  Bell, Settings, Search, LogOut, ChevronRight, Menu, X,
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

interface SidebarNavProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidebarNav({ isOpen, onClose }: SidebarNavProps) {
  const location = useLocation();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[256px] flex-col border-r transition-transform duration-300 ease-in-out lg:translate-x-0 lg:z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--border-default)',
          boxShadow: '12px 0 36px rgba(20, 33, 61, 0.04)',
        }}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 no-underline transition-opacity hover:opacity-90"
          >
            <img
              src="/LOGO.jpeg"
              alt="Poppy Logo"
              className="size-9 rounded-[8px] object-cover"
            />
            <div>
              <div
                className="text-[0.8125rem] font-semibold uppercase"
                style={{
                  color: 'var(--primary-navy)',
                  letterSpacing: '0.08em',
                }}
              >
                POPPY
              </div>
              <div
                className="text-[0.6875rem]"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Enterprise Platform
              </div>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-[var(--surface)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--elevated)] hover:text-[var(--text-primary)] lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {navigationGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <div
                className="mb-1.5 px-3 text-[0.6875rem] font-medium uppercase"
                style={{
                  color: 'var(--text-tertiary)',
                  letterSpacing: '0.08em',
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
                      onClick={onClose}
                      className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-[0.8125rem] font-medium transition-colors no-underline"
                      style={{
                        backgroundColor: isActive ? 'rgba(20, 33, 61, 0.08)' : 'transparent',
                        color: isActive ? 'var(--primary-navy)' : 'var(--text-secondary)',
                        boxShadow: isActive ? 'inset 2px 0 0 var(--accent-brass)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'rgba(20, 33, 61, 0.04)';
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
              className="flex size-8 items-center justify-center rounded-[8px] text-xs font-medium"
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
              onClick={onClose}
              className="flex size-7 items-center justify-center rounded-[8px] transition-colors hover:bg-[var(--surface)]"
              style={{ color: 'var(--text-tertiary)' }}
              title="Sign out"
            >
              <LogOut className="size-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

interface TopBarProps {
  onMenuClick: () => void;
}

function TopBar({ onMenuClick }: TopBarProps) {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  return (
    <header
      className="sticky top-0 z-20 flex h-14 items-center justify-between border-b px-4 lg:px-8 backdrop-blur"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.86)',
        borderColor: 'var(--border-default)',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="flex size-8 items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-[var(--surface)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--elevated)] hover:text-[var(--text-primary)] lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="size-4" />
        </button>

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
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <div
          className="hidden sm:flex items-center gap-2 rounded-[8px] border px-3 py-1.5 text-[0.8125rem]"
          style={{
            borderColor: 'var(--border-default)',
            backgroundColor: 'var(--surface)',
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
        {/* Mobile Search Button (visible on very small screens) */}
        <button
          className="flex sm:hidden size-8 items-center justify-center rounded-[8px] border hover:bg-[var(--surface)] cursor-pointer"
          style={{
            borderColor: 'var(--border-default)',
            color: 'var(--text-secondary)',
          }}
        >
          <Search className="size-4" />
        </button>

        <Link
          to="/notifications"
          className="flex size-8 items-center justify-center rounded-[8px] border transition-colors hover:bg-[var(--surface)] hover:text-[var(--primary-navy)]"
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--canvas)' }}>
      <SidebarNav isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
      <div className="pl-0 lg:pl-[256px]">
        <TopBar onMenuClick={() => setIsMobileOpen(true)} />
        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
