'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';
import { publicNavItems } from '@/config/navigation';
import { cn } from '@/utils/helpers';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-surface-900">
            {/* Navbar */}
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    scrolled ? 'glass border-b border-white/[0.04]' : 'bg-transparent'
                )}
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-blue to-cyber-600 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold font-display gradient-text">Spam Detector AI</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {publicNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'text-sm font-medium transition-colors relative py-1',
                                    pathname === item.href ? 'text-neon-blue' : 'text-gray-400 hover:text-gray-200'
                                )}
                            >
                                {item.label}
                                {pathname === item.href && (
                                    <motion.div
                                        layoutId="public-nav"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-blue rounded-full"
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/login" className="btn-secondary text-sm px-5 py-2">
                            Sign In
                        </Link>
                        <Link href="/dashboard" className="btn-primary text-sm px-5 py-2 flex items-center gap-2">
                            Dashboard <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-400">
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden glass border-t border-white/[0.04] overflow-hidden"
                        >
                            <div className="px-6 py-4 space-y-3">
                                {publicNavItems.map(item => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="block text-sm text-gray-400 hover:text-gray-200 py-2"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <Link href="/login" className="block btn-primary text-center text-sm py-2.5 mt-4">
                                    Sign In
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Main */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t border-white/[0.04] py-12 mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neon-blue to-cyber-600 flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-bold font-display gradient-text">Spam Detector</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                AI-powered cybersecurity platform for enterprise spam, phishing, and fraud detection.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-3">Product</h4>
                            <div className="space-y-2">
                                {['Features', 'Pricing', 'Detection Lab', 'API Hub'].map(item => (
                                    <a key={item} className="block text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">{item}</a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-3">Company</h4>
                            <div className="space-y-2">
                                {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                                    <a key={item} className="block text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">{item}</a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-3">Security</h4>
                            <div className="space-y-2">
                                {['SOC 2', 'GDPR', 'Privacy', 'Terms'].map(item => (
                                    <a key={item} className="block text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">{item}</a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 pt-6 border-t border-white/[0.04] text-center text-xs text-gray-600">
                        © 2026 Spam Detector AI. All rights reserved. Built with enterprise-grade security.
                    </div>
                </div>
            </footer>
        </div>
    );
}
