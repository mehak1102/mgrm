import { useCallback, useState } from "react";
import SplashScreen from "./SplashScreen";
import { isSplashSeen } from "../utils/splashGate";

export default function AppGate({ children }) {
  const [ready, setReady] = useState(isSplashSeen);
  const handleSplashFinish = useCallback(() => setReady(true), []);

  if (!ready) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return children;
}
