import { getInventory } from './database.js';

getInventory((err, data) => {
    if (err) {
        console.error("Error fetching inventory:", err);
    } else {
        console.log("Inventory Data:", data);
    }
});
