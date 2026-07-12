import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, BadgeCheck, BarChart3, Bell, Boxes, Building2, CalendarDays, CheckCircle2, Circle, ClipboardList, FileText, LayoutGrid, MapPin, PackageCheck, ScanLine, Search, Settings, ShieldCheck, Sparkles, Users, Workflow, Wrench } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";

const problems = [
  {
    title: "Spreadsheet chaos",
    description: "Critical assets live in a chain of files, inboxes, and shared folders.",
  },
  {
    title: "Disconnected tools",
    description: "Procurement, maintenance, HR, and facilities each work from a different system.",
  },
  {
    title: "Lost accountability",
    description: "Ownership changes are slow, manual, and easy to miss at scale.",
  },
];

const lifecycle = [
  "Register",
  "Allocate",
  "Maintain",
  "Audit",
  "Analyze",
  "Retire",
];

const modules = [
  {
    title: "Assets",
    description: "Catalog every physical, digital, and shared resource from one trusted directory.",
    icon: Boxes,
  },
  {
    title: "Resource Booking",
    description: "Coordinate rooms, equipment, and shared services with a calm, reliable calendar.",
    icon: CalendarDays,
  },
  {
    title: "Maintenance",
    description: "Turn service requests into clear operational workflows with ownership and timing.",
    icon: Wrench,
  },
  {
    title: "Reports",
    description: "Surface utilization, health, and lifecycle trends without exporting from multiple systems.",
    icon: BarChart3,
  },
  {
    title: "Audit",
    description: "Verify inventory, resolve discrepancies, and generate evidence-backed reports quickly.",
    icon: ShieldCheck,
  },
  {
    title: "Allocation",
    description: "Move assets across departments, teams, and locations with approval history preserved.",
    icon: Workflow,
  },
];

const features = [
  "Smart Search",
  "Asset Timeline",
  "QR Tracking",
  "Transfer Workflow",
  "Maintenance",
  "Audit",
  "Analytics",
  "Notifications",
];

const activity = [
  { time: "08:30", title: "Laptop request submitted", detail: "Operations requests a workstation refresh." },
  { time: "08:31", title: "Manager approval received", detail: "Approval flows instantly to procurement." },
  { time: "08:32", title: "Asset allocated", detail: "Device assigned to the correct department." },
  { time: "02:15", title: "Maintenance reported", detail: "A monitor issue is logged and triaged." },
  { time: "02:20", title: "Technician assigned", detail: "Priority queue updates without manual chasing." },
  { time: "End of Month", title: "Audit generated", detail: "Inventory variance and exceptions are ready for review." },
];

const metrics = [
  { label: "Available Assets", value: "1,284" },
  { label: "Allocated Assets", value: "862" },
  { label: "Resources", value: "96" },
  { label: "Pending Transfers", value: "14" },
];

const assetRows = [
  { tag: "AST-1042", name: "MacBook Pro 16", category: "Laptop", status: "Allocated", owner: "Mina Chen", location: "HQ East", department: "Operations" },
  { tag: "AST-1168", name: "Dell Monitor 27", category: "Display", status: "Available", owner: "—", location: "Storage B", department: "IT" },
  { tag: "AST-1201", name: "Conference Room Kit", category: "Equipment", status: "Booked", owner: "Nora Singh", location: "North Wing", department: "Facilities" },
];

