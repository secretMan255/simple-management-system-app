import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Shield, User, Briefcase, Activity, Trash2, Edit2 } from 'lucide-react';
import { api } from '../services/api';
import { QueryKeys, CrewMember } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { DataTable, Column } from '../components/ui/DataTable';

const Crew: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: crew, isLoading } = useQuery({ queryKey: [QueryKeys.CREW], queryFn: api.fetchCrew });
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CrewMember | null>(null);
  const [formData, setFormData] = useState<Partial<CrewMember>>({});

  const updateMutation = useMutation({
    mutationFn: api.updateCrew,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CREW] });
      setIsEditModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteCrew,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CREW] });
    },
  });

  const handleEdit = (member: CrewMember) => {
    setEditingMember(member);
    setFormData({ ...member });
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this crew member?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    if (window.confirm(`Delete ${ids.length} members?`)) {
      ids.forEach(id => deleteMutation.mutate(id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember && formData.id) {
      updateMutation.mutate(formData as CrewMember);
    }
  };

  const columns: Column<CrewMember>[] = [
    {
      header: 'Employee',
      accessorKey: 'name',
      render: (member) => (
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
            {member.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-slate-900">{member.name}</p>
            <p className="text-xs text-slate-500">{member.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Role & Dept',
      accessorKey: 'role',
      render: (member) => (
        <div>
          <p className="text-slate-800 text-sm">{member.role}</p>
          <p className="text-xs text-slate-500">{member.department}</p>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      render: (member) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          member.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 
          member.status === 'On Leave' ? 'bg-amber-50 text-amber-700 border-amber-200' :
          'bg-red-50 text-red-700 border-red-200'
        }`}>
          {member.status}
        </span>
      )
    },
    {
      header: 'Performance',
      accessorKey: 'performanceScore',
      render: (member) => (
        <div className="flex items-center space-x-2">
           <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
             <div 
               className={`h-full rounded-full ${member.performanceScore >= 90 ? 'bg-green-500' : member.performanceScore >= 75 ? 'bg-blue-500' : 'bg-amber-500'}`} 
               style={{ width: `${member.performanceScore}%` }}
             />
           </div>
           <span className="text-xs text-slate-600 font-medium">{member.performanceScore}%</span>
        </div>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (member) => (
        <div className="flex items-center justify-end space-x-2">
           <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEdit(member)}>
             <Edit2 size={16} className="text-slate-500" />
           </Button>
           <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-red-50" onClick={() => handleDelete(member.id)}>
             <Trash2 size={16} className="text-red-500" />
           </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Crew Management</h2>
          <p className="text-slate-500 mt-1">Manage employee roles, access, and performance</p>
        </div>
        <Button>Add Member</Button>
      </div>

      <DataTable 
        data={crew || []}
        isLoading={isLoading}
        columns={columns}
        searchPlaceholder="Search crew by name, role..."
        searchKeys={['name', 'role', 'email']}
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { label: 'Active', value: 'Active' },
              { label: 'On Leave', value: 'On Leave' },
              { label: 'Terminated', value: 'Terminated' },
            ]
          },
          {
            key: 'department',
            label: 'Department',
            options: [
              { label: 'Sales', value: 'Sales' },
              { label: 'Management', value: 'Management' },
              { label: 'Stock', value: 'Stock' },
            ]
          }
        ]}
        onSelectionAction={handleBulkDelete}
        actionLabel="Delete Selected"
        actionIcon={Trash2}
      />

      {/* Edit Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Crew Member"
      >
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Section: Personal Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <User size={14} /> Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 my-2"></div>

          {/* Section: Role & Credentials */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Shield size={14} /> Role & Credentials
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                  <select 
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  >
                    <option value="Management">Management</option>
                    <option value="Sales">Sales</option>
                    <option value="Stock">Stock</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 my-2"></div>

          {/* Section: Performance & Status */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Activity size={14} /> Status & Performance
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employment Status</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.status || 'Active'}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Performance Score (0-100)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.performanceScore || 0}
                  onChange={(e) => setFormData({...formData, performanceScore: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={updateMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Crew;
