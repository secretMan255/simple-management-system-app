export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
}

export interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
}

export interface SaleRecord {
  id: string;
  customerName: string;
  items: string[];
  totalAmount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Refunded';
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  email: string;
  performanceScore: number; 
}

export interface DashboardStats {
  totalRevenue: number;
  activeOrders: number;
  lowStockAlerts: number;
  totalCrew: number;
}

export enum QueryKeys {
  STOCK = 'stock',
  SALES = 'sales',
  CREW = 'crew',
  STATS = 'stats',
}
