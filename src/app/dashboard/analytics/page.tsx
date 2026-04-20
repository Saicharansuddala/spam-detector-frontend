'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Download, Target, AlertTriangle, Layers, Loader2, CheckCircle
} from 'lucide-react';
import { useStore } from '@/store/store';
import { cn } from '@/utils/helpers';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, Radar, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const rocData = Array.from({ length: 50 }, (_, i) => {
    const fpr = i / 50;
    const tpr = Math.min(1, Math.pow(fpr, 0.15) + (Math.random() * 0.05));
    return { fpr: (fpr * 100).toFixed(1), tpr: (tpr * 100).toFixed(1) };
});

const driftData = Array.from({ length: 20 }, (_, i) => ({
    week: `W${i + 1}`,
    accuracy: 99.5 + Math.random() * 0.5 - (i > 15 ? i * 0.03 : 0),
    f1Score: 98.8 + Math.random() * 0.8 - (i > 15 ? i * 0.02 : 0),
    precision: 99.2 + Math.random() * 0.5,
    recall: 98.5 + Math.random() * 1,
}));

const segmentData = [
    { segment: 'Email', precision: 99.2, recall: 98.8, f1: 99.0, volume: 450000 },
    { segment: 'SMS', precision: 97.5, recall: 96.2, f1: 96.8, volume: 120000 },
    { segment: 'URL', precision: 98.9, recall: 97.5, f1: 98.2, volume: 280000 },
    { segment: 'Voice', precision: 94.1, recall: 92.8, f1: 93.4, volume: 35000 },
    { segment: 'Social', precision: 96.8, recall: 95.1, f1: 95.9, volume: 89000 },
];

const fpData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    falsePositives: Math.floor(Math.random() * 50 + 10),
    falseNegatives: Math.floor(Math.random() * 20 + 2),
}));

const radarData = [
    { metric: 'Accuracy', A: 99.5, fullMark: 100 },
    { metric: 'Speed', A: 95, fullMark: 100 },
    { metric: 'Coverage', A: 92, fullMark: 100 },
    { metric: 'Explainability', A: 88, fullMark: 100 },
    { metric: 'Robustness', A: 96, fullMark: 100 },
    { metric: 'Fairness', A: 94, fullMark: 100 },
];

