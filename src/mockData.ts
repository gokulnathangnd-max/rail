import { 
  MaintenanceTicket, 
  MegaShadowBlock, 
  StationReference, 
  TrainSchedule, 
  CapacityConflictAlert,
  CorridorMetrics
} from './types';

export const DEPARTMENTS = [
  { id: 'CIVIL', label: 'Civil Engineering (P-Way)', shortLabel: 'Civil (P-Way)', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'ST', label: 'Signal & Telecom (S&T)', shortLabel: 'S&T Systems', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'ELECTRICAL', label: 'Electrical / OHE (25kV)', shortLabel: 'Traction OHE', badgeColor: 'bg-blue-100 text-blue-800 border-blue-300' }
] as const;

export const ASSETS_BY_DEPARTMENT: Record<string, string[]> = {
  CIVIL: [
    'UIC-60 60kg Continuous Welded Rail (CWR)',
    'Prestressed Concrete (PSC) Sleepers',
    'Points & Turnout 1-in-12 Curved Switch',
    'Deep Ballast Screening & Track Tamping',
    'Elastic Rail Clips (ERC Mk-III) & Liners',
    'Insulated Glued Rail Joint (G3L)',
    'Bridge Expansion Bearing & Track Guard'
  ],
  ST: [
    'Electric Point Machine (IRS 143mm Stroke)',
    'Multi-Aspect Color Light Signal (MACLS 4-Aspect)',
    'High-Voltage Impulse Audio Frequency Track Circuit (AFTC)',
    'Multi-Section Digital Axle Counter (MSDAC)',
    'Block Proving by Axle Counter (BPAC Evaluator)',
    'Solid State Interlocking (SSI) Vital Relays',
    'Level Crossing Electric Lifting Barrier (ELB)'
  ],
  ELECTRICAL: [
    '25kV AC Hard-Drawn Grooved Copper Contact Wire',
    'Cadmium Copper Catenary Wire (65 sq.mm)',
    'Porcelain / Composite Bracket Insulator (1050mm CD)',
    'OHE Section Insulator with Double Air Gap',
    'Overlap Neutral Section & Auto Transposition',
    'Structure Bond, Earth Wire & Cross-Track Jumper',
    'Motorized Isolator Switch (25kV 1000A)'
  ]
};

export const DIVISIONS = [
  { id: 'NDLS', name: 'Delhi Division (NR)', zone: 'Northern Railway' },
  { id: 'BCT', name: 'Mumbai Central Division (WR)', zone: 'Western Railway' },
  { id: 'HWH', name: 'Howrah Division (ER)', zone: 'Eastern Railway' },
  { id: 'MAS', name: 'Chennai Central Division (SR)', zone: 'Southern Railway' }
];

export const SECTIONS = [
  { id: 'SEC-01', name: 'NDLS - ALJN Quadruple Trunk Corridor (KM 0 to 135)', defaultDiv: 'NDLS' },
  { id: 'SEC-02', name: 'ALJN - CNB High-Density Main Line (KM 135 to 250)', defaultDiv: 'NDLS' },
  { id: 'SEC-03', name: 'GZB - MTC Semi-High Speed Loop (KM 25 to 70)', defaultDiv: 'NDLS' }
];

export const CORRIDOR_STATIONS: StationReference[] = [
  { code: 'NDLS', name: 'New Delhi Central', distanceKm: 0, hasLoops: true, loopCapacity: 6 },
  { code: 'ANVT', name: 'Anand Vihar Terminal', distanceKm: 13.5, hasLoops: true, loopCapacity: 4 },
  { code: 'SBB', name: 'Sahibabad Junction', distanceKm: 20.8, hasLoops: true, loopCapacity: 3 },
  { code: 'GZB', name: 'Ghaziabad Junction', distanceKm: 26.5, hasLoops: true, loopCapacity: 8 },
  { code: 'MIU', name: 'Maripat Station', distanceKm: 36.2, hasLoops: true, loopCapacity: 2 },
  { code: 'DER', name: 'Dadri Multimodal Yard', distanceKm: 45.0, hasLoops: true, loopCapacity: 5 },
  { code: 'SKQ', name: 'Sikandrabad Outer', distanceKm: 62.4, hasLoops: false, loopCapacity: 1 },
  { code: 'KRJ', name: 'Khurja Super Junction', distanceKm: 85.0, hasLoops: true, loopCapacity: 4 },
  { code: 'SOM', name: 'Somna Junction', distanceKm: 108.5, hasLoops: true, loopCapacity: 2 },
  { code: 'ALJN', name: 'Aligarh Junction', distanceKm: 126.0, hasLoops: true, loopCapacity: 6 },
  { code: 'MXK', name: 'Mandrak Outer', distanceKm: 142.0, hasLoops: true, loopCapacity: 3 },
  { code: 'TDL', name: 'Tundla Junction', distanceKm: 160.0, hasLoops: true, loopCapacity: 7 }
];

