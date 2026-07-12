import { Outlet } from 'react-router';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      <Outlet />
    </div>
  );
}
