'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Shield, Brain, Globe, Zap, Lock, BarChart3, Bot, Code2,
    Eye, Activity, Users, FileText, Search, Cpu, Database, Layers
} from 'lucide-react';
import PublicLayout from '@/components/layouts/PublicLayout';

const featureCategories = [
    {
        title: 'AI Detection Engine',
        features: [
            { icon: Search, title: 'Real-Time Scanning', desc: 'Analyze emails, URLs, messages, and files with sub-50ms latency using transformer models.' },
            { icon: Brain, title: 'Explainable AI', desc: 'Token-level attention visualization, feature importance, and decision tree explanations.' },
            { icon: Eye, title: 'Deep Content Analysis', desc: 'NLP-based semantic understanding with multi-language support and context-aware detection.' },
            { icon: Cpu, title: 'Multi-Model Ensemble', desc: 'Combine multiple specialized models for higher accuracy across spam, phishing, and fraud.' },
        ]
    },
    {
        title: 'Threat Intelligence',
        features: [
            { icon: Globe, title: 'Global Threat Map', desc: 'Real-time visualization of active campaigns, attack vectors, and geographical threat distribution.' },
            { icon: Activity, title: 'Attack Timelines', desc: 'Historical analysis of attack patterns with predictive trend forecasting.' },
            { icon: Database, title: 'Threat Database', desc: 'Comprehensive database of known threats, IOCs, and malicious patterns continuously updated.' },
            { icon: Layers, title: 'Campaign Clustering', desc: 'AI-driven clustering of related threats into coordinated campaign groups.' },
        ]
    },
    {
        title: 'Enterprise Platform',
        features: [
            { icon: BarChart3, title: 'Advanced Analytics', desc: 'ROC/AUC curves, model drift detection, false positive analysis, and custom dashboards.' },
            { icon: Bot, title: 'MLOps Pipeline', desc: 'Model versioning, A/B testing, canary deployments, and automated retraining pipelines.' },
            { icon: Code2, title: 'API & Integrations', desc: 'RESTful API, webhooks, SDKs in 8 languages, and marketplace integrations.' },
            { icon: Lock, title: 'Security & Compliance', desc: 'SOC 2 Type II, GDPR, ISO 27001. Zero trust architecture with full audit trails.' },
        ]
    },
    {
        title: 'Collaboration & Ops',
        features: [
            { icon: Users, title: 'Team Collaboration', desc: 'Case management, threaded comments, task assignments, and shared investigations.' },
            { icon: Zap, title: 'Automation Engine', desc: 'Visual workflow builder for automated responses, alerts, and escalation rules.' },
            { icon: FileText, title: 'Reporting', desc: 'Automated report generation with customizable templates and scheduled delivery.' },
            { icon: Shield, title: 'Admin Console', desc: 'Role-based access, user management, audit logs, and system configuration.' },
        ]
    },
];

export default function FeaturesPage() {
    return (
        <PublicLayout>
            <section className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-medium mb-6"
                        >
                            <Zap className="w-3 h-3" />
                            <span>Platform Capabilities</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold font-display text-white mb-5"
                        >
                            Built for <span className="gradient-text">Enterprise Security</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-gray-400 max-w-2xl mx-auto"
                        >
                            A comprehensive cybersecurity platform with AI at its core.
                            Every feature designed for scale, accuracy, and explainability.
                        </motion.p>
                    </div>

                    {featureCategories.map((category) => (
                        <div key={category.title} className="mb-20">
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-2xl font-bold font-display text-white mb-8 flex items-center gap-3"
                            >
                                <div className="w-1 h-8 bg-gradient-to-b from-neon-blue to-neon-purple rounded-full" />
                                {category.title}
                            </motion.h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                                {category.features.map((feature, fi) => (
                                    <motion.div
                                        key={feature.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: fi * 0.08 }}
                                        className="glass-card p-6 group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center mb-4 group-hover:bg-neon-blue/20 transition-colors">
                                            <feature.icon className="w-5 h-5 text-neon-blue" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-white mb-2">{feature.title}</h3>
                                        <p className="text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
