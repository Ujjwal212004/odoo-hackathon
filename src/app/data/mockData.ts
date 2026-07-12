// ========================================================================
// AssetFlow — Centralized Mock Data
// Realistic enterprise data for all views
// ========================================================================

// ── Types ──────────────────────────────────────────────────────────────

export type AssetStatus = 'Available' | 'Allocated' | 'Under Maintenance' | 'Booked' | 'Retired' | 'In Transit';
export type MaintenanceStatus = 'Pending' | 'Approved' | 'Assigned' | 'In Progress' | 'Resolved';
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TransferStatus = 'Pending Approval' | 'Approved' | 'In Transit' | 'Completed' | 'Rejected';
export type AuditStatus = 'Verified' | 'Missing' | 'Discrepancy' | 'Pending';
export type NotificationType = 'approval' | 'maintenance' | 'transfer' | 'system' | 'audit';

export interface Asset {
  id: string;
  tag: string;
  name: string;
  category: string;
  status: AssetStatus;
  owner: string;
  department: string;
  location: string;
  purchaseDate: string;
  value: number;
  healthScore: number;
  lastUpdated: string;
  serialNumber: string;
}

export interface Allocation {
  id: string;
  assetTag: string;
  assetName: string;
  allocatedTo: string;
  department: string;
  date: string;
  status: 'Active' | 'Returned' | 'Pending';
  approvedBy: string;
}

export interface Transfer {
  id: string;
  assetTag: string;
  assetName: string;
  fromDepartment: string;
  toDepartment: string;
  requestedBy: string;
  date: string;
  status: TransferStatus;
  reason: string;
}

export interface Booking {
  id: string;
  resource: string;
  bookedBy: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  location: string;
}

export interface MaintenanceTask {
  id: string;
  assetTag: string;
  assetName: string;
  title: string;
  priority: Priority;
  status: MaintenanceStatus;
  assignee: string;
  reportedBy: string;
  createdDate: string;
  description: string;
}

