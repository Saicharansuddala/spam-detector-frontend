'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, Zap, Brain, Globe, Lock, BarChart3,
  ChevronRight, Bot
} from 'lucide-react';
import PublicLayout from '@/components/layouts/PublicLayout';

const stats = [
  { value: '99.97%', label: 'Detection Accuracy' },
  { value: '2.1B+', label: 'Threats Analyzed' },
  { value: '<50ms', label: 'Avg Response Time' },
  { value: '500+', label: 'Enterprise Clients' },
];

const features = [
  { icon: Brain, title: 'AI-Powered Detection', desc: 'State-of-the-art transformer models detect spam, phishing, and fraud in real-time with explainable AI.' },
  { icon: Globe, title: 'Threat Intelligence', desc: 'Global threat feeds, campaign tracking, and predictive analytics across attack vectors.' },
  { icon: BarChart3, title: 'Advanced Analytics', desc: 'ROC curves, model drift monitoring, false positive analysis with interactive drill-down.' },
  { icon: Lock, title: 'Zero Trust Security', desc: 'SOC 2, GDPR compliant. End-to-end encryption with comprehensive audit trails.' },
  { icon: Zap, title: 'Real-Time Processing', desc: 'Sub-50ms inference latency. Process millions of messages per second at enterprise scale.' },
  { icon: Bot, title: 'MLOps Pipeline', desc: 'Automated model retraining, A/B testing, canary deployments, and performance tracking.' },
];

const trustedBy = ['Microsoft', 'Google', 'Amazon', 'Meta', 'JPMorgan', 'HSBC'];

export default function HomePage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 cyber-grid-bg" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-neon-blue/[0.03] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-neon-blue/[0.02] rounded-full" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-medium mb-8">
              <Zap className="w-3 h-3" />
              <span>Trusted by Fortune 500 & Government Agencies</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6"
          >
            <span className="text-white">AI-Powered</span>
            <br />
            <span className="gradient-text">Cybersecurity Shield</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Enterprise-grade spam, phishing, and fraud detection powered by transformer AI models.
            Real-time threat intelligence with explainable predictions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 shadow-neon-blue/30 shadow-lg">
              Launch Platform <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/features" className="btn-secondary text-base px-8 py-3.5 flex items-center gap-2">
              Explore Features <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map(stat => (
              <div key={stat.label} className="glass-card p-6 text-center">
                <div className="text-3xl font-bold gradient-text font-display">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-16 border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs text-gray-600 uppercase tracking-widest mb-8">Trusted by leading organizations</p>
          <div className="flex items-center justify-center gap-12 flex-wrap">
            {trustedBy.map(company => (
              <span key={company} className="text-gray-600 text-lg font-bold font-display opacity-40 hover:opacity-70 transition-opacity cursor-default">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
              Enterprise Security, <span className="gradient-text">Supercharged by AI</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Purpose-built for security teams, with advanced machine learning at its core.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/10 flex items-center justify-center mb-5 group-hover:shadow-neon-blue/20 group-hover:shadow-lg transition-shadow">
                  <feature.icon className="w-6 h-6 text-neon-blue" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="glass-card p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-neon-blue/10 rounded-full blur-[80px]" />
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4 relative">
              Ready to Fortify Your Defenses?
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto relative">
              Deploy Spam Detector AI and start detecting threats in minutes. Enterprise-ready from day one.
            </p>
            <div className="flex items-center justify-center gap-4 relative">
              <Link href="/dashboard" className="btn-primary px-8 py-3 flex items-center gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn-secondary px-8 py-3">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
