'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Upload, Link as LinkIcon, FileText, AlertTriangle,
    Shield, Brain, BarChart3, Loader2,
    Mic, ScanLine, X, FileCheck
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { ENDPOINTS } from '@/config/api';

type DetectionMode = 'text' | 'url' | 'file' | 'voice';

interface DetectionResult {
    prediction: string;
    confidence: number;
    riskScore: number;
    category: string;
    tokens: { text: string; importance: number }[];
    details: { label: string; value: string }[];
}

interface DetectionSample {
    id: string;
    label: string;
    category: 'phishing' | 'spam' | 'safe' | 'url';
    content: string;
    description: string;
}

const DETECTION_SAMPLES: DetectionSample[] = [
    {
        id: 'p1',
        label: 'Banking Phish',
        category: 'phishing',
        description: 'Compromised account alert',
        content: 'URGENT: Your Chase account has been locked due to suspicious activity. Please visit http://chase-verify-login.net/auth to restore access immediately. Failure to do so will result in permanent suspension.'
    },
    {
        id: 'p2',
        label: 'Password Reset',
        category: 'phishing',
        description: 'Spoofed Office 365 login',
        content: 'Hi User, someone recently tried to log into your Microsoft 365 account from a new device in Moscow. If this was not you, please click here: http://msft-re-auth.com/reset to secure your account.'
    },
    {
        id: 's1',
        label: 'Lottery Scam',
        category: 'spam',
        description: 'Classic prize winnings',
        content: 'CONGRATULATIONS! Your mobile number has won $2,500,000.00 in our international lottery. To claim your prize, email your name and phone number to claims@win-big-prize.org'
    },
    {
        id: 's2',
        label: 'Crypto Pump',
        category: 'spam',
        description: 'Unsolicited investment tip',
        content: 'NEW GEM ALERT! 🚀 $MEMECOIN is about to 1000x! Get in now before the moonshot. Join our private telegram for the next signal: http://t.me/rich-quick-signals'
    },
    {
        id: 'safe1',
        label: 'Meeting Invite',
        category: 'safe',
        description: 'Normal business email',
        content: 'Hey Team, following up on our sync this morning. I have attached the meeting notes and the next steps for the Q4 roadmap. Let me know if you have any questions.'
    },
    {
        id: 'u1',
        label: 'Typosquatting',
        category: 'url',
        description: 'Misspelled domain link',
        content: 'https://www.g00gle.support/accounts/recovery'
    },
    {
        id: 'u2',
        label: 'Shortened Link',
        category: 'url',
        description: 'Obfuscated destination',
        content: 'https://bit.ly/3x8KzQ2s_secure_login'
    }
];

