import React, { useState } from 'react';
import ChatWidget from './components/ChatWidget'; // Adjust path if needed
import { Leaf, Menu, User } from 'lucide-react';

function App() {
  // 1. STATE LIFTED HERE: Controls whether the chat is open or closed
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* --- YOUR MAIN WEBSITE HEADER --- */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Menu className="text-gray-600 md:hidden" />
          <span className="text-xl font-bold text-[#1A2F1D] flex items-center gap-2">
            <Leaf className="text-green-500" /> संजीवनी
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* HEADER CHAT BUTTON: Clicking this opens the widget */}
          <button 
            onClick={() => setIsChatOpen(true)}
            className="hidden md:flex bg-[#1A2F1D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#254229] transition-colors shadow-sm"
          >
            Ask AI Assistant
          </button>
          
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
            <User size={18} />
          </div>
        </div>
      </header>
      {/* --- YOUR MAIN WEBSITE CONTENT --- */}
      <main className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Farmer Dashboard</h1>
        
        {/* Example Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Total Herbs</p>
            <h3 className="text-3xl font-bold text-[#1A2F1D]">37</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Total Quantity</p>
            <h3 className="text-3xl font-bold text-[#1A2F1D]">5,549 kg</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <p className="text-gray-500 text-sm">Pending Verification</p>
             <h3 className="text-3xl font-bold text-orange-500">2</h3>
          </div>
        </div>

        {/* Activity Log Placeholder */}
        <div className="bg-white h-64 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400">
          Activity Log Table Area
        </div>
      </main>

      {/* --- THE CHAT WIDGET --- */}
      {/* We pass the state and the toggle function down */}
      <ChatWidget 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />

    </div>
  );
}

export default App;