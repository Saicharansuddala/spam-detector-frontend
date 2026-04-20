import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

export function formatPercentage(num: number): string {
    return num.toFixed(1) + '%';
}

export function generateId(): string {
    return Math.random().toString(36).substring(2, 11);
}

export function timeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export function getStatusColor(status: string): string {
    switch (status) {
        case 'critical': case 'danger': case 'high': return 'text-neon-red';
        case 'warning': case 'medium': return 'text-neon-orange';
        case 'success': case 'low': case 'safe': return 'text-neon-green';
        case 'info': return 'text-neon-blue';
        default: return 'text-gray-400';
    }
}

export function getStatusBgColor(status: string): string {
    switch (status) {
        case 'critical': case 'danger': case 'high': return 'bg-neon-red/10 border-neon-red/20';
        case 'warning': case 'medium': return 'bg-neon-orange/10 border-neon-orange/20';
        case 'success': case 'low': case 'safe': return 'bg-neon-green/10 border-neon-green/20';
        case 'info': return 'bg-neon-blue/10 border-neon-blue/20';
        default: return 'bg-surface-600/50 border-surface-400/20';
    }
}

export function getRiskLevel(score: number): { label: string; color: string } {
    if (score >= 80) return { label: 'Critical', color: 'danger' };
    if (score >= 60) return { label: 'High', color: 'warning' };
    if (score >= 40) return { label: 'Medium', color: 'info' };
    return { label: 'Low', color: 'success' };
}
