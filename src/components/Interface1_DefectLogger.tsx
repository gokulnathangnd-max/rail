import React, { useState } from 'react';
import { 
  MaintenanceTicket, 
  Department, 
  TrackIdentifier, 
  UrgencyLevel, 
  CorridorMetrics, 
  MegaShadowBlock 
} from '../types';
import { 
  DEPARTMENTS, 
  ASSETS_BY_DEPARTMENT, 
  DIVISIONS, 
  SECTIONS 
} from '../mockData';
import { TrackSchematic } from './TrackSchematic';
import { railwayAudio } from '../utils/audio';
import { 
  PlusCircle, 
  Filter, 
  Search, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Layers, 
  HardHat, 
  Radio, 
  Wrench, 
  Zap, 
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface Interface1Props {
  tickets: MaintenanceTicket[];
  metrics: CorridorMetrics;
  megaBlocks: MegaShadowBlock[];
  onAddTicket: (ticket: MaintenanceTicket) => void;
  onSelectMegaBlock?: (blockId: string) => void;
}

export const Interface1_DefectLogger: React.FC<Interface1Props> = ({
  tickets,
  metrics,
  megaBlocks,
  onAddTicket,
  onSelectMegaBlock
}) => {
  // Form State
  const [selectedDept, setSelectedDept] = useState<Department>('CIVIL');
  const [selectedAsset, setSelectedAsset] = useState<string>(ASSETS_BY_DEPARTMENT.CIVIL[0]);
  const [division, setDivision] = useState<string>('NDLS');
  const [section, setSection] = useState<string>(SECTIONS[1].name);
  const [track, setTrack] = useState<TrackIdentifier>('UP');
  const [startKm, setStartKm] = useState<number>(142);
  const [endKm, setEndKm] = useState<number>(143);
  const [startMeter, setStartMeter] = useState<number>(100);
  const [endMeter, setEndMeter] = useState<number>(450);
  const [urgency, setUrgency] = useState<UrgencyLevel>('URGENT');
  const [estimatedHours, setEstimatedHours] = useState<number>(2.5);
  const [crewRequirement, setCrewRequirement] = useState<number>(8);
  const [notes, setNotes] = useState<string>('');

  // Table Filters & Pagination
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Feedback Notification
  const [notification, setNotification] = useState<string | null>(null);

  const handleDeptChange = (dept: Department) => {
    railwayAudio.playClick();
    setSelectedDept(dept);
    setSelectedAsset(ASSETS_BY_DEPARTMENT[dept][0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    railwayAudio.playInterlockingLock();

    const newTicketId = `TKT-NR-2026-${Math.floor(4110 + Math.random() * 890)}`;
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

    // Auto-cluster detection rule: if coordinates are in KM 141-145 on UP line, can merge into MSB-2026-089
    const isWithinPrimaryCluster = track === 'UP' && startKm >= 141 && endKm <= 145;
    const mergedBlockId = isWithinPrimaryCluster ? 'MSB-2026-089' : undefined;

    const newTicket: MaintenanceTicket = {
      id: newTicketId,
      timestamp,
      department: selectedDept,
      assetType: selectedAsset,
      division,
      section,
      track,
      startKm: Number(startKm),
      endKm: Number(endKm),
      startMeter: Number(startMeter),
      endMeter: Number(endMeter),
      urgency,
      status: mergedBlockId ? 'MERGED' : 'AWAITING_CLUSTER',
      mergedBlockId,
      estimatedHours: Number(estimatedHours),
      crewRequirement: Number(crewRequirement),
      machinery: selectedDept === 'CIVIL' ? ['Tamping Unit'] : selectedDept === 'ST' ? ['Point Testing Bench'] : ['OHE Tower Car'],
      notes: notes.trim() || `Field defect registered by ${selectedDept} inspection team.`
    };

    onAddTicket(newTicket);
    setNotification(`Successfully registered defect #${newTicket.id} on ${track} Line (KM ${startKm}/${startMeter} to ${endKm}/${endMeter}).`);
    setTimeout(() => setNotification(null), 5000);
  };

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = 
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.assetType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.notes && ticket.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = deptFilter === 'ALL' || ticket.department === deptFilter;
    const matchesUrgency = urgencyFilter === 'ALL' || ticket.urgency === urgencyFilter;
    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
    return matchesSearch && matchesDept && matchesUrgency && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getUrgencyBadge = (u: UrgencyLevel) => {
    switch (u) {
      case 'EMERGENCY':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
            Emergency - Speed Restriction Active
          </span>
        );
      case 'URGENT':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-300 w-fit">
            High - Urgent
          </span>
        );
      case 'PLANNED':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800 border border-amber-300 w-fit">
            Medium - Planned
          </span>
        );
      case 'ROUTINE':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-300 w-fit">
            Low - Routine
          </span>
        );
    }
  };

  const getDeptPill = (dept: Department) => {
    switch (dept) {
      case 'CIVIL':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">Civil (P-Way)</span>;
      case 'ST':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">S&T Systems</span>;
      case 'ELECTRICAL':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-300">Electrical (OHE)</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Viewport Purpose Banner */}
      <div className="bg-white border-l-4 border-[#0B3C5D] p-4 rounded-r-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              MULTI-DEPARTMENTAL MAINTENANCE INPUT & DEFECT REGISTRY
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0B3C5D] text-white">
              LINEAR TRACK LOG
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Precision spatial coordinate ingestion for Permanent Way (Civil), Signal & Telecom (S&T), and 25kV Traction Electrical departments.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
          <span>Active Grid: 130 km/h WAC Corridor</span>
          <span>•</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Spatio-Temporal Ingestion Active
          </span>
        </div>
      </div>

      {/* TOP GLOBAL METRICS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Pending Tickets */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Total Pending Tickets Across Division</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-2 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {metrics.pendingTicketsTotal}
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              4 Civil • 3 S&T • 2 OHE
            </span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>Critical Speed Restrictions: 1 Active</span>
            <span className="font-mono text-slate-700">DLI Division (NR)</span>
          </div>
        </div>

        {/* Metric 2: Active Mega Maintenance Windows */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Active Mega Maintenance Windows Today</span>
            <Layers className="w-4 h-4 text-sky-600" />
          </div>
          <div className="my-2 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-[#0B3C5D] font-mono">
              {metrics.activeMegaBlocksToday}
            </span>
            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              MSB-2026-089 (Primary)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>Spatio-Temporal Overlap Rate: 78.4%</span>
            <span className="font-mono text-emerald-600 font-semibold">142 Punctuality Min Saved</span>
          </div>
        </div>

        {/* Metric 3: Line Capacity Optimization Score */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Line Capacity Optimization Score (%)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-600 font-mono">
                {metrics.capacityOptimizationScore}%
              </span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                <ArrowUpRight className="w-3.5 h-3.5" /> +6.4%
              </span>
            </div>
            {/* Small sparkline graphic representation */}
            <div className="flex items-end gap-1 h-8 px-2 py-1 bg-slate-50 rounded border border-slate-100">
              <div className="w-1.5 bg-slate-300 h-3 rounded-xs" />
              <div className="w-1.5 bg-slate-300 h-4 rounded-xs" />
              <div className="w-1.5 bg-emerald-400 h-5 rounded-xs" />
              <div className="w-1.5 bg-emerald-500 h-6 rounded-xs" />
              <div className="w-1.5 bg-emerald-600 h-7 rounded-xs" />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>Graph-DBSCAN Cluster Target: 90%+</span>
            <span className="font-mono text-slate-700">Time-Expanded Routing Active</span>
          </div>
        </div>
      </div>

      {/* Notification banner on submit */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{notification}</span>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* MAIN SPLIT VIEW: LEFT FORM & RIGHT INTERACTIVE TOPOLOGY PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left-Hand Form Component (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#0B3C5D] text-white rounded">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                  Track Defect Ingestion Form
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                FORM IR-ENG-2026
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Department Toggle Group */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Engineering Department Toggle
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
                  {DEPARTMENTS.map((dept) => {
                    const isSelected = selectedDept === dept.id;
                    const Icon = dept.id === 'CIVIL' ? HardHat : dept.id === 'ST' ? Radio : Zap;
                    return (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => handleDeptChange(dept.id as Department)}
                        className={`flex flex-col items-center justify-center p-2 rounded text-center transition-all ${
                          isSelected
                            ? 'bg-[#0B3C5D] text-white font-bold shadow-sm'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                        <span className="text-[10px] leading-tight">{dept.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Asset Type Selection (Dynamic Searchable Dropdown) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Asset Component Classification
                </label>
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#0B3C5D] focus:border-[#0B3C5D] font-medium"
                >
                  {ASSETS_BY_DEPARTMENT[selectedDept].map((asset) => (
                    <option key={asset} value={asset}>
                      {asset}
                    </option>
                  ))}
                </select>
              </div>

              {/* Linear Coordinate Sub-Form */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#0B3C5D] uppercase border-b border-slate-200 pb-1.5">
                  <span>Linear Spatial Coordinates</span>
                  <span className="text-[10px] font-mono text-slate-500">1-Meter Resolution</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">Division</label>
                    <select
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-semibold"
                    >
                      {DIVISIONS.map((div) => (
                        <option key={div.id} value={div.id}>
                          {div.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">Section</label>
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs truncate font-semibold"
                    >
                      {SECTIONS.map((sec) => (
                        <option key={sec.id} value={sec.name}>
                          {sec.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Track Identifier Toggle: Segmented switch */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Track Alignment Identifier
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-white rounded border border-slate-300">
                    <button
                      type="button"
                      onClick={() => {
                        railwayAudio.playClick();
                        setTrack('UP');
                      }}
                      className={`py-1.5 rounded font-bold text-xs transition-colors ${
                        track === 'UP'
                          ? 'bg-[#0B3C5D] text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      UP Line (Odd Direction)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        railwayAudio.playClick();
                        setTrack('DOWN');
                      }}
                      className={`py-1.5 rounded font-bold text-xs transition-colors ${
                        track === 'DOWN'
                          ? 'bg-[#0B3C5D] text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      DOWN Line (Even Direction)
                    </button>
                  </div>
                </div>

                {/* Kilometers and Meters Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase">
                      Start Coordinates
                    </label>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1">
                        <span className="text-[9px] text-slate-500 font-mono">Start KM</span>
                        <input
                          type="number"
                          min="0"
                          max="500"
                          value={startKm}
                          onChange={(e) => setStartKm(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono font-bold text-slate-900"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-[9px] text-slate-500 font-mono">Start Meter</span>
                        <input
                          type="number"
                          min="0"
                          max="999"
                          step="10"
                          value={startMeter}
                          onChange={(e) => setStartMeter(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase">
                      End Coordinates
                    </label>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1">
                        <span className="text-[9px] text-slate-500 font-mono">End KM</span>
                        <input
                          type="number"
                          min="0"
                          max="500"
                          value={endKm}
                          onChange={(e) => setEndKm(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono font-bold text-slate-900"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-[9px] text-slate-500 font-mono">End Meter</span>
                        <input
                          type="number"
                          min="0"
                          max="999"
                          step="10"
                          value={endMeter}
                          onChange={(e) => setEndMeter(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Urgency Multiplier: Horizontal radio button group with stylized color pills */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Urgency Multiplier & Operational Hazard
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ROUTINE', label: 'Low - Routine', color: 'peer-checked:bg-emerald-600 peer-checked:text-white', border: 'border-emerald-300' },
                    { id: 'PLANNED', label: 'Medium - Planned', color: 'peer-checked:bg-amber-500 peer-checked:text-slate-950', border: 'border-amber-300' },
                    { id: 'URGENT', label: 'High - Urgent', color: 'peer-checked:bg-orange-500 peer-checked:text-white', border: 'border-orange-300' },
                    { id: 'EMERGENCY', label: 'Emergency - Speed Restriction Active', color: 'peer-checked:bg-red-600 peer-checked:text-white', border: 'border-red-300' }
                  ].map((level) => (
                    <label key={level.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="urgency"
                        value={level.id}
                        checked={urgency === level.id}
                        onChange={() => setUrgency(level.id as UrgencyLevel)}
                        className="sr-only peer"
                      />
                      <div className={`p-2 rounded border ${level.border} text-center text-[10px] font-bold transition-all bg-white text-slate-700 ${level.color} peer-checked:shadow-sm`}>
                        {level.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration & Crew Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Estimated Time (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="12"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 font-mono text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Required Field Crew
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="50"
                    value={crewRequirement}
                    onChange={(e) => setCrewRequirement(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 font-mono text-slate-800 font-bold"
                  />
                </div>
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#0B3C5D] hover:bg-[#082d46] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md border-b-2 border-[#D9534F] active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Log Defect & Run Linear Spatio-Temporal Sweep
              </button>
            </form>
          </div>
        </div>

        {/* Right-Hand Interactive Track Topology Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <TrackSchematic
            currentTrack={track}
            startKm={startKm}
            endKm={endKm}
            startMeter={startMeter}
            endMeter={endMeter}
            department={selectedDept}
            existingTickets={tickets}
            activeMegaBlockRange={{
              startKm: megaBlocks[0]?.startKm || 142.0,
              endKm: megaBlocks[0]?.endKm || 144.95,
              track: megaBlocks[0]?.track || 'UP',
              id: megaBlocks[0]?.id || 'MSB-2026-089'
            }}
          />

          {/* Real-time Spatio-Temporal Ingestion Insights */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-700 font-bold border-b border-slate-100 pb-2">
              <span className="flex items-center gap-1.5 text-[#0B3C5D]">
                <Radio className="w-4 h-4 text-sky-600" />
                DBSCAN Graph Proximity Assessment
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Spatial Radius Threshold: ε = 3.2 KM
              </span>
            </div>

            <p className="text-slate-600 leading-relaxed text-[11px]">
              {track === 'UP' && startKm >= 141 && endKm <= 145 ? (
                <span className="text-emerald-700 font-medium">
                  <strong>PROXIMITY HIT:</strong> Entered coordinates fall within the spatial envelope of active Mega Shadow Block{' '}
                  <button
                    onClick={() => onSelectMegaBlock && onSelectMegaBlock('MSB-2026-089')}
                    className="underline font-bold text-[#0B3C5D] hover:text-[#328CC1]"
                  >
                    MSB-2026-089
                  </button>{' '}
                  (KM 142.00 to 144.95). Upon submission, this defect will be automatically paired into the 11:15–14:45 single-line isolation window with zero incremental train delay!
                </span>
              ) : (
                <span className="text-slate-600">
                  Entered coordinates reside outside the active Mega Block window. Defect will be registered in status{' '}
                  <span className="font-mono font-bold text-amber-700">[Awaiting Cluster Pairing]</span> until the next hourly Graph-DBSCAN optimization sweep.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM HISTORICAL TICKET REGISTRY TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              HISTORICAL DEFECT & MAINTENANCE TICKET REGISTRY
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                {filteredTickets.length} Records
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Audit-compliant linear kilometrage registry integrated with Track Management System (TMS).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ticket ID or asset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 w-48 focus:w-64 transition-all focus:outline-none focus:ring-2 focus:ring-[#0B3C5D]"
              />
            </div>

            {/* Department Filter */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-700"
            >
              <option value="ALL">All Departments</option>
              <option value="CIVIL">Civil (P-Way)</option>
              <option value="ST">Signal & Telecom</option>
              <option value="ELECTRICAL">Electrical (OHE)</option>
            </select>

            {/* Urgency Filter */}
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-700"
            >
              <option value="ALL">All Urgencies</option>
              <option value="EMERGENCY">Emergency Only</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium</option>
              <option value="ROUTINE">Routine</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="MERGED">Merged into Mega Block</option>
              <option value="AWAITING_CLUSTER">Awaiting Cluster</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-2.5 px-3">Ticket ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Asset Classification</th>
                <th className="py-2.5 px-3">Track</th>
                <th className="py-2.5 px-3">Linear Range</th>
                <th className="py-2.5 px-3">Urgency Status</th>
                <th className="py-2.5 px-3">Algorithmic Status Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {paginatedTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#0B3C5D]">
                    {t.id}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {t.timestamp}
                  </td>
                  <td className="py-2.5 px-3">
                    {getDeptPill(t.department)}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900 max-w-xs truncate">
                    {t.assetType}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {t.track}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-800 font-semibold whitespace-nowrap">
                    KM {t.startKm}/{String(t.startMeter).padStart(2, '0')} to {t.endKm}/{String(t.endMeter).padStart(2, '0')}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {getUrgencyBadge(t.urgency)}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {t.status === 'MERGED' ? (
                      <button
                        onClick={() => onSelectMegaBlock && onSelectMegaBlock(t.mergedBlockId || 'MSB-2026-089')}
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-300 hover:bg-sky-200 transition-colors flex items-center gap-1"
                      >
                        <Layers className="w-3 h-3 text-sky-600" />
                        Merged into #{t.mergedBlockId}
                      </button>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-50 text-amber-800 border border-amber-300">
                        Awaiting Cluster Pairing
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {paginatedTickets.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                    No maintenance tickets matching current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTickets.length)} of {filteredTickets.length} entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-medium text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
