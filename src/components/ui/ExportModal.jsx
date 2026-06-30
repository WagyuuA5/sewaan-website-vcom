import { useState } from 'react';
import { ShinyButton } from './shiny-button';
import Modal from './Modal';
import { Download, FileText, Image as ImageIcon, Archive, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from './Toast';

const formats = [
  { id: 'pdf', name: 'PDF', icon: FileText, color: 'text-rose-500', group: 'Dokumen / Laporan' },
  { id: 'docx', name: 'DOCX', icon: FileText, color: 'text-blue-600', group: 'Dokumen / Laporan' },
  { id: 'txt', name: 'TXT', icon: FileText, color: 'text-slate-600', group: 'Dokumen / Laporan' },
  { id: 'xlsx', name: 'XLSX', icon: FileText, color: 'text-emerald-600', group: 'Data / Spreadsheet' },
  { id: 'csv', name: 'CSV', icon: FileText, color: 'text-emerald-500', group: 'Data / Spreadsheet' },
  { id: 'json', name: 'JSON', icon: FileText, color: 'text-yellow-600', group: 'Data / Spreadsheet' },
  { id: 'jpg', name: 'JPG', icon: ImageIcon, color: 'text-purple-500', group: 'Gambar / Media' },
  { id: 'png', name: 'PNG', icon: ImageIcon, color: 'text-indigo-500', group: 'Gambar / Media' },
  { id: 'zip', name: 'ZIP', icon: Archive, color: 'text-amber-600', group: 'Arsip' },
];

export default function ExportModal({ isOpen, onClose, data, title = "Unduh Data" }) {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showToast } = useToast();

  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate processing time
    setTimeout(() => {
      // Create dummy file for download
      let content;
      let mimeType = 'text/plain';
      
      if (selectedFormat === 'json') {
        content = JSON.stringify(data || {}, null, 2);
        mimeType = 'application/json';
      } else if (selectedFormat === 'csv') {
        content = 'ID,Name,Status\n1,Data Export,Success';
        mimeType = 'text/csv';
      } else {
        content = `Exported Data format: ${selectedFormat.toUpperCase()}\n\n` + JSON.stringify(data || {}, null, 2);
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Export_${new Date().getTime()}.${selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setIsSuccess(true);
      showToast(`Berhasil mengunduh file dalam format .${selectedFormat.toUpperCase()}`, 'success');
      
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 2000);
  };

  const groupedFormats = formats.reduce((acc, format) => {
    if (!acc[format.group]) acc[format.group] = [];
    acc[format.group].push(format);
    return acc;
  }, {});

  return (
    <Modal isOpen={isOpen} onClose={() => !isExporting && onClose()} title={title}>
      <div className="space-y-6">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Pilih format file yang ingin Anda unduh. Gunakan format yang sesuai dengan kebutuhan Anda.
        </p>
        
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          {Object.entries(groupedFormats).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">{group}</h4>
              <div className="grid grid-cols-3 gap-2">
                {items.map((format) => {
                  const Icon = format.icon;
                  const isSelected = selectedFormat === format.id;
                  return (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                      } dark:bg-slate-900 dark:hover:border-slate-700`}
                    >
                      <Icon size={24} className={format.color} />
                      <span className={`text-xs font-medium ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                        .{format.id.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex gap-3 dark:border-slate-800">
          <ShinyButton
            onClick={onClose}
            disabled={isExporting || isSuccess}
            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition disabled:opacity-50 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
          >
            Batal
          </ShinyButton>
          <ShinyButton
            onClick={handleExport}
            disabled={isExporting || isSuccess}
            className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 shadow-lg ${
              isSuccess 
                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30' 
                : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 shadow-blue-500/30'
            } disabled:opacity-70 dark:text-slate-900`}
          >
            {isExporting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Memproses...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 size={16} />
                Selesai!
              </>
            ) : (
              <>
                <Download size={16} />
                Unduh Data
              </>
            )}
          </ShinyButton>
        </div>
      </div>
    </Modal>
  );
}
