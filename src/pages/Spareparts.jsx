import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Package, Edit3, Trash2, AlertCircle, CheckCircle, XCircle,
} from 'lucide-react';

import PageWrapper from '../components/layout/PageWrapper';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { formatCurrency } from '../utils/helpers';

/* ── Mock data ── */
const initialData = [
  { id: 'SP-001', name: 'LCD Panel 14.0" FHD IPS 30 Pin', category: 'LCD / Panel Layar', stock: 15, price: 850000, status: 'Available' },
  { id: 'SP-002', name: 'Baterai Lenovo ThinkPad T480 61++', category: 'Baterai / Adaptor', stock: 8, price: 450000, status: 'Available' },
  { id: 'SP-003', name: 'Keyboard MacBook Air M1 (US Layout)', category: 'Keyboard / Touchpad', stock: 5, price: 1800000, status: 'Low Stock' },
  { id: 'SP-004', name: 'RAM SODIMM DDR4 16GB 3200MHz', category: 'RAM / Memory', stock: 24, price: 650000, status: 'Available' },
  { id: 'SP-005', name: 'SSD NVMe M.2 Samsung 980 500GB', category: 'Penyimpanan (SSD/HDD)', stock: 12, price: 750000, status: 'Available' },
  { id: 'SP-006', name: 'Kipas Pendingin (Fan) ASUS ROG Strix', category: 'Kipas / Sistem Pendingin', stock: 0, price: 350000, status: 'Out of Stock' },
  { id: 'SP-007', name: 'Engsel Casing (Hinges) HP Pavilion 14', category: 'Casing / Engsel', stock: 3, price: 250000, status: 'Low Stock' },
  { id: 'SP-008', name: 'IC Power TPS51225C', category: 'Komponen IC / Chip', stock: 50, price: 45000, status: 'Available' },
];

const categories = [
  'Semua', 
  'LCD / Panel Layar', 
  'Baterai / Adaptor', 
  'Keyboard / Touchpad', 
  'Motherboard / Mainboard', 
  'RAM / Memory', 
  'Penyimpanan (SSD/HDD)', 
  'Kipas / Sistem Pendingin', 
  'Kabel Fleksibel', 
  'Casing / Engsel', 
  'Komponen IC / Chip', 
  'Lainnya'
];
const statuses = ['Semua', 'Available', 'Low Stock', 'Out of Stock'];

const statusLabels = {
  Available: 'Tersedia',
  'Low Stock': 'Stok Rendah',
  'Out of Stock': 'Habis',
};

const emptyForm = { name: '', category: 'LCD / Panel Layar', stock: '', price: '', status: 'Available' };

