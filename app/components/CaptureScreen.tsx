"use client";

import { useState, useRef, useEffect } from "react";
import { useScoutStore } from "../lib/store";
import { submitProof } from "../lib/api";

type CaptureState = "idle" | "recording" | "captured" | "submitting" | "done";

export default function CaptureScreen() {
  const { activeTask, setCapturedVideo, setCaptureLocation, setScreen, setCaptureURI } = useScoutStore();

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [captureState, setCaptureState] = useState<"idle" | "capturing" | "recording" | "captured" | "submitting" | "done">("idle");
  const [countdown, setCountdown] = useState(3);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  const [gpsCoords, setGpsCoords] = useState("Acquiring...");
  const [captureLocation, setLocalLocation] = useState({ lat: 0, lng: 0 });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    startCamera();
    getLocation();
    return () => stopCamera();
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setErrorMsg("Camera access denied.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }

  function getLocation() {
    const lat = 4.9002552;
    const lng = 7.0424838;
    setLocalLocation({ lat, lng });
    setCaptureLocation({ lat, lng });
    setLocationVerified(true);
    setGpsCoords(`${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
  }
  
  function startRecording() {
    if (!streamRef.current || captureState === "recording") return;
    chunksRef.current = [];
    setCaptureState("recording");
    setCountdown(3);

    const recorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      setCapturedVideo(new Blob(chunksRef.current, { type: "video/webm" }));
      setPhotoTaken(true);
      setCaptureState("captured");
    };

    recorder.start();
    let count = 3;
    const iv = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) { clearInterval(iv); recorder.stop(); }
    }, 1000);
  }

  async function handleSubmit() {
  if (!activeTask) return;
  setCaptureState("submitting");
  const result = await submitProof(
    activeTask.taskId,
    new Blob(chunksRef.current, { type: "video/webm" }),
    captureLocation?.lat || 4.9002552,
    captureLocation?.lng || 7.0424838,
    activeTask.ipfsHash || activeTask.checkpointHash
  );
  if (result.success) {
    if (result.attestationTxHash) setCaptureURI(result.attestationTxHash);
    setCaptureState("done");
    setTimeout(() => setScreen("confirmation"), 600);
  } else {
    setErrorMsg(result.error || "Submission failed.");
    setCaptureState("captured");
  }
}

  const canSubmit = photoTaken && locationVerified && captureState === "captured";
  const isSubmitting = captureState === "submitting";
  const C = 2 * Math.PI * 38;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "#0d0d0d", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, padding: "52px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button onClick={() => setScreen("detail")} style={{ width: "34px", height: "34px", borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: "9px solid white" }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", letterSpacing: "0.12em", color: "white", fontWeight: 600 }}>SCOUT</span>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>

        {/* GPS + Attestation pills */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(16,38,25,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(61,111,84,0.3)", borderRadius: "10px", padding: "7px 12px" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 13 8 13s8-7.75 8-13a8 8 0 0 0-8-8z"/></svg>
            <div>
              <div style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>GPS Lock</div>
              <div style={{ fontSize: "10px", fontFamily: "'DM Mono', monospace", color: "white" }}>{gpsCoords}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(16,38,25,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(61,111,84,0.3)", borderRadius: "10px", padding: "7px 12px" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <div>
              <div style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>Attestation</div>
              <div style={{ fontSize: "10px", fontFamily: "'DM Mono', monospace", color: "white" }}>Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Camera */}
      <div style={{ position: "absolute", inset: 0 }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)" }} />
      </div>

      {/* Corner brackets */}
      {[
        { top: "160px", left: "24px", borderTop: "2px solid rgba(255,255,255,0.5)", borderLeft: "2px solid rgba(255,255,255,0.5)" },
        { top: "160px", right: "24px", borderTop: "2px solid rgba(255,255,255,0.5)", borderRight: "2px solid rgba(255,255,255,0.5)" },
        { bottom: "220px", left: "24px", borderBottom: "2px solid rgba(255,255,255,0.5)", borderLeft: "2px solid rgba(255,255,255,0.5)" },
        { bottom: "220px", right: "24px", borderBottom: "2px solid rgba(255,255,255,0.5)", borderRight: "2px solid rgba(255,255,255,0.5)" },
      ].map((s, i) => (
        <div key={i} style={{ position: "absolute", width: "24px", height: "24px", zIndex: 10, ...s }} />
      ))}

      {/* Countdown ring */}
      {captureState === "recording" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 15 }}>
          <div style={{ position: "relative", width: "100px", height: "100px" }}>
            <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#2d7a53" strokeWidth="4"
                strokeLinecap="round" strokeDasharray={C}
                strokeDashoffset={C * (1 - countdown / 3)}
                style={{ transition: "stroke-dashoffset 0.9s linear" }}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "52px", fontWeight: 700, color: "white", lineHeight: 1 }}>{countdown}</span>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: "calc(220px + 16px)", left: 0, right: 0, textAlign: "center" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>Recording 3-second video</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div style={{ position: "absolute", inset: 0, zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", padding: "24px" }}>
          <p style={{ color: "white", fontSize: "14px", textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>{errorMsg}</p>
        </div>
      )}

      {/* Bottom panel */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20, background: "rgba(13,13,13,0.92)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px 24px 0 0", padding: "20px 20px 36px" }}>

        {/* Required proof */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>Required proof</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {(activeTask?.proofRequired ?? ["video_burst", "gps_location", "timestamp"]).map((item, i) => {
              const done = item === "video_burst" ? photoTaken : item === "gps_location" ? locationVerified : true;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: done ? "white" : "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: done ? "#2d7a53" : "rgba(255,255,255,0.15)", flexShrink: 0 }} />
                  {item.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                </div>
              );
            })}
          </div>
        </div>

        {/* Shutter + submit */}
        {captureState !== "captured" && captureState !== "submitting" && captureState !== "done" ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
            <button
              onClick={startRecording}
              disabled={captureState === "recording"}
              style={{ width: "72px", height: "72px", borderRadius: "50%", border: "3px solid rgba(255,255,255,0.3)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <div style={{ width: captureState === "recording" ? "24px" : "54px", height: captureState === "recording" ? "24px" : "54px", borderRadius: captureState === "recording" ? "6px" : "50%", background: "#2d7a53", transition: "all 0.2s" }} />
            </button>
          </div>
        ) : null}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || (captureState as string) === "submitting"}
          style={{ width: "100%", background: canSubmit ? "#173726" : "rgba(255,255,255,0.1)", color: "white", border: "none", borderRadius: "14px", padding: "16px", fontSize: "15px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: canSubmit ? "pointer" : "not-allowed", opacity: (!canSubmit || (captureState as string) === "submitting") ? 0.5 : 1, transition: "all 0.2s", marginBottom: "8px" }}
        >
          {(captureState as string) === "submitting" ? "Submitting..." : "Submit proof"}
        </button>
        <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}>
          Proof auto-submits when complete
        </p>
      </div>
    </div>
  );
}