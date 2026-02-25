import React, { useState } from 'react';
import { Users, Gift, Shuffle } from 'lucide-react';
import { NameInput } from './components/NameInput';
import { PrizeDraw } from './components/PrizeDraw';
import { RandomGrouping } from './components/RandomGrouping';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'input' | 'draw' | 'grouping';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('input');
  const [names, setNames] = useState<string[]>([]);

  const tabs = [
    { id: 'input', label: '輸入名單 (Input)', icon: Users },
    { id: 'draw', label: '獎品抽籤 (Prize Draw)', icon: Gift },
    { id: 'grouping', label: '自動分組 (Grouping)', icon: Shuffle },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">HR Randomizer</h1>
                <p className="text-xs text-slate-500 font-medium">抽獎與分組小工具</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                      isActive ? "text-indigo-700" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white rounded-lg shadow-sm"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'input' && <NameInput names={names} setNames={setNames} />}
            {activeTab === 'draw' && <PrizeDraw names={names} />}
            {activeTab === 'grouping' && <RandomGrouping names={names} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
