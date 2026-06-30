import { useState, useMemo } from 'react';
import { ShinyButton } from '../components/ui/shiny-button';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Mail,
  Phone,
  Calendar,
  UserPlus,
  Edit3,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import AnimatedSearchInput from '../components/ui/AnimatedSearchInput';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { useProfileStore } from '../store/useProfileStore';
import { useToast } from '../components/ui/Toast';

const usersData = [
  { id: 'USR-001', name: 'Ahmad Fauzi', role: 'Teknisi', email: 'ahmad@service.com', phone: '+62 812-1111-2222', status: 'Active', joined: '2023-01-15' },
  { id: 'USR-002', name: 'Budi Santoso', role: 'Teknisi', email: 'budi@service.com', phone: '+62 813-2222-3333', status: 'Active', joined: '2023-03-20' },
  { id: 'USR-003', name: 'Citra Dewi', role: 'Teknisi', email: 'citra@service.com', phone: '+62 814-3333-4444', status: 'Active', joined: '2023-06-10' },
  { id: 'USR-004', name: 'Diana Putri', role: 'Admin', email: 'diana@service.com', phone: '+62 815-4444-5555', status: 'Active', joined: '2023-02-01' },
  { id: 'USR-005', name: 'Eko Prasetyo', role: 'Manajer', email: 'eko@service.com', phone: '+62 816-5555-6666', status: 'Active', joined: '2022-11-01' },
];

const roleColors = {
  Teknisi: 'bg-blue-100 text-blue-700',
  Admin: 'bg-purple-100 text-purple-700',
  Manajer: 'bg-amber-100 text-amber-700',
};

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const avatarGradients = [
  'from-blue-500 to-cyan-400',
  'from-violet-500 to-purple-400',
  'from-rose-500 to-pink-400',
  'from-amber-500 to-yellow-400',
  'from-emerald-500 to-teal-400',
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: 'easeOut' },
  }),
};

export default function Users() {
  const { profile } = useProfileStore();
  const { showToast } = useToast();
  const isManager = profile.role === 'Manajer' || profile.role === 'Manager';

  const [users, setUsers] = useState(usersData);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'Teknisi' });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const roles = ['Semua', ...new Set(users.map((u) => u.role))];

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.id.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'Semua' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const openAddModal = () => {
    setFormData({ name: '', email: '', phone: '', role: 'Teknisi' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setFormData({ name: user.name, email: user.email, phone: user.phone, role: user.role });
    setSelectedUserId(user.id);
    setIsEditing(true);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      showToast('Mohon lengkapi data yang wajib (Nama, Email, Peran)', 'error');
      return;
    }
    
    if (isEditing) {
      setUsers(users.map(u => u.id === selectedUserId ? { ...u, ...formData } : u));
      showToast('Data pengguna berhasil diperbarui!', 'success');
    } else {
      const newUser = {
        id: `USR-00${users.length + 1}`,
        ...formData,
        status: 'Active',
        joined: new Date().toISOString().split('T')[0]
      };
      setUsers([newUser, ...users]);
      showToast('Pengguna baru berhasil ditambahkan!', 'success');
    }
    setIsModalOpen(false);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Yakin ingin menghapus pengguna ini?')) {
      setUsers(users.filter(u => u.id !== id));
      showToast('Pengguna berhasil dihapus!', 'success');
    }
    setOpenMenuId(null);
  };

  return (
    <PageWrapper
      title="Kelola Pengguna"
      subtitle="Kelola teknisi, admin, dan manajer."
      actions={
        isManager && (
          <ShinyButton
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm cursor-pointer dark:text-slate-900"
          >
            <Plus size={18} />
            Tambah Pengguna
          </ShinyButton>
        )
      }
    >
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <AnimatedSearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari pengguna berdasarkan nama, email, atau ID..." />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition cursor-pointer dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role === 'Semua' ? 'Semua Peran' : role}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 mb-4 dark:text-slate-400">
        Menampilkan <span className="font-semibold text-slate-700 dark:text-slate-200">{filteredUsers.length}</span> dari{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-200">{users.length}</span> pengguna
      </p>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredUsers.map((user, i) => (
          <motion.div
            key={user.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition group dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-600"
          >
            {/* Top row: avatar + info + menu */}
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-white font-bold text-sm shadow-sm dark:text-slate-900`}
              >
                {getInitials(user.name)}
              </div>

              {/* Name & Role */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate dark:text-white">
                  {user.name}
                </h3>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-medium ${roleColors[user.role] || 'bg-slate-100 text-slate-600'}`}
                >
                  {user.role}
                </span>
              </div>

              {/* Context menu */}
              {isManager && (
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === user.id ? null : user.id)
                    }
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer dark:hover:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {openMenuId === user.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1 overflow-hidden dark:bg-slate-900 dark:border-slate-800"
                    >
                      <button onClick={() => openEditModal(user)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer dark:text-slate-200 dark:hover:bg-slate-950">
                        <Edit3 size={14} />
                        Edit Pengguna
                      </button>
                      <button onClick={() => handleDeleteUser(user.id)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer">
                        <Trash2 size={14} />
                        Hapus Pengguna
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-slate-100 dark:border-slate-800" />

            {/* Details */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Mail size={14} className="text-slate-400 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Phone size={14} className="text-slate-400 flex-shrink-0" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Calendar size={14} className="text-slate-400 flex-shrink-0" />
                <span>Bergabung {formatDate(user.joined)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
              <StatusBadge status={user.status} />
              <span className="text-xs text-slate-400 font-mono">{user.id}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            Tidak ada pengguna ditemukan
          </h3>
          <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
            Coba ubah kata kunci pencarian atau filter peran.
          </p>
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? "Edit Pengguna" : "Tambah Pengguna Baru"}
        size="md"
      >
        <form
          onSubmit={handleSaveUser}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
              Nama Lengkap *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masukkan nama lengkap"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition dark:border-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contoh@service.com"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition dark:border-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+62 8xx-xxxx-xxxx"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition dark:border-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
              Peran *
            </label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition cursor-pointer dark:border-slate-800 dark:text-slate-200"
            >
              <option value="Teknisi">Teknisi</option>
              <option value="Admin">Admin</option>
              <option value="Manajer">Manajer</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <ShinyButton
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition cursor-pointer dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              Batal
            </ShinyButton>
            <ShinyButton
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-sm cursor-pointer dark:text-slate-900"
            >
              <UserPlus size={16} />
              Simpan Pengguna
            </ShinyButton>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
