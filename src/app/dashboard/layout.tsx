import { ReactNode } from 'react';
import Link from 'next/link';
import { Home, Inbox, Users, Package, HelpCircle, Settings,Zap } from 'lucide-react';
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col shadow-2xl z-10">
        <div className="p-6 flex items-center space-x-2">
          <Zap size={22} className="text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              AutoSales
            </h1>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">WhatsApp Engine</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto">
          <NavItem href="/dashboard" icon={<Home size={18} />} label="Overview" />
          <NavItem href="/dashboard/inbox" icon={<Inbox size={18} />} label="Inbox" />
          <NavItem href="/dashboard/leads" icon={<Users size={18} />} label="Leads" />
          <NavItem href="/dashboard/products" icon={<Package size={18} />} label="Products" />
          <NavItem href="/dashboard/faq" icon={<HelpCircle size={18} />} label="FAQ Rules" />
        </nav>

        <div className="p-4 border-t border-neutral-800 bg-neutral-900">
          <NavItem href="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950">
        <header className="h-16 border-b border-neutral-800/50 flex items-center justify-between px-8 bg-neutral-950/40 backdrop-blur-md z-10">
          <h2 className="text-sm font-medium text-neutral-300 tracking-wide uppercase">Dashboard</h2>
          <div className="flex items-center space-x-4">
             <UserButton />
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 relative z-0">
          {children}
        </div>
      </main>
    </div>
  );
}


function NavItem({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <Link href={href} className="group flex items-center space-x-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-all duration-200">
      <div className="group-hover:text-emerald-400 transition-colors duration-200">
        {icon}
      </div>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}
