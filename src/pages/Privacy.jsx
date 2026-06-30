import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/settings" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Kembali ke Pengaturan
        </Link>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Kebijakan Privasi</h1>
          <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
            <p className="mb-8 text-sm opacity-70">Pembaruan Terakhir: 1 Januari 2026</p>
            
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-3">1. Pengumpulan Data</h3>
            <p className="leading-relaxed mb-6">Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, seperti saat Anda membuat akun, memperbarui profil, atau menggunakan fitur-fitur dasbor (termasuk pemilihan lokasi pada peta).</p>
            
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-3">2. Penggunaan Informasi</h3>
            <p className="leading-relaxed mb-6">Informasi yang kami kumpulkan digunakan untuk menyediakan, memelihara, dan meningkatkan layanan kami. Data lokasi, jika diberikan, digunakan murni untuk sinkronisasi antarcabang operasional.</p>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-3">3. Keamanan Data</h3>
            <p className="leading-relaxed mb-6">Kami mengambil langkah-langkah wajar untuk membantu melindungi informasi tentang Anda dari kehilangan, pencurian, penyalahgunaan, dan akses tanpa izin.</p>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-3">4. Hak Pengguna atas Data</h3>
            <p className="leading-relaxed mb-6">Anda memiliki hak untuk mengakses, mengekspor, memperbarui, atau menghapus data pribadi Anda kapan saja melalui menu Pengaturan &gt; Data & Privasi. Permintaan penghapusan akun bersifat permanen dan tidak dapat dibatalkan.</p>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-3">5. Penyimpanan Data</h3>
            <p className="leading-relaxed mb-6">Data preferensi dan profil disimpan secara lokal pada perangkat Anda (local storage) untuk pengalaman yang responsif, serta disinkronkan ke server kami untuk keperluan backup dan akses multi-perangkat.</p>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-3">6. Cookie & Pelacakan</h3>
            <p className="leading-relaxed mb-6">Kami dapat menggunakan teknologi penyimpanan lokal untuk mengingat preferensi tampilan (seperti mode gelap dan ukuran font) tanpa melibatkan pelacakan pihak ketiga untuk tujuan periklanan.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
