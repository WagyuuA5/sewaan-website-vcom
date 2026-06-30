import { useState, useMemo, useRef } from 'react';
import { useToast } from '../components/ui/Toast';
import { ShinyButton } from '../components/ui/shiny-button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Grid3X3, List, Smartphone, Clock, Eye, Trash2, AlertCircle,
  Upload, X, Laptop, Tablet, Monitor
} from 'lucide-react';

import PageWrapper from '../components/layout/PageWrapper';
import AnimatedSearchInput from '../components/ui/AnimatedSearchInput';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { devicesData } from '../data/dummyData';

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

const typeIcons = {
  Smartphone: Smartphone,
  Laptop: Laptop,
  Tablet: Tablet,
  Computer: Monitor
};

const DeviceIcon = ({ type, size = 40, className = '' }) => {
  const Icon = typeIcons[type] || Smartphone;
  return <Icon size={size} className={className} />;
};

export default function Devices() {
  const { showToast } = useToast();
  const [devices, setDevices] = useState(devicesData);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [formData, setFormData] = useState({ brand: '', model: '', type: 'Laptop', status: 'Available', image: null });
  const fileInputRef = useRef(null);

  const statuses = ['All', 'Available', 'In Service'];
  const types = ['Laptop', 'Computer'];

  const filteredDevices = useMemo(() => {
    return devices
      .filter(item => {
        const matchesSearch = item.model.toLowerCase().includes(searchQuery.toLowerCase()) || item.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
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
    if (!formData.brand || !formData.model || !formData.type) {
      showToast('Harap lengkapi semua field yang wajib diisi', 'error');
      return;
    }
    const newDevice = {
      id: `DEV-${String(devices.length + 1).padStart(3, '0')}`,
      ...formData,
      createdAt: Date.now()
    };
    setDevices([newDevice, ...devices]);
    setFormData({ brand: '', model: '', type: 'Smartphone', status: 'Available', image: null });
    setIsAddModalOpen(false);
    showToast('Perangkat berhasil ditambahkan', 'success');
  };

  const handleDeleteDevice = () => {
    if (selectedDevice) {
      setDevices(devices.filter(d => d.id !== selectedDevice.id));
      setIsDeleteModalOpen(false);
      setSelectedDevice(null);
      showToast('Perangkat berhasil dihapus', 'success');
    }
  };



  return (
    <PageWrapper
      title="Manajemen Perangkat"
      subtitle="Kelola semua perangkat yang masuk untuk service."
      actions={
        <ShinyButton onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer dark:text-slate-900">
          <Plus size={16} /> Tambah Perangkat
        </ShinyButton>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {['Available', 'In Service'].map(status => {
          const count = devices.filter(d => d.status === status).length;
          return (
            <div key={status} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3 dark:bg-slate-900 dark:border-slate-800">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status === 'Available' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                <Smartphone size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{status === 'Available' ? 'Tersedia' : 'Dalam Service'}</p>
                <p className="font-bold text-slate-900 dark:text-white">{count}</p>
              </div>
            </div>
          );
        })}
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3 dark:bg-slate-900 dark:border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
            <Smartphone size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total Perangkat</p>
            <p className="font-bold text-slate-900 dark:text-white">{devices.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3 dark:bg-slate-900 dark:border-slate-800">
        <AnimatedSearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari brand atau model..." />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-200">
          {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'Semua Status' : s === 'Available' ? 'Tersedia' : 'Dalam Service'}</option>)}
        </select>
        <div className="flex items-center bg-slate-100 rounded-xl p-1 dark:bg-slate-800">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}><Grid3X3 size={18} /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}><List size={18} /></button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {filteredDevices.map((item, idx) => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.03 }} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group dark:bg-slate-900 dark:border-slate-800">
                <div className="relative h-40 bg-slate-50 flex items-center justify-center p-4 overflow-hidden dark:bg-slate-800/40">
                  {item.image ? (
                    <img src={item.image} alt={item.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <DeviceIcon type={item.type} size={40} className="text-slate-500 dark:text-slate-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3"><StatusBadge status={item.status} /></div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-medium text-blue-600 mb-0.5">{item.brand}</p>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight mb-2 dark:text-white">{item.model}</h4>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-700 mb-4 dark:bg-slate-800 dark:text-slate-200">{item.type}</span>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg dark:bg-slate-800">
                      <Clock size={12} className="text-slate-500 dark:text-slate-400" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{formatRelativeTime(item.createdAt)}</span>
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden dark:bg-slate-900 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Perangkat</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Tipe</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Ditambahkan</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDevices.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img src={item.image} alt={item.model} className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center dark:bg-slate-800"><DeviceIcon type={item.type} size={20} className="text-slate-500 dark:text-slate-400" /></div>
                        )}
                        <div><p className="font-semibold text-slate-900 dark:text-white">{item.model}</p><p className="text-xs text-slate-500 dark:text-slate-400">{item.brand}</p></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-200">{item.type}</td>
                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">{formatRelativeTime(item.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => { setSelectedDevice(item); setIsViewModalOpen(true); }} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition cursor-pointer"><Eye size={14} /></button>
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
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
          <Smartphone size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium dark:text-slate-400">Tidak ada perangkat yang sesuai.</p>
        </div>
      )}

      {/* Add Device Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Perangkat Baru">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-200">Gambar Perangkat</label>
            {formData.image ? (
              <div className="relative">
                <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded-xl border border-slate-200 dark:border-slate-800" />
                <button onClick={() => setFormData({ ...formData, image: null })} className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition cursor-pointer dark:text-slate-900"><X size={14} /></button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center dark:border-slate-800">
                <Smartphone size={32} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 mb-3 dark:text-slate-400">Unggah gambar perangkat</p>
                <button onClick={() => fileInputRef.current?.click()} className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition cursor-pointer">
                  <Upload size={12} className="inline mr-1" /> Pilih File
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Brand *</label><input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} placeholder="e.g. Apple" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Model *</label><input type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} placeholder="e.g. iPhone 15 Pro" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Tipe *</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer dark:bg-slate-800/40 dark:border-slate-800">{types.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer dark:bg-slate-800/40 dark:border-slate-800"><option value="Available">Tersedia</option><option value="In Service">Dalam Service</option></select></div>
          </div>
          <div className="flex gap-3 pt-4">
            <ShinyButton onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Batal</ShinyButton>
            <ShinyButton onClick={handleAddDevice} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer dark:text-slate-900">Tambah Perangkat</ShinyButton>
          </div>
        </div>
      </Modal>

      {/* View Device Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Detail Perangkat">
        {selectedDevice && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center p-2 shrink-0 dark:bg-slate-800">
                {selectedDevice.image ? (
                  <img src={selectedDevice.image} alt={selectedDevice.model} className="w-full h-full object-contain" />
                ) : (
                  <DeviceIcon type={selectedDevice.type} size={32} className="text-slate-400" />
                )}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">{selectedDevice.model}</h4>
                <p className="text-sm font-medium text-blue-600">{selectedDevice.brand}</p>
                <div className="mt-2"><StatusBadge status={selectedDevice.status} /></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
              <div><p className="text-xs text-slate-500 mb-1 dark:text-slate-400">Tipe</p><p className="font-semibold text-slate-900 dark:text-white">{selectedDevice.type}</p></div>
              <div><p className="text-xs text-slate-500 mb-1 dark:text-slate-400">ID Perangkat</p><p className="font-semibold text-slate-900 dark:text-white">{selectedDevice.id}</p></div>
            </div>
            <ShinyButton onClick={() => setIsViewModalOpen(false)} className="w-full px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Tutup</ShinyButton>
          </div>
        )}
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
            <ShinyButton onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Batal</ShinyButton>
            <ShinyButton onClick={handleDeleteDevice} className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition shadow-lg shadow-rose-500/20 cursor-pointer dark:text-slate-900">Hapus</ShinyButton>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
