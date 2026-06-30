import { useState } from 'react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { recapUsageData, recapResignData } from '../../data/dummyData';
import { useSettingsStore } from '../../store/useSettingsStore';

export default function PrintDocument({ type, invoiceData }) {
  const { branding } = useSettingsStore();
  const [logo, setLogo] = useState(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setLogo(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-8 border-b-2 border-blue-600 pb-4">
      <div className="flex-1">
        {logo ? (
          <img src={logo} alt="Company Logo" className="h-16 object-contain" />
        ) : (
          <div className="group relative h-16 w-48 flex items-center print:justify-start">
            <img src={branding.logo} alt="Logo" className="h-full object-contain" />
            <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer print:hidden">
              <label className="cursor-pointer text-xs text-blue-600 font-bold">
                Ubah Logo
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </label>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 text-center">
        <h1 className="text-2xl font-bold text-slate-800 tracking-wider uppercase dark:text-slate-100">{branding.companyName}</h1>
        <p className="text-[11px] font-semibold text-slate-600 mt-1 dark:text-slate-300">JUAL BELI, TUKAR TAMBAH, SEWA COMPUTER SEGALA KONDISI</p>
      </div>
      <div className="flex-1" />
    </div>
  );

  const renderQuotation = () => (
    <div className="print-page text-[13px] text-black">
      {renderHeader()}
      <div className="mb-6">
        <p>Kepada Yth,</p>
        <p className="font-bold">{invoiceData.company}</p>
        <p className="mt-4">Attn: Procurement</p>
      </div>

      <div className="grid grid-cols-[100px_auto] gap-2 mb-6">
        <div>Hal</div>
        <div className="font-bold">: Surat Penawaran Harga Jasa Sewa Laptop.</div>
      </div>

      <p className="mb-4">Dengan hormat,</p>
      <p className="mb-4 text-justify">
        Menindaklanjuti informasi yang kami terima bahwa perpanjangan sewa laptop di {invoiceData.company}, maka bersama ini kami sampaikan penawaran harga untuk jasa sewa tersebut:
      </p>

      <table className="w-full border-collapse border border-slate-400 mb-6">
        <thead>
          <tr className="bg-sky-50">
            <th className="border border-slate-400 py-2 px-3 w-12 text-center">NO</th>
            <th className="border border-slate-400 py-2 px-3 text-center">JENIS PEKERJAAN</th>
            <th className="border border-slate-400 py-2 px-3 w-48 text-center">HARGA JASA / BULAN / UNIT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-slate-400 py-2 px-3 text-center">1</td>
            <td className="border border-slate-400 py-2 px-3">Jasa Sewa laptop</td>
            <td className="border border-slate-400 py-2 px-3 text-right">480.000,-</td>
          </tr>
          <tr className="bg-sky-50 font-bold">
            <td colSpan={2} className="border border-slate-400 py-2 px-3 text-center">TOTAL</td>
            <td className="border border-slate-400 py-2 px-3 text-right">480.000,-</td>
          </tr>
        </tbody>
      </table>

      <div className="mb-6">
        <p className="mb-2">1. Terkait dengan harga tersebut diatas, kami sampaikan beberapa kondisi sebagai berikut:</p>
        <ol className="list-[lower-alpha] pl-8 space-y-1">
          <li>Harga tersebut berlaku untuk satu unit laptop per bulan.</li>
          <li>Segala kerusakan karena kelalaian pemakaian (human error) menjadi tanggung jawab penyewa.</li>
          <li>Tidak termasuk licence.</li>
          <li>Pengiriman sebelum tanggal 15 ditagihkan full, dan pengiriman sesudah tanggal 15 ditagihkan prorate.</li>
          <li>Durasi kontrak sampai akhir 2026 harga tidak berubah.</li>
          <li>Pengiriman unit di luar kota biaya ditanggung oleh Via Computer, namun pengembalian unit ke Persada ditanggung oleh Persada di akhir kontrak atau pada waktu terjadi trouble di luar kota.</li>
          <li>Spesifikasi:</li>
        </ol>
      </div>

      <table className="w-full border-collapse border border-slate-400 mb-8 max-w-2xl mx-auto">
        <tbody>
          {[
            ['PROCESSOR', 'Core i5 Gen 11'],
            ['SSD', 'Min 256 Gb'],
            ['RAM', 'Min 16 Gb'],
            ['VGA', 'Intel HD Grafik'],
            ['BATERAI', 'Normal'],
            ['DVD', 'Normal'],
            ['CAMERA', 'Normal'],
            ['SPEAKER', 'Normal'],
            ['USB', 'Normal'],
            ['WIFI', 'Normal']
          ].map(([key, val]) => (
            <tr key={key}>
              <td className="border border-slate-400 py-1.5 px-4 font-bold w-1/3">{key}</td>
              <td className="border border-slate-400 py-1.5 px-4">{val}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mb-8">2. Demikian surat penawaran ini kami sampaikan, atas perhatian dan kerja sama yang baik diucapkan terima kasih.</p>

      <div className="mt-8">
        <p>Jakarta, {formatDate(new Date().toISOString())}</p>
        <p className="font-bold">V Com (Via Computer)</p>
        <div className="h-24 mt-2 relative w-48">
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <span className="text-4xl font-black text-blue-500 transform -rotate-12">V-com Website</span>
          </div>
          <div className="border-b border-black absolute bottom-4 w-full"></div>
        </div>
        <p className="font-bold underline text-sm mt-2">ILAVIA FUJIYANTI</p>
        <p>Sales</p>
      </div>
    </div>
  );

  const renderReceipt = () => (
    <div className="print-page text-[13px] text-black">
      {renderHeader()}
      <div className="text-center mb-8">
        <h2 className="text-lg font-bold underline uppercase">RECEIPT / DEBIT NOTE</h2>
        <p className="font-bold">KWITANSI NO : {invoiceData.id.replace('INV', 'KWT')}</p>
      </div>

      <div className="mb-6">
        <p>Kepada Yth,</p>
        <p className="font-bold">{invoiceData.company}</p>
      </div>

      <table className="w-full border-collapse border border-slate-800 mb-8">
        <thead>
          <tr className="bg-amber-300">
            <th className="border border-slate-800 py-3 px-2 w-10 text-center">NO</th>
            <th className="border border-slate-800 py-3 px-4 text-center">KETERANGAN</th>
            <th className="border border-slate-800 py-3 px-2 w-16 text-center">QTY</th>
            <th className="border border-slate-800 py-3 px-4 w-32 text-center">HARGA PER UNIT</th>
            <th className="border border-slate-800 py-3 px-4 w-40 text-center">TOTAL HARGA</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-slate-800 py-3 px-2 text-center align-top">1</td>
            <td className="border border-slate-800 py-3 px-4 align-top">
              {invoiceData.items?.[0]?.model || 'Pengadaan sewa laptop min Core i5 - 11 Ram 16 Gb SSD 256 GB'}
            </td>
            <td className="border border-slate-800 py-3 px-2 text-center align-top">{invoiceData.items?.[0]?.qty || invoiceData.capacity}</td>
            <td className="border border-slate-800 py-3 px-4 text-center align-top">Terlampir</td>
            <td className="border border-slate-800 py-3 px-4 text-right align-top font-semibold">{formatCurrency(invoiceData.amount)}</td>
          </tr>
          <tr className="bg-amber-300 font-semibold">
            <td colSpan={3} rowSpan={3} className="border border-slate-800 p-2 align-top text-xs">
              <p>Harap Transfer Ke :</p>
              <div className="grid grid-cols-[80px_auto] gap-1 mt-1">
                <div>Nama</div><div>: ILAVIA FUJIYANTI</div>
                <div>No Rek</div><div>: 155.000.183.690.0</div>
                <div>Bank</div><div>: Mandiri</div>
              </div>
            </td>
            <td className="border border-slate-800 p-2">Sub total</td>
            <td className="border border-slate-800 p-2 text-right">{formatCurrency(invoiceData.amount)}</td>
          </tr>
          <tr className="bg-amber-300 font-semibold">
            <td className="border border-slate-800 p-2">VAT 11%</td>
            <td className="border border-slate-800 p-2 text-right">Rp 0</td>
          </tr>
          <tr className="bg-amber-300 font-bold">
            <td className="border border-slate-800 p-2">Grand Total</td>
            <td className="border border-slate-800 p-2 text-right">{formatCurrency(invoiceData.amount)}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-12 w-64">
        <p>Jakarta, {formatDate(new Date().toISOString())}</p>
        <div className="h-24 mt-2 relative">
          <div className="absolute left-2 bottom-4 w-16 h-20 bg-rose-100 border-2 border-dashed border-rose-300 flex items-center justify-center -rotate-6">
            <span className="text-[8px] text-rose-500 font-bold tracking-widest -rotate-90">MATERAI</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none z-10">
            <span className="text-4xl font-black text-blue-500 transform -rotate-12">V-com Website</span>
          </div>
          <div className="border-b border-black absolute bottom-4 w-full z-20"></div>
        </div>
        <p className="font-bold underline text-sm mt-2">ILAVIA FUJIYANTI</p>
        <p>(Via Computer)</p>
      </div>
    </div>
  );

  const renderPurchaseOrder = () => (
    <div className="print-page text-[12px] text-black">
      <div className="flex justify-end mb-4">
        <div className="text-right">
          <h1 className="text-xl font-black text-slate-800 flex items-center gap-2 justify-end dark:text-slate-100">
            <span className="w-8 h-8 flex flex-wrap gap-0.5">
              <span className="w-3.5 h-3.5 bg-green-500"></span><span className="w-3.5 h-3.5 bg-blue-500"></span>
              <span className="w-3.5 h-3.5 bg-yellow-500"></span><span className="w-3.5 h-3.5 bg-black"></span>
            </span>
            PERSADA
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 dark:text-slate-400">Helping Your Business Grow</p>
        </div>
      </div>
      
      <h2 className="text-center font-bold text-lg mb-2">PURCHASE ORDER</h2>

      <table className="w-full border-collapse border border-slate-800 mb-6 text-xs">
        <tbody>
          <tr>
            <td className="border border-slate-800 p-2 w-1/2">
              <span className="inline-block w-20">Tanggal :</span> {formatDate(new Date().toISOString())}
            </td>
            <td className="border border-slate-800 p-2 w-1/2">
              <span className="inline-block w-20">Nomor :</span> PO-{new Date().getFullYear()}-{(new Date().getTime() % 10000).toFixed(0).padStart(4,'0')}
            </td>
          </tr>
          <tr>
            <td className="border border-slate-800 p-2 align-top h-32">
              <p className="font-bold mb-2">SELLER CONTRACTOR :</p>
              <p className="font-bold">V-com Website</p>
              <p>Jalan Impres XI Rt 005/008 Larangan Tangerang</p>
              <p>021.7320118</p>
              <p>telp:</p>
              <p>att:</p>
            </td>
            <td className="border border-slate-800 p-2 align-top">
              <p className="font-bold mb-2">DELIVERY TO :</p>
              <p className="font-bold">{invoiceData.company}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="w-full border-collapse border border-slate-800 mb-8 text-xs text-center">
        <thead className="bg-sky-50">
          <tr>
            <th className="border border-slate-800 p-2 w-10">No.</th>
            <th className="border border-slate-800 p-2 w-16">QTY</th>
            <th className="border border-slate-800 p-2 w-20">SATUAN</th>
            <th className="border border-slate-800 p-2 text-left">DESCRIPTION / URAIAN</th>
            <th className="border border-slate-800 p-2 w-32">NET PRICE (Rp)</th>
            <th className="border border-slate-800 p-2 w-32">TOTAL PRICE (Rp)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-slate-800 p-2">1</td>
            <td className="border border-slate-800 p-2">{invoiceData.items?.[0]?.qty || invoiceData.capacity}</td>
            <td className="border border-slate-800 p-2">unit</td>
            <td className="border border-slate-800 p-2 text-left">{invoiceData.items?.[0]?.model || 'Sewa Laptop'}</td>
            <td className="border border-slate-800 p-2 text-right">{formatCurrency(invoiceData.items?.[0]?.rate || 480000).replace('Rp','')}</td>
            <td className="border border-slate-800 p-2 text-right">{formatCurrency(invoiceData.amount).replace('Rp','')}</td>
          </tr>
          <tr className="bg-sky-50 font-bold">
            <td colSpan={5} className="border border-slate-800 p-2">GRAND TOTAL</td>
            <td className="border border-slate-800 p-2 text-right">{formatCurrency(invoiceData.amount).replace('Rp','')}</td>
          </tr>
        </tbody>
      </table>

      <div className="mb-12">
        <p className="mb-2">Disepakati oleh kedua belah pihak sebagai berikut :</p>
        <ul className="list-none space-y-1.5 ml-0">
          <li>Harga belum termasuk PPN 11%</li>
          <li>Segala kerusakan karena kelalaian (human Error) menjadi tanggung jawab Pemakai</li>
          <li>Harga belum termasuk License</li>
          <li>Pengiriman keluar kota ditanggung Vcom</li>
          <li>Pengembalian dari luarkotaditanggung {invoiceData.company} pada akhir Kontrak /unit bermasalah</li>
          <li>Tagihan Dibayar sesuai realisasi Unit yang dipakai</li>
          <li>Masa sewa dari 01 Mei 2026 s/d 30 April 2027/sesuai project yang berjalan</li>
          <li>Pembayaran dilakukan 14 hari setelah diterima keuangan diikuti BALAP</li>
        </ul>
      </div>

      <div className="flex justify-between items-end mt-16 px-10">
        <div className="text-center w-48 relative">
          <p className="font-bold mb-16">V-com Website</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-blue-500 transform -rotate-12">V-com Website</span>
          </div>
          <div className="border-b border-black w-full mb-1"></div>
          <p>( <span className="font-bold">ILAVIA FUJIYANTI</span> )</p>
        </div>
        
        <div className="text-center w-64 relative">
          <p className="font-bold mb-2">{invoiceData.company}</p>
          <p className="font-bold mb-12">Direktur Utama</p>
          <div className="absolute left-0 bottom-8 w-16 h-20 bg-rose-100 border-2 border-dashed border-rose-300 flex items-center justify-center -rotate-6">
            <span className="text-[8px] text-rose-500 font-bold tracking-widest -rotate-90">MATERAI</span>
          </div>
          <div className="border-b border-black w-full mb-1 z-10 relative"></div>
          <p className="font-bold text-left pl-16">( SUWIGNYO )</p>
        </div>
      </div>
      
      <div className="mt-12 text-[9px] text-slate-500 dark:text-slate-400">
        <p>Lembar ke 1 Putih (asli)</p>
        <p>Lembar ke 2 Biru (asli)</p>
        <p>Lembar ke 3 Hijau (copy 1)</p>
        <p>Lembar ke 4 Merah (copy 2)</p>
      </div>
    </div>
  );

  const renderUsageRecap = () => (
    <div className="print-page-landscape text-[10px] text-black w-full">
      <h2 className="text-center font-bold text-lg mb-2 text-rose-600">Rekap Penggunaan Laptop Bulan {new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</h2>
      <table className="w-full border-collapse border border-slate-400">
        <thead>
          <tr className="bg-orange-500 text-white">
            <th className="border border-slate-400 p-1">No</th>
            <th className="border border-slate-400 p-1 w-32">Nama</th>
            <th className="border border-slate-400 p-1 w-20">End Contract</th>
            <th className="border border-slate-400 p-1 w-20">Nik</th>
            <th className="border border-slate-400 p-1 w-24">Fungsi</th>
            <th className="border border-slate-400 p-1 w-24">Lokasi</th>
            <th className="border border-slate-400 p-1 w-24">Merk / Type</th>
            <th className="border border-slate-400 p-1 w-20">Serialnumber</th>
            <th className="border border-slate-400 p-1 w-32">Spesifikasi</th>
            <th className="border border-slate-400 p-1 w-16">Mulai Awal</th>
            <th className="border border-slate-400 p-1 w-16">Mulai Akhir</th>
            <th className="border border-slate-400 p-1 w-20">Sewa / Bulan</th>
            <th className="border border-slate-400 p-1 w-20">Total Tagihan</th>
          </tr>
        </thead>
        <tbody>
          {recapUsageData.map((row) => (
            <tr key={row.no} className="hover:bg-slate-50 dark:hover:bg-slate-950">
              <td className="border border-slate-400 p-1 text-center">{row.no}</td>
              <td className="border border-slate-400 p-1">{row.nama}</td>
              <td className="border border-slate-400 p-1 text-center">{row.endContract}</td>
              <td className="border border-slate-400 p-1 text-center">{row.nik}</td>
              <td className="border border-slate-400 p-1">{row.fungsi}</td>
              <td className="border border-slate-400 p-1">{row.lokasi}</td>
              <td className="border border-slate-400 p-1">{row.merkType}</td>
              <td className="border border-slate-400 p-1">{row.serial}</td>
              <td className="border border-slate-400 p-1 text-[9px]">{row.specs}</td>
              <td className="border border-slate-400 p-1 text-center">{row.mulaiAwal}</td>
              <td className="border border-slate-400 p-1 text-center">{row.mulaiAkhir}</td>
              <td className="border border-slate-400 p-1 text-right">{formatCurrency(row.sewaBulan).replace('Rp','')}</td>
              <td className="border border-slate-400 p-1 text-right">{formatCurrency(row.totalTagihan).replace('Rp','')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderResignRecap = () => (
    <div className="print-page-landscape text-[11px] text-black">
      <h2 className="font-bold text-xl mb-4 text-red-600">Rekap data resign Bulan {new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</h2>
      <table className="w-3/4 border-collapse border border-slate-400">
        <thead>
          <tr className="bg-orange-500 text-white font-bold dark:text-slate-900">
            <th className="border border-slate-400 p-2 w-12 text-center">No ▾</th>
            <th className="border border-slate-400 p-2 text-center">Nama ▾</th>
            <th className="border border-slate-400 p-2 w-32 text-center">Serialnumber ▾</th>
            <th className="border border-slate-400 p-2 text-center">Spesifikasi ▾</th>
            <th className="border border-slate-400 p-2 w-32 text-center">Keterangan ▾</th>
          </tr>
        </thead>
        <tbody>
          {recapResignData.map((row) => (
            <tr key={row.no} className="hover:bg-slate-50 dark:hover:bg-slate-950">
              <td className="border border-slate-400 p-2 text-center">{row.no}</td>
              <td className="border border-slate-400 p-2 font-medium">{row.nama}</td>
              <td className="border border-slate-400 p-2">{row.serial}</td>
              <td className="border border-slate-400 p-2 text-slate-500 dark:text-slate-400">{row.specs}</td>
              <td className={`border border-slate-400 p-2 font-medium ${row.keterangan === 'Resign' ? 'text-red-500' : 'text-blue-500'}`}>
                {row.keterangan}
              </td>
            </tr>
          ))}
          <tr><td colSpan={5} className="border border-slate-400 p-2 text-transparent">.</td></tr>
        </tbody>
      </table>
    </div>
  );

  switch (type) {
    case 'quotation': return renderQuotation();
    case 'receipt': return renderReceipt();
    case 'po': return renderPurchaseOrder();
    case 'recap-usage': return renderUsageRecap();
    case 'recap-resign': return renderResignRecap();
    default: return null;
  }
}
