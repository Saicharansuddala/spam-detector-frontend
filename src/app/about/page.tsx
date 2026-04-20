'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Globe, Award } from 'lucide-react';
import PublicLayout from '@/components/layouts/PublicLayout';

const team = [
    { name: 'Dr. Sarah Chen', role: 'CEO & Co-Founder', expertise: 'AI/ML Research, ex-Google DeepMind' },
    { name: 'Marcus Rodriguez', role: 'CTO & Co-Founder', expertise: 'Security Architecture, ex-CrowdStrike' },
    { name: 'Dr. Aisha Patel', role: 'VP Engineering', expertise: 'NLP & Transformer Models, ex-OpenAI' },
    { name: 'James Park', role: 'VP Security', expertise: 'Threat Intelligence, ex-NSA' },
    { name: 'Elena Petrova', role: 'Head of Product', expertise: 'Enterprise SaaS, ex-Palo Alto Networks' },
    { name: 'David Okafor', role: 'Head of ML Ops', expertise: 'MLOps & Infrastructure, ex-Meta AI' },
];

const milestones = [
    { year: '2021', event: 'Founded with $2M seed round' },
    { year: '2022', event: 'First enterprise deployment, Series A $18M' },
    { year: '2023', event: '100+ enterprise clients, SOC 2 certified' },
    { year: '2024', event: 'Series B $65M, government contracts' },
    { year: '2025', event: '500+ clients, 2.1B threats analyzed' },
];

export default function AboutPage() {
    return (
        <PublicLayout>
            <section className="pt-32 pb-24">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Hero */}
                    <div className="text-center mb-20">
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold font-display text-white mb-5">
                            Defending the Digital World with <span className="gradient-text">Intelligent AI</span>
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Spam Detector AI was founded by cybersecurity experts and AI researchers to build the next generation of threat detection.
                        </motion.p>
                    </div>

                    {/* Mission */}
                    <div className="grid md:grid-cols-3 gap-6 mb-20">
                        {[
                            { icon: Target, title: 'Our Mission', desc: 'Make enterprise-grade AI security accessible to every organization, protecting billions of people from cyber threats.' },
                            { icon: Globe, title: 'Global Reach', desc: 'Operating across 40+ countries with detection models trained on data from diverse threat landscapes and languages.' },
                            { icon: Award, title: 'Recognition', desc: 'Named a Gartner Cool Vendor, winner of RSA Innovation Sandbox, and recognized by MITRE ATT&CK.' },
                        ].map((item, i) => (
                            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-8 text-center">
                                <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center mx-auto mb-4">
                                    <item.icon className="w-6 h-6 text-neon-blue" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Team */}
                    <div className="mb-20">
                        <h2 className="text-2xl font-bold font-display text-white mb-8 flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-neon-blue to-neon-purple rounded-full" />
                            Leadership Team
                        </h2>
                        <div className="grid md:grid-cols-3 gap-5">
                            {team.map((member, i) => (
                                <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="glass-card p-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-blue/30 to-neon-purple/20 flex items-center justify-center mb-4 text-lg font-bold text-neon-blue">
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <h3 className="font-semibold text-white">{member.name}</h3>
                                    <p className="text-sm text-neon-blue">{member.role}</p>
                                    <p className="text-xs text-gray-500 mt-1">{member.expertise}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div>
                        <h2 className="text-2xl font-bold font-display text-white mb-8 flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-neon-blue to-neon-purple rounded-full" />
                            Our Journey
                        </h2>
                        <div className="space-y-4">
                            {milestones.map((m, i) => (
                                <motion.div key={m.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-6 glass-card p-5">
                                    <span className="text-xl font-bold gradient-text font-display w-16">{m.year}</span>
                                    <div className="w-2 h-2 rounded-full bg-neon-blue flex-shrink-0" />
                                    <span className="text-sm text-gray-300">{m.event}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
