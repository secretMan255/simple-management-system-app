import { StockItem, SaleRecord, CrewMember, DashboardStats } from '../types';

export const MOCK_STOCK: StockItem[] = [
  { id: '1', name: 'Wireless Headphones', sku: 'WH-001', category: 'Electronics', quantity: 45, price: 129.99, status: 'In Stock', lastUpdated: '2023-10-25' },
  { id: '2', name: 'Ergonomic Mouse', sku: 'EM-002', category: 'Accessories', quantity: 12, price: 49.99, status: 'Low Stock', lastUpdated: '2023-10-24' },
  { id: '3', name: 'Mechanical Keyboard', sku: 'MK-003', category: 'Electronics', quantity: 8, price: 159.99, status: 'Low Stock', lastUpdated: '2023-10-23' },
  { id: '4', name: 'USB-C Monitor', sku: 'UM-004', category: 'Electronics', quantity: 0, price: 349.99, status: 'Out of Stock', lastUpdated: '2023-10-20' },
  { id: '5', name: 'Laptop Stand', sku: 'LS-005', category: 'Accessories', quantity: 120, price: 29.99, status: 'In Stock', lastUpdated: '2023-10-26' },
  { id: '6', name: 'Webcam 4K', sku: 'WC-006', category: 'Electronics', quantity: 33, price: 89.99, status: 'In Stock', lastUpdated: '2023-10-25' },
];

export const MOCK_SALES: SaleRecord[] = [
  { id: '101', customerName: 'Acme Corp', items: ['Wireless Headphones x5'], totalAmount: 649.95, date: '2023-10-26', status: 'Completed' },
  { id: '102', customerName: 'John Doe', items: ['Ergonomic Mouse'], totalAmount: 49.99, date: '2023-10-26', status: 'Pending' },
  { id: '103', customerName: 'TechStart Inc', items: ['Mechanical Keyboard x2', 'Monitor'], totalAmount: 669.97, date: '2023-10-25', status: 'Completed' },
  { id: '104', customerName: 'Sarah Smith', items: ['Laptop Stand'], totalAmount: 29.99, date: '2023-10-25', status: 'Refunded' },
];

export const MOCK_CREW: CrewMember[] = [
  { id: 'c1', name: 'Alice Johnson', role: 'Store Manager', department: 'Management', status: 'Active', email: 'alice@nexus.com', performanceScore: 92 },
  { id: 'c2', name: 'Bob Smith', role: 'Sales Associate', department: 'Sales', status: 'Active', email: 'bob@nexus.com', performanceScore: 88 },
  { id: 'c3', name: 'Charlie Brown', role: 'Inventory Specialist', department: 'Stock', status: 'On Leave', email: 'charlie@nexus.com', performanceScore: 75 },
  { id: 'c4', name: 'Diana Prince', role: 'Senior Sales', department: 'Sales', status: 'Active', email: 'diana@nexus.com', performanceScore: 98 },
];

export const MOCK_STATS: DashboardStats = {
  totalRevenue: 125430.50,
  activeOrders: 14,
  lowStockAlerts: 3,
  totalCrew: 12,
};
