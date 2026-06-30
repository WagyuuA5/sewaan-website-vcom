import { useState } from 'react';
import { ShinyButton } from './shiny-button';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import { useToast } from './Toast';
import { formatCurrency } from '../../utils/helpers';
import { Printer, Laptop, CreditCard, Loader2 } from 'lucide-react';

export default function TransactionDetailModal({ isOpen, onClose, rental }) {
  const { showToast } = useToast();
  const [isPrinting, setIsPrinting] = useState(false);

  if (!rental) return null;

  const handlePrint = () => {
    setIsPrinting(true);
    showToast('Menyiapkan dokumen invoice...', 'info', 1000);
    setTimeout(() => {
      setIsPrinting(false);
      window.print();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => !isPrinting && onClose()} title="Detail Transaksi Sewa">
      <div className="space-y-6">
        
        {/* Header Info */}
        <div className="flex items-start justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
          <div>
            <h4 className="font-bold text-slate-900 text-lg dark:text-white">{rental.customer}</h4>
            <p className="text-sm text-slate-500 font-medium dark:text-slate-400">ID Transaksi: <span className="text-slate-700 dark:text-slate-200">{rental.id}</span></p>
          </div>
          <StatusBadge status={rental.status} />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Device Info */}
          <div className="border border-slate-100 rounded-xl p-4 dark:border-slate-800">
            <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2 dark:text-slate-400">
              <Laptop size={14} /> Detail Perangkat
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-300">Perangkat</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{rental.device || rental.laptop}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-300">Durasi</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">7 Hari</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-300">Tanggal Mulai</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{rental.date}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border border-slate-100 rounded-xl p-4 dark:border-slate-800">
            <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2 dark:text-slate-400">
              <CreditCard size={14} /> Informasi Pembayaran
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-300">Metode Bayar</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">Transfer Bank (BCA)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-300">Status Pembayaran</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Lunas</span>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between items-center dark:border-slate-800">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Total Tagihan</span>
                <span className="text-lg font-bold text-blue-600">{formatCurrency(rental.amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <ShinyButton
            onClick={onClose}
            disabled={isPrinting}
            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition disabled:opacity-50 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
          >
            Tutup
          </ShinyButton>
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 disabled:opacity-70 dark:text-slate-900"
          >
            {isPrinting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Printer size={16} />
                Cetak Invoice
              </>
            )}
          </button>
        </div>

      </div>
    </Modal>
  );
}
