'use client';

import React, { useState } from 'react';
import {
    Copy, Play, Globe, Key,
    Terminal, BookOpen, Download, CheckCircle, Loader2, Link as LinkIcon
} from 'lucide-react';
import Modal from '@/components/Modal';
import { useStore } from '@/store/store';
import { cn } from '@/utils/helpers';
import { ENDPOINTS } from '@/config/api';

const endpoints = [
    { method: 'POST', path: '/api/v1/detect', desc: 'Analyze text for threats', latency: '23ms' },
    { method: 'POST', path: '/api/v1/detect/bulk', desc: 'Bulk analysis of messages', latency: '~2s' },
    { method: 'GET', path: '/api/v1/threats', desc: 'List detected threats', latency: '45ms' },
    { method: 'GET', path: '/api/v1/campaigns', desc: 'Active threat campaigns', latency: '38ms' },
    { method: 'POST', path: '/api/v1/report', desc: 'Submit false positive/negative', latency: '15ms' },
    { method: 'GET', path: '/api/v1/models', desc: 'List available models', latency: '12ms' },
    { method: 'POST', path: '/api/v1/webhooks', desc: 'Configure webhook', latency: '8ms' },
    { method: 'GET', path: '/api/v1/health', desc: 'System health check', latency: '5ms' },
];

const codeExamples: Record<string, string> = {
    curl: `curl -X POST https://api.spamdetector.ai/v1/detect \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Your account has been compromised...",
    "models": ["phishnet-xl"],
    "options": {
      "explainability": true,
      "risk_scoring": true
    }
  }'`,
    python: `import spamdetector

client = spamdetector.Client(api_key="YOUR_API_KEY")

result = client.detect(
    text="Your account has been compromised...",
    models=["phishnet-xl"],
    explainability=True,
    risk_scoring=True
)

print(f"Prediction: {result.prediction}")
print(f"Confidence: {result.confidence}%")
print(f"Risk Score: {result.risk_score}/100")`,
    javascript: `import SpamDetector from '@spamdetector/sdk';

const client = new SpamDetector({
  apiKey: 'YOUR_API_KEY'
});

const result = await client.detect({
  text: 'Your account has been compromised...',
  models: ['phishnet-xl'],
  options: {
    explainability: true,
    riskScoring: true
  }
});

console.log(\`Prediction: \${result.prediction}\`);
console.log(\`Confidence: \${result.confidence}%\`);`,
};

const sampleResponse = `{
  "id": "det_8x92kf3m",
  "prediction": "phishing",
  "confidence": 97.3,
  "risk_score": 92,
  "category": "credential_harvesting",
  "tokens": [
    {"text": "compromised", "importance": 0.95},
    {"text": "immediately", "importance": 0.90}
  ],
  "model": "phishnet-xl-v3.2.1",
  "latency_ms": 23
}`;

const methodColor: Record<string, string> = {
    GET: 'text-neon-green bg-neon-green/10',
    POST: 'text-neon-blue bg-neon-blue/10',
    PUT: 'text-neon-orange bg-neon-orange/10',
    DELETE: 'text-neon-red bg-neon-red/10',
};

