import { sendMessage } from "../api/chat";
import React, { useState, useRef, useEffect } from 'react';
import { 
  Leaf, 
  QrCode, 
  MapPin, 
  Loader2, 
  X, 
  MessageCircle, 
  Send, 
  Maximize2, 
  Minimize2, 
  Minus,
  User 
} from 'lucide-react';

const ChatWidget = () => {
  // --- STATE MANAGEMENT ---
  const [isOpen, setIsOpen] = useState(false); // Controls Open/Close (Bubble vs Window)
  const [isExpanded, setIsExpanded] = useState(false); // Controls Full Screen vs Mini
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      text: 'नमस्ते 👋 संजीवनी में आपका स्वागत है। मैं आपकी कैसे मदद कर सकता हूँ?\n(Hi! Welcome to Sanjeevani. How can I help you?)',
      type: 'text'
    }
  ]);

  const messagesEndRef = useRef(null);

  // --- AUTO SCROLL ---
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen, isExpanded]);

  // --- HANDLERS ---
  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;

    // Show user message
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: userText,
      type: "text",
    };
    setMessages(prev => [...prev, userMsg]);

    setInput("");
    setIsTyping(true);

    try {
      const data = await sendMessage(userText);
      console.log("BACKEND DATA:", data);

      // Typing effect handles bot message insertion
      typeBotMessage(data.answer);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "bot",
          text: "Server error. Please try again.",
          type: "text",
        },
      ]);
      setIsTyping(false);
    }
  };


  // --- RENDER HELPERS ---
  const renderTraceCard = (data) => (
    <div className={`bg-white rounded-xl overflow-hidden border border-green-100 ${isExpanded ? 'p-6 min-w-[400px]' : 'p-3 min-w-[200px]'}`}>
      <div className="flex justify-between items-start border-b border-gray-100 pb-3 mb-3">
        <div>
          <h4 className={`font-bold text-[#1A2F1D] ${isExpanded ? 'text-xl' : 'text-sm'}`}>{data.herbName}</h4>
          <span className="text-xs text-gray-500">Batch: <span className="font-mono text-green-700">{data.batchId}</span></span>
        </div>
        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          {data.status}
        </span>
      </div>
      
      {/* Responsive Grid for Data */}
      <div className={`grid ${isExpanded ? 'grid-cols-2 gap-x-8 gap-y-4' : 'grid-cols-1 gap-1'} text-gray-600`}>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Quantity:</span>
          <span className="font-medium">{data.quantity}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Date:</span>
          <span className="font-medium">{data.date}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Farmer:</span>
          <span className="font-medium">{data.farmer}</span>
        </div>
         <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Quality:</span>
          <span className="font-medium text-blue-600">{data.quality}</span>
        </div>
      </div>
      
      <div className={`mt-3 pt-2 border-t border-dashed border-gray-200 text-gray-500 flex items-center gap-1 ${isExpanded ? 'text-sm' : 'text-[10px]'}`}>
        <MapPin size={isExpanded ? 16 : 12} /> 
        {data.origin}
      </div>
    </div>
  );

  const typeBotMessage = (fullText) => {
  let index = 0;
  const botId = Date.now() + 1;

  // Add empty bot message first
  setMessages(prev => [
    ...prev,
    { id: botId, sender: "bot", text: "", type: "text" }
  ]);

  const interval = setInterval(() => {
    index++;

    setMessages(prev =>
      prev.map(msg =>
        msg.id === botId
          ? { ...msg, text: fullText.slice(0, index) }
          : msg
      )
    );

    if (index >= fullText.length) {
      clearInterval(interval);
      setIsTyping(false);
    }
  }, 20); // typing speed (ms)
};

  return (
    <>
      {/* 1. LAUNCHER BUBBLE 
        Fixed to bottom-right. Visible only when chat is CLOSED.
      */}
      <button 
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 bg-[#1A2F1D] text-white ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* 2. CHAT WIDGET CONTAINER 
        Fixed position. Handles Mini vs Full Screen transitions.
      */}
      <div 
        className={`fixed z-50 bg-gray-50 shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] origin-bottom-right
        ${isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none scale-75 translate-y-10 translate-x-10'}
        ${isExpanded 
          ? 'inset-0 w-full h-full rounded-none' 
          : 'bottom-24 right-6 w-[380px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[80vh] rounded-2xl border border-gray-200' 
        }`}
      >
        
        {/* HEADER */}
        <div className="bg-[#1A2F1D] p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Leaf className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">Sanjeevani Trace</h3>
              <p className="text-[10px] text-green-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Blockchain Active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Full Screen Toggle */}
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
              title={isExpanded ? "Collapse" : "Full Screen"}
            >
              {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            {/* Minimize/Close Button */}
            <button 
              onClick={toggleChat} 
              className="p-2 hover:bg-red-500/20 hover:text-red-200 rounded-lg transition-colors text-white/80"
              title="Minimize"
            >
              <Minus size={18} />
            </button>
          </div>
        </div>

        {/* MESSAGES AREA */}
        <div className={`flex-1 overflow-y-auto bg-[#F3F4F6] ${isExpanded ? 'p-8' : 'p-4'}`}>
          <div className={`mx-auto space-y-6 ${isExpanded ? 'max-w-4xl' : 'max-w-full'}`}>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                
                {/* Bot Icon (Leaf) */}
                {msg.sender === 'bot' && (
                  <div className={`flex items-center justify-center rounded-full shrink-0 border border-green-100 bg-green-50 ${isExpanded ? 'w-10 h-10' : 'w-8 h-8'}`}>
                    <Leaf size={isExpanded ? 20 : 14} className="text-green-600" />
                  </div>
                )}

                {/* Message Bubble */}
                <div 
                  className={`
                    relative p-3 rounded-2xl shadow-sm transition-all duration-300
                    ${msg.sender === 'user' 
                      ? 'bg-[#1A2F1D] text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                    }
                    ${isExpanded 
                      ? 'text-base px-6 py-4 max-w-[60%]' 
                      : 'text-sm max-w-[75%]'
                    }
                  `}
                >
                  
                  {msg.type === 'text' ? (
                    <p className="leading-relaxed whitespace-pre-line">
                      {msg.text
                        .replace(/(\d+\.)/g, "\n$1")   // new line before 1. 2. 3.
                        .replace(/\s-\s/g, "\n- ")    // new line before - bullets
                        .trim()}
                    </p>
                  ) : (
                    renderTraceCard(msg.data)
                  )}

                </div>
                

                {/* User Icon (Person) */}
                {msg.sender === 'user' && (
                  <div className={`flex items-center justify-center rounded-full shrink-0 bg-gray-200 ${isExpanded ? 'w-10 h-10' : 'w-8 h-8'}`}>
                    <User size={isExpanded ? 20 : 14} className="text-gray-500" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-2 animate-pulse">
                <div className={`flex items-center justify-center rounded-full shrink-0 bg-green-50 w-8 h-8`}>
                   <Leaf size={14} className="text-green-600" />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 flex items-center gap-2">
                   <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                   <span className="text-xs text-gray-500">Thinking…</span>

                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT AREA */}
        <div className={`bg-white border-t border-gray-100 shrink-0 ${isExpanded ? 'p-6 flex justify-center' : 'p-3'}`}>
          <form onSubmit={handleSend} className={`flex gap-3 w-full ${isExpanded ? 'max-w-3xl' : ''}`}>
            
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your problem"
              className={`flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all 
              ${isExpanded ? 'py-4 text-base' : 'py-2 text-sm'}`}
            />
            
            <button 
              type="submit" 
              disabled={!input.trim()} 
              className={`bg-[#1A2F1D] text-white rounded-xl hover:bg-[#2a4a2f] flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed 
              ${isExpanded ? 'px-8' : 'px-4'}`}
            >
              <Send size={isExpanded ? 20 : 16} />
            </button>

          </form>
        </div>

      </div>
    </>
  );
};

export default ChatWidget;