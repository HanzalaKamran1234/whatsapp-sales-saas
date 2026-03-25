'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Bot, MessageSquare, Zap, ShieldCheck, Check, ChevronDown, User, LogIn } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton, useAuth, useClerk } from "@clerk/nextjs";

import { COUNTRIES } from '@/lib/pricing';

const fmt = (n: number) => n >= 1000 ? n.toLocaleString() : String(n);

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [countryIdx, setCountryIdx] = useState(0); // default Pakistan
  const [ddOpen, setDdOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const country = COUNTRIES[countryIdx];

  const { userId } = useAuth();
  const { openSignUp } = useClerk();

  const handleCheckout = async (planId: string) => {
    if (planId === 'free') return; // Free plan handled by Link
    
    if (!userId) {
      openSignUp({ afterSignUpUrl: '/#pricing' });
      return;
    }

    setLoading(planId);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, countryCode: country.code }),
      });

      
      if (res.status === 401) {
        openSignUp({ afterSignUpUrl: '/#pricing' });
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session. Make sure your Stripe Product IDs are correct in Vercel.');
      }

    } catch (err) {
      console.error(err);
      alert('Connection error. Please check your internet or try again later.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500/30 flex flex-col items-center p-6 relative overflow-hidden">
      
      {/* ── NAVBAR ────────────────────────────────────────────── */}

      <nav className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between py-6 gap-y-6 md:gap-y-0 relative z-50">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Zap size={20} className="text-white fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">AutoSales</span>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-x-6">
          <Link href="/contact" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Contact</Link>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-bold text-neutral-400 hover:text-white transition-colors flex items-center space-x-2">
                <LogIn size={16} />
                <span>Login</span>
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="text-sm font-bold bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all">
              <User size={16} />
              <span>Dashboard</span>
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

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
          <SignedIn>
            <Link href="/dashboard" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105">
              Go to Dashboard
            </Link>
          </SignedIn>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105">
                Get Started For Free
              </button>
            </SignUpButton>
          </SignedOut>
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
            onClick={() => {}}
            loading={false}
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
            href="#"
            onClick={() => handleCheckout('starter')}
            loading={loading === 'starter'}
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
            href="#"
            onClick={() => handleCheckout('pro')}
            loading={loading === 'pro'}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 pb-8 w-full max-w-6xl border-t border-neutral-900 pt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
             <div className="flex items-center space-x-2 mb-4">
              <Zap size={20} className="text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-lg font-bold">AutoSales</span>
            </div>
            <p className="text-neutral-500 text-sm max-w-xs">Helping modern businesses automate their WhatsApp sales and capture more leads 24/7.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Product</h4>
            <ul className="space-y-2">
              <li><a href="#pricing" className="text-neutral-400 hover:text-emerald-400 text-sm transition-colors">Pricing</a></li>
              <li><Link href="/dashboard" className="text-neutral-400 hover:text-emerald-400 text-sm transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-neutral-400 hover:text-emerald-400 text-sm transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-neutral-400 hover:text-emerald-400 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-neutral-400 hover:text-emerald-400 text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-900 pt-8 text-neutral-600 text-xs text-center">
          © {new Date().getFullYear()} WhatsApp SaaS · Built for sellers worldwide
        </div>
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

function PlanCard({ name, badge, price, symbol, period, color, features, cta, href, onClick, loading }: {
  name: string; badge: string | null; price: string; symbol: string; period: string;
  color: 'neutral' | 'emerald' | 'purple'; features: string[]; cta: string; href: string;
  onClick?: () => void; loading?: boolean;
}) {
  const isPopular = color === 'emerald';
  const borderCls = isPopular ? 'border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.15)]' : color === 'purple' ? 'border-purple-500/20' : 'border-neutral-800';
  const ctaCls = isPopular
    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)]'
    : color === 'purple'
    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-[0_4px_20px_rgba(147,51,234,0.3)]'
    : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700';
  const checkCls = isPopular ? 'text-emerald-400' : color === 'purple' ? 'text-purple-400' : 'text-neutral-500';

  const Content = (
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

      {onClick && name !== 'Free' ? (
        <button 
          onClick={onClick}
          disabled={loading}
          className={`block w-full text-center font-bold py-3 rounded-xl transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed ${ctaCls}`}
        >
          {loading ? 'Processing...' : cta}
        </button>
      ) : (
        <Link href={href} className={`block w-full text-center font-bold py-3 rounded-xl transition-all text-sm ${ctaCls}`}>
          {cta}
        </Link>
      )}
    </div>
  );

  return Content;
}




