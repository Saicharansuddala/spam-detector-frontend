'use client';

import React from 'react';
import { useStore } from '@/store/store';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import CommandPalette from '@/components/CommandPalette';
import { cn } from '@/utils/helpers';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { sidebarCollapsed } = useStore();

    return (
        <div className="min-h-screen bg-surface-900 cyber-grid-bg">
            <Sidebar />
            <CommandPalette />
            <div className={cn('transition-all duration-300', sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]')}>
                <Navbar />
                <main className="p-6 page-enter">
                    {children}
                </main>
            </div>
        </div>
    );
}
