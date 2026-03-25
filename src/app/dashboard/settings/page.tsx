'use client';
import { useState, useEffect } from 'react';
import { Smartphone, Lock, Webhook, Save, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight, Loader2, Copy } from "lucide-react";

export default function SettingsManager() {
  const [form, setForm] = useState<{ access_token: string; phone_number_id: string; business_account_id: string }>({ access_token: '', phone_number_id: '', business_account_id: '' });
  const [status, setStatus] = useState<{ connected: boolean; auto_reply_enabled: boolean; connected_at: string | null; access_token_set: boolean }>({ connected: false, auto_reply_enabled: true, connected_at: null, access_token_set: false });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [autoReply, setAutoReply] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d && !d.error) {
        setStatus(d);
        setAutoReply(d.auto_reply_enabled ?? true);
        if (d.phone_number_id) setForm(f => ({ ...f, phone_number_id: d.phone_number_id, business_account_id: d.business_account_id }));
      }
    }).catch(() => {});
  }, []);

  const save = async () => {
    if (!form.access_token || !form.phone_number_id) {
      setToast({ type: 'error', msg: 'Access Token and Phone Number ID are required.' });
      setTimeout(() => setToast(null), 4000);
      return;
    }
    setSaving(true);
    const res = await fetch('/api/settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, auto_reply_enabled: autoReply })
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setToast({ type: 'success', msg: '✅ WhatsApp connected successfully! Bot is now active.' });
      setStatus(s => ({ ...s, connected: true, access_token_set: true, connected_at: new Date().toISOString() }));
      setForm(f => ({ ...f, access_token: '' })); // clear token from view
    } else {
      setToast({ type: 'error', msg: data.error || 'Something went wrong.' });
    }
    setTimeout(() => setToast(null), 5000);
  };

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const WEBHOOK_URL = typeof window !== 'undefined' ? `${window.location.origin}/api/webhook` : 'https://your-domain.vercel.app/api/webhook';
  const VERIFY_TOKEN = 'my_super_secret_verify_token_123';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12 relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium flex items-center space-x-2 animate-in slide-in-from-right-4 duration-300 ${toast.type === 'success' ? 'bg-emerald-950 border-emerald-500/30 text-emerald-300' : 'bg-red-950 border-red-500/30 text-red-300'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <AlertCircle size={16} className="text-red-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Settings & Integrations</h1>
          <p className="text-neutral-400 text-sm">Connect your WhatsApp number to activate the sales bot.</p>
        </div>
        {/* Connection Status Badge */}
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border text-sm font-semibold ${status.connected ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-neutral-800 border-neutral-700 text-neutral-500'}`}>
          <span className={`w-2 h-2 rounded-full ${status.connected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-neutral-600'}`}></span>
          <span>{status.connected ? 'WhatsApp Connected' : 'Not Connected'}</span>
        </div>
      </div>

      {/* Auto-Reply Toggle */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
        <div>
          <h3 className="text-white font-semibold">Auto-Reply Bot</h3>
          <p className="text-xs text-neutral-400 mt-0.5">When enabled, the bot will automatically reply to all matched messages. Disable to pause the bot.</p>
        </div>
        <button onClick={() => setAutoReply(v => !v)} className={`flex items-center space-x-2 text-sm font-bold transition-all ${autoReply ? 'text-emerald-400' : 'text-neutral-500'}`}>
          {autoReply ? <ToggleRight size={36} className="text-emerald-500" /> : <ToggleLeft size={36} className="text-neutral-600" />}
          <span>{autoReply ? 'Active' : 'Paused'}</span>
        </button>
      </div>

      {/* WhatsApp API Credentials */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-neutral-800 bg-neutral-950/30 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Smartphone size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">WhatsApp Cloud API Credentials</h2>
            <p className="text-xs text-neutral-400">Get these from your <a href="https://developers.facebook.com/" target="_blank" className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300">Meta Developer Dashboard</a></p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <Field label="Permanent Access Token" value={form.access_token} onChange={v => setForm(f => ({ ...f, access_token: v }))} placeholder="EAALXxxxxxxxxxxxxxx" type="password" icon={<Lock size={15} />} hint={status.access_token_set ? '✓ Token saved (hidden for security)' : ''} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Phone Number ID" value={form.phone_number_id} onChange={v => setForm(f => ({ ...f, phone_number_id: v }))} placeholder="123456789012345" hint="Found in WhatsApp > Getting Started" />
            <Field label="WhatsApp Business Account ID" value={form.business_account_id} onChange={v => setForm(f => ({ ...f, business_account_id: v }))} placeholder="987654321098765" hint="Optional but recommended" />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950/50 flex items-center justify-between">
          {status.connected_at && <p className="text-xs text-neutral-500 font-medium">Last connected: {new Date(status.connected_at).toLocaleString()}</p>}
          <button onClick={save} disabled={saving} className="ml-auto flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.3)] text-sm disabled:opacity-60">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{saving ? 'Connecting...' : 'Connect & Save'}</span>
          </button>
        </div>
      </div>

      {/* Webhook Setup */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-neutral-800 bg-neutral-950/30 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Webhook size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Webhook Configuration</h2>
            <p className="text-xs text-neutral-400">Paste these in Meta Dashboard → WhatsApp → Configuration → Webhook</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-5 space-y-4 shadow-inner">
            <WebhookField label="Callback URL" value={WEBHOOK_URL} onCopy={() => copy(WEBHOOK_URL, 'url')} copied={copied === 'url'} />
            <WebhookField label="Verify Token" value={VERIFY_TOKEN} onCopy={() => copy(VERIFY_TOKEN, 'token')} copied={copied === 'token'} />
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            After pasting, click <strong className="text-neutral-400">Verify and Save</strong> in Meta, then subscribe to <strong className="text-neutral-400">messages</strong> under webhook fields.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', icon, hint }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string;
  type?: string; icon?: React.ReactNode; hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-neutral-300">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">{icon}</div>}
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`w-full bg-neutral-950 border border-neutral-800 rounded-lg ${icon ? 'pl-9' : 'pl-4'} pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono`} />
      </div>
      {hint && <p className="text-xs text-emerald-500/80 font-medium">{hint}</p>}
    </div>
  );
}

function WebhookField({ label, value, onCopy, copied }: any) {
  return (
    <div>
      <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">{label}</label>
      <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-lg px-3 py-2.5 flex items-center justify-between hover:border-blue-500/30 transition-colors shadow-inner">
        <span className="text-blue-400 font-mono text-xs break-all">{value}</span>
        <button onClick={onCopy} className="text-xs font-medium text-neutral-400 hover:text-white bg-neutral-800 px-2.5 py-1.5 rounded transition-colors border border-neutral-700 hover:border-neutral-600 shadow-sm whitespace-nowrap ml-3">
          {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}
