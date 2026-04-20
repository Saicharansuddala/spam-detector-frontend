'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, Clock,
    Plus, Filter, User, Send, Paperclip, Loader2, AlertCircle
} from 'lucide-react';
import Modal from '@/components/Modal';
import { useStore } from '@/store/store';
import { cn } from '@/utils/helpers';
import { ENDPOINTS } from '@/config/api';

const initialCases = [
    { id: 'CASE-102', title: 'Coordinated phishing campaign targeting finance dept', priority: 'critical', status: 'open', assignee: 'Sarah Chen', created: '2 hours ago', comments: 8 },
    { id: 'CASE-101', title: 'False positive rate spike in SMS detection model', priority: 'high', status: 'in-progress', assignee: 'David Okafor', created: '5 hours ago', comments: 12 },
    { id: 'CASE-100', title: 'New BEC variant bypassing current filters', priority: 'high', status: 'in-progress', assignee: 'Marcus Rodriguez', created: '1 day ago', comments: 6 },
    { id: 'CASE-099', title: 'Client Acme Corp reporting missed spam detections', priority: 'medium', status: 'open', assignee: 'Elena Petrova', created: '1 day ago', comments: 4 },
    { id: 'CASE-098', title: 'Voice scam detection model accuracy review', priority: 'medium', status: 'resolved', assignee: 'Aisha Patel', created: '3 days ago', comments: 15 },
];

const initialComments = [
    { user: 'Sarah Chen', avatar: 'SC', role: 'Analyst', time: '30 min ago', text: 'I\'ve identified the payload domains. All using recently registered TLDs. Adding to block list now.' },
    { user: 'Marcus Rodriguez', avatar: 'MR', role: 'CTO', time: '45 min ago', text: 'Good catch. Let\'s also update the detection model with these new patterns. @David can you retrain with the new samples?' },
    { user: 'David Okafor', avatar: 'DO', role: 'ML Engineer', time: '1 hour ago', text: 'Starting pipeline now. ETA for new model: ~3 hours. Will deploy to canary first.' },
];

const priorityColor: Record<string, string> = {
    critical: 'text-neon-red bg-neon-red/10',
    high: 'text-neon-orange bg-neon-orange/10',
    medium: 'text-neon-yellow bg-neon-yellow/10',
    low: 'text-neon-green bg-neon-green/10',
};

const statusColor: Record<string, string> = {
    open: 'text-neon-blue bg-neon-blue/10',
    'in-progress': 'text-neon-orange bg-neon-orange/10',
    resolved: 'text-neon-green bg-neon-green/10',
};

