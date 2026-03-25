import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 md:p-24 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Link href="/" className="text-emerald-400 text-sm font-bold hover:underline mb-4 inline-block">← Back to Home</Link>
        <h1 className="text-4xl font-extrabold tracking-tight underline transition-all decoration-emerald-500/50 underline-offset-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-neutral-400 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider text-sm opacity-60">1. Information We Collect</h2>
            <p>We collect your WhatsApp Business credentials and customer message metadata to provide auto-reply services. We do not sell your data.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider text-sm opacity-60">2. How We Use Data</h2>
            <p>Your data is used solely to match incoming keywords and send automated replies as configured in your dashboard.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider text-sm opacity-60">3. Security</h2>
            <p>We use industry-standard encryption to protect your API keys and customer information.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider text-sm opacity-60">4. Third-Party Services</h2>
            <p>We use Clerk for authentication, Supabase for database management, and Resend for email notifications.</p>
          </section>
        </div>
        
        <p className="pt-8 text-xs text-neutral-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
