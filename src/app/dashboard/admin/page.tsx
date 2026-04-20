'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Plus, MoreHorizontal,
    CheckCircle, AlertTriangle, Key, Activity, Building, Loader2, Mail
} from 'lucide-react';
import Modal from '@/components/Modal';
import { ENDPOINTS } from '@/config/api';

const initialUsers = [
    { name: 'Alex Morgan', email: 'alex@spamdetector.ai', role: 'Admin', status: 'active', lastActive: '2 min ago', mfa: true },
    { name: 'Sarah Chen', email: 'sarah@spamdetector.ai', role: 'Admin', status: 'active', lastActive: '15 min ago', mfa: true },
    { name: 'Marcus Rodriguez', email: 'marcus@spamdetector.ai', role: 'Analyst', status: 'active', lastActive: '1 hour ago', mfa: true },
    { name: 'Elena Petrova', email: 'elena@spamdetector.ai', role: 'Analyst', status: 'active', lastActive: '3 hours ago', mfa: true },
    { name: 'James Park', email: 'james@spamdetector.ai', role: 'Developer', status: 'active', lastActive: '30 min ago', mfa: false },
    { name: 'David Okafor', email: 'david@spamdetector.ai', role: 'Developer', status: 'inactive', lastActive: '2 days ago', mfa: true },
    { name: 'Aisha Patel', email: 'aisha@acme-corp.com', role: 'Client', status: 'active', lastActive: '5 hours ago', mfa: true },
];

const teams = [
    { name: 'Security Operations', members: 12, lead: 'Sarah Chen' },
    { name: 'ML Engineering', members: 8, lead: 'David Okafor' },
    { name: 'Threat Intelligence', members: 6, lead: 'Marcus Rodriguez' },
    { name: 'Platform Engineering', members: 10, lead: 'James Park' },
];

const roleColor: Record<string, string> = {
    Admin: 'text-neon-red bg-neon-red/10',
    Analyst: 'text-neon-blue bg-neon-blue/10',
    Developer: 'text-neon-green bg-neon-green/10',
    Client: 'text-neon-orange bg-neon-orange/10',
};

export default function AdminPage() {
    const [usersList, setUsersList] = useState(initialUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inviteData, setInviteData] = useState({ name: '', email: '', role: 'Analyst' });

    const handleInviteUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(ENDPOINTS.ADMIN.INVITES, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inviteData),
            });
            if (res.ok) {
                const newUser = {
                    name: inviteData.name,
                    email: inviteData.email,
                    role: inviteData.role,
                    status: 'pending',
                    lastActive: 'Never',
                    mfa: false
                };
                setUsersList([newUser, ...usersList]);
                setIsModalOpen(false);
                setInviteData({ name: '', email: '', role: 'Analyst' });
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
                    <h1 className="text-2xl font-bold font-display text-white">Admin Console</h1>
                    <p className="text-sm text-gray-400 mt-1">User management, teams, and system configuration</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
                >
                    <Plus className="w-3.5 h-3.5" /> Invite User
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: usersList.length.toString(), icon: Users, color: 'text-neon-blue' },
                    { label: 'Active Now', value: '12', icon: Activity, color: 'text-neon-green' },
                    { label: 'Teams', value: '4', icon: Building, color: 'text-neon-purple' },
                    { label: 'API Keys', value: '23', icon: Key, color: 'text-neon-orange' },
                ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
                        <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* User Table */}
            <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-4">User Management</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-gray-500 border-b border-white/[0.04]">
                                <th className="pb-3 text-left font-medium">User</th>
                                <th className="pb-3 text-left font-medium">Role</th>
                                <th className="pb-3 text-left font-medium">Status</th>
                                <th className="pb-3 text-left font-medium">MFA</th>
                                <th className="pb-3 text-left font-medium">Last Active</th>
                                <th className="pb-3 text-left font-medium"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersList.map((user, idx) => (
                                <tr key={user.email + idx} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                                    <td className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue/30 to-neon-purple/20 flex items-center justify-center text-xs font-bold text-neon-blue">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-white">{user.name}</p>
                                                <p className="text-[10px] text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${roleColor[user.role]}`}>{user.role}</span>
                                    </td>
                                    <td className="py-3">
                                        <span className={`flex items-center gap-1 text-xs ${user.status === 'active' ? 'text-neon-green' : user.status === 'pending' ? 'text-neon-yellow' : 'text-gray-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-neon-green' : user.status === 'pending' ? 'bg-neon-yellow' : 'bg-gray-500'}`} />
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        {user.mfa ? <CheckCircle className="w-4 h-4 text-neon-green" /> : <AlertTriangle className="w-4 h-4 text-neon-orange" />}
                                    </td>
                                    <td className="py-3 text-xs text-gray-400">{user.lastActive}</td>
                                    <td className="py-3">
                                        <button className="p-1 rounded hover:bg-white/[0.05] text-gray-500"><MoreHorizontal className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Teams */}
            <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Teams</h3>
                <div className="grid md:grid-cols-4 gap-4">
                    {teams.map(team => (
                        <div key={team.name} className="p-4 rounded-xl bg-surface-700/30 border border-white/[0.03] hover:border-neon-blue/10 transition-colors cursor-pointer">
                            <p className="text-sm font-medium text-white mb-2">{team.name}</p>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[11px]"><span className="text-gray-500">Members</span><span className="text-gray-300">{team.members}</span></div>
                                <div className="flex justify-between text-[11px]"><span className="text-gray-500">Lead</span><span className="text-gray-300">{team.lead}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Invite Team Member">
                <form onSubmit={handleInviteUser} className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input 
                                type="text" 
                                required
                                value={inviteData.name}
                                onChange={e => setInviteData({ ...inviteData, name: e.target.value })}
                                className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors"
                                placeholder="Jane Smith"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Work Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input 
                                type="email" 
                                required
                                value={inviteData.email}
                                onChange={e => setInviteData({ ...inviteData, email: e.target.value })}
                                className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors"
                                placeholder="jane@company.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Access Role</label>
                        <select 
                            value={inviteData.role}
                            onChange={e => setInviteData({ ...inviteData, role: e.target.value })}
                            className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-neon-blue/30 transition-colors"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Analyst">Analyst</option>
                            <option value="Developer">Developer</option>
                            <option value="Client">Client</option>
                        </select>
                    </div>
                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Invitation"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
