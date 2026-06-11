import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, FileText, Edit3, Trash2, Clock } from 'lucide-react';

import PageWrapper from '../components/layout/PageWrapper';
import Modal from '../components/ui/Modal';

/* ── Mock Data ── */
const initialNotes = [
  { id: 'NOTE-001', title: 'Maintenance Rutin Mingguan', content: 'Lakukan pengecekan semua peralatan service setiap hari Senin pagi.', author: 'Eko Prasetyo', createdAt: '2026-06-10', category: 'Maintenance' },
  { id: 'NOTE-002', title: 'Update Harga Sparepart', content: 'Harga layar iPhone 14 Pro naik 10% mulai bulan depan.', author: 'Diana Putri', createdAt: '2026-06-09', category: 'Harga' },
  { id: 'NOTE-003', title: 'Training Teknisi Baru', content: 'Training untuk teknisi baru akan dilaksanakan hari Jumat jam 10:00.', author: 'Eko Prasetyo', createdAt: '2026-06-08', category: 'Pelatihan' },
];

const categories = ['Semua', 'Maintenance', 'Harga', 'Pelatihan', 'Umum'];

const categoryColors = {
  Maintenance: 'bg-blue-100 text-blue-700',
  Harga: 'bg-amber-100 text-amber-700',
  Pelatihan: 'bg-violet-100 text-violet-700',
  Umum: 'bg-slate-100 text-slate-700',
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function OperationalNotes() {
  const [notes, setNotes] = useState(initialNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'Umum' });
  const [editNote, setEditNote] = useState({ id: '', title: '', content: '', category: '' });

  /* ── Filtered notes ── */
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q) ||
        note.author.toLowerCase().includes(q);
      const matchesCategory = filterCategory === 'Semua' || note.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [notes, searchQuery, filterCategory]);

  /* ── Handlers ── */
  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    const note = {
      id: `NOTE-${String(notes.length + 1).padStart(3, '0')}`,
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      author: 'Pengguna',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setNotes([note, ...notes]);
    setIsAddModalOpen(false);
    setNewNote({ title: '', content: '', category: 'Umum' });
  };

  const openEditModal = (note) => {
    setSelectedNote(note);
    setEditNote({ id: note.id, title: note.title, content: note.content, category: note.category });
    setIsEditModalOpen(true);
  };

  const handleEditNote = () => {
    if (!editNote.title.trim() || !editNote.content.trim()) return;
    setNotes(notes.map((n) => (n.id === editNote.id ? { ...n, title: editNote.title, content: editNote.content, category: editNote.category } : n)));
    setIsEditModalOpen(false);
    setSelectedNote(null);
  };

  const openDeleteModal = (note) => {
    setSelectedNote(note);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteNote = () => {
    setNotes(notes.filter((n) => n.id !== selectedNote?.id));
    setIsDeleteModalOpen(false);
    setSelectedNote(null);
  };

  return (
    <PageWrapper
      title="Catatan Operasional"
      subtitle="Kelola catatan harian, pengingat, dan informasi penting untuk operasional service."
      actions={
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl text-sm font-medium text-white hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          <Plus size={16} />
          Tambah Catatan
        </button>
      }
    >
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari catatan berdasarkan judul, isi, atau penulis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-slate-400"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === 'Semua' ? 'Semua Kategori' : c}</option>
          ))}
        </select>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Maintenance', 'Harga', 'Pelatihan', 'Umum'].map((cat) => {
          const count = notes.filter((n) => n.category === cat).length;
          const colors = {
            Maintenance: 'bg-blue-100 text-blue-600',
            Harga: 'bg-amber-100 text-amber-600',
            Pelatihan: 'bg-violet-100 text-violet-600',
            Umum: 'bg-slate-100 text-slate-600',
          };
          return (
            <div key={cat} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[cat]}`}>
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{cat}</p>
                <p className="font-bold text-slate-900">{count} catatan</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes Card List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredNotes.map((note, idx) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ delay: idx * 0.06 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-lg transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-violet-50 flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-blue-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm">{note.title}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[note.category] || categoryColors.Umum}`}>
                        {note.category}
                      </span>
                    </div>
                    <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => openEditModal(note)} className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition cursor-pointer">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => openDeleteModal(note)} className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-2">{note.content}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatDate(note.createdAt)}
                    </span>
                    <span>oleh <span className="font-medium text-slate-500">{note.author}</span></span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredNotes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <FileText size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">Tidak ada catatan yang sesuai dengan pencarian Anda.</p>
          <p className="text-sm text-slate-400 mt-1">Coba ubah kata kunci atau filter kategori.</p>
        </div>
      )}

      {/* Add Note Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Catatan Baru">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Judul *</label>
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              placeholder="Masukkan judul catatan"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Isi Catatan *</label>
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              placeholder="Tulis isi catatan di sini..."
              rows={4}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori</label>
            <select
              value={newNote.category}
              onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
            >
              {categories.filter((c) => c !== 'Semua').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer">
              Batal
            </button>
            <button onClick={handleAddNote} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer">
              Simpan Catatan
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Note Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Catatan">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Judul *</label>
            <input
              type="text"
              value={editNote.title}
              onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Isi Catatan *</label>
            <textarea
              value={editNote.content}
              onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori</label>
            <select
              value={editNote.category}
              onChange={(e) => setEditNote({ ...editNote, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer"
            >
              {categories.filter((c) => c !== 'Semua').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer">
              Batal
            </button>
            <button onClick={handleEditNote} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 cursor-pointer">
              Simpan Perubahan
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Konfirmasi Hapus">
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Trash2 size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-900 mb-1">Apakah Anda yakin ingin menghapus catatan ini?</p>
                <p className="text-sm text-rose-700">
                  <strong>{selectedNote?.title}</strong> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition cursor-pointer">
              Batal
            </button>
            <button onClick={handleDeleteNote} className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition shadow-lg shadow-rose-500/20 cursor-pointer">
              Hapus Catatan
            </button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
