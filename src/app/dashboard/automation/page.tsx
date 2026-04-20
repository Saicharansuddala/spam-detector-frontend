'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, ArrowRight, Plus, Play, Pause, Settings,
    Mail, Shield, AlertTriangle, Bell, GitBranch, Filter, Loader2
} from 'lucide-react';
import Modal from '@/components/Modal';
import { ENDPOINTS } from '@/config/api';

const initialWorkflows = [
    {
        id: 'WF-001', name: 'Auto-Block Phishing', status: 'active', trigger: 'Threat detected (phishing, confidence > 95%)',
        actions: ['Block sender', 'Notify security team', 'Create incident ticket'],
        executions: 1247, lastRun: '3 min ago',
    },
    {
        id: 'WF-002', name: 'Spam Quarantine', status: 'active', trigger: 'Spam detected (any confidence)',
        actions: ['Move to quarantine', 'Log event'],
        executions: 8942, lastRun: '1 min ago',
    },
    {
        id: 'WF-003', name: 'CEO Fraud Alert', status: 'active', trigger: 'BEC/impersonation detected',
        actions: ['Alert SOC manager', 'Freeze transaction', 'Page on-call'],
        executions: 23, lastRun: '2 hours ago',
    },
    {
        id: 'WF-004', name: 'Model Drift Response', status: 'paused', trigger: 'Model accuracy drops below 99%',
        actions: ['Trigger retraining pipeline', 'Alert ML team'],
        executions: 3, lastRun: '5 days ago',
    },
];

const ruleTemplates = [
    { icon: Shield, name: 'Block by Threat Score', desc: 'Automatically block messages above a risk threshold' },
    { icon: Mail, name: 'Email Quarantine', desc: 'Route suspicious emails to quarantine folder' },
    { icon: AlertTriangle, name: 'Escalation Rule', desc: 'Escalate critical threats to on-call team' },
    { icon: Bell, name: 'Custom Notification', desc: 'Send alerts via Slack, Teams, or email' },
    { icon: GitBranch, name: 'Conditional Logic', desc: 'Build IF-THEN rules for complex workflows' },
    { icon: Filter, name: 'Traffic Filter', desc: 'Filter and route traffic based on properties' },
];

export default function AutomationPage() {
    const [workflows, setWorkflows] = useState(initialWorkflows);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newWf, setNewWf] = useState({ name: '', trigger: '' });

    const handleCreateWorkflow = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(ENDPOINTS.AUTOMATION.WORKFLOWS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newWf, status: 'active' }),
            });
            if (res.ok) {
                const newEntry = {
                    id: `WF-00${workflows.length + 1}`,
                    name: newWf.name,
                    status: 'active',
                    trigger: newWf.trigger,
                    actions: ['Custom Action'],
                    executions: 0,
                    lastRun: 'Never'
                };
                setWorkflows([newEntry, ...workflows]);
                setNewWf({ name: '', trigger: '' });
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-white">Automation & Workflows</h1>
                    <p className="text-sm text-gray-400 mt-1">Build automated rules, alerts, and response workflows</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
                >
                    <Plus className="w-3.5 h-3.5" /> Create Workflow
                </button>
            </div>

            {/* Active Workflows */}
            <div className="space-y-3">
                {workflows.map((wf, i) => (
                    <motion.div key={wf.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="glass-card p-5 flex items-start gap-5"
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${wf.status === 'active' ? 'bg-neon-green/10' : 'bg-surface-600/50'}`}>
                            <Zap className={`w-5 h-5 ${wf.status === 'active' ? 'text-neon-green' : 'text-gray-500'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-semibold text-white">{wf.name}</h3>
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${wf.status === 'active' ? 'text-neon-green bg-neon-green/10' : 'text-gray-400 bg-gray-400/10'}`}>{wf.status}</span>
                            </div>
                            <p className="text-xs text-gray-400 mb-2"><strong className="text-gray-300">Trigger:</strong> {wf.trigger}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {wf.actions.map((action, ai) => (
                                    <React.Fragment key={ai}>
                                        <span className="text-[10px] px-2 py-0.5 rounded-lg bg-surface-600/50 text-gray-300">{action}</span>
                                        {ai < wf.actions.length - 1 && <ArrowRight className="w-3 h-3 text-gray-600 self-center" />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-xs text-gray-500">{wf.executions.toLocaleString()} runs</p>
                            <p className="text-[10px] text-gray-600">Last: {wf.lastRun}</p>
                            <div className="flex gap-1 mt-2 justify-end">
                                <button className="p-1.5 rounded-lg hover:bg-white/[0.05] text-gray-500 hover:text-neon-blue transition-colors">
                                    {wf.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                </button>
                                <button className="p-1.5 rounded-lg hover:bg-white/[0.05] text-gray-500 hover:text-gray-300 transition-colors">
                                    <Settings className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Rule Templates */}
            <div>
                <h3 className="text-sm font-semibold text-white mb-4">Quick Start Templates</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {ruleTemplates.map((template, i) => (
                        <motion.div key={template.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                            className="glass-card p-5 cursor-pointer group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-neon-blue/10 flex items-center justify-center mb-3 group-hover:bg-neon-blue/20 transition-colors">
                                <template.icon className="w-4.5 h-4.5 text-neon-blue" />
                            </div>
                            <p className="text-sm font-medium text-white mb-1">{template.name}</p>
                            <p className="text-xs text-gray-400">{template.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Workflow">
                <form onSubmit={handleCreateWorkflow} className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Workflow Name</label>
                        <input 
                            type="text" 
                            required
                            value={newWf.name}
                            onChange={e => setNewWf({ ...newWf, name: e.target.value })}
                            className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors"
                            placeholder="e.g. Unusual Login Response"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Trigger Event</label>
                        <input 
                            type="text" 
                            required
                            value={newWf.trigger}
                            onChange={e => setNewWf({ ...newWf, trigger: e.target.value })}
                            className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors"
                            placeholder="e.g. Risk score > 90"
                        />
                    </div>
                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Workflow"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
