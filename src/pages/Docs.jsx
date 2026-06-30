import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Rocket, ClipboardList, Package, FileText, Settings, ExternalLink } from 'lucide-react';

export default function Docs() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/settings" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Kembali ke Pengaturan
        </Link>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Dokumentasi & Panduan Pengguna</h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Pusat bantuan untuk mempelajari fitur dan navigasi V-com Website.
            </p>
          </div>

          <div className="relative max-w-xl mx-auto mb-12">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari topik bantuan..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition dark:border-slate-700 dark:bg-slate-900/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-xl border border-slate-100 bg-slate-50 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer dark:bg-slate-800/50 dark:border-slate-700/50 dark:hover:border-blue-500/50 group">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 dark:bg-blue-900/30 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Rocket size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Memulai Cepat</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Pelajari navigasi dasbor, struktur menu, dan konfigurasi awal akun Anda.</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-100 bg-slate-50 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer dark:bg-slate-800/50 dark:border-slate-700/50 dark:hover:border-blue-500/50 group">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4 dark:bg-emerald-900/30 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <ClipboardList size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Manajemen Penyewaan</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Cara membuat, melacak, dan menyelesaikan transaksi penyewaan.</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-100 bg-slate-50 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer dark:bg-slate-800/50 dark:border-slate-700/50 dark:hover:border-blue-500/50 group">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-4 dark:bg-amber-900/30 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Package size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Manajemen Inventaris</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Pantau stok perangkat, riwayat perawatan, dan status unit yang disewa.</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-100 bg-slate-50 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer dark:bg-slate-800/50 dark:border-slate-700/50 dark:hover:border-blue-500/50 group">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 dark:bg-purple-900/30 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Pembukuan & Laporan</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Panduan mencatat transaksi harian dan mengekspor laporan keuangan.</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-100 bg-slate-50 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer md:col-span-2 md:max-w-md md:mx-auto dark:bg-slate-800/50 dark:border-slate-700/50 dark:hover:border-blue-500/50 group w-full">
              <div className="w-12 h-12 bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center mb-4 dark:bg-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform">
                <Settings size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Pengaturan Akun</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Kelola profil, keamanan, notifikasi, dan preferensi tampilan.</p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
              Tidak menemukan yang Anda cari? 
              <a href="mailto:support@v-com.id" className="text-blue-600 hover:underline dark:text-blue-400 font-medium inline-flex items-center gap-1">
                Hubungi tim support kami <ExternalLink size={14} />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
