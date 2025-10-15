// app/inventory/page.tsx
import InventoryCurrent from '../components/inventory/InventoryCurrent';
import InventoryMovement from '../components/inventory/InventoryMovement';

export default function InventoryPage() {
  return (
    <div className="space-y-8">
      <InventoryCurrent />
      <InventoryMovement />
    </div>
  );
}