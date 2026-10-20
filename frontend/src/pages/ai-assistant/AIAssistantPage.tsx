import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Database,
  ArrowRight,
  TrendingUp,
  Table as TableIcon,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  DollarSign
} from 'lucide-react';
import apiClient from '../../api/client';
import { useBranch } from '../../context/BranchContext';
import { Button } from '../../components/common/Button';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  intent?: string;
  metrics?: Record<string, any>;
  dataTable?: Array<Record<string, any>>;
  suggestedActions?: string[];
  timestamp: string;
}

export const AIAssistantPage: React.FC = () => {
  const { selectedBranchId, selectedBranch } = useBranch();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your RestaurantIQ Grounded Intelligence Assistant. I am directly connected to your branch sales, inventory, recipes, food waste, and machine learning forecaster. Ask me anything about your restaurant operations.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'What are my best-selling dishes?',
    'What ingredients should I purchase tomorrow?',
    'How is our food waste looking this week?',
    "What is tomorrow's predicted demand for Biryani?",
    'Why did revenue fluctuate recently?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const resp = await apiClient.post('/ai/assistant', {
        question: q,
        branch_id: selectedBranchId,
      });

      const data = resp.data;
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.answer,
        intent: data.intent,
        metrics: data.metrics,
        dataTable: data.data_table,
        suggestedActions: data.suggested_actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (e: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'I encountered an error querying the operational database. Please check connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-0.5 text-xs font-semibold text-brand-400 mb-1">
            <Sparkles size={14} />
            <span>Enterprise Grounded LLM & Analytics Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Business Assistant</h1>
          <p className="text-xs text-slate-400">
            Pulls verified statistics from PostgreSQL & Scikit-learn models &bull; Active Branch: <span className="text-brand-400 font-semibold">{selectedBranch?.name}</span>
          </p>
        </div>
      </div>

      {/* Chat History Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white flex-shrink-0 shadow-md shadow-brand-500/20">
                <Bot size={20} />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-sm shadow-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
              }`}
            >
              {/* Intent Badge if Assistant */}
              {msg.intent && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
                  <Database size={13} className="text-brand-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                    Query Intent: {msg.intent.replace('_', ' ')}
                  </span>
                </div>
              )}

              {/* Main Narrative Text */}
              <p className="whitespace-pre-line text-sm">{msg.text}</p>

              {/* Underlying Data Table */}
              {msg.dataTable && msg.dataTable.length > 0 && (
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
                  <div className="px-3 py-1.5 bg-slate-800/60 border-b border-slate-800 flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                    <TableIcon size={12} className="text-brand-400" />
                    <span>Ground Truth Data Verification</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                        <tr>
                          {Object.keys(msg.dataTable[0]).map((col) => (
                            <th key={col} className="px-3 py-2 font-semibold">{col.replace('_', ' ')}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {msg.dataTable.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40">
                            {Object.values(row).map((val: any, cidx) => (
                              <td key={cidx} className="px-3 py-2 text-slate-200">{String(val)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Suggested Executive Actions */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                    <Lightbulb size={13} />
                    <span>Recommended Executive Actions</span>
                  </div>
                  <ul className="space-y-1">
                    {msg.suggestedActions.map((action, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <ArrowRight size={13} className="text-brand-400 flex-shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <span className="mt-2 block text-[10px] text-slate-500 text-right">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Bot size={20} className="animate-spin" />
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 text-xs text-slate-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-400 animate-ping"></span>
              <span>Querying operational database and executing analytics models...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
        <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
          <HelpCircle size={13} />
          <span>Ask:</span>
        </span>
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-brand-500/40 px-3 py-1.5 rounded-xl transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-3"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask anything about sales, demand, inventory, recipes, or waste..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none shadow-inner"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="h-12 px-5"
          disabled={!inputQuery.trim() || isLoading}
          rightIcon={<Send size={16} />}
        >
          Send
        </Button>
      </form>
    </div>
  );
};
