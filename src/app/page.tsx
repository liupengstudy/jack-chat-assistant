'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import Navbar from './components/Navbar';
import Logo from './components/Logo';

export default function Home() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    { role: 'assistant', content: '下午好, jack.\n想聊点什么？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setError(null);
    
    // 添加用户消息到对话
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsLoading(true);
    try {
      // 调用API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from AI');
      }
      
      // 添加AI响应到对话
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'Failed to communicate with AI');
      // 显示错误消息
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，我遇到了一些问题。请稍后再试。' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-purple-100 dark:border-purple-900">
          {/* 聊天标题 */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-3 text-white">
            <h1 className="text-lg font-semibold">Chat with AI</h1>
            <p className="text-xs text-purple-100">让我们开始智能对话之旅</p>
          </div>

          {/* 聊天消息区域 */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-3 scroll-smooth">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`flex items-start ${message.role === 'user' ? 'justify-end' : 'justify-start space-x-2'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 flex-shrink-0 mt-1">
                    <Logo />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="px-4 py-2 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* 输入区域 */}
          <div className="border-t border-purple-100 dark:border-purple-900 p-3 bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLoading ? "AI正在思考中..." : "输入你的问题..."}
                disabled={isLoading}
                className="w-full p-3 pr-10 rounded-xl border border-purple-200 dark:border-purple-800 
                         bg-purple-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         placeholder-gray-400 dark:placeholder-gray-500 text-sm
                         disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-purple-500 hover:text-purple-600 
                         dark:text-purple-400 dark:hover:text-purple-300 transition-colors
                         disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
