'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Lock, Shield, Key, FileText, CheckCircle, AlertTriangle,
    Eye, Globe, Download
} from 'lucide-react';

const complianceItems = [
    { standard: 'SOC 2 Type II', status: 'certified', lastAudit: 'Jan 2026', nextAudit: 'Jul 2026', icon: Shield },
    { standard: 'GDPR', status: 'compliant', lastAudit: 'Dec 2025', nextAudit: 'Dec 2026', icon: Globe },
    { standard: 'ISO 27001', status: 'certified', lastAudit: 'Nov 2025', nextAudit: 'Nov 2026', icon: FileText },
    { standard: 'HIPAA', status: 'in-progress', lastAudit: 'N/A', nextAudit: 'Mar 2026', icon: Lock },
];

const auditLogs = [
    { time: '11:42:12', user: 'alex.morgan@spamdetector.ai', action: 'Accessed Detection Lab', ip: '192.168.1.42', risk: 'low' },
    { time: '11:38:45', user: 'sarah.chen@spamdetector.ai', action: 'Modified API key permissions', ip: '10.0.12.88', risk: 'medium' },
    { time: '11:35:21', user: 'api-service', action: 'Model v3.2.1 deployment started', ip: '10.0.0.1', risk: 'low' },
    { time: '11:30:09', user: 'marcus.r@spamdetector.ai', action: 'Exported threat report', ip: '172.16.0.15', risk: 'low' },
    { time: '11:28:15', user: 'admin@acme-corp.com', action: 'Bulk user role change', ip: '203.0.113.45', risk: 'high' },
    { time: '11:22:33', user: 'system', action: 'Automated certificate rotation', ip: '10.0.0.1', risk: 'low' },
];

const zeroTrustChecks = [
    { check: 'Multi-Factor Authentication', status: true, desc: 'Enforced for all users' },
    { check: 'Network Segmentation', status: true, desc: 'Micro-segmented access zones' },
    { check: 'Least Privilege Access', status: true, desc: 'RBAC with just-in-time elevation' },
    { check: 'Device Trust Verification', status: true, desc: 'Managed device compliance required' },
    { check: 'Encrypted Data at Rest', status: true, desc: 'AES-256 encryption' },
    { check: 'Encrypted Data in Transit', status: true, desc: 'TLS 1.3 enforced' },
    { check: 'Session Management', status: true, desc: '15-min idle timeout, binding to IP' },
    { check: 'Continuous Verification', status: false, desc: 'Step-up auth on sensitive actions (configuring)' },
];

const riskColor: Record<string, string> = {
    low: 'text-neon-green',
    medium: 'text-neon-orange',
    high: 'text-neon-red',
};

const complianceColor: Record<string, string> = {
    certified: 'text-neon-green bg-neon-green/10',
    compliant: 'text-neon-blue bg-neon-blue/10',
    'in-progress': 'text-neon-orange bg-neon-orange/10',
};

export default function SecurityPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-display text-white">Security & Compliance</h1>
                <p className="text-sm text-gray-400 mt-1">Zero trust architecture, compliance status, encryption, and audit trails</p>
            </div>

            {/* Compliance Cards */}
            <div className="grid md:grid-cols-4 gap-4">
                {complianceItems.map((item, i) => (
                    <motion.div key={item.standard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center">
                                <item.icon className="w-5 h-5 text-neon-blue" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">{item.standard}</p>
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${complianceColor[item.status]}`}>{item.status}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-[11px]"><span className="text-gray-500">Last Audit</span><span className="text-gray-300">{item.lastAudit}</span></div>
                            <div className="flex justify-between text-[11px]"><span className="text-gray-500">Next Audit</span><span className="text-gray-300">{item.nextAudit}</span></div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Zero Trust + Encryption */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-neon-blue" /> Zero Trust Framework
                    </h3>
                    <div className="space-y-2">
                        {zeroTrustChecks.map(check => (
                            <div key={check.check} className="flex items-center gap-3 p-3 rounded-xl bg-surface-700/30">
                                {check.status ? <CheckCircle className="w-4 h-4 text-neon-green flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 text-neon-orange flex-shrink-0" />}
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-gray-200">{check.check}</p>
                                    <p className="text-[10px] text-gray-500">{check.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Key className="w-4 h-4 text-neon-orange" /> Encryption & Data Protection
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Data at Rest', algo: 'AES-256-GCM', status: 'active', keyRotation: '90 days' },
                            { label: 'Data in Transit', algo: 'TLS 1.3', status: 'active', keyRotation: 'Per session' },
                            { label: 'API Authentication', algo: 'RSA-4096 + JWT', status: 'active', keyRotation: '30 days' },
                            { label: 'Database Encryption', algo: 'Transparent Data Encryption', status: 'active', keyRotation: '180 days' },
                        ].map(item => (
                            <div key={item.label} className="p-4 rounded-xl bg-surface-700/30">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-white">{item.label}</span>
                                    <span className="text-[10px] text-neon-green font-medium">{item.status}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div><p className="text-[10px] text-gray-500">Algorithm</p><p className="text-xs text-gray-300 font-mono">{item.algo}</p></div>
                                    <div><p className="text-[10px] text-gray-500">Key Rotation</p><p className="text-xs text-gray-300">{item.keyRotation}</p></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Audit Log */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Eye className="w-4 h-4 text-neon-purple" /> Audit Log
                    </h3>
                    <button className="btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5">
                        <Download className="w-3 h-3" /> Export
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-gray-500 border-b border-white/[0.04]">
                                <th className="pb-3 text-left font-medium">Time</th>
                                <th className="pb-3 text-left font-medium">User</th>
                                <th className="pb-3 text-left font-medium">Action</th>
                                <th className="pb-3 text-left font-medium">IP Address</th>
                                <th className="pb-3 text-left font-medium">Risk</th>
                            </tr>
                        </thead>
                        <tbody>
                            {auditLogs.map((log, i) => (
                                <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                                    <td className="py-3 text-xs text-gray-400 font-mono">{log.time}</td>
                                    <td className="py-3 text-xs text-gray-300">{log.user}</td>
                                    <td className="py-3 text-xs text-gray-300">{log.action}</td>
                                    <td className="py-3 text-xs text-gray-400 font-mono">{log.ip}</td>
                                    <td className={`py-3 text-xs font-medium capitalize ${riskColor[log.risk]}`}>{log.risk}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
