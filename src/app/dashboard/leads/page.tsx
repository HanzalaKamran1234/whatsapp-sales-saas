'use client';
import { useState, useEffect } from 'react';
import { Search, Download, Filter, MoreHorizontal, RefreshCw } from "lucide-react";

type Tag = 'hot' | 'warm' | 'cold';
const FILTERS: (Tag | 'all')[] = ['all', 'hot', 'warm', 'cold'];

export default function LeadsManager() {
  const [leads, setLeads] = useState<any[]>([]);
  const [filter, setFilter] = useState<Tag | 'all'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLeads = () => {
    setLoading(true);
    fetch('/api/leads').then(r => r.json()).then(d => { setLeads(d); setLoading(false); });
  };
  useEffect(() => { fetchLeads(); }, []);

  const updateTag = async (id: string, tag: Tag) => {
    await fetch('/api/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, tags: [tag] }) });
    fetchLeads();
  };

  const filtered = leads.filter(l => {
    const matchesFilter = filter === 'all' || l.tags.includes(filter);
    const matchesSearch = !search || l.customer_name.toLowerCase().includes(search.toLowerCase()) || l.customer_number.includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Leads & Customers</h1>
          <p className="text-neutral-400 text-sm">{leads.length} contacts captured from WhatsApp automation.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={fetchLeads} className="flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm border border-neutral-700 text-sm">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] text-sm">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all border ${filter === f ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'border-neutral-800 text-neutral-500 hover:text-white hover:bg-neutral-800'}`}>
            {f === 'all' ? `All (${leads.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${leads.filter(l => l.tags.includes(f)).length})`}
          </button>
        ))}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-neutral-800 bg-neutral-950/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <input type="text" placeholder="Search by name or number..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors shadow-inner" />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-neutral-500">Loading leads...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-neutral-500">No leads match your filter.</div>
        ) : (
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-950/80 text-xs uppercase font-semibold text-neutral-500 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">WhatsApp</th>
                <th className="px-6 py-4">Last Message</th>
                <th className="px-6 py-4">Tag</th>
                <th className="px-6 py-4">Rule Hit?</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filtered.map(l => <LeadRow key={l.lead_id} lead={l} onTagChange={updateTag} />)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function LeadRow({ lead, onTagChange }: { lead: any; onTagChange: (id: string, tag: Tag) => void }) {
  const tagStyle = (t: string) => ({ hot: 'bg-orange-500/10 text-orange-400 border-orange-500/30', warm: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', cold: 'bg-blue-500/10 text-blue-400 border-blue-500/30' }[t] || 'bg-neutral-800 text-neutral-400 border-neutral-700');
  const [open, setOpen] = useState(false);
  return (
    <tr className="hover:bg-neutral-800/40 transition-colors group">
      <td className="px-6 py-4 font-medium text-white">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-xs font-bold text-emerald-400 shadow-inner">{lead.customer_name[0]}</div>
          <span>{lead.customer_name}</span>
        </div>
      </td>
      <td className="px-6 py-4 font-mono text-xs">{lead.customer_number}</td>
      <td className="px-6 py-4 max-w-[200px]"><p className="truncate text-neutral-300">{lead.message}</p></td>
      <td className="px-6 py-4">
        <div className="relative">
          <button onClick={() => setOpen(o => !o)} className={`px-2.5 py-1 rounded-md text-xs font-semibold border capitalize ${tagStyle(lead.tags[0])}`}>{lead.tags[0]} ▾</button>
          {open && (
            <div className="absolute top-7 left-0 z-20 bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl overflow-hidden w-24">
              {(['hot', 'warm', 'cold'] as Tag[]).map(t => <button key={t} onClick={() => { onTagChange(lead.id, t); setOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-medium capitalize hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors">{t}</button>)}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        {lead.rule_matched ? <span className="text-emerald-400 font-semibold text-xs">✓ Auto</span> : <span className="text-orange-400 font-semibold text-xs">⚠ Manual</span>}
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-neutral-500 hover:text-white transition-colors bg-neutral-800 p-1.5 rounded-md hover:bg-neutral-700 opacity-0 group-hover:opacity-100">
          <MoreHorizontal size={16} />
        </button>
      </td>
    </tr>
  );
}
