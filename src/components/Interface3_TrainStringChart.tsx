import React, { useState } from 'react';
import { 
  TrainSchedule, 
  CapacityConflictAlert, 
  MegaShadowBlock 
} from '../types';
import { CORRIDOR_STATIONS } from '../mockData';
import { railwayAudio } from '../utils/audio';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  RotateCcw, 
  Sliders, 
  Zap, 
  Activity, 
  Sparkles,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

interface Interface3Props {
  trainSchedules: TrainSchedule[];
  conflictAlerts: CapacityConflictAlert[];
  activeMegaBlock: MegaShadowBlock;
  onOverrideTrain: (alertId: string, trainNumber: string) => void;
}

export const Interface3_TrainStringChart: React.FC<Interface3Props> = ({
  trainSchedules,
  conflictAlerts,
  activeMegaBlock,
  onOverrideTrain
}) => {
  // Time Window presets:
  // Base reference: 06:00 AM = Minute 0.
  // 10:00 AM = Minute 240. 16:00 PM = Minute 600.
  const [timeZoom, setTimeZoom] = useState<'BLOCK_WINDOW' | 'FULL_DAY'>('BLOCK_WINDOW');
  const [hoveredTrain, setHoveredTrain] = useState<TrainSchedule | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<TrainSchedule | null>(null);
  const [showUnoptimizedBaseline, setShowUnoptimizedBaseline] = useState<boolean>(false);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  // Time window bounds in minutes from 06:00 AM
  const minTimeMin = timeZoom === 'BLOCK_WINDOW' ? 240 : 0; // 10:00 AM vs 06:00 AM
  const maxTimeMin = timeZoom === 'BLOCK_WINDOW' ? 570 : 720; // 15:30 PM vs 18:00 PM
  const totalTimeSpan = maxTimeMin - minTimeMin;

  // Station mapping on Y-Axis
  const chartHeight = 520;
  const chartWidth = 900;
  const paddingLeft = 110;
  const paddingRight = 40;
  const paddingTop = 40;
  const paddingBottom = 40;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  const totalDistanceKm = 160; // NDLS (0) to TDL (160)

  const kmToY = (km: number) => {
    return paddingTop + (km / totalDistanceKm) * plotHeight;
  };

  const timeToX = (timeMin: number) => {
    const clamped = Math.max(minTimeMin, Math.min(maxTimeMin, timeMin));
    return paddingLeft + ((clamped - minTimeMin) / totalTimeSpan) * plotWidth;
  };

  // Convert minutes from 06:00 to HH:MM format
  const formatMinToTime = (min: number) => {
    const totalMinutes = 6 * 60 + min;
    const hrs = Math.floor(totalMinutes / 60) % 24;
    const mins = totalMinutes % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  // Convert "11:15" string to minutes from 06:00
  const timeStringToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h - 6) * 60 + m;
  };

  const blockStartMin = timeStringToMinutes(activeMegaBlock.scheduledStartTime);
  const blockEndMin = timeStringToMinutes(activeMegaBlock.scheduledEndTime);
  const blockLeftX = timeToX(blockStartMin);
  const blockRightX = timeToX(blockEndMin);
  const blockTopY = kmToY(activeMegaBlock.startKm);
  const blockBottomY = kmToY(Math.min(160, activeMegaBlock.endKm + 4));

  const handleForceReprioritize = (alertId: string, trainNum: string) => {
    railwayAudio.playInterlockingLock();
    setIsRecalculating(true);
    onOverrideTrain(alertId, trainNum);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 500);
  };

  const getTrainStrokeColor = (t: TrainSchedule) => {
    switch (t.priority) {
      case 'PREMIUM_VANDE_BHARAT':
        return '#06B6D4'; // Cyan-500
      case 'RAJDHANI_EXPRESS':
        return '#F59E0B'; // Amber-500
      case 'SUPERFAST':
        return '#8B5CF6'; // Violet-500
      case 'FREIGHT_BOXN':
        return '#10B981'; // Emerald-500
      case 'MAIL_EXPRESS':
        return '#EC4899'; // Pink-500
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Viewport Purpose Banner */}
      <div className="bg-white border-l-4 border-[#0B3C5D] p-4 rounded-r-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              INTERACTIVE DYNAMIC TIMETABLE VISUALIZER (TRAIN STRING CHART)
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0B3C5D] text-white">
              TENF ROUTER
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Tactical outputs of Time-Expanded Network Flow (TENF) Capacity Router: High-priority trains remain unbroken while freight consists are interleaved on station loop lines.
          </p>
        </div>

        {/* Action Controls & Zoom Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setTimeZoom('BLOCK_WINDOW')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
              timeZoom === 'BLOCK_WINDOW'
                ? 'bg-[#0B3C5D] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Block Horizon (10:00 - 15:30)
          </button>
          <button
            onClick={() => setTimeZoom('FULL_DAY')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
              timeZoom === 'FULL_DAY'
                ? 'bg-[#0B3C5D] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Full 12-Hr Shift (06:00 - 18:00)
          </button>

          <button
            onClick={() => setShowUnoptimizedBaseline(!showUnoptimizedBaseline)}
            className={`px-3 py-1.5 rounded text-xs font-bold border transition-all ${
              showUnoptimizedBaseline
                ? 'bg-red-50 text-red-700 border-red-300 shadow-inner'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {showUnoptimizedBaseline ? 'Hide Unoptimized Baseline' : 'Compare Baseline Conflicts'}
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE: LEFT STRING CHART CANVAS & RIGHT CONFLICT FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Master String Chart Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-[#041624] rounded-xl border border-[#103e61] p-4 text-white shadow-lg relative overflow-hidden">
          {/* Chart Header & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#124d77] gap-2 mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-100">
                Cartesian Time-Space Trajectory Grid
              </span>
              <span className="text-[10px] bg-slate-800 text-sky-300 px-1.5 py-0.5 rounded font-mono">
                1-MINUTE RESOLUTION
              </span>
            </div>

            {/* Train Type Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-300">
              <div className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#06B6D4]" />
                <span>Vande Bharat (Unbroken)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#F59E0B]" />
                <span>Rajdhani (Priority)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#10B981] border-b border-dashed border-white" />
                <span>Freight / MEMU (Loop Held)</span>
              </div>
            </div>
          </div>

          {/* SVG Canvas for Train String Chart */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-[520px] select-none"
            >
              <defs>
                {/* Cross-hatch red lockout pattern */}
                <pattern
                  id="lockoutPattern"
                  width="12"
                  height="12"
                  patternTransform="rotate(45 0 0)"
                  patternUnits="userSpaceOnUse"
                >
                  <line x1="0" y1="0" x2="0" y2="12" stroke="#EF4444" strokeWidth="2.5" strokeOpacity="0.85" />
                </pattern>
                {/* Soft background grid pattern */}
                <pattern id="timeGrid" width="60" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 40" fill="none" stroke="#0e3552" strokeWidth="0.5" />
                </pattern>
              </defs>

              {/* Background Grid */}
              <rect x={paddingLeft} y={paddingTop} width={plotWidth} height={plotHeight} fill="url(#timeGrid)" />

              {/* Time Scale Axis (Horizontal Lines & Hour Labels at Top and Bottom) */}
              {Array.from({ length: Math.floor(totalTimeSpan / 60) + 1 }).map((_, i) => {
                const currentMin = minTimeMin + i * 60;
                const xPos = timeToX(currentMin);
                const timeLabel = formatMinToTime(currentMin);

                return (
                  <g key={`time-${i}`}>
                    <line
                      x1={xPos}
                      y1={paddingTop}
                      x2={xPos}
                      y2={paddingTop + plotHeight}
                      stroke="#1e4e70"
                      strokeWidth="1"
                      strokeDasharray={i % 2 === 0 ? undefined : '2 2'}
                    />
                    <text
                      x={xPos}
                      y={paddingTop - 10}
                      fill="#94A3B8"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {timeLabel}
                    </text>
                    <text
                      x={xPos}
                      y={paddingTop + plotHeight + 16}
                      fill="#64748B"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {timeLabel}
                    </text>
                  </g>
                );
              })}

              {/* Station Rows on Y-Axis (Horizontal lines across the chart) */}
              {CORRIDOR_STATIONS.map((station) => {
                const yPos = kmToY(station.distanceKm);

                return (
                  <g key={`station-${station.code}`}>
                    <line
                      x1={paddingLeft}
                      y1={yPos}
                      x2={paddingLeft + plotWidth}
                      y2={yPos}
                      stroke="#154263"
                      strokeWidth="0.8"
                    />
                    <text
                      x={paddingLeft - 10}
                      y={yPos + 3}
                      fill="#CBD5E1"
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="end"
                    >
                      {station.code} ({station.distanceKm}k)
                    </text>
                  </g>
                );
              })}

              {/* ACTIVE MAINTENANCE RESTRICTION ZONE (Cross-hatched high-contrast red rectangle) */}
              {blockLeftX < paddingLeft + plotWidth && blockRightX > paddingLeft && (
                <g>
                  {/* Lockout Box */}
                  <rect
                    x={Math.max(paddingLeft, blockLeftX)}
                    y={blockTopY}
                    width={Math.min(paddingLeft + plotWidth, blockRightX) - Math.max(paddingLeft, blockLeftX)}
                    height={Math.max(20, blockBottomY - blockTopY)}
                    fill="url(#lockoutPattern)"
                    stroke="#EF4444"
                    strokeWidth="2"
                    fillOpacity="0.55"
                  />
                  {/* Warning Header on Lockout Box */}
                  <rect
                    x={Math.max(paddingLeft, blockLeftX) + 4}
                    y={blockTopY + 4}
                    width="260"
                    height="18"
                    rx="3"
                    fill="#7F1D1D"
                    stroke="#EF4444"
                    strokeWidth="1"
                  />
                  <text
                    x={Math.max(paddingLeft, blockLeftX) + 10}
                    y={blockTopY + 16}
                    fill="#FEE2E2"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    RESTRICTION: {activeMegaBlock.id} (UP LINE CLOSED)
                  </text>
                </g>
              )}

              {/* Unoptimized Baseline Collision Trajectory Ghost (Optional comparison mode) */}
              {showUnoptimizedBaseline && (
                <g opacity="0.6">
                  {/* Freight would have collided directly into the work team at 12:15 */}
                  <line
                    x1={timeToX(220)}
                    y1={kmToY(0)}
                    x2={timeToX(380)}
                    y2={kmToY(160)}
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <circle cx={timeToX(330)} cy={kmToY(142)} r="8" fill="#EF4444" opacity="0.8" />
                  <text
                    x={timeToX(330) + 12}
                    y={kmToY(142)}
                    fill="#FCA5A5"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    CRITICAL COLLISION RISK (Uncontrolled Freight vs Crew)
                  </text>
                </g>
              )}

              {/* TRAIN TRAJECTORY STRINGS */}
              {trainSchedules.map((train) => {
                const strokeColor = getTrainStrokeColor(train);
                const isSelected = selectedTrain?.trainNumber === train.trainNumber;
                const isHovered = hoveredTrain?.trainNumber === train.trainNumber;

                // Build path points through stations
                const pathCommands: string[] = [];

                train.stops.forEach((stop, index) => {
                  const station = CORRIDOR_STATIONS.find((s) => s.code === stop.stationCode);
                  if (!station) return;
                  const y = kmToY(station.distanceKm);

                  // Arrival point
                  const arrX = timeToX(stop.optimizedArrivalMin);
                  // Departure point
                  const depX = timeToX(stop.optimizedDepartureMin);

                  if (index === 0) {
                    pathCommands.push(`M ${depX} ${y}`);
                  } else {
                    // Travel to station arrival
                    pathCommands.push(`L ${arrX} ${y}`);
                    // If held on loop or dwelling, flatline to departure!
                    if (depX > arrX) {
                      pathCommands.push(`L ${depX} ${y}`);
                    }
                  }
                });

                const pathData = pathCommands.join(' ');
                const isHeld = train.status === 'INTERLEAVED_LOOP_HOLD';

                return (
                  <g
                    key={train.trainNumber}
                    className="cursor-pointer transition-opacity"
                    onClick={() => {
                      railwayAudio.playClick();
                      setSelectedTrain(train);
                    }}
                    onMouseEnter={() => setHoveredTrain(train)}
                    onMouseLeave={() => setHoveredTrain(null)}
                  >
                    {/* Train trajectory line */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isSelected || isHovered ? '4' : isHeld ? '2.5' : '2.8'}
                      strokeDasharray={isHeld ? '6 3' : undefined}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-200"
                    />

                    {/* Loop Line Hold Horizontal Flatline Highlight Indicator */}
                    {train.stops.map((stop) => {
                      if (!stop.isHeldOnLoop) return null;
                      const station = CORRIDOR_STATIONS.find((s) => s.code === stop.stationCode);
                      if (!station) return null;
                      const y = kmToY(station.distanceKm);
                      const arrX = timeToX(stop.optimizedArrivalMin);
                      const depX = timeToX(stop.optimizedDepartureMin);

                      return (
                        <g key={`hold-${train.trainNumber}-${stop.stationCode}`}>
                          {/* Pulsing horizontal loop dwell bar */}
                          <rect
                            x={arrX}
                            y={y - 5}
                            width={Math.max(14, depX - arrX)}
                            height="10"
                            rx="2"
                            fill="#10B981"
                            fillOpacity="0.4"
                            stroke="#10B981"
                            strokeWidth="1.5"
                          />
                          <text
                            x={arrX + (depX - arrX) / 2}
                            y={y - 8}
                            fill="#6EE7B7"
                            fontSize="8"
                            fontFamily="monospace"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            LOOP DWELL ({stop.holdDurationMin}m)
                          </text>
                        </g>
                      );
                    })}

                    {/* Train Label marker at mid-trajectory */}
                    {train.stops.length > 1 && (
                      (() => {
                        const midStop = train.stops[Math.floor(train.stops.length / 2)];
                        const station = CORRIDOR_STATIONS.find((s) => s.code === midStop.stationCode);
                        if (!station) return null;
                        const labelX = timeToX(midStop.optimizedArrivalMin);
                        const labelY = kmToY(station.distanceKm);

                        return (
                          <g>
                            <circle cx={labelX} cy={labelY} r="3.5" fill={strokeColor} stroke="#FFFFFF" strokeWidth="1" />
                            <text
                              x={labelX + 6}
                              y={labelY - 4}
                              fill="#FFFFFF"
                              fontSize="8"
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              {train.trainNumber}
                            </text>
                          </g>
                        );
                      })()
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Hover / Selected Train Telemetry Box */}
          {(hoveredTrain || selectedTrain) && (
            (() => {
              const current = hoveredTrain || selectedTrain;
              if (!current) return null;

              return (
                <div className="mt-3 p-3 bg-[#082d46] rounded-lg border border-[#328CC1] text-xs flex flex-wrap items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-amber-300 text-sm">
                      Train #{current.trainNumber}
                    </span>
                    <span className="font-semibold text-white">{current.trainName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0B3C5D] text-sky-300 border border-[#328CC1]">
                      {current.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-400">Direction:</span>{' '}
                      <span className="text-white font-bold">{current.direction} LINE</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Section Speed:</span>{' '}
                      <span className="text-emerald-400 font-bold">{current.speedLimitKmph} km/h</span>
                    </div>
                    <div>
                      <span className="text-slate-400">TENF Delay:</span>{' '}
                      <span className={current.totalDelayMin > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {current.totalDelayMin > 0 ? `+${current.totalDelayMin} min` : '0 min (On Time)'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>

        {/* RIGHT CONFLICT & MANUAL OVERRIDE CONTROL RAIL (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#0B3C5D] text-white rounded">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                    Conflict Resolution Control Rail
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Time-Expanded Network Flow Dispatcher
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                {conflictAlerts.filter((a) => !a.overridden).length} Active Interleaves
              </span>
            </div>

            {/* Scrolling Vertical Feed */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 text-xs">
              {conflictAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border transition-all ${
                    alert.overridden
                      ? 'bg-slate-50 border-slate-200 opacity-75'
                      : 'bg-amber-50/70 border-amber-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-[#0B3C5D] text-[11px]">
                      {alert.id} • {alert.timestamp} IST
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                      alert.overridden
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {alert.overridden ? 'Manual Override Applied' : `Delay: +${alert.delayMin}m`}
                    </span>
                  </div>

                  <div className="font-bold text-slate-900 mb-1">
                    Train #{alert.trainNumber} - {alert.trainName}
                  </div>

                  <div className="text-[11px] text-slate-600 font-mono mb-1.5">
                    Location: {alert.location}
                  </div>

                  <p className="text-[11px] text-slate-700 leading-relaxed bg-white/80 p-2 rounded border border-slate-200 mb-2.5">
                    {alert.actionTaken}
                  </p>

                  {/* Manual Override Push-Button */}
                  <button
                    onClick={() => handleForceReprioritize(alert.id, alert.trainNumber)}
                    disabled={isRecalculating}
                    className={`w-full py-1.5 px-3 rounded text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      alert.overridden
                        ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                        : 'bg-[#0B3C5D] hover:bg-[#082d46] text-white shadow-xs'
                    }`}
                  >
                    <RotateCcw className={`w-3 h-3 ${isRecalculating ? 'animate-spin' : ''}`} />
                    {alert.overridden ? 'Re-apply Automatic Interleaving' : 'Force Re-Prioritize Train'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Router Engine Metrics Footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-600">
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-500">Mathematical Model:</span>
              <span className="text-[#0B3C5D] font-bold">Integer Linear Program (ILP)</span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-500">Solve Time:</span>
              <span className="text-emerald-700 font-bold">42ms (Gurobi-equivalent)</span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-500">Punctuality Retention:</span>
              <span className="text-emerald-700 font-bold">98.2% across Delhi Trunk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
