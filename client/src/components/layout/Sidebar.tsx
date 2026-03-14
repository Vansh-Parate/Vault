import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Plus, 
  FileText, 
  User, 
  ShieldCheck
} from 'lucide-react';
import { getInitials } from '../../lib/utils';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'My Wallet', icon: Wallet, path: '/wallet' },
  { label: 'Add Credential', icon: Plus, path: '/wallet/add' },
  { label: 'Access Log', icon: FileText, path: '/access-log' },
];

const accountItems = [
  { label: 'Profile', icon: User, path: '/profile' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const userName = 'Arjun Sharma';

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-dark flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-2">
        <ShieldCheck size={22} className="text-sage" />
        <span className="font-display text-xl text-cream">Vault</span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 mt-2">
        <p className="px-3 text-[10px] font-sans font-semibold text-beige/50 uppercase tracking-wider mb-2">
          Main
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-sans transition-colors ${
                    isActive
                      ? 'bg-sage/15 text-cream border-l-[3px] border-l-sage'
                      : 'text-beige hover:bg-white/5 border-l-[3px] border-l-transparent'
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <p className="px-3 text-[10px] font-sans font-semibold text-beige/50 uppercase tracking-wider mt-6 mb-2">
          Account
        </p>
        <ul className="space-y-0.5">
          {accountItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-sans transition-colors ${
                    isActive
                      ? 'bg-sage/15 text-cream border-l-[3px] border-l-sage'
                      : 'text-beige hover:bg-white/5 border-l-[3px] border-l-transparent'
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User info */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sage flex items-center justify-center text-white text-sm font-sans font-medium shrink-0">
            {getInitials(userName)}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-cream font-sans truncate">{userName}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs text-beige/60 hover:text-cream transition-colors font-sans cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
