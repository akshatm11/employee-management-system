import { Users, Building2, CalendarCheck, BarChart3, ShieldCheck, Database, Clock, Zap } from 'lucide-react';

const icons = [
  { Icon: Users, top: '10%', left: '8%', size: 32, delay: '0s', anim: 'animate-float' },
  { Icon: Building2, top: '70%', left: '5%', size: 40, delay: '1s', anim: 'animate-float-slow' },
  { Icon: CalendarCheck, top: '20%', left: '85%', size: 36, delay: '0.5s', anim: 'animate-float-slow' },
  { Icon: BarChart3, top: '75%', left: '88%', size: 44, delay: '1.5s', anim: 'animate-float' },
  { Icon: ShieldCheck, top: '45%', left: '92%', size: 28, delay: '2s', anim: 'animate-float-slow' },
  { Icon: Database, top: '85%', left: '45%', size: 30, delay: '0.8s', anim: 'animate-float' },
  { Icon: Clock, top: '15%', left: '45%', size: 26, delay: '1.2s', anim: 'animate-float-slow' },
  { Icon: Zap, top: '50%', left: '3%', size: 24, delay: '0.3s', anim: 'animate-float' },
];

function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, top, left, size, delay, anim }, i) => (
        <div
          key={i}
          className={`absolute text-blue-400/20 ${anim}`}
          style={{ top, left, animationDelay: delay }}
        >
          <Icon size={size} />
        </div>
      ))}
    </div>
  );
}

export default FloatingIcons;