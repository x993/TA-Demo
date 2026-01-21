"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  Layers,
  Menu,
  X,
  BookOpen,
  HelpCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-14 items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Layers className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-base">Credit Oversight</span>
            <span className="text-[10px] text-muted-foreground block -mt-0.5">by Acme Analytics</span>
          </div>
        </Link>

        {/* Desktop Navigation - centered */}
        <nav className="hidden md:flex items-center justify-center gap-1 flex-1">
          {/* Pricing link */}
          <Link
            href="/pricing"
            className="px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            Pricing
          </Link>

          {/* Resources dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors outline-none">
              Resources
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-52">
              <DropdownMenuItem asChild>
                <Link href="/docs" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Documentation
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/help" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Help Center
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/api-access" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  API Reference
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/status" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Status Page
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Client Login button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Client Login
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background">
          <nav className="container px-4 py-3 space-y-1">
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Pricing
            </Link>
            <div className="pt-2 border-t border-border/50 mt-2">
              <Link
                href="/docs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Documentation
              </Link>
              <Link
                href="/help"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Help Center
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Sales
              </Link>
            </div>
            <div className="pt-2 border-t border-border/50 mt-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center"
              >
                Client Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function EmailCapture() {
  return (
    <div className="bg-primary/10 border-t border-primary/20">
      <div className="container px-4 py-4">
        <form className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
          <span className="text-sm text-foreground font-medium whitespace-nowrap">
            Get weekly insights
          </span>
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all w-full sm:w-auto"
          />
          <button
            type="submit"
            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Layers className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">Credit Oversight</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Real-time tenant credit monitoring for commercial real estate portfolios.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link href="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">Portfolio</Link></li>
              <li><Link href="/scans" className="text-muted-foreground hover:text-foreground transition-colors">Scans</Link></li>
              <li><Link href="/api-access" className="text-muted-foreground hover:text-foreground transition-colors">API Access</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/security" className="text-muted-foreground hover:text-foreground transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Acme Analytics, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/status" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Status</Link>
            <Link href="/help" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <EmailCapture />
      <Footer />
    </div>
  );
}
