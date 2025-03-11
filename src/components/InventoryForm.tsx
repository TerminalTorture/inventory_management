import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { addInventoryItem, updateInventoryItem } from '../assets/api/inventoryAPI';
import { InventoryItem } from '../assets/api/inventory';

interface InventoryFormProps {
  item?: InventoryItem;
  isEditing: boolean;
  onClose: () => void;
}

const defaultItem: Omit<InventoryItem, 'id'> = {
  name: '',
  category: '',
  quantity: 0,
  unit_price: 0,
  cabinet_id: 0, // Add cabinet_id to default item
};

export function InventoryForm({ item, isEditing, onClose }: InventoryFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>(
    item ? { name: item.name, category: item.category, quantity: item.quantity, unit_price: item.unit_price, cabinet_id: item.cabinet_id } 
    : defaultItem
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addMutation = useMutation(addInventoryItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('inventory');
      onClose();
    }
  });

  const updateMutation = useMutation(
    (data: { id: number; item: Partial<InventoryItem> }) => 
      updateInventoryItem(data.id, data.item),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('inventory');
        onClose();
      }
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric fields
    if (name === 'quantity' || name === 'cabinet_id') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else if (name === 'unit_price') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }
    
    if (formData.unit_price < 0) {
      newErrors.unit_price = 'Price cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (isEditing && item?.id) {
      updateMutation.mutate({ id: item.id, item: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Item Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter item name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter category"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantity*
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0"
            />
            {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="cabinet_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cabinet*
            </label>
            <input
              type="number"
              id="cabinet_id"
              name="cabinet_id"
              value={formData.cabinet_id}
              onChange={handleChange}
              className="input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0"
            />
            {errors.cabinet_id && <p className="mt-1 text-sm text-red-600">{errors.cabinet_id}</p>}
          </div>
          
          <div className="mb-6">
            <label htmlFor="unit_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Unit Price ($)
            </label>
            <input
              type="number"
              id="unit_price"
              name="unit_price"
              value={formData.unit_price}
              onChange={handleChange}
              className="input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0"
              step="0.01"
            />
            {errors.unit_price && <p className="mt-1 text-sm text-red-600">{errors.unit_price}</p>}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={addMutation.isLoading || updateMutation.isLoading}
            >
              {(addMutation.isLoading || updateMutation.isLoading) ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : isEditing ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InventoryForm;