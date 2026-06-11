import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Grid3X3, List, Cpu, Package, Edit3, Trash2, Eye, Clock, Laptop, X, Upload, Camera, AlertCircle
} from 'lucide-react';

import PageWrapper from '../components/layout/PageWrapper';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { inventoryData } from '../data/dummyData';
import { formatCurrency } from '../utils/helpers';

export default function Inventory() {
  const [devices, setDevices] = useState(inventoryData);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [formData, setFormData] = useState({ brand: '', model: '', specs: '', status: 'Available', dailyRate: '', stock: '', image: null });
  const fileInputRef = useRef(null);

  const statuses = ['All', 'Available', 'Rented', 'Maintenance', 'Retired'];

  const filteredDevices = useMemo(() => {
    return devices
      .filter(item => {
        const matchesSearch = item.model.toLowerCase().includes(searchQuery.toLowerCase()) || item.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [devices, searchQuery, filterStatus]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setFormData({ ...formData, image: event.target.result });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddDevice = () => {
    if (!formData.brand || !formData.model) return;
    const newDevice = {
      id: `INV-${String(devices.length + 1).padStart(3, '0')}`,
      ...formData,
      dailyRate: Number(formData.dailyRate),
      stock: Number(formData.stock),
      createdAt: Date.now()
    };
    setDevices([newDevice, ...devices]);
    setFormData({ brand: '', model: '', specs: '', status: 'Available', dailyRate: '', stock: '', image: null });
    setIsAddModalOpen(false);
  };

  const handleDeleteDevice = () => {
    if (selectedDevice) {
      setDevices(devices.filter(d => d.id !== selectedDevice.id));
      setIsDeleteModalOpen(false);
      setSelectedDevice(null);
    }
  };

  return (
    <PageWrapper
      title="Inventaris Laptop"
      subtitle="Kelola perangkat laptop yang disewakan, lacak ketersediaan, dan perbarui detail."
      actions={
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer">
          <Plus size={16} /> Tambah Laptop
        </button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Available', 'Rented', 'Maintenance', 'Retired'].map(status => {
          const count = devices.filter(d => d.status === status).reduce((acc, curr) => acc + (curr.stock || 1), 0);
          const bgColors = { Available: 'bg-emerald-100', Rented: 'bg-blue-100', Maintenance: 'bg-amber-100', Retired: 'bg-slate-100' };
          const textColors = { Available: 'text-emerald-600', Rented: 'text-blue-600', Maintenance: 'text-amber-600', Retired: 'text-slate-600' };
          const labels = { Available: 'Tersedia', Rented: 'Disewa', Maintenance: 'Perawatan', Retired: 'Pensiun' };
          
          return (
            <div key={status} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColors[status]} ${textColors[status]}`}>
                <Package size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{labels[status]}</p>
                <p className="font-bold text-slate-900">{count} Unit</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input type="text" placeholder="Cari brand atau model..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-slate-400" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer">
          {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'Semua Status' : s === 'Available' ? 'Tersedia' : s === 'Rented' ? 'Disewa' : s === 'Maintenance' ? 'Perawatan' : 'Pensiun'}</option>)}
        </select>
        <div className="flex items-center bg-slate-100 rounded-xl p-1">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}><Grid3X3 size={18} /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}><List size={18} /></button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {filteredDevices.map((item, idx) => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.03 }} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                <div className="relative h-40 bg-slate-50 flex items-center justify-center p-4 overflow-hidden shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.model} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Laptop size={40} className="text-slate-500" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3"><StatusBadge status={item.status} /></div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-xs font-medium text-blue-600 mb-0.5">{item.brand}</p>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight mb-3">{item.model}</h4>
                  
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Cpu size={14} className="text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{item.specs}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Package size={14} className="text-slate-400 shrink-0" />
                      <span>{item.stock} Unit tersedia</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Tarif Harian</p>
                      <p className="font-bold text-blue-600">{formatCurrency(item.dailyRate)}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setSelectedDevice(item); setIsViewModalOpen(true); }} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition cursor-pointer"><Eye size={14} /></button>
                      <button onClick={() => { setSelectedDevice(item); setIsDeleteModalOpen(true); }} className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition cursor-pointer"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Perangkat</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Spesifikasi</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Status</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Stok</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Tarif Harian</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDevices.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img src={item.image} alt={item.model} className="w-10 h-10 rounded-lg object-contain bg-slate-50" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center"><Laptop size={20} className="text-slate-500" /></div>
                        )}
                        <div><p className="font-semibold text-slate-900">{item.model}</p><p className="text-xs text-slate-500">{item.brand}</p></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{item.specs}</td>
                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                    <td className="px-6 py-4 font-medium">{item.stock}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{formatCurrency(item.dailyRate)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => { setSelectedDevice(item); setIsViewModalOpen(true); }} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition cursor-pointer"><Eye size={14} /></button>
                        <button className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg transition cursor-pointer"><Edit3 size={14} /></button>
                        <button onClick={() => { setSelectedDevice(item); setIsDeleteModalOpen(true); }} className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition cursor-pointer"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredDevices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <Package size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">Tidak ada laptop yang sesuai kriteria.</p>
        </div>
      )}

      {/* Add Device Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Laptop Baru">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Gambar Laptop</label>
            {formData.image ? (
              <div className="relative">
                <img src={formData.image} alt="Preview" className="w-full h-48 object-contain bg-slate-50 rounded-xl border border-slate-200" />
                <button onClick={() => setFormData({ ...formData, image: null })} className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition cursor-pointer"><X size={14} /></button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                <Laptop size={32} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 mb-3">Unggah gambar laptop</p>
                <button onClick={() => fileInputRef.current?.click()} className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition cursor-pointer">
                  <Upload size={12} className="inline mr-1" /> Pilih File
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Brand *</label><input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} placeholder="e.g. Apple" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Model *</label><input type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} placeholder="e.g. MacBook Pro 16" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" /></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Spesifikasi *</label><input type="text" value={formData.specs} onChange={(e) => setFormData({ ...formData, specs: e.target.value })} placeholder="M3 Max, 36GB RAM, 1TB SSD" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Stok</label><input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="10" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Tarif Harian (Rp) *</label><input type="number" value={formData.dailyRate} onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })} placeholder="450000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"><option value="Available">Tersedia</option><option value="Maintenance">Perawatan</option></select></div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer">Batal</button>
            <button onClick={handleAddDevice} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer">Tambah Laptop</button>
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
                <p className="font-semibold text-rose-900 mb-1">Apakah Anda yakin?</p>
                <p className="text-sm text-rose-700"><strong>{selectedDevice?.brand} {selectedDevice?.model}</strong> akan dihapus secara permanen.</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer">Batal</button>
            <button onClick={handleDeleteDevice} className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition shadow-lg shadow-rose-500/20 cursor-pointer">Hapus</button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Detail Laptop">
        {selectedDevice && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-xl bg-slate-50 flex items-center justify-center p-2 shrink-0 border border-slate-100">
                {selectedDevice.image ? (
                  <img src={selectedDevice.image} alt={selectedDevice.model} className="w-full h-full object-contain" />
                ) : (
                  <Laptop size={40} className="text-slate-300" />
                )}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">{selectedDevice.model}</h4>
                <p className="text-sm font-medium text-blue-600">{selectedDevice.brand}</p>
                <div className="mt-2"><StatusBadge status={selectedDevice.status} /></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
              <div className="col-span-2"><p className="text-xs text-slate-500 mb-1">Spesifikasi</p><p className="font-medium text-slate-900">{selectedDevice.specs}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">ID Perangkat</p><p className="font-semibold text-slate-900">{selectedDevice.id}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Stok Tersedia</p><p className="font-semibold text-slate-900">{selectedDevice.stock} Unit</p></div>
              <div className="col-span-2"><p className="text-xs text-slate-500 mb-1">Tarif Harian</p><p className="font-bold text-blue-600 text-lg">{formatCurrency(selectedDevice.dailyRate)}</p></div>
            </div>
            <button onClick={() => setIsViewModalOpen(false)} className="w-full px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer mt-2">Tutup</button>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}
