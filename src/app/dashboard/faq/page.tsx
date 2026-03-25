'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Search, X, Check } from "lucide-react";

interface FAQ {
  faq_id: string;
  name: string;
  keywords: string[];
  answer: string;
}

export default function FAQManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', keywords: '', answer: '' });
  const [saving, setSaving] = useState(false);

  const fetchFaqs = () => fetch('/api/faqs').then(r => r.json()).then(setFaqs);
  useEffect(() => { fetchFaqs(); }, []);

  const save = async () => {
    if (!form.name || !form.keywords || !form.answer) return;
    setSaving(true);
    await fetch('/api/faqs', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean), answer: form.answer }),
    });
    setForm({ name: '', keywords: '', answer: '' });
    setShowModal(false);
    setSaving(false);
    fetchFaqs();
  };

  const del = async (id: string) => {
    await fetch('/api/faqs', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ faq_id: id }) });
    fetchFaqs();
  };

  const filtered = faqs.filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.keywords.some(k => k.includes(search.toLowerCase())));

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">FAQ Rule Engine</h1>
          <p className="text-neutral-400 text-sm">{faqs.length} rules active — customer messages are matched against these.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] text-sm">
          <Plus size={18} /><span>New Rule</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
        <input type="text" placeholder="Search rules or keywords..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors shadow-inner" />
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-neutral-950/80 text-xs uppercase font-semibold text-neutral-500 border-b border-neutral-800">
            <tr>
              <th className="px-6 py-4">Rule Name</th>
              <th className="px-6 py-4">Keyword Triggers</th>
              <th className="px-6 py-4">Auto-Reply</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {filtered.length === 0 && <tr><td colSpan={4} className="px-6 py-12 text-center text-neutral-600">No rules found. Add one!</td></tr>}
            {filtered.map(faq => (
              <tr key={faq.faq_id} className="hover:bg-neutral-800/40 transition-colors group">
                <td className="px-6 py-4 font-medium text-white">{faq.name}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {faq.keywords.map(kw => <span key={kw} className="px-2 py-0.5 rounded-md bg-neutral-950 text-xs font-medium text-emerald-400 border border-neutral-800/80 shadow-inner">{kw}</span>)}
                  </div>
                </td>
                <td className="px-6 py-4"><p className="line-clamp-2 text-neutral-300 max-w-xs text-xs">{faq.answer}</p></td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-neutral-500 hover:text-white transition-colors bg-neutral-800 p-1.5 rounded-md hover:bg-neutral-700"><Edit2 size={14} /></button>
                    <button onClick={() => del(faq.faq_id)} className="text-neutral-500 hover:text-red-400 transition-colors bg-neutral-800 p-1.5 rounded-md hover:bg-neutral-700"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-6 w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Add New Rule</h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-500 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <Field label="Rule Name (e.g. Pricing Inquiry)" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Pricing Inquiry" />
              <Field label="Keywords (comma-separated)" value={form.keywords} onChange={v => setForm(f => ({ ...f, keywords: v }))} placeholder="price, cost, kitna, rate" />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-300">Auto-Reply Message</label>
                <textarea value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} rows={3} placeholder="Our products start at PKR 1500..." className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none shadow-inner" />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2.5 rounded-lg font-medium transition-colors border border-neutral-700 text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-lg font-medium transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.3)] text-sm flex items-center justify-center space-x-2 disabled:opacity-50">
                {saving ? <span>Saving...</span> : <><Check size={16} /><span>Save Rule</span></>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-neutral-300">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors shadow-inner" />
    </div>
  );
}
