import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 md:p-24 flex flex-col items-center relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl w-full space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <Link href="/" className="text-emerald-400 text-sm font-bold hover:underline inline-block">← Back to Home</Link>
          <h1 className="text-5xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="text-neutral-500 text-sm">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="space-y-10 text-neutral-400 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using AutoSales, you agree to be bound by these Terms of Service. 
              If you do not agree to all of these terms, do not use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">2. Description of Service</h2>
            <p>
              AutoSales provides a rule-based auto-reply engine for WhatsApp Business. 
              We provide tools to manage products, FAQ rules, and lead capture.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">3. User Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>You must provide accurate information when creating an account.</li>
              <li>You are responsible for maintaining the security of your account and API keys.</li>
              <li>You must comply with all WhatsApp and Meta policies regarding automated messaging.</li>
              <li>You must not use the service for spamming, harassment, or illegal activities.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">4. Payment and Subscriptions</h2>
            <p>
              Certain features require a paid subscription. Subscriptions are billed on a recurring basis. 
              You can cancel your subscription at any time through your dashboard.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, AutoSales shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages resulting from your use of the service. 
              This includes any interruptions caused by third-party APIs (Meta, Clerk, etc.).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">6. Modifications to Service</h2>
            <p>
              We reserve the right to modify or discontinue, temporarily or permanently, the service with 
              or without notice.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">7. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction in 
              which the service operator is located, without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
        
        <div className="pt-12 border-t border-neutral-900 text-xs text-neutral-600">
          © {new Date().getFullYear()} WhatsApp SaaS. All rights reserved.
        </div>
      </div>
    </div>
  );
}
