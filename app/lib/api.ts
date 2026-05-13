import { Task, Attestation } from "../types";
import { DEMO_TASKS, DEMO_ATTESTATION } from "./demo-tasks";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

// ── TASKS ──────────────────────────────────────────

export async function fetchTasks(): Promise<Task[]> {
  if (IS_DEMO) {
    await sleep(600);
    return DEMO_TASKS;
  }

  try {
    const res = await fetch(`${API_BASE}/tasks`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  } catch {
    return DEMO_TASKS;
  }
}

export async function fetchTask(taskId: string): Promise<Task | null> {
  if (IS_DEMO) {
    await sleep(300);
    return DEMO_TASKS.find((t) => t.taskId === taskId) || null;
  }

  try {
    const res = await fetch(`${API_BASE}/task/${taskId}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function acceptTask(
  taskId: string,
  scoutAddress: string
): Promise<{ success: boolean; error?: string }> {
  if (IS_DEMO) {
    await sleep(800);
    return { success: true };
  }

  try {
    const res = await fetch(`${API_BASE}/task/${taskId}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scoutAddress }),
    });
    if (!res.ok) throw new Error("Failed to accept task");
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// ── PROOF SUBMISSION ───────────────────────────────

export async function submitProof(
  taskId: string,
  videoBlob: Blob,
  latitude: number,
  longitude: number,
  ipfsSpecHash: string
): Promise<{
  success: boolean;
  score?: number;
  attestationTxHash?: string;
  error?: string;
}> {
  if (IS_DEMO) {
    await sleep(2500);
    return {
      success: true,
      score: 9100,
      attestationTxHash: DEMO_ATTESTATION.txHash,
    };
  }

  try {
    const formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("video", videoBlob, "capture.webm");
    formData.append("latitude", String(latitude));
    formData.append("longitude", String(longitude));
    formData.append("timestamp", String(Date.now()));
    formData.append("ipfsSpecHash", ipfsSpecHash);

    const res = await fetch(`/api/verify`, {
  method: "POST",
  body: formData,
});

    if (!res.ok) throw new Error("Verification failed");
    return res.json();
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// ── ATTESTATION ────────────────────────────────────

export async function fetchAttestation(
  taskId: string
): Promise<Attestation | null> {
  if (IS_DEMO) {
    await sleep(400);
    return DEMO_ATTESTATION;
  }

  try {
    const res = await fetch(`${API_BASE}/attestation/${taskId}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── HELPERS ────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}