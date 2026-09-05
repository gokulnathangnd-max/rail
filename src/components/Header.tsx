import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Activity, 
  Clock, 
  MapPin, 
  AlertTriangle
} from 'lucide-react';
import { railwayAudio } from '../utils/audio';
import { BlockStatus } from '../types';

interface HeaderProps {
  activeBlockStatus: BlockStatus;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  selectedDivision: string;
  setSelectedDivision: (div: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeBlockStatus,
  soundEnabled,
  setSoundEnabled,
  selectedDivision,
  setSelectedDivision
}) => {
  const [istTime, setIstTime] = useState<string>('');
  const [istDate, setIstDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as IST (Indian Standard Time)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      };
      setIstTime(new Intl.DateTimeFormat('en-GB', options).format(now));
      setIstDate(new Intl.DateTimeFormat('en-GB', dateOptions).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    railwayAudio.enabled = next;
    setSoundEnabled(next);
    if (next) railwayAudio.playClick();
  };

  const getStatusBadge = () => {
    if (activeBlockStatus === 'STATION_AUTHORIZED' || activeBlockStatus === 'ACTIVE_ISOLATION') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-600 text-white text-xs font-semibold tracking-wide uppercase animate-pulse">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          Track Isolation Active (MSB-089)
        </span>
      );
    }
    if (activeBlockStatus === 'APPROVED' || activeBlockStatus === 'PENDING_SM_VERIFICATION') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500 text-slate-950 text-xs font-bold tracking-wide uppercase">
          <AlertTriangle className="w-3.5 h-3.5" />
          Shadow Block Approved (MSB-089)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-600/90 text-white text-xs font-medium tracking-wide">
        <span className="w-2 h-2 rounded-full bg-emerald-300" />
        Normal Operations / CTC Clear
      </span>
    );
  };

  return (
    <header className="bg-[#0B3C5D] text-white border-b-2 border-[#D9534F] shadow-md z-30 sticky top-0">
      {/* Top micro bar for Ministry of Railways / Government of India credentials */}
      <div className="bg-[#07273d] px-4 py-1 flex items-center justify-between text-[11px] text-slate-300 border-b border-[#124d77]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium tracking-wide">
            <span className="text-amber-400 font-bold">भारत सरकार</span>
            <span>|</span>
            <span>GOVERNMENT OF INDIA</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-300 font-medium hidden sm:inline">रेल मंत्रालय (MINISTRY OF RAILWAYS)</span>
          <span className="text-slate-500 hidden md:inline">•</span>
          <span className="text-amber-300 font-mono hidden md:inline">CRIS / COA-TMS INTEGRATED SUITE</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono">CRIS-TMS NETWORK FLOW & TENF COMPLIANT</span>
          </div>
          <span className="text-slate-500">•</span>
          <div className="flex items-center gap-1 text-slate-200">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-mono text-[10px] bg-[#0B3C5D] px-1.5 py-0.5 rounded border border-[#328CC1]">
              SIH 2026 PS27
            </span>
          </div>
        </div>
      </div>

      {/* Main Brand & Action Header */}
      <div className="px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Emblem & App Title */}
        <div className="flex items-center gap-3.5">
          {/* Stylized Indian Railways Emblem Shield */}
          <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-[#1c557d] to-[#082d46] border border-[#328CC1] flex items-center justify-center p-1 shadow-inner relative group">
            <div className="w-8 h-8 rounded-full border border-amber-400/80 flex items-center justify-center text-amber-300 font-bold text-xs">
              <svg className="w-6 h-6 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18" />
                <path d="M3 12h18" />
                <path d="M8 8l8 8" />
                <path d="M16 8l-8 8" />
              </svg>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                IR-SMART SHADOW BLOCK OPTIMIZER
              </h1>
              <span className="text-[10px] font-bold bg-[#328CC1] text-white px-2 py-0.5 rounded tracking-wider uppercase">
                v2.6 Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-300 font-normal">
              Linear Graph-DBSCAN Multi-Departmental Maintenance & Capacity Interleaving System
            </p>
          </div>
        </div>

        {/* Center: Live Status & Division Selector */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Division Selector */}
          <div className="flex items-center gap-1.5 bg-[#082d46] px-2.5 py-1 rounded border border-[#1b5884] text-xs">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400 font-medium">Division:</span>
            <select 
              value={selectedDivision} 
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs"
            >
              <option value="NDLS" className="bg-[#0B3C5D] text-white">Northern Rly - Delhi (NDLS)</option>
              <option value="BCT" className="bg-[#0B3C5D] text-white">Western Rly - Mumbai Central (BCT)</option>
              <option value="HWH" className="bg-[#0B3C5D] text-white">Eastern Rly - Howrah (HWH)</option>
              <option value="MAS" className="bg-[#0B3C5D] text-white">Southern Rly - Chennai (MAS)</option>
            </select>
          </div>

          {/* Operational Status Pill */}
          {getStatusBadge()}
        </div>

        {/* Right: IST Chronometer & Controls */}
        <div className="flex items-center gap-3">
          {/* Live Indian Standard Time */}
          <div className="flex items-center gap-2 bg-[#062134] px-3 py-1.5 rounded border border-[#1b5884]">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <div className="text-right">
              <div className="text-sm font-mono font-bold tracking-wider text-amber-300">
                {istTime || '11:15:00'} <span className="text-[10px] text-slate-400 font-sans font-medium">IST</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {istDate || '05 Sep 2026'}
              </div>
            </div>
          </div>

          {/* Audio toggle button */}
          <button 
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Railway Audio Feedback' : 'Enable Railway Audio Feedback'}
            className="p-2 rounded bg-[#082d46] hover:bg-[#124d77] border border-[#1b5884] text-slate-200 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
