'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Download, Clock, BarChart3,
    TrendingUp, Shield, Plus, Eye, Loader2, CheckCircle2
} from 'lucide-react';
import Modal from '@/components/Modal';

const initialReports = [
    { id: 'RPT-421', name: 'Weekly Threat Summary', type: 'Automated', generated: '2 hours ago', period: 'Feb 10-16, 2026', status: 'ready', pages: 24 },
    { id: 'RPT-420', name: 'Model Performance Report', type: 'Automated', generated: '1 day ago', period: 'January 2026', status: 'ready', pages: 18 },
    { id: 'RPT-419', name: 'Compliance Audit Report', type: 'Manual', generated: '3 days ago', period: 'Q4 2025', status: 'ready', pages: 42 },
    { id: 'RPT-418', name: 'Incident Response Report', type: 'Manual', generated: '1 week ago', period: 'Incident #892', status: 'ready', pages: 15 },
    { id: 'RPT-417', name: 'Executive Dashboard', type: 'Automated', generated: '1 week ago', period: 'Feb 3-9, 2026', status: 'ready', pages: 8 },
];

const templates = [
    { name: 'Weekly Threat Summary', schedule: 'Every Monday', icon: Shield },
    { name: 'Monthly Performance', schedule: '1st of month', icon: BarChart3 },
    { name: 'Quarterly Compliance', schedule: 'Quarterly', icon: FileText },
    { name: 'Executive Brief', schedule: 'Weekly', icon: TrendingUp },
];

export default function ReportsPage() {
    const [reportsList, setReportsList] = useState(initialReports);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [reportName, setReportName] = useState('Custom Audit Report');

    const handleGenerateReport = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        setProgress(0);

        // Simulated progress bar
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        try {
            const res = await fetch(ENDPOINTS.REPORTS.GENERATE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: reportName }),
            });

            if (res.ok) {
                const data = await res.json();
                setProgress(100);
                setTimeout(() => {
                    const newReport = {
                        id: data.data.report_id,
                        name: reportName,
                        type: 'Manual',
                        generated: 'Just now',
                        period: 'Feb 2026',
                        status: 'ready',
                        pages: Math.floor(Math.random() * 30) + 5
                    };
                    setReportsList([newReport, ...reportsList]);
                    setIsModalOpen(false);
                    setIsGenerating(false);
                    setReportName('Custom Audit Report');
                }, 500);
            }
        } catch (err) {
            console.error(err);
            clearInterval(interval);
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-white">Reports</h1>
                    <p className="text-sm text-gray-400 mt-1">Generated reports, templates, and scheduled exports</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
                >
                    <Plus className="w-3.5 h-3.5" /> Generate Report
                </button>
            </div>

            {/* Templates */}
            <div className="grid md:grid-cols-4 gap-4">
                {templates.map((t, i) => (
                    <motion.div key={t.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5 cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center mb-3 group-hover:bg-neon-blue/20 transition-colors">
                            <t.icon className="w-5 h-5 text-neon-blue" />
                        </div>
                        <p className="text-sm font-medium text-white mb-1">{t.name}</p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                            <Clock className="w-3 h-3" /> {t.schedule}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Reports Table */}
            <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Generated Reports</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-gray-500 border-b border-white/[0.04]">
                                <th className="pb-3 text-left font-medium">Report</th>
                                <th className="pb-3 text-left font-medium">Type</th>
                                <th className="pb-3 text-left font-medium">Period</th>
                                <th className="pb-3 text-left font-medium">Generated</th>
                                <th className="pb-3 text-left font-medium">Pages</th>
                                <th className="pb-3 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportsList.map((report, idx) => (
                                <tr key={report.id + idx} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                                    <td className="py-3">
                                        <div className="text-xs font-medium text-white">{report.name}</div>
                                        <div className="text-[10px] text-gray-500 font-mono">{report.id}</div>
                                    </td>
                                    <td className="py-3 text-xs text-gray-400">{report.type}</td>
                                    <td className="py-3 text-xs text-gray-300">{report.period}</td>
                                    <td className="py-3 text-xs text-gray-400">{report.generated}</td>
                                    <td className="py-3 text-xs text-gray-400">{report.pages}</td>
                                    <td className="py-3 flex gap-2">
                                        <button className="p-1.5 rounded-lg hover:bg-white/[0.05] text-gray-400 hover:text-neon-blue transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                                        <button className="p-1.5 rounded-lg hover:bg-white/[0.05] text-gray-400 hover:text-neon-green transition-colors"><Download className="w-3.5 h-3.5" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => !isGenerating && setIsModalOpen(false)} title="Generate Security Report">
                <form onSubmit={handleGenerateReport} className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Report Name</label>
                        <input 
                            type="text" 
                            required
                            disabled={isGenerating}
                            value={reportName}
                            onChange={e => setReportName(e.target.value)}
                            className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors disabled:opacity-50"
                            placeholder="e.g. Monthly Incident Audit"
                        />
                    </div>
                    {isGenerating && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px]">
                                <span className="text-gray-400">Processing records...</span>
                                <span className="text-neon-blue font-mono">{progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-surface-600 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-neon-blue"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={isGenerating}
                            className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
                        >
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Now"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