export default function CollaborationPage() {
    const { user: currentUser } = useStore();
    const [casesList, setCasesList] = useState(initialCases);
    const [selectedCase, setSelectedCase] = useState(0);
    const [caseComments, setCaseComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPostingComment, setIsPostingComment] = useState(false);
    const [newCase, setNewCase] = useState({ title: '', priority: 'medium' });

    const handleNewCase = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(ENDPOINTS.COLLABORATION.CASES, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCase),
            });
            if (res.ok) {
                const entry = {
                    id: `CASE-${103 + casesList.length}`,
                    title: newCase.title,
                    priority: newCase.priority,
                    status: 'open',
                    assignee: 'Unassigned',
                    created: 'Just now',
                    comments: 0
                };
                setCasesList([entry, ...casesList]);
                setIsModalOpen(false);
                setNewCase({ title: '', priority: 'medium' });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendComment = async () => {
        if (!newComment.trim() || !currentUser || isPostingComment) return;
        
        setIsPostingComment(true);
        const commentData = {
            user: currentUser.name,
            avatar: currentUser.name.charAt(0),
            role: currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1),
            time: 'Just now',
            text: newComment,
            caseId: casesList[selectedCase]?.id
        };

        try {
            const res = await fetch(ENDPOINTS.COLLABORATION.COMMENTS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentData),
            });

            if (res.ok) {
                setCaseComments([...caseComments, {
                    user: commentData.user,
                    avatar: commentData.avatar,
                    role: commentData.role,
                    time: commentData.time,
                    text: commentData.text
                }]);
                setNewComment('');
            }
        } catch (err) {
            console.error('Failed to post comment:', err);
        } finally {
            setIsPostingComment(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-white">Collaboration</h1>
                    <p className="text-sm text-gray-400 mt-1">Case management, comments, and team coordination</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
                >
                    <Plus className="w-3.5 h-3.5" /> New Case
                </button>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Case List */}
                <div className="lg:col-span-2 glass-card p-4 space-y-2 h-[calc(100vh-280px)] overflow-y-auto">
                    <div className="flex items-center justify-between mb-2 px-2 sticky top-0 bg-surface-800 py-1 z-10">
                        <h3 className="text-sm font-semibold text-white">Cases</h3>
                        <button className="p-1 text-gray-500 hover:text-gray-300"><Filter className="w-4 h-4" /></button>
                    </div>
                    {casesList.map((c, i) => (
                        <button
                            key={c.id}
                            onClick={() => setSelectedCase(i)}
                            className={`w-full text-left p-3 rounded-xl transition-all ${i === selectedCase ? 'bg-neon-blue/5 border border-neon-blue/10' : 'hover:bg-white/[0.02] border border-transparent'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-1">
                                <span className="text-[10px] font-mono text-gray-500">{c.id}</span>
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${priorityColor[c.priority]}`}>{c.priority}</span>
                            </div>
                            <p className="text-xs font-medium text-gray-200 mb-2 line-clamp-2">{c.title}</p>
                            <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                <span className={`px-1.5 py-0.5 rounded-full ${statusColor[c.status]}`}>{c.status}</span>
                                <span className="flex items-center gap-1"><MessageSquare className="w-2.5 h-2.5" />{c.comments}</span>
                                <span>{c.created}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Case Detail */}
                <div className="lg:col-span-3 glass-card p-6 flex flex-col h-[calc(100vh-280px)]">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono text-gray-500">{casesList[selectedCase]?.id || 'N/A'}</span>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${priorityColor[casesList[selectedCase]?.priority] || ''}`}>{casesList[selectedCase]?.priority}</span>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor[casesList[selectedCase]?.status] || ''}`}>{casesList[selectedCase]?.status}</span>
                        </div>
                        <h2 className="text-lg font-semibold text-white mb-2">{casesList[selectedCase]?.title}</h2>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {casesList[selectedCase]?.assignee}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {casesList[selectedCase]?.created}</span>
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="flex-1 space-y-4 mb-6 overflow-y-auto pr-2 custom-scrollbar">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider sticky top-0 bg-surface-800 py-1">Discussion</h3>
                        {caseComments.map((c, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                className="flex gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue/30 to-neon-purple/20 flex items-center justify-center text-[10px] font-bold text-neon-blue flex-shrink-0">
                                    {c.avatar}
                                </div>
                                <div className="flex-1 p-3 rounded-xl bg-surface-700/30">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-white">{c.user}</span>
                                        <span className="text-[10px] text-gray-500">{c.role}</span>
                                        <span className="text-[10px] text-gray-600 ml-auto">{c.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-300 leading-relaxed">{c.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Reply Box */}
                    <div className="flex gap-3 pt-4 border-t border-white/[0.04]">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 uppercase">
                            {currentUser ? currentUser.name.charAt(0) : '?'}
                        </div>
                        <div className="flex-1 flex items-end gap-2">
                            <div className={cn(
                                "flex-1 bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-2.5 transition-all",
                                !currentUser && "opacity-50 grayscale pointer-events-none"
                            )}>
                                <input 
                                    type="text" 
                                    value={newComment}
                                    disabled={!currentUser || isPostingComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSendComment()}
                                    placeholder={currentUser ? "Add a comment..." : "Please login to comment"} 
                                    className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none" 
                                />
                            </div>
                            <button className="p-2.5 rounded-xl hover:bg-white/[0.05] text-gray-500 disabled:opacity-50" disabled={!currentUser || isPostingComment}>
                                <Paperclip className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={handleSendComment} 
                                disabled={!currentUser || isPostingComment || !newComment.trim()}
                                className="btn-primary p-2.5 rounded-xl disabled:opacity-50 disabled:grayscale transition-all"
                            >
                                {isPostingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error state if not logged in */}
            {!currentUser && (
                <div className="mt-4 flex items-center gap-2 text-neon-orange bg-neon-orange/10 px-4 py-3 rounded-xl border border-neon-orange/20">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-xs font-medium">You are viewing this case in read-only mode. Please login as Admin to post comments.</p>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Initialize New Investigation Case">
                <form onSubmit={handleNewCase} className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Case Title</label>
                        <textarea 
                            required
                            rows={3}
                            value={newCase.title}
                            onChange={e => setNewCase({ ...newCase, title: e.target.value })}
                            className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors resize-none"
                            placeholder="Brief description of the security incident..."
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Priority Level</label>
                        <select 
                            value={newCase.priority}
                            onChange={e => setNewCase({ ...newCase, priority: e.target.value })}
                            className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-neon-blue/30 transition-colors"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initialize Case"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
