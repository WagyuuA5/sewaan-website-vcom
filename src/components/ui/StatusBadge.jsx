import { CheckCircle, Clock, AlertCircle, XCircle, Package, Wrench } from 'lucide-react';
import { getStatusColor } from '../../utils/helpers';

const statusIcons = {
  Active: CheckCircle,
  Available: CheckCircle,
  Pending: Clock,
  Overdue: AlertCircle,
  Completed: CheckCircle,
  Rented: Package,
  Maintenance: Wrench,
  Reserved: Clock,
  Inactive: XCircle,
  Paid: CheckCircle,
  Retired: XCircle,
  'Low Stock': AlertCircle,
  'Out of Stock': XCircle,
  'In Progress': Clock,
  'In Service': Wrench,
  Cancelled: XCircle,
};

const statusTranslations = {
  Active: 'Aktif',
  Available: 'Tersedia',
  Pending: 'Menunggu',
  Overdue: 'Terlambat',
  Completed: 'Selesai',
  Rented: 'Disewa',
  Maintenance: 'Perawatan',
  Reserved: 'Dipesan',
  Inactive: 'Tidak Aktif',
  Paid: 'Lunas',
  Retired: 'Pensiun',
  'Low Stock': 'Stok Rendah',
  'Out of Stock': 'Habis',
  'In Progress': 'Dalam Proses',
  'In Service': 'Dalam Service',
  Cancelled: 'Dibatalkan',
};

/**
 * Colour-coded status pill with icon.
 * @param {{ status: string }} props
 */
export default function StatusBadge({ status }) {
  const colors = getStatusColor(status);
  const Icon = statusIcons[status] || Clock;
  const displayStatus = statusTranslations[status] || status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      <Icon size={12} />
      {displayStatus}
    </span>
  );
}
