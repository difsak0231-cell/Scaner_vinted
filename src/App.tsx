/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AnalyzerSection } from './components/Analyzer/AnalyzerSection';
import { HistoryView } from './components/History/HistoryView';
import { PricingSection } from './components/Pricing/PricingSection';
import { ScamGuideSection } from './components/Guide/ScamGuideSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/Auth/AuthModal';
import { UpgradeModal } from './components/Subscription/UpgradeModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'analyzer' | 'history' | 'pricing' | 'guide'>('analyzer');
  const [sampleToLoad, setSampleToLoad] = useState<'iphone' | 'sneakers' | 'safe' | null>(null);

  const handleStartAnalysis = () => {
    setCurrentTab('analyzer');
    const elem = document.getElementById('analyzer');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSample = (sample: 'iphone' | 'sneakers' | 'safe') => {
    setSampleToLoad(sample);
    setCurrentTab('analyzer');
    const elem = document.getElementById('analyzer');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col selection:bg-purple-600 selection:text-white">
        
        {/* Navigation Bar */}
        <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

        {/* Main Content Area */}
        <main className="flex-1">
          {currentTab === 'analyzer' && (
            <>
              <Hero
                onStartAnalysis={handleStartAnalysis}
                onSelectSample={handleSelectSample}
              />
              <AnalyzerSection
                initialSample={sampleToLoad}
                onClearSample={() => setSampleToLoad(null)}
              />
            </>
          )}

          {currentTab === 'history' && (
            <HistoryView onGoToAnalyzer={() => setCurrentTab('analyzer')} />
          )}

          {currentTab === 'pricing' && (
            <PricingSection onGoToAnalyzer={() => setCurrentTab('analyzer')} />
          )}

          {currentTab === 'guide' && (
            <ScamGuideSection onGoToAnalyzer={() => setCurrentTab('analyzer')} />
          )}
        </main>

        {/* Global Footer */}
        <Footer onSelectTab={setCurrentTab} />

        {/* Modals */}
        <AuthModal />
        <UpgradeModal />
      </div>
    </AuthProvider>
  );
}
