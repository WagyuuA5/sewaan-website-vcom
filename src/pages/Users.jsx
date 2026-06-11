import { useState, useMemo } from 'react';
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
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';

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
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const roles = ['Semua', ...new Set(usersData.map((u) => u.role))];

  const filteredUsers = useMemo(() => {
    return usersData.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.id.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'Semua' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter]);

  return (
    <PageWrapper
      title="Kelola Pengguna"
      subtitle="Kelola teknisi, admin, dan manajer."
      actions={
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm cursor-pointer"
        >
          <Plus size={18} />
          Tambah Pengguna
        </button>
      }
    >
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari pengguna berdasarkan nama, email, atau ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition cursor-pointer"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role === 'Semua' ? 'Semua Peran' : role}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500">
        Menampilkan <span className="font-semibold text-slate-700">{filteredUsers.length}</span> dari{' '}
        <span className="font-semibold text-slate-700">{usersData.length}</span> pengguna
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
            className="relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition group"
          >
            {/* Top row: avatar + info + menu */}
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-white font-bold text-sm shadow-sm`}
              >
                {getInitials(user.name)}
              </div>

              {/* Name & Role */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {user.name}
                </h3>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-medium ${roleColors[user.role] || 'bg-slate-100 text-slate-600'}`}
                >
                  {user.role}
                </span>
              </div>

              {/* Context menu */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === user.id ? null : user.id)
                  }
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  <MoreHorizontal size={18} />
                </button>

                {openMenuId === user.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1 overflow-hidden"
                  >
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer">
                      <Edit3 size={14} />
                      Edit Pengguna
                    </button>
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer">
                      <Trash2 size={14} />
                      Hapus Pengguna
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-slate-100" />

            {/* Details */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail size={14} className="text-slate-400 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone size={14} className="text-slate-400 flex-shrink-0" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
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
          <h3 className="text-lg font-semibold text-slate-700">
            Tidak ada pengguna ditemukan
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Coba ubah kata kunci pencarian atau filter peran.
          </p>
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Pengguna Baru"
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsModalOpen(false);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="contoh@service.com"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nomor Telepon
            </label>
            <input
              type="tel"
              placeholder="+62 8xx-xxxx-xxxx"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Peran
            </label>
            <select className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition cursor-pointer">
              <option value="">Pilih peran</option>
              <option value="Teknisi">Teknisi</option>
              <option value="Admin">Admin</option>
              <option value="Manajer">Manajer</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-sm cursor-pointer"
            >
              <UserPlus size={16} />
              Simpan Pengguna
            </button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
