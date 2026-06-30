import { useState, useMemo } from 'react';
import { useToast } from '../components/ui/Toast';
import { ShinyButton } from '../components/ui/shiny-button';

import {
  Plus, Search, Eye, Edit3, Trash2, Clock,
  AlertCircle, Wrench, ExternalLink, MapPin
} from 'lucide-react';

import PageWrapper from '../components/layout/PageWrapper';
import AnimatedSearchInput from '../components/ui/AnimatedSearchInput';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import LocationPickerField from '../components/ui/LocationPickerField';
import { serviceData } from '../data/dummyData';
import { formatCurrency } from '../utils/helpers';



export default function Service() {
  const { showToast } = useToast();
  const [services, setServices] = useState(serviceData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  const [formData, setFormData] = useState({
    customer: '', device: '', issue: '', cost: '', technician: '', status: 'Pending', location: ''
  });
  const [editData, setEditData] = useState({
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
    if (!formData.customer || !formData.device || !formData.issue || !formData.cost) {
      showToast('Harap lengkapi semua field yang wajib diisi', 'error');
      return;
    }
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
    showToast('Service berhasil ditambahkan', 'success');
  };

  const handleDeleteService = () => {
    if (selectedService) {
      setServices(services.filter(s => s.id !== selectedService.id));
      setIsDeleteModalOpen(false);
      setSelectedService(null);
      showToast('Service berhasil dihapus', 'success');
    }
  };

  const handleEditService = () => {
    if (!editData.customer || !editData.device || !editData.issue || !editData.cost) {
      showToast('Harap lengkapi semua field yang wajib diisi', 'error');
      return;
    }
    setServices(services.map(s => s.id === selectedService.id ? { ...s, ...editData, cost: Number(editData.cost) } : s));
    setIsEditModalOpen(false);
    setSelectedService(null);
    showToast('Service berhasil diperbarui', 'success');
  };

  const handleStatusChange = (id, newStatus) => {
    setServices(services.map(s => s.id === id ? { ...s, status: newStatus } : s));
    showToast('Status service berhasil diperbarui', 'success');
  };

  return (
    <PageWrapper
      title="Manajemen Service"
      subtitle="Kelola semua service dan perbaikan perangkat."
      actions={
        <ShinyButton
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer dark:text-slate-900"
        >
          <Plus size={16} /> Tambah Service
        </ShinyButton>
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
            <div key={status} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3 dark:bg-slate-900 dark:border-slate-800">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[status]}`}>
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{labels[status]}</p>
                <p className="font-bold text-slate-900 dark:text-white">{count}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3 dark:bg-slate-900 dark:border-slate-800">
        <AnimatedSearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari pelanggan, perangkat, atau ID..." />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-200"
        >
          {statuses.map(s => (
            <option key={s} value={s}>
              {s === 'All' ? 'Semua Status' : s === 'Pending' ? 'Menunggu' : s === 'In Progress' ? 'Dalam Proses' : s === 'Completed' ? 'Selesai' : 'Dibatalkan'}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden dark:bg-slate-900 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">ID</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Pelanggan</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Perangkat</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Masalah</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Teknisi & Lokasi</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Biaya</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{service.id}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-200">{service.customer}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-200">{service.device}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{service.issue}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Wrench size={14} className="text-slate-400" />
                      <span>{service.technician}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {typeof service.location === 'object'
                        ? service.location?.label
                        : service.location || 'Workshop Utama'}
                      {(() => {
                        const loc = service.location;
                        const label = typeof loc === 'object' ? loc?.label : loc;
                        const url = typeof loc === 'object' && loc?.lat && loc?.lng
                          ? `https://www.google.com/maps?q=${loc.lat},${loc.lng}`
                          : label ? `https://www.google.com/maps/search/${encodeURIComponent(label)}` : null;
                        return url ? (
                          <a href={url} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center gap-0.5 text-blue-400 hover:text-blue-600 transition" onClick={e => e.stopPropagation()}>
                            <ExternalLink size={9} />
                          </a>
                        ) : null;
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block group hover:scale-105 transition-transform duration-200">
                      <select
                        value={service.status}
                        onChange={(e) => handleStatusChange(service.id, e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        title="Ubah Status"
                      >
                        <option value="Pending">Menunggu</option>
                        <option value="In Progress">Dalam Proses</option>
                        <option value="Completed">Selesai</option>
                        <option value="Cancelled">Dibatalkan</option>
                      </select>
                      <StatusBadge status={service.status} />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{formatCurrency(service.cost)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button onClick={() => { setSelectedService(service); setIsViewModalOpen(true); }} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition cursor-pointer" aria-label="Lihat"><Eye size={14} /></button>
                      <button onClick={() => { setSelectedService(service); setEditData(service); setIsEditModalOpen(true); }} className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg transition cursor-pointer" aria-label="Edit"><Edit3 size={14} /></button>
                      <button onClick={() => { setSelectedService(service); setIsDeleteModalOpen(true); }} className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition cursor-pointer" aria-label="Hapus"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 font-medium dark:text-slate-400">Tidak ada service yang sesuai dengan kriteria Anda.</p>
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Service Baru">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Pelanggan *</label>
              <input type="text" value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} placeholder="Nama pelanggan" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Perangkat *</label>
              <input type="text" value={formData.device} onChange={(e) => setFormData({ ...formData, device: e.target.value })} placeholder="Model perangkat" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Masalah *</label>
            <input type="text" value={formData.issue} onChange={(e) => setFormData({ ...formData, issue: e.target.value })} placeholder="Deskripsi masalah" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Teknisi *</label>
              <input type="text" value={formData.technician} onChange={(e) => setFormData({ ...formData, technician: e.target.value })} placeholder="Nama teknisi" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800 dark:text-white" />
            </div>
            <div>
              <LocationPickerField
                label="Lokasi *"
                value={formData.location}
                onChange={(loc) => setFormData({ ...formData, location: loc })}
                placeholder="Cth: Workshop Utama"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Estimasi Biaya (Rp) *</label>
              <input type="number" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} placeholder="0" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800 dark:text-white" />
              {formData.cost && !isNaN(formData.cost) && (
                <div className="mt-2 inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold tracking-wide animate-in fade-in zoom-in duration-200">
                  Rp {Number(formData.cost).toLocaleString('id-ID')}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer dark:bg-slate-800/40 dark:border-slate-800">
                <option value="Pending">Menunggu</option>
                <option value="In Progress">Dalam Proses</option>
                <option value="Completed">Selesai</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <ShinyButton onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Batal</ShinyButton>
            <ShinyButton onClick={handleAddService} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer dark:text-slate-900">Tambah Service</ShinyButton>
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
            <ShinyButton onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Batal</ShinyButton>
            <ShinyButton onClick={handleDeleteService} className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition shadow-lg shadow-rose-500/20 cursor-pointer dark:text-slate-900">Hapus Service</ShinyButton>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Detail Service">
        {selectedService && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider dark:text-slate-400">ID Service</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{selectedService.id}</p>
              </div>
              <StatusBadge status={selectedService.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 dark:text-slate-400">Pelanggan</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedService.customer}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 dark:text-slate-400">Perangkat</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedService.device}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-500 font-medium mb-1 dark:text-slate-400">Masalah / Keluhan</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedService.issue}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 dark:text-slate-400">Teknisi Penanggung Jawab</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedService.technician}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 dark:text-slate-400">Lokasi Workshop</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {typeof selectedService.location === 'object'
                    ? selectedService.location?.label
                    : selectedService.location || 'Workshop Utama'}
                </p>
                {(() => {
                  const loc = selectedService.location;
                  const label = typeof loc === 'object' ? loc?.label : loc;
                  const url = typeof loc === 'object' && loc?.lat && loc?.lng
                    ? `https://www.google.com/maps?q=${loc.lat},${loc.lng}`
                    : label
                      ? `https://www.google.com/maps/search/${encodeURIComponent(label)}`
                      : null;
                  return url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 hover:underline transition-colors mt-1">
                      <ExternalLink size={10} /> Lihat di Google Maps
                    </a>
                  ) : null;
                })()}
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 dark:text-slate-400">Estimasi Biaya</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatCurrency(selectedService.cost)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 dark:text-slate-400">Tanggal Dibuat</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{new Date(selectedService.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <ShinyButton onClick={() => setIsViewModalOpen(false)} className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Tutup</ShinyButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Service">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Pelanggan *</label>
              <input type="text" value={editData.customer} onChange={(e) => setEditData({ ...editData, customer: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Perangkat *</label>
              <input type="text" value={editData.device} onChange={(e) => setEditData({ ...editData, device: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Masalah *</label>
            <input type="text" value={editData.issue} onChange={(e) => setEditData({ ...editData, issue: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Teknisi *</label>
              <input type="text" value={editData.technician} onChange={(e) => setEditData({ ...editData, technician: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800 dark:text-white" />
            </div>
            <div>
              <LocationPickerField
                label="Lokasi *"
                value={editData.location}
                onChange={(loc) => setEditData({ ...editData, location: loc })}
                placeholder="Pilih lokasi workshop..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Estimasi Biaya (Rp) *</label>
              <input type="number" value={editData.cost} onChange={(e) => setEditData({ ...editData, cost: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Status</label>
              <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer dark:bg-slate-800/40 dark:border-slate-800 text-slate-900 dark:text-white">
                <option value="Pending">Menunggu</option>
                <option value="In Progress">Dalam Proses</option>
                <option value="Completed">Selesai</option>
                <option value="Cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <ShinyButton onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Batal</ShinyButton>
            <ShinyButton onClick={handleEditService} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-orange-500/20 cursor-pointer dark:text-slate-900">Simpan Perubahan</ShinyButton>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
