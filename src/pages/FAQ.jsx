import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const faqData = [
  {
    category: "Akun & Profil",
    items: [
      {
        q: "Bagaimana cara memperbarui foto profil dan bio saya?",
        a: "Anda dapat memperbarui foto profil dan bio melalui menu Pengaturan > Profil Saya. Klik ikon kamera pada foto profil untuk mengganti foto, dan ubah isian bio pada form yang disediakan."
      },
      {
        q: "Bagaimana cara menambahkan tautan media sosial ke profil saya?",
        a: "Di halaman Profil Saya, gulir ke bagian bawah untuk menemukan 'Tautan Sosial Media'. Klik tombol '+ Tambah Sosial Media Baru' dan pilih platform yang diinginkan."
      }
    ]
  },
  {
    category: "Keamanan",
    items: [
      {
        q: "Bagaimana cara mereset kata sandi?",
        a: "Buka menu Pengaturan > Keamanan, lalu masukkan kata sandi lama Anda diikuti dengan kata sandi baru. Pastikan indikator kekuatan sandi menunjukkan status 'Kuat'."
      },
      {
        q: "Apa yang terjadi jika saya memilih 'Logout dari semua perangkat'?",
        a: "Sesi aktif Anda di semua perangkat lain (komputer, tablet, atau ponsel) akan diakhiri seketika. Anda hanya akan tetap login pada perangkat yang sedang Anda gunakan saat ini."
      }
    ]
  },
  {
    category: "Tampilan & Preferensi",
    items: [
      {
        q: "Bagaimana cara mengaktifkan Dark Mode?",
        a: "Anda dapat mengubah preferensi tampilan di menu Pengaturan > Preferensi Tampilan, atau melalui menu profil di sudut kanan atas layar."
      },
      {
        q: "Bagaimana cara mengubah ukuran teks aplikasi?",
        a: "Anda dapat mengubah ukuran teks melalui menu Pengaturan > Preferensi Tampilan. Pilih ukuran font pada menu tarik-turun (dropdown) yang tersedia."
      },
      {
        q: "Apakah saya bisa mematikan animasi antarmuka?",
        a: "Ya, Anda dapat menonaktifkan animasi antarmuka di Pengaturan > Preferensi Tampilan dengan mematikan sakelar (toggle) 'Animasi Antarmuka'."
      }
    ]
  },
  {
    category: "Data & Privasi",
    items: [
      {
        q: "Apakah data saya aman?",
        a: "Ya. V-com Website mengimplementasikan standar keamanan industri terkini termasuk Autentikasi Dua Langkah (2FA) dan enkripsi kata sandi end-to-end."
      },
      {
        q: "Bagaimana cara mengekspor data saya?",
        a: "Buka menu Pengaturan > Data & Privasi, lalu klik tombol 'Ekspor Data Saya (JSON)' untuk mengunduh semua data profil dan preferensi Anda."
      },
      {
        q: "Apa perbedaan 'Hapus Data Lokal' dan 'Hapus Akun Permanen'?",
        a: "'Hapus Data Lokal' hanya menghapus cache dan pengaturan sementara di perangkat ini. 'Hapus Akun Permanen' akan menghapus seluruh data Anda dari sistem dan tindakan ini tidak dapat dibatalkan."
      }
    ]
  },
  {
    category: "Lokasi",
    items: [
      {
        q: "Bagaimana cara mengubah lokasi/area domisili saya?",
        a: "Buka menu Pengaturan > Profil Saya, lalu pada form 'Lokasi / Area Domisili', klik baris isian tersebut untuk membuka jendela peta interaktif dan memilih lokasi baru Anda."
      }
    ]
  }
];

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 dark:border-slate-700/60 last:border-0 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-medium text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
      >
        <span className="pr-4">{question}</span>
        <ChevronDown 
          size={18} 
          className={`text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default function FAQ() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/settings" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Kembali ke Pengaturan
        </Link>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <h1 className="text-3xl font-bold mb-8 text-blue-600 dark:text-blue-400">Pertanyaan Umum (FAQ)</h1>
          
          <div className="space-y-8">
            {faqData.map((category, idx) => (
              <div key={idx}>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                  {category.category}
                </h2>
                <div className="flex flex-col">
                  {category.items.map((item, itemIdx) => (
                    <AccordionItem key={itemIdx} question={item.q} answer={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
