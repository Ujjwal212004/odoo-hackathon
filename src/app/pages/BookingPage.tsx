import { useState } from 'react';
import { bookings as initialBookings } from '@/app/data/mockData';
import StatusBadge from '@/app/components/StatusBadge';
import PageHeader from '@/app/components/PageHeader';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Plus, Clock, MapPin, ChevronLeft, ChevronRight, CalendarDays, X } from 'lucide-react';

/* ── Helpers ─────────────────────────────────────────────────────────── */

const WEEK_DAYS = [
  { key: 'mon', label: 'Mon', date: '14' },
  { key: 'tue', label: 'Tue', date: '15' },
  { key: 'wed', label: 'Wed', date: '16' },
  { key: 'thu', label: 'Thu', date: '17' },
  { key: 'fri', label: 'Fri', date: '18' },
];

const HOURS = Array.from({ length: 10 }, (_, i) => 8 + i); // 08–17

/** Map booking date → day column index (0-based) */
function dayIndex(dateStr: string): number {
  const d = parseInt(dateStr.split('-')[2], 10);
  return d - 14; // 14→0, 15→1, 16→2, 17→3, 18→4
}

/** Map time string "HH:MM" → hour row index (0-based from 08:00) */
function hourRow(time: string): number {
  return parseInt(time.split(':')[0], 10) - 8;
}

/** How many hour-rows a booking spans */
function hourSpan(start: string, end: string): number {
  const s = parseInt(start.split(':')[0], 10);
  const e = parseInt(end.split(':')[0], 10);
  return Math.max(e - s, 1);
}

function bookingBg(status: string) {
  switch (status) {
    case 'Confirmed':
      return 'var(--status-success-bg)';
    case 'Pending':
      return 'var(--status-warning-bg)';
    case 'Cancelled':
      return 'var(--surface)';
    default:
      return 'var(--surface)';
  }
}

function bookingBorder(status: string) {
  switch (status) {
    case 'Confirmed':
      return 'var(--status-success)';
    case 'Pending':
      return 'var(--status-warning)';
    case 'Cancelled':
      return 'var(--text-tertiary)';
    default:
      return 'var(--border-default)';
  }
}