export const INITIAL_TICKETS: MaintenanceTicket[] = [
  {
    id: 'TKT-NR-2026-4101',
    timestamp: '2026-09-05 07:15:22',
    department: 'CIVIL',
    assetType: 'UIC-60 60kg Continuous Welded Rail (CWR)',
    division: 'NDLS',
    section: 'ALJN - CNB High-Density Main Line (KM 135 to 250)',
    track: 'UP',
    startKm: 142,
    endKm: 143,
    startMeter: 120,
    endMeter: 450,
    urgency: 'URGENT',
    status: 'MERGED',
    mergedBlockId: 'MSB-2026-089',
    estimatedHours: 3.5,
    crewRequirement: 14,
    machinery: ['BCM-80 Ballast Cleaner', 'Plasser Track Tamper 09-3X'],
    notes: 'Severe gauge face wear detected via OMS-2000 car run.'
  },
  {
    id: 'TKT-NR-2026-4102',
    timestamp: '2026-09-05 07:42:10',
    department: 'ST',
    assetType: 'Electric Point Machine (IRS 143mm Stroke)',
    division: 'NDLS',
    section: 'ALJN - CNB High-Density Main Line (KM 135 to 250)',
    track: 'UP',
    startKm: 142,
    endKm: 142,
    startMeter: 850,
    endMeter: 910,
    urgency: 'URGENT',
    status: 'MERGED',
    mergedBlockId: 'MSB-2026-089',
    estimatedHours: 2.0,
    crewRequirement: 6,
    machinery: ['Point Machine Test Bench', 'Insulation Megger Kit'],
    notes: 'Point 104A friction clutch torque variance exceeds 12% limit.'
  },
  {
    id: 'TKT-NR-2026-4103',
    timestamp: '2026-09-05 08:05:44',
    department: 'ELECTRICAL',
    assetType: '25kV AC Hard-Drawn Grooved Copper Contact Wire',
    division: 'NDLS',
    section: 'ALJN - CNB High-Density Main Line (KM 135 to 250)',
    track: 'UP',
    startKm: 143,
    endKm: 144,
    startMeter: 200,
    endMeter: 600,
    urgency: 'PLANNED',
    status: 'MERGED',
    mergedBlockId: 'MSB-2026-089',
    estimatedHours: 3.0,
    crewRequirement: 8,
    machinery: ['8-Wheeler Diesel OHE Tower Wagon DETC-12'],
    notes: 'Contact wire diameter reduced to 10.8mm; requires replacement of 400m span.'
  },
  {
    id: 'TKT-NR-2026-4104',
    timestamp: '2026-09-05 08:30:19',
    department: 'CIVIL',
    assetType: 'Prestressed Concrete (PSC) Sleepers',
    division: 'NDLS',
    section: 'ALJN - CNB High-Density Main Line (KM 135 to 250)',
    track: 'UP',
    startKm: 143,
    endKm: 144,
    startMeter: 700,
    endMeter: 950,
    urgency: 'ROUTINE',
    status: 'MERGED',
    mergedBlockId: 'MSB-2026-089',
    estimatedHours: 2.5,
    crewRequirement: 10,
    machinery: ['Off-track Heavy Hydraulic Jacks'],
    notes: 'Fatigue cracking observed on 32 sleeper ends after monsoon.'
  },
  {
    id: 'TKT-NR-2026-4105',
    timestamp: '2026-09-05 08:44:02',
    department: 'ST',
    assetType: 'Multi-Aspect Color Light Signal (MACLS 4-Aspect)',
    division: 'NDLS',
    section: 'ALJN - CNB High-Density Main Line (KM 135 to 250)',
    track: 'UP',
    startKm: 144,
    endKm: 144,
    startMeter: 400,
    endMeter: 450,
    urgency: 'URGENT',
    status: 'MERGED',
    mergedBlockId: 'MSB-2026-089',
    estimatedHours: 1.5,
    crewRequirement: 4,
    machinery: ['Signal Aspect Calibration Lux Meter'],
    notes: 'Signal S-24 Yellow aspect LED cluster flicker.'
  },
  // Additional tickets outside the primary cluster to demonstrate DBSCAN spatial filtering
  {
    id: 'TKT-NR-2026-4106',
    timestamp: '2026-09-05 09:12:30',
    department: 'CIVIL',
    assetType: 'Insulated Glued Rail Joint (G3L)',
    division: 'NDLS',
    section: 'NDLS - ALJN Quadruple Trunk Corridor (KM 0 to 135)',
    track: 'DOWN',
    startKm: 44,
    endKm: 45,
    startMeter: 50,
    endMeter: 200,
    urgency: 'URGENT',
    status: 'AWAITING_CLUSTER',
    estimatedHours: 2.0,
    crewRequirement: 7,
    machinery: ['Weld Joint Stress Reliever'],
    notes: 'Resistance drop in insulation liner during heavy condensation.'
  },
  {
    id: 'TKT-NR-2026-4107',
    timestamp: '2026-09-05 09:35:14',
    department: 'ELECTRICAL',
    assetType: 'Porcelain / Composite Bracket Insulator (1050mm CD)',
    division: 'NDLS',
    section: 'NDLS - ALJN Quadruple Trunk Corridor (KM 0 to 135)',
    track: 'DOWN',
    startKm: 45,
    endKm: 46,
    startMeter: 100,
    endMeter: 350,
    urgency: 'PLANNED',
    status: 'AWAITING_CLUSTER',
    estimatedHours: 1.5,
    crewRequirement: 5,
    machinery: ['OHE Ladder Trolley'],
    notes: 'Flashover deposit cleanup on composite shed #14.'
  },
  {
    id: 'TKT-NR-2026-4108',
    timestamp: '2026-09-05 10:05:00',
    department: 'ST',
    assetType: 'Multi-Section Digital Axle Counter (MSDAC)',
    division: 'NDLS',
    section: 'NDLS - ALJN Quadruple Trunk Corridor (KM 0 to 135)',
    track: 'UP',
    startKm: 26,
    endKm: 27,
    startMeter: 300,
    endMeter: 400,
    urgency: 'EMERGENCY',
    status: 'AWAITING_CLUSTER',
    estimatedHours: 1.0,
    crewRequirement: 4,
    machinery: ['High-Precision Wheel Sensor Clamp'],
    notes: 'Intermittent count mismatch on Track Section TC-42; 30 km/h caution imposed.'
  },
  {
    id: 'TKT-NR-2026-4109',
    timestamp: '2026-09-05 10:45:11',
    department: 'CIVIL',
    assetType: 'Deep Ballast Screening & Track Tamping',
    division: 'NDLS',
    section: 'NDLS - ALJN Quadruple Trunk Corridor (KM 0 to 135)',
    track: 'UP',
    startKm: 85,
    endKm: 87,
    startMeter: 0,
    endMeter: 500,
    urgency: 'ROUTINE',
    status: 'AWAITING_CLUSTER',
    estimatedHours: 4.0,
    crewRequirement: 18,
    machinery: ['CSM-09 Continuous Action Tamping Machine'],
    notes: 'Routine 6-monthly high-density section packing.'
  }
];

