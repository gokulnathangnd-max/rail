import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Interface1_DefectLogger } from './components/Interface1_DefectLogger';
import { Interface2_ShadowBlockOptimizer } from './components/Interface2_ShadowBlockOptimizer';
import { Interface3_TrainStringChart } from './components/Interface3_TrainStringChart';
import { 
  INITIAL_TICKETS, 
  INITIAL_MEGA_BLOCK, 
  INITIAL_SECONDARY_BLOCK, 
  INITIAL_TRAIN_SCHEDULES, 
  INITIAL_CONFLICT_ALERTS, 
  INITIAL_METRICS 
} from './mockData';
import { 
  MaintenanceTicket, 
  MegaShadowBlock, 
  TrainSchedule, 
  CapacityConflictAlert, 
  CorridorMetrics 
} from './types';
import { railwayAudio } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('INPUT_LOG');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedDivision, setSelectedDivision] = useState<string>('NDLS');

  // Application Data States
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(INITIAL_TICKETS);
  const [megaBlocks, setMegaBlocks] = useState<MegaShadowBlock[]>([
    INITIAL_MEGA_BLOCK,
    INITIAL_SECONDARY_BLOCK
  ]);
  const [trainSchedules, setTrainSchedules] = useState<TrainSchedule[]>(INITIAL_TRAIN_SCHEDULES);
  const [conflictAlerts, setConflictAlerts] = useState<CapacityConflictAlert[]>(INITIAL_CONFLICT_ALERTS);
  const [metrics, setMetrics] = useState<CorridorMetrics>(INITIAL_METRICS);

  // Active Primary Mega Block
  const primaryBlock = megaBlocks[0];

  // Handler: Add defect ticket
  const handleAddTicket = (newTicket: MaintenanceTicket) => {
    setTickets((prev) => [newTicket, ...prev]);

    // If ticket is merged into primary block
    if (newTicket.mergedBlockId === primaryBlock.id) {
      setMegaBlocks((prev) =>
        prev.map((b) =>
          b.id === primaryBlock.id
            ? { ...b, ticketIds: [...b.ticketIds, newTicket.id] }
            : b
        )
      );
    }

    // Update global metrics
    setMetrics((prev) => ({
      ...prev,
      pendingTicketsTotal: prev.pendingTicketsTotal + 1,
      capacityOptimizationScore: Math.min(99.4, +(prev.capacityOptimizationScore + 0.3).toFixed(1))
    }));
  };

  // Handler: Approve block from Optimizer Dashboard
  const handleApproveBlock = (blockId: string) => {
    setMegaBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? {
              ...b,
              status: 'APPROVED',
              approvedAt: new Date().toISOString()
            }
          : b
      )
    );
    railwayAudio.playAlert();
  };

  // Handler: Force Re-prioritize Train in String Chart
  const handleOverrideTrain = (alertId: string, trainNumber: string) => {
    setConflictAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              overridden: !a.overridden,
              actionTaken: a.overridden
                ? 'Dynamic headway hold reinstated on loop line'
                : 'MANUAL OVERRIDE: Priority slot forced; train shifted to Main Line with cautionary headway clearance.'
            }
          : a
      )
    );

    setTrainSchedules((prev) =>
      prev.map((t) => {
        if (t.trainNumber === trainNumber) {
          const isOverridden = !conflictAlerts.find((a) => a.id === alertId)?.overridden;
          return {
            ...t,
            status: isOverridden ? 'OPTIMIZED_ON_TIME' : 'INTERLEAVED_LOOP_HOLD',
            totalDelayMin: isOverridden ? 4 : 28
          };
        }
        return t;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased text-slate-800">
      {/* Top CRIS Enterprise Government Header */}
      <Header
        activeBlockStatus={primaryBlock.status}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        selectedDivision={selectedDivision}
        setSelectedDivision={setSelectedDivision}
      />

      {/* Main Layout Container: Sticky Sidebar + Dynamic Functional Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sticky Left Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingTicketCount={tickets.filter((t) => t.status === 'AWAITING_CLUSTER').length}
          activeClusterCount={megaBlocks.length}
          activeConflictCount={conflictAlerts.filter((a) => !a.overridden).length}
          blockStatus={primaryBlock.status}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          {activeTab === 'INPUT_LOG' && (
            <Interface1_DefectLogger
              tickets={tickets}
              metrics={metrics}
              megaBlocks={megaBlocks}
              onAddTicket={handleAddTicket}
              onSelectMegaBlock={(blockId) => {
                setActiveTab('SHADOW_OPTIMIZER');
              }}
            />
          )}

          {activeTab === 'SHADOW_OPTIMIZER' && (
            <Interface2_ShadowBlockOptimizer
              megaBlocks={megaBlocks}
              tickets={tickets}
              onApproveBlock={handleApproveBlock}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'STRING_CHART' && (
            <Interface3_TrainStringChart
              trainSchedules={trainSchedules}
              conflictAlerts={conflictAlerts}
              activeMegaBlock={primaryBlock}
              onOverrideTrain={handleOverrideTrain}
            />
          )}
        </main>
      </div>

      {/* Executive Footer Bar */}
      <footer className="bg-[#07273d] text-slate-400 text-[11px] px-4 py-2 border-t border-[#124d77] flex flex-wrap items-center justify-between gap-2 z-20 select-none">
        <div className="flex items-center gap-2">
          <span className="text-slate-200 font-semibold">Indian Railways Smart Maintenance & Shadow Block Optimizer</span>
          <span>•</span>
          <span>Smart India Hackathon (SIH 2026 PS27)</span>
          <span>•</span>
          <span className="font-mono text-amber-300">Northern Railway DLI Division</span>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-mono">
          <span className="text-emerald-400">● Graph-DBSCAN: ONLINE</span>
          <span className="text-sky-400">● TENF Router: DYNAMIC CONVERGENCE</span>
          <span className="text-slate-300">Encrypted AES-256 / SHA-256 HMAC</span>
        </div>
      </footer>
    </div>
  );
}
