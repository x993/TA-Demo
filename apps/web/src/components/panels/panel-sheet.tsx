'use client';

import { useUIStore } from '@/stores/ui-store';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import { PropertyPanel } from './property-panel';
import { TenantPanel } from './tenant-panel';

export function PanelSheet() {
  const {
    panelOpen,
    panelType,
    panelEntityId,
    panelTileData,
    closePanel
  } = useUIStore();

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const panelContent = () => {
    if (!panelType || !panelEntityId) return null;

    switch (panelType) {
      case 'property':
        return <PropertyPanel propertyId={panelEntityId} />;
      case 'tenant':
        return <TenantPanel tenantId={panelEntityId} />;
      case 'priority':
        return <TenantPanel tenantId={panelEntityId} tileData={panelTileData} />;
      case 'cluster':
        return <PropertyPanel propertyId={panelEntityId} tileData={panelTileData} />;
      default:
        return null;
    }
  };

  // Desktop: Right drawer
  if (isDesktop) {
    return (
      <Sheet open={panelOpen} onOpenChange={(open) => !open && closePanel()}>
        <SheetContent
          side="right"
          className="w-[500px] p-0 overflow-y-auto"
        >
          {panelContent()}
        </SheetContent>
      </Sheet>
    );
  }

  // Mobile: Bottom sheet with snap points
  return (
    <BottomSheet
      open={panelOpen}
      onOpenChange={(open) => !open && closePanel()}
      snapPoints={['35%', '70%', '92%']}
    >
      {panelContent()}
    </BottomSheet>
  );
}
