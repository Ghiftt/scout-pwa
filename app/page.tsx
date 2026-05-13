"use client";

import { useEffect } from "react";
import { useScoutStore } from "./lib/store";
import FeedScreen from "./components/FeedScreen";
import DetailScreen from "./components/DetailScreen";
import CaptureScreen from "./components/CaptureScreen";
import ConfirmationScreen from "./components/ConfirmationScreen";

export default function Home() {
  const { currentScreen, initDemoMode } = useScoutStore();

  useEffect(() => {
    initDemoMode();
  }, [initDemoMode]);

  return (
    <main>
      {currentScreen === "feed" && <FeedScreen />}
      {currentScreen === "detail" && <DetailScreen />}
      {currentScreen === "capture" && <CaptureScreen />}
      {currentScreen === "confirmation" && <ConfirmationScreen />}
    </main>
  );
}