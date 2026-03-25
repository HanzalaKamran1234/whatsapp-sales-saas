'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Bot, MessageSquare, Zap, ShieldCheck, Check, ChevronDown } from 'lucide-react';

// ── COUNTRIES & PRICING DATA ─────────────────────────────────────────────────
const COUNTRIES = [
  { code: 'PK', flag: '🇵🇰', name: 'Pakistan',      currency: 'PKR', symbol: 'PKR ', rates: { starter: 2500,  pro: 7000  } },
  { code: 'IN', flag: '🇮🇳', name: 'India',         currency: 'INR', symbol: '₹',   rates: { starter: 750,   pro: 2100  } },
  { code: 'US', flag: '🇺🇸', name: 'United States', currency: 'USD', symbol: '$',   rates: { starter: 9,     pro: 25    } },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom',currency: 'GBP', symbol: '£',   rates: { starter: 7,     pro: 20    } },
  { code: 'CA', flag: '🇨🇦', name: 'Canada',        currency: 'CAD', symbol: 'CA$', rates: { starter: 12,    pro: 33    } },
  { code: 'AE', flag: '🇦🇪', name: 'UAE',           currency: 'AED', symbol: 'AED ',rates: { starter: 33,    pro: 92    } },
  { code: 'SA', flag: '🇸🇦', name: 'Saudi Arabia',  currency: 'SAR', symbol: 'SAR ',rates: { starter: 34,    pro: 94    } },
  { code: 'BD', flag: '🇧🇩', name: 'Bangladesh',    currency: 'BDT', symbol: '৳',   rates: { starter: 1000,  pro: 2800  } },
  { code: 'AU', flag: '🇦🇺', name: 'Australia',     currency: 'AUD', symbol: 'A$',  rates: { starter: 14,    pro: 38    } },
  { code: 'DE', flag: '🇩🇪', name: 'Germany',       currency: 'EUR', symbol: '€',   rates: { starter: 9,     pro: 23    } },
  { code: 'NG', flag: '🇳🇬', name: 'Nigeria',       currency: 'NGN', symbol: '₦',   rates: { starter: 14000, pro: 38000 } },
  { code: 'BR', flag: '🇧🇷', name: 'Brazil',        currency: 'BRL', symbol: 'R$',  rates: { starter: 45,    pro: 125   } },
];

