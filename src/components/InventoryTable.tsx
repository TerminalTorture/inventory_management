import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchInventory, deleteInventoryItem } from '../assets/api/inventoryAPI';
import { useState } from 'react';
import { InventoryItem } from '../assets/api/inventory';
import { InventoryForm } from './InventoryForm';

export function InventoryTable() {
    const queryClient = useQueryClient();
    const { data: inventory, isLoading, error } = useQuery('inventory', fetchInventory);
    const [showConfirmDelete, setShowConfirmDelete] = useState<number | null>(null);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const deleteMutation = useMutation(deleteInventoryItem, {
        onSuccess: () => {
            queryClient.invalidateQueries('inventory');
            setShowConfirmDelete(null);
        }
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredInventory = inventory?.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return (
        <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading inventory data...</span>
        </div>
    );
    
    if (error) return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md p-4 text-red-700 dark:text-red-400">
            <div className="flex">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="ml-2">Error fetching inventory: {(error as Error).message}</span>
            </div>
        </div>
    );

    const handleDeleteClick = (id: number) => {
        setShowConfirmDelete(id);
    };

    const handleConfirmDelete = (id: number) => {
        deleteMutation.mutate(id);
    };

    const handleCancelDelete = () => {
        setShowConfirmDelete(null);
    };
    
    const handleEditClick = (item: InventoryItem) => {
        setEditingItem(item);
    };

    return (
        <>
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search by product name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="input"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cabinet</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredInventory && filteredInventory.length > 0 ? (
                            filteredInventory.map((item: InventoryItem) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`${item.quantity <= 5 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'} font-medium`}>
                                            {item.quantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${item.unit_price.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.cabinet_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {showConfirmDelete === item.id ? (
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleConfirmDelete(item.id!)}
                                                    className="text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-xs"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={handleCancelDelete}
                                                    className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEditClick(item)}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(item.id!)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No inventory items found. Click "Add New Item" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {editingItem && (
                <InventoryForm 
                    item={editingItem} 
                    isEditing={true}
                    onClose={() => setEditingItem(null)}
                />
            )}
        </>
    );
}

export default InventoryTable;