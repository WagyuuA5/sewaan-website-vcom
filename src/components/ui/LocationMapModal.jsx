import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { ShinyButton } from './shiny-button';
import { Map, MapMarker, MarkerContent, MarkerLabel } from './mapcn-marker-label';
import { Search, Loader2, MapPin, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';

export default function LocationMapModal({ isOpen, onClose, initialLocation, onConfirm }) {
  const { preferences } = useSettingsStore();
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  // State for map
  const [viewport, setViewport] = useState({
    center: [initialLocation?.lng || 106.816666, initialLocation?.lat || -6.200000],
    zoom: 12
  });
  
  // State for selected location
  const [selectedLocation, setSelectedLocation] = useState({
    label: initialLocation?.label || '',
    lat: initialLocation?.lat || -6.200000,
    lng: initialLocation?.lng || 106.816666
  });

  const searchTimeoutRef = useRef(null);
  
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      const lat = initialLocation?.lat ?? -6.2;
      const lng = initialLocation?.lng ?? 106.8166;
      setViewport({ center: [lng, lat], zoom: 12 });
      setSelectedLocation({
        label: initialLocation?.label || '',
        lat,
        lng
      });
      setSearchQuery('');
      setSearchError('');
      
      // Dispatch resize event to fix 0x0 canvas bug
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    }
  }, [isOpen, initialLocation]);

  // Handle Debounced Search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setSearchError('');
      return;
    }

    setIsSearching(true);
    setSearchError('');

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=id&limit=1`,
          {
            headers: {
              'Accept-Language': 'id',
              'User-Agent': 'V-com Website Admin Dashboard'
            }
          }
        );
        
        if (!response.ok) throw new Error('Network error');
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);
          
          setViewport({ center: [lng, lat], zoom: 14 });
          setSelectedLocation({
            label: result.display_name.split(',')[0], // Get short name
            lat,
            lng
          });
        } else {
          setSearchError('Lokasi tidak ditemukan');
        }
      } catch (error) {
        setSearchError('Gagal mencari lokasi. Coba lagi.');
      } finally {
        setIsSearching(false);
      }
    }, 800); // 800ms debounce

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery]);

  const handleDragEnd = async (lngLat) => {
    setSelectedLocation({
      label: 'Mencari nama lokasi...',
      lat: lngLat.lat,
      lng: lngLat.lng
    });

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lngLat.lat}&lon=${lngLat.lng}&zoom=14`,
        {
          headers: {
            'Accept-Language': 'id',
            'User-Agent': 'V-com Website Admin Dashboard'
          }
        }
      );
      
      if (!response.ok) throw new Error('Network error');
      
      const data = await response.json();
      
      if (data && data.display_name) {
        setSelectedLocation({
          label: data.display_name.split(',')[0] || data.name || 'Titik Peta Khusus',
          lat: lngLat.lat,
          lng: lngLat.lng
        });
      } else {
        setSelectedLocation({
          label: 'Titik Peta Khusus',
          lat: lngLat.lat,
          lng: lngLat.lng
        });
      }
    } catch (error) {
      setSelectedLocation({
        label: 'Titik Peta Khusus',
        lat: lngLat.lat,
        lng: lngLat.lng
      });
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedLocation);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pilih Lokasi" size="lg">
      <div className="flex flex-col gap-4 mt-2">
        
        {/* Search Bar */}
        <div className="relative z-10">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kota, area, atau alamat di Indonesia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all dark:bg-slate-900 dark:border-slate-700 dark:focus:border-blue-500"
            />
            {isSearching && (
              <Loader2 size={16} className="absolute right-4 text-blue-500 animate-spin" />
            )}
          </div>
          {searchError && (
            <div className="absolute top-full left-0 mt-1 flex items-center gap-1.5 text-xs text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg dark:bg-rose-500/10">
              <AlertCircle size={14} /> {searchError}
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="relative h-[300px] sm:h-[400px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner bg-slate-50 dark:bg-slate-800">
          <Map 
            viewport={viewport} 
            onViewportChange={setViewport}
            theme={isDarkMode ? 'dark' : 'light'}
            className="w-full h-full"
          >
            <MapMarker 
              longitude={selectedLocation.lng} 
              latitude={selectedLocation.lat}
              draggable={true}
              onDragEnd={handleDragEnd}
              onDrag={(lngLat) => setSelectedLocation(prev => ({ ...prev, lat: lngLat.lat, lng: lngLat.lng }))}
            >
              <MarkerContent>
                <div className="w-6 h-6 -mt-3 -ml-3 cursor-grab active:cursor-grabbing rounded-full border-[3px] border-white bg-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.5)] transition-transform hover:scale-110 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                <MarkerLabel position="bottom">
                  <div className="px-2 py-1 bg-slate-900/80 backdrop-blur text-white rounded-md shadow-lg border border-slate-700/50">
                    Geser saya
                  </div>
                </MarkerLabel>
              </MarkerContent>
            </MapMarker>
          </Map>
        </div>

        {/* Selected Location Info & Manual Fallback */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 dark:bg-slate-800/50 dark:border-slate-800">
          <div className="space-y-1.5 flex-1">
            <label className="text-xs font-medium text-slate-500 flex items-center gap-1 dark:text-slate-400">
              <MapPin size={12} /> Label Lokasi
            </label>
            <input 
              type="text"
              value={selectedLocation.label}
              onChange={(e) => setSelectedLocation({...selectedLocation, label: e.target.value})}
              placeholder="Misal: Jakarta Selatan"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 outline-none focus:border-blue-500 transition-colors dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
            />
            <p className="text-[10px] text-slate-400 font-mono">
              Koordinat terpilih: {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
            </p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700">
              Batal
            </button>
            <ShinyButton onClick={handleConfirm} className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-sm">
              Konfirmasi Lokasi
            </ShinyButton>
          </div>
        </div>

      </div>
    </Modal>
  );
}
