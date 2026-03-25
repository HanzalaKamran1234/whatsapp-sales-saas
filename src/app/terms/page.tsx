import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 md:p-24 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Link href="/" className="text-emerald-400 text-sm font-bold hover:underline mb-4 inline-block">← Back to Home</Link>
        <h1 className="text-4xl font-extrabold tracking-tight underline transition-all decoration-emerald-500/50 underline-offset-8">Terms of Service</h1>
        
        <div className="space-y-6 text-neutral-400 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider text-sm opacity-60">1. Acceptance of Terms</h2>
            <p>By using WhatsApp Sales SaaS, you agree to these terms. If you do not agree, do not use the service.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider text-sm opacity-60">2. Account Responsibility</h2>
            <p>You are responsible for maintaining the confidentiality of your account and API keys.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider text-sm opacity-60">3. Fair Usage</h2>
            <p>Users must not use the service for spamming or any illegal activities. We reserve the right to terminate accounts that violate this policy.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider text-sm opacity-60">4. Liability</h2>
            <p>We are not liable for any service interruptions from third-party APIs (Meta, Clerk, etc.).</p>
          </section>
        </div>
        
        <p className="pt-8 text-xs text-neutral-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
