/**
 * ServiceTech — Dummy Data Layer
 *
 * All mock data lives here for the service/repair management dashboard.
 */

// ==================== SERVICE DATA ====================
export const serviceData = [
  { id: 'SRV-001', customer: 'John Smith', device: 'iPhone 14 Pro', issue: 'Layar pecah', status: 'In Progress', cost: 1500000, createdAt: Date.now() - 1000 * 60 * 30, technician: 'Ahmad', location: 'Jakarta Selatan' },
  { id: 'SRV-002', customer: 'Sarah Johnson', device: 'Samsung Galaxy S23', issue: 'Baterai bocor', status: 'Completed', cost: 800000, createdAt: Date.now() - 1000 * 60 * 60 * 2, technician: 'Budi', location: 'Bandung' },
  { id: 'SRV-003', customer: 'Mike Davis', device: 'MacBook Air M2', issue: 'Keyboard error', status: 'Pending', cost: 2500000, createdAt: Date.now() - 1000 * 60 * 60 * 5, technician: 'Ahmad', location: 'Surabaya' },
  { id: 'SRV-004', customer: 'Emily Chen', device: 'iPad Pro 12.9"', issue: 'Touchscreen tidak responsif', status: 'In Progress', cost: 1800000, createdAt: Date.now() - 1000 * 60 * 60 * 8, technician: 'Citra', location: 'Jakarta Pusat' },
  { id: 'SRV-005', customer: 'David Wilson', device: 'Dell XPS 15', issue: 'Overheating', status: 'Completed', cost: 600000, createdAt: Date.now() - 1000 * 60 * 60 * 24, technician: 'Budi', location: 'Semarang' },
  { id: 'SRV-006', customer: 'Lisa Anderson', device: 'iPhone 13', issue: 'Kamera belakang rusak', status: 'Pending', cost: 1200000, createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2, technician: 'Citra', location: 'Bali' },
];