export default function ApiHubPage() {
    const { addNotification } = useStore();
    const [selectedLang, setSelectedLang] = useState('curl');
    const [copied, setCopied] = useState(false);
    const [selectedEndpoint, setSelectedEndpoint] = useState(0);
    const [isSending, setIsSending] = useState(false);
    const [response, setResponse] = useState<string>(sampleResponse);
    const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
    const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendRequest = async () => {
        setIsSending(true);
        try {
            // Simplified logic: for the demo, we call the real detect API if it's the first endpoint
            // Otherwise we simulate a delay and success
            if (endpoints[selectedEndpoint].path === '/api/v1/detect') {
                const res = await fetch(ENDPOINTS.DETECTION.SINGLE, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: "Urgent: Your account security is at risk. Please verify immediately.",
                        mode: "text"
                    })
                });
                const data = await res.json();
                setResponse(JSON.stringify(data, null, 2));
            } else {
                await new Promise(r => setTimeout(r, 800));
                setResponse(sampleResponse);
            }
            addNotification({
                id: Math.random().toString(),
                title: 'Request Successful',
                message: `Successfully called ${endpoints[selectedEndpoint].path}`,
                type: 'success',
                timestamp: new Date(),
                read: false
            });
        } catch (err) {
            console.error(err);
            setResponse(JSON.stringify({ error: "Failed to connect to backend", message: String(err) }, null, 2));
        } finally {
            setIsSending(false);
        }
    };

    const handleSdkDownload = (lang: string) => {
        addNotification({
            id: Math.random().toString(),
            title: 'Download Started',
            message: `Starting download for ${lang} SDK v2.1.0`,
            type: 'info',
            timestamp: new Date(),
            read: false
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-white">API Hub</h1>
                    <p className="text-sm text-gray-400 mt-1">REST API, webhooks, SDKs, and interactive sandbox</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsDocsModalOpen(true)} className="btn-secondary px-3 py-2 text-xs flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3" /> Docs
                    </button>
                    <button onClick={() => setIsKeyModalOpen(true)} className="btn-primary px-3 py-2 text-xs flex items-center gap-1.5">
                        <Key className="w-3 h-3" /> API Keys
                    </button>
                </div>
            </div>

            {/* SDK Download */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Python', 'JavaScript', 'Go', 'Java'].map(lang => (
                    <div 
                        key={lang} 
                        onClick={() => handleSdkDownload(lang)}
                        className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-all"
                    >
                        <div>
                            <p className="text-sm font-medium text-white">{lang} SDK</p>
                            <p className="text-[10px] text-gray-500">v2.1.0</p>
                        </div>
                        <Download className="w-4 h-4 text-gray-500 group-hover:text-neon-blue transition-colors" />
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Endpoints List */}
                <div className="lg:col-span-2 glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-neon-blue" /> Endpoints
                    </h3>
                    <div className="space-y-1.5">
                        {endpoints.map((ep, i) => (
                            <button
                                key={ep.path}
                                onClick={() => setSelectedEndpoint(i)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${i === selectedEndpoint ? 'bg-neon-blue/5 border border-neon-blue/10' : 'hover:bg-white/[0.02] border border-transparent'
                                    }`}
                            >
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${methodColor[ep.method]}`}>{ep.method}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-mono text-gray-300 truncate">{ep.path}</p>
                                    <p className="text-[10px] text-gray-500">{ep.desc}</p>
                                </div>
                                <span className="text-[10px] text-gray-600 font-mono">{ep.latency}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Code Sandbox */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Request */}
                    <div className="glass-card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-neon-green" /> Request Builder
                            </h3>
                            <div className="flex gap-1">
                                {Object.keys(codeExamples).map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => setSelectedLang(lang)}
                                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${selectedLang === lang ? 'bg-neon-blue/10 text-neon-blue' : 'text-gray-500 hover:text-gray-300'
                                            }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <pre className="bg-surface-900 rounded-xl p-4 text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre leading-relaxed border border-white/[0.03]">
                                {codeExamples[selectedLang]}
                            </pre>
                            <button
                                onClick={() => copyCode(codeExamples[selectedLang])}
                                className="absolute top-3 right-3 p-1.5 rounded-lg bg-surface-600/50 hover:bg-surface-500/50 text-gray-400 hover:text-white transition-colors"
                            >
                                {copied ? <CheckCircle className="w-3.5 h-3.5 text-neon-green" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <button 
                                onClick={handleSendRequest}
                                disabled={isSending}
                                className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5 disabled:opacity-50"
                            >
                                {isSending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                                {isSending ? 'Sending...' : 'Send Request'}
                            </button>
                        </div>
                    </div>

                    {/* Response */}
                    <div className="glass-card p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                Response <span className="text-[10px] text-neon-green font-mono ml-2">200 OK</span> <span className="text-[10px] text-gray-500 font-mono">23ms</span>
                            </h3>
                        </div>
                        <pre className="bg-surface-900 rounded-xl p-4 text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre leading-relaxed border border-white/[0.03] min-h-[140px]">
                            {response}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Webhook Config */}
            <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Webhook Configuration</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">Endpoint URL</label>
                        <input type="url" placeholder="https://your-app.com/webhook" className="w-full bg-surface-700/50 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-neon-blue/30 transition-colors font-mono" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">Events</label>
                        <div className="flex flex-wrap gap-2">
                            {['threat.detected', 'threat.blocked', 'model.updated', 'campaign.new'].map(event => (
                                <span key={event} className="px-2 py-1 rounded-lg bg-neon-blue/10 text-neon-blue text-[10px] font-mono border border-neon-blue/20">
                                    {event}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isKeyModalOpen} onClose={() => setIsKeyModalOpen(false)} title="Manage API Keys">
                <div className="space-y-4">
                    <p className="text-xs text-gray-400">Use these keys to authenticate your requests. Keep them secret and never expose them in client-side code.</p>
                    <div className="space-y-2">
                        {[
                            { name: 'Production Key', key: 'sp_live_9x2f4m8k7h3n1p0q' },
                            { name: 'Staging Key', key: 'sp_test_1s4v9x2f4m8k7h3n' }
                        ].map(k => (
                            <div key={k.name} className="p-3 rounded-xl bg-surface-700/50 border border-white/[0.06] flex items-center justify-between group">
                                <div>
                                    <p className="text-[10px] text-neon-blue font-bold uppercase mb-0.5">{k.name}</p>
                                    <p className="text-xs font-mono text-gray-300">••••••••••••••••{k.key.slice(-4)}</p>
                                </div>
                                <button onClick={() => copyCode(k.key)} className="p-2 rounded-lg hover:bg-white/[0.05] text-gray-500 hover:text-white transition-colors">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 mt-4">
                        <Key className="w-4 h-4" /> Generate New Key
                    </button>
                </div>
            </Modal>

            <Modal isOpen={isDocsModalOpen} onClose={() => setIsDocsModalOpen(false)} title="API Documentation">
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-3">
                        {[
                            { title: 'Authentication', desc: 'Secure your requests with Bearer tokens' },
                            { title: 'Error Codes', desc: 'Detailed reference for HTTP responses' },
                            { title: 'Rate Limits', desc: 'Quota and throughput information' },
                            { title: 'Best Practices', desc: 'Optimizing for lowest latency' }
                        ].map(doc => (
                            <div key={doc.title} className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-medium text-gray-200">{doc.title}</p>
                                    <LinkIcon className="w-3 h-3 text-gray-600 group-hover:text-neon-blue transition-colors" />
                                </div>
                                <p className="text-[10px] text-gray-500">{doc.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 rounded-xl bg-neon-blue/5 border border-neon-blue/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-neon-blue" />
                            <div>
                                <p className="text-sm font-medium text-white">Full Documentation</p>
                                <p className="text-xs text-gray-400">Read our comprehensive guide</p>
                            </div>
                        </div>
                        <button className="btn-primary px-4 py-2 text-xs">Explore</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
