import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Eye, Edit3, Trash2, Download, Printer, Send, AlertCircle, ChevronRight, FileText, CheckCircle, Clock
} from 'lucide-react';

import PageWrapper from '../components/layout/PageWrapper';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import PrintDocument from '../components/ui/PrintDocument';
import { invoicesData } from '../data/dummyData';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function Invoices() {
  const [invoices, setInvoices] = useState(invoicesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [docType, setDocType] = useState('quotation');
  
  const [formData, setFormData] = useState({ company: '', capacity: 1, cycle: 'Monthly', amount: '', date: '', dueDate: '' });

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
    if (!formData.company || !formData.amount || !formData.date || !formData.dueDate) return;
    
    const newInvoice = {
      id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      ...formData,
      amount: Number(formData.amount),
      status: 'Pending',
      items: [{ model: 'Laptop Rental Services', qty: formData.capacity, rate: Number(formData.amount) / formData.capacity }]
    };
    
    setInvoices([newInvoice, ...invoices]);
    setFormData({ company: '', capacity: 1, cycle: 'Monthly', amount: '', date: '', dueDate: '' });
    setIsAddModalOpen(false);
  };

  const handleDeleteInvoice = () => {
    if (selectedInvoice) {
      setInvoices(invoices.filter(i => i.id !== selectedInvoice.id));
      setIsDeleteModalOpen(false);
      setSelectedInvoice(null);
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
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer">
          <Plus size={16} /> Buat Invoice
        </button>
      }
    >
      {/* Print View Container (Only visible when printing) */}
      <div className="hidden print:block absolute inset-0 bg-white z-50">
        {selectedInvoice && <PrintDocument type={docType} invoiceData={selectedInvoice} />}
      </div>

      <div className="print:hidden space-y-6">
        {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600">
            <FileText size={20} />
          </div>
          <div><p className="text-xs text-slate-500">Total Invoice</p><p className="font-bold text-slate-900">{invoices.length}</p></div>
        </div>
        {['Paid', 'Pending', 'Overdue'].map(status => {
          const count = invoices.filter(r => r.status === status).length;
          const bgColors = { Paid: 'bg-emerald-100', Pending: 'bg-amber-100', Overdue: 'bg-rose-100' };
          const textColors = { Paid: 'text-emerald-600', Pending: 'text-amber-600', Overdue: 'text-rose-600' };
          const labels = { Paid: 'Lunas', Pending: 'Tertunda', Overdue: 'Terlambat' };
          
          return (
            <div key={status} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColors[status]} ${textColors[status]}`}>
                {status === 'Paid' ? <CheckCircle size={20} /> : status === 'Pending' ? <Clock size={20} /> : <AlertCircle size={20} />}
              </div>
              <div><p className="text-xs text-slate-500">{labels[status]}</p><p className="font-bold text-slate-900">{count}</p></div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input type="text" placeholder="Cari ID invoice atau perusahaan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-slate-400" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer">
          {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'Semua Status' : s === 'Paid' ? 'Lunas' : s === 'Pending' ? 'Tertunda' : 'Terlambat'}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">No. Invoice</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Pelanggan</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Kapasitas</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Siklus</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Jumlah</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Tanggal</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Jatuh Tempo</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Status</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900">{invoice.id}</td>
                  <td className="px-6 py-4 text-slate-700">{invoice.company}</td>
                  <td className="px-6 py-4 text-slate-700">{invoice.capacity} Unit</td>
                  <td className="px-6 py-4 text-slate-500">{invoice.cycle === 'Monthly' ? 'Bulanan' : invoice.cycle === 'Weekly' ? 'Mingguan' : invoice.cycle === 'Yearly' ? 'Tahunan' : 'Harian'}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{formatCurrency(invoice.amount)}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{formatDate(invoice.date)}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{formatDate(invoice.dueDate)}</td>
                  <td className="px-6 py-4"><StatusBadge status={invoice.status} /></td>
                  <td className="px-6 py-4">
                    <button onClick={() => openDetail(invoice)} className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium text-xs cursor-pointer">
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
            <p className="text-slate-500 font-medium">Tidak ada data invoice yang ditemukan.</p>
          </div>
        )}
      </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Buat Invoice Baru">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Perusahaan/Pelanggan *</label><input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="Nama pelanggan atau perusahaan" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Kapasitas (Unit) *</label><input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Siklus Penagihan *</label><select value={formData.cycle} onChange={(e) => setFormData({ ...formData, cycle: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"><option value="Daily">Harian</option><option value="Weekly">Mingguan</option><option value="Monthly">Bulanan</option><option value="Yearly">Tahunan</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal Invoice *</label><input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Jatuh Tempo *</label><input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" /></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Total Tagihan (Rp) *</label><input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="Total tagihan" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" /></div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer">Batal</button>
            <button onClick={handleAddInvoice} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer">Buat Invoice</button>
          </div>
        </div>
      </Modal>

      {/* Document Viewer Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Document Viewer" size="5xl">
        {selectedInvoice && (
          <div className="flex flex-col h-[80vh]">
            <div className="flex justify-between items-center mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-600" />
                <div>
                  <p className="text-sm text-slate-500 mb-1">Pilih Jenis Dokumen</p>
                  <select 
                    value={docType} 
                    onChange={(e) => setDocType(e.target.value)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
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
                <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer">
                  <Printer size={16} /> Cetak Dokumen
                </button>
              </div>
            </div>

            {/* Document Preview Area */}
            <div className="flex-1 overflow-y-auto bg-slate-200 p-8 rounded-xl border border-slate-300 shadow-inner flex justify-center">
              <div className={`bg-white shadow-xl ${docType.startsWith('recap') ? 'w-full max-w-6xl p-8' : 'w-[210mm] min-h-[297mm] p-12'}`}>
                <PrintDocument type={docType} invoiceData={selectedInvoice} />
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-100">
              <button onClick={() => { setIsDetailModalOpen(false); setIsDeleteModalOpen(true); }} className="text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 cursor-pointer">
                <Trash2 size={16} /> Hapus Data
              </button>
              <button onClick={() => setIsDetailModalOpen(false)} className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer">
                Tutup
              </button>
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
            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer">Batal</button>
            <button onClick={handleDeleteInvoice} className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition shadow-lg shadow-rose-500/20 cursor-pointer">Hapus</button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