function PreviewShell() {
  return (
    <div className="rounded-[24px] border border-[#DDD8CF] bg-white p-4 shadow-[0_16px_40px_rgba(23,42,69,0.06)]">
      <div className="flex gap-4">
        <aside className="hidden w-44 shrink-0 rounded-[16px] border border-[#DDD8CF] bg-[#F3F1EB] p-3 lg:flex lg:flex-col lg:gap-2">
          {([
            [LayoutGrid, "Overview"],
            [Building2, "Organization"],
            [Boxes, "Assets"],
            [CalendarDays, "Bookings"],
            [FileText, "Reports"],
            [Settings, "Settings"],
          ] as [React.ComponentType<{ className?: string }>, string][]).map(([Icon, label]) => (
            <div key={label} className="flex items-center gap-2 rounded-[10px] px-2 py-2 text-sm text-[#5E6673]">
              <Icon className="size-4" />
              <span>{label}</span>
            </div>
          ))}
        </aside>
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between rounded-[16px] border border-[#DDD8CF] bg-[#FCFBF8] px-3 py-3">
            <div className="flex items-center gap-2 text-sm text-[#5E6673]">
              <Search className="size-4" />
              <span>Search assets</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-[#DDD8CF] p-2 text-[#172A45]">
                <Bell className="size-4" />
              </button>
              <div className="flex items-center gap-2 rounded-full border border-[#DDD8CF] bg-white px-2 py-1.5">
                <div className="flex size-8 items-center justify-center rounded-full bg-[#172A45] text-sm font-medium text-[#FCFBF8]">AC</div>
                <div className="text-left text-sm">
                  <div className="font-medium text-[#1A1A1A]">Alicia Chen</div>
                  <div className="text-[#5E6673]">Operations</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-[16px] border border-[#DDD8CF] bg-[#F6F4EF] p-4">
                <div className="text-sm text-[#5E6673]">{metric.label}</div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#172A45]">{metric.value}</div>
              </div>
            ))}
          </div>
          <div className="rounded-[16px] border border-[#DDD8CF] bg-[#FCFBF8] p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <div>
                <div className="text-sm font-medium text-[#1A1A1A]">Asset Directory</div>
                <div className="text-sm text-[#5E6673]">Live inventory and assigned ownership</div>
              </div>
              <Button size="sm" variant="secondary">View all</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assetRows.map((row) => (
                  <TableRow key={row.tag}>
                    <TableCell className="font-medium text-[#172A45]">{row.tag}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      <span className="rounded-full border border-[#DDD8CF] px-2 py-1 text-xs text-[#295943]">{row.status}</span>
                    </TableCell>
                    <TableCell>{row.owner}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#1A1A1A]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full border border-[#DDD8CF] bg-[#FFFFFF] text-sm font-semibold tracking-[0.24em] text-[#172A45]">AF</div>
          <div>
            <div className="text-[0.95rem] font-semibold tracking-[0.24em] text-[#172A45] uppercase">AssetFlow</div>
            <div className="text-sm text-[#5E6673]">Enterprise Asset & Resource Management</div>
          </div>
        </div>
        <nav className="hidden items-center gap-7 text-sm text-[#5E6673] md:flex">
          <a className="transition hover:text-[#172A45]" href="#platform">Platform</a>
          <a className="transition hover:text-[#172A45]" href="#modules">Modules</a>
          <a className="transition hover:text-[#172A45]" href="#design-system">Design System</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/dashboard">
            <Button variant="secondary" className="hover:bg-[var(--accent-brass)] hover:text-white hover:border-[var(--accent-brass)] transition-colors duration-200">Explore Platform</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-24 px-6 pb-24 lg:px-10">
        <section className="grid items-center gap-12 rounded-[32px] border border-[#DDD8CF] bg-[#F6F4EF] p-8 lg:grid-cols-[1.02fr_0.98fr] lg:p-12">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-6 border-[#DDD8CF] bg-white/70 px-3 py-1 text-[0.75rem] uppercase tracking-[0.24em] text-[#355C7D]">
              Enterprise Asset & Resource Management Platform
            </Badge>
            <h1 className="text-5xl font-semibold leading-[0.95] tracking-[-0.03em] text-[#172A45] sm:text-6xl lg:text-7xl">
              Operational clarity for every asset your organization owns.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#5E6673]">
              AssetFlow helps organizations track, allocate, maintain, audit, and analyze their assets through one calm, dependable platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/dashboard">
                <Button size="lg" variant="secondary" className="hover:bg-[var(--accent-brass)] hover:text-white hover:border-[var(--accent-brass)] transition-colors duration-200">Explore Platform</Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-[#5E6673]">
              <div className="flex items-center gap-2"><BadgeCheck className="size-4 text-[#295943]" />Procurement to retirement</div>
              <div className="flex items-center gap-2"><BadgeCheck className="size-4 text-[#295943]" />One source of truth</div>
              <div className="flex items-center gap-2"><BadgeCheck className="size-4 text-[#295943]" />Built for enterprise teams</div>
            </div>
          </div>
          <div>
            <PreviewShell />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#355C7D]">The Problem</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-[#172A45] sm:text-4xl">
              Fragmented systems make a simple task feel expensive.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {problems.map((problem) => (
              <Card key={problem.title} className="border-[#DDD8CF] bg-white/80">
                <CardHeader>
                  <CardTitle className="text-lg text-[#172A45]">{problem.title}</CardTitle>
                  <CardDescription>{problem.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section id="platform" className="rounded-[32px] border border-[#DDD8CF] bg-white p-8 lg:p-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#355C7D]">Asset Lifecycle</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-[#172A45] sm:text-4xl">
                Every stage of the lifecycle is visible in one place.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-[#5E6673]">
              {lifecycle.map((step, index) => (
                <div key={step} className="flex items-center gap-2 rounded-full border border-[#DDD8CF] bg-[#FCFBF8] px-3 py-2">
                  <span className="font-medium text-[#172A45]">{step}</span>
                  {index < lifecycle.length - 1 ? <ArrowRight className="size-4" /> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="modules" className="space-y-6">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-[#355C7D]">Platform Modules</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-[#172A45] sm:text-4xl">
              A disciplined product surface built for daily operations.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Card key={module.title} className="border-[#DDD8CF] bg-white">
                  <CardHeader>
                    <div className="flex size-11 items-center justify-center rounded-[10px] border border-[#DDD8CF] bg-[#F6F4EF] text-[#172A45]">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="mt-3 text-xl text-[#172A45]">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-[#DDD8CF] bg-[#F6F4EF] p-0">
            <CardHeader className="px-8 pt-8">
              <p className="text-sm uppercase tracking-[0.24em] text-[#355C7D]">Dashboard Preview</p>
              <CardTitle className="mt-2 text-2xl text-[#172A45]">Executive dashboard with fewer distractions and more signal.</CardTitle>
              <CardDescription className="max-w-2xl">The interface keeps the most important actions and statuses in front of decision makers without visual noise.</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="rounded-[20px] border border-[#DDD8CF] bg-white p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="rounded-[14px] border border-[#DDD8CF] bg-[#FCFBF8] p-4">
                      <div className="text-sm text-[#5E6673]">{metric.label}</div>
                      <div className="mt-2 text-2xl font-semibold text-[#172A45]">{metric.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-[16px] border border-[#DDD8CF] bg-[#F6F4EF] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#172A45]">Allocation health</span>
                    <span className="text-sm text-[#5E6673]">82% active</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#DDD8CF]">
                    <div className="h-2 w-[82%] rounded-full bg-[#172A45]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#DDD8CF] bg-white">
            <CardHeader>
              <p className="text-sm uppercase tracking-[0.24em] text-[#355C7D]">Day in the Life</p>
              <CardTitle className="mt-2 text-2xl text-[#172A45]">A calm sequence from request to audit.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activity.map((item) => (
                <div key={item.title} className="rounded-[14px] border border-[#DDD8CF] bg-[#FCFBF8] p-4">
                  <div className="flex items-center gap-2 text-sm text-[#355C7D]">
                    <ClockIcon />
                    <span>{item.time}</span>
                  </div>
                  <div className="mt-2 font-medium text-[#172A45]">{item.title}</div>
                  <div className="mt-1 text-sm text-[#5E6673]">{item.detail}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="rounded-[32px] border border-[#DDD8CF] bg-[#FFFFFF] p-8 lg:p-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#355C7D]">Feature Grid</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-[#172A45] sm:text-4xl">
                Designed for full-spectrum asset operations.
              </h2>
            </div>
            <Button variant="secondary">Open Design System</Button>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div key={feature} className="rounded-[16px] border border-[#DDD8CF] bg-[#FCFBF8] p-4 text-sm font-medium text-[#172A45]">
                <div className="mb-3 flex items-center gap-2 text-[#355C7D]">
                  <CheckCircle2 className="size-4" />
                  <span>{feature}</span>
                </div>
                <div className="text-sm text-[#5E6673]">Built to feel calm, readable, and dependable at scale.</div>
              </div>
            ))}
          </div>
        </section>

        <section id="design-system" className="rounded-[32px] border border-[#DDD8CF] bg-[#F6F4EF] p-8 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#355C7D]">Full Design System</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-[#172A45] sm:text-4xl">
                Reusable components, disciplined tokens, and premium surfaces.
              </h2>
              <div className="mt-6 space-y-3 text-sm text-[#5E6673]">
                <div className="flex items-center gap-2"><Circle className="size-3 fill-[#172A45] text-[#172A45]" />Color system built around canvas, surface, primary, accent, and status.</div>
                <div className="flex items-center gap-2"><Circle className="size-3 fill-[#172A45] text-[#172A45]" />Typography scale tuned for editorial hierarchy and tabular figures.</div>
                <div className="flex items-center gap-2"><Circle className="size-3 fill-[#172A45] text-[#172A45]" />Buttons, inputs, cards, tables, badges, tabs, and sidebar patterns are all reusable.</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {[
                  ["Canvas", "#FCFBF8"],
                  ["Surface", "#F6F4EF"],
                  ["Primary", "#172A45"],
                  ["Accent", "#B08D57"],
                  ["Success", "#295943"],
                  ["Information", "#355C7D"],
                ].map(([name, color]) => (
                  <div key={name} className="min-w-[120px] rounded-[14px] border border-[#DDD8CF] bg-white p-3">
                    <div className="h-10 rounded-[10px] border border-[#DDD8CF]" style={{ backgroundColor: color }} />
                    <div className="mt-2 text-sm font-medium text-[#172A45]">{name}</div>
                    <div className="text-xs text-[#5E6673]">{color}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-[20px] border border-[#DDD8CF] bg-white p-4">
                <div className="flex flex-wrap gap-3">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="rounded-[10px] border border-[#DDD8CF] bg-[#FCFBF8] px-3 py-2 text-sm text-[#172A45]">Search & filter</div>
                  <Badge variant="outline">Approved</Badge>
                  <Badge className="bg-[#172A45] text-[#FCFBF8]">Live</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-[#DDD8CF] bg-[#172A45] p-10 text-[#FCFBF8] lg:p-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.24em] text-[#B08D57]">Final CTA</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                Ready to simplify enterprise asset management?
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard">
                <Button variant="secondary" className="border-[#B08D57] bg-[#172A45] text-[#FCFBF8] hover:bg-[var(--accent-brass)] hover:text-white hover:border-[var(--accent-brass)] transition-colors duration-200">Explore Platform</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ClockIcon() {
  return <ClockSvg />;
}

function ClockSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4 text-[#355C7D]" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}