import { UserRole } from '@/store/store';
import {
    LayoutDashboard, Search, Globe, BarChart3, Brain, Boxes, Code2,
    Activity, Users, Settings, FileText, Zap, Bot, Lock
} from 'lucide-react';

export interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
    roles: UserRole[];
    badge?: string;
    children?: NavItem[];
}

export const sidebarNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'analyst', 'developer', 'client'] },
    { label: 'Detection Lab', href: '/dashboard/detection', icon: Search, roles: ['admin', 'analyst', 'developer', 'client'], badge: 'AI' },
    { label: 'Threat Intelligence', href: '/dashboard/threat-intelligence', icon: Globe, roles: ['admin', 'analyst'] },
    { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, roles: ['admin', 'analyst', 'developer', 'client'] },
    { label: 'Explainable AI', href: '/dashboard/explainability', icon: Brain, roles: ['admin', 'analyst', 'developer'] },
    { label: 'MLOps', href: '/dashboard/mlops', icon: Boxes, roles: ['admin', 'developer'] },
    { label: 'API Hub', href: '/dashboard/api', icon: Code2, roles: ['admin', 'developer'] },
    { label: 'Reports', href: '/dashboard/reports', icon: FileText, roles: ['admin', 'analyst', 'client'] },
    { label: 'Monitoring', href: '/dashboard/monitoring', icon: Activity, roles: ['admin', 'analyst'] },
    { label: 'Automation', href: '/dashboard/automation', icon: Zap, roles: ['admin', 'analyst'] },
    { label: 'Collaboration', href: '/dashboard/collaboration', icon: Bot, roles: ['admin', 'analyst'] },
    { label: 'Security', href: '/dashboard/security', icon: Lock, roles: ['admin'] },
    { label: 'Admin', href: '/dashboard/admin', icon: Users, roles: ['admin'] },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['admin', 'analyst', 'developer', 'client'] },
];

export const publicNavItems = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
];

export const roleLabels: Record<UserRole, string> = {
    admin: 'Administrator',
    analyst: 'Security Analyst',
    developer: 'Developer',
    client: 'Enterprise Client',
};

export const roleColors: Record<UserRole, string> = {
    admin: 'text-neon-red',
    analyst: 'text-neon-blue',
    developer: 'text-neon-green',
    client: 'text-neon-orange',
};
