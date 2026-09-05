import React from 'react';
import { 
  ClipboardList, 
  GitMerge, 
  TrendingUp, 
  CheckCircle2, 
  Layers, 
  Radio, 
  Info,
  Sliders
} from 'lucide-react';
import { BlockStatus } from '../types';
import { railwayAudio } from '../utils/audio';

export type ActiveTab = 'INPUT_LOG' | 'SHADOW_OPTIMIZER' | 'STRING_CHART';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingTicketCount: number;
  activeClusterCount: number;
  activeConflictCount: number;
  blockStatus: BlockStatus;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingTicketCount,
  activeClusterCount,
  activeConflictCount,
  blockStatus
}) => {
  const handleTabChange = (tab: ActiveTab) => {
    railwayAudio.playClick();
    setActiveTab(tab);
  };

  const isBlockActive = blockStatus === 'APPROVED' || blockStatus === 'PENDING_SM_VERIFICATION' || blockStatus === 'ACTIVE_ISOLATION';

  const navItems = [
    {
      id: 'INPUT_LOG' as ActiveTab,
      number: '01',
      title: 'Defect Ingestion & Log Panel',
      shortTitle: 'Multi-Dept Defect Input',
      description: 'P-Way, S&T and OHE Linear Track Registration',
      icon: ClipboardList,
      badge: `${pendingTicketCount} Open`,
      badgeColor: 'bg-amber-100 text-amber-800 border border-amber-300'
    },
    {
      id: 'SHADOW_OPTIMIZER' as ActiveTab,
      number: '02',
      title: 'Shadow Block Optimizer',
      shortTitle: 'Core DBSCAN Optimizer',
      description: 'Graph-DBSCAN Clustered Windows & XGBoost Overrun',
      icon: GitMerge,
      badge: `${activeClusterCount} Clustered`,
      badgeColor: 'bg-sky-100 text-sky-800 border border-sky-300'
    },
    {
      id: 'STRING_CHART' as ActiveTab,
      number: '03',
      title: 'Dynamic Timetable Visualizer',
      shortTitle: 'Train String Chart (TENF)',
      description: 'Time-Expanded Network Flow & Loop Interleaving',
      icon: TrendingUp,
      badge: `${activeConflictCount} Interleaved`,
      badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-300'
    }
  ];

  return (
    <aside className="w-64 sm:w-72 bg-[#0B3C5D] text-white flex flex-col justify-between shrink-0 border-r border-[#124d77] select-none h-full shadow-lg">
      <div className="p-3">
        {/* Section Header */}
        <div className="px-3 py-2 text-[11px] uppercase tracking-wider font-bold text-sky-300/80 flex items-center justify-between border-b border-[#124d77]/60 mb-2">
          <span>Operational Interfaces</span>
          <span className="text-[10px] font-mono bg-[#07273d] px-1.5 py-0.5 rounded text-slate-300">
            3 WORKSPACES
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full text-left p-2.5 rounded-lg transition-all duration-150 relative group flex items-start gap-3 ${
                  isActive
                    ? 'bg-[#328CC1] text-white shadow-md'
                    : 'hover:bg-[#124d77] text-slate-200 hover:text-white'
                }`}
              >
                {/* Active marker left bar */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-amber-400 rounded-r" />
                )}

                <div className={`p-2 rounded-md shrink-0 transition-colors ${
                  isActive 
                    ? 'bg-[#0B3C5D] text-amber-300 shadow-inner' 
                    : 'bg-[#07273d] text-sky-400 group-hover:text-white'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                        {item.number}
                      </span>
                      <span className="text-xs font-semibold tracking-tight truncate">
                        {item.shortTitle}
                      </span>
                    </div>
                  </div>

                  <p className={`text-[11px] leading-tight line-clamp-1 ${
                    isActive ? 'text-white/90' : 'text-slate-300 group-hover:text-slate-200'
                  }`}>
                    {item.description}
                  </p>

                  <div className="mt-1.5 flex items-center justify-between">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                    {isActive && (
                      <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                        Active <CheckCircle2 className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status & Interlocking Diagnostics */}
      <div className="p-3 bg-[#07273d] border-t border-[#124d77] text-xs">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
          <span>Subsystem Heartbeats</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <div className="space-y-1.5 text-[11px] font-mono text-slate-300">
          <div className="flex items-center justify-between bg-[#0B3C5D]/60 px-2 py-1 rounded">
            <span className="text-slate-400">Graph-DBSCAN:</span>
            <span className="text-emerald-300 font-semibold">CONVERGED (ε=3.2km)</span>
          </div>
          <div className="flex items-center justify-between bg-[#0B3C5D]/60 px-2 py-1 rounded">
            <span className="text-slate-400">XGBoost Regressor:</span>
            <span className="text-sky-300 font-semibold">92.4% CONF</span>
          </div>
          <div className="flex items-center justify-between bg-[#0B3C5D]/60 px-2 py-1 rounded">
            <span className="text-slate-400">Network Flow (TENF):</span>
            <span className="text-amber-300 font-semibold">ZERO-CONFLICT</span>
          </div>
          <div className="flex items-center justify-between bg-[#0B3C5D]/60 px-2 py-1 rounded">
            <span className="text-slate-400">CTC Route Interlock:</span>
            <span className={isBlockActive ? 'text-amber-300 font-bold' : 'text-emerald-400'}>
              {isBlockActive ? 'BLOCKED ARMED' : 'LINE CLEAR'}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-[#124d77]/60 flex items-center justify-between text-[10px] text-slate-400">
          <span>Server: DL-CRIS-PROD-04</span>
          <span>Latency: 14ms</span>
        </div>
      </div>
    </aside>
  );
};
