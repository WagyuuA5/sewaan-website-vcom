import { useState, useMemo } from 'react';
import { Search, Download, Clock, Eye } from 'lucide-react';

import PageWrapper from '../components/layout/PageWrapper';
import AnimatedSearchInput from '../components/ui/AnimatedSearchInput';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { ShinyButton } from '../components/ui/shiny-button';
import { serviceData } from '../data/dummyData';
import { formatCurrency } from '../utils/helpers';

const formatFullDateTime = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

export default function ServiceHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const statuses = ['All', 'Completed', 'Cancelled'];

  const completedServices = useMemo(() => {
    return serviceData
      .filter(item => item.status === 'Completed' || item.status === 'Cancelled')
      .filter(item => {
        const matchesSearch = item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [searchQuery, filterStatus]);

  return (
    <PageWrapper
      title="Riwayat Service"
      subtitle="Lihat semua service yang telah selesai atau dibatalkan."
      actions={
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm cursor-pointer dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-950">
          <Download size={16} />
          Ekspor
        </button>
      }
    >
      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3 dark:bg-slate-900 dark:border-slate-800">
        <AnimatedSearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari riwayat service..." />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-200"
        >
          {statuses.map(s => (
            <option key={s} value={s}>{s === 'All' ? 'Semua Status' : s === 'Completed' ? 'Selesai' : 'Dibatalkan'}</option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3 dark:bg-slate-900 dark:border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Selesai</p>
            <p className="font-bold text-slate-900 dark:text-white">{serviceData.filter(s => s.status === 'Completed').length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3 dark:bg-slate-900 dark:border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Dibatalkan</p>
            <p className="font-bold text-slate-900 dark:text-white">{serviceData.filter(s => s.status === 'Cancelled').length}</p>
          </div>
        </div>
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
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Teknisi</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Biaya</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Tanggal</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completedServices.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{service.id}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-200">{service.customer}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-200">{service.device}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{service.issue}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-200">{service.technician}</td>
                  <td className="px-6 py-4"><StatusBadge status={service.status} /></td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{formatCurrency(service.cost)}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs dark:text-slate-400">{formatFullDateTime(service.createdAt)}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => { setSelectedService(service); setIsViewModalOpen(true); }} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition cursor-pointer" aria-label="Lihat"><Eye size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {completedServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 font-medium dark:text-slate-400">Belum ada riwayat service yang sesuai.</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Detail Riwayat Service">
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
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedService.location || 'Workshop Utama'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 dark:text-slate-400">Total Biaya</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatCurrency(selectedService.cost)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 dark:text-slate-400">Tanggal Selesai</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{formatFullDateTime(selectedService.createdAt)}</p>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <ShinyButton onClick={() => setIsViewModalOpen(false)} className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Tutup</ShinyButton>
            </div>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}
