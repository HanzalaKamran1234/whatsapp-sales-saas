import Link from 'next/link';
import { Bot, MessageSquare, Zap, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500/30 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl w-full text-center space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <Zap size={16} className="fill-emerald-500 text-emerald-500" />
          <span>No AI Required. 100% Rule-Based.</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
          More Sales on Autopilot.
        </h1>
        
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Never lose a customer again. Upload your products, define simple FAQ rules, and let our engine automatically reply to WhatsApp messages 24/7.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/dashboard" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105">
            Get Started For Free
          </Link>
          <button className="px-8 py-4 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white font-bold rounded-xl shadow-sm transition-all">
            See How It Works
          </button>
        </div>
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 relative z-10 opacity-80 animate-in fade-in duration-1000 delay-300">
        <FeatureCard 
          icon={<Bot className="text-emerald-400" size={32} />} 
          title="Auto-Reply FAQ Engine" 
          desc="Map keywords to specific answers. When a customer asks about a price, the system instantly fires back."
        />
        <FeatureCard 
          icon={<MessageSquare className="text-blue-400" size={32} />} 
          title="Lead Capture" 
          desc="We automatically save customer names, numbers, and chat history. Tag them as hot, warm, or cold."
        />
        <FeatureCard 
          icon={<ShieldCheck className="text-purple-400" size={32} />} 
          title="Native Meta Integration" 
          desc="Connect directly to the Meta WhatsApp Cloud API seamlessly without worrying about webhooks."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 backdrop-blur-md hover:bg-neutral-900 transition-colors">
       <div className="w-14 h-14 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-center mb-6 shadow-inner">
         {icon}
       </div>
       <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
       <p className="text-neutral-400 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}
