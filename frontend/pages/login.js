import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Sparkles, ShieldCheck, User, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { username, password });
      if (response.data.success) {
        // Success! The cookie is set by the server, but we can also store user info in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Authentication failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    // For guest mode, we just set a specific flag or do nothing and redirect
    localStorage.setItem('user', JSON.stringify('Guest'));
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-4">
      <Head>
        <title>Login | VisualSearch AI</title>
      </Head>

      <div className="w-full max-w-[440px] space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-border mb-4">
            <Sparkles className="text-secondary" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">VisualSearch AI</h1>
          <p className="text-text-muted">Authentication Mockup for Project Review</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-black/[0.03] border border-border relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary/5 rounded-full blur-3xl"></div>
          
          <form onSubmit={handleLogin} className="space-y-5 relative">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Teacher ID</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter ID (e.g. Professor)"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-[#FAFAF8] focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-[#FAFAF8] focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
            >
              {loading ? "Authenticating..." : "Authenticate"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-4">
            <button 
              onClick={handleGuest}
              className="text-sm font-semibold text-secondary hover:underline transition-all flex items-center gap-2"
            >
              Continue as Guest
            </button>
            
            <button 
              onClick={() => setShowDemoInfo(!showDemoInfo)}
              className="text-[10px] uppercase tracking-wider text-text-muted hover:text-primary transition-all underline"
            >
              {showDemoInfo ? "Hide Technical Details" : "Show Technical Details (for Teacher)"}
            </button>
          </div>
        </div>

        {showDemoInfo && (
          <div className="bg-violet-50 p-6 rounded-2xl border border-violet-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 mb-3 text-secondary">
              <ShieldCheck size={20} />
              <h3 className="font-bold text-sm">Teacher Review Notes</h3>
            </div>
            <ul className="text-xs text-secondary/80 space-y-2 list-disc ml-4">
              <li><strong>JWT Issuance:</strong> Clicking 'Authenticate' calls <code>/api/auth/login</code>.</li>
              <li><strong>Security:</strong> The server signs a JWT and sends it via the <code>Set-Cookie</code> header.</li>
              <li><strong>Storage:</strong> Look at <strong>Application → Cookies</strong> to see the <code>auth_token</code>.</li>
              <li><strong>Stateless:</strong> The JWT contains user info, allowing for a stateless microservices backend.</li>
              <li><strong>Guest Access:</strong> The 'Guest' button bypasses the auth step while keeping the project functional.</li>
            </ul>
          </div>
        )}

        <p className="text-center text-xs text-text-muted">
          VisualSearch AI System &copy; 2026 | Academic Microservices Architecture
        </p>
      </div>
    </div>
  );
}
