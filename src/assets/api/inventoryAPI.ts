import axios from 'axios';
import { InventoryItem } from './inventory';
const API_BASE_URL = 'http://localhost:5000';

// Fetch all inventory items
export const fetchInventory = async (): Promise<InventoryItem[]> => {
    const response = await axios.get(`${API_BASE_URL}/inventory`);
    return response.data;
};

// Fetch a single inventory item
export const fetchInventoryItem = async (id: number): Promise<InventoryItem> => {
    const response = await axios.get(`${API_BASE_URL}/inventory/${id}`);
    return response.data;
};

// Add a new inventory item
export const addInventoryItem = async (data: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
    const response = await axios.post(`${API_BASE_URL}/inventory`, data);
    return response.data;
};

// Update an inventory item
export const updateInventoryItem = async (id: number, data: Partial<InventoryItem>): Promise<InventoryItem> => {
    const response = await axios.put(`${API_BASE_URL}/inventory/${id}`, data);
    return response.data;
};

// Delete an inventory item
export const deleteInventoryItem = async (id: number): Promise<void> => {
    const response = await axios.delete(`${API_BASE_URL}/inventory/${id}`);
    return response.data;
};