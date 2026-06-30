import { useState } from 'react';
import { ShinyButton } from './shiny-button';
import Modal from './Modal';
import { useToast } from './Toast';

export default function DeleteAccountModal({ isOpen, onClose, onConfirm }) {
  const [confirmText, setConfirmText] = useState('');
  const { showToast } = useToast();

  const handleConfirm = () => {
    if (confirmText === 'HAPUS') {
      onConfirm();
    } else {
      showToast('Ketik HAPUS untuk mengonfirmasi', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hapus Akun Permanen?">
      <div className="space-y-6 text-center pt-2">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto mb-2">
          ⚠
        </div>
        <p className="text-sm text-slate-500 mb-6 dark:text-slate-400">
          Tindakan ini tidak dapat dibatalkan. Semua data profil, pengaturan, dan riwayat akan dihapus secara permanen. Ketik <strong>HAPUS</strong> untuk mengonfirmasi.
        </p>
        
        <input 
          type="text" 
          placeholder="Ketik HAPUS" 
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold tracking-widest uppercase focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all dark:bg-slate-800/40 dark:border-slate-800"
        />
        
        <div className="flex gap-3 pt-2">
          <ShinyButton 
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            Batal
          </ShinyButton>
          <ShinyButton 
            onClick={handleConfirm}
            disabled={confirmText !== 'HAPUS'}
            className="flex-1 px-4 py-3 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:text-slate-900"
          >
            Hapus Akun
          </ShinyButton>
        </div>
      </div>
    </Modal>
  );
}