// ==================== CUSTOMERS ====================
export const customersData = [
  { id: 'CUS-001', name: 'John Smith', email: 'john.smith@email.com', phone: '+62 813-9876-5432', totalServices: 5, totalSpent: 8500000, joined: '2024-03-22' },
  { id: 'CUS-002', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+62 814-5566-7788', totalServices: 3, totalSpent: 6200000, joined: '2024-05-10' },
  { id: 'CUS-003', name: 'Mike Davis', email: 'mike.d@email.com', phone: '+62 816-1122-3344', totalServices: 2, totalSpent: 12000000, joined: '2024-02-14' },
  { id: 'CUS-004', name: 'Emily Chen', email: 'emily.chen@email.com', phone: '+62 817-2233-4455', totalServices: 4, totalSpent: 7800000, joined: '2024-01-08' },
  { id: 'CUS-005', name: 'David Wilson', email: 'david.w@email.com', phone: '+62 818-3344-5566', totalServices: 6, totalSpent: 15600000, joined: '2023-11-15' },
  { id: 'CUS-006', name: 'Lisa Anderson', email: 'lisa.a@email.com', phone: '+62 819-4455-6677', totalServices: 1, totalSpent: 1200000, joined: '2024-06-01' },
];

// ==================== DEVICES DATA ====================
export const devicesData = [
  { id: 'DEV-001', brand: 'Apple', model: 'iPhone 14 Pro', type: 'Smartphone', status: 'In Service', image: null, createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5 },
  { id: 'DEV-002', brand: 'Samsung', model: 'Galaxy S23', type: 'Smartphone', status: 'Available', image: null, createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3 },
  { id: 'DEV-003', brand: 'Apple', model: 'MacBook Air M2', type: 'Laptop', status: 'In Service', image: null, createdAt: Date.now() - 1000 * 60 * 60 * 12 },
  { id: 'DEV-004', brand: 'Apple', model: 'iPad Pro 12.9"', type: 'Tablet', status: 'Available', image: null, createdAt: Date.now() - 1000 * 60 * 60 * 6 },
  { id: 'DEV-005', brand: 'Dell', model: 'XPS 15', type: 'Laptop', status: 'Available', image: null, createdAt: Date.now() - 1000 * 60 * 45 },
  { id: 'DEV-006', brand: 'Apple', model: 'iPhone 13', type: 'Smartphone', status: 'In Service', image: null, createdAt: Date.now() - 1000 * 60 * 15 },
];

// ==================== REVENUE DATA (6 months) ====================
export const revenueData = [
  { month: 'Jan', revenue: 124000000, services: 45 },
  { month: 'Feb', revenue: 158000000, services: 52 },
  { month: 'Mar', revenue: 182000000, services: 61 },
  { month: 'Apr', revenue: 165000000, services: 55 },
  { month: 'May', revenue: 210000000, services: 72 },
  { month: 'Jun', revenue: 245000000, services: 85 },
];

// ==================== STATUS DISTRIBUTION ====================
export const serviceStatusDistribution = [
  { name: 'Selesai', value: 142, color: '#10b981' },
  { name: 'Dalam Proses', value: 85, color: '#3b82f6' },
  { name: 'Menunggu', value: 23, color: '#f59e0b' },
  { name: 'Dibatalkan', value: 12, color: '#ef4444' },
];

// ==================== INVENTORY DATA (RENTALS) ====================
export const inventoryData = [
  { id: 'INV-001', brand: 'Apple', model: 'MacBook Pro 16" M3 Max', specs: '36GB RAM, 1TB SSD', status: 'Available', dailyRate: 450000, stock: 5, image: null, location: 'Gudang Pusat', createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10 },
  { id: 'INV-002', brand: 'Dell', model: 'XPS 15', specs: '32GB RAM, 1TB SSD', status: 'Available', dailyRate: 350000, stock: 3, image: null, location: 'Cabang Selatan', createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8 },
  { id: 'INV-003', brand: 'Lenovo', model: 'ThinkPad X1 Carbon', specs: '16GB RAM, 512GB SSD', status: 'Rented', dailyRate: 250000, stock: 2, image: null, location: 'Di Pelanggan', createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5 },
  { id: 'INV-004', brand: 'Apple', model: 'MacBook Air M2', specs: '16GB RAM, 512GB SSD', status: 'Maintenance', dailyRate: 200000, stock: 1, image: null, location: 'Workshop', createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2 },
  { id: 'INV-005', brand: 'Asus', model: 'ROG Zephyrus G14', specs: '32GB RAM, 1TB SSD, RTX 4060', status: 'Available', dailyRate: 400000, stock: 4, image: null, location: 'Gudang Pusat', createdAt: Date.now() - 1000 * 60 * 60 * 12 },
];

// ==================== RECENT RENTALS ====================
export const recentRentals = [
  { id: 'REN-001', customer: 'PT. Teknologi Maju', laptop: 'MacBook Pro 16" M3 Max', start: '2026-06-01', end: '2026-06-15', status: 'Active', amount: 6750000, location: 'Kantor Pusat Teknologi Maju, Jakarta' },
  { id: 'REN-002', customer: 'CV. Karya Abadi', laptop: 'Dell XPS 15', start: '2026-06-10', end: '2026-06-20', status: 'Pending', amount: 3500000, location: 'Cabang Bekasi' },
  { id: 'REN-003', customer: 'Budi Santoso', laptop: 'ThinkPad X1 Carbon', start: '2026-05-20', end: '2026-06-05', status: 'Overdue', amount: 4000000, location: 'Bandung' },
  { id: 'REN-004', customer: 'Siti Aminah', laptop: 'MacBook Air M2', start: '2026-05-01', end: '2026-05-15', status: 'Completed', amount: 3000000, location: 'Jakarta Selatan' },
];

// ==================== INVOICES DATA ====================
export const invoicesData = [
  { id: 'INV-2026-001', company: 'PT. Personel Alih Daya Tbk', capacity: 50, cycle: 'Monthly', amount: 23736774, date: '2026-06-01', dueDate: '2026-06-08', status: 'Pending', items: [{ model: 'Laptop Core I5 - 11 Ram 16 Gb SSD 256 GB', qty: 50, rate: 474735.48 }] },
  { id: 'INV-2026-002', company: 'IFORTE', capacity: 158, cycle: 'Monthly', amount: 75840000, date: '2025-05-19', dueDate: '2026-05-01', status: 'Paid', items: [{ model: 'Sewa LAptop Core i5 Gen 11 16GB/256 GB', qty: 158, rate: 480000 }] },
  { id: 'INV-2026-003', company: 'PT. Teknologi Maju', capacity: 2, cycle: 'Monthly', amount: 13500000, date: '2026-06-01', dueDate: '2026-06-08', status: 'Pending', items: [{ model: 'MacBook Pro 16" M3 Max', qty: 2, rate: 6750000 }] },
];

// ==================== RECAP USAGE ====================
export const recapUsageData = [
  { no: 1, nama: 'Moch Samsul Bahri', endContract: '31-Aug-26', nik: '7220003081', fungsi: 'ENGINEER ON SITE', lokasi: 'SURABAYA', merkType: 'Dell Vostro 14-3400', serial: '8GFDNJ3', specs: 'i5 Gen11 | 16 GB | 256 GB', mulaiAwal: '1 May 2026', mulaiAkhir: '31 May 2026', sewaBulan: 480000, totalTagihan: 480000 },
  { no: 2, nama: 'Ganjar Fikri Nurwidiarso', endContract: '31-Oct-26', nik: '7230008318', fungsi: 'ENGINEER ON SITE', lokasi: 'JAKARTA SELATAN', merkType: 'Lenovo L13 Yoga', serial: 'PW01JJZA', specs: 'i5 Gen11 | 16 GB | 256 GB', mulaiAwal: '1 May 2026', mulaiAkhir: '31 May 2026', sewaBulan: 480000, totalTagihan: 480000 },
  { no: 3, nama: 'Aditia Fauzi', endContract: '31-Aug-26', nik: '7240012607', fungsi: 'ENGINEER ON SITE', lokasi: 'KOTA BANDUNG', merkType: 'Dell Latitude 3420', serial: 'G3QZFL3', specs: 'i5 Gen11 | 16 GB | 256 GB', mulaiAwal: '1 May 2026', mulaiAkhir: '31 May 2026', sewaBulan: 480000, totalTagihan: 480000 },
  { no: 4, nama: 'Ainul Yaqin', endContract: '30-Jun-26', nik: '7240012971', fungsi: 'ENGINEER ON SITE', lokasi: 'MAKASSAR', merkType: 'Lenovo 82H8', serial: 'PF48A9TX', specs: 'i5 Gen11 | 16 GB | 512 GB', mulaiAwal: '1 May 2026', mulaiAkhir: '31 May 2026', sewaBulan: 480000, totalTagihan: 480000 },
  { no: 5, nama: 'Muhammad Fauzil Adhim', endContract: '30-Jun-26', nik: '7240013020', fungsi: 'ENGINEER ON SITE', lokasi: 'JAKARTA SELATAN', merkType: 'Dell Vostro 14-3400', serial: '119R0H3', specs: 'i5 Gen11 | 16 GB | 512 GB', mulaiAwal: '1 May 2026', mulaiAkhir: '31 May 2026', sewaBulan: 480000, totalTagihan: 480000 },
];

// ==================== RECAP RESIGN ====================
export const recapResignData = [
  { no: 1, nama: 'Muhammad Sidqi Hidayat', serial: 'PF3D1V70', specs: 'i5 Gen11 | 16 GB | 256 GB', keterangan: 'Pindah ke BMG' },
  { no: 2, nama: 'Fadly Nur Zacky', serial: 'CHXQ0H3', specs: 'i5 Gen11 | 16 GB | 256 GB | 1000 GB', keterangan: 'Resign' },
  { no: 3, nama: 'Rian Fahmi', serial: '1XXYKS3', specs: 'i5 Gen11 | 16 GB | 512 GB', keterangan: 'Resign' },
];
