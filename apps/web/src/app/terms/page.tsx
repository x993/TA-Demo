import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container px-4 py-12 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last updated: January 1, 2026</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-invert prose-sm max-w-none">
        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Credit Oversight (the "Service"), operated by Acme Analytics, Inc.,
              you agree to be bound by these Terms of Service. If you do not agree to these terms,
              do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Description of Service</h2>
            <p>
              Credit Oversight is a tenant credit monitoring platform that provides alerts and insights
              about the financial health of commercial tenants. The Service aggregates publicly available
              information including SEC filings, court records, news articles, and credit data to help
              commercial real estate professionals monitor tenant risk.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Account Registration</h2>
            <p className="mb-3">To use the Service, you must:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Be at least 18 years old</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Subscription and Billing</h2>
            <p className="mb-3">
              <strong className="text-foreground">Fees:</strong> You agree to pay all fees associated
              with your subscription plan. Fees are billed in advance on a monthly or annual basis.
            </p>
            <p className="mb-3">
              <strong className="text-foreground">Auto-Renewal:</strong> Subscriptions automatically
              renew unless cancelled before the renewal date. You may cancel at any time through your
              account settings.
            </p>
            <p>
              <strong className="text-foreground">Refunds:</strong> Fees are non-refundable except
              as required by law or as explicitly stated in our refund policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Resell, redistribute, or sublicense access to the Service</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated means to access the Service beyond API limits</li>
              <li>Misrepresent your identity or affiliation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Data and Content</h2>
            <p className="mb-3">
              <strong className="text-foreground">Your Data:</strong> You retain ownership of data
              you provide to the Service. You grant us a license to use this data solely to provide
              and improve the Service.
            </p>
            <p>
              <strong className="text-foreground">Our Content:</strong> All content, features, and
              functionality of the Service are owned by Acme Analytics and protected by intellectual
              property laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Disclaimer of Warranties</h2>
            <p className="mb-3">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
              We do not warrant that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>The Service will be uninterrupted or error-free</li>
              <li>The information provided is complete, accurate, or current</li>
              <li>The Service will meet your specific requirements</li>
            </ul>
            <p className="mt-3">
              <strong className="text-foreground">Important:</strong> Credit Oversight is an informational
              tool and should not be the sole basis for business decisions. We recommend verifying
              information through official sources and consulting with appropriate professionals.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ACME ANALYTICS SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
              PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY. Our total liability
              shall not exceed the amounts paid by you in the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Acme Analytics and its officers, directors,
              employees, and agents from any claims, damages, or expenses arising from your use
              of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Termination</h2>
            <p>
              We may suspend or terminate your access to the Service at any time for violation of
              these Terms or for any other reason with notice. Upon termination, your right to use
              the Service ceases immediately. Provisions that by their nature should survive termination
              shall survive.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. We will notify you of material changes by email
              or through the Service. Continued use of the Service after changes constitutes acceptance
              of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of California without regard to
              conflict of law principles. Any disputes shall be resolved in the state or federal
              courts located in San Francisco County, California.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">13. Contact Information</h2>
            <p>
              For questions about these Terms, please contact:
            </p>
            <div className="mt-3 p-4 rounded-lg border border-border bg-card">
              <p className="text-foreground font-medium">Acme Analytics, Inc.</p>
              <p>100 Market Street, Suite 400</p>
              <p>San Francisco, CA 94105</p>
              <p className="mt-2">
                Email: <a href="mailto:legal@acmeanalytics.com" className="text-primary hover:underline">legal@acmeanalytics.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
