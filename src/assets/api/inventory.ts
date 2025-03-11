export interface InventoryItem {
    id?: number; // Optional for new items
    name: string;
    category: string;
    quantity: number;
    unit_price: number;
    cabinet_id: number; // Add cabinet_id property
}