export const INITIAL_MEGA_BLOCK: MegaShadowBlock = {
  id: 'MSB-2026-089',
  title: 'Aligarh Outer - Mandrak Spatio-Temporal Mega Block',
  division: 'NDLS',
  section: 'ALJN - CNB High-Density Main Line (KM 135 to 250)',
  track: 'UP',
  startKm: 142.0,
  endKm: 144.95,
  startStation: 'ALJN (Aligarh Jn)',
  endStation: 'MXK (Mandrak)',
  scheduledDate: '2026-09-05',
  scheduledStartTime: '11:15',
  scheduledEndTime: '14:45',
  ticketIds: ['TKT-NR-2026-4101', 'TKT-NR-2026-4102', 'TKT-NR-2026-4103', 'TKT-NR-2026-4104', 'TKT-NR-2026-4105'],
  status: 'PENDING_SM_VERIFICATION',
  authCommandCode: 'SHADOW_BLOCK_INIT_142_UP',
  cryptoHash: '9F82A4C07B889E23D106F39215EBA46098C127D9A662BF8C0D41E7A034891CF2',
  digitalTa409Serial: 'NR/DLI/TA409/2026/09/089-CRIS',
  linearDBSCANClusterScore: 0.942,
  spatialEpsilonKm: 3.2,
  xgboost: {
    onTimeProbability: 92,
    risk15MinOverrun: 8,
    risk30MinOverrun: 2,
    predictedDurationMin: 202,
    scheduledDurationMin: 210,
    confidenceScore: 0.96,
    riskFactors: {
      rainfallIntensityMm: 1.2,
      rainfallStatus: 'Light Rain (2.4 mm/h)',
      machineryWearHours: 84,
      machineryStatus: 'Optimal (<120 hrs)',
      trackGradientDegree: 0.45,
      gradientStatus: 'Level Tangent',
      crewFatigueFactor: 18
    }
  },
  signalMandates: [
    {
      id: 'SIG-M-01',
      signalNumber: 'S-24 (UP Home)',
      aspect: 'DANGER_RED',
      location: 'KM 141/80 Mandrak Outer',
      routeGuard: 'Locks UP Main route entry from Aligarh side',
      verified: true
    },
    {
      id: 'SIG-M-02',
      signalNumber: 'S-28 (UP Advanced Starter)',
      aspect: 'DANGER_RED',
      location: 'KM 145/20 Mandrak Yard',
      routeGuard: 'Prevents contra-flow shunting into isolated block zone',
      verified: true
    }
  ],
  pointMandates: [
    {
      id: 'PNT-M-01',
      pointNumber: 'Point 104A (Trailing Switch)',
      lockedPosition: 'NORMAL',
      isolationZone: 'Diverts UP trains to Loop Line 1; physically clamped',
      clampStatus: 'ELECTRICAL_DETECTOR_LOCKED',
      verified: true
    },
    {
      id: 'PNT-M-02',
      pointNumber: 'Point 107B (Facing Crossover)',
      lockedPosition: 'REVERSE',
      isolationZone: 'Traps runaway movements into Sand Hump dead-end',
      clampStatus: 'ELECTRICAL_DETECTOR_LOCKED',
      verified: true
    }
  ]
};

