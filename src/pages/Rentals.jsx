import { useState, useMemo } from 'react';
import { useToast } from '../components/ui/Toast';
import { ShinyButton } from '../components/ui/shiny-button';
import {
  Plus, Search, Filter, Eye, Edit3, Trash2, AlertCircle, Clock, Laptop, ExternalLink
} from 'lucide-react';

import PageWrapper from '../components/layout/PageWrapper';
import StatusBadge from '../components/ui/StatusBadge';
import AnimatedSearchInput from '../components/ui/AnimatedSearchInput';
import Modal from '../components/ui/Modal';
import LocationPickerField from '../components/ui/LocationPickerField';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis, PaginationPrevious, PaginationNext } from '../components/ui/pagination';
import { usePagination } from '../components/hooks/use-pagination';
import { recentRentals, invoicesData } from '../data/dummyData';
import { formatCurrency, calculateDaysBetween, formatDate } from '../utils/helpers';
import { useEffect } from 'react';

export default function Rentals() {
  const { showToast } = useToast();
  const [rentals, setRentals] = useState(recentRentals);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  
  const [formData, setFormData] = useState({ 
    customer: '', laptop: '', start: '', end: '', status: 'Pending', amount: '', location: '' 
  });
  const [editData, setEditData] = useState({ 
    customer: '', laptop: '', start: '', end: '', status: 'Pending', amount: '', location: '' 
  });

  const statuses = ['All', 'Active', 'Pending', 'Overdue', 'Completed'];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredRentals = useMemo(() => {
    return rentals.filter(item => {
      const matchesSearch = item.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.laptop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [rentals, searchQuery, filterStatus]);

  useEffect(() => {
    // eslint-disable-next-line
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredRentals.length / itemsPerPage));
  const paginatedRentals = filteredRentals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay: 5,
  });

  const handleAddRental = () => {
    if (!formData.customer || !formData.laptop || !formData.start || !formData.end || !formData.amount) {
      showToast('Harap lengkapi semua field yang wajib diisi', 'error');
      return;
    }
    
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
    showToast('Data penyewaan berhasil ditambahkan', 'success');
  };

  const handleDeleteRental = () => {
    if (selectedRental) {
      setRentals(rentals.filter(r => r.id !== selectedRental.id));
      setIsDeleteModalOpen(false);
      setSelectedRental(null);
      showToast('Data penyewaan berhasil dihapus', 'success');
    }
  };

  const handleEditRental = () => {
    if (!editData.customer || !editData.laptop || !editData.start || !editData.end || !editData.amount) {
      showToast('Harap lengkapi semua field yang wajib diisi', 'error');
      return;
    }
    
    setRentals(rentals.map(r => r.id === selectedRental.id ? { ...r, ...editData, amount: Number(editData.amount) } : r));
    setIsEditModalOpen(false);
    setSelectedRental(null);
    showToast('Data penyewaan berhasil diperbarui', 'success');
  };

  const handleStatusChange = (id, newStatus) => {
    setRentals(rentals.map(r => r.id === id ? { ...r, status: newStatus } : r));
    showToast('Status penyewaan berhasil diperbarui', 'success');
  };

  return (
    <PageWrapper
      title="Manajemen Penyewaan"
      subtitle="Kelola semua penyewaan laptop aktif dan riwayatnya."
      actions={
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer dark:text-slate-900">
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
            <div key={status} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3 dark:bg-slate-900 dark:border-slate-800">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColors[status]} ${textColors[status]}`}>
                {status === 'Active' ? <Laptop size={20} /> : status === 'Completed' ? <Clock size={20} /> : <AlertCircle size={20} />}
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
        <AnimatedSearchInput 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          placeholder="Cari ID sewa, pelanggan, atau perangkat..." 
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-200">
          {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'Semua Status' : s === 'Active' ? 'Aktif' : s === 'Pending' ? 'Tertunda' : s === 'Overdue' ? 'Terlambat' : 'Selesai'}</option>)}
        </select>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800">
          <Filter size={16} /> Filter Lanjutan
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden dark:bg-slate-900 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">ID Sewa</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Pelanggan</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Perangkat</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Periode</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Lokasi</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Jumlah</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{rental.id}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-200">{rental.customer}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-200">{rental.laptop}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs dark:text-slate-400">
                    <div>{formatDate(rental.start)}</div>
                    <div className="text-slate-400">s/d {formatDate(rental.end)}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    <span>
                      {typeof rental.location === 'object'
                        ? rental.location?.label
                        : rental.location || 'Kantor Pusat'}
                    </span>
                    {(() => {
                      const loc = rental.location;
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
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block group hover:scale-105 transition-transform duration-200">
                      <select
                        value={rental.status}
                        onChange={(e) => handleStatusChange(rental.id, e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        title="Ubah Status"
                      >
                        <option value="Active">Aktif</option>
                        <option value="Pending">Menunggu</option>
                        <option value="Overdue">Terlambat</option>
                        <option value="Completed">Selesai</option>
                      </select>
                      <StatusBadge status={rental.status} />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{formatCurrency(rental.amount)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button onClick={() => { setSelectedRental(rental); setIsViewModalOpen(true); }} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition cursor-pointer" aria-label="Lihat"><Eye size={14} /></button>
                      <button onClick={() => { setSelectedRental(rental); setEditData(rental); setIsEditModalOpen(true); }} className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg transition cursor-pointer" aria-label="Edit"><Edit3 size={14} /></button>
                      <button onClick={() => { setSelectedRental(rental); setIsDeleteModalOpen(true); }} className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition cursor-pointer" aria-label="Hapus"><Trash2 size={14} /></button>
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
            <p className="text-slate-500 font-medium dark:text-slate-400">Tidak ada data penyewaan yang ditemukan.</p>
          </div>
        )}
        
        {filteredRentals.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span>Menampilkan {(currentPage - 1) * itemsPerPage + 1} hingga {Math.min(currentPage * itemsPerPage, filteredRentals.length)} dari {filteredRentals.length} entri</span>
            
            <Pagination className="w-auto mx-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>

                {showLeftEllipsis && (
                  <>
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  </>
                )}

                {pages.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {showRightEllipsis && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Buat Penyewaan Baru">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Pelanggan *</label><input type="text" value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} placeholder="Nama pelanggan atau perusahaan" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Perangkat Laptop *</label><input type="text" value={formData.laptop} onChange={(e) => setFormData({ ...formData, laptop: e.target.value })} placeholder="e.g. MacBook Pro 16" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Mulai Sewa *</label><input type="date" value={formData.start} onChange={(e) => setFormData({ ...formData, start: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Selesai Sewa *</label><input type="date" value={formData.end} onChange={(e) => setFormData({ ...formData, end: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Harga Sewa (Rp) *</label>
              <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="Total tagihan" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" />
              {formData.amount && !isNaN(formData.amount) && (
                <div className="mt-2 inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold tracking-wide animate-in fade-in zoom-in duration-200">
                  Rp {Number(formData.amount).toLocaleString('id-ID')}
                </div>
              )}
            </div>
            <div>
              <LocationPickerField
                label="Lokasi/Cabang *"
                value={formData.location}
                onChange={(loc) => setFormData({ ...formData, location: loc })}
                placeholder="Cth: Kantor Pusat, Cabang Bekasi..."
              />
            </div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Status *</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer dark:bg-slate-800/40 dark:border-slate-800"><option value="Pending">Tertunda</option><option value="Active">Aktif</option></select></div>
          <div className="flex gap-3 pt-4">
            <ShinyButton onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Batal</ShinyButton>
            <ShinyButton onClick={handleAddRental} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer dark:text-slate-900">Simpan & Buat Invoice</ShinyButton>
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
            <ShinyButton onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Batal</ShinyButton>
            <ShinyButton onClick={handleDeleteRental} className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition shadow-lg shadow-rose-500/20 cursor-pointer dark:text-slate-900">Hapus</ShinyButton>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Detail Penyewaan">
        {selectedRental && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider dark:text-slate-400">ID Penyewaan</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{selectedRental.id}</p>
              </div>
              <StatusBadge status={selectedRental.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 dark:text-slate-400">Pelanggan</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedRental.customer}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 dark:text-slate-400">Perangkat Laptop</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedRental.laptop}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 dark:text-slate-400">Periode Sewa</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {formatDate(selectedRental.start)} <span className="text-slate-400 font-normal">s/d</span> {formatDate(selectedRental.end)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 dark:text-slate-400">Durasi Penyewaan</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{calculateDaysBetween(selectedRental.start, selectedRental.end)} Hari</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 dark:text-slate-400">Lokasi / Cabang</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {typeof selectedRental.location === 'object'
                    ? selectedRental.location?.label
                    : selectedRental.location || 'Kantor Pusat'}
                </p>
                {(() => {
                  const loc = selectedRental.location;
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
                <p className="text-xs text-slate-500 font-medium mb-1 dark:text-slate-400">Total Harga</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatCurrency(selectedRental.amount)}</p>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <ShinyButton onClick={() => setIsViewModalOpen(false)} className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Tutup</ShinyButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Penyewaan">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Pelanggan *</label><input type="text" value={editData.customer} onChange={(e) => setEditData({ ...editData, customer: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Perangkat Laptop *</label><input type="text" value={editData.laptop} onChange={(e) => setEditData({ ...editData, laptop: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Mulai Sewa *</label><input type="date" value={editData.start} onChange={(e) => setEditData({ ...editData, start: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Selesai Sewa *</label><input type="date" value={editData.end} onChange={(e) => setEditData({ ...editData, end: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Harga Sewa (Rp) *</label>
              <input type="number" value={editData.amount} onChange={(e) => setEditData({ ...editData, amount: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" />
            </div>
            <div>
              <LocationPickerField
                label="Lokasi/Cabang *"
                value={editData.location}
                onChange={(loc) => setEditData({ ...editData, location: loc })}
                placeholder="Pilih lokasi cabang..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Status *</label>
            <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer dark:bg-slate-800/40 dark:border-slate-800">
              <option value="Pending">Tertunda (Pending)</option>
              <option value="Active">Berjalan (Active)</option>
              <option value="Overdue">Terlambat (Overdue)</option>
              <option value="Completed">Selesai (Completed)</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <ShinyButton onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Batal</ShinyButton>
            <ShinyButton onClick={handleEditRental} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-orange-500/20 cursor-pointer dark:text-slate-900">Simpan Perubahan</ShinyButton>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
