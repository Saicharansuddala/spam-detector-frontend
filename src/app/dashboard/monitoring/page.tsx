'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity, AlertTriangle,
    CheckCircle, XCircle, TrendingUp
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const services = [
    { name: 'Detection API', status: 'operational', uptime: '99.99%', latency: '23ms', requests: '2.4M/h' },
    { name: 'Threat Intel Feed', status: 'operational', uptime: '99.98%', latency: '45ms', requests: '890K/h' },
    { name: 'ML Pipeline', status: 'degraded', uptime: '99.91%', latency: '120ms', requests: '15K/h' },
    { name: 'Analytics Engine', status: 'operational', uptime: '99.97%', latency: '68ms', requests: '450K/h' },
    { name: 'Auth Service', status: 'operational', uptime: '100%', latency: '8ms', requests: '1.2M/h' },
    { name: 'Storage Layer', status: 'operational', uptime: '99.99%', latency: '12ms', requests: '3.8M/h' },
];

const latencyData = Array.from({ length: 60 }, (_, i) => ({
    time: `${i}m`,
    api: 20 + Math.random() * 15,
    p50: 18 + Math.random() * 5,
    p99: 35 + Math.random() * 20,
}));

const alerts = [
    { id: 'ALT-892', severity: 'warning', message: 'ML Pipeline latency elevated above threshold (>100ms)', time: '12 min ago', acknowledged: false },
    { id: 'ALT-891', severity: 'info', message: 'Auto-scaling triggered: Detection API instances 12 → 16', time: '25 min ago', acknowledged: true },
    { id: 'ALT-890', severity: 'success', message: 'Model v3.2.1 deployment completed successfully', time: '1 hour ago', acknowledged: true },
    { id: 'ALT-889', severity: 'warning', message: 'Database connection pool reaching 80% capacity', time: '2 hours ago', acknowledged: true },
    { id: 'ALT-888', severity: 'critical', message: 'Rate limit exceeded for client acme-corp (>10K req/min)', time: '3 hours ago', acknowledged: true },
];

const eventLogs = [
    { time: '11:45:23', level: 'INFO', service: 'api-gateway', message: 'Health check passed for all upstream services' },
    { time: '11:44:58', level: 'WARN', service: 'ml-pipeline', message: 'Training job epoch 8/12 - GPU memory at 87%' },
    { time: '11:44:12', level: 'INFO', service: 'detection', message: 'Processed batch #89421 - 1,247 messages analyzed' },
    { time: '11:43:56', level: 'ERROR', service: 'webhook', message: 'Delivery failed to client endpoint (timeout after 30s)' },
    { time: '11:43:21', level: 'INFO', service: 'auth', message: 'Token refresh completed for org: spamdetector-global' },
    { time: '11:42:47', level: 'DEBUG', service: 'cache', message: 'Cache hit ratio: 94.2% (last 5 minutes)' },
];

const statusIcon: Record<string, { icon: React.ElementType; color: string }> = {
    operational: { icon: CheckCircle, color: 'text-neon-green' },
    degraded: { icon: AlertTriangle, color: 'text-neon-orange' },
    outage: { icon: XCircle, color: 'text-neon-red' },
};

const logColor: Record<string, string> = {
    INFO: 'text-neon-blue',
    WARN: 'text-neon-orange',
    ERROR: 'text-neon-red',
    DEBUG: 'text-gray-500',
};

const alertSeverityColor: Record<string, string> = {
    critical: 'text-neon-red bg-neon-red/10 border-neon-red/20',
    warning: 'text-neon-orange bg-neon-orange/10 border-neon-orange/20',
    info: 'text-neon-blue bg-neon-blue/10 border-neon-blue/20',
    success: 'text-neon-green bg-neon-green/10 border-neon-green/20',
};

export default function MonitoringPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-display text-white">Monitoring & Observability</h1>
                <p className="text-sm text-gray-400 mt-1">System health, service status, latency metrics, and event logs</p>
            </div>

            {/* Overall Status */}
            <div className="flex items-center gap-3 p-4 glass-card">
                <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse" />
                <span className="text-sm font-medium text-neon-green">All Core Systems Operational</span>
                <span className="text-xs text-gray-500 ml-auto">Last check: 12 seconds ago</span>
            </div>

            {/* Service Status Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {services.map((svc, i) => {
                    const StatusInfo = statusIcon[svc.status];
                    return (
                        <motion.div key={svc.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <StatusInfo.icon className={`w-4 h-4 ${StatusInfo.color}`} />
                                <span className="text-sm font-medium text-white">{svc.name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div><p className="text-[10px] text-gray-500">Uptime</p><p className="text-xs text-gray-300 font-mono">{svc.uptime}</p></div>
                                <div><p className="text-[10px] text-gray-500">Latency</p><p className="text-xs text-gray-300 font-mono">{svc.latency}</p></div>
                                <div className="col-span-2"><p className="text-[10px] text-gray-500">Requests</p><p className="text-xs text-gray-300 font-mono">{svc.requests}</p></div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Latency Chart */}
            <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-neon-blue" /> Latency (Last 60 min)
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={latencyData}>
                        <defs>
                            <linearGradient id="gradLat" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.15} /><stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="time" stroke="#4b5563" tick={{ fontSize: 10 }} interval={9} />
                        <YAxis stroke="#4b5563" tick={{ fontSize: 10 }} unit="ms" />
                        <Tooltip contentStyle={{ background: '#1a1b2e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="p99" stroke="#ff6b00" fill="transparent" strokeWidth={1} strokeDasharray="5 5" name="p99" />
                        <Area type="monotone" dataKey="api" stroke="#00d4ff" fill="url(#gradLat)" strokeWidth={2} name="Avg" />
                        <Area type="monotone" dataKey="p50" stroke="#00ff88" fill="transparent" strokeWidth={1} strokeDasharray="5 5" name="p50" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Alerts + Event Log */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Alerts */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-neon-orange" /> Recent Alerts
                    </h3>
                    <div className="space-y-2">
                        {alerts.map(alert => (
                            <div key={alert.id} className={`p-3 rounded-xl border ${alertSeverityColor[alert.severity]} ${alert.acknowledged ? 'opacity-60' : ''}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-200">{alert.message}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-mono text-gray-500">{alert.id}</span>
                                            <span className="text-[10px] text-gray-500">{alert.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Event Log */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-neon-blue" /> Live Event Log
                    </h3>
                    <div className="space-y-1 font-mono text-[11px]">
                        {eventLogs.map((log, i) => (
                            <div key={i} className="flex gap-3 py-1.5 border-b border-white/[0.02]">
                                <span className="text-gray-600 w-16 flex-shrink-0">{log.time}</span>
                                <span className={`w-10 flex-shrink-0 font-bold ${logColor[log.level]}`}>{log.level}</span>
                                <span className="text-gray-500 w-20 flex-shrink-0 truncate">{log.service}</span>
                                <span className="text-gray-400 flex-1 truncate">{log.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
