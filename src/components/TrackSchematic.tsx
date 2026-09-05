import React, { useState } from 'react';
import { MaintenanceTicket, TrackIdentifier, Department } from '../types';
import { CORRIDOR_STATIONS } from '../mockData';
import { ZoomIn, ZoomOut, Maximize2, ShieldAlert, Crosshair, MapPin } from 'lucide-react';

interface TrackSchematicProps {
  currentTrack: TrackIdentifier;
  startKm: number;
  endKm: number;
  startMeter: number;
  endMeter: number;
  department: Department;
  existingTickets: MaintenanceTicket[];
  activeMegaBlockRange?: { startKm: number; endKm: number; track: TrackIdentifier; id: string };
  onSelectTicket?: (ticket: MaintenanceTicket) => void;
}

export const TrackSchematic: React.FC<TrackSchematicProps> = ({
  currentTrack,
  startKm,
  endKm,
  startMeter,
  endMeter,
  department,
  existingTickets,
  activeMegaBlockRange,
  onSelectTicket
}) => {
  // Zoom mode: 'FOCUS' (KM 120-160 around Mandrak/Aligarh) or 'FULL' (KM 0-160 NDLS-TDL)
  const [viewRange, setViewRange] = useState<'FOCUS' | 'FULL'>('FOCUS');
  const [hoveredTicket, setHoveredTicket] = useState<MaintenanceTicket | null>(null);

  const minKm = viewRange === 'FOCUS' ? 120 : 0;
  const maxKm = viewRange === 'FOCUS' ? 160 : 160;
  const kmSpan = maxKm - minKm;

  // Convert a KM coordinate to SVG X percentage (0% to 100%)
  const kmToX = (km: number, meter: number = 0) => {
    const totalKm = km + meter / 1000;
    const clamped = Math.max(minKm, Math.min(maxKm, totalKm));
    return ((clamped - minKm) / kmSpan) * 100;
  };

  // Coordinates for the illuminated active input box
  const inputStartKm = Math.min(startKm, endKm);
  const inputEndKm = Math.max(startKm, endKm);
  const leftX = kmToX(inputStartKm, startMeter);
  const rightX = kmToX(inputEndKm, endMeter);
  const boxWidth = Math.max(1.8, rightX - leftX);

  const upTrackY = 70;
  const downTrackY = 120;
  const targetTrackY = currentTrack === 'UP' ? upTrackY : downTrackY;

  // Relevant stations within the view range
  const visibleStations = CORRIDOR_STATIONS.filter(
    (s) => s.distanceKm >= minKm - 2 && s.distanceKm <= maxKm + 2
  );

  const getDeptColor = (dept: Department) => {
    switch (dept) {
      case 'CIVIL':
        return '#D97706'; // Amber-600
      case 'ST':
        return '#059669'; // Emerald-600
      case 'ELECTRICAL':
        return '#2563EB'; // Blue-600
      default:
        return '#4B5563';
    }
  };

  return (
    <div className="bg-[#07273d] rounded-xl border border-[#1b5884] p-4 text-white relative shadow-md flex flex-col justify-between">
      {/* Schematic Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#124d77] mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[#0B3C5D] text-amber-400 border border-[#328CC1]/40">
            <Crosshair className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-100">
                Interactive Track Topology Schematic
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-600 font-mono">
                REAL-TIME VECTOR
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Corridor: Delhi - Kanpur Quadruple Trunk Route (130 km/h Automatic Block Section)
            </p>
          </div>
        </div>

        {/* Zoom Mode & Presets */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setViewRange('FOCUS')}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
              viewRange === 'FOCUS'
                ? 'bg-[#328CC1] text-white font-bold'
                : 'bg-[#0B3C5D] text-slate-300 hover:bg-[#124d77]'
            }`}
          >
            Aligarh Outer Zone (120-160 KM)
          </button>
          <button
            type="button"
            onClick={() => setViewRange('FULL')}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
              viewRange === 'FULL'
                ? 'bg-[#328CC1] text-white font-bold'
                : 'bg-[#0B3C5D] text-slate-300 hover:bg-[#124d77]'
            }`}
          >
            Full Corridor (0-160 KM)
          </button>
        </div>
      </div>

      {/* Track Legend */}
      <div className="flex items-center gap-4 text-[11px] text-slate-300 mb-2 py-1 px-2 bg-[#0B3C5D]/50 rounded border border-[#124d77]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
          <span>Civil (P-Way)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
          <span>S&T (Signals & Points)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
          <span>Electrical (25kV OHE)</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="w-3 h-2 bg-amber-400/30 border border-amber-400 rounded-xs" />
          <span className="text-amber-300 font-semibold">Active Form Input Bounding Box</span>
        </div>
      </div>

      {/* SVG Canvas Schematic */}
      <div className="relative w-full bg-[#041624] rounded-lg border border-[#103e61] p-2 overflow-hidden">
        <svg viewBox="0 0 800 180" className="w-full h-44 select-none">
          <defs>
            {/* Grid pattern for high-tech rail engineering aesthetic */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0e3552" strokeWidth="0.5" />
            </pattern>
            {/* Crosshatch pattern for Mega Shadow Block */}
            <pattern id="diagonalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#D9534F" strokeWidth="1.5" strokeOpacity="0.7" />
            </pattern>
            {/* Glow filters */}
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background grid */}
          <rect width="800" height="180" fill="url(#grid)" />

          {/* Kilometer Milepost Axis Top */}
          <line x1="40" y1="26" x2="760" y2="26" stroke="#255577" strokeWidth="1" />
          {Array.from({ length: 9 }).map((_, i) => {
            const kmVal = minKm + (i * kmSpan) / 8;
            const xPos = 40 + (i * 720) / 8;
            return (
              <g key={i}>
                <line x1={xPos} y1="20" x2={xPos} y2="26" stroke="#328CC1" strokeWidth="1.5" />
                <text
                  x={xPos}
                  y="14"
                  fill="#94A3B8"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  KM {Math.round(kmVal)}
                </text>
              </g>
            );
          })}

          {/* Station Markers (Vertical lines and name tags) */}
          {visibleStations.map((station) => {
            const sX = 40 + (kmToX(station.distanceKm) * 7.2);
            return (
              <g key={station.code} className="opacity-90">
                <line
                  x1={sX}
                  y1="26"
                  x2={sX}
                  y2="155"
                  stroke="#1c557d"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <circle cx={sX} cy="26" r="3" fill="#38BDF8" />
                <rect
                  x={sX - 22}
                  y="30"
                  width="44"
                  height="14"
                  rx="3"
                  fill="#0B3C5D"
                  stroke="#328CC1"
                  strokeWidth="0.8"
                />
                <text
                  x={sX}
                  y="40"
                  fill="#E2E8F0"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {station.code}
                </text>
              </g>
            );
          })}

          {/* Crossover Turnout Lines between UP and DOWN lines */}
          <line x1="220" y1={upTrackY} x2="260" y2={downTrackY} stroke="#1c557d" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="480" y1={downTrackY} x2="520" y2={upTrackY} stroke="#1c557d" strokeWidth="2" strokeDasharray="4 2" />

          {/* UP Line Track Vector (Continuous double line for railway rail representation) */}
          <g>
            <line x1="40" y1={upTrackY - 2} x2="760" y2={upTrackY - 2} stroke="#334155" strokeWidth="1.5" />
            <line x1="40" y1={upTrackY + 2} x2="760" y2={upTrackY + 2} stroke="#334155" strokeWidth="1.5" />
            <line x1="40" y1={upTrackY} x2="760" y2={upTrackY} stroke="#0284C7" strokeWidth="2" />
            <text x="12" y={upTrackY + 4} fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="monospace">
              UP
            </text>
          </g>

          {/* DOWN Line Track Vector */}
          <g>
            <line x1="40" y1={downTrackY - 2} x2="760" y2={downTrackY - 2} stroke="#334155" strokeWidth="1.5" />
            <line x1="40" y1={downTrackY + 2} x2="760" y2={downTrackY + 2} stroke="#334155" strokeWidth="1.5" />
            <line x1="40" y1={downTrackY} x2="760" y2={downTrackY} stroke="#0284C7" strokeWidth="2" />
            <text x="6" y={downTrackY + 4} fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="monospace">
              DOWN
            </text>
          </g>

          {/* Active Mega Shadow Block Zone (Cross-hatched red lockout area) */}
          {activeMegaBlockRange && (
            (() => {
              const mbStartX = 40 + (kmToX(activeMegaBlockRange.startKm) * 7.2);
              const mbEndX = 40 + (kmToX(activeMegaBlockRange.endKm) * 7.2);
              const mbTrackY = activeMegaBlockRange.track === 'UP' ? upTrackY : downTrackY;
              const mbW = Math.max(20, mbEndX - mbStartX);

              return (
                <g filter="url(#glow-red)">
                  {/* Outer glowing border */}
                  <rect
                    x={mbStartX}
                    y={mbTrackY - 18}
                    width={mbW}
                    height="36"
                    rx="4"
                    fill="url(#diagonalHatch)"
                    stroke="#D9534F"
                    strokeWidth="2"
                    fillOpacity="0.4"
                  />
                  {/* Barrier tags */}
                  <rect x={mbStartX - 4} y={mbTrackY - 14} width="8" height="28" fill="#D9534F" rx="2" />
                  <rect x={mbStartX + mbW - 4} y={mbTrackY - 14} width="8" height="28" fill="#D9534F" rx="2" />
                  <text
                    x={mbStartX + mbW / 2}
                    y={mbTrackY - 22}
                    fill="#F87171"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    MEGA BLOCK {activeMegaBlockRange.id} (KM {activeMegaBlockRange.startKm} - {activeMegaBlockRange.endKm})
                  </text>
                </g>
              );
            })()
          )}

          {/* Existing Logged Defect Markers on Track */}
          {existingTickets.map((t) => {
            if (t.startKm < minKm || t.startKm > maxKm) return null;
            const tX = 40 + (kmToX(t.startKm, t.startMeter) * 7.2);
            const tY = t.track === 'UP' ? upTrackY : downTrackY;
            const color = getDeptColor(t.department);
            const isMerged = t.status === 'MERGED';

            return (
              <g
                key={t.id}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => onSelectTicket && onSelectTicket(t)}
                onMouseEnter={() => setHoveredTicket(t)}
                onMouseLeave={() => setHoveredTicket(null)}
              >
                <circle
                  cx={tX}
                  cy={tY}
                  r={isMerged ? 4.5 : 5.5}
                  fill={color}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                {t.urgency === 'EMERGENCY' && (
                  <circle
                    cx={tX}
                    cy={tY}
                    r="8"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    className="animate-spin-slow"
                  />
                )}
              </g>
            );
          })}

          {/* Real-time Glowing Bounding Box representing current form coordinates */}
          {leftX <= 100 && rightX >= 0 && (
            (() => {
              const svgBoxLeft = 40 + (leftX * 7.2);
              const svgBoxWidth = Math.max(16, boxWidth * 7.2);
              const svgBoxY = targetTrackY - 14;

              return (
                <g filter="url(#glow-amber)">
                  {/* Glowing semi-transparent bounding box */}
                  <rect
                    x={svgBoxLeft}
                    y={svgBoxY}
                    width={svgBoxWidth}
                    height="28"
                    rx="4"
                    fill="#F59E0B"
                    fillOpacity="0.28"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                  {/* Start & End pointer reticles */}
                  <line x1={svgBoxLeft} y1={svgBoxY - 4} x2={svgBoxLeft} y2={svgBoxY + 32} stroke="#FBBF24" strokeWidth="2" />
                  <line x1={svgBoxLeft + svgBoxWidth} y1={svgBoxY - 4} x2={svgBoxLeft + svgBoxWidth} y2={svgBoxY + 32} stroke="#FBBF24" strokeWidth="2" />
                  
                  {/* Spatial Verification Tag */}
                  <rect
                    x={svgBoxLeft + svgBoxWidth / 2 - 45}
                    y={targetTrackY === upTrackY ? upTrackY + 18 : downTrackY + 18}
                    width="90"
                    height="16"
                    rx="3"
                    fill="#1E293B"
                    stroke="#F59E0B"
                    strokeWidth="1"
                  />
                  <text
                    x={svgBoxLeft + svgBoxWidth / 2}
                    y={targetTrackY === upTrackY ? upTrackY + 30 : downTrackY + 30}
                    fill="#FDE68A"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    TARGET: KM {inputStartKm}/{startMeter}-{inputEndKm}/{endMeter}
                  </text>
                </g>
              );
            })()
          )}
        </svg>

        {/* Hover inspection tooltip */}
        {hoveredTicket && (
          <div className="absolute bottom-2 left-2 right-2 bg-[#082d46]/95 border border-[#328CC1] p-2 rounded text-xs shadow-xl flex items-center justify-between pointer-events-none backdrop-blur-sm">
            <div>
              <span className="font-bold text-amber-300 font-mono">{hoveredTicket.id}</span>
              <span className="mx-2 text-slate-400">|</span>
              <span className="font-semibold text-white">{hoveredTicket.assetType}</span>
              <span className="mx-2 text-slate-400">|</span>
              <span className="text-sky-300 font-mono">
                {hoveredTicket.track} Line, KM {hoveredTicket.startKm}/{hoveredTicket.startMeter} to {hoveredTicket.endKm}/{hoveredTicket.endMeter}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                hoveredTicket.status === 'MERGED' ? 'bg-sky-900 text-sky-200' : 'bg-amber-900 text-amber-200'
              }`}>
                {hoveredTicket.status === 'MERGED' ? `Merged: ${hoveredTicket.mergedBlockId}` : 'Awaiting Cluster'}
              </span>
              <span className="text-[10px] text-slate-300">
                {hoveredTicket.estimatedHours} hrs • {hoveredTicket.crewRequirement} crew
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Schematic Coordinate Telemetry Strip */}
      <div className="mt-2.5 pt-2 border-t border-[#124d77] flex flex-wrap items-center justify-between text-[11px] text-slate-300 gap-2">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-400">Selected Range:</span>
          <span className="bg-[#0B3C5D] px-2 py-0.5 rounded text-amber-300 font-bold border border-[#328CC1]/40">
            {currentTrack} LINE: KM {inputStartKm}.{String(startMeter).padStart(3, '0')} to KM {inputEndKm}.{String(endMeter).padStart(3, '0')}
          </span>
          <span className="text-slate-400 text-[10px]">
            (Span: {Math.max(10, Math.abs((endKm * 1000 + endMeter) - (startKm * 1000 + startMeter)))}m)
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Section Geometry Validated • Interlocking Route Clear</span>
        </div>
      </div>
    </div>
  );
};
