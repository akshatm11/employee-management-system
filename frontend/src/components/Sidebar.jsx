import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, CalendarCheck, CalendarClock } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/employees', label: 'Employees', icon: Users },
  { path: '/departments', label: 'Departments', icon: Building2 },
  { path: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { path: '/leaves', label: 'Leaves', icon: CalendarClock },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-screen p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-10 px-2 pt-2">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
          EMS
        </div>
        <span className="text-lg font-semibold tracking-tight">EmpTrack</span>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 text-xs text-slate-500 border-t border-slate-700/50">
        Employee Management System
      </div>
    </aside>
  );
}

export default Sidebar;