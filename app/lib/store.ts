import { create } from "zustand";
import { Task, ScoutSession } from "../types";
import { DEMO_TASKS, DEMO_SESSION } from "./demo-tasks";

interface ScoutStore {
  // Session
  session: ScoutSession | null;
  setSession: (session: ScoutSession) => void;
  clearSession: () => void;

  // Tasks
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  activeTask: Task | null;
  setActiveTask: (task: Task | null) => void;

  // UI state
  currentScreen: "feed" | "detail" | "capture" | "confirmation";
  setScreen: (screen: "feed" | "detail" | "capture" | "confirmation") => void;

  // Capture
  capturedVideo: Blob | null;
  setCapturedVideo: (video: Blob | null) => void;
  captureLocation: { lat: number; lng: number } | null;
  setCaptureLocation: (location: { lat: number; lng: number } | null) => void;

  // Demo mode
  isDemoMode: boolean;
  initDemoMode: () => void;
}

export const useScoutStore = create<ScoutStore>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null }),

  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  activeTask: null,
  setActiveTask: (task) => set({ activeTask: task }),

  currentScreen: "feed",
  setScreen: (screen) => set({ currentScreen: screen }),

  capturedVideo: null,
  setCapturedVideo: (video) => set({ capturedVideo: video }),
  captureLocation: null,
  setCaptureLocation: (location) => set({ captureLocation: location }),

  isDemoMode: true,
  initDemoMode: () =>
    set({
      session: DEMO_SESSION,
      tasks: DEMO_TASKS,
      isDemoMode: true,
    }),
}));