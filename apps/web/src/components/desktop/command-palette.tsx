'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { useUIStore } from '@/stores/ui-store';
import { api } from '@/lib/api';
import {
  Search, Building2, Users, Bell, Settings2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tenant, Property } from '@/types';

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, toggleCommandPalette, openCoverageDrawer } = useUIStore();
  const [search, setSearch] = useState('');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette]);

  // Search on input
  useEffect(() => {
    if (search.length >= 2) {
      api.search(search).then(results => {
        setTenants(results.tenants || []);
        setProperties(results.properties || []);
      });
    } else {
      setTenants([]);
      setProperties([]);
    }
  }, [search]);

  const handleSelect = (value: string) => {
    toggleCommandPalette();

    if (value.startsWith('tenant:')) {
      router.push(`/tenants/${value.replace('tenant:', '')}`);
    } else if (value.startsWith('property:')) {
      router.push(`/properties/${value.replace('property:', '')}`);
    } else if (value === 'coverage') {
      openCoverageDrawer();
    } else if (value === 'alerts') {
      router.push('/alerts');
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={toggleCommandPalette}
      />

      {/* Command palette */}
      <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-full max-w-lg px-4">
        <Command
          className="rounded-xl border border-border bg-background shadow-2xl overflow-hidden"
          shouldFilter={false}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search tenants, properties, or jump to..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="px-1.5 py-0.5 text-xs text-muted-foreground bg-muted rounded">
              esc
            </kbd>
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            {/* Quick actions */}
            {search.length < 2 && (
              <Command.Group heading="Quick actions">
                <Command.Item
                  value="coverage"
                  onSelect={handleSelect}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                             hover:bg-muted aria-selected:bg-muted"
                >
                  <Settings2 className="h-4 w-4" />
                  <span>Coverage settings</span>
                </Command.Item>
                <Command.Item
                  value="alerts"
                  onSelect={handleSelect}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                             hover:bg-muted aria-selected:bg-muted"
                >
                  <Bell className="h-4 w-4" />
                  <span>Alerts</span>
                </Command.Item>
              </Command.Group>
            )}

            {/* Tenants */}
            {tenants.length > 0 && (
              <Command.Group heading="Tenants">
                {tenants.map(tenant => (
                  <Command.Item
                    key={tenant.id}
                    value={`tenant:${tenant.id}`}
                    onSelect={handleSelect}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                               hover:bg-muted aria-selected:bg-muted"
                  >
                    <Users className="h-4 w-4" />
                    <span className="flex-1">{tenant.name}</span>
                    <span className={cn(
                      'text-xs px-1.5 py-0.5 rounded',
                      tenant.status === 'critical' && 'bg-negative/10 text-negative',
                      tenant.status === 'watch' && 'bg-warning/10 text-warning',
                      tenant.status === 'stable' && 'bg-muted text-muted-foreground',
                    )}>
                      {tenant.status}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Properties */}
            {properties.length > 0 && (
              <Command.Group heading="Properties">
                {properties.map(property => (
                  <Command.Item
                    key={property.id}
                    value={`property:${property.id}`}
                    onSelect={handleSelect}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                               hover:bg-muted aria-selected:bg-muted"
                  >
                    <Building2 className="h-4 w-4" />
                    <span className="flex-1">{property.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {property.city}, {property.state}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
