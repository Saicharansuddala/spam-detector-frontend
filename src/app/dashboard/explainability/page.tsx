'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, BarChart3, GitBranch, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const tokens = [
    { token: 'account', attention: 0.95 },
    { token: 'compromised', attention: 0.98 },
    { token: 'click', attention: 0.87 },
    { token: 'immediately', attention: 0.92 },
    { token: 'verify', attention: 0.89 },
    { token: 'identity', attention: 0.85 },
    { token: 'restore', attention: 0.78 },
    { token: 'access', attention: 0.73 },
    { token: 'suspend', attention: 0.82 },
    { token: 'urgent', attention: 0.91 },
    { token: 'dear', attention: 0.15 },
    { token: 'customer', attention: 0.22 },
    { token: 'valued', attention: 0.18 },
    { token: 'the', attention: 0.03 },
    { token: 'and', attention: 0.02 },
];

const featureImportance = [
    { feature: 'Urgency Keywords', importance: 0.28 },
    { feature: 'Suspicious URLs', importance: 0.22 },
    { feature: 'Sender Reputation', importance: 0.18 },
    { feature: 'Grammar Anomalies', importance: 0.12 },
    { feature: 'Brand Impersonation', importance: 0.10 },
    { feature: 'Header Analysis', importance: 0.06 },
    { feature: 'Link Obfuscation', importance: 0.04 },
];

const decisions = [
    { step: 1, check: 'Content Analysis', result: 'High urgency language detected', score: 0.89, passed: false },
    { step: 2, check: 'URL Verification', result: 'Mismatched domain found', score: 0.95, passed: false },
    { step: 3, check: 'Sender Check', result: 'Unknown sender, no SPF/DKIM', score: 0.78, passed: false },
    { step: 4, check: 'Pattern Match', result: 'Matches known phishing template', score: 0.92, passed: false },
    { step: 5, check: 'ML Ensemble', result: 'All 3 models flag as phishing', score: 0.97, passed: false },
];

export default function ExplainabilityPage() {
    const [selectedLayer, setSelectedLayer] = useState(0);
    const sortedTokens = [...tokens].sort((a, b) => b.attention - a.attention);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-display text-white">Explainable AI Lab</h1>
                <p className="text-sm text-gray-400 mt-1">Understand how AI models make detection decisions</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Attention Map */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-neon-blue" /> Attention Map (Layer {selectedLayer + 1})
                    </h3>
                    <div className="flex gap-2 mb-4">
                        {[0, 1, 2, 3].map(layer => (
                            <button key={layer} onClick={() => setSelectedLayer(layer)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${selectedLayer === layer ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20' : 'text-gray-400 hover:bg-white/[0.03]'}`}>
                                Layer {layer + 1}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                        {tokens.map((t, i) => {
                            const heat = t.attention + (selectedLayer * 0.05);
                            const bg = heat > 0.8 ? 'bg-neon-red/50' : heat > 0.6 ? 'bg-neon-orange/35' : heat > 0.3 ? 'bg-neon-blue/20' : 'bg-surface-600/30';
                            return (
                                <div key={i} className={`${bg} rounded-lg p-2 text-center cursor-pointer hover:scale-105 transition-transform`} title={`Attention: ${(t.attention * 100).toFixed(0)}%`}>
                                    <p className="text-xs font-mono text-white truncate">{t.token}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{(t.attention * 100).toFixed(0)}%</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-3 mt-4 text-[10px] text-gray-600">
                        <span>Low</span>
                        <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-surface-600/30 via-neon-blue/20 via-neon-orange/35 to-neon-red/50" />
                        <span>High Attention</span>
                    </div>
                </div>

                {/* Feature Importance */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-neon-orange" /> Feature Importance
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={featureImportance} layout="vertical" barSize={16}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis type="number" domain={[0, 0.3]} stroke="#4b5563" tick={{ fontSize: 10 }} />
                            <YAxis type="category" dataKey="feature" stroke="#4b5563" tick={{ fontSize: 10 }} width={120} />
                            <Tooltip contentStyle={{ background: '#1a1b2e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '12px' }} />
                            <Bar dataKey="importance" fill="#ff6b00" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Decision Graph */}
            <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-neon-purple" /> Decision Pipeline
                </h3>
                <div className="flex flex-col md:flex-row items-stretch gap-3">
                    {decisions.map((d, i) => (
                        <React.Fragment key={d.step}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.15 }}
                                className="flex-1 glass-card p-4 border-neon-red/10"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-6 h-6 rounded-full bg-neon-red/10 flex items-center justify-center text-[10px] font-bold text-neon-red">{d.step}</span>
                                    <span className="text-xs font-semibold text-white">{d.check}</span>
                                </div>
                                <p className="text-[11px] text-gray-400 mb-2">{d.result}</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1 bg-surface-600 rounded-full overflow-hidden">
                                        <div className="h-full bg-neon-red rounded-full" style={{ width: `${d.score * 100}%` }} />
                                    </div>
                                    <span className="text-[10px] font-mono text-neon-red">{(d.score * 100).toFixed(0)}%</span>
                                </div>
                            </motion.div>
                            {i < decisions.length - 1 && (
                                <div className="hidden md:flex items-center">
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <div className="mt-4 p-3 rounded-xl bg-neon-red/5 border border-neon-red/10 flex items-center gap-3">
                    <Zap className="w-5 h-5 text-neon-red" />
                    <div>
                        <span className="text-sm font-bold text-neon-red">Final Verdict: Phishing</span>
                        <span className="text-xs text-gray-400 ml-2">Combined confidence: 97.3%</span>
                    </div>
                </div>
            </div>

            {/* Token Importance Ranking */}
            <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Token Importance Ranking</h3>
                <div className="space-y-2">
                    {sortedTokens.slice(0, 10).map((t, i) => (
                        <div key={t.token} className="flex items-center gap-3">
                            <span className="text-[10px] text-gray-600 w-4 text-right">{i + 1}</span>
                            <span className="text-xs font-mono text-gray-300 w-24">{t.token}</span>
                            <div className="flex-1 h-2 bg-surface-600 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${t.attention * 100}%` }} transition={{ duration: 0.8, delay: i * 0.05 }}
                                    className={`h-full rounded-full ${t.attention > 0.8 ? 'bg-gradient-to-r from-neon-orange to-neon-red' : t.attention > 0.5 ? 'bg-neon-blue' : 'bg-surface-400'}`} />
                            </div>
                            <span className="text-xs font-mono text-gray-400 w-10 text-right">{(t.attention * 100).toFixed(0)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
