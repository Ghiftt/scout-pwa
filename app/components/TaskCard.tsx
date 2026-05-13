"use client";

import { Task } from "../types";

interface Props {
  task: Task;
  onAccept: (task: Task) => void;
}

export default function TaskCard({ task, onAccept }: Props) {
  const isVerify = task.type === "Verify";

  return (
    <div style={{
      background: "white",
      border: "1px solid rgba(0,0,0,0.07)",
      borderRadius: "20px",
      padding: "18px",
      marginBottom: "10px",
    }}>
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <span style={{
          fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: isVerify ? "#173726" : "#5a3d17",
          background: isVerify ? "#eaf3de" : "#f3ead8",
          border: `1px solid ${isVerify ? "#b8d99a" : "#d9c09a"}`,
          borderRadius: "6px", padding: "3px 8px",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {task.type}
        </span>
        <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.35)", fontFamily: "'DM Mono', monospace" }}>
          {task.timeoutMinutes} min
        </span>
      </div>

      {/* Title + payout */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px", gap: "12px" }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "22px", fontWeight: 600, color: "#131313",
          lineHeight: 1.15, letterSpacing: "-0.02em", flex: 1,
        }}>
          {task.title}
        </h3>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "32px", fontWeight: 700, color: "#131313", lineHeight: 1,
          }}>
            ${task.paymentUsdc.toFixed(2)}
          </div>
          <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", color: "rgba(0,0,0,0.4)", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
            USDC
          </div>
        </div>
      </div>

      {/* Location */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "14px", color: "rgba(0,0,0,0.4)", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 13 8 13s8-7.75 8-13a8 8 0 0 0-8-8z"/>
        </svg>
        {task.distanceMiles.toFixed(1)} mi away · {task.location.address.split(",")[0]}
      </div>

      {/* CTA */}
      <button
        onClick={() => onAccept(task)}
        style={{
          width: "100%", background: "#173726", color: "white",
          border: "none", borderRadius: "14px", padding: "14px",
          fontSize: "14px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer", letterSpacing: "0.01em",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
        }}
      >
        Accept mission →
      </button>
    </div>
  );
}