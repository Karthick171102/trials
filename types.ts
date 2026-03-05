
export type IncidentSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type IncidentStatus = 'New' | 'In Progress' | 'Resolved' | 'Closed';

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  detected: string;
  assignedTo: string;
  system: string;
}

export type ThreatType = 'Malware' | 'Phishing' | 'DDoS' | 'Vulnerability' | 'Insider Threat';

export interface Threat {
    id: string;
    title: string;
    type: ThreatType;
    severity: IncidentSeverity;
    cvss: number | null;
    source: string;
    detected: string;
    isNew: boolean;
    affectedPlatforms: string[];
}

export type PlaybookAutomationLevel = 'Fully Automated' | 'Semi-Automated' | 'Manual';
export type PlaybookTaskType = 'Containment' | 'Investigation' | 'Remediation' | 'Notification';

export interface Playbook {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  timesTriggered: number;
  automationLevel: PlaybookAutomationLevel;
  taskType: PlaybookTaskType;
  steps: { name: string; description: string; enabled: boolean }[];
}

export type AssetStatus = 'Secure' | 'Threat Detected' | 'Isolated';
export type AssetType = 'Workstation' | 'Server' | 'IoT' | 'Mobile';

export interface Asset {
  id: string;
  name: string;
  status: AssetStatus;
  type: AssetType;
  ipAddress: string;
  lastCheckin: string;
  tags: string[];
}

export type UserRole = 'Admin' | 'Lead Analyst' | 'Analyst' | 'Client';
export type UserStatus = 'Active' | 'Invited' | 'Disabled';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
  avatarUrl: string;
}