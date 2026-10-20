import React, { useState, useEffect } from 'react';
import { Bot, Send, Sparkles, User, CornerDownLeft, HelpCircle } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export const AIAssistantSection: React.FC = () => {
  const initialMessages: ChatMessage[] = [
    { sender: 'user', text: 'Why did food waste increase this weekend?' },
    {
      sender: 'ai',
      text: 'Food waste increased by 12.4%, mainly due to higher weekend preparation waste in Wagyu trimmings and excess prep on fresh pasta dough. Recommended action: tighten prep station batching from 25 to 15 portions.',
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [typedText, setTypedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const presetResponses: Record<string, string> = {
    'Why are sales down?':
      'Sales are down 6.8% primarily on Tuesday lunch shift due to rainy weather (-18% covers). Dinner revenue remained robust (+4.2%), led by wine pairing upsells.',
    'What should I reorder?':
      'Recommended reorder: 15kg Truffle Butter and 20kg Fior Di Latte Mozzarella. Both will breach safety threshold in 48 hours based on projected Friday demand.',
    'Which dish is trending?':
      'Hamachi Crudo velocity jumped by +34% over the last 14 days with 99% 5-star sentiment. It is currently your highest margin appetizer at 74.2% gross profit.',
    'Why did food waste increase?':
      'Food waste increased by 12.4%, mainly due to higher weekend preparation waste in Wagyu trimmings and excess prep on fresh pasta dough.',
  };

  const handleChipClick = (question: string) => {
    if (isTyping) return;

    setMessages((prev) => [...prev, { sender: 'user', text: question }]);
    setIsTyping(true);
    setTypedText('');

    const targetAnswer = presetResponses[question] || 'Analyzing operational database and ML feature weights for your inquiry...';
    let charIndex = 0;

    const interval = setInterval(() => {
      charIndex++;
      setTypedText(targetAnswer.slice(0, charIndex));

      if (charIndex >= targetAnswer.length) {
        clearInterval(interval);
        setMessages((prev) => [...prev, { sender: 'ai', text: targetAnswer }]);
        setTypedText('');
        setIsTyping(false);
      }
    }, 18);
  };

  return (
    <section className="py-24 relative bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300">
            <Sparkles size={14} />
            <span>GROUNDED LLM & ANALYTICS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            ASK YOUR RESTAURANT <br />
            <span className="emerald-gradient-text">ANYTHING.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
            Zero hallucinations. KRESTA translates your natural language questions into verified SQL telemetry and ML feature queries.
          </p>
        </div>

        {/* Chat Simulator Box */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/30 p-1 flex items-center justify-center">
                <img src="/kresta-logo-mark.png" alt="KRESTA" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-white">KRESTA Intelligence Assistant</p>
                <p className="text-[10px] text-emerald-400 font-mono">Grounded to Active PostgreSQL Schema</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-500">FastAPI &bull; LLM Router</span>
          </div>

          {/* Messages Feed */}
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'ai' && (
                  <div className="h-8 w-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 flex-shrink-0">
                    <Bot size={16} />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-lg ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 font-semibold rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Typewriter active text */}
            {isTyping && (
              <div className="flex items-start gap-3 justify-start">
                <div className="h-8 w-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 flex-shrink-0">
                  <Bot size={16} className="animate-spin" />
                </div>
                <div className="p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-lg bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none">
                  <span>{typedText}</span>
                  <span className="inline-block w-1.5 h-3.5 bg-amber-400 ml-1 animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {/* Interactive Question Chips */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <HelpCircle size={13} className="text-amber-400" />
              <span>Click a question chip to test live response:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'Why did food waste increase?',
                'Why are sales down?',
                'What should I reorder?',
                'Which dish is trending?',
              ].map((chip) => (
                <button
                  key={chip}
                  disabled={isTyping}
                  onClick={() => handleChipClick(chip)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 text-xs text-slate-300 hover:text-white transition-all duration-200 disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
