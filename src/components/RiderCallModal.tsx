import React, { useState, useEffect } from 'react';
import { DeliveryPartner } from '../types';
import { Phone, PhoneOff, Mic, MicOff, Volume2, ShieldCheck, Bike } from 'lucide-react';

interface RiderCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: DeliveryPartner;
}

export const RiderCallModal: React.FC<RiderCallModalProps> = ({
  isOpen,
  onClose,
  partner,
}) => {
  const [callState, setCallState] = useState<'connecting' | 'ringing' | 'connected'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCallState('connecting');
      setCallDuration(0);
      return;
    }

    const ringTimer = setTimeout(() => {
      setCallState('ringing');
    }, 1500);

    const connectTimer = setTimeout(() => {
      setCallState('connected');
    }, 3500);

    return () => {
      clearTimeout(ringTimer);
      clearTimeout(connectTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration((d) => d + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-md animate-fade-in">
      <div 
        id="rider-call-screen"
        className="w-full max-w-sm bg-gradient-to-b from-stone-900 via-stone-900 to-black text-white rounded-3xl p-6 flex flex-col items-center justify-between h-[480px] shadow-2xl border border-stone-800"
      >
        {/* Top security tag */}
        <div className="flex items-center gap-1.5 text-[11px] text-stone-400 bg-white/10 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Number Masked • Free Food Hub In-App Call</span>
        </div>

        {/* Rider Photo & Status */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <div className={`w-24 h-24 rounded-full overflow-hidden border-4 ${
              callState === 'connected' ? 'border-emerald-500 animate-pulse' : 'border-orange-500'
            }`}>
              <img
                src={partner.photoUrl}
                alt={partner.name}
                className="w-full h-full object-cover"
              />
            </div>
            {callState === 'connected' && (
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-stone-900 flex items-center justify-center">
                <Bike className="w-3 h-3 text-white" />
              </span>
            )}
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold font-['Outfit',sans-serif]">
              {partner.name}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5 font-mono">
              {partner.phone}
            </p>
            <p className="text-sm font-medium text-orange-400 mt-2">
              {callState === 'connecting' && 'Connecting to partner...'}
              {callState === 'ringing' && 'Ringing partner phone...'}
              {callState === 'connected' && `Call in progress (${formatSeconds(callDuration)})`}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full space-y-6">
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full transition-colors ${
                isMuted ? 'bg-rose-500 text-white' : 'bg-white/10 text-stone-300 hover:bg-white/20'
              }`}
              title="Mute"
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              className="p-3 rounded-full bg-white/10 text-stone-300 hover:bg-white/20 transition-colors"
              title="Speaker"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* End Call Button */}
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-colors"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
