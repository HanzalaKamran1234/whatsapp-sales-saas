'use client';
import { useState, useEffect, useRef } from 'react';
import { Upload, Plus, Trash2, X, Check, Package } from "lucide-react";

interface Product {
  product_id: string;
  name: string;
  price: string;
  description: string;
}

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', description: '' });
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchProducts = () => fetch('/api/products').then(r => r.json()).then(setProducts);
  useEffect(() => { fetchProducts(); }, []);

  const save = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ name: '', price: '', description: '' });
    setShowModal(false);
    setSaving(false);
    fetchProducts();
  };

  const del = async (id: string) => {
    await fetch('/api/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: id }) });
    fetchProducts();
  };

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const lines = (ev.target?.result as string).split('\n').filter(Boolean);
      const rows = lines.slice(1); // skip header
      for (const row of rows) {
        const [name, price, description] = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (name) await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, price: price || 'PKR 0', description: description || '' }) });
      }
      fetchProducts();
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Product Catalog</h1>
          <p className="text-neutral-400 text-sm">{products.length} products — used in auto-reply context.</p>
        </div>
        <div className="flex items-center space-x-3">
          <input ref={fileRef} type="file" accept=".csv" onChange={handleCSV} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm border border-neutral-700 text-sm">
            <Upload size={16} /><span>Import CSV</span>
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] text-sm">
            <Plus size={16} /><span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.product_id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-colors group shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center shadow-inner">
                <Package size={18} className="text-emerald-400" />
              </div>
              <button onClick={() => del(p.product_id)} className="text-neutral-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1.5 bg-neutral-800 rounded-lg hover:bg-neutral-700">
                <Trash2 size={14} />
              </button>
            </div>
            <h3 className="font-semibold text-white mb-1 leading-tight">{p.name}</h3>
            <p className="text-emerald-400 font-bold text-lg tracking-tight mb-2">{p.price}</p>
            <p className="text-neutral-500 text-xs leading-relaxed">{p.description}</p>
          </div>
        ))}

        {/* Add New Card */}
        <button onClick={() => setShowModal(true)} className="bg-neutral-900/40 border border-neutral-800 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3 hover:border-emerald-500/50 hover:bg-neutral-800/30 transition-all min-h-[160px] group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <Plus size={24} strokeWidth={1.5} />
          </div>
          <p className="text-neutral-400 text-sm font-medium group-hover:text-white transition-colors">Add Product</p>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">New Product</h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <Field label="Product Name" value={form.name} onChange={v => setForm(f => ({...f, name: v}))} placeholder="Running Sneakers Air 9" />
              <Field label="Price" value={form.price} onChange={v => setForm(f => ({...f, price: v}))} placeholder="PKR 4,500" />
              <Field label="Description" value={form.description} onChange={v => setForm(f => ({...f, description: v}))} placeholder="Lightweight, available in sizes 7-12" />
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2.5 rounded-lg font-medium border border-neutral-700 text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-lg font-medium shadow-[0_4px_14px_0_rgba(16,185,129,0.3)] text-sm flex items-center justify-center space-x-2 disabled:opacity-50">
                {saving ? 'Saving...' : <><Check size={16} /><span>Add Product</span></>}
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
