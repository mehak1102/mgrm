import { useState } from "react";
import SplashScreen from "./SplashScreen";
import { isSplashSeen } from "../utils/splashGate";

export default function AppGate({ children }) {
  const [ready, setReady] = useState(isSplashSeen);

  if (!ready) {
    return <SplashScreen onFinish={() => setReady(true)} />;
  }

  return children;
}
