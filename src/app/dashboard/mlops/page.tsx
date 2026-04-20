'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Boxes, GitBranch, Database, RefreshCw,
    CheckCircle, Clock, AlertTriangle, Play,
    TrendingUp, Archive, ShieldCheck, MoreHorizontal,
    ArrowUpCircle, Loader2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '@/store/store';
import { cn } from '@/utils/helpers';

const models = [
    { id: 'v3.2.1', name: 'PhishNet-XL', status: 'production', accuracy: 99.97, f1: 99.12, latency: '23ms', deployed: '2 days ago', stage: 'production' },
    { id: 'v3.2.0', name: 'PhishNet-XL', status: 'canary', accuracy: 99.95, f1: 99.08, latency: '25ms', deployed: '1 week ago', stage: 'canary' },
    { id: 'v3.1.9', name: 'PhishNet-XL', status: 'shadow', accuracy: 99.91, f1: 98.95, latency: '28ms', deployed: '2 weeks ago', stage: 'shadow' },
    { id: 'v3.1.8', name: 'PhishNet-XL', status: 'archived', accuracy: 99.88, f1: 98.82, latency: '31ms', deployed: '1 month ago', stage: 'archived' },
];

const pipelineStages = [
    { name: 'Data Ingestion', status: 'completed', duration: '12m', items: '2.1M records' },
    { name: 'Preprocessing', status: 'completed', duration: '8m', items: 'Tokenization, cleaning' },
    { name: 'Training', status: 'running', duration: '2h 15m', items: 'Epoch 8/12' },
    { name: 'Validation', status: 'pending', duration: '~15m', items: 'Awaiting training' },
    { name: 'A/B Testing', status: 'pending', duration: '~24h', items: '5% traffic split' },
    { name: 'Deployment', status: 'pending', duration: '~5m', items: 'Canary → Production' },
];

const trainingData = Array.from({ length: 12 }, (_, i) => ({
    epoch: `${i + 1}`,
    trainLoss: 0.8 * Math.exp(-0.3 * i) + 0.02 + Math.random() * 0.01,
    valLoss: 0.85 * Math.exp(-0.28 * i) + 0.03 + Math.random() * 0.015,
}));

const datasets = [
    { name: 'phishing-enterprise-v12', records: '4.2M', freshness: '2 hours', quality: 98.5, drift: 'none' },
    { name: 'spam-multilang-v8', records: '12.1M', freshness: '6 hours', quality: 97.2, drift: 'low' },
    { name: 'fraud-financial-v6', records: '1.8M', freshness: '1 day', quality: 99.1, drift: 'none' },
    { name: 'scam-voice-v3', records: '0.4M', freshness: '3 days', quality: 95.8, drift: 'medium' },
];

const stageColor: Record<string, string> = {
    production: 'text-neon-green bg-neon-green/10',
    canary: 'text-neon-orange bg-neon-orange/10',
    shadow: 'text-neon-blue bg-neon-blue/10',
    archived: 'text-gray-400 bg-gray-400/10',
};

const pipelineStatusColor: Record<string, { icon: React.ElementType; color: string }> = {
    completed: { icon: CheckCircle, color: 'text-neon-green' },
    running: { icon: RefreshCw, color: 'text-neon-blue' },
    pending: { icon: Clock, color: 'text-gray-500' },
    failed: { icon: AlertTriangle, color: 'text-neon-red' },
};

