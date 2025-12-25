import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, Plus, Archive } from 'lucide-react';
import { api } from '../services/api';
import { QueryKeys, StockItem } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { generateStockInsights } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { DataTable, Column } from '../components/ui/DataTable';

const Stock: React.FC = () => {
  const { data: stock, isLoading } = useQuery({ queryKey: [QueryKeys.STOCK], queryFn: api.fetchStock });
  const [insights, setInsights] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInsights = async () => {
    if (!stock) return;
    setIsGenerating(true);
    const result = await generateStockInsights(stock);
    setInsights(result);
    setIsGenerating(false);
  };

  const handleBulkAction = (ids: string[]) => {
    console.log('Bulk archiving items:', ids);
    alert(`Mock Action: Archived ${ids.length} items`);
  };

  const columns: Column<StockItem>[] = [
    { 
      header: 'Product Name', 
      accessorKey: 'name', 
      className: 'font-medium text-slate-900',
      render: (item) => <span className="font-semibold text-slate-800">{item.name}</span>
    },
    { header: 'SKU', accessorKey: 'sku' },
    { 
      header: 'Category', 
      accessorKey: 'category',
      render: (item) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
          {item.category}
        </span>
      )
    },
    { header: 'Quantity', accessorKey: 'quantity' },
    { 
      header: 'Price', 
      accessorKey: 'price',
      render: (item) => `$${item.price.toFixed(2)}`
    },
    { 
      header: 'Status', 
      accessorKey: 'status',
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          item.status === 'In Stock' ? 'bg-green-50 text-green-700 border-green-200' :
          item.status === 'Low Stock' ? 'bg-amber-50 text-amber-700 border-amber-200' :
          'bg-red-50 text-red-700 border-red-200'
        }`}>
          {item.status}
        </span>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: () => (
        <div className="text-right">
           <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">Edit</button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inventory Management</h2>
          <p className="text-slate-500 mt-1">Track and manage your products</p>
        </div>
        <div className="flex space-x-3">
           <Button 
            variant="secondary" 
            icon={Sparkles} 
            onClick={handleGenerateInsights}
            isLoading={isGenerating}
          >
            AI Insights
          </Button>
          <Button icon={Plus}>Add Item</Button>
        </div>
      </div>

      {insights && (
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100">
          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-indigo-900 mb-2">Gemini Analysis</h3>
              <div className="prose prose-sm text-indigo-800">
                 <ReactMarkdown>{insights}</ReactMarkdown>
              </div>
            </div>
            <button onClick={() => setInsights(null)} className="text-indigo-400 hover:text-indigo-600">
              <span className="sr-only">Close</span>
              &times;
            </button>
          </div>
        </Card>
      )}

      <DataTable 
        data={stock || []}
        isLoading={isLoading}
        columns={columns}
        searchPlaceholder="Search products or SKU..."
        searchKeys={['name', 'sku']}
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { label: 'In Stock', value: 'In Stock' },
              { label: 'Low Stock', value: 'Low Stock' },
              { label: 'Out of Stock', value: 'Out of Stock' },
            ]
          }
        ]}
        onSelectionAction={handleBulkAction}
        actionLabel="Archive Selected"
        actionIcon={Archive}
      />
    </div>
  );
};

export default Stock;
