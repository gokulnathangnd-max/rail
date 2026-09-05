import React, { useState } from 'react';
import { 
  MegaShadowBlock, 
  MaintenanceTicket, 
  Department, 
  TrackIdentifier 
} from '../types';
import { CORRIDOR_STATIONS } from '../mockData';
import { railwayAudio } from '../utils/audio';
import { 
  GitMerge, 
  Sliders, 
  Cpu, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  CloudRain, 
  TrendingUp, 
  Send, 
  ShieldCheck, 
  Layers, 
  HardHat, 
  Radio, 
  Zap, 
  ChevronRight,
  Maximize2,
  Sparkles,
  Info
} from 'lucide-react';

interface Interface2Props {
  megaBlocks: MegaShadowBlock[];
  tickets: MaintenanceTicket[];
  onApproveBlock: (blockId: string) => void;
  onNavigateToTab: (tab: 'STRING_CHART') => void;
}

export const Interface2_ShadowBlockOptimizer: React.FC<Interface2Props> = ({
  megaBlocks,
  tickets,
  onApproveBlock,
  onNavigateToTab
}) => {
  // Selected block for the floating drawer
  const [selectedBlockId, setSelectedBlockId] = useState<string>(megaBlocks[0]?.id || 'MSB-2026-089');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

  // Linear Graph-DBSCAN Tuning parameters
  const [spatialEpsilonKm, setSpatialEpsilonKm] = useState<number>(3.2);
  const [temporalWindowHours, setTemporalWindowHours] = useState<number>(3.5);
  const [minPts, setMinPts] = useState<number>(3);
  const [isClusteringRecalculating, setIsClusteringRecalculating] = useState<boolean>(false);

  // XGBoost Stochastic Simulator Controls
  const [simulatedRainfall, setSimulatedRainfall] = useState<number>(1.2);
  const [simulatedMachineryWear, setSimulatedMachineryWear] = useState<number>(84);
  const [simulatedGradientAngle, setSimulatedGradientAngle] = useState<number>(0.45);

  // Track filter in clustering grid
  const [activeTrackFilter, setActiveTrackFilter] = useState<'ALL' | 'UP' | 'DOWN'>('ALL');

  const activeBlock = megaBlocks.find((b) => b.id === selectedBlockId) || megaBlocks[0];

  // Tickets associated with the active block
  const clusteredTickets = tickets.filter(
    (t) => activeBlock && (t.mergedBlockId === activeBlock.id || activeBlock.ticketIds.includes(t.id))
  );

  // Dynamic XGBoost On-Time Probability based on real-time factors
  // Base 96% - rain penalty - wear penalty - gradient penalty
  const calculatedOnTimeProb = Math.max(
    45,
    Math.min(
      98,
      Math.round(
        96 - (simulatedRainfall * 1.8) - ((simulatedMachineryWear - 60) * 0.15) - (simulatedGradientAngle * 4.5)
      )
    )
  );
  const calculated15MinOverrun = Math.round((100 - calculatedOnTimeProb) * 0.75);
  const calculated30MinOverrun = Math.max(1, 100 - calculatedOnTimeProb - calculated15MinOverrun);

  const handleSelectBlock = (block: MegaShadowBlock) => {
    railwayAudio.playClick();
    setSelectedBlockId(block.id);
    setIsDrawerOpen(true);
  };

  const handleRunDBSCAN = () => {
    railwayAudio.playInterlockingLock();
    setIsClusteringRecalculating(true);
    setTimeout(() => {
      setIsClusteringRecalculating(false);
    }, 600);
  };

  const handleApprove = () => {
    if (!activeBlock) return;
    railwayAudio.playInterlockingLock();
    onApproveBlock(activeBlock.id);
  };

  // Linear Corridor Coordinate mapping: KM 0 to KM 160
  const corridorMinKm = 0;
  const corridorMaxKm = 160;
  const totalKmSpan = corridorMaxKm - corridorMinKm;

  const kmToGridPercent = (km: number) => {
    return ((km - corridorMinKm) / totalKmSpan) * 100;
  };

  const getDeptColor = (dept: Department) => {
    switch (dept) {
      case 'CIVIL':
        return '#F59E0B'; // Amber
      case 'ST':
        return '#10B981'; // Emerald
      case 'ELECTRICAL':
        return '#3B82F6'; // Blue
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto relative">
      {/* Viewport Purpose Header */}
      <div className="bg-white border-l-4 border-[#328CC1] p-4 rounded-r-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              CORE SHADOW BLOCK OPTIMIZER & GRAPH-DBSCAN CLUSTERING ENGINE
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#328CC1] text-white">
              AI INFERENCE ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Modified Linear Graph-DBSCAN groups multi-departmental maintenance tickets into high-density downtime windows; XGBoost models forecast stochastic overrun risk.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunDBSCAN}
            disabled={isClusteringRecalculating}
            className="px-3 py-1.5 bg-[#0B3C5D] hover:bg-[#082d46] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isClusteringRecalculating ? 'animate-spin' : ''}`} />
            {isClusteringRecalculating ? 'Recalculating Graphs...' : 'Run Linear Graph-DBSCAN Sweep'}
          </button>
        </div>
      </div>

      {/* ALGORITHMIC PARAMETER TUNING TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-xs">
        {/* Param 1: Spatial Epsilon */}
        <div>
          <div className="flex items-center justify-between text-slate-700 font-bold mb-1">
            <span>Spatial Epsilon (ε Radius)</span>
            <span className="font-mono text-[#0B3C5D] bg-slate-100 px-1.5 py-0.5 rounded">
              {spatialEpsilonKm.toFixed(1)} KM
            </span>
          </div>
          <input
            type="range"
            min="1.0"
            max="6.0"
            step="0.2"
            value={spatialEpsilonKm}
            onChange={(e) => setSpatialEpsilonKm(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B3C5D]"
          />
          <span className="text-[10px] text-slate-400">Linear track clustering horizon</span>
        </div>

        {/* Param 2: Max Temporal Co-location Window */}
        <div>
          <div className="flex items-center justify-between text-slate-700 font-bold mb-1">
            <span>Max Downtime Window</span>
            <span className="font-mono text-[#0B3C5D] bg-slate-100 px-1.5 py-0.5 rounded">
              {temporalWindowHours.toFixed(1)} Hours
            </span>
          </div>
          <input
            type="range"
            min="1.5"
            max="6.0"
            step="0.5"
            value={temporalWindowHours}
            onChange={(e) => setTemporalWindowHours(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B3C5D]"
          />
          <span className="text-[10px] text-slate-400">Time-expanded window limit</span>
        </div>

        {/* Param 3: MinPts */}
        <div>
          <div className="flex items-center justify-between text-slate-700 font-bold mb-1">
            <span>Minimum Points (MinPts)</span>
            <span className="font-mono text-[#0B3C5D] bg-slate-100 px-1.5 py-0.5 rounded">
              {minPts} Tickets
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="5"
            step="1"
            value={minPts}
            onChange={(e) => setMinPts(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B3C5D]"
          />
          <span className="text-[10px] text-slate-400">Cross-departmental density threshold</span>
        </div>

        {/* Param 4: Clustering Efficiency Badge */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 uppercase">
            <span>Downtime Compression</span>
            <span className="text-emerald-700 font-mono font-extrabold">+81.4%</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Replaces 5 separate 2-hour shutdowns (10 total hrs) with 1 unified 3.5-hour Mega Shadow Block.
          </p>
        </div>
      </div>

      {/* MAIN LINEAR CLUSTERING GRID (CANVAS / SCROLLABLE CORRIDOR MAP) */}
      <div className="bg-[#07273d] rounded-xl border border-[#1b5884] p-4 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#124d77] mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#0B3C5D] text-sky-400 rounded border border-[#328CC1]">
              <GitMerge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">
                Continuous Linear Track Clustering Grid (Corridor Overview)
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Anchored Linear KM 0 to KM 160 (NDLS - GZB - ALJN - TDL Trunk)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Display Alignment:</span>
            {(['ALL', 'UP', 'DOWN'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTrackFilter(t)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-colors ${
                  activeTrackFilter === t
                    ? 'bg-[#328CC1] text-white'
                    : 'bg-[#0B3C5D] text-slate-300 hover:bg-[#124d77]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-slate-300 mb-3 px-3 py-1.5 bg-[#0B3C5D]/60 rounded border border-[#124d77]">
          <span className="font-semibold text-slate-200">Point Markers:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <span>Civil (P-Way)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span>S&T (Signals/Points)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
            <span>Electrical (OHE 25kV)</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="w-3.5 h-2 bg-red-500/30 border border-red-400 rounded-xs" />
            <span className="text-red-300 font-semibold">Automated Integrated Mega Shadow Block</span>
          </div>
        </div>

        {/* Scrollable Linear Canvas Container */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[900px] bg-[#041624] rounded-lg border border-[#103e61] p-3 relative select-none">
            <svg viewBox="0 0 1000 230" className="w-full h-56">
              <defs>
                <pattern id="clusterHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#D9534F" strokeWidth="1.5" strokeOpacity="0.6" />
                </pattern>
                <filter id="clusterGlow" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Station Reference Markers Top */}
              {CORRIDOR_STATIONS.map((station) => {
                const sX = 50 + (kmToGridPercent(station.distanceKm) * 9.0);
                return (
                  <g key={station.code} className="opacity-85">
                    <line x1={sX} y1="20" x2={sX} y2="195" stroke="#1c557d" strokeDasharray="3 3" strokeWidth="1" />
                    <circle cx={sX} cy="20" r="3" fill="#38BDF8" />
                    <text
                      x={sX}
                      y="14"
                      fill="#E2E8F0"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {station.code}
                    </text>
                    <text
                      x={sX}
                      y="210"
                      fill="#64748B"
                      fontSize="8"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      KM {station.distanceKm}
                    </text>
                  </g>
                );
              })}

              {/* UP Line Track (Y = 80) */}
              {(activeTrackFilter === 'ALL' || activeTrackFilter === 'UP') && (
                <g>
                  <line x1="50" y1="78" x2="950" y2="78" stroke="#334155" strokeWidth="1.5" />
                  <line x1="50" y1="82" x2="950" y2="82" stroke="#334155" strokeWidth="1.5" />
                  <line x1="50" y1="80" x2="950" y2="80" stroke="#0284C7" strokeWidth="2" />
                  <text x="10" y="84" fill="#38BDF8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    UP LINE
                  </text>
                </g>
              )}

              {/* DOWN Line Track (Y = 145) */}
              {(activeTrackFilter === 'ALL' || activeTrackFilter === 'DOWN') && (
                <g>
                  <line x1="50" y1="143" x2="950" y2="143" stroke="#334155" strokeWidth="1.5" />
                  <line x1="50" y1="147" x2="950" y2="147" stroke="#334155" strokeWidth="1.5" />
                  <line x1="50" y1="145" x2="950" y2="145" stroke="#0284C7" strokeWidth="2" />
                  <text x="5" y="149" fill="#38BDF8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    DOWN LINE
                  </text>
                </g>
              )}

              {/* Automated Integrated Mega Shadow Blocks (Glowing Bounding Rectangles) */}
              {megaBlocks.map((block) => {
                const bStartX = 50 + (kmToGridPercent(block.startKm) * 9.0);
                const bEndX = 50 + (kmToGridPercent(block.endKm) * 9.0);
                const bTrackY = block.track === 'UP' ? 80 : 145;
                const bWidth = Math.max(30, bEndX - bStartX);
                const isSelected = activeBlock?.id === block.id;

                if (activeTrackFilter !== 'ALL' && activeTrackFilter !== block.track) return null;

                return (
                  <g
                    key={block.id}
                    filter="url(#clusterGlow)"
                    className="cursor-pointer transition-transform hover:opacity-95"
                    onClick={() => handleSelectBlock(block)}
                  >
                    {/* Semi-transparent glowing bounding rectangle */}
                    <rect
                      x={bStartX}
                      y={bTrackY - 24}
                      width={bWidth}
                      height="48"
                      rx="6"
                      fill="url(#clusterHatch)"
                      stroke={isSelected ? '#FBBF24' : '#D9534F'}
                      strokeWidth={isSelected ? '3' : '2'}
                      fillOpacity="0.45"
                      className="transition-all"
                    />

                    {/* Left & Right boundary pins */}
                    <line x1={bStartX} y1={bTrackY - 28} x2={bStartX} y2={bTrackY + 28} stroke="#D9534F" strokeWidth="2.5" />
                    <line x1={bStartX + bWidth} y1={bTrackY - 28} x2={bStartX + bWidth} y2={bTrackY + 28} stroke="#D9534F" strokeWidth="2.5" />

                    {/* Top identification badge */}
                    <rect
                      x={bStartX + bWidth / 2 - 58}
                      y={bTrackY - 44}
                      width="116"
                      height="18"
                      rx="4"
                      fill={isSelected ? '#0B3C5D' : '#1E293B'}
                      stroke={isSelected ? '#FBBF24' : '#D9534F'}
                      strokeWidth="1.2"
                    />
                    <text
                      x={bStartX + bWidth / 2}
                      y={bTrackY - 32}
                      fill={isSelected ? '#FDE68A' : '#FCA5A5'}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {block.id} (DBSCAN ε={block.spatialEpsilonKm}k)
                    </text>
                  </g>
                );
              })}

              {/* Discrete Department Maintenance Tickets (Marker Dots Anchored to Kilometers) */}
              {tickets.map((ticket) => {
                if (activeTrackFilter !== 'ALL' && activeTrackFilter !== ticket.track) return null;
                const tX = 50 + (kmToGridPercent(ticket.startKm + ticket.startMeter / 1000) * 9.0);
                const tY = ticket.track === 'UP' ? 80 : 145;
                const dotColor = getDeptColor(ticket.department);
                const isPartOfSelectedBlock = activeBlock?.ticketIds.includes(ticket.id);

                return (
                  <g key={ticket.id} className="cursor-pointer group">
                    <circle
                      cx={tX}
                      cy={tY}
                      r={isPartOfSelectedBlock ? 6 : 4.5}
                      fill={dotColor}
                      stroke="#FFFFFF"
                      strokeWidth={isPartOfSelectedBlock ? 2 : 1.2}
                      className="transition-all hover:scale-150"
                    />
                    {ticket.urgency === 'EMERGENCY' && (
                      <circle
                        cx={tX}
                        cy={tY}
                        r="9"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
          <span className="text-[11px] text-slate-400">
            Click on any red/amber clustered bounding box to inspect consolidated asset demands and XGBoost overrun predictions.
          </span>
          <span className="font-mono text-[11px] text-amber-300">
            Selected Block: {activeBlock ? activeBlock.id : 'None'}
          </span>
        </div>
      </div>

      {/* FLOATING INSPECT CONTEXTUAL SIDE-DRAWER */}
      {isDrawerOpen && activeBlock && (
        <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden animate-slide-in">
          {/* Drawer Header */}
          <div className="bg-[#0B3C5D] text-white p-4 flex items-center justify-between border-b-2 border-[#D9534F]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold bg-[#328CC1] px-2 py-0.5 rounded text-white font-mono">
                  CLUSTER INSPECTOR
                </span>
                <span className="text-[10px] uppercase font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-mono">
                  {activeBlock.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1 font-mono tracking-wide">
                {activeBlock.id}
              </h3>
              <p className="text-xs text-slate-300">
                {activeBlock.title}
              </p>
            </div>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-full hover:bg-[#124d77] text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs">
            {/* Spatial & Temporal Summary */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 grid grid-cols-2 gap-3 text-slate-700">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Track Alignment</span>
                <div className="font-bold text-slate-900 font-mono text-xs mt-0.5">
                  {activeBlock.track} LINE (Main Trunk)
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Spatial Kilometrage</span>
                <div className="font-bold text-[#0B3C5D] font-mono text-xs mt-0.5">
                  KM {activeBlock.startKm} to {activeBlock.endKm}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Scheduled Time Window</span>
                <div className="font-bold text-slate-900 font-mono text-xs mt-0.5">
                  {activeBlock.scheduledStartTime} - {activeBlock.scheduledEndTime} IST
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">DBSCAN Cohesion Score</span>
                <div className="font-bold text-emerald-700 font-mono text-xs mt-0.5">
                  {(activeBlock.linearDBSCANClusterScore * 100).toFixed(1)}% Optimal
                </div>
              </div>
            </div>

            {/* CONSOLIDATED ASSET DEMANDS LIST */}
            <div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 mb-2.5">
                <h4 className="font-bold text-slate-900 uppercase tracking-tight text-xs flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-sky-600" />
                  Consolidated Asset Demands ({clusteredTickets.length} Swept Defects)
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">
                  Combined Downtime: 210 Min
                </span>
              </div>

              <div className="space-y-2">
                {clusteredTickets.map((t) => {
                  const Icon = t.department === 'CIVIL' ? HardHat : t.department === 'ST' ? Radio : Zap;
                  const deptBadge = 
                    t.department === 'CIVIL' ? 'bg-amber-100 text-amber-800' :
                    t.department === 'ST' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800';

                  return (
                    <div key={t.id} className="p-2.5 rounded-lg border border-slate-200 bg-white shadow-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#0B3C5D]">{t.id}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${deptBadge}`}>
                          {t.department}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800">{t.assetType}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
                        <span>KM {t.startKm}/{t.startMeter} - {t.endKm}/{t.endMeter}</span>
                        <span>{t.estimatedHours} hrs • {t.crewRequirement} crew</span>
                      </div>
                      {t.notes && (
                        <div className="text-[11px] text-slate-600 italic bg-slate-50 p-1 rounded border border-slate-100">
                          "{t.notes}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STOCHASTIC OVERRUN PREDICTION WIDGET (XGBoost Regressor Model) */}
            <div className="bg-slate-900 text-white p-4 rounded-xl shadow-inner space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-sky-600 text-white">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
                      Stochastic Overrun Prediction
                    </h4>
                    <span className="text-[10px] text-sky-400 font-mono">
                      XGBoost Regressor v4.2 • 96% Baseline Confidence
                    </span>
                  </div>
                </div>
              </div>

              {/* Radial Progress Gauge Visualizer */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                {/* SVG Radial Gauge */}
                <div className="relative w-32 h-32 shrink-0">
                  <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                    {/* Background Ring */}
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      stroke="#1E293B"
                      strokeWidth="10"
                      fill="none"
                    />
                    {/* Active On-Time Arc */}
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      stroke={calculatedOnTimeProb > 80 ? '#10B981' : calculatedOnTimeProb > 60 ? '#F59E0B' : '#EF4444'}
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 48}
                      strokeDashoffset={2 * Math.PI * 48 * (1 - calculatedOnTimeProb / 100)}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  {/* Gauge Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black font-mono text-white tracking-tight">
                      {calculatedOnTimeProb}%
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold">
                      On-Time Prob
                    </span>
                  </div>
                </div>

                {/* Probability Distribution Matrix Breakdown */}
                <div className="space-y-2 text-xs flex-1">
                  <div className="flex items-center justify-between bg-slate-800/80 px-2.5 py-1.5 rounded border border-slate-700">
                    <span className="text-emerald-400 font-semibold">On-Time Clearance:</span>
                    <span className="font-mono font-bold text-white">{calculatedOnTimeProb}%</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800/80 px-2.5 py-1.5 rounded border border-slate-700">
                    <span className="text-amber-400 font-semibold">Risk of 15-Min Overrun:</span>
                    <span className="font-mono font-bold text-white">{calculated15MinOverrun}%</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800/80 px-2.5 py-1.5 rounded border border-slate-700">
                    <span className="text-red-400 font-semibold">Risk of &gt;30-Min Overrun:</span>
                    <span className="font-mono font-bold text-white">{calculated30MinOverrun}%</span>
                  </div>
                </div>
              </div>

              {/* Key Risk Factor Variables (Interactive Simulation Sliders) */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Real-Time Stochastic Risk Factor Variables:
                </span>

                {/* Risk 1: Live Rainfall */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-300 flex items-center gap-1">
                      <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                      Live Rainfall Intensity (mm/hr):
                    </span>
                    <span className="font-mono text-sky-300 font-bold">
                      {simulatedRainfall.toFixed(1)} mm/h {simulatedRainfall > 8 ? '(Heavy Monsoon)' : simulatedRainfall > 2 ? '(Light Rain)' : '(Dry/Clear)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    value={simulatedRainfall}
                    onChange={(e) => setSimulatedRainfall(Number(e.target.value))}
                    className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-sky-400"
                  />
                </div>

                {/* Risk 2: Machinery Wear */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-300">Machinery Wear Metric (Hrs since Overhaul):</span>
                    <span className="font-mono text-amber-300 font-bold">
                      {simulatedMachineryWear} hrs {simulatedMachineryWear > 120 ? '(Critical Wear)' : '(Optimal)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="180"
                    step="5"
                    value={simulatedMachineryWear}
                    onChange={(e) => setSimulatedMachineryWear(Number(e.target.value))}
                    className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-amber-400"
                  />
                </div>

                {/* Risk 3: Track Gradient Curve */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-300">Track Gradient Curve Angle:</span>
                    <span className="font-mono text-emerald-300 font-bold">
                      {simulatedGradientAngle.toFixed(2)}° (Mandrak Approach)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3.0"
                    step="0.1"
                    value={simulatedGradientAngle}
                    onChange={(e) => setSimulatedGradientAngle(Number(e.target.value))}
                    className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-emerald-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* APPROVAL OPERATIONAL FOOTER (Dark Contextual Bar Locking to Bottom) */}
          <div className="bg-[#07273d] p-4 border-t-2 border-[#124d77] text-white flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Status: {activeBlock.status}</span>
              <span className="text-amber-400 font-bold font-mono text-[11px]">
                {activeBlock.ticketIds.length} Assets Synchronized
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateToTab('STRING_CHART')}
                className="flex-1 py-2 px-3 bg-[#0B3C5D] hover:bg-[#124d77] border border-[#328CC1] text-white rounded text-xs font-semibold text-center transition-colors"
              >
                Inspect String Chart
              </button>

              <button
                type="button"
                onClick={handleApprove}
                disabled={activeBlock.status === 'APPROVED' || activeBlock.status === 'ACTIVE_ISOLATION'}
                className={`flex-2 py-2.5 px-4 font-bold text-xs uppercase tracking-wider rounded shadow-md border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                  activeBlock.status === 'APPROVED' || activeBlock.status === 'ACTIVE_ISOLATION'
                    ? 'bg-emerald-600 text-white border-emerald-800 cursor-default'
                    : 'bg-[#D9534F] hover:bg-[#c9302c] text-white border-red-900'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                {activeBlock.status === 'APPROVED' || activeBlock.status === 'ACTIVE_ISOLATION'
                  ? 'Block Approved & Dispatched to TENF'
                  : 'Approve Block & Dispatch Network Flow Router'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