export const INITIAL_SECONDARY_BLOCK: MegaShadowBlock = {
  id: 'MSB-2026-092',
  title: 'Dadri Multimodal Corridor Integrated Joint Window',
  division: 'NDLS',
  section: 'NDLS - ALJN Quadruple Trunk Corridor (KM 0 to 135)',
  track: 'DOWN',
  startKm: 44.0,
  endKm: 46.2,
  startStation: 'MIU (Maripat)',
  endStation: 'DER (Dadri)',
  scheduledDate: '2026-09-05',
  scheduledStartTime: '15:30',
  scheduledEndTime: '18:00',
  ticketIds: ['TKT-NR-2026-4106', 'TKT-NR-2026-4107'],
  status: 'DRAFT_CLUSTER',
  authCommandCode: 'SHADOW_BLOCK_INIT_044_DN',
  cryptoHash: 'A772D1E54F30C668902A91D334B860EFA91040375E99816B316CA523315B789C',
  digitalTa409Serial: 'NR/DLI/TA409/2026/09/092-CRIS',
  linearDBSCANClusterScore: 0.884,
  spatialEpsilonKm: 2.8,
  xgboost: {
    onTimeProbability: 86,
    risk15MinOverrun: 14,
    risk30MinOverrun: 4,
    predictedDurationMin: 144,
    scheduledDurationMin: 150,
    confidenceScore: 0.91,
    riskFactors: {
      rainfallIntensityMm: 0.0,
      rainfallStatus: 'None (0.0 mm/h)',
      machineryWearHours: 110,
      machineryStatus: 'Optimal (<120 hrs)',
      trackGradientDegree: 1.1,
      gradientStatus: '1 in 150 Incline',
      crewFatigueFactor: 24
    }
  },
  signalMandates: [
    {
      id: 'SIG-M-03',
      signalNumber: 'S-12 (DOWN Starter)',
      aspect: 'DANGER_RED',
      location: 'KM 43/90 Maripat Yard',
      routeGuard: 'Locks DOWN Line progression towards Dadri',
      verified: false
    }
  ],
  pointMandates: [
    {
      id: 'PNT-M-03',
      pointNumber: 'Point 202A',
      lockedPosition: 'NORMAL',
      isolationZone: 'Isolates Freight line feeder crossover',
      clampStatus: 'PENDING',
      verified: false
    }
  ]
};

