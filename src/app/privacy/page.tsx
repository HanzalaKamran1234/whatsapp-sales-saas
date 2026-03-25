import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 md:p-24 flex flex-col items-center relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl w-full space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <Link href="/" className="text-emerald-400 text-sm font-bold hover:underline inline-block">← Back to Home</Link>
          <h1 className="text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-neutral-500 text-sm">Effective Date: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="space-y-10 text-neutral-400 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">1. Introduction</h2>
            <p>
              WhatsApp Sales SaaS (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and disclose information about you when you use our website and services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">2. Information We Collect</h2>
            <div className="space-y-3">
              <p>We may collect the following types of information:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><span className="text-neutral-200 font-medium">Account Data:</span> Name, email address, and authentication information provided via Clerk.</li>
                <li><span className="text-neutral-200 font-medium">WhatsApp Data:</span> Meta API keys, phone ID, and message metadata required for the auto-reply engine.</li>
                <li><span className="text-neutral-200 font-medium">Usage Data:</span> Information about how you interact with our platform to improve our services.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">3. How We Use Your Information</h2>
            <p>
              Your data is used solely to provide and improve our service. Specifically, we use WhatsApp message data 
              to match incoming keywords and trigger the automated replies you have configured. We do not use your 
              customer data for marketing purposes or sell it to third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">4. Data Security</h2>
            <p>
              We implement industry-standard security measures, including encryption at rest and in transit, 
              to protect your information. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">5. Third-Party Services</h2>
            <p>
              We rely on several trusted partners to provide our services:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><span className="text-neutral-200 font-medium">Clerk:</span> For secure user authentication.</li>
              <li><span className="text-neutral-200 font-medium">Supabase:</span> For encrypted database storage.</li>
              <li><span className="text-neutral-200 font-medium">Meta:</span> For WhatsApp Cloud API integration.</li>
              <li><span className="text-neutral-200 font-medium">Stripe:</span> For secure payment processing.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us via our contact page.
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
