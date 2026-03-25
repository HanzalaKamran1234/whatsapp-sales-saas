'use client';
import { useState, useEffect } from 'react';
import { Send, CheckCircle2, Zap, Search } from "lucide-react";

interface Lead {
  lead_id: string;
  customer_name: string;
  customer_number: string;
  message: string;
  reply: string;
  rule_matched: boolean;
  created_at: string;
  tags: string[];
}

export default function InboxUI() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [replyText, setReplyText] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/leads')
      .then(r => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLeads(data);
          setSelected(data[0] ?? null);
        } else {
          setLeads([]);
        }
      })
      .catch(() => setLeads([]));
  }, []);

  const filtered = (Array.isArray(leads) ? leads : []).filter(l =>
    !search ||
    (l.customer_name && l.customer_name.toLowerCase().includes(search.toLowerCase())) ||
    (l.customer_number && l.customer_number.includes(search))
  );

  const timeAgo = (iso: string) => {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return `${Math.round(diff)}s ago`;
    if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
    return `${Math.round(diff / 86400)}d ago`;
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-10rem)] flex space-x-5 animate-in fade-in zoom-in-95 duration-500">

      {/* Chat List Sidebar */}
      <div className="w-72 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex flex-col overflow-hidden flex-shrink-0">
        <div className="p-4 border-b border-neutral-800 bg-neutral-950/30">
          <h2 className="text-base font-bold text-white mb-3">Inbox</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/50">
          {(Array.isArray(filtered) ? filtered : []).map(lead => (
            <button key={lead.lead_id} onClick={() => setSelected(lead)} className={`w-full text-left p-4 transition-colors border-l-2 ${selected?.lead_id === lead.lead_id ? 'bg-neutral-800/80 border-emerald-500' : 'hover:bg-neutral-800/40 border-transparent'}`}>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-medium truncate ${selected?.lead_id === lead.lead_id ? 'text-white' : 'text-neutral-300'}`}>{lead.customer_name || 'New Lead'}</span>
                <span className="text-[10px] text-neutral-500 flex-shrink-0 ml-2">{lead.created_at ? timeAgo(lead.created_at) : ''}</span>
              </div>
              <p className="text-xs text-neutral-500 truncate">{lead.message || 'No message'}</p>
              {!lead.rule_matched && (
                <span className="mt-1.5 inline-block text-[9px] text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded font-bold">Needs Reply</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Main */}
      <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {selected ? (
          <>
            {/* Header */}
            <div className="h-14 border-b border-neutral-800 flex items-center justify-between px-5 bg-neutral-950/80 backdrop-blur-md flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/20 text-xs">
                  {(selected.customer_name || '?')[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">{selected.customer_name || 'New Lead'}</p>
                  <p className="text-[10px] text-neutral-500 font-mono">{selected.customer_number || 'No number'}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md border capitalize ${selected.tags?.[0] === 'hot' ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' : selected.tags?.[0] === 'warm' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-blue-400 bg-blue-500/10 border-blue-500/20'}`}>
                {selected.tags?.[0] || 'cold'}
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-neutral-950/10">
              <div className="flex justify-center">
                <span className="text-[10px] bg-neutral-800 text-neutral-400 px-3 py-1 rounded-full font-medium">{new Date(selected.created_at).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              </div>

              {/* Customer message */}
              <div className="flex flex-col items-start">
                <div className="max-w-[70%] px-4 py-2.5 bg-neutral-800 border-l-2 border-neutral-600 text-neutral-200 rounded-2xl rounded-tl-sm shadow-sm">
                  <p className="text-sm leading-relaxed">{selected.message || 'No message'}</p>
                </div>
                <span className="text-[10px] text-neutral-500 mt-1 ml-1 font-medium">{selected.created_at ? timeAgo(selected.created_at) : ''}</span>
              </div>

              {/* Bot reply */}
              <div className="flex flex-col items-end">
                <div className="max-w-[70%] px-4 py-2.5 bg-emerald-600 text-white rounded-2xl rounded-tr-sm shadow-sm">
                  <p className="text-sm leading-relaxed">{selected.reply}</p>
                </div>
                <div className="flex items-center space-x-1 mt-1 mr-1">
                  <span className="text-[10px] text-neutral-500 font-medium">{timeAgo(selected.created_at)}</span>
                  <CheckCircle2 size={11} className="text-emerald-500/80" />
                  {selected.rule_matched && (
                    <span className="text-[9px] text-emerald-500/80 font-bold flex items-center ml-0.5">
                      <Zap size={9} className="mr-0.5 fill-emerald-500" /> Bot
                    </span>
                  )}
                </div>
              </div>

              {!selected.rule_matched && (
                <div className="flex justify-center">
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3 text-center max-w-xs">
                    <p className="text-orange-300 text-xs font-semibold">⚠ No rule matched</p>
                    <p className="text-neutral-500 text-[10px] mt-0.5">Type a manual reply below to respond</p>
                  </div>
                </div>
              )}
            </div>

            {/* Reply Input */}
            <div className="p-4 border-t border-neutral-800 flex-shrink-0 bg-neutral-950/40">
              <div className="flex items-center space-x-2 bg-neutral-900 border border-neutral-700/80 rounded-xl p-1.5 focus-within:border-emerald-500/60 transition-colors">
                <input type="text" value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type a manual reply..." className="flex-1 bg-transparent text-sm text-white focus:outline-none px-2 placeholder:text-neutral-600" />
                <button disabled={!replyText} className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white transition-colors rounded-lg disabled:opacity-40 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  <Send size={15} className="ml-0.5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-600">Select a conversation</div>
        )}
      </div>
    </div>
  );
}
