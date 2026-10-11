export type Role = 'coordinator' | 'pilot' | 'authority'

export type MissionStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Flown' | 'Report filed'
export type ApprovalStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected'
export type AvailabilityStatus = 'Available' | 'Unavailable' | 'On mission'

export interface Certificate {
  id: string
  name: string
  number: string
  issuedDate: string
  expiryDate: string
  status: 'valid' | 'expiring' | 'expired'
}

export interface Insurance {
  id: string
  provider: string
  policyNumber: string
  issuedDate: string
  expiryDate: string
  status: 'valid' | 'expiring' | 'expired'
}

export interface Drone {
  id: string
  model: string
  serialNumber: string
  registrationNumber: string
  category: string
  status: 'active' | 'inactive'
}

export interface Pilot {
  id: string
  name: string
  phone: string
  flightHours: number
  availability: AvailabilityStatus
  certificates: Certificate[]
  insurance: Insurance[]
  registeredDrones: string[]
  approvalStatus: ApprovalStatus
  createdAt: string
}

export interface Mission {
  id: string
  title: string
  client: string
  location: string
  date: string
  time: string
  missionType: 'inspection' | 'agriculture' | 'surveying' | 'real estate' | 'film'
  assignedPilotId: string
  droneId: string
  maxAltitude: number
  riskLevel: 'low' | 'medium' | 'high'
  status: MissionStatus
  approvalStatus: ApprovalStatus
  rejectionReason?: string
  approvalConditions?: string
  createdAt: string
  documents: Document[]
  actionLog: ActionLogEntry[]
}

export interface Document {
  id: string
  type: 'Risk Assessment' | 'Mission Summary' | 'Incident Report'
  missionId: string
  createdAt: string
  content: string
}

export interface ActionLogEntry {
  id: string
  action: string
  timestamp: string
  actor: string
}

export interface PilotProfile {
  id: string
  pilotId: string
  name: string
  phone: string
  certificates: Certificate[]
  insurance: Insurance[]
  flightHours: number
  registeredDrones: Drone[]
  approvalStatus: ApprovalStatus
  createdAt: string
}

export interface Notification {
  id: string
  pilotId: string
  message: string
  type: 'approval' | 'rejection' | 'update'
  read: boolean
  createdAt: string
}

export interface RecentActivity {
  id: string
  action: string
  actor: string
  timestamp: string
  detail: string
}
