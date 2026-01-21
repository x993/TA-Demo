"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Building,
  CreditCard,
  Users,
  ChevronRight,
  Check
} from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

type SettingsSection = "profile" | "notifications" | "security" | "team" | "billing" | "properties";

const sections = [
  { id: "profile" as const, label: "Profile", icon: User },
  { id: "notifications" as const, label: "Notifications", icon: Bell },
  { id: "security" as const, label: "Security", icon: Shield },
  { id: "team" as const, label: "Team Members", icon: Users },
  { id: "billing" as const, label: "Billing", icon: CreditCard },
  { id: "properties" as const, label: "Properties", icon: Building },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const { role, setRole } = useUIStore();

  return (
    <div className="container px-4 py-8 max-w-5xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </header>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                  activeSection === section.id
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="md:col-span-3">
          <div className="rounded-xl border border-border bg-card p-6">
            {activeSection === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Profile Settings</h2>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Demo User</p>
                      <p className="text-sm text-muted-foreground">demo@acmeanalytics.com</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Display Name</label>
                    <input
                      type="text"
                      defaultValue="Demo User"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                    <input
                      type="email"
                      defaultValue="demo@acmeanalytics.com"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Default View</label>
                    <p className="text-xs text-muted-foreground mb-2">Choose your preferred dashboard view</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setRole("exec")}
                        className={cn(
                          "flex-1 px-4 py-3 rounded-lg border text-sm font-medium transition-colors",
                          role === "exec"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-border hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>Executive View</span>
                          {role === "exec" && <Check className="h-4 w-4" />}
                        </div>
                        <p className="text-xs mt-1 text-muted-foreground">High-level portfolio overview</p>
                      </button>
                      <button
                        onClick={() => setRole("am")}
                        className={cn(
                          "flex-1 px-4 py-3 rounded-lg border text-sm font-medium transition-colors",
                          role === "am"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-border hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>Asset Manager View</span>
                          {role === "am" && <Check className="h-4 w-4" />}
                        </div>
                        <p className="text-xs mt-1 text-muted-foreground">Property-level detail</p>
                      </button>
                    </div>
                  </div>
                </div>

                <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Save Changes
                </button>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: "Critical tenant alerts", description: "Immediate notification for critical status changes", default: true },
                    { label: "Watch list updates", description: "Daily digest of watch-status tenant activity", default: true },
                    { label: "SEC filings", description: "New SEC filings from monitored tenants", default: true },
                    { label: "Court filings", description: "Litigation and bankruptcy filings", default: true },
                    { label: "Credit score changes", description: "Significant credit rating movements", default: false },
                    { label: "Weekly summary", description: "Portfolio health summary every Monday", default: true },
                  ].map((pref) => (
                    <div key={pref.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{pref.label}</p>
                        <p className="text-xs text-muted-foreground">{pref.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={pref.default} className="sr-only peer" />
                        <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/50 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <button className="text-sm text-primary font-medium hover:underline">Enable</button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">Change Password</p>
                      <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
                    </div>
                    <button className="text-sm text-primary font-medium hover:underline">Update</button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">Active Sessions</p>
                      <p className="text-xs text-muted-foreground">2 devices currently logged in</p>
                    </div>
                    <button className="text-sm text-primary font-medium hover:underline">Manage</button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "team" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                    Invite Member
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Demo User", email: "demo@acmeanalytics.com", role: "Admin" },
                    { name: "Jane Smith", email: "jane@acmeanalytics.com", role: "Asset Manager" },
                    { name: "Bob Johnson", email: "bob@acmeanalytics.com", role: "Viewer" },
                  ].map((member) => (
                    <div key={member.email} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm font-medium text-muted-foreground">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "billing" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Billing & Subscription</h2>
                <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-foreground">Professional Plan</p>
                      <p className="text-xs text-muted-foreground">$799/month • Renews Feb 1, 2026</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-positive/20 text-positive">Active</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="text-sm text-primary font-medium hover:underline">Change Plan</button>
                    <button className="text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">Payment Method</p>
                    <p className="text-xs text-muted-foreground">Visa ending in 4242</p>
                  </div>
                  <button className="text-sm text-primary font-medium hover:underline">Update</button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">Billing History</p>
                    <p className="text-xs text-muted-foreground">View past invoices and receipts</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            )}

            {activeSection === "properties" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Property Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Configure default settings for property monitoring and tenant tracking.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">Auto-add new tenants</p>
                      <p className="text-xs text-muted-foreground">Automatically monitor new tenants when added</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">Include subsidiaries</p>
                      <p className="text-xs text-muted-foreground">Monitor tenant subsidiary companies</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Default alert threshold</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option>Critical only</option>
                      <option>Critical and Watch</option>
                      <option>All status changes</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
