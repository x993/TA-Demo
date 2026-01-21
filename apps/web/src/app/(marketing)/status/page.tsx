import { Activity, CheckCircle, Clock, AlertTriangle, Server, Database, Bell, Globe } from "lucide-react";

const services = [
  {
    name: "Web Application",
    icon: Globe,
    status: "operational",
    uptime: "99.98%",
  },
  {
    name: "API",
    icon: Server,
    status: "operational",
    uptime: "99.95%",
  },
  {
    name: "Database",
    icon: Database,
    status: "operational",
    uptime: "99.99%",
  },
  {
    name: "Alert Delivery",
    icon: Bell,
    status: "operational",
    uptime: "99.90%",
  },
];

const incidents = [
  {
    date: "Jan 15, 2026",
    title: "Scheduled Maintenance",
    status: "completed",
    description: "Routine database maintenance. No service interruption.",
  },
  {
    date: "Jan 8, 2026",
    title: "Elevated API Latency",
    status: "resolved",
    description: "Brief period of increased response times. Resolved within 15 minutes.",
  },
  {
    date: "Dec 20, 2025",
    title: "Alert Delivery Delay",
    status: "resolved",
    description: "Some email alerts were delayed by up to 30 minutes. Root cause identified and fixed.",
  },
];

function StatusBadge({ status }: { status: string }) {
  const config = {
    operational: { label: "Operational", color: "bg-positive/20 text-positive" },
    degraded: { label: "Degraded", color: "bg-warning/20 text-warning" },
    outage: { label: "Outage", color: "bg-negative/20 text-negative" },
    completed: { label: "Completed", color: "bg-muted text-muted-foreground" },
    resolved: { label: "Resolved", color: "bg-positive/20 text-positive" },
  }[status] || { label: status, color: "bg-muted text-muted-foreground" };

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

export default function StatusPage() {
  const allOperational = services.every((s) => s.status === "operational");

  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Activity className="h-4 w-4" />
          System Status
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          Credit Oversight Status
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Real-time status and uptime information for all Credit Oversight services.
        </p>
      </header>

      {/* Overall Status */}
      <div className={`rounded-xl border p-6 mb-8 ${
        allOperational
          ? "border-positive/30 bg-positive/5"
          : "border-warning/30 bg-warning/5"
      }`}>
        <div className="flex items-center gap-4">
          {allOperational ? (
            <CheckCircle className="h-8 w-8 text-positive" />
          ) : (
            <AlertTriangle className="h-8 w-8 text-warning" />
          )}
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {allOperational ? "All Systems Operational" : "Some Systems Degraded"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                timeZoneName: "short"
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-4">Services</h2>
        <div className="space-y-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.name}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{service.name}</p>
                    <p className="text-xs text-muted-foreground">30-day uptime: {service.uptime}</p>
                  </div>
                </div>
                <StatusBadge status={service.status} />
              </div>
            );
          })}
        </div>
      </section>

      {/* Uptime Chart Placeholder */}
      <section className="rounded-xl border border-border bg-card p-6 mb-12">
        <h2 className="text-lg font-semibold text-foreground mb-4">90-Day Uptime</h2>
        <div className="flex gap-1 h-8">
          {Array.from({ length: 90 }).map((_, i) => {
            // Simulate uptime - mostly green with a few minor incidents
            const status = i === 45 || i === 72 ? "degraded" : "operational";
            return (
              <div
                key={i}
                className={`flex-1 rounded-sm ${
                  status === "operational" ? "bg-positive/60" : "bg-warning/60"
                }`}
                title={`Day ${90 - i}: ${status === "operational" ? "No issues" : "Brief degradation"}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>90 days ago</span>
          <span>Today</span>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-4">Recent Incidents</h2>
        <div className="space-y-4">
          {incidents.map((incident, index) => (
            <div key={index} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{incident.date}</span>
                </div>
                <StatusBadge status={incident.status} />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{incident.title}</h3>
              <p className="text-sm text-muted-foreground">{incident.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="rounded-xl border border-border bg-muted/30 p-6 text-center">
        <Bell className="h-8 w-8 text-primary mx-auto mb-3" />
        <h3 className="font-semibold text-foreground mb-2">Subscribe to Status Updates</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
          Get notified when there are issues affecting Credit Oversight services.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
}
