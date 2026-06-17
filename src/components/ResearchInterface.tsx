import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, Mic, Plus, Copy, Edit2, FileText, ArrowUp, ArrowDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { AgentWorkflow } from './AgentWorkflow';
import jsPDF from 'jspdf';

const greetings = [
  "Your move, Researcher!",
  "What shall we investigate today?",
  "Let's uncover something new.",
  "Ready for a deep dive?",
  "Initiating intelligence protocol."
];

export function ResearchInterface({ 
  sessionId, 
  historyItem, 
  onSynthesisComplete 
}: { 
  sessionId: string, 
  historyItem?: any, 
  onSynthesisComplete?: (chatId: string | null, query: string, messages: {query: string, report: string}[]) => Promise<string | null> | void 
}) {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [messages, setMessages] = useState<{ query: string, report: string }[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [activeAgents, setActiveAgents] = useState<{ agent: string, message: string }[]>([]);
  const [finalReport, setFinalReport] = useState('');
  const [error, setError] = useState('');
  const [greeting, setGreeting] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [image, setImage] = useState<{data: string, mimeType: string, url: string} | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['web', 'code', 'critic']);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [finalReport, messages]);

  useEffect(() => {
    if (historyItem) {
      setCurrentChatId(historyItem.id || null);
      if (historyItem.messages && historyItem.messages.length > 0) {
        setMessages(historyItem.messages);
      } else {
        setMessages([{ query: historyItem.query || '', report: historyItem.report || '' }]);
      }
      setQuery('');
      setActiveQuery('');
      setFinalReport('');
      setActiveAgents([]);
      setIsSynthesizing(false);
      setError('');
      setImage(null);
    } else {
      setCurrentChatId(null);
      setMessages([]);
      setFinalReport('');
      setActiveQuery('');
      setQuery('');
      setActiveAgents([]);
      setError('');
      setImage(null);
      setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
    }
  }, [historyItem]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const [meta, data] = base64String.split(',');
        const mimeType = meta.split(':')[1].split(';')[0];
        setImage({ data, mimeType, url: base64String });
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(prev => prev ? prev + ' ' + transcript : transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          alert('Microphone access was denied. Please allow microphone permissions in your browser to use voice search.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const exportToPDF = () => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });
      
      const margin = 40;
      let y = margin;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const maxLineWidth = pageWidth - margin * 2;
      
      let fullContent = '';
      messages.forEach(m => {
         fullContent += `# Query: ${m.query}\n\n${m.report}\n\n`;
      });
      if (finalReport) {
         fullContent += `# Query: ${activeQuery}\n\n${finalReport}\n\n`;
      }

      const lines = fullContent.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (!line.trim()) {
           y += 10;
           continue;
        }

        let cleanLine = line.replace(/\*\*/g, '');
        let fontSize = 12;
        let fontStyle = "normal";
        
        if (cleanLine.startsWith('# ')) {
           fontSize = 22;
           fontStyle = "bold";
           cleanLine = cleanLine.substring(2).trim();
           y += 10;
        } else if (cleanLine.startsWith('## ')) {
           fontSize = 18;
           fontStyle = "bold";
           cleanLine = cleanLine.substring(3).trim();
           y += 10;
        } else if (cleanLine.startsWith('### ')) {
           fontSize = 14;
           fontStyle = "bold";
           cleanLine = cleanLine.substring(4).trim();
           y += 5;
        } else if (cleanLine.startsWith('- ')) {
           cleanLine = "• " + cleanLine.substring(2).trim();
        } else if (cleanLine.startsWith('> ')) {
           fontStyle = "italic";
           cleanLine = cleanLine.substring(2).trim();
        }
        
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", fontStyle);
        
        const splitText = pdf.splitTextToSize(cleanLine, maxLineWidth);
        
        for (const textLine of splitText) {
          if (y > pageHeight - margin) {
            pdf.addPage();
            y = margin;
            pdf.setFontSize(fontSize);
            pdf.setFont("helvetica", fontStyle);
          }
          pdf.text(textLine, margin, y);
          y += fontSize * 1.5;
        }
      }
      
      pdf.save('Research_Report.pdf');
    } catch (err) {
      console.error("Failed to export PDF", err);
      alert("Failed to export as PDF.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAgents.length === 0) {
      setError('Please select at least one agent to proceed.');
      return;
    }
    
    let updatedMessages = [...messages];
    if (activeQuery) {
        updatedMessages.push({ query: activeQuery, report: finalReport });
        setMessages(updatedMessages);
    }

    const currentQuery = query.trim() || (image ? "Image Analysis" : "");
    if (!currentQuery && !image) return;

    setActiveQuery(currentQuery);
    setQuery('');
    setActiveAgents([]);
    setFinalReport('');
    setError('');
    setIsSynthesizing(true);
    
    const imagePayload = image ? { data: image.data, mimeType: image.mimeType } : undefined;
    setImage(null);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentQuery, sessionId, image: imagePayload, selectedAgents }),
      });

      if (!response.body) throw new Error('No readable stream');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let fullReport = '';
      let chunk = await reader.read();
      while (!chunk.done) {
        const decoded = decoder.decode(chunk.value, { stream: true });
        
        // Parse SSE manually
        const lines = decoded.split('\n');
        let currentEvent = '';
        
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.replace('event: ', '').trim();
          } else if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '');
            if (dataStr) {
               try {
                 const data = JSON.parse(dataStr);
                 if (currentEvent === 'status') {
                    setActiveAgents((prev) => {
                       const filtered = prev.filter(p => p.agent !== data.agent);
                       return [...filtered, data];
                    });
                 } else if (currentEvent === 'report') {
                    setFinalReport(prev => prev + data.text);
                    fullReport += data.text;
                 } else if (currentEvent === 'done') {
                    setIsSynthesizing(false);
                    if (onSynthesisComplete) {
                       const nextMessages = [...updatedMessages, { query: currentQuery, report: fullReport }];
                       const titleQuery = nextMessages[0]?.query || currentQuery;
                       const result = onSynthesisComplete(currentChatId, titleQuery, nextMessages);
                       if (result instanceof Promise) {
                          result.then((newId) => {
                             if (newId) setCurrentChatId(newId);
                          });
                       }
                    }
                 } else if (currentEvent === 'error') {
                    setError(data.message);
                    setIsSynthesizing(false);
                 }
               } catch (e) {
                 console.error('JSON parse error on streaming data', e);
               }
            }
          }
        }

        chunk = await reader.read();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during synthesis.');
      setIsSynthesizing(false);
    }
  };

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-transparent transition-colors duration-300">
      {/* Main Content Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 lg:px-12 py-12 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto space-y-12 pb-32">
          
          {/* Empty State */}
          {!isSynthesizing && !finalReport && !error && greeting && !activeQuery && messages.length === 0 && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.1 }}
               className="h-full flex flex-col items-center justify-center text-center pt-32 shrink-0"
             >
               <h1 className="text-4xl lg:text-5xl font-sans font-medium text-slate-800 dark:text-zinc-100 mb-6 leading-tight tracking-tight">
                 <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{greeting}</span>
               </h1>
             </motion.div>
          )}

          {/* Render Historical Messages */}
          {messages.map((msg, idx) => (
            <div key={idx} className="space-y-8">
              <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex justify-end w-full"
              >
                <div className="flex flex-col items-start bg-indigo-50 dark:bg-[#1a1a1a] p-5 rounded-2xl rounded-tr-sm border border-indigo-100 dark:border-[#333] max-w-[85%] md:max-w-[75%] shadow-sm">
                   <h2 className="text-lg font-medium text-slate-800 dark:text-zinc-100 whitespace-pre-wrap">{msg.query}</h2>
                </div>
              </motion.div>
              
              <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="relative flex flex-col items-start w-full"
              >
                <div className="bg-white dark:bg-[#0a0a0a] p-8 md:p-10 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-[#222] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none w-[90%] md:w-[85%] self-start">
                  <div className="prose prose-slate dark:prose-invert prose-emerald max-w-none">
                     <ReactMarkdown
                       components={{
                         h1: ({node, ...props}) => <h1 className="text-[32px] md:text-[42px] font-serif font-light leading-tight text-slate-900 dark:text-white mb-4 bg-gradient-to-r from-indigo-50 to-transparent dark:from-[#111] p-4 rounded-xl border border-indigo-100 dark:border-[#333]" {...props} />,
                         h2: ({node, ...props}) => <h2 className="text-2xl font-serif font-light mt-8 mb-4 text-slate-800 dark:text-zinc-200 border-b border-slate-200 dark:border-[#222] pb-4" {...props} />,
                         h3: ({node, ...props}) => <h3 className="font-sans font-medium text-lg mt-6 mb-3 text-slate-700 dark:text-zinc-300 inline-block bg-slate-100 dark:bg-[#111] px-3 py-1 rounded-md text-sm" {...props} />,
                         p: ({node, ...props}) => <p className="leading-relaxed text-slate-700 dark:text-zinc-300 mb-4" {...props} />,
                         ul: ({node, ...props}) => <ul className="list-disc list-outside pl-5 space-y-2 mb-4 text-slate-600 dark:text-zinc-400 ml-4 font-sans text-sm" {...props} />,
                         li: ({node, ...props}) => <li className="pl-1" {...props} />,
                         strong: ({node, ...props}) => <strong className="font-semibold text-slate-900 dark:text-zinc-100" {...props} />,
                         blockquote: ({node, ...props}) => {
                           const text = String(props.children);
                           if (text.includes("Trust Score")) {
                              return <blockquote className="my-8 text-center border border-indigo-200 dark:border-[#333] p-6 rounded-xl bg-white dark:bg-[#111] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none" {...props} />
                           }
                           return <blockquote className="border-l-2 border-indigo-500 dark:border-indigo-900 bg-indigo-50/50 dark:bg-[#0a0a0a] pl-6 py-3 pr-4 italic text-lg text-slate-600 dark:text-zinc-300 font-serif leading-relaxed my-6 rounded-r-lg" {...props} />
                         }
                       }}
                     >
                       {msg.report}
                     </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}

          {/* Active Query Display */}
          {(activeQuery) && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="mb-8 flex justify-end w-full"
            >
              <div className="flex flex-col items-start bg-indigo-50 dark:bg-[#1a1a1a] p-5 rounded-2xl rounded-tr-sm border border-indigo-100 dark:border-[#333] max-w-[85%] md:max-w-[75%] shadow-sm">
                 <h2 className="text-lg font-medium text-slate-800 dark:text-zinc-100 whitespace-pre-wrap">{activeQuery}</h2>
                 <div className="flex items-center gap-2 mt-3 w-full justify-end border-t border-indigo-100 dark:border-[#2a2a2a] pt-2">
                    <button 
                       onClick={() => {
                          setQuery(activeQuery);
                          inputRef.current?.focus();
                       }}
                       title="Edit Query"
                       className="p-1.5 text-slate-400 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 transition-colors rounded-md"
                    >
                       <Edit2 size={14} />
                    </button>
                    <button 
                       onClick={() => {
                          navigator.clipboard.writeText(activeQuery);
                       }}
                       title="Copy Query"
                       className="p-1.5 text-slate-400 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 transition-colors rounded-md"
                    >
                       <Copy size={14} />
                    </button>
                 </div>
              </div>
            </motion.div>
          )}

          {/* Workflow Visualization */}
          {isSynthesizing && !finalReport && (
            <AgentWorkflow 
              agents={activeAgents} 
              selectedAgents={selectedAgents} 
              activeQuery={activeQuery} 
            />
          )}

          {/* Final Output */}
          {finalReport && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="relative flex flex-col items-start w-full"
            >
              <div className="bg-white dark:bg-[#0a0a0a] p-8 md:p-10 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-[#222] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none w-[90%] md:w-[85%] self-start" ref={reportRef}>
                <div className="prose prose-slate dark:prose-invert prose-emerald max-w-none">
                   <ReactMarkdown
                     components={{
                       h1: ({node, ...props}) => <h1 className="text-[32px] md:text-[42px] font-serif font-light leading-tight text-slate-900 dark:text-white mb-4 bg-gradient-to-r from-indigo-50 to-transparent dark:from-[#111] p-4 rounded-xl border border-indigo-100 dark:border-[#333]" {...props} />,
                       h2: ({node, ...props}) => <h2 className="text-2xl font-serif font-light mt-8 mb-4 text-slate-800 dark:text-zinc-200 border-b border-slate-200 dark:border-[#222] pb-4" {...props} />,
                       h3: ({node, ...props}) => <h3 className="font-sans font-medium text-lg mt-6 mb-3 text-slate-700 dark:text-zinc-300 inline-block bg-slate-100 dark:bg-[#111] px-3 py-1 rounded-md text-sm" {...props} />,
                       p: ({node, ...props}) => <p className="leading-relaxed text-slate-700 dark:text-zinc-300 mb-4" {...props} />,
                       ul: ({node, ...props}) => <ul className="list-disc list-outside pl-5 space-y-2 mb-4 text-slate-600 dark:text-zinc-400 ml-4 font-sans text-sm" {...props} />,
                       li: ({node, ...props}) => <li className="pl-1" {...props} />,
                       strong: ({node, ...props}) => <strong className="font-semibold text-slate-900 dark:text-zinc-100" {...props} />,
                       blockquote: ({node, ...props}) => {
                         // Check if it's the trust score blockquote
                         const text = String(props.children);
                         if (text.includes("Trust Score")) {
                            return (
                              <blockquote className="my-8 text-center border border-indigo-200 dark:border-[#333] p-6 rounded-xl bg-white dark:bg-[#111] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none" {...props} />
                            )
                         }
                         return <blockquote className="border-l-2 border-indigo-500 dark:border-indigo-900 bg-indigo-50/50 dark:bg-[#0a0a0a] pl-6 py-3 pr-4 italic text-lg text-slate-600 dark:text-zinc-300 font-serif leading-relaxed my-6 rounded-r-lg" {...props} />
                       }
                     }}
                   >
                     {finalReport}
                   </ReactMarkdown>
                </div>
              </div>
              
              {/* Action Buttons Below Report */}
              <div className="flex justify-start items-center gap-2 mt-4 self-start">
                <button 
                  onClick={exportToPDF}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#111] hover:bg-slate-100 dark:hover:bg-[#1a1a1a] text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-[#333] rounded-lg text-sm font-medium transition-colors shadow-sm"
                  title="Download as PDF"
                >
                  <FileText size={16} className="text-indigo-500" />
                  Download PDF
                </button>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="fixed top-8 left-1/2 -translate-x-1/2 z-50 p-4 bg-slate-900/90 dark:bg-[#111]/90 backdrop-blur-md border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)] text-red-100 rounded-xl max-w-lg w-[90%] flex items-start gap-3"
              >
                <div className="flex-1">
                  <span className="font-semibold text-red-400 block mb-1">System Notice</span> 
                  <span className="text-sm leading-relaxed">{error}</span>
                </div>
                <button 
                  onClick={() => setError('')}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Scroll Controls */}
      {(messages.length > 0 || finalReport) && (
          <div className="absolute bottom-[200px] right-4 md:right-12 flex flex-col gap-3 z-30 opacity-70 hover:opacity-100 transition-opacity">
            <button
              onClick={scrollToTop}
              type="button"
              className="p-2.5 bg-white dark:bg-[#111] text-slate-600 dark:text-zinc-400 rounded-full border border-slate-200 dark:border-[#333] shadow-md hover:bg-slate-50 dark:hover:bg-[#222] transition-colors"
              title="Scroll to Top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <button
              onClick={scrollToBottom}
              type="button"
              className="p-2.5 bg-white dark:bg-[#111] text-slate-600 dark:text-zinc-400 rounded-full border border-slate-200 dark:border-[#333] shadow-md hover:bg-slate-50 dark:hover:bg-[#222] transition-colors"
              title="Scroll to Bottom"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>
      )}

      {/* Input Area - Floating Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl z-10 transition-all">
        <form onSubmit={handleSubmit} className="bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-2xl flex flex-col p-1.5 pl-3 transition-colors duration-300">
          
          {/* Agent Selection Toggles */}
          <div className="flex flex-wrap justify-center gap-4 py-2 border-b border-slate-200 dark:border-[#333]">
            <label className={`flex items-center gap-2 text-sm cursor-pointer transition-colors ${selectedAgents.includes('web') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-zinc-400 font-medium'}`}>
              <input 
                type="checkbox" 
                checked={selectedAgents.includes('web')} 
                onChange={(e) => {
                  if (e.target.checked) setSelectedAgents(prev => [...prev, 'web']);
                  else setSelectedAgents(prev => prev.filter(a => a !== 'web'));
                }}
                className="appearance-none w-4 h-4 border-[1.5px] border-slate-300 dark:border-zinc-600 rounded-full checked:bg-blue-500 checked:border-transparent relative after:content-[''] after:absolute after:inset-0 after:m-auto after:w-1.5 after:h-1.5 after:bg-white after:rounded-full after:scale-0 checked:after:scale-100 transition-all cursor-pointer"
              />
              Web Search Agent
            </label>
            <label className={`flex items-center gap-2 text-sm cursor-pointer transition-colors ${selectedAgents.includes('code') ? 'text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-zinc-400 font-medium'}`}>
              <input 
                type="checkbox" 
                checked={selectedAgents.includes('code')} 
                onChange={(e) => {
                  if (e.target.checked) setSelectedAgents(prev => [...prev, 'code']);
                  else setSelectedAgents(prev => prev.filter(a => a !== 'code'));
                }}
                className="appearance-none w-4 h-4 border-[1.5px] border-slate-300 dark:border-zinc-600 rounded-full checked:bg-purple-500 checked:border-transparent relative after:content-[''] after:absolute after:inset-0 after:m-auto after:w-1.5 after:h-1.5 after:bg-white after:rounded-full after:scale-0 checked:after:scale-100 transition-all cursor-pointer"
              />
              Data Analyst Agent
            </label>
            <label className={`flex items-center gap-2 text-sm cursor-pointer transition-colors ${selectedAgents.includes('critic') ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-zinc-400 font-medium'}`}>
              <input 
                type="checkbox" 
                checked={selectedAgents.includes('critic')} 
                onChange={(e) => {
                  if (e.target.checked) setSelectedAgents(prev => [...prev, 'critic']);
                  else setSelectedAgents(prev => prev.filter(a => a !== 'critic'));
                }}
                className="appearance-none w-4 h-4 border-[1.5px] border-slate-300 dark:border-zinc-600 rounded-full checked:bg-emerald-500 checked:border-transparent relative after:content-[''] after:absolute after:inset-0 after:m-auto after:w-1.5 after:h-1.5 after:bg-white after:rounded-full after:scale-0 checked:after:scale-100 transition-all cursor-pointer"
              />
              Critic Agent
            </label>
          </div>

          {image && (
            <div className="flex items-center gap-2 mb-2 ml-2 mt-2">
              <div className="relative group/img">
                <img src={image.url} alt="Attached" className="w-16 h-16 object-cover rounded-xl border border-slate-200 dark:border-[#333]" />
                <button 
                  type="button" 
                  onClick={() => setImage(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover/img:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center group w-full">
            {/* Add Image Button */}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-[#2A2A2A] text-slate-500 dark:text-zinc-400 transition-colors shrink-0"
            >
              <Plus size={20} />
            </button>
            
            <input
              type="text"
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isSynthesizing}
              placeholder="Assign a deep investigation topic..."
              className="flex-1 bg-transparent border-none outline-none px-3 py-3.5 text-[15px] text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 disabled:opacity-50"
            />
            
            <div className="flex items-center gap-1 pr-1 shrink-0">
              {/* Voice Input Button */}
              <button 
                type="button" 
                onClick={startListening}
                className={`p-2.5 rounded-full transition-colors mr-1 ${isListening ? 'bg-red-100 text-red-500 dark:bg-red-500/20 dark:text-red-400 animate-pulse' : 'hover:bg-slate-200 dark:hover:bg-[#2A2A2A] text-slate-500 dark:text-zinc-400'}`}
              >
                <Mic size={20} />
              </button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={(!query.trim() && !image) || isSynthesizing}
                className="relative overflow-hidden w-10 h-10 flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/btn"
              >
                {isSynthesizing ? (
                   <>
                     <span className="absolute inset-0 bg-white/20 dark:bg-black/20 blur-md rounded-full animate-pulse"></span>
                     <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                   </>
                ) : (
                   <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px] relative z-10" />
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
