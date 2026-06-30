import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/settings" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Kembali ke Pengaturan
        </Link>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Syarat & Ketentuan</h1>
          <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
            <p className="mb-8 text-sm opacity-70">Pembaruan Terakhir: 1 Januari 2026</p>
            
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-3">1. Ketentuan Penggunaan</h3>
            <p className="leading-relaxed mb-6">Dengan mengakses dan menggunakan sistem V-com Website, Anda menyatakan persetujuan untuk terikat oleh seluruh Syarat dan Ketentuan ini. Apabila Anda tidak menyetujui sebagian atau seluruh ketentuan yang berlaku, Anda dipersilakan untuk menghentikan penggunaan sistem kami.</p>
            
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-3">2. Kewajiban Pengguna</h3>
            <p className="leading-relaxed mb-6">Anda bertanggung jawab penuh untuk menjaga kerahasiaan kredensial akun Anda, termasuk kata sandi, serta membatasi akses ke perangkat yang Anda gunakan. Segala aktivitas yang terjadi di bawah akun Anda merupakan tanggung jawab Anda sepenuhnya.</p>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-3">3. Batasan Tanggung Jawab</h3>
            <p className="leading-relaxed mb-6">Dalam situasi dan kondisi apa pun, V-com Website tidak dapat dimintai pertanggungjawaban atas kerugian langsung, tidak langsung, insidental, atau konsekuensial yang mungkin timbul akibat penggunaan atau ketidakmampuan menggunakan sistem ini.</p>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-3">4. Hak Kekayaan Intelektual</h3>
            <p className="leading-relaxed mb-6">Seluruh konten, logo, desain antarmuka, dan kode sumber sistem V-com Website merupakan hak milik eksklusif perusahaan dan dilindungi oleh undang-undang hak cipta yang berlaku.</p>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-3">5. Perubahan Ketentuan</h3>
            <p className="leading-relaxed mb-6">Kami berhak memperbarui Syarat & Ketentuan ini sewaktu-waktu. Perubahan signifikan akan diberitahukan melalui notifikasi dalam aplikasi. Penggunaan berkelanjutan setelah perubahan dianggap sebagai persetujuan terhadap ketentuan yang baru.</p>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-3">6. Hukum yang Berlaku</h3>
            <p className="leading-relaxed mb-6">Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku di Republik Indonesia.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