export default function BookingPage() {
  const [localBookings, setLocalBookings] = useState(initialBookings);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resource, setResource] = useState('Conference Room A');
  const [bookedBy, setBookedBy] = useState('');
  const [bookingDate, setBookingDate] = useState('2025-07-14');
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('12:00');
  const [location, setLocation] = useState('North Wing — Floor 3');

  const calendarBookings = localBookings.filter(
    (b) => dayIndex(b.date) >= 0 && dayIndex(b.date) <= 4
  );

  const upcomingBookings = localBookings
    .filter((b) => b.status !== 'Cancelled')
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

  function handleCreateBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!resource || !bookedBy) return;

    const newBooking = {
      id: `BKG-0${localBookings.length + 1}`,
      resource: `${resource} — ${location}`,
      bookedBy,
      date: bookingDate,
      startTime,
      endTime,
      status: 'Confirmed' as const,
      location,
    };

    setLocalBookings(prev => [...prev, newBooking]);
    setIsModalOpen(false);
    setBookedBy('');
  }

  return (
    <div>
      <PageHeader
        title="Booking"
        description="Schedule and manage shared resources"
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="size-4" />
            Book Resource
          </Button>
        }
      />

      {/* ── Two-column layout ────────────────────────────────────── */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 340px' }}>
        {/* ── Left: Weekly Calendar ─────────────────────────────── */}
        <div
          className="rounded-xl border p-5"
          style={{
            backgroundColor: 'var(--elevated)',
            borderColor: 'var(--border-default)',
          }}
        >
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-5">
            <Button variant="ghost" size="icon" onClick={() => alert('Previous week booking archives are not loaded.')}>
              <ChevronLeft className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <CalendarDays
                className="size-4"
                style={{ color: 'var(--text-tertiary)' }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                July 14 — 18, 2025
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => alert('Next week booking scheduler is not loaded.')}>
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {/* Calendar grid */}
          <div
            className="relative"
            style={{
              display: 'grid',
              gridTemplateColumns: '48px repeat(5, 1fr)',
              gridTemplateRows: `auto repeat(${HOURS.length}, 48px)`,
            }}
          >
            {/* Column headers */}
            <div /> {/* Empty corner */}
            {WEEK_DAYS.map((day) => (
              <div
                key={day.key}
                className="text-center pb-2"
                style={{ borderBottom: '1px solid var(--border-default)' }}
              >
                <span
                  className="text-[0.6875rem] uppercase tracking-wide"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {day.label}
                </span>
                <br />
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {day.date}
                </span>
              </div>
            ))}

            {/* Time rows */}
            {HOURS.map((hour, rowIdx) => (
              <div key={`row-${hour}`} style={{ display: 'contents' }}>
                {/* Time label */}
                <div
                  className="flex items-start justify-end pr-3 pt-1 text-[0.6875rem]"
                  style={{
                    color: 'var(--text-tertiary)',
                    gridRow: rowIdx + 2,
                    gridColumn: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {String(hour).padStart(2, '0')}:00
                </div>

                {/* Day cells for this row */}
                {WEEK_DAYS.map((day, colIdx) => (
                  <div
                    key={`cell-${hour}-${day.key}`}
                    style={{
                      gridRow: rowIdx + 2,
                      gridColumn: colIdx + 2,
                      borderBottom: '1px solid var(--border-default)',
                      borderLeft: '1px solid var(--border-default)',
                    }}
                  />
                ))}
              </div>
            ))}

            {/* Booking blocks (positioned absolutely within the grid) */}
            {calendarBookings.map((booking) => {
              const col = dayIndex(booking.date);
              const row = hourRow(booking.startTime);
              const span = hourSpan(booking.startTime, booking.endTime);

              return (
                <div
                  key={booking.id}
                  className="rounded-lg p-2 text-xs overflow-hidden"
                  style={{
                    gridColumn: col + 2,
                    gridRow: `${row + 2} / span ${span}`,
                    backgroundColor: bookingBg(booking.status),
                    borderLeft: `3px solid ${bookingBorder(booking.status)}`,
                    opacity: booking.status === 'Cancelled' ? 0.6 : 1,
                    margin: '1px',
                    zIndex: 1,
                  }}
                >
                  <p
                    className="font-medium truncate"
                    style={{ color: 'var(--text-primary)', fontSize: '0.6875rem' }}
                  >
                    {booking.resource.split('—')[0].trim()}
                  </p>
                  <p
                    className="truncate mt-0.5"
                    style={{ color: 'var(--text-secondary)', fontSize: '0.625rem' }}
                  >
                    {booking.bookedBy}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right: Upcoming Bookings ──────────────────────────── */}
        <div
          className="rounded-xl border p-5"
          style={{
            backgroundColor: 'var(--elevated)',
            borderColor: 'var(--border-default)',
          }}
        >
          <h3
            className="text-sm font-medium mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Upcoming Bookings
          </h3>

          <div className="flex flex-col">
            {upcomingBookings.map((booking, idx) => (
              <div
                key={booking.id}
                className="py-3"
                style={{
                  borderBottom:
                    idx < upcomingBookings.length - 1
                      ? '1px solid var(--border-default)'
                      : 'none',
                }}
              >
                <p
                  className="font-medium text-sm"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {booking.resource}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {booking.bookedBy}
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                  <Clock
                    className="size-3"
                    style={{ color: 'var(--text-tertiary)' }}
                  />
                  <span
                    className="text-xs"
                    style={{
                      color: 'var(--text-tertiary)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {booking.date} · {booking.startTime}–{booking.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin
                    className="size-3"
                    style={{ color: 'var(--text-tertiary)' }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {booking.location}
                  </span>
                </div>
                <div className="mt-2">
                  <StatusBadge status={booking.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Book Resource Modal ──────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div 
            className="w-full max-w-md rounded-xl border p-6 space-y-4 animate-fade-in-up"
            style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border-default)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[1rem] font-semibold" style={{ color: 'var(--primary-navy)' }}>
                Book Shared Resource
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 hover:bg-[var(--surface)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <Label htmlFor="bkgResource">Resource Name</Label>
                <select 
                  id="bkgResource"
                  value={resource}
                  onChange={(e) => setResource(e.target.value)}
                  className="mt-1 w-full rounded-[10px] border border-[var(--border-default)] bg-[var(--elevated)] px-3 py-2 text-xs"
                >
                  <option value="Conference Room A">Conference Room A</option>
                  <option value="Conference Room B">Conference Room B</option>
                  <option value="Projector Kit">Projector Kit — Portable</option>
                  <option value="Video Production Kit">Video Production Kit</option>
                </select>
              </div>

              <div>
                <Label htmlFor="bkgLocation">Location</Label>
                <Input 
                  id="bkgLocation" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  required 
                />
              </div>

              <div>
                <Label htmlFor="bkgBookedBy">Booked By</Label>
                <Input 
                  id="bkgBookedBy" 
                  placeholder="Alicia Chen" 
                  value={bookedBy} 
                  onChange={(e) => setBookedBy(e.target.value)}
                  required 
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="bkgDate">Date</Label>
                  <select 
                    id="bkgDate"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="mt-1 w-full rounded-[10px] border border-[var(--border-default)] bg-[var(--elevated)] px-3 py-2 text-xs"
                  >
                    <option value="2025-07-14">July 14</option>
                    <option value="2025-07-15">July 15</option>
                    <option value="2025-07-16">July 16</option>
                    <option value="2025-07-17">July 17</option>
                    <option value="2025-07-18">July 18</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="bkgStart">Start Time</Label>
                  <select 
                    id="bkgStart"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-1 w-full rounded-[10px] border border-[var(--border-default)] bg-[var(--elevated)] px-3 py-2 text-xs"
                  >
                    {HOURS.map(h => {
                      const t = `${String(h).padStart(2, '0')}:00`;
                      return <option key={t} value={t}>{t}</option>;
                    })}
                  </select>
                </div>

                <div>
                  <Label htmlFor="bkgEnd">End Time</Label>
                  <select 
                    id="bkgEnd"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="mt-1 w-full rounded-[10px] border border-[var(--border-default)] bg-[var(--elevated)] px-3 py-2 text-xs"
                  >
                    {HOURS.map(h => {
                      const t = `${String(h).padStart(2, '0')}:00`;
                      return <option key={t} value={t}>{t}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Confirm Booking
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
