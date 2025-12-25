import React, { useEffect } from 'react';
import { useTableStore } from '../../store/useTableStore';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, Trash2 } from 'lucide-react';
import { Checkbox } from './Checkbox';
import { Button } from './Button';
import clsx from 'clsx';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface FilterOption {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[]; // Keys to fuzzy search against
  filters?: FilterOption[];
  onSelectionAction?: (selectedIds: string[]) => void;
  actionLabel?: string;
  actionIcon?: React.ElementType;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  isLoading,
  searchPlaceholder = "Search...",
  searchKeys = [],
  filters = [],
  onSelectionAction,
  actionLabel = "Action",
  actionIcon: ActionIcon = Trash2,
}: DataTableProps<T>) {
  const { 
    search, page, itemsPerPage, selectedIds, filters: activeFilters,
    setSearch, setPage, setItemsPerPage, toggleSelection, toggleAll, setFilter, clearSelection, reset 
  } = useTableStore();

  // Reset store on mount/unmount to ensure fresh state for different pages
  useEffect(() => {
    reset();
    return () => reset();
  }, [reset]);

  // --- Filtering Logic ---
  const filteredData = React.useMemo(() => {
    if (!data) return [];
    
    return data.filter(item => {
      // 1. Search
      if (search && searchKeys.length > 0) {
        const matchesSearch = searchKeys.some(key => {
          const val = item[key];
          return String(val).toLowerCase().includes(search.toLowerCase());
        });
        if (!matchesSearch) return false;
      }

      // 2. Filters (Dropdowns)
      for (const [key, value] of Object.entries(activeFilters)) {
        if (value && value !== 'all') {
           // @ts-ignore - dynamic access
           if (String(item[key]) !== value) return false;
        }
      }

      return true;
    });
  }, [data, search, searchKeys, activeFilters]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage, 
    page * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const isAllPageSelected = paginatedData.length > 0 && paginatedData.every(item => selectedIds.has(item.id));
  const isIndeterminate = paginatedData.some(item => selectedIds.has(item.id)) && !isAllPageSelected;

  return (
    <div className="space-y-4">
      {/* --- Toolbar: Search, Filter, Bulk Actions --- */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Dynamic Filters */}
          {filters.map((filter) => (
            <div key={filter.key} className="relative hidden sm:block">
              <select
                className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:border-slate-300"
                value={activeFilters[filter.key] || 'all'}
                onChange={(e) => setFilter(filter.key, e.target.value)}
              >
                <option value="all">{filter.label}: All</option>
                {filter.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bulk Actions Header (visible when selection > 0) */}
        {selectedIds.size > 0 && (
           <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-lg animate-in fade-in slide-in-from-top-2">
             <span className="text-sm font-medium text-blue-700">{selectedIds.size} selected</span>
             {onSelectionAction && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 text-blue-700 hover:text-blue-900 hover:bg-blue-100"
                  onClick={() => {
                    onSelectionAction(Array.from(selectedIds));
                    clearSelection();
                  }}
                >
                  <ActionIcon className="w-4 h-4 mr-2" />
                  {actionLabel}
                </Button>
             )}
             <button onClick={clearSelection} className="text-slate-400 hover:text-slate-600">
               <span className="sr-only">Clear</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             </button>
           </div>
        )}
      </div>

      {/* --- Table --- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                {/* Checkbox Header */}
                <th className="py-3 px-4 w-12">
                   <Checkbox 
                     checked={isAllPageSelected}
                     className={isIndeterminate ? "opacity-50" : ""}
                     onCheckedChange={() => toggleAll(paginatedData.map(d => d.id))}
                   />
                </th>
                {columns.map((col, idx) => (
                  <th key={idx} className={clsx("py-3 px-4 font-medium text-slate-500 text-sm whitespace-nowrap", col.className)}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                       <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                       Loading data...
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row) => {
                  const isSelected = selectedIds.has(row.id);
                  return (
                    <tr 
                      key={row.id} 
                      className={clsx(
                        "border-b border-slate-100 transition-colors group",
                        isSelected ? "bg-blue-50/40 hover:bg-blue-50/60" : "hover:bg-slate-50"
                      )}
                    >
                      <td className="py-3 px-4 w-12">
                        <Checkbox 
                          checked={isSelected} 
                          onCheckedChange={() => toggleSelection(row.id)}
                        />
                      </td>
                      {columns.map((col, idx) => (
                        <td key={idx} className="py-3 px-4 text-slate-700">
                          {col.render ? col.render(row) : (col.accessorKey ? String(row[col.accessorKey]) : '')}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                   <td colSpan={columns.length + 1} className="py-12 text-center text-slate-400">
                     No results found.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- Pagination Footer --- */}
        {!isLoading && filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t border-slate-100 bg-slate-50/30 gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-900">{(page - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-slate-900">{Math.min(page * itemsPerPage, filteredData.length)}</span> of <span className="font-medium text-slate-900">{filteredData.length}</span> results
              </span>
              
              <div className="flex items-center gap-2">
                 <span className="text-sm text-slate-500 hidden sm:inline">Rows per page:</span>
                 <select 
                   className="text-sm border border-slate-200 rounded-md bg-white py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                   value={itemsPerPage}
                   onChange={(e) => setItemsPerPage(Number(e.target.value))}
                 >
                   <option value={5}>5</option>
                   <option value={10}>10</option>
                   <option value={20}>20</option>
                   <option value={50}>50</option>
                 </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  // Logic to show limited page numbers (start, end, current, surrounding) could go here
                  // For now, keeping it simple as per previous version
                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={clsx(
                        "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all",
                        page === p 
                          ? "bg-blue-600 text-white shadow-sm" 
                          : "text-slate-600 hover:bg-white border border-transparent hover:border-slate-200"
                      )}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <button 
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}