// Time scale: minutes from 06:00 (0 = 06:00, 300 = 11:00, 540 = 15:00, 720 = 18:00)
// Base time reference: 06:00 AM is minute 0.
// Mega Block MSB-2026-089 is 11:15 to 14:45 -> 315 to 525 min.
// Geographic range of block: KM 142.0 to 144.95 (Between ALJN KM 126 and MXK KM 142 / TDL KM 160)
export const INITIAL_TRAIN_SCHEDULES: TrainSchedule[] = [
  {
    trainNumber: '20901',
    trainName: 'Vande Bharat Express (NDLS - BSB)',
    priority: 'PREMIUM_VANDE_BHARAT',
    direction: 'UP',
    speedLimitKmph: 130,
    status: 'OPTIMIZED_ON_TIME',
    totalDelayMin: 0,
    stops: [
      { stationCode: 'NDLS', scheduledArrivalMin: 30, scheduledDepartureMin: 35, optimizedArrivalMin: 30, optimizedDepartureMin: 35, trackUsed: 'MAIN_UP' },
      { stationCode: 'GZB', scheduledArrivalMin: 55, scheduledDepartureMin: 57, optimizedArrivalMin: 55, optimizedDepartureMin: 57, trackUsed: 'MAIN_UP' },
      { stationCode: 'KRJ', scheduledArrivalMin: 98, scheduledDepartureMin: 98, optimizedArrivalMin: 98, optimizedDepartureMin: 98, trackUsed: 'MAIN_UP' },
      { stationCode: 'ALJN', scheduledArrivalMin: 125, scheduledDepartureMin: 127, optimizedArrivalMin: 125, optimizedDepartureMin: 127, trackUsed: 'MAIN_UP' },
      { stationCode: 'TDL', scheduledArrivalMin: 155, scheduledDepartureMin: 157, optimizedArrivalMin: 155, optimizedDepartureMin: 157, trackUsed: 'MAIN_UP' }
    ]
  },
  {
    trainNumber: '12951',
    trainName: 'Mumbai Tejas Rajdhani Express',
    priority: 'RAJDHANI_EXPRESS',
    direction: 'UP',
    speedLimitKmph: 130,
    status: 'OPTIMIZED_ON_TIME',
    totalDelayMin: 0,
    stops: [
      { stationCode: 'NDLS', scheduledArrivalMin: 180, scheduledDepartureMin: 190, optimizedArrivalMin: 180, optimizedDepartureMin: 190, trackUsed: 'MAIN_UP' },
      { stationCode: 'GZB', scheduledArrivalMin: 215, scheduledDepartureMin: 216, optimizedArrivalMin: 215, optimizedDepartureMin: 216, trackUsed: 'MAIN_UP' },
      { stationCode: 'ALJN', scheduledArrivalMin: 280, scheduledDepartureMin: 282, optimizedArrivalMin: 280, optimizedDepartureMin: 282, trackUsed: 'MAIN_UP' },
      { stationCode: 'TDL', scheduledArrivalMin: 310, scheduledDepartureMin: 312, optimizedArrivalMin: 310, optimizedDepartureMin: 312, trackUsed: 'MAIN_UP' }
    ]
  },
  // Train 12302 Howrah Rajdhani arrives right as block starts (Minute 320)
  // Optimization: Interleaved via the Bi-Directional High-Speed Middle Line 3 with zero delay
  {
    trainNumber: '12302',
    trainName: 'Howrah New Delhi Rajdhani Superfast',
    priority: 'RAJDHANI_EXPRESS',
    direction: 'DOWN',
    speedLimitKmph: 130,
    status: 'OPTIMIZED_ON_TIME',
    totalDelayMin: 0,
    stops: [
      { stationCode: 'TDL', scheduledArrivalMin: 300, scheduledDepartureMin: 302, optimizedArrivalMin: 300, optimizedDepartureMin: 302, trackUsed: 'MAIN_DOWN' },
      { stationCode: 'MXK', scheduledArrivalMin: 320, scheduledDepartureMin: 320, optimizedArrivalMin: 320, optimizedDepartureMin: 320, trackUsed: 'MAIN_DOWN' },
      { stationCode: 'ALJN', scheduledArrivalMin: 338, scheduledDepartureMin: 340, optimizedArrivalMin: 338, optimizedDepartureMin: 340, trackUsed: 'MAIN_DOWN' },
      { stationCode: 'GZB', scheduledArrivalMin: 405, scheduledDepartureMin: 407, optimizedArrivalMin: 405, optimizedDepartureMin: 407, trackUsed: 'MAIN_DOWN' },
      { stationCode: 'NDLS', scheduledArrivalMin: 435, scheduledDepartureMin: 440, optimizedArrivalMin: 435, optimizedDepartureMin: 440, trackUsed: 'MAIN_DOWN' }
    ]
  },
  // Freight Train BOXN-88201: Intercepted during Mega Block 11:15 - 14:45 (min 315 - 525)
  // Shifted into horizontal flatline loop hold at ALJN (Minute 340 to 372 = 32 min hold)
  {
    trainNumber: '88201',
    trainName: 'BOXN Container Freight (Tughlakabad - Dadri Loop)',
    priority: 'FREIGHT_BOXN',
    direction: 'UP',
    speedLimitKmph: 75,
    status: 'INTERLEAVED_LOOP_HOLD',
    totalDelayMin: 28,
    stops: [
      { stationCode: 'NDLS', scheduledArrivalMin: 220, scheduledDepartureMin: 230, optimizedArrivalMin: 220, optimizedDepartureMin: 230, trackUsed: 'MAIN_UP' },
      { stationCode: 'GZB', scheduledArrivalMin: 265, scheduledDepartureMin: 270, optimizedArrivalMin: 265, optimizedDepartureMin: 270, trackUsed: 'MAIN_UP' },
      { stationCode: 'DER', scheduledArrivalMin: 305, scheduledDepartureMin: 310, optimizedArrivalMin: 305, optimizedDepartureMin: 310, trackUsed: 'MAIN_UP' },
      { 
        stationCode: 'ALJN', 
        scheduledArrivalMin: 350, 
        scheduledDepartureMin: 355, 
        optimizedArrivalMin: 352, 
        optimizedDepartureMin: 380, 
        trackUsed: 'LOOP_1',
        isHeldOnLoop: true,
        holdDurationMin: 28,
        holdReason: 'Held on Loop Line 1 to clear headway for Vande Bharat and bypass Mega Block MSB-2026-089 single-line section'
      },
      { stationCode: 'TDL', scheduledArrivalMin: 420, scheduledDepartureMin: 430, optimizedArrivalMin: 448, optimizedDepartureMin: 458, trackUsed: 'MAIN_UP' }
    ]
  },
  // Passenger MEMU 64402 held at SOM (Somna) loop line
  {
    trainNumber: '64402',
    trainName: 'Ghaziabad - Aligarh MEMU Passenger',
    priority: 'MAIL_EXPRESS',
    direction: 'UP',
    speedLimitKmph: 90,
    status: 'INTERLEAVED_LOOP_HOLD',
    totalDelayMin: 14,
    stops: [
      { stationCode: 'GZB', scheduledArrivalMin: 340, scheduledDepartureMin: 345, optimizedArrivalMin: 340, optimizedDepartureMin: 345, trackUsed: 'MAIN_UP' },
      { stationCode: 'MIU', scheduledArrivalMin: 360, scheduledDepartureMin: 362, optimizedArrivalMin: 360, optimizedDepartureMin: 362, trackUsed: 'MAIN_UP' },
      { stationCode: 'KRJ', scheduledArrivalMin: 410, scheduledDepartureMin: 412, optimizedArrivalMin: 410, optimizedDepartureMin: 412, trackUsed: 'MAIN_UP' },
      { 
        stationCode: 'SOM', 
        scheduledArrivalMin: 440, 
        scheduledDepartureMin: 442, 
        optimizedArrivalMin: 440, 
        optimizedDepartureMin: 454, 
        trackUsed: 'LOOP_2',
        isHeldOnLoop: true,
        holdDurationMin: 14,
        holdReason: 'Dynamic headway spacing for outbound Rajdhani crossing'
      },
      { stationCode: 'ALJN', scheduledArrivalMin: 475, scheduledDepartureMin: 480, optimizedArrivalMin: 489, optimizedDepartureMin: 494, trackUsed: 'MAIN_UP' }
    ]
  },
  {
    trainNumber: '12004',
    trainName: 'New Delhi - Lucknow Swarna Shatabdi',
    priority: 'PREMIUM_VANDE_BHARAT',
    direction: 'UP',
    speedLimitKmph: 130,
    status: 'OPTIMIZED_ON_TIME',
    totalDelayMin: 0,
    stops: [
      { stationCode: 'NDLS', scheduledArrivalMin: 370, scheduledDepartureMin: 375, optimizedArrivalMin: 370, optimizedDepartureMin: 375, trackUsed: 'MAIN_UP' },
      { stationCode: 'GZB', scheduledArrivalMin: 395, scheduledDepartureMin: 397, optimizedArrivalMin: 395, optimizedDepartureMin: 397, trackUsed: 'MAIN_UP' },
      { stationCode: 'ALJN', scheduledArrivalMin: 450, scheduledDepartureMin: 452, optimizedArrivalMin: 450, optimizedDepartureMin: 452, trackUsed: 'MAIN_UP' },
      { stationCode: 'TDL', scheduledArrivalMin: 485, scheduledDepartureMin: 487, optimizedArrivalMin: 485, optimizedDepartureMin: 487, trackUsed: 'MAIN_UP' }
    ]
  }
];

