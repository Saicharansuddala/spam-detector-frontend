'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Bell, Command, Sun, Moon, ChevronRight,
    AlertTriangle, Info, CheckCircle
} from 'lucide-react';
import { useStore } from '@/store/store';
import { cn, timeAgo } from '@/utils/helpers';

export default function Navbar() {
    const pathname = usePathname();
    const { user, theme, toggleTheme, notifications, logout, toggleCommandPalette, sidebarCollapsed } = useStore();
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Build breadcrumbs
    const pathParts = pathname.split('/').filter(Boolean);
    const breadcrumbs = pathParts.map((part, i) => ({
        label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
        href: '/' + pathParts.slice(0, i + 1).join('/'),
    }));




    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggleCommandPalette();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleCommandPalette]);

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const notifIcon = (type: string) => {
        switch (type) {
            case 'danger': return <AlertTriangle className="w-4 h-4 text-neon-red" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-neon-orange" />;
            case 'success': return <CheckCircle className="w-4 h-4 text-neon-green" />;
            default: return <Info className="w-4 h-4 text-neon-blue" />;
        }
    };

    return (
        <header
            className={cn(
                'sticky top-0 z-30 h-16 flex items-center justify-between px-6 glass border-b border-[var(--border-color)] transition-all duration-300',
                sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'
            )}
        >
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, i) => (
                    <React.Fragment key={crumb.href}>
                        {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-600" />}
                        <Link
                            href={crumb.href}
                            className={cn(
                                'transition-colors',
                                i === breadcrumbs.length - 1
                                    ? 'text-[var(--text-primary)] font-semibold'
                                    : 'text-[var(--text-secondary)] hover:text-neon-blue'
                            )}
                        >
                            {crumb.label}
                        </Link>
                    </React.Fragment>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {/* Search */}
                <button
                    onClick={() => toggleCommandPalette()}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-neon-blue/30 transition-all text-sm"
                >
                    <Search className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Search...</span>
                    <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.05] text-[10px] font-mono">
                        <Command className="w-2.5 h-2.5" />K
                    </kbd>
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-white/[0.05] text-gray-400 hover:text-gray-200 transition-all"
                >
                    {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
                </button>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setNotifOpen(!notifOpen)}
                        className="relative p-2 rounded-lg hover:bg-white/[0.05] text-gray-400 hover:text-gray-200 transition-all"
                    >
                        <Bell className="w-4.5 h-4.5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-neon-red text-white text-[9px] font-bold flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {notifOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-full mt-2 w-80 glass-panel rounded-2xl shadow-glass-lg border border-white/[0.06] overflow-hidden"
                            >
                                <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-200">Notifications</h3>
                                    <span className="text-[11px] text-neon-blue font-medium">{unreadCount} new</span>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={cn(
                                                'flex gap-3 p-4 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors cursor-pointer',
                                                !notif.read && 'bg-neon-blue/[0.02]'
                                            )}
                                        >
                                            <div className="mt-0.5">{notifIcon(notif.type)}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-200">{notif.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                                                <p className="text-[10px] text-gray-600 mt-1">{timeAgo(notif.timestamp)}</p>
                                            </div>
                                            {!notif.read && (
                                                <div className="w-2 h-2 rounded-full bg-neon-blue mt-2 flex-shrink-0" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t border-white/[0.04]">
                                    <button className="w-full text-center text-xs text-neon-blue hover:text-neon-blue/80 font-medium">
                                        View all notifications
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* User Profile */}
                {user && (
                    <div className="relative ml-2 pl-2 border-l border-[var(--border-color)]" ref={profileRef}>
                        <button 
                            onClick={() => setProfileOpen(!profileOpen)}
                            className={cn(
                                "w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg",
                                profileOpen && "ring-2 ring-neon-blue/20 ring-offset-2 ring-offset-[var(--bg-primary)]"
                            )}
                        >
                            {user.name.charAt(0)}
                        </button>

                        <AnimatePresence>
                            {profileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 top-full mt-2 w-56 glass-panel rounded-2xl shadow-glass-lg border border-[var(--border-color)] overflow-hidden z-50 p-1"
                                >
                                    <div className="px-3 py-3 border-b border-[var(--border-color)] mb-1">
                                        <p className="text-sm font-bold text-[var(--text-primary)]">{user.name}</p>
                                        <p className="text-[11px] text-[var(--text-secondary)] truncate">{user.email}</p>
                                    </div>
                                    
                                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.05] transition-all">
                                        <AlertTriangle className="w-3.5 h-3.5" /> Account Details
                                    </button>
                                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.05] transition-all">
                                        <Bell className="w-3.5 h-3.5" /> Preferences
                                    </button>
                                    <div className="h-px bg-[var(--border-color)] my-1" />
                                    <button 
                                        onClick={() => {
                                            logout();
                                            setProfileOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs text-neon-red hover:bg-neon-red/10 transition-all font-medium"
                                    >
                                        <Sun className="w-3.5 h-3.5 rotate-180" /> Log Out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </header>
    );
}
