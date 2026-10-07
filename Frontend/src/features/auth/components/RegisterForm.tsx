'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Rocket, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { axiosClient } from '@/shared/api/axiosClient';

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosClient.post('/auth/register', { name, email, password });
      router.push('/login');
    } catch {
      // Demo register fallback
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl shadow-rose-950/30 text-slate-100">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 mx-auto flex items-center justify-center mb-3 shadow-lg shadow-rose-600/30">
          <Rocket className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Mars Kolonisine Katıl</h2>
        <p className="text-xs text-slate-400 mt-1">Yeni komutan profilinizi oluşturun ve Ares projesini yönetin.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ad Soyad / Unvan</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Kaptan John Ares"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">E-Posta Adresi</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="komutan@mars.colony"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Şifre</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 transition-all shadow-lg shadow-rose-950/40 disabled:opacity-50"
        >
          <span>{loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol ve Başla'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center mt-6 text-xs text-slate-400">
        Zaten hesabınız var mı?{' '}
        <Link href="/login" className="text-rose-400 hover:text-rose-300 font-semibold underline">
          Giriş Yap
        </Link>
      </div>
    </div>
  );
}
