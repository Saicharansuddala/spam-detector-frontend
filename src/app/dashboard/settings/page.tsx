'use client';

import React, { useState } from 'react';
import {
    User, Bell, Key, Palette, Shield, Code2, Save
} from 'lucide-react';
import { useStore } from '@/store/store';

const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Code2 },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const { user } = useStore();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-display text-white">Settings</h1>
                <p className="text-sm text-gray-400 mt-1">Manage your account, preferences, and integrations</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Tabs */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-2 space-y-0.5">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${activeTab === tab.id ? 'bg-neon-blue/10 text-neon-blue' : 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.02]'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-4 glass-card p-6">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <h3 className="text-sm font-semibold text-white">Profile Settings</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-2xl font-bold text-white">
                                    {user?.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{user?.name}</p>
                                    <p className="text-xs text-gray-400">{user?.email}</p>
                                    <p className="text-xs text-neon-blue capitalize mt-0.5">{user?.role}</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 mb-1.5 block">Full Name</label>
                                    <input type="text" defaultValue={user?.name} className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-neon-blue/30 transition-colors" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
                                    <input type="email" defaultValue={user?.email} className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-neon-blue/30 transition-colors" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1.5 block">Organization</label>
                                    <input type="text" defaultValue={user?.organization} className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-neon-blue/30 transition-colors" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1.5 block">Timezone</label>
                                    <select className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-neon-blue/30 transition-colors">
                                        <option>UTC-8 (Pacific Time)</option>
                                        <option>UTC-5 (Eastern Time)</option>
                                        <option>UTC+0 (GMT)</option>
                                        <option>UTC+5:30 (IST)</option>
                                    </select>
                                </div>
                            </div>
                            <button className="btn-primary px-5 py-2 text-sm flex items-center gap-2">
                                <Save className="w-3.5 h-3.5" /> Save Changes
                            </button>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-5">
                            <h3 className="text-sm font-semibold text-white">Notification Preferences</h3>
                            {[
                                { label: 'Critical Threat Alerts', desc: 'Immediate notification for critical threats', enabled: true },
                                { label: 'Model Updates', desc: 'New model versions and deployments', enabled: true },
                                { label: 'Weekly Reports', desc: 'Automated weekly threat summary', enabled: true },
                                { label: 'API Usage Alerts', desc: 'Rate limit warnings and API errors', enabled: false },
                                { label: 'Team Activity', desc: 'Comments, assignments, and case updates', enabled: true },
                                { label: 'System Maintenance', desc: 'Scheduled maintenance notifications', enabled: false },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-surface-700/30">
                                    <div>
                                        <p className="text-sm text-white">{item.label}</p>
                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${item.enabled ? 'bg-neon-blue' : 'bg-surface-500'}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white mt-0.5 transition-all ${item.enabled ? 'ml-5.5' : 'ml-0.5'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'api-keys' && (
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-white">API Keys</h3>
                                <button className="btn-primary px-3 py-1.5 text-xs flex items-center gap-1.5"><Key className="w-3 h-3" /> Create Key</button>
                            </div>
                            {[
                                { name: 'Production Key', prefix: 'cs_prod_...8x2f', created: 'Jan 15, 2026', lastUsed: '2 min ago' },
                                { name: 'Staging Key', prefix: 'cs_stg_...4m9k', created: 'Dec 1, 2025', lastUsed: '3 hours ago' },
                                { name: 'Development Key', prefix: 'cs_dev_...7h3n', created: 'Nov 20, 2025', lastUsed: '1 day ago' },
                            ].map(key => (
                                <div key={key.name} className="flex items-center justify-between p-4 rounded-xl bg-surface-700/30">
                                    <div>
                                        <p className="text-sm text-white">{key.name}</p>
                                        <p className="text-xs text-gray-500 font-mono mt-0.5">{key.prefix}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-500">Created: {key.created}</p>
                                        <p className="text-[10px] text-gray-500">Last used: {key.lastUsed}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="space-y-5">
                            <h3 className="text-sm font-semibold text-white">Appearance</h3>
                            <div>
                                <p className="text-xs text-gray-400 mb-3">Theme</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Dark', 'Light', 'System'].map(theme => (
                                        <button key={theme} className={`p-4 rounded-xl border text-center text-sm transition-all ${theme === 'Dark' ? 'border-neon-blue/30 bg-neon-blue/5 text-neon-blue' : 'border-white/[0.06] text-gray-400 hover:border-white/[0.1]'}`}>
                                            {theme}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-3">Language</p>
                                <select className="w-full max-w-xs bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-gray-300 outline-none">
                                    <option>English</option>
                                    <option>Español</option>
                                    <option>Français</option>
                                    <option>Deutsch</option>
                                    <option>日本語</option>
                                    <option>中文</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-5">
                            <h3 className="text-sm font-semibold text-white">Security Settings</h3>
                            {[
                                { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security', status: 'Enabled', action: 'Manage' },
                                { label: 'Session Management', desc: '2 active sessions', status: 'Active', action: 'View Sessions' },
                                { label: 'Password', desc: 'Last changed 30 days ago', status: 'Strong', action: 'Change' },
                                { label: 'Login History', desc: 'Review recent login activity', status: '12 logins', action: 'View' },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-surface-700/30">
                                    <div>
                                        <p className="text-sm text-white">{item.label}</p>
                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-neon-green">{item.status}</span>
                                        <button className="btn-secondary px-3 py-1 text-xs">{item.action}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div className="space-y-5">
                            <h3 className="text-sm font-semibold text-white">Integrations</h3>
                            {[
                                { name: 'Slack', desc: 'Send alerts to Slack channels', connected: true },
                                { name: 'Microsoft Teams', desc: 'Team notification integration', connected: false },
                                { name: 'PagerDuty', desc: 'Incident response automation', connected: true },
                                { name: 'Jira', desc: 'Create tickets from threats', connected: false },
                                { name: 'Splunk', desc: 'Export logs and analytics', connected: true },
                            ].map(item => (
                                <div key={item.name} className="flex items-center justify-between p-4 rounded-xl bg-surface-700/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-surface-600/50 flex items-center justify-center text-xs font-bold text-gray-400">
                                            {item.name.substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="text-sm text-white">{item.name}</p>
                                            <p className="text-xs text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                    <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${item.connected ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' : 'btn-secondary'}`}>
                                        {item.connected ? 'Connected' : 'Connect'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
