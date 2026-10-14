import React, { useState } from 'react';
import { ShieldCheck, Zap, History, CreditCard, BookOpen, User as UserIcon, LogOut, Menu, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: 'analyzer' | 'history' | 'pricing' | 'guide';
  setCurrentTab: (tab: 'analyzer' | 'history' | 'pricing' | 'guide') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, quota, logout, openAuthModal, openUpgradeModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isPremium = user?.plan === 'premium';

  const handleTabClick = (tab: 'analyzer' | 'history' | 'pricing' | 'guide') => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#09090b]/85 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo with Shield and Checkmark */}
          <div 
            onClick={() => handleTabClick('analyzer')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 group-hover:bg-purple-600/30 group-hover:border-purple-400 transition-all glow-purple-sm">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#09090b]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-purple-200 transition-colors">
                  ScamCheck
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded bg-purple-600 text-white shadow-sm">
                  IA
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 tracking-wide hidden sm:block">
                Anti-Arnaque Vinted & Marketplaces
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1.5 rounded-full border border-zinc-800/80">
            <button
              onClick={() => handleTabClick('analyzer')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'analyzer'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Zap className="w-4 h-4" />
              Analyser
            </button>
            <button
              onClick={() => handleTabClick('history')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'history'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <History className="w-4 h-4" />
              Historique
            </button>
            <button
              onClick={() => handleTabClick('pricing')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'pricing'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Tarifs
            </button>
            <button
              onClick={() => handleTabClick('guide')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'guide'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Guide Anti-Arnaque
            </button>
          </nav>

          {/* Right Action Section (Quotas, Plan, Auth) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quota Badge */}
            {isPremium ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-900/60 to-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-semibold glow-purple-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>PREMIUM Illimité</span>
              </div>
            ) : (
              <div 
                onClick={openUpgradeModal}
                className="group flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 cursor-pointer transition-all text-xs"
                title="Quota journalier gratuit"
              >
                <div className="flex items-center gap-1">
                  <span className="text-zinc-400">Analyses :</span>
                  <span className={`font-bold ${quota && quota.remaining > 0 ? 'text-purple-400' : 'text-rose-400'}`}>
                    {quota ? quota.remaining : 3}/3
                  </span>
                </div>
                <span className="text-purple-400 font-semibold text-[11px] group-hover:underline">
                  + Illimité
                </span>
              </div>
            )}

            {/* Auth Button or User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors text-sm text-zinc-200"
                >
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate font-medium">{user.name}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl py-1 z-50">
                    <div className="px-4 py-2 border-b border-zinc-800">
                      <p className="text-xs text-zinc-400">Connecté en tant que</p>
                      <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                      <p className="text-[11px] text-purple-400 mt-0.5 font-medium">
                        Formule {user.plan === 'premium' ? '★ Premium' : 'Gratuite'}
                      </p>
                    </div>

                    {!isPremium && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openUpgradeModal();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-purple-400 hover:bg-purple-600/10 flex items-center gap-2 font-medium"
                      >
                        <Sparkles className="w-4 h-4" />
                        Passer à Premium (4,99 €)
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleTabClick('history');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"
                    >
                      <History className="w-4 h-4" />
                      Mes analyses
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 border-t border-zinc-800"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 rounded-lg text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  Connexion
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors shadow-sm shadow-purple-600/30"
                >
                  S'inscrire
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {!isPremium && (
              <button
                onClick={openUpgradeModal}
                className="px-2.5 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-semibold"
              >
                4,99 €
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#09090b] px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => handleTabClick('analyzer')}
              className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 border ${
                currentTab === 'analyzer'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300'
              }`}
            >
              <Zap className="w-4 h-4 text-purple-400" />
              Analyser
            </button>
            <button
              onClick={() => handleTabClick('history')}
              className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 border ${
                currentTab === 'history'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300'
              }`}
            >
              <History className="w-4 h-4 text-purple-400" />
              Historique
            </button>
            <button
              onClick={() => handleTabClick('pricing')}
              className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 border ${
                currentTab === 'pricing'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300'
              }`}
            >
              <CreditCard className="w-4 h-4 text-purple-400" />
              Tarifs
            </button>
            <button
              onClick={() => handleTabClick('guide')}
              className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 border ${
                currentTab === 'guide'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              Guide
            </button>
          </div>

          {/* User section on mobile */}
          <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <div>
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-zinc-400">{user.email}</p>
                  <span className="text-[11px] text-purple-400 font-semibold">
                    {user.plan === 'premium' ? 'Formule Premium' : 'Formule Gratuite (3/jour)'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs border border-rose-500/20 font-medium"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 border border-zinc-800 text-white text-center"
                >
                  Connexion
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('register');
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-purple-600 text-white text-center font-semibold"
                >
                  S'inscrire
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
