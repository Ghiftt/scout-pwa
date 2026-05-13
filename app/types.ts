export type TaskType = "Verify" | "Execute";

export type TaskStatus =
  | "Open"
  | "Accepted"
  | "Submitted"
  | "Verified"
  | "Failed"
  | "Expired"
  | "Cancelled"
  | "Rejected";

export interface Task {
  id: string;
  taskId: string;
  type: TaskType;
  title: string;
  description: string;
  instructions: string;
  successCriteria: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
    radiusMeters: number;
  };
  distanceMiles: number;
  timeoutMinutes: number;
  paymentUsdc: number;
  minConfidence: number;
  status: TaskStatus;
  createdAt: number;
  expiresAt: number;
  proofRequired: string[];
  agent: string;
  checkpointHash: string;
}

export interface Attestation {
  taskId: string;
  scout: string;
  agent: string;
  confidenceBps: number;
  checkpointHash: string;
  captureHash: string;
  timestamp: number;
  txHash: string;
}

export interface ScoutSession {
  address: string;
  isDemo: boolean;
  totalEarnings: number;
  tasksCompleted: number;
}

export interface CaptureBundle {
  taskId: string;
  videoBlob: Blob;
  latitude: number;
  longitude: number;
  timestamp: number;
  bundleHash: string;
}