import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container px-4 py-12 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: January 1, 2026</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-invert prose-sm max-w-none">
        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Introduction</h2>
            <p>
              Acme Analytics, Inc. ("Credit Oversight," "we," "us," or "our") is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use our tenant credit monitoring platform and related services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Information We Collect</h2>
            <h3 className="text-base font-medium text-foreground mb-2">Account Information</h3>
            <p className="mb-3">
              When you create an account, we collect your name, email address, company name, and
              billing information. This information is necessary to provide our services and process
              payments.
            </p>
            <h3 className="text-base font-medium text-foreground mb-2">Portfolio Data</h3>
            <p className="mb-3">
              To provide credit monitoring services, we collect information about your properties
              and tenants, including tenant names, lease terms, and property details that you provide.
            </p>
            <h3 className="text-base font-medium text-foreground mb-2">Usage Data</h3>
            <p>
              We automatically collect information about how you interact with our platform, including
              pages visited, features used, and actions taken. This helps us improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and maintain our tenant credit monitoring services</li>
              <li>To process transactions and send related notifications</li>
              <li>To send alerts about tenant credit events and status changes</li>
              <li>To respond to your requests and provide customer support</li>
              <li>To analyze usage patterns and improve our platform</li>
              <li>To comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Information Sharing</h2>
            <p className="mb-3">
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground">Service Providers:</strong> Third parties who assist in operating our platform (hosting, payment processing, analytics)</li>
              <li><strong className="text-foreground">Business Partners:</strong> Data providers who supply credit and corporate information for monitoring</li>
              <li><strong className="text-foreground">Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong className="text-foreground">Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Data Security</h2>
            <p>
              We implement industry-standard security measures including encryption in transit (TLS 1.3)
              and at rest (AES-256), regular security audits, access controls, and monitoring. While we
              strive to protect your information, no method of transmission or storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Data Retention</h2>
            <p>
              We retain your account information for as long as your account is active. Portfolio and
              event data is retained according to your subscription plan (30-90 days for standard plans,
              unlimited for enterprise). You may request deletion of your data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict certain processing activities</li>
              <li>Data portability (receive your data in a structured format)</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Cookies and Tracking</h2>
            <p>
              We use essential cookies to maintain your session and preferences. We also use analytics
              tools to understand how our platform is used. You can control cookie preferences through
              your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under 18 years of age. We do not knowingly
              collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material
              changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-3 p-4 rounded-lg border border-border bg-card">
              <p className="text-foreground font-medium">Acme Analytics, Inc.</p>
              <p>100 Market Street, Suite 400</p>
              <p>San Francisco, CA 94105</p>
              <p className="mt-2">
                Email: <a href="mailto:privacy@acmeanalytics.com" className="text-primary hover:underline">privacy@acmeanalytics.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
