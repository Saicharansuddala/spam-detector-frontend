'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';
import PublicLayout from '@/components/layouts/PublicLayout';

const plans = [
    {
        name: 'Starter',
        price: { monthly: 299, annual: 249 },
        desc: 'For growing companies getting started with AI security.',
        features: ['5,000 scans/day', '2 detection models', 'Basic analytics', 'Email support', 'REST API access', '5 team members'],
        cta: 'Start Free Trial',
        popular: false,
    },
    {
        name: 'Enterprise',
        price: { monthly: 999, annual: 799 },
        desc: 'For organizations needing comprehensive threat detection.',
        features: ['Unlimited scans', 'All detection models', 'Advanced analytics & MLOps', 'Threat intelligence', 'Priority support', 'Unlimited team members', 'Custom model training', 'SSO & SAML', 'SOC 2 compliance', 'Dedicated CSM'],
        cta: 'Contact Sales',
        popular: true,
    },
    {
        name: 'Government',
        price: { monthly: null, annual: null },
        desc: 'For government agencies with strict compliance needs.',
        features: ['Everything in Enterprise', 'On-premise deployment', 'FedRAMP compliance', 'Classified data handling', 'Custom SLAs', 'Dedicated infrastructure', 'Military-grade encryption', '24/7 SOC support'],
        cta: 'Request Briefing',
        popular: false,
    },
];

export default function PricingPage() {
    const [annual, setAnnual] = useState(true);

    return (
        <PublicLayout>
            <section className="pt-32 pb-24">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold font-display text-white mb-5"
                        >
                            Simple, <span className="gradient-text">Transparent Pricing</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-gray-400 max-w-xl mx-auto mb-8"
                        >
                            Scale your security as you grow. All plans include core detection capabilities.
                        </motion.p>

                        {/* Toggle */}
                        <div className="flex items-center justify-center gap-3">
                            <span className={`text-sm ${!annual ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
                            <button
                                onClick={() => setAnnual(!annual)}
                                className="relative w-14 h-7 rounded-full bg-surface-500 transition-colors"
                            >
                                <div className={`absolute top-1 w-5 h-5 rounded-full bg-neon-blue transition-all ${annual ? 'left-8' : 'left-1'}`} />
                            </button>
                            <span className={`text-sm ${annual ? 'text-white' : 'text-gray-500'}`}>Annual</span>
                            {annual && <span className="text-xs text-neon-green font-medium ml-2">Save 20%</span>}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {plans.map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`glass-card p-8 relative ${plan.popular ? 'border-neon-blue/30 neon-glow' : ''}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-neon-blue to-cyber-500 rounded-full text-xs font-bold text-white">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-sm text-gray-400 mb-6">{plan.desc}</p>
                                <div className="mb-6">
                                    {plan.price.monthly ? (
                                        <div className="flex items-end gap-1">
                                            <span className="text-4xl font-bold text-white">${annual ? plan.price.annual : plan.price.monthly}</span>
                                            <span className="text-gray-500 text-sm mb-1">/mo</span>
                                        </div>
                                    ) : (
                                        <div className="text-2xl font-bold text-white">Custom</div>
                                    )}
                                </div>
                                <Link
                                    href="/contact"
                                    className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all w-full ${plan.popular
                                            ? 'btn-primary'
                                            : 'btn-secondary'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                                <div className="mt-8 space-y-3">
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-center gap-3">
                                            <Check className="w-4 h-4 text-neon-green flex-shrink-0" />
                                            <span className="text-sm text-gray-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
