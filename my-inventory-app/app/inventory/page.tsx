// app/inventory/page.tsx
import InventoryCurrent from '../components/inventory/InventoryCurrent';
import InventoryMovement from '../components/inventory/InventoryMovement';
import CreateSnapshotButton from '../components/inventory/CreateSnapshotButton';
import SnapshotsHistory from '../components/inventory/SnapshotsHistory';

export default function InventoryPage() {
  return (
    <div className="space-y-8">
      <CreateSnapshotButton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <InventoryCurrent />
          <InventoryMovement />
        </div>
        <div>
          <SnapshotsHistory />
        </div>
      </div>
    </div>
  );
}