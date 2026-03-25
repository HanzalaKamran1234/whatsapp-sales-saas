'use client';
import { useEffect, useState } from 'react';
import { Users, MessageSquare, Zap, Target, TrendingUp, Package, HelpCircle, Bell } from "lucide-react";
import Link from 'next/link';

interface Stats {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  matchRate: number;
  faqCount: number;
  productCount: number;
  credits: { used: number; limit: number; percent: number; plan: string };
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Good morning! 👋</h1>
          <p className="text-neutral-400">Your WhatsApp Sales Engine is <span className="text-emerald-400 font-semibold">running</span>.</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
          <span className="text-emerald-400 text-sm font-medium">Bot Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Leads" value={stats?.total ?? '—'} icon={<Users className="text-blue-400" size={20} />} sub="All time captured" color="blue" />
        <StatCard title="Hot Leads" value={stats?.hot ?? '—'} icon={<Target className="text-orange-400" size={20} />} sub="Need attention" color="orange" />
        <StatCard title="Rule Match Rate" value={stats ? `${stats.matchRate}%` : '—'} icon={<Zap className="text-purple-400" size={20} />} sub="Auto-replied" color="purple" />
        <StatCard title="FAQ Rules" value={stats?.faqCount ?? '—'} icon={<HelpCircle className="text-emerald-400" size={20} />} sub={`${stats?.productCount ?? '—'} products listed`} color="emerald" />
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center space-x-2"><TrendingUp size={16} className="text-emerald-400" /><span>Recent Leads</span></h3>
            <Link href="/dashboard/leads" className="text-xs text-neutral-400 hover:text-emerald-400 transition-colors font-medium">View All →</Link>
          </div>
          <RecentLeads />
        </div>

        {/* Quick Actions */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-semibold text-white flex items-center space-x-2 mb-2"><Bell size={16} className="text-orange-400" /><span>Quick Actions</span></h3>
          <QuickBtn href="/dashboard/faq" label="+ Add FAQ Rule" color="emerald" />
          <QuickBtn href="/dashboard/products" label="+ Add Product" color="neutral" />
          <QuickBtn href="/dashboard/inbox" label="Open Inbox" color="neutral" />
          <QuickBtn href="/dashboard/leads" label="View Hot Leads 🔥" color="orange" />
        </div>
      </div>

      {/* Notification Banner */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 flex items-start space-x-4 shadow-sm">
        <Bell size={20} className="text-orange-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-orange-300 font-semibold text-sm">1 message needs manual reply</p>
          <p className="text-neutral-400 text-xs mt-0.5">A customer asked something outside your defined rules. <Link href="/dashboard/inbox" className="text-orange-400 underline underline-offset-2 hover:text-orange-300">Open Inbox →</Link></p>
        </div>
      </div>

      {/* Message Credit Usage */}
      {stats && <CreditWidget credits={stats.credits} />}
    </div>
  );
}

function RecentLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  useEffect(() => { 
    fetch('/api/leads')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) setLeads(d.slice(0, 4));
        else setLeads([]);
      })
      .catch(() => setLeads([]));
  }, []);
  const tagColor = (t: string) => t === 'hot' ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' : t === 'warm' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  return (
    <div className="divide-y divide-neutral-800/50">
      {leads.map(l => (
        <div key={l.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-neutral-800/30 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-emerald-400 border border-neutral-700">
              {(l.customer_name || l.customer_number || '?')[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-white leading-tight">{l.customer_name || 'New Lead'}</p>
              <p className="text-xs text-neutral-500 mt-0.5 truncate max-w-[220px]">{l.message}</p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border shadow-inner capitalize ${tagColor(l.tags ? l.tags[0] : 'cold')}`}>{l.tags ? l.tags[0] : 'cold'}</span>
        </div>
      ))}
    </div>

  );
}

function StatCard({ title, value, icon, sub, color }: any) {
  const glow: Record<string, string> = { blue: 'hover:border-blue-500/30', orange: 'hover:border-orange-500/30', purple: 'hover:border-purple-500/30', emerald: 'hover:border-emerald-500/30' };
  return (
    <div className={`bg-neutral-900 border border-neutral-800 p-5 rounded-2xl shadow-sm transition-colors ${glow[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{title}</span>
        <div className="p-1.5 bg-neutral-950 rounded-lg border border-neutral-800 shadow-inner">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-white tracking-tight mb-0.5">{String(value)}</p>
      <p className="text-xs text-neutral-500 font-medium">{sub}</p>
    </div>
  );
}

function QuickBtn({ href, label, color }: { href: string; label: string; color: string }) {
  const cls = color === 'emerald'
    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.3)]'
    : color === 'orange'
    ? 'bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-300'
    : 'bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white';
  return (
    <Link href={href} className={`block w-full text-center font-medium py-2.5 rounded-lg text-sm transition-all ${cls}`}>{label}</Link>
  );
}

function CreditWidget({ credits }: { credits: { used: number; limit: number; percent: number; plan: string } }) {
  if (!credits) return null;
  const isWarning = (credits.percent ?? 0) >= 80;
  const isFull = (credits.percent ?? 0) >= 100;
  const barColor = isFull ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-emerald-500';
  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${isFull ? 'bg-red-500/5 border-red-500/20' : isWarning ? 'bg-orange-500/5 border-orange-500/20' : 'bg-neutral-900 border-neutral-800'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isFull ? 'bg-red-500/10' : isWarning ? 'bg-orange-500/10' : 'bg-neutral-800'}`}>
            <MessageSquare size={18} className={isFull ? 'text-red-400' : isWarning ? 'text-orange-400' : 'text-emerald-400'} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Auto-Reply Credits</p>
            <p className="text-xs text-neutral-500">
              <span className={`font-bold ${isFull ? 'text-red-400' : isWarning ? 'text-orange-400' : 'text-emerald-400'}`}>{credits.used ?? 0}</span>
              {' '}/ {credits.limit === 999999 ? '∞' : (credits.limit ?? '—')} used this month
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${(credits.plan || '').toLowerCase() === 'starter' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : (credits.plan || '').toLowerCase() === 'pro' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-neutral-800 text-neutral-400 border-neutral-700'}`}>
            {(credits.plan ? credits.plan.charAt(0).toUpperCase() + credits.plan.slice(1) : 'Free')} Plan
          </span>
          {(isWarning || isFull) && (
            <Link href="/" className="text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-md transition-all shadow-[0_2px_10px_rgba(16,185,129,0.3)]">
              Upgrade →
            </Link>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-800 rounded-full h-2.5 overflow-hidden shadow-inner">
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ease-out ${barColor} ${isFull ? '' : 'shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}
          style={{ width: `${Math.min(credits.percent, 100)}%` }}
        />
      </div>

      {isFull && (
        <p className="text-xs text-red-400 font-semibold mt-2">
          ⚠ Credit limit reached! Auto-replies are paused. <Link href="/" className="underline hover:text-red-300">Upgrade your plan</Link> to resume.
        </p>
      )}
      {isWarning && !isFull && (
        <p className="text-xs text-orange-400 font-medium mt-2">
          You&apos;ve used {credits.percent}% of your credits. Consider upgrading before you run out.
        </p>
      )}
      {!isWarning && (
        <p className="text-xs text-neutral-500 mt-2 font-medium">
          {credits.limit === Infinity ? 'Unlimited auto-replies on your plan.' : `${credits.limit - credits.used} credits remaining this month.`}
        </p>
      )}
    </div>
  );
}

