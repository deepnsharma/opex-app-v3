export const mockInitiatives = [
  {
    id: 'INI-001',
    title: 'Energy Efficiency Optimization',
    initiator: 'John Smith',
    site: 'Plant A',
    dateCreated: '2024-01-15',
    status: 'In Progress',
    stage: 'Unit Head Review',
    description: 'Implementing LED lighting and optimizing HVAC systems to reduce energy consumption',
    baselineData: '2.5 MWh/day average consumption over 12 months',
    targetOutcome: 'Reduce energy consumption by 15% (0.375 MWh/day)',
    expectedValue: 50000,
    confidence: 85,
    assumptions: [
      'Energy prices remain stable',
      'Equipment availability 95%+',
      'Staff training completion'
    ],
    estimatedCapex: 75000,
    attachments: ['energy_audit_report.pdf', 'led_specifications.xlsx'],
    currentStage: 2,
    workflow: [
      { stage: 'Site TSD', status: 'completed', date: '2024-01-16', approver: 'Sarah Johnson' },
      { stage: 'Unit Head', status: 'pending', date: null, approver: 'Mike Chen' },
      { stage: 'Corporate TSD', status: 'waiting', date: null, approver: 'David Wilson' },
      { stage: 'CMO', status: 'waiting', date: null, approver: 'Lisa Anderson' }
    ]
  },
  {
    id: 'INI-002',
    title: 'Waste Reduction Initiative',
    initiator: 'Emma Davis',
    site: 'Plant B',
    dateCreated: '2024-01-20',
    status: 'Approved',
    stage: 'Implementation',
    description: 'Implementing lean manufacturing principles to reduce material waste',
    baselineData: '15% material waste rate over 12 months',
    targetOutcome: 'Reduce waste to 8% (7% improvement)',
    expectedValue: 120000,
    confidence: 90,
    assumptions: [
      'Supplier quality improvements',
      'Process standardization',
      'Employee engagement'
    ],
    estimatedCapex: 25000,
    attachments: ['waste_analysis.pdf'],
    currentStage: 4,
    workflow: [
      { stage: 'Site TSD', status: 'completed', date: '2024-01-21', approver: 'Tom Brown' },
      { stage: 'Unit Head', status: 'completed', date: '2024-01-23', approver: 'Anna White' },
      { stage: 'Corporate TSD', status: 'completed', date: '2024-01-25', approver: 'David Wilson' },
      { stage: 'CMO', status: 'completed', date: '2024-01-28', approver: 'Lisa Anderson' }
    ]
  }
];

export const mockProjects = [
  {
    id: 'PRJ-001',
    initiativeId: 'INI-001',
    name: 'LED Lighting Installation',
    tasks: [
      {
        id: 'T001',
        name: 'Site Survey and Assessment',
        startDate: '2024-02-01',
        endDate: '2024-02-07',
        status: 'Completed',
        progress: 100,
        owner: 'Technical Team',
        comments: 'Survey completed, identified 500 fixtures for replacement'
      },
      {
        id: 'T002',
        name: 'LED Procurement',
        startDate: '2024-02-08',
        endDate: '2024-02-15',
        status: 'In Progress',
        progress: 75,
        owner: 'Procurement Team',
        comments: 'Orders placed, delivery expected by 2/14'
      },
      {
        id: 'T003',
        name: 'Installation Phase 1',
        startDate: '2024-02-16',
        endDate: '2024-02-28',
        status: 'Planning',
        progress: 0,
        owner: 'Maintenance Team',
        comments: 'Waiting for equipment delivery'
      }
    ],
    raci: [
      { role: 'Project Manager', responsible: 'John Smith', accountable: 'Mike Chen', consulted: 'Sarah Johnson', informed: 'All Staff' },
      { role: 'Technical Lead', responsible: 'Tech Team', accountable: 'John Smith', consulted: 'Vendors', informed: 'Management' },
      { role: 'Procurement', responsible: 'Proc Team', accountable: 'Finance', consulted: 'Tech Team', informed: 'Project Manager' }
    ]
  }
];

export const mockKPIs = [
  {
    month: 'Jan 2024',
    energySavings: 12000,
    costSavings: 45000,
    productivityGain: 5.2,
    wasteReduction: 3.8,
    co2Reduction: 2.1,
    cycleTimeReduction: 8.5
  },
  {
    month: 'Feb 2024',
    energySavings: 15000,
    costSavings: 52000,
    productivityGain: 6.1,
    wasteReduction: 4.2,
    co2Reduction: 2.8,
    cycleTimeReduction: 9.2
  },
  {
    month: 'Mar 2024',
    energySavings: 18000,
    costSavings: 48000,
    productivityGain: 5.8,
    wasteReduction: 5.1,
    co2Reduction: 3.2,
    cycleTimeReduction: 7.8
  }
];

export const mockDashboardData = {
  totalInitiatives: 24,
  approvedInitiatives: 18,
  pendingApprovals: 6,
  totalSavings: 2450000,
  targetSavings: 3000000,
  completionRate: 75,
  recentActivities: [
    { id: 1, action: 'New initiative submitted', user: 'John Smith', time: '2 hours ago', type: 'create' },
    { id: 2, action: 'Initiative approved by Unit Head', user: 'Mike Chen', time: '4 hours ago', type: 'approve' },
    { id: 3, action: 'KPI data updated', user: 'Emma Davis', time: '6 hours ago', type: 'update' },
    { id: 4, action: 'Project milestone completed', user: 'Tech Team', time: '1 day ago', type: 'complete' }
  ]
};

export const mockClosureData = [
  {
    id: 'CLS-001',
    initiativeId: 'INI-002',
    initiativeName: 'Waste Reduction Initiative',
    lead: 'Emma Davis',
    capexSummary: 25000,
    targetValue: 120000,
    actualValue: 135000,
    justification: 'Initiative exceeded targets due to additional process improvements discovered during implementation.',
    currentStage: 3,
    workflow: [
      { stage: 'Initiative Lead', status: 'completed', date: '2024-03-01', approver: 'Emma Davis' },
      { stage: 'Corp TSD Review', status: 'completed', date: '2024-03-03', approver: 'David Wilson' },
      { stage: 'Site F&A Validation', status: 'pending', date: null, approver: 'Finance Team' },
      { stage: 'Site Head Approval', status: 'waiting', date: null, approver: 'Regional Manager' },
      { stage: 'CMO Verification', status: 'waiting', date: null, approver: 'Lisa Anderson' }
    ],
    comments: [
      { user: 'Emma Davis', date: '2024-03-01', comment: 'All targets achieved, documentation complete.' },
      { user: 'David Wilson', date: '2024-03-03', comment: 'Excellent results, approved for next stage.' }
    ]
  }
];