export const INITIAL_CONFLICT_ALERTS: CapacityConflictAlert[] = [
  {
    id: 'CONF-01',
    timestamp: '11:18:04',
    trainNumber: '88201',
    trainName: 'BOXN Container Freight',
    location: 'ALJN Station Loop Line 1 (KM 126)',
    actionTaken: 'Held at Station Loop 1 for 28 min to clear single-line section around MSB-2026-089 for high-priority train paths',
    delayMin: 28,
    preemptedByTrain: '12004 Swarna Shatabdi',
    resolved: true,
    overridden: false
  },
  {
    id: 'CONF-02',
    timestamp: '11:24:40',
    trainNumber: '64402',
    trainName: 'Ghaziabad - Aligarh MEMU',
    location: 'SOM Station Loop Line 2 (KM 108.5)',
    actionTaken: 'Interleaved 14-minute dwell to prevent queuing behind slower freight consist',
    delayMin: 14,
    preemptedByTrain: '12302 Howrah Rajdhani',
    resolved: true,
    overridden: false
  },
  {
    id: 'CONF-03',
    timestamp: '11:42:15',
    trainNumber: '12423',
    trainName: 'Dibrugarh Rajdhani Express',
    location: 'Mandrak Bypassing Crossover (KM 141/50)',
    actionTaken: 'Routing diverted via Bi-directional Down line bypass with PSR 75 km/h over turnout',
    delayMin: 2,
    resolved: true,
    overridden: false
  }
];

export const INITIAL_METRICS: CorridorMetrics = {
  pendingTicketsTotal: 9,
  activeMegaBlocksToday: 2,
  capacityOptimizationScore: 94.8,
  savedPunctualityLossMin: 142,
  totalTrackKmMonitored: 450,
  spatioTemporalOverlapRate: 78.4
};
