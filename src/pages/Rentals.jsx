import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, Filter, Eye, Edit3, Trash2, AlertCircle, Clock, Laptop
} from 'lucide-react';

import PageWrapper from '../components/layout/PageWrapper';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { recentRentals, invoicesData } from '../data/dummyData';
import { formatCurrency, calculateDaysBetween, formatDate } from '../utils/helpers';

export default function Rentals() {
  const [rentals, setRentals] = useState(recentRentals);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  
  const [formData, setFormData] = useState({ 
    customer: '', laptop: '', start: '', end: '', status: 'Pending', amount: '', location: '' 
  });

  const statuses = ['All', 'Active', 'Pending', 'Overdue', 'Completed'];

  const filteredRentals = useMemo(() => {
    return rentals.filter(item => {
      const matchesSearch = item.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.laptop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [rentals, searchQuery, filterStatus]);

  const handleAddRental = () => {
    if (!formData.customer || !formData.laptop || !formData.start || !formData.end || !formData.amount) return;
    
    const newRental = {
      id: `REN-${String(rentals.length + 1).padStart(3, '0')}`,
      ...formData,
      amount: Number(formData.amount),
      location: formData.location || 'Kantor Pusat'
    };
    
    // Also push to invoices dummy data (in a real app this would hit an API)
    invoicesData.push({
      id: `INV-2026-${String(invoicesData.length + 1).padStart(3, '0')}`,
      company: formData.customer,
      capacity: 1,
      cycle: calculateDaysBetween(formData.start, formData.end) > 14 ? 'Monthly' : 'Weekly',
      amount: Number(formData.amount),
      date: new Date().toISOString().split('T')[0],
      dueDate: formData.start,
      status: 'Pending',
      items: [{ model: formData.laptop, qty: 1, rate: Number(formData.amount) }]
    });

    setRentals([newRental, ...rentals]);
    setFormData({ customer: '', laptop: '', start: '', end: '', amount: '', status: 'Pending', location: '' });
    setIsAddModalOpen(false);
  };

  const handleDeleteRental = () => {
    if (selectedRental) {
      setRentals(rentals.filter(r => r.id !== selectedRental.id));
      setIsDeleteModalOpen(false);
      setSelectedRental(null);
    }
  };

  return (
    <PageWrapper
      title="Manajemen Penyewaan"
      subtitle="Kelola semua penyewaan laptop aktif dan riwayatnya."
      actions={
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer">
          <Plus size={16} /> Buat Penyewaan
        </button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Active', 'Pending', 'Overdue', 'Completed'].map(status => {
          const count = rentals.filter(r => r.status === status).length;
          const bgColors = { Active: 'bg-emerald-100', Pending: 'bg-amber-100', Overdue: 'bg-rose-100', Completed: 'bg-slate-100' };
          const textColors = { Active: 'text-emerald-600', Pending: 'text-amber-600', Overdue: 'text-rose-600', Completed: 'text-slate-600' };
          const labels = { Active: 'Aktif', Pending: 'Tertunda', Overdue: 'Terlambat', Completed: 'Selesai' };
          
          return (
            <div key={status} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColors[status]} ${textColors[status]}`}>
                {status === 'Active' ? <Laptop size={20} /> : status === 'Completed' ? <Clock size={20} /> : <AlertCircle size={20} />}
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
          <input type="text" placeholder="Cari ID sewa, pelanggan, atau perangkat..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-slate-400" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer">
          {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'Semua Status' : s === 'Active' ? 'Aktif' : s === 'Pending' ? 'Tertunda' : s === 'Overdue' ? 'Terlambat' : 'Selesai'}</option>)}
        </select>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer">
          <Filter size={16} /> Filter Lanjutan
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">ID Sewa</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Pelanggan</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Perangkat</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Periode</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Lokasi</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Status</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Jumlah</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900">{rental.id}</td>
                  <td className="px-6 py-4 text-slate-700">{rental.customer}</td>
                  <td className="px-6 py-4 text-slate-700">{rental.laptop}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    <div>{formatDate(rental.start)}</div>
                    <div className="text-slate-400">s/d {formatDate(rental.end)}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{rental.location || 'Kantor Pusat'}</td>
                  <td className="px-6 py-4"><StatusBadge status={rental.status} /></td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{formatCurrency(rental.amount)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition cursor-pointer"><Eye size={14} /></button>
                      <button className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg transition cursor-pointer"><Edit3 size={14} /></button>
                      <button onClick={() => { setSelectedRental(rental); setIsDeleteModalOpen(true); }} className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition cursor-pointer"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRentals.length === 0 && (
          <div className="text-center py-12">
            <Laptop size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Tidak ada data penyewaan yang ditemukan.</p>
          </div>
        )}
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>Menampilkan {filteredRentals.length} entri</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer">Sebelumnya</button>
            <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium cursor-pointer">1</button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer">Selanjutnya</button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Buat Penyewaan Baru">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Pelanggan *</label><input type="text" value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} placeholder="Nama pelanggan atau perusahaan" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Perangkat Laptop *</label><input type="text" value={formData.laptop} onChange={(e) => setFormData({ ...formData, laptop: e.target.value })} placeholder="e.g. MacBook Pro 16" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Mulai Sewa *</label><input type="date" value={formData.start} onChange={(e) => setFormData({ ...formData, start: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Selesai Sewa *</label><input type="date" value={formData.end} onChange={(e) => setFormData({ ...formData, end: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Harga Sewa (Rp) *</label><input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="Total tagihan" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Lokasi/Cabang *</label><input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Cth: Kantor Pusat, Cabang Bekasi..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" /></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Status *</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"><option value="Pending">Tertunda</option><option value="Active">Aktif</option></select></div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer">Batal</button>
            <button onClick={handleAddRental} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer">Simpan & Buat Invoice</button>
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
                <p className="font-semibold text-rose-900 mb-1">Hapus penyewaan ini?</p>
                <p className="text-sm text-rose-700">Penyewaan <strong>{selectedRental?.id}</strong> untuk {selectedRental?.customer} akan dihapus.</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer">Batal</button>
            <button onClick={handleDeleteRental} className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition shadow-lg shadow-rose-500/20 cursor-pointer">Hapus</button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
