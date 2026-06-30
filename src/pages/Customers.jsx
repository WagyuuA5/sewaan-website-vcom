import { useState, useMemo } from 'react';
import { useToast } from '../components/ui/Toast';
import { ShinyButton } from '../components/ui/shiny-button';
import { motion } from 'framer-motion';
import {
  Search, Mail, Phone, Calendar, UserPlus,
  Trash2, AlertCircle
} from 'lucide-react';

import PageWrapper from '../components/layout/PageWrapper';
import AnimatedSearchInput from '../components/ui/AnimatedSearchInput';
import Modal from '../components/ui/Modal';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis, PaginationPrevious, PaginationNext } from '../components/ui/pagination';
import { usePagination } from '../components/hooks/use-pagination';
import { customersData as initialCustomers } from '../data/dummyData';
import { formatCurrency } from '../utils/helpers';
import { useEffect } from 'react';

export default function Customers() {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 6 cards per page

  const filteredCustomers = useMemo(() => {
    return customers.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  useEffect(() => {
    // eslint-disable-next-line
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage));
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay: 5,
  });

  const handleAddCustomer = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      showToast('Harap lengkapi semua field yang wajib diisi', 'error');
      return;
    }
    const newCustomer = {
      id: `CUS-${String(customers.length + 1).padStart(3, '0')}`,
      ...formData,
      totalServices: 0,
      totalSpent: 0,
      joined: new Date().toISOString().split('T')[0],
    };
    setCustomers([newCustomer, ...customers]);
    setFormData({ name: '', email: '', phone: '' });
    setIsAddModalOpen(false);
    showToast('Pelanggan berhasil ditambahkan', 'success');
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      setCustomers(customers.filter(c => c.id !== selectedCustomer.id));
      setIsDeleteModalOpen(false);
      setSelectedCustomer(null);
      showToast('Pelanggan berhasil dihapus', 'success');
    }
  };

  return (
    <PageWrapper
      title="Data Pelanggan"
      subtitle="Kelola data pelanggan dan riwayat service."
      actions={
        <ShinyButton onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer dark:text-slate-900">
          <UserPlus size={16} /> Tambah Pelanggan
        </ShinyButton>
      }
    >
      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
        <AnimatedSearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari nama atau email pelanggan..." />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {paginatedCustomers.map((customer, idx) => (
          <motion.div key={customer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg dark:text-slate-900">
                  {customer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div><h4 className="font-bold text-slate-900 dark:text-white">{customer.name}</h4><p className="text-xs text-slate-500 dark:text-slate-400">{customer.id}</p></div>
              </div>
              <button onClick={() => { setSelectedCustomer(customer); setIsDeleteModalOpen(true); }} className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition cursor-pointer">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="space-y-2.5 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Mail size={14} className="text-slate-400" /> {customer.email}</div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Phone size={14} className="text-slate-400" /> {customer.phone}</div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Calendar size={14} className="text-slate-400" /> Bergabung {customer.joined}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div><p className="text-xs text-slate-500 dark:text-slate-400">Total Service</p><p className="font-bold text-slate-900 dark:text-white">{customer.totalServices}</p></div>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">Total Pengeluaran</p><p className="font-bold text-slate-900 text-xs dark:text-white">{formatCurrency(customer.totalSpent)}</p></div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
          <p className="text-slate-500 font-medium dark:text-slate-400">Tidak ada pelanggan yang sesuai.</p>
        </div>
      )}

      {filteredCustomers.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 mt-6 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
          <span>Menampilkan {(currentPage - 1) * itemsPerPage + 1} hingga {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} dari {filteredCustomers.length} pelanggan</span>
          
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

      {/* Add Customer Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Pelanggan Baru">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Nama Lengkap *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nama pelanggan" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@contoh.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Telepon *</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+62 812-xxxx-xxxx" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" /></div>
          <div className="flex gap-3 pt-4">
            <ShinyButton onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Batal</ShinyButton>
            <ShinyButton onClick={handleAddCustomer} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer dark:text-slate-900">Tambah Pelanggan</ShinyButton>
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
                <p className="font-semibold text-rose-900 mb-1">Hapus pelanggan ini?</p>
                <p className="text-sm text-rose-700"><strong>{selectedCustomer?.name}</strong> akan dihapus secara permanen.</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <ShinyButton onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Batal</ShinyButton>
            <ShinyButton onClick={handleDeleteCustomer} className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition cursor-pointer dark:text-slate-900">Hapus</ShinyButton>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
