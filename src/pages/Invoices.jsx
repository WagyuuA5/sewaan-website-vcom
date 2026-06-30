import { useState, useMemo } from 'react';
import { useToast } from '../components/ui/Toast';
import { ShinyButton } from '../components/ui/shiny-button';

import {
  Plus, Search, Trash2, Printer, AlertCircle, ChevronRight, FileText, CheckCircle, Clock
} from 'lucide-react';

import PageWrapper from '../components/layout/PageWrapper';
import AnimatedSearchInput from '../components/ui/AnimatedSearchInput';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import PrintDocument from '../components/ui/PrintDocument';
import { invoicesData } from '../data/dummyData';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function Invoices() {
  const { showToast } = useToast();
  const [invoices, setInvoices] = useState(invoicesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [docType, setDocType] = useState('quotation');
  
  const [formData, setFormData] = useState({ company: '', capacity: 1, cycle: 'Monthly', unitPrice: 0, date: '', dueDate: '' });

  const statuses = ['All', 'Paid', 'Pending', 'Overdue'];

  const handlePrint = () => {
    window.print();
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(item => {
      const matchesSearch = item.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, filterStatus]);

  const handleAddInvoice = () => {
    const totalAmount = formData.capacity * formData.unitPrice;
    const tax = totalAmount * 0.11;
    const finalTotal = totalAmount + tax;

    if (!formData.company || !formData.date || !formData.dueDate || formData.unitPrice <= 0) {
      showToast('Harap lengkapi semua field yang wajib diisi', 'error');
      return;
    }
    
    const newInvoice = {
      id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      ...formData,
      amount: finalTotal,
      status: 'Pending',
      items: [{ model: 'Laptop Rental Services', qty: formData.capacity, rate: formData.unitPrice }]
    };
    
    setInvoices([newInvoice, ...invoices]);
    setFormData({ company: '', capacity: 1, cycle: 'Monthly', unitPrice: 0, date: '', dueDate: '' });
    setIsAddModalOpen(false);
    showToast('Invoice berhasil dibuat', 'success');
  };

  const handleStatusChange = (id, newStatus) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, status: newStatus } : i));
    showToast('Status invoice berhasil diperbarui', 'success');
  };

  const handleDeleteInvoice = () => {
    if (selectedInvoice) {
      setInvoices(invoices.filter(i => i.id !== selectedInvoice.id));
      setIsDeleteModalOpen(false);
      setSelectedInvoice(null);
      showToast('Invoice berhasil dihapus', 'success');
    }
  };

  const openDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  return (
    <PageWrapper
      title="Manajemen Invoice"
      subtitle="Kelola invoice penyewaan untuk semua pelanggan."
      actions={
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer dark:text-slate-900">
          <Plus size={16} /> Buat Invoice
        </button>
      }
    >
      {/* Print View Container (Only visible when printing) */}
      <div className="hidden print:block absolute inset-0 bg-white z-50 dark:bg-slate-900">
        {selectedInvoice && <PrintDocument type={docType} invoiceData={selectedInvoice} />}
      </div>

      <div className="print:hidden space-y-6">
        {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3 dark:bg-slate-900 dark:border-slate-800">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600">
            <FileText size={20} />
          </div>
          <div><p className="text-xs text-slate-500 dark:text-slate-400">Total Invoice</p><p className="font-bold text-slate-900 dark:text-white">{invoices.length}</p></div>
        </div>
        {['Paid', 'Pending', 'Overdue'].map(status => {
          const count = invoices.filter(r => r.status === status).length;
          const bgColors = { Paid: 'bg-emerald-100', Pending: 'bg-amber-100', Overdue: 'bg-rose-100' };
          const textColors = { Paid: 'text-emerald-600', Pending: 'text-amber-600', Overdue: 'text-rose-600' };
          const labels = { Paid: 'Lunas', Pending: 'Tertunda', Overdue: 'Terlambat' };
          
          return (
            <div key={status} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3 dark:bg-slate-900 dark:border-slate-800">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColors[status]} ${textColors[status]}`}>
                {status === 'Paid' ? <CheckCircle size={20} /> : status === 'Pending' ? <Clock size={20} /> : <AlertCircle size={20} />}
              </div>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">{labels[status]}</p><p className="font-bold text-slate-900 dark:text-white">{count}</p></div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3 dark:bg-slate-900 dark:border-slate-800">
        <AnimatedSearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari ID invoice atau perusahaan..." />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-200">
          {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'Semua Status' : s === 'Paid' ? 'Lunas' : s === 'Pending' ? 'Tertunda' : 'Terlambat'}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden dark:bg-slate-900 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">No. Invoice</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Pelanggan</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Kapasitas</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Siklus</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Jumlah</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Tanggal</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Jatuh Tempo</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{invoice.id}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-200">{invoice.company}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-200">{invoice.capacity} Unit</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{invoice.cycle === 'Monthly' ? 'Bulanan' : invoice.cycle === 'Weekly' ? 'Mingguan' : invoice.cycle === 'Yearly' ? 'Tahunan' : 'Harian'}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{formatCurrency(invoice.amount)}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs dark:text-slate-400">{formatDate(invoice.date)}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs dark:text-slate-400">{formatDate(invoice.dueDate)}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={invoice.status}
                      onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer transition-all dark:bg-opacity-20 ${
                        invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:border-emerald-800' :
                        invoice.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 dark:border-amber-800' :
                        'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 dark:border-rose-800'
                      }`}
                    >
                      <option value="Paid">Lunas (Paid)</option>
                      <option value="Pending">Menunggu (Pending)</option>
                      <option value="Overdue">Terlambat (Overdue)</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => openDetail(invoice)} className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium text-xs cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                      Detail <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium dark:text-slate-400">Tidak ada data invoice yang ditemukan.</p>
          </div>
        )}
      </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Buat Invoice Baru">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Perusahaan/Pelanggan *</label><input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="Nama pelanggan atau perusahaan" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Kapasitas (Unit) *</label><input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Siklus Penagihan *</label><select value={formData.cycle} onChange={(e) => setFormData({ ...formData, cycle: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer dark:bg-slate-800/40 dark:border-slate-800"><option value="Daily">Harian</option><option value="Weekly">Mingguan</option><option value="Monthly">Bulanan</option><option value="Yearly">Tahunan</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Tanggal Invoice *</label><input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Jatuh Tempo *</label><input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" /></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Harga Sewa Per Unit (Rp) *</label>
            <input type="number" value={formData.unitPrice || ''} onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })} placeholder="Contoh: 500000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800" />
            {formData.unitPrice && !isNaN(formData.unitPrice) && (
              <div className="mt-2 inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold tracking-wide animate-in fade-in zoom-in duration-200">
                Rp {Number(formData.unitPrice).toLocaleString('id-ID')}
              </div>
            )}
          </div>
          
          <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 space-y-2 text-sm mt-4 dark:bg-slate-800 dark:border-slate-800">
            <div className="flex justify-between text-slate-600 dark:text-slate-300"><span>Subtotal ({formData.capacity} unit):</span> <span>{formatCurrency(formData.capacity * formData.unitPrice)}</span></div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300"><span>PPN (11%):</span> <span>{formatCurrency((formData.capacity * formData.unitPrice) * 0.11)}</span></div>
            <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 mt-2 dark:text-white dark:border-slate-800"><span>Total Tagihan:</span> <span>{formatCurrency((formData.capacity * formData.unitPrice) * 1.11)}</span></div>
          </div>
          <div className="flex gap-3 pt-4">
            <ShinyButton onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Batal</ShinyButton>
            <button onClick={handleAddInvoice} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer dark:text-slate-900">Buat Invoice</button>
          </div>
        </div>
      </Modal>

      {/* Document Viewer Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Document Viewer" size="5xl">
        {selectedInvoice && (
          <div className="flex flex-col h-[80vh]">
            <div className="flex justify-between items-center mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200 dark:bg-slate-800/40 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-600" />
                <div>
                  <p className="text-sm text-slate-500 mb-1 dark:text-slate-400">Pilih Jenis Dokumen</p>
                  <select 
                    value={docType} 
                    onChange={(e) => setDocType(e.target.value)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer dark:bg-slate-900 dark:border-slate-800"
                  >
                    <option value="quotation">Surat Penawaran Harga</option>
                    <option value="receipt">Kwitansi / Receipt</option>
                    <option value="po">Purchase Order</option>
                    <option value="recap-usage">Rekap Penggunaan Laptop</option>
                    <option value="recap-resign">Rekap Data Resign</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer dark:text-slate-900">
                  <Printer size={16} /> Cetak Dokumen
                </button>
              </div>
            </div>

            {/* Document Preview Area */}
            <div className="flex-1 overflow-y-auto bg-slate-200 p-8 rounded-xl border border-slate-300 shadow-inner flex justify-center dark:bg-slate-700 dark:border-slate-600">
              <div className={`bg-white shadow-xl ${docType.startsWith('recap') ? 'w-full max-w-6xl p-8' : 'w-[210mm] min-h-[297mm] p-12'} dark:bg-slate-900`}>
                <PrintDocument type={docType} invoiceData={selectedInvoice} />
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => { setIsDetailModalOpen(false); setIsDeleteModalOpen(true); }} className="text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 cursor-pointer">
                <Trash2 size={16} /> Hapus Data
              </button>
              <ShinyButton onClick={() => setIsDetailModalOpen(false)} className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                Tutup
              </ShinyButton>
            </div>
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
                <p className="font-semibold text-rose-900 mb-1">Hapus invoice ini?</p>
                <p className="text-sm text-rose-700">Invoice <strong>{selectedInvoice?.id}</strong> akan dihapus permanen.</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <ShinyButton onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Batal</ShinyButton>
            <ShinyButton onClick={handleDeleteInvoice} className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition shadow-lg shadow-rose-500/20 cursor-pointer dark:text-slate-900">Hapus</ShinyButton>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
