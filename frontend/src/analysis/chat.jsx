import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Bot, Send, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

const SUGGESTED = [
  'What are the main points?',
  'Summarize this video',
  'Explain the key concepts simply',
  'What examples are mentioned?',
];

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white/[0.05] border border-edge px-4 py-3.5 rounded-2xl rounded-bl-md flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="typing-dot w-1.5 h-1.5 rounded-full bg-bolt-soft" />
        ))}
      </div>
    </div>
  );
}

function Message({ message }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
        <div className="max-w-[82%] px-4 py-3 rounded-2xl rounded-br-md bg-gradient-to-br from-bolt to-iris text-white">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2.5">
      <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1 ${message.isError ? 'bg-red-500/15 border border-red-500/30' : 'bg-gradient-to-br from-bolt to-iris'}`}>
        <Bot size={13} className={message.isError ? 'text-red-300' : 'text-white'} />
      </span>
      <div className={`max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-md ${
        message.isError
          ? 'bg-red-500/[0.07] border border-red-500/25 text-red-200'
          : 'bg-white/[0.05] border border-edge text-ice'
      }`}>
        {message.isError ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="md-content text-sm leading-relaxed">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ChatSection() {
  const { chatMessages, sendMessage, isSendingMessage, sessionId } = useApp();
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isSendingMessage]);

  const handleSend = async (e) => {
    e.preventDefault();
    const msg = chatInput.trim();
    if (!msg || isSendingMessage) return;
    setChatInput('');
    await sendMessage(msg);
  };

  const empty = chatMessages.length === 0;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
        {empty ? (
          <div className="max-w-xl mx-auto flex flex-col items-center justify-center h-full text-center">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bolt to-iris flex items-center justify-center mx-auto mb-5 shadow-lg shadow-bolt/25">
                <Bot size={26} className="text-white" />
              </div>
              <h3 className="font-display text-lg font-semibold text-ice mb-2">Ask anything about this video</h3>
              <p className="text-sm text-dim mb-8 max-w-sm leading-relaxed">
                Every answer is grounded strictly in the transcript — with the context to back it up.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    disabled={!sessionId}
                    className="px-4 py-2.5 text-left text-xs text-fog rounded-xl border border-edge bg-white/[0.02] hover:border-bolt/40 hover:bg-white/[0.04] hover:text-ice transition-all disabled:opacity-40"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {chatMessages.map((msg) => <Message key={msg.id} message={msg} />)}
            {isSendingMessage && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-edge bg-panel/80 backdrop-blur p-4">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto flex gap-2.5">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask about this video…"
            aria-label="Ask about this video"
            className="flex-1 px-4 py-3 bg-white/[0.03] border border-edge rounded-xl text-sm text-ice placeholder:text-dim outline-none focus:border-bolt/50 focus:bg-white/[0.05] transition-all"
            disabled={isSendingMessage}
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isSendingMessage}
            aria-label="Send message"
            className="px-4 rounded-xl bg-gradient-to-br from-bolt to-iris text-white disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all flex items-center justify-center"
          >
            {isSendingMessage ? <Loader2 size={17} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
        <p className="max-w-2xl mx-auto mt-2.5 text-[10px] text-dim/80 text-center">
          Answers are generated only from this video's transcript.
        </p>
      </div>
    </div>
  );
}
