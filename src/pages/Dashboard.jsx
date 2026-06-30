import { useState, useRef, useEffect } from 'react';
import { ShinyButton } from '../components/ui/shiny-button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Wrench, DollarSign, Download, Laptop, Package, CheckCircle, Loader2
} from 'lucide-react';
import { useDateFilterStore } from '../store/useDateFilterStore';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import PageWrapper from '../components/layout/PageWrapper';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import ChartCard from '../components/ui/ChartCard';
import ExportModal from '../components/ui/ExportModal';
import TransactionDetailModal from '../components/ui/TransactionDetailModal';
import { useToast } from '../components/ui/Toast';
import { revenueData, serviceStatusDistribution, recentRentals } from '../data/dummyData';
import { formatCurrency, exportToCSV } from '../utils/helpers';

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
  const navigate = useNavigate();
  
  // Refs for chart export
  const rentalChartRef = useRef(null);
  const serviceChartRef = useRef(null);
  const statusChartRef = useRef(null);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportData, setExportData] = useState(recentRentals);
  const [isExporting, setIsExporting] = useState(false);

  // Transaction Modal State
  const [selectedRental, setSelectedRental] = useState(null);

  // Date Filter Integration
  const { dateRange } = useDateFilterStore();
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Filtered data based on date range
  const filteredRentals = recentRentals.filter(rental => {
    if (!dateRange.startDate || !dateRange.endDate) return true;
    try {
      const rentalDate = parseISO(rental.start);
      return isWithinInterval(rentalDate, {
        start: startOfDay(dateRange.startDate),
        end: endOfDay(dateRange.endDate)
      });
    } catch {
      return true;
    }
  });

  // Simulate loading state when date changes
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [dateRange]);

  const handleExportChart = async (ref, filename) => {
    if (!ref.current) return;
    
    try {
      showToast('Sedang menyiapkan gambar...', 'info', 1500);
      
      const canvas = await html2canvas(ref.current, {
        scale: 2, // High resolution
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `${filename}_${Date.now()}.png`;
      link.click();
      
      showToast(`Berhasil mengunduh grafik ${filename}!`, 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast('Gagal mengunduh grafik.', 'error');
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    showToast('Menyiapkan laporan...', 'info', 1000);
    setTimeout(() => {
      // Export recent rentals data as CSV
      const exportData = recentRentals.map(r => ({
        ID: r.id,
        Pelanggan: r.customer,
        Perangkat: r.device,
        Tanggal_Sewa: r.date,
        Status: r.status,
        Jumlah: r.amount
      }));
      exportToCSV(exportData, `Laporan_Sewa_VCOM_${new Date().toISOString().split('T')[0]}`);
      
      setIsExporting(false);
      showToast('Laporan berhasil diunduh dalam format CSV!', 'success');
    }, 1500);
  };

  return (
    <PageWrapper
      title="Ringkasan Dashboard"
      subtitle="Pantau performa penyewaan laptop dan service perangkat Anda."
      actions={
        <ShinyButton 
          onClick={handleExport}
          disabled={isExporting}
          className={`flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm cursor-pointer ${isExporting ? 'opacity-70' : ''} dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-950`}
        >
          <Download size={16} className={isExporting ? 'animate-bounce' : ''} />
          {isExporting ? 'Mengekspor...' : 'Ekspor Laporan'}
        </ShinyButton>
      }
    >
      {/* ── SEKSI PENYEWAAN ── */}
      <div className="mb-8 relative">
        {isFiltering && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center dark:bg-slate-900/50">
            <Loader2 size={32} className="animate-spin text-blue-600 mb-2" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Memperbarui data...</p>
          </div>
        )}
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 dark:text-white">
          <Laptop size={20} className="text-blue-600" />
          Performa Penyewaan Laptop
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {rentalStats.map((s, i) => (
            <StatCard key={s.title} stat={s} index={i} />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Revenue Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
            <div ref={rentalChartRef}>
              <ChartCard 
                title="Grafik Pendapatan Sewa" 
                subtitle="Pendapatan bulanan dari sewa laptop"
                onDetail={() => showToast('Navigasi ke laporan pendapatan...', 'info')}
                onDownload={() => handleExportChart(rentalChartRef, 'Grafik_Pendapatan_Sewa')}
              >
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
            </div>
          </motion.div>

          {/* Recent Rentals List */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <ChartCard 
              title="Sewa Terbaru" 
              subtitle="Transaksi penyewaan terkini"
              onDetail={() => navigate('/rentals')}
              onDownload={() => {
                setExportData(filteredRentals);
                setIsExportModalOpen(true);
              }}
            >
              <div className="space-y-4 mt-2">
                {filteredRentals.length === 0 ? (
                  <div className="text-center py-6 text-sm text-slate-500">Tidak ada data untuk rentang waktu ini</div>
                ) : (
                  filteredRentals.slice(0, 4).map(rental => (
                  <div 
                    key={rental.id} 
                    onClick={() => setSelectedRental(rental)}
                    className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 hover:bg-slate-50 p-2 -mx-2 rounded-lg cursor-pointer transition-colors group relative dark:hover:bg-slate-950"
                  >
                    <div>
                      <p className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors dark:text-white">{rental.customer}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{rental.device}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={rental.status} />
                      <div className="hidden group-hover:flex items-center justify-center w-6 h-6 rounded-md bg-blue-100 text-blue-600">
                        <span className="sr-only">Detail</span>
                        →
                      </div>
                    </div>
                  </div>
                )))}
              </div>
            </ChartCard>
          </motion.div>
        </div>
      </div>

      {/* ── SEKSI SERVICE ── */}
      <div className="relative">
        {isFiltering && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center dark:bg-slate-900/50">
            <Loader2 size={32} className="animate-spin text-orange-600 mb-2" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Memperbarui data...</p>
          </div>
        )}
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 dark:text-white">
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
            <div ref={serviceChartRef}>
              <ChartCard 
                title="Grafik Pendapatan Service" 
                subtitle="Pendapatan bulanan dari perbaikan perangkat"
                onDetail={() => showToast('Navigasi ke laporan service...', 'info')}
                onDownload={() => handleExportChart(serviceChartRef, 'Grafik_Pendapatan_Service')}
              >
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
            </div>
          </motion.div>

          {/* Status Service Pie */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div ref={statusChartRef}>
              <ChartCard 
                title="Status Service" 
                subtitle="Distribusi status perbaikan saat ini"
                onDetail={() => showToast('Melihat detail distribusi status...', 'info')}
                onDownload={() => handleExportChart(statusChartRef, 'Distribusi_Status_Service')}
              >
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
                      <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Universal Export Modal */}
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        data={exportData} 
        title="Unduh Data Sewa Terbaru"
      />

      <TransactionDetailModal
        isOpen={!!selectedRental}
        onClose={() => setSelectedRental(null)}
        rental={selectedRental}
      />
    </PageWrapper>
  );
}
