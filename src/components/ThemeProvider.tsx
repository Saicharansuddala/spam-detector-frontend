'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/store/store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useStore((state) => state.theme);

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Remove existing theme classes
        root.classList.remove('light', 'dark');
        
        // Add current theme class
        root.classList.add(theme);
        
        // Update meta theme-color if needed
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0f' : '#f8fafc');
        }
    }, [theme]);

    return <>{children}</>;
}
