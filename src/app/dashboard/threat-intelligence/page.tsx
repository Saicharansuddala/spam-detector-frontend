'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe, AlertTriangle, TrendingUp, Shield,
    Filter, Calendar, Eye, Loader2, CheckCircle, Info,
    ChevronDown, Activity, Zap, Search
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '@/store/store';
import { cn } from '@/utils/helpers';

const regions = [
    { name: 'North America', threats: 4521, change: '+12%', severity: 'high' },
    { name: 'Europe', threats: 3892, change: '+8%', severity: 'medium' },
    { name: 'Asia Pacific', threats: 5123, change: '+18%', severity: 'critical' },
    { name: 'Middle East', threats: 1892, change: '+25%', severity: 'high' },
    { name: 'Latin America', threats: 2134, change: '+6%', severity: 'medium' },
    { name: 'Africa', threats: 987, change: '+14%', severity: 'medium' },
];

const campaigns = [
    { id: 'CAM-291', name: 'Operation DarkPhish', type: 'Phishing', targets: 12400, status: 'active', severity: 'critical', origin: 'Eastern Europe', firstSeen: '2 days ago' },
    { id: 'CAM-290', name: 'SpamWave-Alpha', type: 'Spam', targets: 89000, status: 'active', severity: 'high', origin: 'Southeast Asia', firstSeen: '5 days ago' },
    { id: 'CAM-289', name: 'CEO Impersonation Ring', type: 'Fraud', targets: 3200, status: 'monitoring', severity: 'critical', origin: 'West Africa', firstSeen: '1 week ago' },
    { id: 'CAM-288', name: 'Credential Harvester v4', type: 'Phishing', targets: 45000, status: 'declining', severity: 'medium', origin: 'China', firstSeen: '2 weeks ago' },
    { id: 'CAM-287', name: 'Invoice Scam Network', type: 'Fraud', targets: 8900, status: 'active', severity: 'high', origin: 'Nigeria', firstSeen: '3 days ago' },
];

// Simple deterministic pseudo-random for stable render data
function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

const timeline = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    phishing: Math.floor(seededRandom(i * 3 + 1) * 300 + 100),
    spam: Math.floor(seededRandom(i * 3 + 2) * 800 + 400),
    fraud: Math.floor(seededRandom(i * 3 + 3) * 150 + 50),
}));

const severityColor: Record<string, string> = {
    critical: 'text-neon-red bg-neon-red/10',
    high: 'text-neon-orange bg-neon-orange/10',
    medium: 'text-neon-yellow bg-neon-yellow/10',
    low: 'text-neon-green bg-neon-green/10',
};

const statusColor: Record<string, string> = {
    active: 'text-neon-red',
    monitoring: 'text-neon-orange',
    declining: 'text-neon-green',
};

const heatmapData = Array.from({ length: 72 }, (_, i) => {
    const intensity = seededRandom(i * 7 + 42);
    const bg = intensity > 0.8 ? 'bg-neon-red/60' : intensity > 0.6 ? 'bg-neon-orange/40' : intensity > 0.3 ? 'bg-neon-blue/20' : 'bg-surface-600/30';
    return { bg, threats: Math.floor(intensity * 500) };
});

