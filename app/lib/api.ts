import { Task, Attestation } from "../types";
import { DEMO_TASKS, DEMO_ATTESTATION } from "./demo-tasks";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

// ── TASKS ──────────────────────────────────────────────────────

export async function fetchTasks(): Promise<Task[]> {
  try {
    const res = await fetch(`${API_BASE}/tasks`);
    if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.status}`);
    const realTasks = await res.json();
    return [...realTasks, ...DEMO_TASKS];
  } catch (e) {
    console.error("fetchTasks failed, falling back to demo:", e);
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
      body: JSON.stringify({ scoutAddress: "0x9751f803b48378aC9d4ab1Ee1ABdEc756067a1D7" }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: string };
      throw new Error(err.error || `Accept failed: ${res.status}`);
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// ── PROOF SUBMISSION ───────────────────────────────────────────
// Backend verification.ts CaptureBundle expects:
// { taskId, scoutAddress, videoBase64, videoMimeType,
//   gps: { lat, lng, accuracy, timestamp },
//   deviceTimestamp, bundleHash }

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
    // Convert video blob to base64
    const videoBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]); // strip data URL prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(videoBlob);
    });

    const videoMimeType = videoBlob.type || "video/webm";
    const deviceTimestamp = Math.floor(Date.now() / 1000);

    // Compute bundle hash to match verification.ts verifyBundleHash()
    const gpsPayload = { lat: latitude, lng: longitude, accuracy: 10, timestamp: deviceTimestamp };
    const bundleHashInput = JSON.stringify({
  videoBase64,
  gps: {
    lat: gpsPayload.lat,
    lng: gpsPayload.lng,
    accuracy: gpsPayload.accuracy,
    timestamp: gpsPayload.timestamp
  },
  deviceTimestamp,
});
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(bundleHashInput));
    const bundleHash = "0x" + Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const bundle = {
      taskId,
      scoutAddress: "0x9751f803b48378aC9d4ab1Ee1ABdEc756067a1D7",
      videoBase64,
      videoMimeType,
      gps: gpsPayload,
      deviceTimestamp,
      bundleHash,
    };

    const res = await fetch(`${API_BASE}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "scout-internal-key-change-this-in-production",
      },
      body: JSON.stringify({
        bundle,
        ipfsSpecHash,
        erc3009Sig: {
          v: 27,
          r: "0x0000000000000000000000000000000000000000000000000000000000000001",
          s: "0x0000000000000000000000000000000000000000000000000000000000000001",
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: string };
      throw new Error(err.error || `Verification failed: ${res.status}`);
    }

    const data = await res.json() as {
      passed: boolean;
      confidenceScore: number;
      captureURI: string;
      reason: string;
    };

    return {
      success: data.passed,
      score: data.confidenceScore,
      attestationTxHash: data.captureURI,
      error: data.passed ? undefined : data.reason,
    };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// ── ATTESTATION ────────────────────────────────────────────────

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

// ── HELPERS ────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}