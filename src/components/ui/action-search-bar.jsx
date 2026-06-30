import { useState, useEffect, useMemo } from "react";
import { Input } from "./input";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Send,
    Laptop,
    Wrench,
    Users,
    Receipt,
    Settings
} from "lucide-react";

function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function ActionSearchBar({ placeholder = "Cari menu atau fitur..." }) {
    const navigate = useNavigate();

    // Default actions matching V-com Website Context
    const allActions = useMemo(() => [
        {
            id: "1",
            label: "Sewa Laptop",
            icon: <Laptop className="h-4 w-4 text-blue-500" />,
            description: "Transaksi Penyewaan",
            short: "⌘S",
            end: "Menu",
            action: () => navigate('/rentals')
        },
        {
            id: "2",
            label: "Buat Laporan Service",
            icon: <Wrench className="h-4 w-4 text-orange-500" />,
            description: "Perbaikan Perangkat",
            short: "⌘P",
            end: "Menu",
            action: () => navigate('/service')
        },
        {
            id: "3",
            label: "Manajemen Pelanggan",
            icon: <Users className="h-4 w-4 text-purple-500" />,
            description: "Database Klien",
            short: "⌘C",
            end: "Data",
            action: () => navigate('/customers')
        },
        {
            id: "4",
            label: "Lihat Invoice",
            icon: <Receipt className="h-4 w-4 text-emerald-500" />,
            description: "Tagihan Pembayaran",
            short: "⌘I",
            end: "Data",
            action: () => navigate('/invoices')
        },
        {
            id: "5",
            label: "Pengaturan Sistem",
            icon: <Settings className="h-4 w-4 text-slate-500 dark:text-slate-400" />,
            description: "Konfigurasi App",
            short: "⌘,",
            end: "Sistem",
            action: () => navigate('/settings')
        },
    ], [navigate]);

    const [query, setQuery] = useState("");
    const [result, setResult] = useState(null);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const debouncedQuery = useDebounce(query, 200);

    useEffect(() => {
        if (!isFocused) {
            // eslint-disable-next-line
            setResult(null);
            return;
        }

        if (!debouncedQuery) {
            setResult({ actions: allActions });
            return;
        }

        const normalizedQuery = debouncedQuery.toLowerCase().trim();
        const filteredActions = allActions.filter((action) => {
            const searchableText = action.label.toLowerCase();
            return searchableText.includes(normalizedQuery);
        });

        setResult({ actions: filteredActions });
    }, [debouncedQuery, isFocused, allActions]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSelectAction = (action) => {
        setSelectedAction(action);
        if (action.action) {
            action.action();
        }
        setIsFocused(false);
        setQuery("");
    };

    const container = {
        hidden: { opacity: 0, height: 0 },
        show: {
            opacity: 1,
            height: "auto",
            transition: {
                height: {
                    duration: 0.4,
                },
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            height: 0,
            transition: {
                height: {
                    duration: 0.3,
                },
                opacity: {
                    duration: 0.2,
                },
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
            },
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.2,
            },
        },
    };

    const handleFocus = () => {
        setSelectedAction(null);
        setIsFocused(true);
    };

    return (
        <div className="w-full relative z-50">
            <div className="relative flex flex-col justify-start items-center">
                <div className="w-full bg-white dark:bg-slate-900 rounded-lg">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder={placeholder}
                            value={query}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                            className="pl-4 pr-10 py-2 h-11 text-sm rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus-visible:ring-offset-0 focus-visible:ring-blue-500 focus-visible:bg-white dark:focus-visible:bg-slate-900 shadow-sm transition-all dark:bg-slate-800/40"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5">
                            <AnimatePresence mode="popLayout">
                                {query.length > 0 ? (
                                    <motion.div
                                        key="send"
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 20, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Send className="w-5 h-5 text-blue-500" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="search"
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 20, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Search className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="w-full absolute top-[110%] left-0 z-50">
                    <AnimatePresence>
                        {isFocused && result && !selectedAction && (
                            <motion.div
                                className="w-full border rounded-xl shadow-xl border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 mt-2 overflow-hidden"
                                variants={container}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                            >
                                <motion.ul className="p-2">
                                    {result.actions.map((action) => (
                                        <motion.li
                                            key={action.id}
                                            className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer rounded-lg transition-colors group dark:hover:bg-slate-950"
                                            variants={item}
                                            layout
                                            onClick={() => handleSelectAction(action)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shadow-sm dark:group-hover:bg-slate-900">
                                                    {action.icon}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 dark:text-white">
                                                        {action.label}
                                                    </span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        {action.description}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                            </div>
                                        </motion.li>
                                    ))}
                                    {result.actions.length === 0 && (
                                        <div className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                            Tidak ada perintah yang ditemukan untuk "{query}"
                                        </div>
                                    )}
                                </motion.ul>
                                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 dark:bg-slate-800/40">
                                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                                        <span>Gunakan keyboard untuk navigasi</span>
                                        <span>ESC untuk menutup</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
