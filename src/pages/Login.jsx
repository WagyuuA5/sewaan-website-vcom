import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { TypewriterEffect, TypewriterEffectSmooth } from '../components/ui/typewriter-effect';
import TechBackground from '../components/ui/TechBackground';
import { ShinyButton } from '../components/ui/shiny-button';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const { branding } = useSettingsStore();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    if (!formData.password) newErrors.password = 'Password wajib diisi';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Berikan jeda 300ms agar animasi tombol (framer-motion bounce) terlihat
    await new Promise(resolve => setTimeout(resolve, 300));

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setErrors({ submit: result.message });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name] || errors.submit) {
      setErrors(prev => ({ ...prev, [name]: null, submit: null }));
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
            className="h-20 w-20 bg-white p-2.5 rounded-[1.25rem] mb-10 dark:bg-slate-900 relative border border-blue-400/30 group"
          >
            <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-tr from-blue-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img src={branding.logo} alt="Logo" className="h-full w-full object-contain relative z-10 drop-shadow-sm" />
          </motion.div>
          <TypewriterEffect 
            words={branding.companyName.split(' ').map((word, idx, arr) => ({
              text: word,
              className: idx === arr.length - 1 ? "text-blue-400" : "text-white"
            }))}
            className="text-left justify-start text-3xl lg:text-4xl xl:text-5xl mb-6" 
          />
          <p className="text-slate-400 text-lg max-w-md mt-6">
            Login untuk mengakses dashboard, manajemen inventori, perbaikan, dan laporan keuangan perusahaan.
          </p>
        </div>

        <div className="relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm max-w-sm">
            <h3 className="text-white font-medium mb-3 flex items-center gap-2 dark:text-slate-900">
              <AlertCircle size={18} className="text-blue-400" />
              Demo Credentials
            </h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p><span className="text-slate-500 w-16 inline-block dark:text-slate-400">Admin:</span> admin@v-com.id / admin123</p>
              <p><span className="text-slate-500 w-16 inline-block dark:text-slate-400">Manager:</span> manager@v-com.id / manager123</p>
              <p><span className="text-slate-500 w-16 inline-block dark:text-slate-400">Teknisi:</span> teknisi@v-com.id / teknisi123</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-slate-500 text-sm mt-8 dark:text-slate-400">
            <span>&copy; {new Date().getFullYear()} {branding.companyName}</span>
            <span>•</span>
            <span>Secure System</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800"
        >
          <div className="text-center mb-8 flex flex-col items-center">
            <TypewriterEffectSmooth 
              words={[
                { text: "Selamat", className: "text-slate-800" },
                { text: "Datang", className: "text-blue-600" }
              ]} 
              className="my-0" 
            />
            <p className="text-slate-500 mt-2 text-sm dark:text-slate-400">Silakan masukkan email dan password Anda.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.submit && (
              <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-100 text-center font-medium flex items-center justify-center gap-2">
                <AlertCircle size={16} />
                {errors.submit}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">Email Akses</label>
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
                  placeholder="admin@v-com.id"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
                <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Lupa Password?
                </a>
              </div>
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
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}
            </div>

            <ShinyButton
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2 dark:text-slate-900"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Masuk ke Sistem
                  <ArrowRight size={18} />
                </>
              )}
            </ShinyButton>

            <div className="text-center mt-6">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Belum memiliki akun?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Daftar Akun
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
