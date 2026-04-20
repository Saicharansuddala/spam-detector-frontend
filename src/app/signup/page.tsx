'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, User, ArrowRight, Building, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { ENDPOINTS } from '@/config/api';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        organization: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(ENDPOINTS.AUTH.SIGNUP, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess(true);
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                setError(data.detail || 'Failed to create account. Email may already be in use.');
            }
        } catch (err) {
            setError('Failed to connect to the security server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-900 flex items-center justify-center cyber-grid-bg relative">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[120px]" />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md mx-4">
                <div className="glass-card p-8 md:p-10">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-cyber-600 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold font-display gradient-text">Spam Detector AI</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white text-center mb-2">Create Account</h1>
                    <p className="text-sm text-gray-400 text-center mb-8">Start protecting your organization today</p>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-200">{error}</p>
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3"
                            >
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-emerald-200">Account created! Redirecting to login...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-400 mb-1.5 block">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.first_name}
                                        onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                        className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors"
                                        placeholder="John"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1.5 block">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.last_name}
                                    onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                    className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 mb-1.5 block">Work Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors"
                                    placeholder="john@company.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 mb-1.5 block">Organization</label>
                            <div className="relative">
                                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    required
                                    value={formData.organization}
                                    onChange={e => setFormData({ ...formData, organization: e.target.value })}
                                    className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors"
                                    placeholder="Acme Inc."
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div className="flex items-start gap-2 pt-1">
                            <input type="checkbox" required className="mt-1 rounded border-white/10" />
                            <span className="text-xs text-gray-400">I agree to the <a className="text-neon-blue cursor-pointer">Terms</a> and <a className="text-neon-blue cursor-pointer">Privacy Policy</a></span>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || success}
                            className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2 group disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : success ? (
                                <CheckCircle2 className="w-4 h-4 grow-0" />
                            ) : (
                                <>Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account? <Link href="/login" className="text-neon-blue font-medium">Sign in</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
