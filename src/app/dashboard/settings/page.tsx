import { Smartphone, Lock, Webhook, Save } from "lucide-react";

export default function SettingsManager() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Settings & Integrations</h1>
        <p className="text-neutral-400 text-sm">Connect Meta WhatsApp API and configure your SaaS experience.</p>
      </div>

      <div className="space-y-6">
        {/* WhatsApp Meta API Config */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-neutral-800 bg-neutral-950/30 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Smartphone size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">WhatsApp Cloud API</h2>
              <p className="text-xs text-neutral-400">Connect your Meta Developer app credentials.</p>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
            <div className="grid gap-3">
              <label className="text-sm font-medium text-neutral-300">Permanent Access Token</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input 
                  type="password" 
                  value="EAALXxxxxxxxxxxxxxxxxxxxx" 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-neutral-400 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="grid gap-3">
                <label className="text-sm font-medium text-neutral-300">Phone Number ID</label>
                <input 
                  type="text" 
                  value="123456789012345" 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-400 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  readOnly
                />
              </div>
              <div className="grid gap-3">
                <label className="text-sm font-medium text-neutral-300">WhatsApp Business Account ID</label>
                <input 
                  type="text" 
                  value="987654321098765" 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-400 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950/50 flex justify-end">
             <button className="flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm border border-neutral-700">
               <Save size={16} />
               <span>Update Keys</span>
             </button>
          </div>
        </div>

        {/* Webhook Configuration */}
         <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-neutral-800 bg-neutral-950/30 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <Webhook size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Webhook URL Setup</h2>
              <p className="text-xs text-neutral-400">Copy this URL to your Meta App Dashboard to receive messages.</p>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
             <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 shadow-inner">
               <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                 In your Meta Developer Dashboard, navigate to <strong>WhatsApp</strong> ➔ <strong>Configuration</strong>, click <strong>Edit Webhook</strong>, and paste the URL and Verify Token below.
               </p>
               
               <div className="space-y-4">
                 <div>
                   <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Callback URL</label>
                   <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-lg px-3 py-2.5 flex items-center justify-between shadow-inner hover:border-blue-500/30 transition-colors">
                     <span className="text-blue-400 font-mono text-[13px] break-all">https://autosasaas.vercel.app/api/webhook</span>
                     <button className="text-xs font-medium text-neutral-400 hover:text-white bg-neutral-800 px-2.5 py-1.5 rounded transition-colors border border-neutral-700 hover:border-neutral-600 shadow-sm whitespace-nowrap ml-3">Copy URL</button>
                   </div>
                 </div>
                 <div>
                   <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Verify Token</label>
                   <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-lg px-3 py-2.5 flex items-center justify-between shadow-inner hover:border-blue-500/30 transition-colors">
                     <span className="text-emerald-400 font-mono text-[13px]">my_super_secret_verify_token_123</span>
                     <button className="text-xs font-medium text-neutral-400 hover:text-white bg-neutral-800 px-2.5 py-1.5 rounded transition-colors border border-neutral-700 hover:border-neutral-600 shadow-sm whitespace-nowrap ml-3">Copy Token</button>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
