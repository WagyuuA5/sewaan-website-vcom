import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
  Wrench, Clock, DollarSign, Users, Download, Laptop, Package, FileText, CheckCircle
} from 'lucide-react';

import PageWrapper from '../components/layout/PageWrapper';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import ChartCard from '../components/ui/ChartCard';
import { useToast } from '../components/ui/Toast';
import { revenueData, serviceStatusDistribution, serviceData, recentRentals } from '../data/dummyData';
import { formatCurrency } from '../utils/helpers';

/* ── KPI stats ── */
const rentalStats = [
  { title: 'Total Unit', value: '45', change: '+5.2%', trend: 'up', icon: Laptop, color: 'from-blue-500 to-blue-600' },
  { title: 'Total Pemasukan', value: 'Rp 24.500.000', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
  { title: 'Selesai', value: '85', change: '-2', trend: 'down', icon: Package, color: 'from-violet-500 to-violet-600' },
];

const serviceStats = [
  { title: 'Total Service', value: '142', change: '+8.2%', trend: 'up', icon: Wrench, color: 'from-orange-500 to-orange-600' },
  { title: 'Total Pemasukan', value: 'Rp 18.200.000', change: '+15.2%', trend: 'up', icon: DollarSign, color: 'from-amber-500 to-amber-600' },
  { title: 'Selesai service', value: '284', change: '+12', trend: 'up', icon: CheckCircle, color: 'from-sky-500 to-sky-600' },
];

// Combine revenue data for the chart to show both
const combinedRevenueData = revenueData.map(d => ({
  month: d.month,
  rentalRevenue: d.revenue * 0.4, // dummy data split
  serviceRevenue: d.revenue * 0.6
}));

export default function Dashboard() {
  const { showToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    showToast('Memproses laporan V-COM, harap tunggu...', 'info', 2000);
    setTimeout(() => {
      setIsExporting(false);
      showToast('Laporan berhasil diunduh! (Simulasi)', 'success');
    }, 2000);
  };

  return (
    <PageWrapper
      title="Ringkasan Dashboard"
      subtitle="Pantau performa penyewaan laptop dan service perangkat Anda."
      actions={
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className={`flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm cursor-pointer ${isExporting ? 'opacity-70' : ''}`}
        >
          <Download size={16} className={isExporting ? 'animate-bounce' : ''} />
          {isExporting ? 'Mengekspor...' : 'Ekspor Laporan'}
        </button>
      }
    >
      {/* ── SEKSI PENYEWAAN ── */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Laptop size={20} className="text-blue-600" />
          Performa Penyewaan Laptop
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {rentalStats.map((s, i) => (
            <StatCard key={s.title} stat={s} index={i} />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Rental Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
            <ChartCard title="Grafik Pendapatan Sewa" subtitle="Pendapatan bulanan dari sewa laptop">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={combinedRevenueData}>
                  <defs>
                    <linearGradient id="gradRental" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis width={80} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(0)}jt`} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [formatCurrency(value), 'Pendapatan Sewa']} />
                  <Area type="monotone" dataKey="rentalRevenue" stroke="#3b82f6" strokeWidth={3} fill="url(#gradRental)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>

          {/* Recent Rentals List */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <ChartCard title="Sewa Terbaru" subtitle="Transaksi penyewaan terkini">
              <div className="space-y-4 mt-2">
                {recentRentals.slice(0, 4).map(rental => (
                  <div key={rental.id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0">
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{rental.customer}</p>
                      <p className="text-xs text-slate-500">{rental.laptop}</p>
                    </div>
                    <StatusBadge status={rental.status} />
                  </div>
                ))}
              </div>
            </ChartCard>
          </motion.div>
        </div>
      </div>

      {/* ── SEKSI SERVICE ── */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Wrench size={20} className="text-orange-600" />
          Performa Service Perangkat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {serviceStats.map((s, i) => (
            <StatCard key={s.title} stat={s} index={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Service Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
            <ChartCard title="Grafik Pendapatan Service" subtitle="Pendapatan bulanan dari perbaikan perangkat">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={combinedRevenueData}>
                  <defs>
                    <linearGradient id="gradService" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis width={80} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(0)}jt`} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [formatCurrency(value), 'Pendapatan Service']} />
                  <Area type="monotone" dataKey="serviceRevenue" stroke="#f59e0b" strokeWidth={3} fill="url(#gradService)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>

          {/* Service Status Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <ChartCard title="Status Service" subtitle="Distribusi status perbaikan saat ini">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={serviceStatusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {serviceStatusDistribution.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {serviceStatusDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
