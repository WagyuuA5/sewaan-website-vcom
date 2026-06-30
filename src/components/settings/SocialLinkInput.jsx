import React from 'react';
import { Link2, Trash, ExternalLink, Globe } from 'lucide-react';
import { FaGithub, FaLinkedin, FaXTwitter, FaInstagram, FaFacebook } from 'react-icons/fa6';
import { cn } from '../../lib/utils';

// Regex patterns for platform detection
const platformRegexes = {
  GitHub: /github\.com/i,
  LinkedIn: /linkedin\.com/i,
  Twitter: /(twitter\.com|x\.com)/i,
  Instagram: /instagram\.com/i,
  Facebook: /facebook\.com/i,
};

export const SocialLinkInput = ({ social, onUpdate, onRemove }) => {
  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    
    // Auto-detect platform
    let detectedPlatform = 'Website';
    for (const [platform, regex] of Object.entries(platformRegexes)) {
      if (regex.test(newUrl)) {
        detectedPlatform = platform;
        break;
      }
    }

    onUpdate(social.id, { url: newUrl, platform: detectedPlatform });
  };

  const getPlatformIcon = (platform) => {
    switch(platform) {
      case 'GitHub': return <div className="bg-slate-800 text-white p-2 rounded-lg shadow-sm dark:bg-slate-700"><FaGithub size={16} /></div>;
      case 'LinkedIn': return <div className="bg-[#0A66C2] text-white p-2 rounded-lg shadow-sm"><FaLinkedin size={16} /></div>;
      case 'Twitter': return <div className="bg-black text-white p-2 rounded-lg shadow-sm dark:bg-slate-800"><FaXTwitter size={16} /></div>;
      case 'Instagram': return <div className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white p-2 rounded-lg shadow-sm"><FaInstagram size={16} /></div>;
      case 'Facebook': return <div className="bg-[#1877F2] text-white p-2 rounded-lg shadow-sm"><FaFacebook size={16} /></div>;
      default: return <div className="bg-white text-slate-400 p-2 rounded-lg border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700"><Globe size={16} /></div>;
    }
  };

  return (
    <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
      {getPlatformIcon(social.platform)}
      <div className="flex-1 flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-20 hidden sm:block">
          {social.platform}
        </span>
        <input 
          type="url"
          value={social.url}
          onChange={handleUrlChange}
          placeholder="https://"
          className="flex-1 bg-transparent border-none text-sm outline-none text-slate-600 dark:text-slate-300 placeholder-slate-400 focus:ring-0"
          aria-label={`Tautan profil ${social.platform}`}
        />
        {social.url && (
          <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 p-1" aria-label="Buka tautan">
            <ExternalLink size={14} />
          </a>
        )}
      </div>
      <button 
        type="button"
        onClick={() => onRemove(social.id)}
        className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition cursor-pointer dark:hover:bg-red-500/10"
        aria-label="Hapus tautan sosial"
      >
        <Trash size={16} />
      </button>
    </div>
  );
};