export default function MLOpsPage() {
    const { addNotification } = useStore();
    const [modelsList, setModelsList] = useState(models);
    const [pipeline, setPipeline] = useState(pipelineStages);
    const [isRetraining, setIsRetraining] = useState(false);

    const handleTriggerRetrain = () => {
        if (isRetraining) return;
        
        setIsRetraining(true);
        addNotification({
            id: Math.random().toString(),
            title: 'Retraining Pipeline Started',
            message: 'Initializing PhishNet-XL retraining workflow...',
            type: 'info',
            timestamp: new Date(),
            read: false
        });

        // Reset pipeline to pending except the first one
        const newPipeline = pipeline.map((p, i) => ({
            ...p,
            status: i === 0 ? 'running' : 'pending'
        }));
        setPipeline(newPipeline);

        // Simulate progression
        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            if (currentStep >= pipeline.length) {
                clearInterval(interval);
                setIsRetraining(false);
                addNotification({
                    id: Math.random().toString(),
                    title: 'Pipeline Completed',
                    message: 'New model candidate is ready for A/B testing.',
                    type: 'success',
                    timestamp: new Date(),
                    read: false
                });
                return;
            }

            setPipeline(prev => prev.map((p, i) => {
                if (i < currentStep) return { ...p, status: 'completed' };
                if (i === currentStep) return { ...p, status: 'running' };
                return p;
            }));
        }, 2500);
    };

    const promoteModel = (id: string) => {
        setModelsList(prev => prev.map(m => {
            if (m.id === id) {
                const nextStage = m.stage === 'shadow' ? 'canary' : 'production';
                addNotification({
                    id: Math.random().toString(),
                    title: 'Model Promoted',
                    message: `Model ${m.id} moved to ${nextStage}`,
                    type: 'success',
                    timestamp: new Date(),
                    read: false
                });
                return { ...m, stage: nextStage, status: nextStage };
            }
            return m;
        }));
    };

    const archiveModel = (id: string) => {
        setModelsList(prev => prev.map(m => {
            if (m.id === id) {
                addNotification({
                    id: Math.random().toString(),
                    title: 'Model Archived',
                    message: `Model ${m.id} moved to archive`,
                    type: 'warning',
                    timestamp: new Date(),
                    read: false
                });
                return { ...m, stage: 'archived', status: 'archived' };
            }
            return m;
        }));
    };
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-white">MLOps & Model Governance</h1>
                    <p className="text-sm text-gray-400 mt-1">Model lifecycle, retraining pipelines, and deployment management</p>
                </div>
                <button 
                    onClick={handleTriggerRetrain}
                    disabled={isRetraining}
                    className="btn-primary px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
                >
                    {isRetraining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    {isRetraining ? 'Training in Progress...' : 'Trigger Retrain'}
                </button>
            </div>

            {/* Model Versions */}
            <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-neon-blue" /> Model Versions
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-gray-500 border-b border-white/[0.04]">
                                <th className="pb-3 text-left font-medium">Version</th>
                                <th className="pb-3 text-left font-medium">Model</th>
                                <th className="pb-3 text-left font-medium">Accuracy</th>
                                <th className="pb-3 text-left font-medium">F1 Score</th>
                                <th className="pb-3 text-left font-medium">Latency</th>
                                <th className="pb-3 text-left font-medium">Stage</th>
                                <th className="pb-3 text-left font-medium">Deployed</th>
                                <th className="pb-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modelsList.map(m => (
                                <tr key={m.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                                    <td className="py-4 text-xs font-mono text-neon-blue">{m.id}</td>
                                    <td className="py-4 text-xs text-gray-300 font-medium">{m.name}</td>
                                    <td className="py-4 text-xs text-gray-300 font-mono">{m.accuracy}%</td>
                                    <td className="py-4 text-xs text-gray-300 font-mono">{m.f1}%</td>
                                    <td className="py-4 text-xs text-gray-400">{m.latency}</td>
                                    <td className="py-4">
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
                                            stageColor[m.stage]
                                        )}>
                                            {m.stage}
                                        </span>
                                    </td>
                                    <td className="py-4 text-xs text-gray-500">{m.deployed}</td>
                                    <td className="py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {m.stage !== 'production' && m.stage !== 'archived' && (
                                                <button 
                                                    onClick={() => promoteModel(m.id)}
                                                    className="p-1.5 rounded-lg bg-neon-green/10 text-neon-green hover:bg-neon-green/20 transition-colors"
                                                    title="Promote Model"
                                                >
                                                    <ArrowUpCircle className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            {m.stage !== 'archived' && (
                                                <button 
                                                    onClick={() => archiveModel(m.id)}
                                                    className="p-1.5 rounded-lg bg-white/[0.05] text-gray-400 hover:text-white transition-colors"
                                                    title="Archive Model"
                                                >
                                                    <Archive className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            <button className="p-1.5 rounded-lg hover:bg-white/[0.05] text-gray-500 hover:text-white transition-colors">
                                                <MoreHorizontal className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pipeline + Training Chart */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Retraining Pipeline */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-neon-purple" /> Retraining Pipeline
                    </h3>
                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {pipeline.map((stage, i) => {
                                const StatusIcon = pipelineStatusColor[stage.status].icon;
                                return (
                                    <motion.div 
                                        key={stage.name} 
                                        layout
                                        initial={{ opacity: 0, x: -10 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={cn(
                                            "flex items-center gap-4 p-3 rounded-xl border transition-all duration-500",
                                            stage.status === 'running' ? 'border-neon-blue/40 bg-neon-blue/10 shadow-[0_0_15px_rgba(0,212,255,0.05)]' : 
                                            stage.status === 'completed' ? 'border-neon-green/10 bg-surface-700/30' :
                                            'border-white/[0.03] bg-surface-700/30'
                                        )}
                                    >
                                        <StatusIcon className={cn(
                                            "w-4 h-4 flex-shrink-0",
                                            pipelineStatusColor[stage.status].color,
                                            stage.status === 'running' && 'animate-spin'
                                        )} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-white">{stage.name}</p>
                                            <p className="text-[10px] text-gray-500">{stage.items}</p>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-mono">{stage.duration}</span>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Training Curves */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-5">Training Progress</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={trainingData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="epoch" stroke="#4b5563" tick={{ fontSize: 10 }} label={{ value: 'Epoch', position: 'insideBottom', offset: -5, style: { fontSize: 10, fill: '#6b7280' } }} />
                            <YAxis stroke="#4b5563" tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ background: '#1a1b2e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '12px' }} />
                            <Line type="monotone" dataKey="trainLoss" stroke="#00d4ff" strokeWidth={2} dot={{ r: 3 }} name="Train Loss" />
                            <Line type="monotone" dataKey="valLoss" stroke="#ff6b00" strokeWidth={2} dot={{ r: 3 }} name="Val Loss" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Dataset Monitoring */}
            <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                    <Database className="w-4 h-4 text-neon-green" /> Dataset Monitoring
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {datasets.map(ds => (
                        <div key={ds.name} className="p-4 rounded-xl bg-surface-700/30 border border-white/[0.03]">
                            <p className="text-xs font-mono text-neon-blue mb-2 truncate">{ds.name}</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px]"><span className="text-gray-500">Records</span><span className="text-gray-300">{ds.records}</span></div>
                                <div className="flex justify-between text-[11px]"><span className="text-gray-500">Freshness</span><span className="text-gray-300">{ds.freshness}</span></div>
                                <div className="flex justify-between text-[11px]"><span className="text-gray-500">Quality</span><span className="text-gray-300">{ds.quality}%</span></div>
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-gray-500">Drift</span>
                                    <span className={`font-medium ${ds.drift === 'none' ? 'text-neon-green' : ds.drift === 'low' ? 'text-neon-yellow' : 'text-neon-orange'}`}>{ds.drift}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
