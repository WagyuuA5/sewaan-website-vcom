import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Eye, Edit3, Trash2, Clock, Filter,
  AlertCircle, MoreHorizontal, Wrench
} from 'lucide-react';

import PageWrapper from '../components/layout/PageWrapper';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { serviceData } from '../data/dummyData';
import { formatCurrency } from '../utils/helpers';

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return `${seconds} detik lalu`;
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  return `${days} hari lalu`;
};

export default function Service() {
  const [services, setServices] = useState(serviceData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    customer: '', device: '', issue: '', cost: '', technician: '', status: 'Pending', location: ''
  });

  const statuses = ['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'];

  const filteredServices = useMemo(() => {
    return services
      .filter(item => {
        const matchesSearch = item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [services, searchQuery, filterStatus]);

  const handleAddService = () => {
    if (!formData.customer || !formData.device || !formData.issue || !formData.cost) return;
    const newService = {
      id: `SRV-${String(services.length + 1).padStart(3, '0')}`,
      ...formData,
      cost: Number(formData.cost),
      location: formData.location || 'Workshop Utama',
      createdAt: Date.now()
    };
    setServices([newService, ...services]);
    setFormData({ customer: '', device: '', issue: '', cost: '', technician: '', status: 'Pending', location: '' });
    setIsAddModalOpen(false);
  };

  const handleDeleteService = () => {
    if (selectedService) {
      setServices(services.filter(s => s.id !== selectedService.id));
      setIsDeleteModalOpen(false);
      setSelectedService(null);
    }
  };

  return (
    <PageWrapper
      title="Manajemen Service"
      subtitle="Kelola semua service dan perbaikan perangkat."
      actions={
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          <Plus size={16} /> Tambah Service
        </button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Pending', 'In Progress', 'Completed', 'Cancelled'].map((status) => {
          const count = services.filter(s => s.status === status).length;
          const colors = {
            'Pending': 'bg-amber-100 text-amber-600',
            'In Progress': 'bg-blue-100 text-blue-600',
            'Completed': 'bg-emerald-100 text-emerald-600',
            'Cancelled': 'bg-rose-100 text-rose-600',
          };
          const labels = {
            'Pending': 'Menunggu',
            'In Progress': 'Dalam Proses',
            'Completed': 'Selesai',
            'Cancelled': 'Dibatalkan',
          };
          return (
            <div key={status} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[status]}`}>
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{labels[status]}</p>
                <p className="font-bold text-slate-900">{count}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari pelanggan, perangkat, atau ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-slate-400"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
        >
          {statuses.map(s => (
            <option key={s} value={s}>
              {s === 'All' ? 'Semua Status' : s === 'Pending' ? 'Menunggu' : s === 'In Progress' ? 'Dalam Proses' : s === 'Completed' ? 'Selesai' : 'Dibatalkan'}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">ID</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Pelanggan</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Perangkat</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Masalah</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Teknisi & Lokasi</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Status</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Biaya</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900">{service.id}</td>
                  <td className="px-6 py-4 text-slate-700">{service.customer}</td>
                  <td className="px-6 py-4 text-slate-700">{service.device}</td>
                  <td className="px-6 py-4 text-slate-500">{service.issue}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Wrench size={14} className="text-slate-400" />
                      <span>{service.technician}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{service.location || 'Workshop Utama'}</div>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={service.status} /></td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{formatCurrency(service.cost)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition cursor-pointer"><Eye size={14} /></button>
                      <button className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg transition cursor-pointer"><Edit3 size={14} /></button>
                      <button onClick={() => { setSelectedService(service); setIsDeleteModalOpen(true); }} className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition cursor-pointer"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 font-medium">Tidak ada service yang sesuai dengan kriteria Anda.</p>
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Service Baru">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Pelanggan *</label>
              <input type="text" value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} placeholder="Nama pelanggan" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Perangkat *</label>
              <input type="text" value={formData.device} onChange={(e) => setFormData({ ...formData, device: e.target.value })} placeholder="Model perangkat" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Masalah *</label>
            <input type="text" value={formData.issue} onChange={(e) => setFormData({ ...formData, issue: e.target.value })} placeholder="Deskripsi masalah" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Teknisi *</label>
              <input type="text" value={formData.technician} onChange={(e) => setFormData({ ...formData, technician: e.target.value })} placeholder="Nama teknisi" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Lokasi *</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Cth: Workshop Utama" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Estimasi Biaya (Rp) *</label>
              <input type="number" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} placeholder="0" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer">
                <option value="Pending">Menunggu</option>
                <option value="In Progress">Dalam Proses</option>
                <option value="Completed">Selesai</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer">Batal</button>
            <button onClick={handleAddService} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer">Tambah Service</button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Konfirmasi Hapus">
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-900 mb-1">Apakah Anda yakin ingin menghapus service ini?</p>
                <p className="text-sm text-rose-700">
                  <strong>{selectedService?.id}</strong> — {selectedService?.customer} ({selectedService?.device}) akan dihapus secara permanen.
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer">Batal</button>
            <button onClick={handleDeleteService} className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition shadow-lg shadow-rose-500/20 cursor-pointer">Hapus Service</button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
