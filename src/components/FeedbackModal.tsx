import React, { useState, useRef } from 'react';
import { X, UploadCloud, Loader2 } from 'lucide-react';

interface FeedbackModalProps {
  onClose: () => void;
}

export function FeedbackModal({ onClose }: FeedbackModalProps) {
  const [feedbackText, setFeedbackText] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setScreenshot(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setScreenshot(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSend = async () => {
    if (!feedbackText.trim()) return;

    try {
      setIsSending(true);
      setStatus({ type: null, message: '' });

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: feedbackText,
          screenshot
        })
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to send feedback');
      }

      setStatus({ type: 'success', message: 'Feedback sent successfully!' });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('Feedback error:', error);
      setStatus({ type: 'error', message: error.message || 'Failed to send feedback. Please check server logs.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div id="feedback-modal-overlay" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#202124] text-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden flex flex-col font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3c4043]">
          <h2 className="text-lg font-medium text-white">Send feedback to Developer</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Describe your feedback (required)
            </label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell us what prompted this feedback..."
              className="w-full h-32 bg-[#202124] border border-[#5f6368] rounded p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
            />
            <div className="flex items-center text-xs text-gray-400 relative">
              <span>Please don't include any sensitive information</span>
              <div className="group relative ml-1 flex items-center">
                <span className="inline-flex w-4 h-4 rounded-full border border-gray-400 items-center justify-center cursor-help opacity-70 text-[10px]">?</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-[280px] p-2.5 bg-white text-slate-800 text-[12px] leading-relaxed rounded shadow-xl z-50 pointer-events-none">
                  Sensitive information is any data that should be feedback protected. For example, don't include passwords,credit card numbers, and personal details.
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              A screenshot will help us better understand your feedback.
            </label>
            
            {screenshot ? (
              <div className="relative border border-[#5f6368] rounded overflow-hidden">
                <img src={screenshot} alt="Captured screen" className="w-full h-auto max-h-48 object-cover" />
                <button 
                  onClick={() => setScreenshot(null)}
                  className="absolute top-2 right-2 bg-black/70 p-1.5 rounded text-white hover:bg-black"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="w-full h-32 border-2 border-dashed border-[#5f6368] hover:border-blue-400 bg-[#202124] hover:bg-[#303134] rounded flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <UploadCloud size={24} className="text-[#8ab4f8]" />
                <span className="text-sm text-gray-300">Click to browse or drag and drop</span>
                <span className="text-xs text-gray-500">Supported formats: JPG, PNG</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          <div className="space-y-4 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-600 outline-none text-blue-500 focus:ring-0 bg-transparent flex-shrink-0" />
              <span className="text-sm text-gray-300">
                We may email you for more information or updates
              </span>
            </label>

            <p className="text-[11px] text-gray-400 leading-tight">
              Some <a href="#" className="text-[#8ab4f8] hover:underline">account and system information</a> may be sent to Developer. We will use it to fix problems and improve our services, subject to our <a href="#" className="text-[#8ab4f8] hover:underline">Privacy Policy</a> and <a href="#" className="text-[#8ab4f8] hover:underline">Terms of Service</a>. We may email you for more information or updates. Go to <a href="#" className="text-[#8ab4f8] hover:underline">Legal Help</a> to ask for content changes for legal reasons.
            </p>
          </div>
          
          {status.message && (
             <div className={`p-3 rounded text-sm ${status.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {status.message}
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#3c4043] flex justify-end bg-[#202124]">
          <button
            onClick={handleSend}
            disabled={!feedbackText.trim() || isSending}
            className="px-6 py-2 bg-[#303134] hover:bg-[#3c4043] text-gray-200 text-sm font-medium rounded transition-colors disabled:opacity-50 flex items-center gap-2 focus:bg-[#3c4043]"
          >
            {isSending ? <Loader2 size={16} className="animate-spin" /> : null}
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
