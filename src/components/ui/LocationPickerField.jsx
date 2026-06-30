import React, { useState } from 'react';
import { MapPin, ExternalLink, Map } from 'lucide-react';
import LocationMapModal from './LocationMapModal';

/**
 * LocationPickerField
 * 
 * Props:
 *  - label: string (e.g. "Lokasi *")
 *  - value: string | { label, lat, lng } – current location value
 *  - onChange: (newValue: { label, lat, lng }) => void
 *  - placeholder: string
 *  - className: string (extra wrapper classes)
 */
export default function LocationPickerField({ label, value, onChange, placeholder = 'Pilih lokasi di peta...', className = '' }) {
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Normalise value: could be plain string (legacy) or object {label, lat, lng}
  const locationObj = typeof value === 'object' && value !== null ? value : null;
  const displayLabel = locationObj?.label || (typeof value === 'string' ? value : '');

  // Build Google Maps link when coords are available
  const googleMapsUrl = locationObj?.lat && locationObj?.lng
    ? `https://www.google.com/maps?q=${locationObj.lat},${locationObj.lng}`
    : displayLabel
      ? `https://www.google.com/maps/search/${encodeURIComponent(displayLabel)}`
      : null;

  const handleConfirm = (loc) => {
    onChange(loc);
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsMapOpen(true)}
        className="w-full flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-left transition hover:border-blue-400 hover:bg-blue-50/30 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-slate-800/40 dark:border-slate-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/10"
      >
        <MapPin size={15} className="text-blue-500 shrink-0" />
        {displayLabel ? (
          <span className="flex-1 truncate text-slate-800 dark:text-slate-200 font-medium">
            {displayLabel}
          </span>
        ) : (
          <span className="flex-1 text-slate-400">{placeholder}</span>
        )}
        <Map size={14} className="text-slate-400 shrink-0" />
      </button>

      {/* Google Maps link (shown when location is set) */}
      {googleMapsUrl && (
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 hover:underline transition-colors mt-0.5"
        >
          <ExternalLink size={10} />
          Lihat di Google Maps
        </a>
      )}

      {/* Map Modal */}
      <LocationMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        initialLocation={locationObj}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
