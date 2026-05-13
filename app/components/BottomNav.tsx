"use client";

interface Props {
  active: "tasks" | "earnings" | "activity" | "profile";
  onNavigate: (screen: string) => void;
}

const NAV = [
  {
    key: "tasks", label: "Missions",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
  },
  {
    key: "earnings", label: "Earnings",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
  },
  {
    key: "activity", label: "Activity",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  },
  {
    key: "profile", label: "Profile",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  },
];

export default function BottomNav({ active, onNavigate }: Props) {
  return (
    <div style={{
      position: "fixed", bottom: 0,
      left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: "390px",
      background: "#F4F1EA",
      borderTop: "1px solid rgba(0,0,0,0.08)",
      display: "flex", justifyContent: "space-around",
      padding: "12px 0 28px",
      zIndex: 100,
    }}>
      {NAV.map(({ key, label, icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
              background: "none", border: "none", cursor: "pointer",
              color: isActive ? "#173726" : "rgba(0,0,0,0.3)",
              transition: "color 0.15s",
            }}
          >
            {icon}
            <span style={{
              fontSize: "10px",
              fontWeight: isActive ? 600 : 400,
              letterSpacing: "0.02em",
              fontFamily: "'DM Sans', sans-serif",
            }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}