export default function AnalyticsPage() {
    const { addNotification } = useStore();
    const [dateRange, setDateRange] = useState('30d');
    const [isExporting, setIsExporting] = useState(false);

    const handleRangeChange = (range: string) => {
        setDateRange(range);
        addNotification({
            id: Math.random().toString(),
            title: 'Recalculating Metrics',
            message: `Refreshing analytics data for the last ${range}...`,
            type: 'info',
            timestamp: new Date(),
            read: false
        });
    };

    const handleExport = () => {
        setIsExporting(true);
        addNotification({
            id: 'export-start',
            title: 'Generating Report',
            message: 'Compiling model performance PDF for export...',
            type: 'info',
            timestamp: new Date(),
            read: false
        });

        setTimeout(() => {
            setIsExporting(false);
            addNotification({
                id: 'export-end',
                title: 'Export Complete',
                message: 'Analytics report downloaded successfully.',
                type: 'success',
                timestamp: new Date(),
                read: false
            });
        }, 2000);
    };

    const focusMetric = (label: string) => {
        addNotification({
            id: Math.random().toString(),
            title: 'Metrtic Focused',
            message: `Deep-diving into ${label} trends and outliers...`,
            type: 'info',
            timestamp: new Date(),
            read: false
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-white">Analytics</h1>
                    <p className="text-sm text-gray-400 mt-1">Model performance, drift monitoring, and segment analysis</p>
                </div>
                <div className="flex items-center gap-2">
                    {['7d', '30d', '90d', '1y'].map(range => (
                        <button
                            key={range}
                            onClick={() => handleRangeChange(range)}
                            className={cn(
                                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                                dateRange === range
                                    ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                                    : 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.03]'
                            )}
                        >
                            {range}
                        </button>
                    ))}
                    <button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5 disabled:opacity-50"
                    >
                        {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                        {isExporting ? 'Exporting...' : 'Export'}
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'AUC Score', value: '0.9987', change: '+0.001', color: 'text-neon-green' },
                    { label: 'F1 Score', value: '0.9912', change: '+0.003', color: 'text-neon-green' },
                    { label: 'False Positive Rate', value: '0.03%', change: '-0.01%', color: 'text-neon-green' },
                    { label: 'Model Drift', value: 'Stable', change: 'No drift', color: 'text-neon-blue' },
                ].map((metric, i) => (
                    <motion.div 
                        key={metric.label} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: i * 0.1 }} 
                        onClick={() => focusMetric(metric.label)}
                        className="glass-card p-5 cursor-pointer hover:bg-white/[0.02] hover:border-white/[0.1] transition-all group"
                    >
                        <p className="text-xs text-gray-500 mb-1 group-hover:text-neon-blue transition-colors">{metric.label}</p>
                        <p className="text-2xl font-bold text-white font-display group-hover:scale-105 transition-transform origin-left">{metric.value}</p>
                        <p className={`text-xs font-medium mt-1 ${metric.color}`}>{metric.change}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* ROC Curve */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                        <Target className="w-4 h-4 text-neon-blue" /> ROC Curve (AUC = 0.9987)
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={rocData}>
                            <defs>
                                <linearGradient id="gradROC" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="fpr" label={{ value: 'False Positive Rate (%)', position: 'insideBottom', offset: -5, style: { fontSize: 10, fill: '#6b7280' } }} stroke="#4b5563" tick={{ fontSize: 10 }} />
                            <YAxis label={{ value: 'True Positive Rate (%)', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#6b7280' } }} stroke="#4b5563" tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ background: '#1a1b2e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '12px' }} />
                            <Area type="monotone" dataKey="tpr" stroke="#00d4ff" fill="url(#gradROC)" strokeWidth={2} />
                            <Line type="monotone" data={[{ fpr: '0', tpr: '0' }, { fpr: '100', tpr: '100' }]} dataKey="tpr" stroke="rgba(255,255,255,0.1)" strokeDasharray="5 5" dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Model Drift */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-neon-blue" /> Model Drift Monitor
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={driftData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="week" stroke="#4b5563" tick={{ fontSize: 10 }} interval={3} />
                            <YAxis domain={[96, 100]} stroke="#4b5563" tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ background: '#1a1b2e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '12px' }} />
                            <Line type="monotone" dataKey="accuracy" stroke="#00d4ff" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="f1Score" stroke="#a855f7" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="precision" stroke="#00ff88" strokeWidth={1} dot={false} strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="recall" stroke="#ff6b00" strokeWidth={1} dot={false} strokeDasharray="5 5" />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-neon-blue rounded" /> Accuracy</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-neon-purple rounded" /> F1</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-neon-green rounded" /> Precision</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-neon-orange rounded" /> Recall</span>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* False Positives */}
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-neon-orange" /> False Positives / Negatives
                    </h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={fpData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="month" stroke="#4b5563" tick={{ fontSize: 10 }} />
                            <YAxis stroke="#4b5563" tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ background: '#1a1b2e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '12px' }} />
                            <Bar dataKey="falsePositives" fill="#ff6b00" radius={[4, 4, 0, 0]} name="False Positives" />
                            <Bar dataKey="falseNegatives" fill="#ff3366" radius={[4, 4, 0, 0]} name="False Negatives" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Radar */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-neon-purple" /> Model Radar
                    </h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.06)" />
                            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                            <PolarRadiusAxis domain={[80, 100]} tick={{ fontSize: 9, fill: '#6b7280' }} />
                            <Radar name="Model" dataKey="A" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.15} strokeWidth={2} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Segment Analysis Table */}
            <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-5">Segment Analysis</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-gray-500 border-b border-white/[0.04]">
                                <th className="pb-3 text-left font-medium">Segment</th>
                                <th className="pb-3 text-left font-medium">Precision</th>
                                <th className="pb-3 text-left font-medium">Recall</th>
                                <th className="pb-3 text-left font-medium">F1 Score</th>
                                <th className="pb-3 text-left font-medium">Volume</th>
                                <th className="pb-3 text-left font-medium">Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {segmentData.map(seg => (
                                <tr key={seg.segment} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                                    <td className="py-3 text-sm font-medium text-white">{seg.segment}</td>
                                    <td className="py-3 text-sm text-gray-300 font-mono">{seg.precision}%</td>
                                    <td className="py-3 text-sm text-gray-300 font-mono">{seg.recall}%</td>
                                    <td className="py-3 text-sm text-gray-300 font-mono">{seg.f1}%</td>
                                    <td className="py-3 text-sm text-gray-400">{seg.volume.toLocaleString()}</td>
                                    <td className="py-3">
                                        <div className="w-20 h-1.5 bg-surface-600 rounded-full overflow-hidden">
                                            <div className="h-full bg-neon-blue rounded-full" style={{ width: `${seg.f1}%` }} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
