'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, Shield, LogOut, LogIn
} from 'lucide-react';
import { useStore } from '@/store/store';
import { sidebarNavItems } from '@/config/navigation';
import { cn } from '@/utils/helpers';

export default function Sidebar() {
    const pathname = usePathname();
    const { user, sidebarCollapsed, toggleSidebar, login, logout } = useStore();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const filteredItems = sidebarNavItems.filter(
        item => user && item.roles.includes(user.role)
    );

    return (
        <motion.aside
            initial={false}
            animate={{ width: sidebarCollapsed ? 72 : 260 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-0 top-0 h-screen z-40 flex flex-col glass-panel border-r border-[var(--border-color)]"
        >
            {/* Logo */}
            <div className="flex items-center h-16 px-4 border-b border-[var(--border-color)]">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-neon-blue to-cyber-600 flex items-center justify-center shadow-neon-blue/20 shadow-lg">
                        <Shield className="w-5 h-5 text-white" />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <AnimatePresence>
                        {!sidebarCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="text-lg font-bold font-display gradient-text">Spam Detector</span>
                                <span className="text-[10px] block text-gray-500 -mt-1 font-mono">AI PLATFORM</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {filteredItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onMouseEnter={() => setHoveredItem(item.href)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group',
                                isActive
                                    ? 'bg-neon-blue/10 text-neon-blue'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-neon-blue dark:hover:text-gray-200 hover:bg-white/[0.03]'
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-neon-blue rounded-r-full"
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                            <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'drop-shadow-[0_0_6px_rgba(0,212,255,0.5)]')} />
                            <AnimatePresence>
                                {!sidebarCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-sm font-medium whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {item.badge && !sidebarCollapsed && (
                                <span className="ml-auto text-[10px] font-bold bg-neon-orange/20 text-neon-orange px-2 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {sidebarCollapsed && hoveredItem === item.href && (
                                <div className="absolute left-full ml-3 px-3 py-1.5 bg-[var(--bg-elevated)] text-[var(--text-primary)] text-sm rounded-lg shadow-glass whitespace-nowrap z-50 border border-[var(--border-color)]">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User & Collapse */}
            <div className="p-3 border-t border-[var(--border-color)]">
                {!sidebarCollapsed && user && (
                    <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-sm font-bold text-white">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user.name}</p>
                            <p className="text-[11px] text-[var(--text-secondary)] truncate capitalize">{user.role}</p>
                        </div>
                        <button 
                            onClick={logout}
                            className="p-1.5 rounded-lg hover:bg-neon-red/10 group/logout transition-colors"
                            title="Log Out"
                        >
                            <LogOut className="w-4 h-4 text-gray-500 group-hover/logout:text-neon-red transition-colors" />
                        </button>
                    </div>
                )}

                {!sidebarCollapsed && !user && (
                    <button
                        onClick={() => login({
                            id: 'admin-1',
                            name: 'Admin User',
                            email: 'admin@spamdetector.ai',
                            role: 'admin',
                            organization: 'Spam Detector HQ'
                        })}
                        className="w-full flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 transition-all group"
                    >
                        <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center">
                            <LogIn className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold">Login as Admin</span>
                    </button>
                )}

                {sidebarCollapsed && (
                    <div className="flex flex-col items-center gap-2 mb-2">
                        {user ? (
                            <button
                                onClick={logout}
                                className="w-9 h-9 rounded-xl hover:bg-neon-red/10 flex items-center justify-center text-gray-500 hover:text-neon-red transition-all"
                                title="Log Out"
                            >
                                <LogOut className="w-4.5 h-4.5" />
                            </button>
                        ) : (
                            <button
                                onClick={() => login({
                                    id: 'admin-1',
                                    name: 'Admin User',
                                    email: 'admin@spamdetector.ai',
                                    role: 'admin',
                                    organization: 'Spam Detector HQ'
                                })}
                                className="w-9 h-9 rounded-xl bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 flex items-center justify-center transition-all"
                                title="Login"
                            >
                                <LogIn className="w-4.5 h-4.5" />
                            </button>
                        )}
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className="w-full flex items-center justify-center py-2 rounded-xl hover:bg-white/[0.03] text-gray-500 hover:text-gray-300 transition-all"
                >
                    {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>
        </motion.aside>
    );
}
