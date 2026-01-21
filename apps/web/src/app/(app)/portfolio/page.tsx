"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, ChevronDown } from "lucide-react";
import {
  PortfolioSidebar,
  EntityList,
  EntityDetailPanel,
  AddEntityModal,
  ShareModal,
  NoteModal,
} from "@/components/portfolio";
import { mockPortfolioEntities } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EntityFilterStatus, EntityType, QuickAction, PortfolioEntity } from "@/types";

type TabValue = "all" | EntityType;

export default function PortfolioPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabValue) || "all";

  // State - default to showing a tenant
  const [statusFilters, setStatusFilters] = useState<EntityFilterStatus[]>([
    "critical",
    "watch",
    "stable",
    "improving",
  ]);
  const [typeFilters, setTypeFilters] = useState<EntityType[]>([
    "property",
    "tenant",
    "alert",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabValue>(initialTab);
  const [selectedId, setSelectedId] = useState<string | null>("tenant-apex");

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<EntityType | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  // Filter entities based on filters
  const filteredEntities = useMemo(() => {
    return mockPortfolioEntities.filter((entity) => {
      // Status filter
      if (!statusFilters.includes(entity.status as EntityFilterStatus)) {
        return false;
      }
      // Type filter
      if (!typeFilters.includes(entity.type)) {
        return false;
      }
      return true;
    });
  }, [statusFilters, typeFilters]);

  // Calculate entity counts
  const entityCounts = useMemo(() => {
    const counts = {
      properties: mockPortfolioEntities.filter((e) => e.type === "property").length,
      tenants: mockPortfolioEntities.filter((e) => e.type === "tenant").length,
      alerts: mockPortfolioEntities.filter((e) => e.type === "alert").length,
      byStatus: {} as Record<string, number>,
    };

    mockPortfolioEntities.forEach((entity) => {
      counts.byStatus[entity.status] = (counts.byStatus[entity.status] || 0) + 1;
    });

    return counts;
  }, []);

  // Get selected entity
  const selectedEntity = selectedId
    ? filteredEntities.find((e) => e.id === selectedId) || null
    : null;

  // Handlers
  const handleAddEntity = (type: EntityType) => {
    setAddModalType(type);
    setAddModalOpen(true);
  };

  const handleQuickAction = (id: string, action: QuickAction) => {
    const entity = filteredEntities.find((e) => e.id === id);
    if (!entity) return;

    setSelectedId(id);

    switch (action) {
      case "edit":
        setAddModalType(entity.type);
        setAddModalOpen(true);
        break;
      case "note":
        setNoteModalOpen(true);
        break;
      case "share":
        setShareModalOpen(true);
        break;
      case "archive":
        // In a real app, this would archive the entity
        console.log("Archive:", id);
        break;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Page Header */}
      <header className="border-b border-border/50 bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Portfolio
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your properties, tenants, and alerts
            </p>
          </div>

          {/* Add Button */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" />
              Add
              <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => handleAddEntity("property")}>
                Add Property
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddEntity("tenant")}>
                Add Tenant
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddEntity("alert")}>
                Add Alert
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content - Three Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Filters */}
        <PortfolioSidebar
          statusFilters={statusFilters}
          typeFilters={typeFilters}
          onStatusFilterChange={setStatusFilters}
          onTypeFilterChange={setTypeFilters}
          onAddEntity={handleAddEntity}
          entityCounts={entityCounts}
        />

        {/* Center - Entity List */}
        <main className="flex-1 flex flex-col overflow-hidden border-r border-border/50">
          <EntityList
            entities={filteredEntities}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onQuickAction={handleQuickAction}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </main>

        {/* Right Panel - Detail View */}
        <EntityDetailPanel
          entity={selectedEntity}
          onClose={() => setSelectedId(null)}
          onAddNote={() => setNoteModalOpen(true)}
          onShare={() => setShareModalOpen(true)}
          onEdit={() => {
            if (selectedEntity) {
              setAddModalType(selectedEntity.type);
              setAddModalOpen(true);
            }
          }}
        />
      </div>

      {/* Modals */}
      <AddEntityModal
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setAddModalType(null);
        }}
        entityType={addModalType}
      />

      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        entity={selectedEntity}
      />

      <NoteModal
        open={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        entity={selectedEntity}
      />
    </div>
  );
}
