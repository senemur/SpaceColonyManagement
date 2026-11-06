'use client';

import React, { useState } from 'react';
import ResourceBar from '@/features/colony/components/ResourceBar';
import { useTechTree, useStartResearch, Technology } from '@/features/research/api/researchApi';
import {
  FlaskConical,
  Play,
  Lock,
  CheckCircle2,
  Clock,
  Coins,
  Pickaxe,
  Sparkles,
  Layers,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function ResearchPage() {
  const colonyId = 1;
  const { data: techs, isLoading, isError, refetch } = useTechTree(colonyId);
  const startResearchMutation = useStartResearch(colonyId);

  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const activeResearch = techs?.find((t) => t.status === 3); // 3: InProgress

  const categories = ['Tümü', 'Biyoloji & Tarım', 'Enerji Sistemleri', 'Madencilik', 'Yaşam Destek'];

  const filteredTechs = techs?.filter((tech) => {
    if (selectedCategory === 'Tümü') return true;
    return tech.categoryName.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const handleStartResearch = (tech: Technology) => {
    setActionMessage(null);
    startResearchMutation.mutate(tech.id, {
      onSuccess: (data) => {
        setActionMessage({
          text: data.message || `'${tech.name}' araştırması başlatıldı!`,
          type: 'success',
        });
        setTimeout(() => setActionMessage(null), 6000);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (err: any) => {
        const errorMsg =
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          'Araştırma başlatılamadı. Lütfen kaynaklarınızı ve ön koşulları kontrol edin.';
        setActionMessage({
          text: errorMsg,
          type: 'error',
        });
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 w-full space-y-6">
      {/* Koloni Kaynak Çubuğu */}
      <ResourceBar colonyId={colonyId} />

      {/* Başlık & Açıklama */}
      <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner">
            <FlaskConical className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-100">Mars Teknoloji & Araştırma Ağacı</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Yeni teknolojiler araştırarak üretim verimliliğinizi katlayın ve bina inşa maliyetlerini düşürün.
            </p>
          </div>
        </div>

        {/* Kategori Filtresi */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 font-bold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Geri Bildirim Bildirimi */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-300 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-xs font-bold opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Aktif Araştırma Paneli */}
      {activeResearch && (
        <div className="bg-gradient-to-r from-teal-950/60 via-slate-900/80 to-slate-900/80 border border-teal-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-400">
                  Laboratuvarda Aktif Araştırma
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-300 font-semibold">{activeResearch.categoryName}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">{activeResearch.name}</h2>
              <p className="text-xs text-slate-400 max-w-2xl">{activeResearch.description}</p>
            </div>

            <div className="flex items-center gap-6 md:text-right shrink-0">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tamamlanma Süresi</span>
                <span className="text-sm font-bold text-teal-300 flex items-center md:justify-end gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {activeResearch.durationInSols} Sol
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Kazanılacak Bonus</span>
                <span className="text-sm font-bold text-emerald-400 flex items-center md:justify-end gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {activeResearch.bonusDescription}
                </span>
              </div>
            </div>
          </div>

          {/* İlerleme Çubuğu */}
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">
                Sol simülasyonu ilerledikçe laboratuvar puanı aktarılır
              </span>
              <span className="font-bold text-teal-300">%{activeResearch.progress.toFixed(1)}</span>
            </div>
            <div className="w-full bg-slate-950/80 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm shadow-teal-500/50"
                style={{ width: `${Math.max(5, activeResearch.progress)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Yükleniyor veya Hata Durumu */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
          <span className="text-sm font-semibold">Mars Bilim Veritabanına Bağlanılıyor...</span>
        </div>
      ) : isError ? (
        <div className="p-12 text-center bg-rose-950/20 border border-rose-500/30 rounded-2xl space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <p className="text-sm text-rose-300 font-semibold">Teknoloji ağacı yüklenemedi.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-rose-900/60 hover:bg-rose-900 text-rose-100 rounded-xl text-xs font-bold transition-colors"
          >
            Yeniden Dene
          </button>
        </div>
      ) : (
        /* Teknoloji Kartları Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredTechs?.map((tech) => {
            const isCompleted = tech.status === 4;
            const isInProgress = tech.status === 3;
            const isAvailable = tech.status === 2;
            const isLocked = tech.status === 1;

            return (
              <div
                key={tech.id}
                className={`rounded-2xl p-5 border backdrop-blur-md flex flex-col justify-between gap-4 transition-all duration-300 shadow-lg ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50'
                    : isInProgress
                    ? 'bg-teal-950/30 border-teal-500/50 ring-1 ring-teal-500/30'
                    : isAvailable
                    ? 'bg-slate-900/80 border-slate-800 hover:border-teal-500/40 hover:bg-slate-900'
                    : 'bg-slate-950/60 border-slate-900/80 opacity-75'
                }`}
              >
                {/* Üst Bilgi: Kategori ve Durum Rozeti */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3 h-3" />
                      {tech.categoryName}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isInProgress
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 animate-pulse'
                          : isAvailable
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      {isInProgress && <FlaskConical className="w-3 h-3 text-teal-400" />}
                      {isLocked && <Lock className="w-3 h-3 text-slate-400" />}
                      {tech.statusName}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-100 text-base">{tech.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tech.description}</p>

                  {/* Ön Koşul Uyarısı (Eğer Kilitliyse) */}
                  {isLocked && tech.prerequisiteName && (
                    <div className="mt-3 p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-amber-300/90 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        Ön Koşul: <strong className="text-amber-200">{tech.prerequisiteName}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* İlerleme Çubuğu (Araştırılıyorsa) */}
                {isInProgress && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>İlerleme</span>
                      <span className="font-bold text-teal-300">%{tech.progress.toFixed(0)}</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${tech.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Maliyet & Bonus Bilgi Rozetleri */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/70 text-slate-300 text-[11px] font-semibold border border-slate-700/40">
                      <Pickaxe className="w-3 h-3 text-orange-400" />
                      {tech.mineralCost} t Maden
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/70 text-slate-300 text-[11px] font-semibold border border-slate-700/40">
                      <Coins className="w-3 h-3 text-amber-300" />
                      ₺{tech.creditCost}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/70 text-slate-300 text-[11px] font-semibold border border-slate-700/40">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {tech.durationInSols} Sol
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-[11px] font-bold border border-emerald-500/20">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    {tech.bonusDescription}
                  </span>
                </div>

                {/* Eylem Butonu */}
                <div className="pt-1">
                  {isCompleted ? (
                    <div className="w-full py-2 px-3 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Tamamlandı • Bonuslar Aktif</span>
                    </div>
                  ) : isInProgress ? (
                    <div className="w-full py-2 px-3 rounded-xl text-xs font-bold text-teal-300 bg-teal-950/60 border border-teal-500/40 flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
                      <span>Araştırma Sürüyor (Sonraki Sol bekleniyor)</span>
                    </div>
                  ) : isLocked ? (
                    <button
                      disabled
                      className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-500 bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Kilitli • Önceki Teknoloji Gerekli</span>
                    </button>
                  ) : activeResearch ? (
                    <button
                      disabled
                      title="Aynı anda sadece tek bir araştırma yürütülebilir"
                      className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-500 bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <span>Laboratuvar Meşgul</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartResearch(tech)}
                      disabled={startResearchMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 shadow-md shadow-teal-500/20 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      {startResearchMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Araştırmayı Başlat</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-70 ml-1" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
