import React, { useState } from 'react';
import { DeliveryPartner } from '../types';
import { X, Send, Bike, CheckCheck } from 'lucide-react';

interface RiderChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: DeliveryPartner;
  deliveryPin: string;
}

interface Message {
  id: string;
  sender: 'user' | 'rider';
  text: string;
  time: string;
}

export const RiderChatModal: React.FC<RiderChatModalProps> = ({
  isOpen,
  onClose,
  partner,
  deliveryPin,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'rider',
      text: `Namaste! I am ${partner.name}, your FOOD HUB delivery partner. I'm on my way with your hot meal!`,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const quickReplies = [
    'Please call when you reach the gate',
    'Leave the food with security',
    `My delivery PIN is ${deliveryPin}`,
    'Do you need directions?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Simulate realistic rider response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let reply = 'Sure thing, will follow instructions!';
      if (text.includes('PIN')) {
        reply = `Noted the PIN ${deliveryPin}. Almost there!`;
      } else if (text.includes('gate') || text.includes('security')) {
        reply = 'Got it! I will notify you once I reach your building.';
      } else if (text.includes('directions')) {
        reply = 'GPS navigation is clear, turning into your main road now.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'rider',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        id="rider-chat-container"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[520px]"
      >
        {/* Chat Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={partner.photoUrl}
                alt={partner.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-orange-500"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-stone-900 rounded-full"></span>
            </div>
            <div>
              <h3 className="text-sm font-bold">{partner.name}</h3>
              <p className="text-[11px] text-stone-400 flex items-center gap-1">
                <Bike className="w-3 h-3 text-orange-400" />
                <span>{partner.vehicle}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  m.sender === 'user'
                    ? 'bg-orange-600 text-white rounded-br-xs'
                    : 'bg-white text-stone-800 border border-stone-200 shadow-2xs rounded-bl-xs'
                }`}
              >
                <p className="leading-relaxed">{m.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-70">
                  <span>{m.time}</span>
                  {m.sender === 'user' && <CheckCheck className="w-3 h-3" />}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-stone-400 text-[11px] italic bg-white px-3 py-1.5 rounded-full w-fit border border-stone-200">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1">{partner.name} is typing...</span>
            </div>
          )}
        </div>

        {/* Quick reply suggestion chips */}
        <div className="p-2 border-t border-stone-200 bg-white overflow-x-auto flex gap-1.5 scrollbar-none">
          {quickReplies.map((qr, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qr)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-stone-100 hover:bg-orange-50 hover:text-orange-700 text-stone-700 border border-stone-200 transition-colors"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Chat input box */}
        <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message to your rider..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-stone-800"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="p-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
