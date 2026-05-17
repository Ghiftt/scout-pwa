"use client";

import { useState, useEffect } from "react";
import { useScoutStore } from "../lib/store";
import { formatUsdc, formatTimeRemaining } from "../lib/utils";
import { acceptTask } from "../lib/api";

export default function DetailScreen() {
  const { activeTask, setScreen } = useScoutStore();
  const [timeRemaining, setTimeRemaining] = useState("");
  const [accepting, setAccepting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!activeTask) return;
    const update = () => setTimeRemaining(formatTimeRemaining(activeTask.expiresAt));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [activeTask]);

  if (!activeTask) return null;

  const isVerify = activeTask.type === "Verify";

  async function handleAccept() {
  setAccepting(true);
  setErrorMsg("");

  const result = await acceptTask(
    activeTask?.taskId ?? "",
    "0x0000000000000000000000000000000000000001"
  );

  if (!result.success) {
    setErrorMsg(result.error || "Failed to accept task. Try again.");
    setAccepting(false);
    return;
  }

  setScreen("capture");
}

  const missionId = `SC-${activeTask.taskId.slice(2, 7).toUpperCase()}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh", background: "#F4F1EA" }}>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "56px 20px 16px", background: "#F4F1EA",
      }}>
        {errorMsg && (
  <p style={{
    color: "#c0392b",
    fontSize: "12px",
    textAlign: "center",
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: "8px"
  }}>
    {errorMsg}
  </p>
)}
        <button onClick={() => setScreen("feed")} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(0,0,0,0.06)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#131313" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: "9px solid #173726" }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", letterSpacing: "0.12em", color: "#131313", fontWeight: 600 }}>SCOUT</span>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: "120px" }}>

        {/* Mission badge + ID */}
        <div style={{ padding: "8px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
            color: isVerify ? "#173726" : "#5a3d17",
            background: isVerify ? "#eaf3de" : "#f3ead8",
            border: `1px solid ${isVerify ? "#b8d99a" : "#d9c09a"}`,
            borderRadius: "6px", padding: "3px 8px",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {activeTask.type} Mission
          </span>
          <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.35)", fontFamily: "'DM Mono', monospace" }}>
            Mission ID {missionId}
          </span>
        </div>

        {/* Title + payout */}
        <div style={{ padding: "14px 20px 16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "42px", fontWeight: 600, color: "#131313",
            lineHeight: 1.0, letterSpacing: "-0.03em", flex: 1,
          }}>
            {activeTask.title}
          </h1>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "52px", fontWeight: 700, color: "#131313", lineHeight: 1 }}>
              ${activeTask.paymentUsdc.toFixed(2)}
            </div>
            <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", color: "rgba(0,0,0,0.4)", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>USDC</div>
            <div style={{ fontSize: "10px", color: "rgba(0,0,0,0.35)", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>Payout locked</div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ margin: "0 20px 16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "16px", overflow: "hidden", background: "white" }}>
          {[
            { label: "Radius", value: `${activeTask.distanceMiles.toFixed(1)} mi` },
            { label: "Time window", value: `${activeTask.timeoutMinutes} min` },
            { label: "Payout", value: `$${activeTask.paymentUsdc.toFixed(2)}` },
          ].map(({ label, value }, i) => (
            <div key={label} style={{
              padding: "14px 12px",
              borderRight: i < 2 ? "1px solid rgba(0,0,0,0.07)" : "none",
            }}>
              <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: "6px" }}>{label}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, color: "#131313" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* What to confirm */}
        <div style={{ padding: "0 20px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>What to confirm</div>
          <p style={{ fontSize: "14px", color: "rgba(0,0,0,0.7)", lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>{activeTask.instructions}</p>
        </div>

        {/* Success criteria */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>Success criteria</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {activeTask.successCriteria.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "rgba(0,0,0,0.7)", fontFamily: "'DM Sans', sans-serif" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#173726" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* Map placeholder */}
        <div style={{ margin: "16px 20px", background: "#e8e4da", borderRadius: "16px", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(23,55,38,0.08) 0%, transparent 70%)" }} />
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(23,55,38,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#173726" }} />
          </div>
          <div style={{ position: "absolute", bottom: "10px", right: "12px", background: "rgba(255,255,255,0.9)", borderRadius: "8px", padding: "4px 8px", fontSize: "10px", fontFamily: "'DM Mono', monospace", color: "#131313" }}>
            {activeTask.distanceMiles.toFixed(1)} mi radius
          </div>
        </div>

        {/* Pre-auth notice + timer */}
        <div style={{ margin: "0 20px 16px", background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "16px", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.5)", fontFamily: "'DM Sans', sans-serif" }}>Payout is pre-authorized and cannot be withheld.</span>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "12px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "20px", fontWeight: 500, color: "#131313" }}>{timeRemaining}</div>
            <div style={{ fontSize: "9px", color: "rgba(0,0,0,0.35)", fontFamily: "'DM Sans', sans-serif" }}>Time remaining</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "390px", padding: "16px 20px 36px", background: "#F4F1EA", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        <button
          onClick={handleAccept}
          disabled={accepting}
          style={{ width: "100%", background: "#173726", color: "white", border: "none", borderRadius: "16px", padding: "18px", fontSize: "16px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", opacity: accepting ? 0.7 : 1, transition: "opacity 0.15s" }}
        >
          {accepting ? "Accepting..." : "Accept mission"}
        </button>
      </div>
    </div>
  );
}