export interface AuditItem {
  id: string;
  assetTag: string;
  assetName: string;
  location: string;
  status: AuditStatus;
  verifiedBy: string;
  verifiedDate: string;
  notes: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

export interface ActivityItem {
  id: string;
  type: 'allocation' | 'transfer' | 'maintenance' | 'audit' | 'booking' | 'system';
  title: string;
  description: string;
  time: string;
  user: string;
}

export interface Role {
  id: string;
  name: string;
  users: number;
  permissions: string;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  status: 'Connected' | 'Disconnected';
  lastSync: string;
}

// ── KPI Data ───────────────────────────────────────────────────────────

export const kpiData = {
  totalAssets: 2_146,
  allocated: 1_284,
  available: 648,
  underMaintenance: 89,
  pendingTransfers: 14,
  pendingApprovals: 7,
  utilizationRate: 82,
  maintenanceOverdue: 3,
};

// ── Assets ─────────────────────────────────────────────────────────────

export const assets: Asset[] = [
  { id: '1', tag: 'AST-1042', name: 'MacBook Pro 16"', category: 'Laptop', status: 'Allocated', owner: 'Mina Chen', department: 'Engineering', location: 'HQ East — Floor 4', purchaseDate: '2024-03-15', value: 3499, healthScore: 94, lastUpdated: '2025-07-10', serialNumber: 'C02G41XXMD6T' },
  { id: '2', tag: 'AST-1043', name: 'MacBook Pro 14"', category: 'Laptop', status: 'Allocated', owner: 'James Park', department: 'Design', location: 'HQ East — Floor 3', purchaseDate: '2024-05-20', value: 2499, healthScore: 97, lastUpdated: '2025-07-08', serialNumber: 'C02H52YYMD7T' },
  { id: '3', tag: 'AST-1168', name: 'Dell UltraSharp 27" Monitor', category: 'Display', status: 'Available', owner: '—', department: 'IT', location: 'Storage B — Rack 12', purchaseDate: '2024-01-10', value: 649, healthScore: 100, lastUpdated: '2025-07-11', serialNumber: 'DL27U-4819X' },
  { id: '4', tag: 'AST-1201', name: 'Cisco Conference Room Kit Pro', category: 'Equipment', status: 'Booked', owner: 'Nora Singh', department: 'Facilities', location: 'North Wing — Room 301', purchaseDate: '2023-11-08', value: 12400, healthScore: 88, lastUpdated: '2025-07-09', serialNumber: 'CSC-CRK-7742' },
  { id: '5', tag: 'AST-1245', name: 'Herman Miller Aeron Chair', category: 'Furniture', status: 'Allocated', owner: 'David Liu', department: 'Operations', location: 'HQ West — Floor 2', purchaseDate: '2024-06-01', value: 1395, healthScore: 96, lastUpdated: '2025-07-07', serialNumber: 'HM-AER-99021' },
  { id: '6', tag: 'AST-1302', name: 'HP LaserJet Pro MFP', category: 'Printer', status: 'Under Maintenance', owner: '—', department: 'Administration', location: 'HQ East — Floor 1', purchaseDate: '2023-09-14', value: 899, healthScore: 62, lastUpdated: '2025-07-11', serialNumber: 'HP-LJP-33109' },
  { id: '7', tag: 'AST-1315', name: 'ThinkPad X1 Carbon Gen 11', category: 'Laptop', status: 'Allocated', owner: 'Sarah Williams', department: 'Finance', location: 'HQ East — Floor 5', purchaseDate: '2024-02-28', value: 2149, healthScore: 91, lastUpdated: '2025-07-06', serialNumber: 'TP-X1C-88234' },
  { id: '8', tag: 'AST-1350', name: 'iPad Pro 12.9"', category: 'Tablet', status: 'Available', owner: '—', department: 'IT', location: 'Storage A — Shelf 3', purchaseDate: '2024-04-10', value: 1299, healthScore: 100, lastUpdated: '2025-07-10', serialNumber: 'APL-IPP-44201' },
  { id: '9', tag: 'AST-1401', name: 'Steelcase Flex Collection Table', category: 'Furniture', status: 'Allocated', owner: 'Maria Garcia', department: 'HR', location: 'HQ West — Floor 1', purchaseDate: '2024-07-22', value: 2850, healthScore: 99, lastUpdated: '2025-07-05', serialNumber: 'SC-FLX-70312' },
  { id: '10', tag: 'AST-1422', name: 'Epson WorkForce Projector', category: 'Equipment', status: 'Retired', owner: '—', department: 'Facilities', location: 'Storage C', purchaseDate: '2021-06-15', value: 1200, healthScore: 30, lastUpdated: '2025-06-30', serialNumber: 'EPS-WFP-12093' },
  { id: '11', tag: 'AST-1456', name: 'Dell Latitude 7440', category: 'Laptop', status: 'In Transit', owner: 'Alex Turner', department: 'Sales', location: 'In Transit → HQ East', purchaseDate: '2024-08-05', value: 1849, healthScore: 95, lastUpdated: '2025-07-11', serialNumber: 'DL-LAT-55821' },
  { id: '12', tag: 'AST-1478', name: 'Jabra PanaCast 50 Video Bar', category: 'Equipment', status: 'Allocated', owner: 'Rachel Kim', department: 'Engineering', location: 'HQ East — Floor 4, Room 410', purchaseDate: '2024-09-12', value: 2699, healthScore: 98, lastUpdated: '2025-07-09', serialNumber: 'JBR-PC50-81104' },
];

// ── Allocations ────────────────────────────────────────────────────────

export const allocations: Allocation[] = [
  { id: 'ALC-001', assetTag: 'AST-1042', assetName: 'MacBook Pro 16"', allocatedTo: 'Mina Chen', department: 'Engineering', date: '2025-07-10', status: 'Active', approvedBy: 'Tom Richards' },
  { id: 'ALC-002', assetTag: 'AST-1043', assetName: 'MacBook Pro 14"', allocatedTo: 'James Park', department: 'Design', date: '2025-07-08', status: 'Active', approvedBy: 'Tom Richards' },
  { id: 'ALC-003', assetTag: 'AST-1245', assetName: 'Herman Miller Aeron Chair', allocatedTo: 'David Liu', department: 'Operations', date: '2025-07-07', status: 'Active', approvedBy: 'Linda Patel' },
  { id: 'ALC-004', assetTag: 'AST-1315', assetName: 'ThinkPad X1 Carbon', allocatedTo: 'Sarah Williams', department: 'Finance', date: '2025-07-06', status: 'Active', approvedBy: 'Tom Richards' },
  { id: 'ALC-005', assetTag: 'AST-1456', assetName: 'Dell Latitude 7440', allocatedTo: 'Alex Turner', department: 'Sales', date: '2025-07-05', status: 'Pending', approvedBy: '—' },
  { id: 'ALC-006', assetTag: 'AST-1168', assetName: 'Dell UltraSharp 27"', allocatedTo: 'Raj Mehta', department: 'Engineering', date: '2025-06-28', status: 'Returned', approvedBy: 'Tom Richards' },
];

// ── Transfers ──────────────────────────────────────────────────────────

export const transfers: Transfer[] = [
  { id: 'TRF-001', assetTag: 'AST-1456', assetName: 'Dell Latitude 7440', fromDepartment: 'IT', toDepartment: 'Sales', requestedBy: 'Alex Turner', date: '2025-07-11', status: 'In Transit', reason: 'New hire equipment provisioning' },
  { id: 'TRF-002', assetTag: 'AST-1350', assetName: 'iPad Pro 12.9"', fromDepartment: 'IT', toDepartment: 'Marketing', requestedBy: 'Emily Stone', date: '2025-07-10', status: 'Pending Approval', reason: 'Field demo equipment request' },
  { id: 'TRF-003', assetTag: 'AST-1302', assetName: 'HP LaserJet Pro MFP', fromDepartment: 'Administration', toDepartment: 'Finance', requestedBy: 'Robert King', date: '2025-07-09', status: 'Approved', reason: 'Departmental consolidation' },
  { id: 'TRF-004', assetTag: 'AST-1245', assetName: 'Aeron Chair', fromDepartment: 'Engineering', toDepartment: 'Operations', requestedBy: 'David Liu', date: '2025-06-30', status: 'Completed', reason: 'Office relocation' },
  { id: 'TRF-005', assetTag: 'AST-1422', assetName: 'Epson Projector', fromDepartment: 'Facilities', toDepartment: 'IT', requestedBy: 'Tom Richards', date: '2025-06-25', status: 'Rejected', reason: 'Equipment assessment before retirement' },
];

// ── Bookings ───────────────────────────────────────────────────────────

export const bookings: Booking[] = [
  { id: 'BKG-001', resource: 'Conference Room A — North Wing', bookedBy: 'Mina Chen', date: '2025-07-14', startTime: '09:00', endTime: '10:30', status: 'Confirmed', location: 'North Wing — Floor 3' },
  { id: 'BKG-002', resource: 'Projector Kit — Portable', bookedBy: 'Emily Stone', date: '2025-07-14', startTime: '14:00', endTime: '16:00', status: 'Confirmed', location: 'South Wing — Floor 1' },
  { id: 'BKG-003', resource: 'Conference Room B — HQ East', bookedBy: 'James Park', date: '2025-07-15', startTime: '10:00', endTime: '11:00', status: 'Pending', location: 'HQ East — Floor 4' },
  { id: 'BKG-004', resource: 'Video Production Kit', bookedBy: 'Rachel Kim', date: '2025-07-15', startTime: '13:00', endTime: '17:00', status: 'Confirmed', location: 'HQ East — Floor 2' },
  { id: 'BKG-005', resource: 'Conference Room A — North Wing', bookedBy: 'Sarah Williams', date: '2025-07-16', startTime: '09:00', endTime: '10:00', status: 'Confirmed', location: 'North Wing — Floor 3' },
  { id: 'BKG-006', resource: 'Testing Lab — HQ West', bookedBy: 'David Liu', date: '2025-07-16', startTime: '08:00', endTime: '12:00', status: 'Cancelled', location: 'HQ West — Floor 1' },
];

// ── Maintenance Tasks ──────────────────────────────────────────────────

export const maintenanceTasks: MaintenanceTask[] = [
  { id: 'MNT-001', assetTag: 'AST-1302', assetName: 'HP LaserJet Pro MFP', title: 'Paper jam — recurring issue', priority: 'High', status: 'Assigned', assignee: 'Kevin Moore', reportedBy: 'Sarah Williams', createdDate: '2025-07-10', description: 'Recurring paper jam in tray 2. Previous fix did not resolve.' },
  { id: 'MNT-002', assetTag: 'AST-1201', assetName: 'Cisco Conference Kit', title: 'Audio feedback during calls', priority: 'Medium', status: 'In Progress', assignee: 'Kevin Moore', reportedBy: 'Nora Singh', createdDate: '2025-07-09', description: 'Participants report echo and feedback during video calls.' },
  { id: 'MNT-003', assetTag: 'AST-1042', assetName: 'MacBook Pro 16"', title: 'Battery replacement needed', priority: 'Medium', status: 'Pending', assignee: '—', reportedBy: 'Mina Chen', createdDate: '2025-07-11', description: 'Battery health at 72%. Recommend replacement before further degradation.' },
  { id: 'MNT-004', assetTag: 'AST-1245', assetName: 'Aeron Chair', title: 'Armrest adjustment broken', priority: 'Low', status: 'Approved', assignee: 'Lisa Tran', reportedBy: 'David Liu', createdDate: '2025-07-08', description: 'Left armrest no longer locks in position.' },
  { id: 'MNT-005', assetTag: 'AST-1478', assetName: 'Jabra PanaCast 50', title: 'Firmware update required', priority: 'Low', status: 'Resolved', assignee: 'Kevin Moore', reportedBy: 'Rachel Kim', createdDate: '2025-07-05', description: 'Firmware v3.2 available. Resolves camera framing issues.' },
  { id: 'MNT-006', assetTag: 'AST-1168', assetName: 'Dell UltraSharp 27"', title: 'Dead pixel cluster', priority: 'High', status: 'Pending', assignee: '—', reportedBy: 'Raj Mehta', createdDate: '2025-07-11', description: 'Cluster of 3 dead pixels in upper-left quadrant. Under warranty.' },
  { id: 'MNT-007', assetTag: 'AST-1315', assetName: 'ThinkPad X1 Carbon', title: 'Keyboard replacement', priority: 'Critical', status: 'In Progress', assignee: 'Lisa Tran', reportedBy: 'Sarah Williams', createdDate: '2025-07-07', description: 'Multiple keys unresponsive. User cannot work effectively.' },
];

// ── Audit Items ────────────────────────────────────────────────────────

export const auditItems: AuditItem[] = [
  { id: 'AUD-001', assetTag: 'AST-1042', assetName: 'MacBook Pro 16"', location: 'HQ East — Floor 4', status: 'Verified', verifiedBy: 'Tom Richards', verifiedDate: '2025-07-10', notes: 'Asset confirmed with owner.' },
  { id: 'AUD-002', assetTag: 'AST-1043', assetName: 'MacBook Pro 14"', location: 'HQ East — Floor 3', status: 'Verified', verifiedBy: 'Tom Richards', verifiedDate: '2025-07-10', notes: '' },
  { id: 'AUD-003', assetTag: 'AST-1168', assetName: 'Dell UltraSharp 27"', location: 'Storage B — Rack 12', status: 'Verified', verifiedBy: 'Linda Patel', verifiedDate: '2025-07-11', notes: 'In storage. Good condition.' },
  { id: 'AUD-004', assetTag: 'AST-1201', assetName: 'Cisco Conference Kit', location: 'North Wing — Room 301', status: 'Discrepancy', verifiedBy: 'Linda Patel', verifiedDate: '2025-07-11', notes: 'Serial number does not match records. Needs investigation.' },
  { id: 'AUD-005', assetTag: 'AST-1422', assetName: 'Epson Projector', location: 'Storage C', status: 'Missing', verifiedBy: '—', verifiedDate: '—', notes: 'Asset not found at recorded location.' },
  { id: 'AUD-006', assetTag: 'AST-1245', assetName: 'Aeron Chair', location: 'HQ West — Floor 2', status: 'Verified', verifiedBy: 'Tom Richards', verifiedDate: '2025-07-09', notes: '' },
  { id: 'AUD-007', assetTag: 'AST-1302', assetName: 'HP LaserJet Pro MFP', location: 'HQ East — Floor 1', status: 'Pending', verifiedBy: '—', verifiedDate: '—', notes: 'Scheduled for verification.' },
  { id: 'AUD-008', assetTag: 'AST-1350', assetName: 'iPad Pro 12.9"', location: 'Storage A — Shelf 3', status: 'Verified', verifiedBy: 'Linda Patel', verifiedDate: '2025-07-11', notes: '' },
];

// ── Notifications ──────────────────────────────────────────────────────

export const notifications: Notification[] = [
  { id: 'NTF-001', type: 'approval', title: 'Transfer request pending', message: 'Alex Turner requested transfer of Dell Latitude 7440 to Sales department.', time: '2 hours ago', read: false },
  { id: 'NTF-002', type: 'maintenance', title: 'Critical maintenance escalation', message: 'ThinkPad X1 Carbon (AST-1315) keyboard replacement has been escalated to critical priority.', time: '3 hours ago', read: false },
  { id: 'NTF-003', type: 'audit', title: 'Audit discrepancy detected', message: 'Serial number mismatch found for Cisco Conference Kit (AST-1201) during North Wing audit.', time: '5 hours ago', read: false },
  { id: 'NTF-004', type: 'transfer', title: 'Transfer completed', message: 'Aeron Chair successfully transferred from Engineering to Operations.', time: '1 day ago', read: true },
  { id: 'NTF-005', type: 'system', title: 'Monthly report available', message: 'June 2025 asset utilization and health reports are ready for review.', time: '2 days ago', read: true },
  { id: 'NTF-006', type: 'approval', title: 'Booking approved', message: 'Conference Room A booking for July 14, 09:00–10:30 has been confirmed.', time: '2 days ago', read: true },
  { id: 'NTF-007', type: 'maintenance', title: 'Maintenance resolved', message: 'Jabra PanaCast 50 firmware update completed successfully.', time: '3 days ago', read: true },
  { id: 'NTF-008', type: 'system', title: 'Asset lifecycle alert', message: 'Epson Projector (AST-1422) has been flagged for retirement. 4+ years old with health score 30%.', time: '5 days ago', read: true },
];

// ── Recent Activity ────────────────────────────────────────────────────

export const recentActivity: ActivityItem[] = [
  { id: 'ACT-001', type: 'allocation', title: 'MacBook Pro 16" allocated', description: 'Assigned to Mina Chen, Engineering', time: '2 hours ago', user: 'Tom Richards' },
  { id: 'ACT-002', type: 'transfer', title: 'Dell Latitude 7440 in transit', description: 'IT → Sales department transfer initiated', time: '3 hours ago', user: 'Alex Turner' },
  { id: 'ACT-003', type: 'maintenance', title: 'Keyboard replacement started', description: 'ThinkPad X1 Carbon — assigned to Lisa Tran', time: '5 hours ago', user: 'Kevin Moore' },
  { id: 'ACT-004', type: 'audit', title: 'North Wing audit in progress', description: '6 of 12 assets verified, 1 discrepancy found', time: '6 hours ago', user: 'Linda Patel' },
  { id: 'ACT-005', type: 'booking', title: 'Conference Room A booked', description: 'July 14, 09:00–10:30 — Mina Chen', time: '1 day ago', user: 'Mina Chen' },
  { id: 'ACT-006', type: 'maintenance', title: 'Jabra PanaCast firmware updated', description: 'Resolved — firmware v3.2 installed', time: '2 days ago', user: 'Kevin Moore' },
];

// ── Chart Data ─────────────────────────────────────────────────────────

export const utilizationByCategory = [
  { category: 'Laptops', utilized: 92, total: 340 },
  { category: 'Displays', utilized: 78, total: 280 },
  { category: 'Equipment', utilized: 85, total: 196 },
  { category: 'Furniture', utilized: 96, total: 520 },
  { category: 'Tablets', utilized: 64, total: 120 },
  { category: 'Printers', utilized: 71, total: 90 },
];

export const assetHealthDistribution = [
  { name: 'Excellent', value: 1420, color: '#295943' },
  { name: 'Good', value: 480, color: '#355C7D' },
  { name: 'Fair', value: 168, color: '#A66B00' },
  { name: 'Critical', value: 78, color: '#7D1F2B' },
];

export const monthlyMaintenanceData = [
  { month: 'Jan', tickets: 12 },
  { month: 'Feb', tickets: 18 },
  { month: 'Mar', tickets: 14 },
  { month: 'Apr', tickets: 22 },
  { month: 'May', tickets: 16 },
  { month: 'Jun', tickets: 20 },
  { month: 'Jul', tickets: 11 },
];

export const assetsByLifecycleStage = [
  { stage: 'Active', count: 1784 },
  { stage: 'Under Maintenance', count: 89 },
  { stage: 'In Storage', count: 148 },
  { stage: 'In Transit', count: 14 },
  { stage: 'Retired', count: 111 },
];

// ── Pending Approvals ──────────────────────────────────────────────────

export const pendingApprovals = [
  { id: 'APR-001', type: 'Transfer', title: 'iPad Pro 12.9" → Marketing', requestedBy: 'Emily Stone', date: '2025-07-10' },
  { id: 'APR-002', type: 'Allocation', title: 'Dell Latitude 7440 → Alex Turner', requestedBy: 'Alex Turner', date: '2025-07-11' },
  { id: 'APR-003', type: 'Maintenance', title: 'MacBook Pro 16" battery replacement', requestedBy: 'Mina Chen', date: '2025-07-11' },
  { id: 'APR-004', type: 'Booking', title: 'Testing Lab — July 18, full day', requestedBy: 'David Liu', date: '2025-07-12' },
];

// ── Settings Data ──────────────────────────────────────────────────────

export const roles: Role[] = [
  { id: '1', name: 'Administrator', users: 3, permissions: 'Full access to all modules' },
  { id: '2', name: 'Asset Manager', users: 8, permissions: 'Assets, Allocations, Transfers, Maintenance' },
  { id: '3', name: 'Facility Manager', users: 4, permissions: 'Bookings, Maintenance, Audit' },
  { id: '4', name: 'Department Head', users: 12, permissions: 'View assets, Approve transfers, View reports' },
  { id: '5', name: 'Employee', users: 186, permissions: 'View assigned assets, Submit requests' },
];

export const integrations: Integration[] = [
  { id: '1', name: 'Microsoft Azure AD', category: 'Identity', status: 'Connected', lastSync: '2 hours ago' },
  { id: '2', name: 'ServiceNow', category: 'ITSM', status: 'Connected', lastSync: '1 hour ago' },
  { id: '3', name: 'SAP', category: 'ERP', status: 'Connected', lastSync: '30 min ago' },
  { id: '4', name: 'Slack', category: 'Communication', status: 'Disconnected', lastSync: '—' },
  { id: '5', name: 'Jira', category: 'Project Management', status: 'Connected', lastSync: '4 hours ago' },
];

// ── Timeline Events (for Asset Detail) ─────────────────────────────────

export const assetTimeline = [
  { date: '2025-07-10', event: 'Allocated to Mina Chen', type: 'allocation' as const, detail: 'Approved by Tom Richards' },
  { date: '2025-06-15', event: 'Returned from maintenance', type: 'maintenance' as const, detail: 'Battery health assessment completed' },
  { date: '2025-06-10', event: 'Sent for maintenance', type: 'maintenance' as const, detail: 'Battery diagnostics requested' },
  { date: '2025-05-01', event: 'Transferred from Design to Engineering', type: 'transfer' as const, detail: 'Approved by Linda Patel' },
  { date: '2025-03-15', event: 'Audit verified', type: 'audit' as const, detail: 'Q1 2025 audit — confirmed at HQ East Floor 4' },
  { date: '2024-12-01', event: 'Allocated to James Park', type: 'allocation' as const, detail: 'Initial assignment' },
  { date: '2024-03-15', event: 'Registered in AssetFlow', type: 'system' as const, detail: 'Purchased from Apple Business — PO #2024-0392' },
];

// ── Navigation Items ───────────────────────────────────────────────────

export const navigationGroups = [
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
