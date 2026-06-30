import { useState, useEffect, Suspense, lazy } from 'react';
import { ShinyButton } from '../components/ui/shiny-button';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { APP_VERSION, CURRENT_YEAR } from '../constants/app';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useProfileStore } from '../store/useProfileStore';
import { useToast } from '../components/ui/Toast';
import { AssistedPasswordConfirmation } from '../components/ui/assisted-password-confirmation';
import DeleteAccountModal from '../components/ui/DeleteAccountModal';
import TwoFactorModal from '../components/ui/TwoFactorModal';
import { toast } from 'sonner';
import { 
  User, Cog, Camera, MapPin, Link as LinkIcon, Trash, 
  Download, Shield, Eye, EyeOff, Loader2, AlertTriangle, Eraser, 
  Check, X, Calendar, BadgeCheck, Lock, Bell, Palette, Info, ExternalLink, Smartphone
} from 'lucide-react';
import { calculatePasswordStrength } from '../utils/passwordStrength';
import { SocialLinkInput } from '../components/settings/SocialLinkInput';

const LocationMapModal = lazy(() => import('../components/ui/LocationMapModal'));

const ToggleSwitch = ({ label, desc, checked, onChange, disabled, title }) => (
  <div className={`flex items-center justify-between ${disabled ? 'opacity-60' : ''}`} title={title}>
    <div>
      <h4 className="font-medium text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">{label}</h4>
      <p className="text-xs text-slate-500 mt-0.5 dark:text-slate-400">{desc}</p>
    </div>
    <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input type="checkbox" className="sr-only peer" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:bg-slate-700 dark:peer-checked:after:border-slate-900 dark:after:bg-slate-900 dark:after:border-slate-600 peer-disabled:bg-slate-300 dark:peer-disabled:bg-slate-800"></div>
    </label>
  </div>
);

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const { profile, updateProfile, addSocial, updateSocial, removeSocial, resetProfile } = useProfileStore();
  const { preferences, updatePreferences } = useSettingsStore();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('settings');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Profile Form States
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    role: profile.role,
    bio: profile.bio,
    location: profile.location
  });

  // Validation States
  const [touched, setTouched] = useState({ email: false, phone: false });
  
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^(?:\+62|62|08)[0-9]{7,13}$/.test(phone);
  
  const isEmailValid = validateEmail(formData.email);
  const isPhoneValid = !formData.phone || validatePhone(formData.phone); // Optional, but if filled must be valid

  // Auto-clean old coordinate data
  useEffect(() => {
    if (/^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(formData.location)) {
      setFormData(prev => ({...prev, location: ''}));
    }
  }, []);

  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const availablePlatforms = ['GitHub', 'LinkedIn', 'Twitter', 'Instagram', 'Facebook', 'Website']
    .filter(p => !profile.socials.find(s => s.platform === p));

  const handleAddSocial = (platform) => {
    let url = '';
    switch(platform) {
      case 'GitHub': url = 'https://github.com/'; break;
      case 'LinkedIn': url = 'https://linkedin.com/in/'; break;
      case 'Twitter': url = 'https://twitter.com/'; break;
      case 'Instagram': url = 'https://instagram.com/'; break;
      case 'Facebook': url = 'https://facebook.com/'; break;
      default: url = 'https://'; break;
    }
    addSocial(platform, url);
    setIsAddingSocial(false);
  };

  useEffect(() => {
    // eslint-disable-next-line
    setFormData(profile);
  }, [profile]);

  // Handle tab change from location state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const isUnsaved = JSON.stringify(formData) !== JSON.stringify(profile);

  // Handle unsaved changes guard
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isUnsaved) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isUnsaved]);

  // Debounce bio auto-save (Optional enhancement)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.bio !== profile.bio) {
        updateProfile({ bio: formData.bio });
        showToast('Bio tersimpan otomatis', 'info');
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData.bio, profile.bio, updateProfile, showToast]);

  // Password States
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [logoutAll, setLogoutAll] = useState(false);
  const [isUpdatingPw, setIsUpdatingPw] = useState(false);

  // Profile Actions
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Ukuran file maksimal 2MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => updateProfile({ avatar: event.target.result });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    if (!isEmailValid || !isPhoneValid) {
      showToast('Mohon perbaiki data yang tidak valid', 'error');
      setTouched({ email: true, phone: true });
      return;
    }
    
    setIsSaving(true);
    setTimeout(() => {
      updateProfile(formData);
      setIsSaving(false);
      showToast('Profil berhasil diperbarui!', 'success');
      // No navigation, stay on settings
    }, 600);
  };

  const handleResetProfile = () => {
    setFormData(profile);
    setTouched({ email: false, phone: false });
    showToast('Perubahan dibatalkan', 'info');
  };

  // Password Strength Logic
  const pwData = calculatePasswordStrength(newPw);

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (oldPw !== 'admin123') {
      showToast('Password lama salah! (hint: admin123)', 'error');
      return;
    }
    if (newPw !== confirmPw) {
      showToast('Konfirmasi password tidak cocok!', 'error');
      return;
    }
    if (pwData.score <= 4) {
      showToast('Password baru harus kuat!', 'warning');
      return;
    }

    setIsUpdatingPw(true);
    setTimeout(() => {
      showToast('Password berhasil diupdate!', 'success');
      if (logoutAll) {
        setTimeout(() => showToast('Berhasil logout dari perangkat lain', 'info'), 1000);
      }
      setOldPw('');
      setNewPw('');
      setConfirmPw('');
      setIsUpdatingPw(false);
    }, 800);
  };

  // Preferences Actions
  const handlePrefChange = (key, value) => {
    updatePreferences({ [key]: value });
  };

  const handleExportData = () => {
    const dataObj = { 
      profile, 
      preferences, 
      metadata: { exportedAt: new Date().toISOString() } 
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataObj, null, 2));
    const downloadAnchorNode = document.createElement('a');
    
    // YYYY-MM-DD timestamp
    const dateStr = new Date().toISOString().split('T')[0];
    
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `export-data-${dateStr}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showToast('Data berhasil diekspor', 'success');
  };

  const handleClearCache = () => {
    if (window.confirm('Anda yakin ingin menghapus cache lokal (pengaturan tema, draf)? Data akun Anda akan tetap aman.')) {
      // Hanya hapus state non-kritis
      localStorage.removeItem('vcom-theme-store');
      localStorage.removeItem('vcom_settings');
      // Biarkan vcom_token dan vcom_user (Auth) serta vcom_profile tetap ada
      window.location.reload();
    }
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    showToast('Akun berhasil dihapus. Mengalihkan...', 'success');
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 1500);
  };

  return (
    <PageWrapper 
      title={activeTab === 'profile' ? 'Profil Saya' : 'Pengaturan'} 
      subtitle="Kelola profil Anda dan konfigurasi aplikasi"
      showBackButton={true}
    >
      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-2 dark:border-slate-800">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <User size={18} /> Profil Saya
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <Cog size={18} /> Pengaturan
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Kolom Kiri: Identity Card (Sticky) */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col items-center text-center dark:bg-slate-900 dark:border-slate-800">
            <div className="relative group cursor-pointer mb-5" onClick={() => document.getElementById('avatar-upload').click()}>
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg dark:border-slate-900" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-bold text-4xl border-4 border-white shadow-lg dark:border-slate-900">
                  {formData.name.substring(0,2).toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" title="Online"></div>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <input type="file" id="avatar-upload" accept="image/png, image/jpeg" className="hidden" onChange={handleImageUpload} />
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{formData.name || 'Nama Pengguna'}</h2>
            
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Lock size={12} className="text-slate-400" />
              {profile.role}
            </div>

            <div className="w-full h-px bg-slate-100 my-5 dark:bg-slate-800"></div>

            <div className="w-full space-y-4 text-left">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <BadgeCheck size={16} className="text-emerald-500" /> Email
                </span>
                <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md dark:bg-emerald-500/10 dark:text-emerald-400">Terverifikasi</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Calendar size={16} /> Bergabung
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{profile.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Edit Forms */}
          <div className="lg:col-span-2 space-y-6 pb-24">
            <form id="profile-form" onSubmit={handleSaveProfile} className="space-y-6">
              
              {/* Panel 1: Identitas & Kontak */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <h3 className="text-lg font-semibold mb-6">Identitas & Kontak</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Nama Lengkap <span className="text-red-500">*</span></label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition dark:border-slate-700 dark:bg-slate-800/50" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Alamat Email <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input 
                        required 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        onBlur={() => setTouched({ ...touched, email: true })}
                        className={`w-full px-4 py-2.5 pr-10 rounded-xl border outline-none transition dark:bg-slate-800/50 ${
                          touched.email 
                            ? isEmailValid ? 'border-emerald-500 focus:ring-emerald-500 focus:ring-1' : 'border-rose-500 focus:ring-rose-500 focus:ring-1'
                            : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700'
                        }`} 
                      />
                      {touched.email && (
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          {isEmailValid ? <Check size={18} className="text-emerald-500" /> : <X size={18} className="text-rose-500" />}
                        </div>
                      )}
                    </div>
                    {touched.email && !isEmailValid && <p className="text-xs text-rose-500 mt-1">Format email tidak valid</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Nomor Telepon</label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                        onBlur={() => setTouched({ ...touched, phone: true })}
                        placeholder="Contoh: 081234567890" 
                        className={`w-full px-4 py-2.5 pr-10 rounded-xl border outline-none transition dark:bg-slate-800/50 ${
                          touched.phone && formData.phone
                            ? isPhoneValid ? 'border-emerald-500 focus:ring-emerald-500 focus:ring-1' : 'border-rose-500 focus:ring-rose-500 focus:ring-1'
                            : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700'
                        }`} 
                      />
                      {touched.phone && formData.phone && (
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          {isPhoneValid ? <Check size={18} className="text-emerald-500" /> : <X size={18} className="text-rose-500" />}
                        </div>
                      )}
                    </div>
                    {touched.phone && formData.phone && !isPhoneValid && <p className="text-xs text-rose-500 mt-1">Gunakan format Indonesia (+62 atau 08)</p>}
                  </div>

                  <div className="space-y-1.5 md:col-span-2 mt-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Lokasi / Area Domisili</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-3 text-slate-400" />
                      <button 
                        type="button"
                        onClick={() => setIsMapModalOpen(true)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-left outline-none transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800"
                      >
                        {formData.location?.label ? (
                          <span className="text-slate-800 dark:text-slate-200 font-medium">{formData.location.label}</span>
                        ) : typeof formData.location === 'string' ? (
                          <span className="text-slate-800 dark:text-slate-200 font-medium">{formData.location}</span>
                        ) : (
                          <span className="text-slate-400">Pilih lokasi di peta...</span>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">Menuliskan kota tempat Anda berada akan membantu sinkronisasi data cabang.</p>
                  </div>
                </div>
              </div>

              {/* Panel 2: Tentang Saya */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-semibold">Tentang Saya</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                    formData.bio.length > 195 ? 'bg-rose-100 text-rose-600' :
                    formData.bio.length > 180 ? 'bg-amber-100 text-amber-600' :
                    'text-slate-400'
                  }`}>
                    {formData.bio.length}/200
                  </span>
                </div>
                <textarea 
                  maxLength={200} 
                  rows="4" 
                  value={formData.bio} 
                  onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                  placeholder="Tuliskan bio singkat tentang peran dan tanggung jawab Anda..."
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-1 outline-none resize-none transition dark:bg-slate-800/50 ${
                    formData.bio.length > 195 ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500 dark:border-rose-800' :
                    formData.bio.length > 180 ? 'border-amber-300 focus:border-amber-500 focus:ring-amber-500 dark:border-amber-800' :
                    'border-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
                  }`}
                ></textarea>
              </div>
            </form>

            {/* Social Links Panel */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Tautan Sosial Media</h3>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`h-1.5 w-4 rounded-full ${i <= profile.socials.length ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-500 ml-1">{profile.socials.length}/5</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {profile.socials.map((social) => (
                  <SocialLinkInput 
                    key={social.id} 
                    social={social} 
                    onUpdate={updateSocial} 
                    onRemove={removeSocial} 
                  />
                ))}
              </div>
              
              {profile.socials.length < 5 && (
                <div className="relative mt-5">
                  {!isAddingSocial ? (
                    <ShinyButton type="button" onClick={() => setIsAddingSocial(true)} className="w-full px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2 dark:border-slate-700 dark:hover:bg-slate-800">
                      + Tambah Sosial Media Baru
                    </ShinyButton>
                  ) : (
                    <div className="p-4 border-2 border-slate-200 rounded-xl bg-slate-50 dark:bg-slate-800 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Pilih Platform</p>
                        <button onClick={() => setIsAddingSocial(false)} className="text-slate-400 hover:text-rose-500"><X size={16} /></button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availablePlatforms.map(p => (
                          <button 
                            key={p} 
                            type="button"
                            onClick={() => handleAddSocial(p)}
                            className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-500"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
          
          {/* Sticky Save Bar */}
          {isUnsaved && (
            <div className="fixed bottom-0 inset-x-0 md:left-64 z-[40] pointer-events-none p-4 pb-6 flex justify-center animate-in slide-in-from-bottom-10 duration-300">
              <div className="bg-slate-900/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 pointer-events-auto border border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-white">Anda memiliki perubahan yang belum disimpan</p>
                  <p className="text-xs text-slate-400">Simpan perubahan profil Anda sekarang.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleResetProfile} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition">Batal</button>
                  <ShinyButton 
                    onClick={handleSaveProfile} 
                    disabled={isSaving} 
                    className="px-6 py-2.5 rounded-xl font-medium text-slate-900 bg-white hover:bg-slate-100 transition flex items-center justify-center gap-2 min-w-[150px]"
                  >
                    {isSaving ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</> : 'Simpan'}
                  </ShinyButton>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-2 items-start gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          <div className="space-y-6">
            {/* Preferensi Akun */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <h3 className="text-lg font-semibold mb-6 border-b border-slate-100 pb-3 flex items-center gap-2 text-slate-800 dark:border-slate-800 dark:text-slate-100">
                <Bell size={20} className="text-blue-500" /> Preferensi Akun & Notifikasi
              </h3>
              
              <div className="space-y-6">
                <ToggleSwitch 
                  label="Notifikasi Email" 
                  desc="Terima laporan harian dan aktivitas penting via email."
                  checked={preferences.emailNotif}
                  onChange={(val) => handlePrefChange('emailNotif', val)}
                />
                <ToggleSwitch 
                  label="Notifikasi Push" 
                  desc="Notifikasi real-time di dalam aplikasi."
                  checked={preferences.pushNotif}
                  onChange={(val) => handlePrefChange('pushNotif', val)}
                />
                <ToggleSwitch 
                  label={<><Lock size={14} className="text-slate-400"/> Notifikasi dari Administrator</>} 
                  desc="Pengumuman penting terkait pembaruan sistem."
                  checked={true}
                  disabled={true}
                  title="Wajib aktif oleh sistem"
                  onChange={() => {}}
                />

                <hr className="border-slate-100 dark:border-slate-800" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Bahasa Antarmuka</label>
                    <select value={preferences.language} onChange={(e) => handlePrefChange('language', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 dark:border-slate-800">
                      <option value="id">Indonesia</option>
                      <option value="en">English (US)</option>
                      <option value="ar">العربية (Arabic)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Zona Waktu</label>
                    <select value={preferences.timezone} onChange={(e) => handlePrefChange('timezone', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 dark:border-slate-800">
                      <option value="WIB">WIB (Asia/Jakarta)</option>
                      <option value="WITA">WITA (Asia/Makassar)</option>
                      <option value="WIT">WIT (Asia/Jayapura)</option>
                    </select>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Frekuensi Email Laporan</label>
                    <select value={preferences.emailFreq} onChange={(e) => handlePrefChange('emailFreq', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 dark:border-slate-800">
                      <option value="realtime">Realtime (Langsung)</option>
                      <option value="daily">Rekap Harian</option>
                      <option value="weekly">Rekap Mingguan</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferensi Tampilan */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <h3 className="text-lg font-semibold mb-6 border-b border-slate-100 pb-3 flex items-center gap-2 text-slate-800 dark:border-slate-800 dark:text-slate-100">
                <Palette size={20} className="text-purple-500" /> Preferensi Tampilan
              </h3>
              <div className="space-y-6">

                <div className="space-y-3">
                  <ToggleSwitch 
                    label="Animasi Antarmuka" 
                    desc="Aktifkan efek transisi dan hover yang halus."
                    checked={preferences.animationsEnabled}
                    onChange={(val) => handlePrefChange('animationsEnabled', val)}
                  />
                  <div className="pl-1">
                    <button type="button" className={`px-4 py-1.5 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100 hover:scale-105 ${preferences.animationsEnabled ? 'transition-all duration-300' : ''} dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50 dark:hover:bg-blue-900/40`}>
                      Coba Sorot Tombol Ini
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-sm font-medium text-slate-700 block mb-2 dark:text-slate-200">Ukuran Teks (Font Size)</label>
                  <select value={preferences.fontSize} onChange={(e) => handlePrefChange('fontSize', e.target.value)} className="w-full md:w-1/2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 dark:border-slate-800">
                    <option value="text-sm">Kecil (14px)</option>
                    <option value="text-base">Sedang (16px) - Default</option>
                    <option value="text-lg">Besar (18px)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Keamanan */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <Shield size={20} className="text-blue-500" /> Keamanan
                </h3>
              </div>
              
              <div className="mb-5 text-xs text-slate-500 flex items-center gap-1.5 dark:text-slate-400">
                <Calendar size={14} />
                <span>Password terakhir diubah: 3 bulan lalu</span>
                {/* // TODO: connect to real lastPasswordChange timestamp */}
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-1 relative">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Password Saat Ini</label>
                  <div className="relative">
                    <input type={showOldPw ? "text" : "password"} required minLength={6} value={oldPw} onChange={e=>setOldPw(e.target.value)} className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800/50" />
                    <button type="button" aria-label={showOldPw ? "Sembunyikan password" : "Tampilkan password"} onClick={()=>setShowOldPw(!showOldPw)} className="absolute right-3 top-[11px] text-slate-400 hover:text-slate-600 transition-colors dark:hover:text-slate-300">
                      {showOldPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1 relative">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Password Baru</label>
                  <div className="relative">
                    <input type={showNewPw ? "text" : "password"} required minLength={8} value={newPw} onChange={e=>setNewPw(e.target.value)} className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800/50" />
                    <button type="button" aria-label={showNewPw ? "Sembunyikan password" : "Tampilkan password"} onClick={()=>setShowNewPw(!showNewPw)} className="absolute right-3 top-[11px] text-slate-400 hover:text-slate-600 transition-colors dark:hover:text-slate-300">
                      {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden dark:bg-slate-800">
                    <div className={`h-full transition-all duration-300 ${pwData.color}`} style={{ width: pwData.width }}></div>
                  </div>
                  <p className={`text-xs mt-1 ${pwData.labelColor} transition-colors duration-300`}>{pwData.label}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Min 8 karakter, huruf besar, kecil & angka.</p>
                </div>

                <div className="space-y-1 relative pt-2">
                  <label className="text-sm font-medium text-slate-700 block mb-2 dark:text-slate-200">Konfirmasi Password Baru</label>
                  <div className="relative">
                    <input type={showNewPw ? "text" : "password"} required minLength={8} value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} className={`w-full pl-4 pr-12 py-2.5 rounded-xl border text-sm outline-none focus:ring-1 transition-colors dark:bg-slate-800/50 ${confirmPw.length > 0 && newPw !== confirmPw ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-800' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-800'}`} />
                    <button type="button" aria-label={showNewPw ? "Sembunyikan password" : "Tampilkan password"} onClick={()=>setShowNewPw(!showNewPw)} className="absolute right-3 top-[11px] text-slate-400 hover:text-slate-600 transition-colors dark:hover:text-slate-300">
                      {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {confirmPw.length > 0 && newPw !== confirmPw && <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>}
                </div>

                <div className="flex items-start gap-2.5 pt-3">
                  <label className="relative flex cursor-pointer items-center rounded-full pt-0.5">
                    <input type="checkbox" className="peer sr-only" id="logout-all" checked={logoutAll} onChange={e=>setLogoutAll(e.target.checked)} />
                    <div className="h-5 w-5 rounded border border-slate-300 bg-white transition-all peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:peer-checked:border-blue-500 dark:peer-checked:bg-blue-500"></div>
                    <Check size={14} className="absolute left-[3px] top-[5px] text-white opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={3} />
                  </label>
                  <label htmlFor="logout-all" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer pt-0.5 select-none">Logout dari semua perangkat yang terhubung</label>
                </div>

                <button 
                  type="submit" 
                  disabled={isUpdatingPw || !oldPw || !newPw || newPw !== confirmPw || pwData.score < 2} 
                  className="w-full py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 mt-4 dark:text-slate-900 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
                >
                  {isUpdatingPw ? <><Loader2 size={18} className="animate-spin" /> Mengupdate...</> : 'Update Password'}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="pr-4">
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2 dark:text-slate-100">
                      <Smartphone size={18} className="text-blue-500" /> Autentikasi 2 Langkah (2FA)
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
                      Amankan akun Anda dengan aplikasi authenticator (Google Authenticator, Authy, dll).
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap ${profile.isTwoFactorEnabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {profile.isTwoFactorEnabled ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                
                {profile.isTwoFactorEnabled ? (
                  <button type="button" onClick={() => setIsTwoFactorModalOpen(true)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300">
                    Kelola 2FA
                  </button>
                ) : (
                  <button type="button" onClick={() => setIsTwoFactorModalOpen(true)} className="px-4 py-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium rounded-xl transition dark:bg-blue-900/20 dark:border-blue-900/50 dark:hover:bg-blue-900/40 dark:text-blue-400">
                    Aktifkan 2FA
                  </button>
                )}
              </div>
            </div>

            {/* Data & Privacy */}
            <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm dark:bg-slate-900">
              <h3 className="text-lg font-semibold mb-6 border-b border-red-50 pb-3 flex items-center gap-2 text-red-600">
                <AlertTriangle size={20} /> Data & Privasi
              </h3>
              
              <div className="space-y-4">
                <div>
                  <ToggleSwitch 
                    label="Statistik Anonim" 
                    desc="Izinkan pengumpulan data performa anonim."
                    checked={preferences.analytics}
                    onChange={(val) => handlePrefChange('analytics', val)}
                  />
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-[10px] text-blue-500 hover:underline inline-block mt-1.5 ml-1">Pelajari kebijakan privasi kami</a>
                </div>

                <button onClick={handleExportData} className="w-full text-left px-4 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition flex items-center gap-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50">
                  <Download size={16} className="text-slate-500 dark:text-slate-400" /> Ekspor Data Saya (JSON)
                </button>

                <button onClick={() => { if(window.confirm('Apakah Anda yakin ingin menghapus semua data lokal? Anda harus login ulang.')) handleClearCache(); }} className="w-full text-left px-4 py-2.5 border border-orange-200 bg-orange-50 text-orange-600 rounded-xl text-sm font-medium hover:bg-orange-100 transition flex items-center gap-2 dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-400 dark:hover:bg-orange-500/20">
                  <Eraser size={16} /> Hapus Semua Data Lokal
                </button>

                <div className="mt-6 pt-6 border-t border-red-100 dark:border-red-900/30">
                  <button onClick={() => setIsDeleteModalOpen(true)} className="w-full text-left px-4 py-2.5 border border-red-200 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition flex items-center gap-2 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/20">
                    <Trash size={16} /> Hapus Akun Permanen
                  </button>
                </div>
              </div>
            </div>

            {/* Tentang & Bantuan */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <h3 className="text-lg font-semibold mb-6 border-b border-slate-100 pb-3 flex items-center gap-2 text-slate-800 dark:border-slate-800 dark:text-slate-100">
                <Info size={20} className="text-blue-500" /> Tentang & Bantuan
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm pb-4 border-b border-slate-50 dark:border-slate-800/50">
                  <span className="text-slate-600 dark:text-slate-400">Versi Aplikasi</span>
                  <span className="font-medium text-slate-800 px-2.5 py-1 bg-slate-100 rounded-lg dark:bg-slate-800 dark:text-slate-200">{APP_VERSION}</span>
                </div>

                <div className="flex flex-col gap-1.5 pt-1">
                  <Link to="/help/docs" className="text-sm text-slate-600 hover:text-blue-600 flex items-center justify-between py-2 transition-colors dark:text-slate-400 dark:hover:text-blue-400">
                    <span>Dokumentasi Pengguna</span>
                    <ExternalLink size={14} className="opacity-50" />
                  </Link>
                  <Link to="/help/faq" className="text-sm text-slate-600 hover:text-blue-600 flex items-center justify-between py-2 transition-colors dark:text-slate-400 dark:hover:text-blue-400">
                    <span>Pertanyaan Umum (FAQ)</span>
                    <ExternalLink size={14} className="opacity-50" />
                  </Link>
                  <a href="mailto:support@v-com.id" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-blue-600 flex items-center justify-between py-2 transition-colors dark:text-slate-400 dark:hover:text-blue-400">
                    <span>Hubungi Support</span>
                    <ExternalLink size={14} className="opacity-50" />
                  </a>
                </div>

                <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-50 dark:border-slate-800/50">
                  <Link to="/legal/terms" className="text-xs text-slate-500 hover:text-slate-700 py-1 transition-colors dark:text-slate-400 dark:hover:text-slate-300">Syarat & Ketentuan</Link>
                  <Link to="/legal/privacy" className="text-xs text-slate-500 hover:text-slate-700 py-1 transition-colors dark:text-slate-400 dark:hover:text-slate-300">Kebijakan Privasi</Link>
                </div>

                <div className="pt-6 text-center">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    &copy; {CURRENT_YEAR} V-com Website. All rights reserved.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      <DeleteAccountModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDeleteAccount}
      />

      <TwoFactorModal
        isOpen={isTwoFactorModalOpen}
        onClose={() => setIsTwoFactorModalOpen(false)}
        isEnabled={profile.isTwoFactorEnabled}
        onToggle={(enabled) => updateProfile({ isTwoFactorEnabled: enabled })}
      />

      {isMapModalOpen && (
        <Suspense fallback={null}>
          <LocationMapModal 
            isOpen={isMapModalOpen}
            onClose={() => setIsMapModalOpen(false)}
            initialLocation={formData.location}
            onConfirm={(locationData) => {
              setFormData({ ...formData, location: locationData });
              setIsMapModalOpen(false);
            }}
          />
        </Suspense>
      )}

    </PageWrapper>
  );
}
