import { QueryClient, QueryClientProvider } from 'react-query'
import { InventoryTable } from './components/InventoryTable'
import { InventoryForm } from './components/InventoryForm'
import { useState } from 'react'
import './App.css'

const queryClient = new QueryClient();

function App() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m16 10l-8-4m0 0L4 17m8-4V3" />
              </svg>
              <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Inventory Management System</h1>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QueryClientProvider client={queryClient}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Inventory Items</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                Add New Item
              </button>
            </div>
            <InventoryTable />
          </div>
          
          {showAddForm && (
            <InventoryForm 
              isEditing={false} 
              onClose={() => setShowAddForm(false)} 
            />
          )}
        </QueryClientProvider>
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Inventory Management System © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
