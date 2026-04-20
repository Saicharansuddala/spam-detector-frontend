'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import PublicLayout from '@/components/layouts/PublicLayout';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    return (
        <PublicLayout>
            <section className="pt-32 pb-24">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold font-display text-white mb-5">
                            Get in <span className="gradient-text">Touch</span>
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-400 max-w-xl mx-auto">
                            Ready to secure your organization? Our team is here to help.
                        </motion.p>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Contact Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {[
                                { icon: Mail, label: 'Email', value: 'sales@spamdetector.ai' },
                                { icon: Phone, label: 'Phone', value: '+1 (888) 742-4353' },
                                { icon: MapPin, label: 'HQ', value: 'San Francisco, CA' },
                                { icon: MessageSquare, label: 'Live Chat', value: 'Available 24/7' },
                            ].map(item => (
                                <div key={item.label} className="glass-card p-5 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-5 h-5 text-neon-blue" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">{item.label}</p>
                                        <p className="text-sm text-white font-medium">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-3">
                            <div className="glass-card p-8">
                                {submitted ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 rounded-full bg-neon-green/10 flex items-center justify-center mx-auto mb-4">
                                            <Send className="w-8 h-8 text-neon-green" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                                        <p className="text-gray-400">We&apos;ll get back to you within 24 hours.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="text-xs text-gray-400 mb-1.5 block">First Name</label>
                                                <input type="text" required className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors" placeholder="John" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-400 mb-1.5 block">Last Name</label>
                                                <input type="text" required className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors" placeholder="Doe" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1.5 block">Work Email</label>
                                            <input type="email" required className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors" placeholder="john@company.com" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1.5 block">Company</label>
                                            <input type="text" className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors" placeholder="Acme Inc." />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1.5 block">Interest</label>
                                            <select className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-neon-blue/30 transition-colors">
                                                <option>Enterprise Platform</option>
                                                <option>API Integration</option>
                                                <option>Government Solutions</option>
                                                <option>Partnership</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1.5 block">Message</label>
                                            <textarea rows={4} className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors resize-none" placeholder="Tell us about your needs..." />
                                        </div>
                                        <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                                            Send Message <Send className="w-4 h-4" />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
