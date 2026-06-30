import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { TypewriterEffectSmooth } from '../components/ui/typewriter-effect';
import TechBackground from '../components/ui/TechBackground';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const { branding } = useSettingsStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Teknisi', // Default role
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password harus mengandung huruf dan angka';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role
    });

    if (result.success) {
      navigate('/');
    } else {
      setErrors({ submit: result.message || 'Terjadi kesalahan sistem' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-800/40">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden dark:bg-slate-50">
        {/* Animated Tech Background */}
        <TechBackground />

        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, boxShadow: ["0px 0px 0px rgba(59,130,246,0)", "0px 0px 60px rgba(59,130,246,0.8)", "0px 0px 30px rgba(59,130,246,0.5)"] }}
            transition={{ 
              scale: { type: "spring", stiffness: 200, damping: 10 },
              boxShadow: { duration: 2, repeat: Infinity, repeatType: "reverse" }
            }}
            className="h-20 w-20 bg-white p-2.5 rounded-[1.25rem] mb-10 dark:bg-slate-900 relative border border-blue-400/30 group cursor-pointer"
          >
            <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-tr from-blue-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img src={branding.logo} alt="Logo" className="h-full w-full object-contain relative z-10 drop-shadow-sm" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-6 dark:text-slate-900">
            {branding.companyName}
          </h1>
          <p className="text-slate-400 text-lg max-w-md">
            Pendaftaran akun internal khusus untuk Admin, Manager, dan Teknisi {branding.companyName}.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 text-slate-400 text-sm">
            <span>&copy; {new Date().getFullYear()} {branding.companyName}</span>
            <span>•</span>
            <span>Secure System</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800"
        >
          <div className="text-center mb-8">
            <TypewriterEffectSmooth 
              words={[
                { text: "Buat", className: "text-slate-800" },
                { text: "Akun", className: "text-slate-800" },
                { text: "Internal", className: "text-blue-600" }
              ]} 
              className="my-0 text-2xl flex justify-center" 
            />
            <p className="text-slate-500 mt-2 text-sm dark:text-slate-400">Lengkapi data diri sesuai profil kepegawaian Anda.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && (
              <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-100 text-center font-medium">
                {errors.submit}
              </div>
            )}

            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.name ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:ring-blue-500'} rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-shadow text-sm`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
            </div>

            {/* Email & Phone Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:ring-blue-500'} rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-shadow text-sm`}
                    placeholder="nama@v-com.id"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">No. Telepon</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${errors.phone ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:ring-blue-500'} rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-shadow text-sm`}
                    placeholder="08123456789"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>}
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Hak Akses (Role)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield size={18} className="text-slate-400" />
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm appearance-none bg-white dark:border-slate-800 dark:bg-slate-900"
                >
                  <option value="Admin">Administrator (Akses Penuh)</option>
                  <option value="Manager">Manager (Laporan & Viewer)</option>
                  <option value="Teknisi">Teknisi (Service & Gudang)</option>
                </select>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-2.5 border ${errors.password ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:ring-blue-500'} rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-shadow text-sm`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Konfirmasi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-2.5 border ${errors.confirmPassword ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:ring-blue-500'} rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-shadow text-sm`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors dark:hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-rose-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6 dark:text-slate-900"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Daftar Akun
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="text-center mt-6">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Sudah memiliki akun?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Login di sini
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
