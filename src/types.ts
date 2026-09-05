export type Department = 'CIVIL' | 'ST' | 'ELECTRICAL';

export type TrackIdentifier = 'UP' | 'DOWN';

export type UrgencyLevel = 'ROUTINE' | 'PLANNED' | 'URGENT' | 'EMERGENCY';

export type TicketClusterStatus = 'AWAITING_CLUSTER' | 'MERGED';

export interface MaintenanceTicket {
  id: string;
  timestamp: string;
  department: Department;
  assetType: string;
  division: string;
  section: string;
  track: TrackIdentifier;
  startKm: number;
  endKm: number;
  startMeter: number;
  endMeter: number;
  urgency: UrgencyLevel;
  status: TicketClusterStatus;
  mergedBlockId?: string;
  estimatedHours: number;
  crewRequirement: number;
  machinery: string[];
  notes?: string;
}

export type BlockStatus = 
  | 'DRAFT_CLUSTER' 
  | 'APPROVED' 
  | 'PENDING_SM_VERIFICATION' 
  | 'STATION_AUTHORIZED' 
  | 'ACTIVE_ISOLATION' 
  | 'CLEARED';

export interface InterlockingSignalMandate {
  id: string;
  signalNumber: string;
  aspect: 'DANGER_RED';
  location: string;
  routeGuard: string;
  verified: boolean;
}

export interface InterlockingPointMandate {
  id: string;
  pointNumber: string;
  lockedPosition: 'NORMAL' | 'REVERSE';
  isolationZone: string;
  clampStatus: 'ELECTRICAL_DETECTOR_LOCKED' | 'PENDING';
  verified: boolean;
}

export interface XGBoostOverrunMetrics {
  onTimeProbability: number;
  risk15MinOverrun: number;
  risk30MinOverrun: number;
  predictedDurationMin: number;
  scheduledDurationMin: number;
  confidenceScore: number;
  riskFactors: {
    rainfallIntensityMm: number;
    rainfallStatus: 'None (0.0 mm/h)' | 'Light Rain (2.4 mm/h)' | 'Heavy Monsoon (18.2 mm/h)';
    machineryWearHours: number;
    machineryStatus: 'Optimal (<120 hrs)' | 'Moderate Service Needed' | 'Critical Overhaul Imminent';
    trackGradientDegree: number;
    gradientStatus: 'Level Tangent' | '1 in 150 Incline' | 'Sharp 2.4° Cant Curve';
    crewFatigueFactor: number;
  };
}

export interface MegaShadowBlock {
  id: string;
  title: string;
  division: string;
  section: string;
  track: TrackIdentifier;
  startKm: number;
  endKm: number;
  startStation: string;
  endStation: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  scheduledDate: string;
  ticketIds: string[];
  status: BlockStatus;
  authCommandCode: string;
  cryptoHash: string;
  digitalTa409Serial: string;
  xgboost: XGBoostOverrunMetrics;
  signalMandates: InterlockingSignalMandate[];
  pointMandates: InterlockingPointMandate[];
  linearDBSCANClusterScore: number; // e.g. 0.94
  spatialEpsilonKm: number; // epsilon parameter used
  approvedAt?: string;
  authorizedBySM?: string;
  smVerifiedAt?: string;
}

export interface StationReference {
  code: string;
  name: string;
  distanceKm: number;
  hasLoops: boolean;
  loopCapacity: number;
}

export interface TrainStop {
  stationCode: string;
  scheduledArrivalMin: number;
  scheduledDepartureMin: number;
  optimizedArrivalMin: number;
  optimizedDepartureMin: number;
  trackUsed: 'MAIN_UP' | 'MAIN_DOWN' | 'LOOP_1' | 'LOOP_2';
  isHeldOnLoop?: boolean;
  holdDurationMin?: number;
  holdReason?: string;
}

export interface TrainSchedule {
  trainNumber: string;
  trainName: string;
  priority: 'PREMIUM_VANDE_BHARAT' | 'RAJDHANI_EXPRESS' | 'SUPERFAST' | 'MAIL_EXPRESS' | 'FREIGHT_BOXN';
  direction: TrackIdentifier;
  stops: TrainStop[];
  status: 'OPTIMIZED_ON_TIME' | 'INTERLEAVED_LOOP_HOLD' | 'SPEED_RESTRICTED' | 'DELAY_IMPACTED';
  totalDelayMin: number;
  speedLimitKmph: number;
}

export interface CapacityConflictAlert {
  id: string;
  timestamp: string;
  trainNumber: string;
  trainName: string;
  location: string;
  actionTaken: string;
  delayMin: number;
  preemptedByTrain?: string;
  resolved: boolean;
  overridden: boolean;
}

export interface CorridorMetrics {
  pendingTicketsTotal: number;
  activeMegaBlocksToday: number;
  capacityOptimizationScore: number;
  savedPunctualityLossMin: number;
  totalTrackKmMonitored: number;
  spatioTemporalOverlapRate: number;
}
