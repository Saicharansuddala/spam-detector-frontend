'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Shield, AlertTriangle, TrendingUp, ArrowUpRight,
    ArrowDownRight, CheckCircle, Wifi, WifiOff
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const kpis = [
    { label: 'Threats Detected', value: '12,847', change: '+12.3%', up: true, icon: Shield, color: 'from-neon-blue to-cyber-500' },
    { label: 'Threats Blocked', value: '12,691', change: '+11.8%', up: true, icon: CheckCircle, color: 'from-neon-green to-emerald-600' },
    { label: 'Active Campaigns', value: '23', change: '+5', up: false, icon: AlertTriangle, color: 'from-neon-orange to-orange-600' },
    { label: 'System Accuracy', value: '99.97%', change: '+0.02%', up: true, icon: TrendingUp, color: 'from-neon-purple to-purple-600' },
];

const threatData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    spam: Math.floor(Math.random() * 500 + 200),
    phishing: Math.floor(Math.random() * 200 + 50),
    fraud: Math.floor(Math.random() * 100 + 20),
}));

const categoryData = [
    { name: 'Spam', value: 58, color: '#00d4ff' },
    { name: 'Phishing', value: 25, color: '#ff6b00' },
    { name: 'Fraud', value: 12, color: '#ff3366' },
    { name: 'Scam', value: 5, color: '#a855f7' },
];

interface Threat {
    id: string;
    type: string;
    target: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    time: string;
    status: 'blocked' | 'investigating' | 'resolved';
}

const severityColor: Record<string, string> = {
    critical: 'text-neon-red bg-neon-red/10',
    high: 'text-neon-orange bg-neon-orange/10',
    medium: 'text-neon-yellow bg-neon-yellow/10',
    low: 'text-neon-green bg-neon-green/10',
};

const statusColor: Record<string, string> = {
    blocked: 'text-neon-green',
    investigating: 'text-neon-orange',
    resolved: 'text-gray-400',
};

const weeklyData = [
    { day: 'Mon', threats: 1823, blocked: 1811 },
    { day: 'Tue', threats: 2103, blocked: 2089 },
    { day: 'Wed', threats: 1956, blocked: 1940 },
    { day: 'Thu', threats: 2340, blocked: 2325 },
    { day: 'Fri', threats: 2891, blocked: 2879 },
    { day: 'Sat', threats: 1245, blocked: 1238 },
    { day: 'Sun', threats: 987, blocked: 981 },
];

export default function DashboardPage() {
    const [isOnline, setIsOnline] = useState<boolean | null>(null);
    const [threats, setThreats] = useState<Threat[]>([]);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch(ENDPOINTS.HEALTH);
                setIsOnline(res.ok);
            } catch {
                setIsOnline(false);
            }
        };

        const fetchThreats = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/v1/threats');
                if (res.ok) {
                    const data = await res.json();
                    setThreats(data);
                }
            } catch (err) {
                console.error('Failed to fetch threats:', err);
            }
        };

        checkStatus();
        fetchThreats();
        const interval = setInterval(() => {
            checkStatus();
            fetchThreats();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-white">Security Dashboard</h1>
                    <p className="text-sm text-gray-400 mt-1">Real-time threat monitoring and system overview</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                        isOnline === true ? 'bg-neon-green/10 border-neon-green/20 text-neon-green' :
                        isOnline === false ? 'bg-neon-red/10 border-neon-red/20 text-neon-red' :
                        'bg-white/5 border-white/10 text-gray-500'
                    }`}>
                        {isOnline === true ? (
                            <>
                                <Wifi className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Systems Operational</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse ml-1" />
                            </>
                        ) : isOnline === false ? (
                            <>
                                <WifiOff className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Backend Offline</span>
                            </>
                        ) : (
                            <>
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                <span className="text-xs font-medium">Checking Status...</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-5 group"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} bg-opacity-20 flex items-center justify-center`}>
                                <kpi.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? 'text-neon-green' : 'text-neon-orange'}`}>
                                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {kpi.change}
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-white font-display">{kpi.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{kpi.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Threat Activity */}
                <div className="lg:col-span-2 glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-semibold text-white">Threat Activity (24h)</h3>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neon-blue" /> Spam</span>
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neon-orange" /> Phishing</span>
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neon-red" /> Fraud</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={threatData}>
                            <defs>
                                <linearGradient id="gradSpam" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradPhishing" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ff6b00" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#ff6b00" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradFraud" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ff3366" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#ff3366" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="hour" stroke="#4b5563" tick={{ fontSize: 10 }} interval={3} />
                            <YAxis stroke="#4b5563" tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ background: '#1a1b2e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '12px' }} />
                            <Area type="monotone" dataKey="spam" stroke="#00d4ff" fill="url(#gradSpam)" strokeWidth={2} />
                            <Area type="monotone" dataKey="phishing" stroke="#ff6b00" fill="url(#gradPhishing)" strokeWidth={2} />
                            <Area type="monotone" dataKey="fraud" stroke="#ff3366" fill="url(#gradFraud)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-6">Threat Distribution</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#1a1b2e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '12px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-4">
                        {categoryData.map(cat => (
                            <div key={cat.name} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                                    <span className="text-gray-300">{cat.name}</span>
                                </div>
                                <span className="text-gray-400 font-mono">{cat.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-5 gap-6">
                {/* Recent Threats */}
                <div className="lg:col-span-3 glass-card p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-sm font-semibold text-white">Recent Threats</h3>
                        <button className="text-xs text-neon-blue hover:text-neon-blue/80">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-xs text-gray-500 border-b border-white/[0.04]">
                                    <th className="pb-3 text-left font-medium">ID</th>
                                    <th className="pb-3 text-left font-medium">Type</th>
                                    <th className="pb-3 text-left font-medium">Target</th>
                                    <th className="pb-3 text-left font-medium">Severity</th>
                                    <th className="pb-3 text-left font-medium">Status</th>
                                    <th className="pb-3 text-left font-medium">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {threats.map((threat) => (
                                    <tr key={threat.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                                        <td className="py-3 text-xs font-mono text-neon-blue">{threat.id}</td>
                                        <td className="py-3 text-xs text-gray-300">{threat.type}</td>
                                        <td className="py-3 text-xs text-gray-400 max-w-32 truncate">{threat.target}</td>
                                        <td className="py-3">
                                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${severityColor[threat.severity]}`}>
                                                {threat.severity}
                                            </span>
                                        </td>
                                        <td className={`py-3 text-xs font-medium capitalize ${statusColor[threat.status]}`}>{threat.status}</td>
                                        <td className="py-3 text-xs text-gray-500">{threat.time}</td>
                                    </tr>
                                ))}
                                {threats.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-xs text-gray-500">
                                            {isOnline === false ? 'Backend unreachable - showing no data' : 'Loading real-time threat data...'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Weekly Summary */}
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-5">Weekly Summary</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={weeklyData} barGap={2}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="day" stroke="#4b5563" tick={{ fontSize: 10 }} />
                            <YAxis stroke="#4b5563" tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ background: '#1a1b2e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '12px' }} />
                            <Bar dataKey="threats" fill="rgba(0, 212, 255, 0.3)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="blocked" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-6 mt-4 text-xs">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-neon-blue/30" /> Detected</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-neon-blue" /> Blocked</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
