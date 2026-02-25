import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Play, RotateCcw, Settings2, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface PrizeDrawProps {
  names: string[];
}

export function PrizeDraw({ names }: PrizeDrawProps) {
  const [drawCount, setDrawCount] = useState(1);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState<string[]>([]);
  const [winners, setWinners] = useState<{ id: number; names: string[]; timestamp: Date }[]>([]);
  const [availableNames, setAvailableNames] = useState<string[]>([...names]);

  // Reset available names when the source list changes
  useEffect(() => {
    setAvailableNames([...names]);
  }, [names]);

  const handleDraw = () => {
    if (names.length === 0) {
      alert('請先輸入名單！ (Please input names first!)');
      return;
    }

    if (!allowRepeat && availableNames.length < drawCount) {
      alert(`剩餘名單不足！目前只剩 ${availableNames.length} 人，但要抽出 ${drawCount} 人。(Not enough names left!)`);
      return;
    }

    setIsDrawing(true);
    setCurrentDisplay(Array(drawCount).fill('???'));

    let intervalId: NodeJS.Timeout;
    let counter = 0;
    const maxTicks = 30; // Number of animation frames
    const speed = 50; // ms per frame

    intervalId = setInterval(() => {
      // Show random names during animation
      const randomDisplay = Array.from({ length: drawCount }, () => {
        const pool = allowRepeat ? names : availableNames;
        return pool[Math.floor(Math.random() * pool.length)];
      });
      setCurrentDisplay(randomDisplay);

      counter++;
      if (counter >= maxTicks) {
        clearInterval(intervalId);
        finishDraw();
      }
    }, speed);
  };

  const finishDraw = () => {
    const newWinners: string[] = [];
    const pool = allowRepeat ? [...names] : [...availableNames];

    for (let i = 0; i < drawCount; i++) {
      if (pool.length === 0) break;
      const randomIndex = Math.floor(Math.random() * pool.length);
      const winner = pool[randomIndex];
      newWinners.push(winner);
      
      if (!allowRepeat) {
        pool.splice(randomIndex, 1);
      }
    }

    setCurrentDisplay(newWinners);
    setWinners((prev) => [
      { id: Date.now(), names: newWinners, timestamp: new Date() },
      ...prev,
    ]);
    
    if (!allowRepeat) {
      setAvailableNames(pool);
    }

    setIsDrawing(false);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#a855f7', '#ec4899']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#a855f7', '#ec4899']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleReset = () => {
    if (confirm('確定要重設抽獎紀錄嗎？ (Are you sure you want to reset the draw history?)')) {
      setWinners([]);
      setAvailableNames([...names]);
      setCurrentDisplay([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings & Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-indigo-500" />
              抽獎設定 (Settings)
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  抽出人數 (Number of Winners)
                </label>
                <input
                  type="number"
                  min="1"
                  max={names.length || 1}
                  value={drawCount}
                  onChange={(e) => setDrawCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <label className="text-sm font-medium text-slate-800 block">
                    允許重複中獎 (Allow Repeat)
                  </label>
                  <span className="text-xs text-slate-500">
                    {allowRepeat ? '中獎者可再次被抽出' : '抽出後從名單移除'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={allowRepeat}
                    onChange={(e) => setAllowRepeat(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-slate-500">總人數 (Total): {names.length}</span>
                  <span className={cn("font-medium", allowRepeat ? "text-slate-500" : "text-indigo-600")}>
                    剩餘 (Remaining): {allowRepeat ? names.length : availableNames.length}
                  </span>
                </div>
                
                <button
                  onClick={handleDraw}
                  disabled={isDrawing || names.length === 0}
                  className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2 text-lg"
                >
                  <Gift className="w-6 h-6" />
                  {isDrawing ? '抽獎中... (Drawing...)' : '開始抽獎 (Draw)'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Display Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Display */}
          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
              <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
              <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-[-20%] left-[20%] w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 w-full">
              {currentDisplay.length === 0 ? (
                <div className="text-center text-slate-500 flex flex-col items-center">
                  <Trophy className="w-20 h-20 mb-4 opacity-20" />
                  <p className="text-xl font-medium">準備抽獎 (Ready to Draw)</p>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-4">
                  <AnimatePresence mode="popLayout">
                    {currentDisplay.map((name, index) => (
                      <motion.div
                        key={`${name}-${index}-${isDrawing}`}
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={cn(
                          "px-8 py-6 rounded-2xl shadow-2xl text-center min-w-[200px] border-2",
                          isDrawing 
                            ? "bg-slate-800 border-slate-700 text-slate-300" 
                            : "bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 text-white"
                        )}
                      >
                        <span className={cn(
                          "block font-bold",
                          isDrawing ? "text-3xl" : "text-4xl"
                        )}>
                          {name}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* History */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                中獎紀錄 (History)
              </h3>
              {winners.length > 0 && (
                <button
                  onClick={handleReset}
                  className="text-sm text-slate-500 hover:text-red-500 font-medium flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  重設紀錄
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {winners.length === 0 ? (
                <p className="text-center text-slate-400 py-8">尚無中獎紀錄 (No history yet)</p>
              ) : (
                winners.map((record, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={record.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                        #{winners.length - index}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {record.names.map((name, i) => (
                          <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium shadow-sm">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono whitespace-nowrap">
                      {record.timestamp.toLocaleTimeString()}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
