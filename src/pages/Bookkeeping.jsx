import { useState, useMemo } from 'react';
import { ShinyButton } from '../components/ui/shiny-button';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, DollarSign, TrendingUp, TrendingDown, Edit3, Trash2, Download } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Modal from '../components/ui/Modal';
import { formatCurrency } from '../utils/helpers';

const bookkeepingData = [
  { id: 'BK-001', date: '2026-06-11', income: 8500000, expense: 2300000, description: 'Service harian & pembelian sparepart', category: 'Harian' },
  { id: 'BK-002', date: '2026-06-10', income: 12000000, expense: 1500000, description: 'Service besar & maintenance', category: 'Harian' },
  { id: 'BK-003', date: '2026-06-09', income: 6500000, expense: 800000, description: 'Service reguler', category: 'Harian' },
  { id: 'BK-004', date: '2026-06-08', income: 15000000, expense: 3200000, description: 'Service premium & sparepart mahal', category: 'Harian' },
  { id: 'BK-005', date: '2026-06-07', income: 9200000, expense: 1800000, description: 'Service harian', category: 'Harian' },
];

const emptyForm = { date: '', income: '', expense: '', description: '' };

export default function Bookkeeping() {
  const [entries, setEntries] = useState(bookkeepingData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const summary = useMemo(() => {
    const totalIncome = entries.reduce((sum, e) => sum + e.income, 0);
    const totalExpense = entries.reduce((sum, e) => sum + e.expense, 0);
    return { totalIncome, totalExpense, netProfit: totalIncome - totalExpense };
  }, [entries]);

  const summaryCards = [
    { label: 'Total Pemasukan', value: summary.totalIncome, icon: TrendingUp, color: 'emerald' },
    { label: 'Total Pengeluaran', value: summary.totalExpense, icon: TrendingDown, color: 'red' },
    { label: 'Laba Bersih', value: summary.netProfit, icon: DollarSign, color: 'blue' },
  ];

  const colorMap = {
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', icon: 'bg-emerald-100 text-emerald-600' },
    red: { bg: 'bg-rose-100', text: 'text-rose-600', icon: 'bg-rose-100 text-rose-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'bg-blue-100 text-blue-600' },
  };

  const openAddModal = () => {
    setEditingEntry(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (entry) => {
    setEditingEntry(entry);
    setForm({ date: entry.date, income: String(entry.income), expense: String(entry.expense), description: entry.description });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEntry) {
      setEntries((prev) =>
        prev.map((item) =>
          item.id === editingEntry.id
            ? { ...item, date: form.date, income: Number(form.income), expense: Number(form.expense), description: form.description }
            : item
        )
      );
    } else {
      const newEntry = {
        id: `BK-${String(entries.length + 1).padStart(3, '0')}`,
        date: form.date,
        income: Number(form.income),
        expense: Number(form.expense),
        description: form.description,
        category: 'Harian',
      };
      setEntries((prev) => [newEntry, ...prev]);
    }
    setIsModalOpen(false);
    setForm(emptyForm);
    setEditingEntry(null);
  };

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pembukuan Harian</h1>
          <p className="text-slate-500 text-sm mt-1 dark:text-slate-400">Kelola pemasukan dan pengeluaran harian bengkel Anda</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex gap-3">
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm cursor-pointer dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-950"
          >
            <Download size={16} />
            Ekspor
          </button>
          <ShinyButton
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-blue-500/20 cursor-pointer dark:text-slate-900"
          >
            <Plus size={16} />
            Tambah Entri
          </ShinyButton>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {summaryCards.map((card, index) => {
          const colors = colorMap[card.color];
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-sm font-medium dark:text-slate-400">{card.label}</span>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.icon}`}>
                  <card.icon size={20} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${colors.text}`}>{formatCurrency(card.value)}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden dark:bg-slate-900 dark:border-slate-800"
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Riwayat Pembukuan</h2>
          <p className="text-slate-500 text-sm mt-0.5 dark:text-slate-400">Daftar transaksi harian bengkel</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="text-left text-slate-600 font-semibold px-6 py-3.5 dark:text-slate-300">Tanggal</th>
                <th className="text-right text-slate-600 font-semibold px-6 py-3.5 dark:text-slate-300">Pemasukan</th>
                <th className="text-right text-slate-600 font-semibold px-6 py-3.5 dark:text-slate-300">Pengeluaran</th>
                <th className="text-right text-slate-600 font-semibold px-6 py-3.5 dark:text-slate-300">Laba</th>
                <th className="text-left text-slate-600 font-semibold px-6 py-3.5 dark:text-slate-300">Deskripsi</th>
                <th className="text-center text-slate-600 font-semibold px-6 py-3.5 dark:text-slate-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {entries.map((entry, index) => {
                  const profit = entry.income - entry.expense;
                  return (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-slate-50/50 transition cursor-pointer"
                    >
                      <td className="px-6 py-4 text-slate-700 whitespace-nowrap dark:text-slate-200">{formatDate(entry.date)}</td>
                      <td className="px-6 py-4 text-right text-emerald-600 font-medium whitespace-nowrap">
                        {formatCurrency(entry.income)}
                      </td>
                      <td className="px-6 py-4 text-right text-rose-600 font-medium whitespace-nowrap">
                        {formatCurrency(entry.expense)}
                      </td>
                      <td className={`px-6 py-4 text-right font-semibold whitespace-nowrap ${profit >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                        {formatCurrency(profit)}
                      </td>
                      <td className="px-6 py-4 text-slate-500 max-w-[250px] truncate dark:text-slate-400">{entry.description}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditModal(entry)}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>

          {entries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 dark:text-slate-400">
              <DollarSign size={40} className="mb-3 opacity-40" />
              <p className="text-sm">Belum ada data pembukuan</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Add / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEntry ? 'Edit Entri Pembukuan' : 'Tambah Entri Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Tanggal</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition dark:bg-slate-800/40 dark:border-slate-800 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Pemasukan (Rp)</label>
              <input
                type="number"
                value={form.income}
                onChange={(e) => handleChange('income', e.target.value)}
                required
                min="0"
                placeholder="0"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition dark:bg-slate-800/40 dark:border-slate-800 dark:text-white"
              />
              {form.income > 0 && (
                <div className="mt-2 inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold tracking-wide animate-in fade-in zoom-in duration-200">
                  Rp {Number(form.income).toLocaleString('id-ID')}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Pengeluaran (Rp)</label>
              <input
                type="number"
                value={form.expense}
                onChange={(e) => handleChange('expense', e.target.value)}
                required
                min="0"
                placeholder="0"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition dark:bg-slate-800/40 dark:border-slate-800 dark:text-white"
              />
              {form.expense > 0 && (
                <div className="mt-2 inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold tracking-wide animate-in fade-in zoom-in duration-200">
                  Rp {Number(form.expense).toLocaleString('id-ID')}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              rows={3}
              placeholder="Contoh: Service harian & pembelian sparepart"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none dark:bg-slate-800/40 dark:border-slate-800 dark:text-white"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <ShinyButton
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
            >
              Batal
            </ShinyButton>
            <ShinyButton
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-blue-500/20 cursor-pointer dark:text-slate-900"
            >
              {editingEntry ? 'Simpan Perubahan' : 'Tambah Entri'}
            </ShinyButton>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
