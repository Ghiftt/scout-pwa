"use client";

import { useEffect } from "react";
import { useScoutStore } from "../lib/store";
import { fetchTasks } from "../lib/api";
import { Task } from "../types";
import TaskCard from "./TaskCard";
import BottomNav from "./BottomNav";

export default function FeedScreen() {
  const { tasks, setTasks, setActiveTask, setScreen } = useScoutStore();

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, [setTasks]);

  function handleAccept(task: Task) {
    setActiveTask(task);
    setScreen("detail");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh", background: "#F4F1EA" }}>

      {/* Header */}
      <div style={{ padding: "56px 20px 20px", background: "#F4F1EA" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: "9px solid #173726" }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", letterSpacing: "0.12em", color: "#131313", fontWeight: 600 }}>SCOUT</span>
          </div>
          <button style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(0,0,0,0.05)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#131313" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "52px", fontWeight: 600, color: "#131313",
          lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: "8px",
        }}>
          Welcome back,<br />Scout.
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.45)", fontFamily: "'DM Sans', sans-serif" }}>
          You are online and ready for dispatch.
        </p>
      </div>

      {/* Live missions card */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{
          background: "#173726", borderRadius: "20px",
          padding: "18px 22px",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>
              Live missions near you
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80" }} />
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>Live</span>
            </div>
          </div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "72px", fontWeight: 700, color: "white", lineHeight: 1,
          }}>
            {String(tasks.length).padStart(2, "0")}
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>
            Updated just now
          </div>
        </div>
      </div>

      {/* Task list */}
      <div style={{ flex: 1, padding: "0 20px 100px", overflowY: "auto" }}>
        <div style={{
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "rgba(0,0,0,0.3)",
          fontFamily: "'DM Sans', sans-serif", marginBottom: "12px", paddingTop: "4px",
        }}>
          Nearby tasks
        </div>

        {tasks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0", color: "rgba(0,0,0,0.3)", fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>
            Loading missions...
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onAccept={handleAccept} />
          ))
        )}
      </div>

      <BottomNav active="tasks" onNavigate={() => {}} />
    </div>
  );
}