export default function Spareparts() {
  const [sparepartsData, setSparepartsData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSparepart, setSelectedSparepart] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  /* ── Derived counts ── */
  const availableCount = sparepartsData.filter((s) => s.status === 'Available').length;
  const lowStockCount = sparepartsData.filter((s) => s.status === 'Low Stock').length;
  const outOfStockCount = sparepartsData.filter((s) => s.status === 'Out of Stock').length;

  /* ── Filtered data ── */
  const filteredData = useMemo(() => {
    return sparepartsData.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'Semua' || item.category === filterCategory;
      const matchesStatus = filterStatus === 'Semua' || item.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [sparepartsData, searchQuery, filterCategory, filterStatus]);

  /* ── Handlers ── */
  const handleAdd = () => {
    if (!formData.name || !formData.stock || !formData.price) {
      alert('Mohon isi semua field yang wajib');
      return;
    }
    const newId = `SP-${String(sparepartsData.length + 1).padStart(3, '0')}`;
    setSparepartsData((prev) => [
      ...prev,
      { ...formData, id: newId, stock: parseInt(formData.stock), price: parseInt(formData.price) },
    ]);
    setIsAddModalOpen(false);
    setFormData(emptyForm);
  };

  const openEditModal = (item) => {
    setSelectedSparepart(item);
    setFormData({
      name: item.name,
      category: item.category,
      stock: item.stock.toString(),
      price: item.price.toString(),
      status: item.status,
    });
    setIsEditModalOpen(true);
  };

  const handleEdit = () => {
    if (!formData.name || !formData.stock || !formData.price) {
      alert('Mohon isi semua field yang wajib');
      return;
    }
    setSparepartsData((prev) =>
      prev.map((item) =>
        item.id === selectedSparepart.id
          ? { ...item, name: formData.name, category: formData.category, stock: parseInt(formData.stock), price: parseInt(formData.price), status: formData.status }
          : item,
      ),
    );
    setIsEditModalOpen(false);
    setSelectedSparepart(null);
    setFormData(emptyForm);
  };

  const openDeleteModal = (item) => {
    setSelectedSparepart(item);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    setSparepartsData((prev) => prev.filter((item) => item.id !== selectedSparepart.id));
    setIsDeleteModalOpen(false);
    setSelectedSparepart(null);
  };

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  /* ── Stats cards data ── */
  const statsCards = [
    { label: 'Tersedia', count: availableCount, icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Stok Rendah', count: lowStockCount, icon: AlertCircle, color: 'bg-amber-100 text-amber-600' },
    { label: 'Habis', count: outOfStockCount, icon: XCircle, color: 'bg-rose-100 text-rose-600' },
  ];

  /* ── Form fields renderer ── */
  const renderFormFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Sparepart *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="cth. LCD Panel 14.0 inch FHD 30 Pin / Motherboard Lenovo T480"
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori *</label>
        <select
          value={formData.category}
          onChange={(e) => updateField('category', e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
        >
          {categories.filter((c) => c !== 'Semua').map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Stok *</label>
          <input
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => updateField('stock', e.target.value)}
            placeholder="0"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Harga (Rp) *</label>
          <input
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) => updateField('price', e.target.value)}
            placeholder="0"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
        <select
          value={formData.status}
          onChange={(e) => updateField('status', e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
        >
          {statuses.filter((s) => s !== 'Semua').map((s) => (
            <option key={s} value={s}>{statusLabels[s]}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <PageWrapper
      title="Manajemen Sparepart"
      subtitle="Kelola stok sparepart untuk kebutuhan servis dan perbaikan perangkat."
      actions={
        <button
          onClick={() => { setFormData(emptyForm); setIsAddModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          <Plus size={16} />
          Tambah Sparepart
        </button>
      }
    >
      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari sparepart berdasarkan nama atau ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-slate-400"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === 'Semua' ? 'Semua Kategori' : c}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s === 'Semua' ? 'Semua Status' : statusLabels[s]}</option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsCards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
              <card.icon size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{card.label}</p>
              <p className="font-bold text-slate-900">{card.count} item</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Nama Sparepart</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Kategori</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Stok</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Harga</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filteredData.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50/50 transition"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Package size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-slate-900">{item.stock}</td>
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-slate-900">{formatCurrency(item.price)}</td>
                    <td className="px-5 py-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item)}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <Package size={48} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 font-medium">Tidak ada sparepart yang sesuai dengan kriteria Anda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Sparepart Baru">
        {renderFormFields()}
        <div className="flex gap-3 pt-6">
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            Tambah Sparepart
          </button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Sparepart">
        {renderFormFields()}
        <div className="flex gap-3 pt-6">
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleEdit}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            Simpan Perubahan
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Konfirmasi Hapus">
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-900 mb-1">Apakah Anda yakin ingin menghapus sparepart ini?</p>
                <p className="text-sm text-rose-700">
                  <strong>{selectedSparepart?.name}</strong> ({selectedSparepart?.id}) akan dihapus secara permanen dari daftar sparepart. Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition shadow-lg shadow-rose-500/20 cursor-pointer"
            >
              Hapus Sparepart
            </button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
