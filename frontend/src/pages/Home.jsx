import { Link } from 'react-router-dom';
import { Users, Building2, CalendarCheck, ShieldCheck, BarChart3, ArrowRight } from 'lucide-react';
import FloatingIcons from '../components/FloatingIcons';

const features = [
  { icon: Users, title: 'Employee Management', desc: 'Add, search, and organize your workforce with ease.' },
  { icon: Building2, title: 'Departments', desc: 'Structure your company into clear, trackable teams.' },
  { icon: CalendarCheck, title: 'Attendance Tracking', desc: 'Real-time check-in/check-out with working hours.' },
  { icon: ShieldCheck, title: 'Role-Based Access', desc: 'Admin, HR, and Employee permissions, enforced end-to-end.' },
];

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      <FloatingIcons />

      {/* Glow orbs for atmosphere */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-glow" />

      <div className="relative z-10">
        {/* Nav */}
        <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
              EMS
            </div>
            <span className="text-white text-lg font-semibold tracking-tight">EmpTrack</span>
          </div>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-slate-200 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/30"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center px-6 pt-20 pb-24">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <BarChart3 size={14} />
            Modern HR, simplified
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Manage your workforce
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              with confidence
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
            Employees, departments, attendance, and leave — all in one secure,
            role-based system built for real teams.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 font-medium"
            >
              Create Account <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <Icon size={20} className="text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;