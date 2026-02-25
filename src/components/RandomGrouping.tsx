import React, { useState } from 'react';
import { Users, Shuffle, Grid, LayoutGrid, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface RandomGroupingProps {
  names: string[];
}

type GroupMode = 'groupCount' | 'peoplePerGroup';

export function RandomGrouping({ names }: RandomGroupingProps) {
  const [mode, setMode] = useState<GroupMode>('groupCount');
  const [inputValue, setInputValue] = useState(2);
  const [groups, setGroups] = useState<string[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (names.length === 0) {
      alert('請先輸入名單！ (Please input names first!)');
      return;
    }

    if (inputValue < 1) {
      alert('請輸入大於 0 的數字！ (Please enter a number greater than 0!)');
      return;
    }

    setIsGenerating(true);

    // Simulate a slight delay for animation effect
    setTimeout(() => {
      const shuffledNames = [...names].sort(() => Math.random() - 0.5);
      const newGroups: string[][] = [];

      if (mode === 'groupCount') {
        const numGroups = Math.min(inputValue, names.length);
        for (let i = 0; i < numGroups; i++) {
          newGroups.push([]);
        }
        shuffledNames.forEach((name, index) => {
          newGroups[index % numGroups].push(name);
        });
      } else {
        const size = Math.min(inputValue, names.length);
        for (let i = 0; i < shuffledNames.length; i += size) {
          newGroups.push(shuffledNames.slice(i, i + size));
        }
      }

      setGroups(newGroups);
      setIsGenerating(false);
    }, 600);
  };

  const exportToCSV = () => {
    if (groups.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += '組別 (Group),成員 (Members)\n';

    groups.forEach((group, index) => {
      const groupName = `第 ${index + 1} 組 (Group ${index + 1})`;
      const members = group.join('、');
      csvContent += `"${groupName}","${members}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `分組結果_Grouping_Result_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <Shuffle className="w-5 h-5 text-indigo-500" />
          分組設定 (Grouping Settings)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              分組方式 (Grouping Method)
            </label>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setMode('groupCount')}
                className={cn(
                  "flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
                  mode === 'groupCount' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Grid className="w-4 h-4" />
                指定組數
              </button>
              <button
                onClick={() => setMode('peoplePerGroup')}
                className={cn(
                  "flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
                  mode === 'peoplePerGroup' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Users className="w-4 h-4" />
                每組人數
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              {mode === 'groupCount' ? '要分成幾組？ (Number of Groups)' : '每組幾人？ (People per Group)'}
            </label>
            <input
              type="number"
              min="1"
              max={names.length || 1}
              value={inputValue}
              onChange={(e) => setInputValue(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || names.length === 0}
              className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2"
            >
              <Shuffle className={cn("w-5 h-5", isGenerating && "animate-spin")} />
              {isGenerating ? '分組中... (Generating...)' : '開始分組 (Generate)'}
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-slate-500 flex items-center gap-2">
          <Users className="w-4 h-4" />
          目前總人數 (Total people): <span className="font-semibold text-slate-700">{names.length}</span>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-indigo-500" />
              分組結果 (Results)
              <span className="bg-indigo-100 text-indigo-700 text-sm py-0.5 px-2.5 rounded-full ml-2">
                共 {groups.length} 組
              </span>
            </h3>
            
            <button
              onClick={exportToCSV}
              className="py-2 px-4 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-2 text-sm shadow-sm"
            >
              <Download className="w-4 h-4" />
              匯出 CSV (Export)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {groups.map((group, index) => (
                <motion.div
                  key={`group-${index}`}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
                >
                  <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center justify-between">
                    <h4 className="font-bold text-indigo-900">第 {index + 1} 組</h4>
                    <span className="text-xs font-medium text-indigo-600 bg-white px-2 py-1 rounded-full shadow-sm">
                      {group.length} 人
                    </span>
                  </div>
                  <div className="p-4 flex-1">
                    <ul className="space-y-2">
                      {group.map((member, mIndex) => (
                        <li key={`${member}-${mIndex}`} className="flex items-center gap-2 text-slate-700">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500 shrink-0">
                            {mIndex + 1}
                          </div>
                          <span className="font-medium break-words">{member}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
