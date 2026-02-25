import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, Users, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface NameInputProps {
  names: string[];
  setNames: (names: string[]) => void;
}

export function NameInput({ names, setNames }: NameInputProps) {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleAddNames = () => {
    const newNames = inputText
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    
    if (newNames.length > 0) {
      setNames([...names, ...newNames]);
      setInputText('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const parsedNames: string[] = [];
        results.data.forEach((row: any) => {
          // Assuming the first column or any column contains names
          if (Array.isArray(row)) {
            row.forEach(cell => {
              if (typeof cell === 'string' && cell.trim()) {
                parsedNames.push(cell.trim());
              }
            });
          } else if (typeof row === 'object' && row !== null) {
             Object.values(row).forEach(val => {
                if (typeof val === 'string' && val.trim()) {
                  parsedNames.push(val.trim());
                }
             })
          }
        });
        
        if (parsedNames.length > 0) {
          setNames([...names, ...parsedNames]);
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  const handleClearAll = () => {
    if (confirm('確定要清除所有名單嗎？ (Are you sure you want to clear all names?)')) {
      setNames([]);
    }
  };

  const handleRemoveName = (index: number) => {
    const newNames = [...names];
    newNames.splice(index, 1);
    setNames(newNames);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            輸入名單 (Input Names)
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                手動輸入 (每行一個名字) / Manual Input (One name per line)
              </label>
              <textarea
                className="w-full h-32 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                placeholder="王小明\n陳大頭\n林美麗..."
                value={inputText}
                onChange={handleTextChange}
              />
              <button
                onClick={handleAddNames}
                disabled={!inputText.trim()}
                className="mt-2 w-full py-2 px-4 bg-indigo-50 text-indigo-600 font-medium rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                加入名單 (Add to List)
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-sm text-slate-400">或 (OR)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                上傳 CSV 檔案 / Upload CSV File
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-slate-400" />
                    <p className="mb-2 text-sm text-slate-500">
                      <span className="font-semibold">點擊上傳</span> 或拖曳檔案
                    </p>
                    <p className="text-xs text-slate-400">CSV 格式</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              目前名單 (Current List)
              <span className="bg-indigo-100 text-indigo-700 text-sm py-0.5 px-2.5 rounded-full">
                {names.length} 人
              </span>
            </h2>
            {names.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                全部清除
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {names.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Users className="w-12 h-12 mb-2 opacity-20" />
                <p>目前沒有名單，請從左側新增</p>
                <p className="text-sm">(No names yet, please add from the left)</p>
              </div>
            ) : (
              names.map((name, index) => (
                <div
                  key={`${name}-${index}`}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-indigo-200 transition-colors"
                >
                  <span className="text-slate-700 font-medium">{name}</span>
                  <button
                    onClick={() => handleRemoveName(index)}
                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    title="移除 (Remove)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
