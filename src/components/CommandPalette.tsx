'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, X } from 'lucide-react';
import { useStore } from '@/store/store';
import { sidebarNavItems } from '@/config/navigation';

export default function CommandPalette() {
    const { commandPaletteOpen, toggleCommandPalette, user } = useStore();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const filteredItems = sidebarNavItems
        .filter(item => user && item.roles.includes(user.role))
        .filter(item => item.label.toLowerCase().includes(query.toLowerCase()));

    const prevOpenRef = useRef(commandPaletteOpen);

    useEffect(() => {
        if (commandPaletteOpen && !prevOpenRef.current) {
            // Reset state and focus when newly opened
            setTimeout(() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
            }, 50);
        }
        prevOpenRef.current = commandPaletteOpen;
    }, [commandPaletteOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, filteredItems.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
            router.push(filteredItems[selectedIndex].href);
            toggleCommandPalette();
        } else if (e.key === 'Escape') {
            toggleCommandPalette();
        }
    };

    return (
        <AnimatePresence>
            {commandPaletteOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={toggleCommandPalette}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
                    >
                        <div className="glass-panel rounded-2xl shadow-glass-lg border border-white/[0.08] overflow-hidden">
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.04]">
                                <Search className="w-5 h-5 text-gray-500" />
                                <input
                                    ref={inputRef}
                                    value={query}
                                    onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search pages, actions, commands..."
                                    className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 outline-none text-sm"
                                />
                                <button
                                    onClick={toggleCommandPalette}
                                    className="p-1 rounded-lg hover:bg-white/[0.05] text-gray-500"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="max-h-80 overflow-y-auto py-2">
                                {filteredItems.length === 0 ? (
                                    <div className="px-5 py-8 text-center text-gray-500 text-sm">
                                        No results found for &ldquo;{query}&rdquo;
                                    </div>
                                ) : (
                                    filteredItems.map((item, i) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.href}
                                                onClick={() => {
                                                    router.push(item.href);
                                                    toggleCommandPalette();
                                                }}
                                                onMouseEnter={() => setSelectedIndex(i)}
                                                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${i === selectedIndex
                                                        ? 'bg-neon-blue/10 text-neon-blue'
                                                        : 'text-gray-400 hover:bg-white/[0.02]'
                                                    }`}
                                            >
                                                <Icon className="w-4.5 h-4.5" />
                                                <span className="flex-1 text-sm font-medium">{item.label}</span>
                                                {i === selectedIndex && <ArrowRight className="w-4 h-4" />}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                            <div className="px-5 py-3 border-t border-white/[0.04] flex items-center gap-4 text-[11px] text-gray-600">
                                <span><kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] font-mono">↑↓</kbd> Navigate</span>
                                <span><kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] font-mono">↵</kbd> Open</span>
                                <span><kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] font-mono">Esc</kbd> Close</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