const fmt = (n: number) => n >= 1000 ? n.toLocaleString() : String(n);

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [countryIdx, setCountryIdx] = useState(0); // default Pakistan
  const [ddOpen, setDdOpen] = useState(false);
  const country = COUNTRIES[countryIdx];

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500/30 flex flex-col items-center p-6 relative overflow-hidden">
      {/* BG glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-emerald-500/8 rounded-full blur-[140px] pointer-events-none" />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="max-w-4xl w-full text-center space-y-8 relative z-10 pt-20 pb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <Zap size={16} className="fill-emerald-500 text-emerald-500" />
          <span>No AI Required. 100% Rule-Based.</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
          More Sales on Autopilot.
        </h1>

        <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Never lose a customer again. Upload your products, define simple FAQ rules, and let our engine automatically reply to WhatsApp messages 24/7.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/dashboard" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105">
            Get Started For Free
          </Link>
          <a href="#pricing" className="px-8 py-4 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white font-bold rounded-xl shadow-sm transition-all">
            See Pricing
          </a>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative z-10">
        <FeatureCard icon={<Bot className="text-emerald-400" size={32} />} title="Auto-Reply FAQ Engine" desc="Map keywords to specific answers. When a customer asks about a price, the system instantly fires back." />
        <FeatureCard icon={<MessageSquare className="text-blue-400" size={32} />} title="Lead Capture" desc="We automatically save customer names, numbers, and chat history. Tag them as hot, warm, or cold." />
        <FeatureCard icon={<ShieldCheck className="text-purple-400" size={32} />} title="Native Meta Integration" desc="Connect directly to the Meta WhatsApp Cloud API seamlessly without worrying about webhooks." />
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section id="pricing" className="max-w-6xl w-full mt-28 relative z-10">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Simple, Honest Pricing</h2>
          <p className="text-neutral-400 max-w-lg mx-auto">Start free. Scale when you're ready. Cancel anytime.</p>

          {/* Country Selector */}
          <div className="flex items-center justify-center mt-6">
            <div className="relative">
              <button
                onClick={() => setDdOpen(o => !o)}
                className="flex items-center space-x-2 bg-neutral-900 border border-neutral-700 hover:border-emerald-500/50 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm min-w-[180px] justify-between"
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">{country.flag}</span>
                  <span>{country.name}</span>
                  <span className="text-neutral-500 text-xs">({country.currency})</span>
                </span>
                <ChevronDown size={16} className={`text-neutral-400 transition-transform ${ddOpen ? 'rotate-180' : ''}`} />
              </button>

              {ddOpen && (
                <div className="absolute top-12 left-0 z-50 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden w-64">
                  {COUNTRIES.map((c, i) => (
                    <button
                      key={c.code}
                      onClick={() => { setCountryIdx(i); setDdOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 flex items-center space-x-3 text-sm transition-colors hover:bg-neutral-800 ${i === countryIdx ? 'bg-emerald-500/10 text-emerald-400' : 'text-neutral-300'}`}
                    >
                      <span className="text-lg">{c.flag}</span>
                      <span className="font-medium">{c.name}</span>
                      <span className="ml-auto text-xs text-neutral-500 font-mono">{c.currency}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* FREE */}
          <PlanCard
            name="Free"
            badge={null}
            price="0"
            symbol={country.symbol}
            period="/forever"
            color="neutral"
            features={[
              '50 auto-replies / month',
              '3 FAQ rules',
              '5 products max',
              'Basic lead capture',
              'WhatsApp inbox',
              'Community support',
            ]}
            cta="Get Started Free"
            href="/dashboard"
          />

          {/* STARTER */}
          <PlanCard
            name="Starter"
            badge="Most Popular"
            price={fmt(country.rates.starter)}
            symbol={country.symbol}
            period="/month"
            color="emerald"
            features={[
              '1,000 auto-replies / month',
              '25 FAQ rules',
              '50 products',
              'Full lead capture & export',
              '1 follow-up automation',
              'CSV product import',
              'Email support',
            ]}
            cta="Start Starter"
            href="/dashboard"
          />

          {/* PRO */}
          <PlanCard
            name="Pro"
            badge={null}
            price={fmt(country.rates.pro)}
            symbol={country.symbol}
            period="/month"
            color="purple"
            features={[
              'Unlimited auto-replies',
              'Unlimited FAQ rules',
              'Unlimited products',
              'Full lead CRM + export',
              'Multiple follow-up schedules',
              'Multi-language replies',
              'Priority 24/7 support',
            ]}
            cta="Go Pro"
            href="/dashboard"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 pb-8 text-neutral-600 text-xs text-center z-10">
        © 2025 WhatsApp SaaS · Built for sellers worldwide · <Link href="/dashboard" className="text-neutral-500 hover:text-white transition-colors">Open Dashboard</Link>
      </footer>
    </div>
  );
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 backdrop-blur-md hover:bg-neutral-900 transition-colors">
      <div className="w-14 h-14 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-center mb-6 shadow-inner">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-neutral-400 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function PlanCard({ name, badge, price, symbol, period, color, features, cta, href }: {
  name: string; badge: string | null; price: string; symbol: string; period: string;
  color: 'neutral' | 'emerald' | 'purple'; features: string[]; cta: string; href: string;
}) {
  const isPopular = color === 'emerald';
  const borderCls = isPopular ? 'border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.15)]' : color === 'purple' ? 'border-purple-500/20' : 'border-neutral-800';
  const ctaCls = isPopular
    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)]'
    : color === 'purple'
    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-[0_4px_20px_rgba(147,51,234,0.3)]'
    : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700';
  const checkCls = isPopular ? 'text-emerald-400' : color === 'purple' ? 'text-purple-400' : 'text-neutral-500';

  return (
    <div className={`relative bg-neutral-900 border rounded-2xl p-7 flex flex-col shadow-lg transition-all hover:-translate-y-1 duration-300 ${borderCls}`}>
      {badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] whitespace-nowrap">
          {badge}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-3">{name}</h3>
        <div className="flex items-end space-x-1">
          <span className="text-sm font-semibold text-neutral-400 mt-1">{symbol}</span>
          <span className="text-5xl font-extrabold tracking-tight text-white">{price}</span>
        </div>
        <span className="text-neutral-500 text-sm font-medium">{period}</span>
      </div>

      <ul className="flex-1 space-y-3 mb-8">
        {features.map(f => (
          <li key={f} className="flex items-start space-x-2.5">
            <Check size={16} className={`mt-0.5 flex-shrink-0 ${checkCls}`} />
            <span className="text-sm text-neutral-300">{f}</span>
          </li>
        ))}
      </ul>

      <Link href={href} className={`block w-full text-center font-bold py-3 rounded-xl transition-all text-sm ${ctaCls}`}>
        {cta}
      </Link>
    </div>
  );
}
