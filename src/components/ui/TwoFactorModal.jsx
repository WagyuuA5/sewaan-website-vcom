import React, { useState } from 'react';
import Modal from './Modal';
import { ShinyButton } from './shiny-button';
import { QrCode, Copy, Check, ShieldCheck, Loader2 } from 'lucide-react';

export default function TwoFactorModal({ isOpen, onClose, isEnabled, onToggle }) {
  const [step, setStep] = useState(isEnabled ? 'manage' : 'setup');
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const dummySecret = 'JBSWY3DPEHPK3PXP';

  // Reset step when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setStep(isEnabled ? 'manage' : 'setup');
      setCode('');
    }
  }, [isOpen, isEnabled]);

  const handleCopy = () => {
    navigator.clipboard.writeText(dummySecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = () => {
    if (code.length !== 6) return;
    setIsVerifying(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsVerifying(false);
      onToggle(true);
      setStep('success');
    }, 1500);
  };

  const handleDisable = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onToggle(false);
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Autentikasi Dua Langkah (2FA)" size="md">
      {step === 'setup' && (
        <div className="space-y-6 pt-2">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Pindai QR code di bawah ini menggunakan aplikasi authenticator Anda (seperti Google Authenticator atau Authy).
          </p>
          
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-white border border-slate-200 rounded-2xl flex items-center justify-center p-4 shadow-sm dark:border-slate-700">
              {/* Dummy QR code using Lucide icon scaled up, in real life this is an image */}
              <div className="w-full h-full border-4 border-slate-800 rounded-lg flex items-center justify-center bg-slate-50 relative overflow-hidden dark:bg-white">
                <QrCode size={120} className="text-slate-800" strokeWidth={1} />
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Atau masukkan kode rahasia ini secara manual:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2.5 bg-slate-100 rounded-lg text-sm font-mono text-slate-800 tracking-widest text-center dark:bg-slate-800/80 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                {dummySecret}
              </code>
              <button onClick={handleCopy} className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-blue-400">
                {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Masukkan 6-digit kode verifikasi</label>
            <input 
              type="text" 
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="000000" 
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-center font-mono text-xl tracking-[0.5em] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700">
              Batal
            </button>
            <ShinyButton 
              onClick={handleVerify}
              disabled={code.length !== 6 || isVerifying}
              className="flex-1 px-4 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:text-slate-900"
            >
              {isVerifying ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Verifikasi'}
            </ShinyButton>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="space-y-6 text-center py-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto dark:bg-emerald-500/20 dark:text-emerald-400">
            <ShieldCheck size={40} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-800 mb-2 dark:text-slate-100">2FA Berhasil Diaktifkan!</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Akun Anda sekarang memiliki lapisan keamanan ekstra. Anda akan dimintai kode setiap kali login dari perangkat baru.
            </p>
          </div>
          <ShinyButton onClick={onClose} className="w-full px-4 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 dark:text-slate-900">
            Selesai
          </ShinyButton>
        </div>
      )}

      {step === 'manage' && (
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-emerald-500/20 dark:text-emerald-400">
            <ShieldCheck size={32} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Autentikasi Dua Langkah (2FA) saat ini <strong className="text-emerald-600 dark:text-emerald-400">Aktif</strong> pada akun Anda.
          </p>
          
          <div className="flex gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700">
              Tutup
            </button>
            <ShinyButton 
              onClick={handleDisable}
              disabled={isVerifying}
              className="flex-1 px-4 py-3 rounded-xl font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors disabled:opacity-50 dark:text-slate-900"
            >
              {isVerifying ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Nonaktifkan 2FA'}
            </ShinyButton>
          </div>
        </div>
      )}
    </Modal>
  );
}