export default function DetectionPage() {
    const [mode, setMode] = useState<DetectionMode>('text');
    const [inputText, setInputText] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<DetectionResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const bulkInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError(null);
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (mode === 'text' || mode === 'url') {
            if (!inputText.trim()) return;
        } else {
            if (!selectedFile) return;
        }

        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            let response;
            if (selectedFile && (mode === 'file' || mode === 'voice')) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('mode', mode);

                response = await fetch(ENDPOINTS.DETECTION.FILE, {
                    method: 'POST',
                    body: formData,
                });
            } else {
                response = await fetch(ENDPOINTS.DETECTION.SINGLE, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: inputText, mode }),
                });
            }

            if (!response.ok) throw new Error('API server unreachable or error occurred');

            const data = await response.json();
            setResult(data);
        } catch (err) {
            const errorObj = err as Error;
            console.error('Detection error:', errorObj);
            setError(errorObj.message || 'Failed to connect to detection engine');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('dataset', file);
            
            const response = await fetch(ENDPOINTS.DETECTION.BULK, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Bulk processing failed');
            
            const data = await response.json();
            // Show a special mock result for bulk
            setResult({
                prediction: `Bulk Analysis Complete`,
                confidence: 100,
                riskScore: data.risk_summary.high > 10 ? 85 : 30,
                category: "Dataset Overview",
                tokens: [
                    { text: `Total: ${data.total_records}`, importance: 0.5 },
                    { text: `Threats: ${data.threats_found}`, importance: 0.9 },
                ],
                details: [
                    { label: "High Risk", value: data.risk_summary.high.toString() },
                    { label: "Medium Risk", value: data.risk_summary.medium.toString() },
                    { label: "Low Risk", value: data.risk_summary.low.toString() },
                    { label: "Time Taken", value: data.processing_time }
                ]
            });
        } catch (err: any) {
            setError(err.message || "Failed to process bulk dataset");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getImportanceColor = (importance: number) => {
        if (importance > 0.8) return 'bg-neon-red/30 text-neon-red border-neon-red/30';
        if (importance > 0.6) return 'bg-neon-orange/20 text-neon-orange border-neon-orange/20';
        if (importance > 0.3) return 'bg-neon-yellow/15 text-neon-yellow border-neon-yellow/20';
        return 'bg-transparent text-gray-400';
    };

    const getRiskColor = (score: number) => {
        if (score >= 80) return 'text-neon-red';
        if (score >= 60) return 'text-neon-orange';
        if (score >= 40) return 'text-neon-yellow';
        return 'text-neon-green';
    };

    const modes: { mode: DetectionMode; icon: React.ElementType; label: string }[] = [
        { mode: 'text', icon: FileText, label: 'Text/Email' },
        { mode: 'url', icon: LinkIcon, label: 'URL/Link' },
        { mode: 'file', icon: Upload, label: 'File Upload' },
        { mode: 'voice', icon: Mic, label: 'Voice/Audio' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-display text-white">Detection Lab</h1>
                <p className="text-sm text-gray-400 mt-1">Analyze messages, URLs, files, and audio for threats using AI</p>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-2">
                {modes.map(m => (
                    <button
                        key={m.mode}
                        onClick={() => { 
                            setMode(m.mode); 
                            setResult(null); 
                            setError(null); 
                            setSelectedFile(null);
                            setInputText('');
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === m.mode
                                ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                                : 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.03] border border-transparent'
                            }`}
                    >
                        <m.icon className="w-4 h-4" />
                        {m.label}
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Input Panel */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <ScanLine className="w-4 h-4 text-neon-blue" /> Input
                    </h3>

                    {mode === 'text' && (
                        <textarea
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            placeholder="Paste a suspicious email, message, or text here for analysis..."
                            className="w-full h-48 bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors resize-none font-mono"
                        />
                    )}

                    {mode === 'url' && (
                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="url"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                placeholder="https://suspicious-url.example.com/login"
                                className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors font-mono"
                            />
                        </div>
                    )}

                    {mode === 'file' && (
                        <div>
                            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept=".eml,.msg,.txt,.html,.pdf" />
                            {!selectedFile ? (
                                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/[0.06] rounded-xl p-12 text-center hover:border-neon-blue/20 transition-colors cursor-pointer group">
                                    <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3 group-hover:text-neon-blue transition-colors" />
                                    <p className="text-sm text-gray-400">Drop files here or <span className="text-neon-blue">browse</span></p>
                                    <p className="text-xs text-gray-600 mt-1">.eml, .msg, .txt, .html, .pdf up to 10MB</p>
                                </div>
                            ) : (
                                <div className="p-6 rounded-xl bg-surface-700/50 border border-neon-blue/20 flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-neon-blue/10 flex items-center justify-center mb-3">
                                        <FileCheck className="w-6 h-6 text-neon-blue" />
                                    </div>
                                    <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                    <button onClick={() => setSelectedFile(null)} className="mt-4 text-xs text-neon-red hover:underline flex items-center gap-1 mx-auto">
                                        <X className="w-3 h-3" /> Remove file
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {mode === 'voice' && (
                        <div>
                            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept=".wav,.mp3,.ogg,.m4a" />
                            {!selectedFile ? (
                                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/[0.06] rounded-xl p-12 text-center hover:border-neon-blue/20 transition-colors cursor-pointer group">
                                    <Mic className="w-10 h-10 text-gray-500 mx-auto mb-3 group-hover:text-neon-blue transition-colors" />
                                    <p className="text-sm text-gray-400">Upload audio for <span className="text-neon-blue">voice scam detection</span></p>
                                    <p className="text-xs text-gray-600 mt-1">.wav, .mp3, .ogg, .m4a up to 25MB</p>
                                </div>
                            ) : (
                                <div className="p-6 rounded-xl bg-surface-700/50 border border-neon-blue/20 flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-neon-blue/10 flex items-center justify-center mb-3 animate-pulse">
                                        <Mic className="w-6 h-6 text-neon-blue" />
                                    </div>
                                    <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    <button onClick={() => setSelectedFile(null)} className="mt-4 text-xs text-neon-red hover:underline flex items-center gap-1 mx-auto">
                                        <X className="w-3 h-3" /> Remove file
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3 mt-4">
                        <button 
                            onClick={handleAnalyze} 
                            disabled={isAnalyzing || (mode === 'text' || mode === 'url' ? !inputText.trim() : !selectedFile)} 
                            className="btn-primary px-6 py-2.5 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            {isAnalyzing ? 'Analyze' : 'Analyze'}
                        </button>
                    </div>

                    {/* Sample Library */}
                    {(mode === 'text' || mode === 'url') && (
                        <div className="mt-8 border-t border-white/[0.04] pt-6">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Samples Library</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {DETECTION_SAMPLES.filter(s => (mode === 'text' ? s.category !== 'url' : s.category === 'url')).map(sample => (
                                    <button
                                        key={sample.id}
                                        onClick={() => {
                                            setInputText(sample.content);
                                            setResult(null);
                                            setError(null);
                                        }}
                                        className="text-left p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-neon-blue/30 hover:bg-neon-blue/[0.02] transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={cn(
                                                "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase",
                                                sample.category === 'phishing' ? "text-neon-red bg-neon-red/10" :
                                                sample.category === 'spam' ? "text-neon-orange bg-neon-orange/10" :
                                                sample.category === 'safe' ? "text-neon-green bg-neon-green/10" :
                                                "text-neon-blue bg-neon-blue/10"
                                            )}>
                                                {sample.category}
                                            </span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-neon-blue transition-colors" />
                                        </div>
                                        <p className="text-xs font-semibold text-gray-200 group-hover:text-white mb-0.5">{sample.label}</p>
                                        <p className="text-[10px] text-gray-500 line-clamp-1">{sample.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Panel */}
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-neon-blue" /> Results
                    </h3>

                    <AnimatePresence mode="wait">
                        {isAnalyzing && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-16"
                            >
                                <div className="relative w-24 h-24 mb-6">
                                    {/* Brain Pulse */}
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                        className="absolute inset-0 rounded-full bg-neon-blue/20"
                                    />
                                    <div className="absolute inset-0 rounded-full border-2 border-neon-blue/10" />
                                    
                                    {/* Scanning Line */}
                                    <motion.div
                                        animate={{ 
                                            top: ['0%', '100%', '0%'],
                                            opacity: [0, 1, 0]
                                        }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-blue to-transparent z-10 shadow-[0_0_15px_rgba(0,212,255,0.8)]"
                                    />

                                    <motion.div
                                        animate={{ 
                                            rotate: 360
                                        }}
                                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                        className="absolute -inset-2 rounded-full border border-dashed border-neon-blue/20"
                                    />

                                    <div className="absolute inset-0 m-auto w-10 h-10 flex items-center justify-center">
                                        <Brain className="w-10 h-10 text-neon-blue" />
                                    </div>
                                </div>
                                
                                <motion.p 
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="text-sm font-medium text-white"
                                >
                                    {mode === 'text' && 'Scanning linguistic patterns...'}
                                    {mode === 'url' && 'Crawling destination server...'}
                                    {mode === 'file' && 'Running sandbox analysis...'}
                                    {mode === 'voice' && 'Analyzing biometric signatures...'}
                                </motion.p>
                                <p className="text-xs text-gray-500 mt-2">Neural network processing in progress</p>
                            </motion.div>
                        )}

                        {!isAnalyzing && !result && !error && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-16 text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-surface-600/50 flex items-center justify-center mb-4 text-gray-500">
                                    <Shield className="w-8 h-8" />
                                </div>
                                <p className="text-sm text-gray-400">Paste content and click Analyze to start detection</p>
                                <p className="text-xs text-gray-500 mt-1">Results will appear here with AI-powered explainability</p>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-16 text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-neon-red/10 flex items-center justify-center mb-4 text-neon-red">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                <p className="text-sm text-neon-red font-medium">{error}</p>
                                <p className="text-xs text-gray-500 mt-1">Please ensure the backend server is running on port 8000</p>
                                <button onClick={handleAnalyze} className="mt-4 text-xs text-neon-blue hover:underline">Try Again</button>
                            </motion.div>
                        )}

                        {result && (
                            <motion.div
                                key="result"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.1
                                        }
                                    }
                                }}
                                className="space-y-5"
                            >
                                {/* Prediction Header */}
                                <motion.div 
                                    variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                                    className="flex items-center gap-3 p-4 rounded-xl bg-neon-red/5 border border-neon-red/10"
                                >
                                    <AlertTriangle className="w-6 h-6 text-neon-red" />
                                    <div>
                                        <div className="text-lg font-bold text-neon-red">{result.prediction} Detected</div>
                                        <div className="text-xs text-gray-400">{result.category}</div>
                                    </div>
                                </motion.div>

                                {/* Scores */}
                                <motion.div 
                                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                    className="grid grid-cols-2 gap-3"
                                >
                                    <div className="p-4 rounded-xl bg-surface-700/50">
                                        <p className="text-xs text-gray-500 mb-1">Confidence</p>
                                        <div className="flex items-end gap-1">
                                            <span className="text-2xl font-bold text-white">{result.confidence}</span>
                                            <span className="text-sm text-gray-400 mb-0.5">%</span>
                                        </div>
                                        <div className="mt-2 h-1.5 bg-surface-600 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }} className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full" />
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-surface-700/50">
                                        <p className="text-xs text-gray-500 mb-1">Risk Score</p>
                                        <div className="flex items-end gap-1">
                                            <span className={`text-2xl font-bold ${getRiskColor(result.riskScore)}`}>{result.riskScore}</span>
                                            <span className="text-sm text-gray-400 mb-0.5">/100</span>
                                        </div>
                                        <div className="mt-2 h-1.5 bg-surface-600 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${result.riskScore}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.7 }} className="h-full bg-gradient-to-r from-neon-orange to-neon-red rounded-full" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Token Highlighting */}
                                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                                    <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                                        <Brain className="w-3 h-3" /> Token Importance (Explainability)
                                    </p>
                                    <div className="flex flex-wrap gap-1 p-3 rounded-xl bg-surface-700/30">
                                        {result.tokens.map((token, i) => (
                                            <motion.span
                                                key={i}
                                                variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                                                className={`px-1.5 py-0.5 rounded text-xs font-mono border ${getImportanceColor(token.importance)}`}
                                                title={`Importance: ${(token.importance * 100).toFixed(0)}%`}
                                            >
                                                {token.text}
                                            </motion.span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600">
                                        <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-neon-red/30" /> High</span>
                                        <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-neon-orange/20" /> Medium</span>
                                        <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-neon-yellow/15" /> Low</span>
                                    </div>
                                </motion.div>

                                {/* Detail Fields */}
                                <motion.div 
                                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                    className="grid grid-cols-2 gap-2"
                                >
                                    {result.details.map(d => (
                                        <div key={d.label} className="p-2.5 rounded-lg bg-surface-700/30">
                                            <p className="text-[10px] text-gray-500">{d.label}</p>
                                            <p className="text-xs text-gray-300 font-medium">{d.value}</p>
                                        </div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Bulk Upload Section */}
            <div className="glass-card p-6">
                <input ref={bulkInputRef} type="file" className="hidden" onChange={handleBulkUpload} accept=".csv,.json,.jsonl" />
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Upload className="w-4 h-4 text-neon-blue" /> Bulk Processing
                    </h3>
                    <span className="text-xs text-gray-500">Upload CSV/JSON datasets for batch analysis</span>
                </div>
                <div onClick={() => bulkInputRef.current?.click()} className="border-2 border-dashed border-white/[0.06] rounded-xl p-8 text-center hover:border-neon-blue/20 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Drop dataset here or <span className="text-neon-blue">browse</span></p>
                    <p className="text-xs text-gray-600 mt-1">CSV, JSON, JSONL — up to 100MB, max 100K records</p>
                </div>
            </div>
        </div>
    );
}
