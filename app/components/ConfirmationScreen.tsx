"use client";

import { useEffect, useState } from "react";
import { useScoutStore } from "../lib/store";
import { fetchAttestation } from "../lib/api";
import { Attestation } from "../types";
import { shortenHash } from "../lib/utils";
import { DEMO_ATTESTATION } from "../lib/demo-tasks";

export default function ConfirmationScreen() {
  const { activeTask, setScreen, setActiveTask, captureURI } = useScoutStore();
  const [attestation, setAttestation] = useState<Attestation | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!activeTask) return;
    fetchAttestation(activeTask.taskId).then((a) => {
      setAttestation(a);
      setLoading(false);
    });
  }, [activeTask]);

  function handleDone() {
    setActiveTask(null);
    setScreen("feed");
  }

  function copyHash() {
    navigator.clipboard.writeText(att.txHash).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const payment = activeTask?.paymentUsdc ?? 15.0;
  const att = attestation ?? DEMO_ATTESTATION;
  const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh", background: "#F4F1EA" }}>
      <div style={{ padding: "56px 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: "9px solid #173726" }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", letterSpacing: "0.12em", color: "#131313", fontWeight: 600 }}>SCOUT</span>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 120px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "16px", paddingBottom: "28px" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#173726", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>Task completed.</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "64px", fontWeight: 600, color: "#131313", lineHeight: 0.95, letterSpacing: "-0.04em", textAlign: "center" }}>Payment<br />confirmed.</h1>
        </div>
        <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "16px", padding: "16px", marginBottom: "10px" }}>
          <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>Attestation ID</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", color: "#131313" }}>{loading ? "Loading..." : shortenHash(att.txHash, 8)}</span>
            <button onClick={copyHash} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.4)", fontSize: "11px", fontFamily: "'DM Sans', sans-serif" }}>{copied ? "Copied" : "Copy"}</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
          <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "16px", padding: "16px" }}>
            <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>Confidence score</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "18px", fontWeight: 500, color: "#131313" }}>{loading ? "..." : (att.confidenceBps / 10000).toFixed(2)}</div>
          </div>
          <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "16px", padding: "16px" }}>
            <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>Network</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "18px", fontWeight: 500, color: "#131313" }}>KITE</div>
          </div>
        </div>
        <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "16px", padding: "20px 16px", marginBottom: "10px" }}>
          <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>Payout amount</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "14px" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "80px", fontWeight: 700, color: "#131313", lineHeight: 1, letterSpacing: "-0.04em" }}>${payment.toFixed(2)}</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(0,0,0,0.4)", fontFamily: "'DM Sans', sans-serif" }}>USDC</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
              <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.5)", fontFamily: "'DM Sans', sans-serif" }}>On-chain settlement confirmed</span>
            </div>
            <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.35)", fontFamily: "'DM Mono', monospace" }}>{dateStr}</span>
          </div>
        </div>
      </div>
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "390px", padding: "16px 20px 36px", background: "#F4F1EA", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <a href={captureURI ?? "https://testnet.kitescan.ai/tx/" + att.txHash} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", width: "100%", background: "#173726", color: "white", borderRadius: "16px", padding: "18px", fontSize: "16px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}>
          View on Kite explorer
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
        <button onClick={handleDone} style={{ background: "none", border: "none", color: "rgba(0,0,0,0.5)", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", padding: "8px" }}>Back to missions</button>
      </div>
    </div>
  );
}
