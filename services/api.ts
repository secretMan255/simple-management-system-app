import { MOCK_STOCK, MOCK_SALES, MOCK_CREW, MOCK_STATS } from './mockData';
import { StockItem, SaleRecord, CrewMember, DashboardStats } from '../types';

const DELAY = 600;

// In-memory store for the session to allow updates to persist in the UI
let crewStore = [...MOCK_CREW];

const delay = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), DELAY));
};

export const api = {
  fetchStock: (): Promise<StockItem[]> => delay([...MOCK_STOCK]),
  fetchSales: (): Promise<SaleRecord[]> => delay([...MOCK_SALES]),
  
  fetchCrew: (): Promise<CrewMember[]> => delay([...crewStore]),
  
  updateCrew: (member: CrewMember): Promise<CrewMember> => {
    crewStore = crewStore.map(c => c.id === member.id ? member : c);
    return delay(member);
  },

  deleteCrew: (id: string): Promise<string> => {
    crewStore = crewStore.filter(c => c.id !== id);
    return delay(id);
  },

  fetchStats: (): Promise<DashboardStats> => delay({ ...MOCK_STATS }),
};