export default function ThreatIntelligencePage() {
    const { addNotification } = useStore();
    
    // UI State
    const [filterOpen, setFilterOpen] = useState(false);
    const [rangeOpen, setRangeOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeRange, setActiveRange] = useState('30d');
    
    // Refs for click outside
    const filterRef = useRef<HTMLDivElement>(null);
    const rangeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setFilterOpen(false);
            }
            if (rangeRef.current && !rangeRef.current.contains(event.target as Node)) {
                setRangeOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCampaigns = campaigns.filter(c => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'critical') return c.severity === 'critical';
        if (activeFilter === 'active') return c.status === 'active';
        return c.type.toLowerCase() === activeFilter.toLowerCase();
    });

    const handleFilterSelect = (filter: string) => {
        setActiveFilter(filter);
        setFilterOpen(false);
        addNotification({
            id: Math.random().toString(),
            title: 'Filters Applied',
            message: `Filtering view for ${filter.toUpperCase()} intelligence...`,
            type: 'info',
            timestamp: new Date(),
            read: false
        });
    };

    const handleRangeSelect = (range: string) => {
        setActiveRange(range);
        setRangeOpen(false);
        addNotification({
            id: Math.random().toString(),
            title: 'Intelligence Re-sync',
            message: `Synchronizing threat data for the last ${range}...`,
            type: 'info',
            timestamp: new Date(),
            read: false
        });
    };

    const handleFilterClick = () => {
        addNotification({
            id: Math.random().toString(),
            title: 'Filters Active',
            message: 'Opening advanced threat filtering console...',
            type: 'info',
            timestamp: new Date(),
            read: false
        });
    };

    const handleCalendarClick = () => {
        addNotification({
            id: Math.random().toString(),
            title: 'Date Range Selector',
            message: 'Loading historical threat intelligence archives...',
            type: 'info',
            timestamp: new Date(),
            read: false
        });
    };

    const handleCampaignClick = (id: string, name: string) => {
        addNotification({
            id: Math.random().toString(),
            title: 'Campaign Deep Dive',
            message: `Initiating forensic analysis for ${name} (${id})...`,
            type: 'info',
            timestamp: new Date(),
            read: false
        });
    };

    const handleHeatmapClick = (threats: number) => {
        const severity = threats > 400 ? 'Critical' : threats > 300 ? 'High' : threats > 150 ? 'Medium' : 'Low';
        addNotification({
            id: Math.random().toString(),
            title: `${severity} Threat Cluster`,
            message: `Detected ${threats} active threats in this regional sector.`,
            type: threats > 300 ? 'danger' : 'info',
            timestamp: new Date(),
            read: false
        });
    };

    const handleRegionClick = (name: string, threats: number) => {
        addNotification({
            id: Math.random().toString(),
            title: `${name} Intelligence`,
            message: `Analyzing regional attack vectors for ${threats.toLocaleString()} active sensors.`,
            type: 'info',
            timestamp: new Date(),
            read: false
        });
    };

    const handleAwarenessClick = (label: string) => {
        addNotification({
            id: Math.random().toString(),
            title: 'Intelligence Insight',
            message: `Fetching latest behavioral patterns for: ${label}`,
            type: 'info',
            timestamp: new Date(),
            read: false
        });
    };
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-white">Threat Intelligence</h1>
                    <p className="text-sm text-gray-400 mt-1">Global threat landscape, campaigns, and attack trends</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Filters Dropdown */}
                    <div className="relative" ref={filterRef}>
                        <button 
                            onClick={() => setFilterOpen(!filterOpen)} 
                            className={cn(
                                "btn-secondary px-3 py-2 text-xs flex items-center gap-1.5 transition-all",
                                filterOpen && "border-neon-blue/40 bg-neon-blue/5"
                            )}
                        >
                            <Filter className="w-3 h-3" /> 
                            <span>Filters: <span className="text-neon-blue font-bold uppercase">{activeFilter}</span></span>
                            <ChevronDown className={cn("w-3 h-3 transition-transform", filterOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {filterOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-48 glass-panel rounded-xl shadow-glass-lg border border-white/[0.08] p-1 z-50 overflow-hidden"
                                >
                                    {['all', 'active', 'critical', 'phishing', 'fraud', 'spam'].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => handleFilterSelect(f)}
                                            className={cn(
                                                "w-full px-3 py-2 rounded-lg text-left text-xs transition-colors",
                                                activeFilter === f ? "text-neon-blue bg-neon-blue/10" : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.05]"
                                            )}
                                        >
                                            {f.charAt(0)}.{f.slice(1).toUpperCase()}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Date Range Dropdown */}
                    <div className="relative" ref={rangeRef}>
                        <button 
                            onClick={() => setRangeOpen(!rangeOpen)} 
                            className={cn(
                                "btn-secondary px-3 py-2 text-xs flex items-center gap-1.5 transition-all",
                                rangeOpen && "border-neon-purple/40 bg-neon-purple/5"
                            )}
                        >
                            <Calendar className="w-3 h-3" /> 
                            <span>Range: <span className="text-neon-purple font-bold">{activeRange}</span></span>
                            <ChevronDown className={cn("w-3 h-3 transition-transform", rangeOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {rangeOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-40 glass-panel rounded-xl shadow-glass-lg border border-white/[0.08] p-1 z-50 overflow-hidden"
                                >
                                    {['24h', '7d', '30d', '90d'].map(r => (
                                        <button
                                            key={r}
                                            onClick={() => handleRangeSelect(r)}
                                            className={cn(
                                                "w-full px-3 py-2 rounded-lg text-left text-xs transition-colors",
                                                activeRange === r ? "text-neon-purple bg-neon-purple/10" : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.05]"
                                            )}
                                        >
                                            Last {r}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Global Threat Map (Styled Region Cards) */}
            <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-neon-blue" /> Global Threat Heatmap
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {regions.map(region => (
                        <div 
                            key={region.name} 
                            onClick={() => handleRegionClick(region.name, region.threats)}
                            className={cn(
                                "p-4 rounded-xl border bg-opacity-5 border-opacity-20 cursor-pointer hover:bg-opacity-10 transition-all hover:scale-[1.02]",
                                severityColor[region.severity]
                            )}
                        >
                            <p className="text-xs text-gray-400 mb-1">{region.name}</p>
                            <p className="text-xl font-bold text-white">{region.threats.toLocaleString()}</p>
                            <p className={`text-xs font-medium mt-1 ${region.change.startsWith('+') ? 'text-neon-red' : 'text-neon-green'}`}>{region.change} this week</p>
                        </div>
                    ))}
                </div>

                {/* Visual Heatmap */}
                <div className="mt-6 grid grid-cols-12 gap-1 px-1">
                    {heatmapData.map((cell, i) => (
                        <div 
                            key={i} 
                            onClick={() => handleHeatmapClick(cell.threats)}
                            className={cn(
                                "h-6 rounded-sm transition-all hover:scale-110 hover:shadow-lg cursor-pointer",
                                cell.bg
                            )} 
                            title={`Threats: ${cell.threats}`} 
                        />
                    ))}
                </div>
                <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-600">
                    <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-surface-600/30" /> Low</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-neon-blue/20" /> Medium</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-neon-orange/40" /> High</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-neon-red/60" /> Critical</span>
                </div>
            </div>

            {/* Attack Timeline */}
            <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-neon-blue" /> Attack Trends (30 Days)
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={timeline}>
                        <defs>
                            <linearGradient id="gradSpam2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.2} /><stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradPhish2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ff6b00" stopOpacity={0.2} /><stop offset="100%" stopColor="#ff6b00" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="day" stroke="#4b5563" tick={{ fontSize: 10 }} interval={4} />
                        <YAxis stroke="#4b5563" tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ background: '#1a1b2e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="spam" stroke="#00d4ff" fill="url(#gradSpam2)" strokeWidth={2} />
                        <Area type="monotone" dataKey="phishing" stroke="#ff6b00" fill="url(#gradPhish2)" strokeWidth={2} />
                        <Area type="monotone" dataKey="fraud" stroke="#ff3366" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Active Campaigns */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-neon-orange" /> Active Campaigns
                    </h3>
                    <span className="text-xs text-gray-500">{campaigns.filter(c => c.status === 'active').length} active</span>
                </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-xs text-gray-500 border-b border-white/[0.04]">
                                    <th className="pb-3 text-left font-medium">Campaign</th>
                                    <th className="pb-3 text-left font-medium">Type</th>
                                    <th className="pb-3 text-left font-medium">Targets</th>
                                    <th className="pb-3 text-left font-medium">Origin</th>
                                    <th className="pb-3 text-left font-medium">Severity</th>
                                    <th className="pb-3 text-left font-medium">Status</th>
                                    <th className="pb-3 text-left font-medium">First Seen</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                    {filteredCampaigns.map(camp => (
                                        <motion.tr 
                                            key={camp.id} 
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => handleCampaignClick(camp.id, camp.name)}
                                            className="border-b border-white/[0.02] hover:bg-white/[0.03] transition-all cursor-pointer group"
                                        >
                                    <td className="py-3">
                                        <div className="text-xs font-medium text-white group-hover:text-neon-blue transition-colors">{camp.name}</div>
                                        <div className="text-[10px] text-gray-500 font-mono">{camp.id}</div>
                                    </td>
                                    <td className="py-3 text-xs text-gray-300">{camp.type}</td>
                                    <td className="py-3 text-xs text-gray-300 font-mono">{camp.targets.toLocaleString()}</td>
                                    <td className="py-3 text-xs text-gray-400">{camp.origin}</td>
                                    <td className="py-3">
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${severityColor[camp.severity]}`}>
                                            {camp.severity}
                                        </span>
                                    </td>
                                    <td className={`py-3 text-xs font-medium capitalize ${statusColor[camp.status]}`}>{camp.status}</td>
                                    <td className="py-3 text-xs text-gray-500">{camp.firstSeen}</td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
            </div>

            {/* Deepfake & Insider Threat Awareness */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-neon-purple" /> Deepfake Awareness
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">AI-generated content detection and social engineering analysis</p>
                    <div className="space-y-3">
                        {[
                            { label: 'Deepfake Audio Attempts', value: '142', trend: '+23%' },
                            { label: 'Synthetic Image Detections', value: '89', trend: '+15%' },
                            { label: 'AI-Written Phishing', value: '1,247', trend: '+45%' },
                        ].map(item => (
                            <div 
                                key={item.label} 
                                onClick={() => handleAwarenessClick(item.label)}
                                className="flex items-center justify-between p-3 rounded-lg bg-surface-700/30 border border-transparent hover:border-neon-purple/20 hover:bg-neon-purple/5 transition-all cursor-pointer group"
                            >
                                <span className="text-xs text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-white">{item.value}</span>
                                    <span className="text-[10px] text-neon-red">{item.trend}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-neon-orange" /> Insider Threat Detection
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">Behavioral analytics and anomalous activity monitoring</p>
                    <div className="space-y-3">
                        {[
                            { label: 'Anomalous Access Patterns', value: '18', risk: 'high' },
                            { label: 'Data Exfiltration Attempts', value: '3', risk: 'critical' },
                            { label: 'Privilege Escalation Events', value: '7', risk: 'medium' },
                        ].map(item => (
                            <div 
                                key={item.label} 
                                onClick={() => handleAwarenessClick(item.label)}
                                className="flex items-center justify-between p-3 rounded-lg bg-surface-700/30 border border-transparent hover:border-neon-orange/20 hover:bg-neon-orange/5 transition-all cursor-pointer group"
                            >
                                <span className="text-xs text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-white">{item.value}</span>
                                    <span className={cn(
                                        "text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider",
                                        severityColor[item.risk]
                                    )}>{item.risk}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
