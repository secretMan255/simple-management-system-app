import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Sparkles, Receipt } from 'lucide-react';
import { api } from '../services/api';
import { QueryKeys, SaleRecord } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { generateSalesPrediction } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { DataTable, Column } from '../components/ui/DataTable';

const Sales: React.FC = () => {
  const { data: sales, isLoading } = useQuery({ queryKey: [QueryKeys.SALES], queryFn: api.fetchSales });
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const handlePrediction = async () => {
    if (!sales) return;
    setIsPredicting(true);
    const result = await generateSalesPrediction(sales);
    setPrediction(result);
    setIsPredicting(false);
  };

  const handleBulkAction = (ids: string[]) => {
    alert(`Mock Action: Generate invoices for ${ids.length} orders`);
  };

  const columns: Column<SaleRecord>[] = [
    { 
      header: 'Order ID', 
      accessorKey: 'id',
      render: (item) => <span className="font-mono text-slate-500">#{item.id}</span>
    },
    { 
      header: 'Customer', 
      accessorKey: 'customerName',
      className: 'font-medium text-slate-800'
    },
    { 
      header: 'Items', 
      accessorKey: 'items',
      render: (item) => <span className="text-slate-600 text-xs truncate max-w-[200px] block" title={item.items.join(', ')}>{item.items.join(', ')}</span>
    },
    { header: 'Date', accessorKey: 'date' },
    { 
      header: 'Total', 
      accessorKey: 'totalAmount',
      render: (item) => <span className="font-semibold text-slate-900">${item.totalAmount.toFixed(2)}</span>
    },
    { 
      header: 'Status', 
      accessorKey: 'status',
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          item.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
          item.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
          'bg-slate-50 text-slate-600 border-slate-200'
        }`}>
          {item.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sales Transactions</h2>
          <p className="text-slate-500 mt-1">Monitor daily revenue and orders</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="secondary" 
            icon={Sparkles} 
            onClick={handlePrediction} 
            isLoading={isPredicting}
          >
            Forecast Trends
          </Button>
          <Button variant="outline" icon={Download}>Export CSV</Button>
        </div>
      </div>

       {prediction && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-900 mb-2">Sales Forecast</h3>
              <div className="prose prose-sm text-emerald-800">
                 <ReactMarkdown>{prediction}</ReactMarkdown>
              </div>
            </div>
            <button onClick={() => setPrediction(null)} className="text-emerald-400 hover:text-emerald-600">
              <span className="sr-only">Close</span>
              &times;
            </button>
          </div>
        </Card>
      )}

      <DataTable 
        data={sales || []}
        isLoading={isLoading}
        columns={columns}
        searchPlaceholder="Search order ID or customer..."
        searchKeys={['id', 'customerName']}
        filters={[
          {
            key: 'status',
            label: 'Order Status',
            options: [
              { label: 'Completed', value: 'Completed' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Refunded', value: 'Refunded' },
            ]
          }
        ]}
        onSelectionAction={handleBulkAction}
        actionLabel="Generate Invoice"
        actionIcon={Receipt}
      />
    </div>
  );
};

export default Sales;
