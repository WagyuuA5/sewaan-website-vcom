import { useState, useMemo } from 'react';
import { Search, Download, Clock, Eye } from 'lucide-react';

import PageWrapper from '../components/layout/PageWrapper';
import StatusBadge from '../components/ui/StatusBadge';
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
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm cursor-pointer">
          <Download size={16} />
          Ekspor
        </button>
      }
    >
      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari riwayat service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-slate-400"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
        >
          {statuses.map(s => (
            <option key={s} value={s}>{s === 'All' ? 'Semua Status' : s === 'Completed' ? 'Selesai' : 'Dibatalkan'}</option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Selesai</p>
            <p className="font-bold text-slate-900">{serviceData.filter(s => s.status === 'Completed').length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Dibatalkan</p>
            <p className="font-bold text-slate-900">{serviceData.filter(s => s.status === 'Cancelled').length}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">ID</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Pelanggan</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Perangkat</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Masalah</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Teknisi</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Status</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Biaya</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Tanggal</th>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completedServices.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900">{service.id}</td>
                  <td className="px-6 py-4 text-slate-700">{service.customer}</td>
                  <td className="px-6 py-4 text-slate-700">{service.device}</td>
                  <td className="px-6 py-4 text-slate-500">{service.issue}</td>
                  <td className="px-6 py-4 text-slate-700">{service.technician}</td>
                  <td className="px-6 py-4"><StatusBadge status={service.status} /></td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{formatCurrency(service.cost)}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{formatFullDateTime(service.createdAt)}</td>
                  <td className="px-6 py-4">
                    <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition cursor-pointer"><Eye size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {completedServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 font-medium">Belum ada riwayat service yang sesuai.</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
