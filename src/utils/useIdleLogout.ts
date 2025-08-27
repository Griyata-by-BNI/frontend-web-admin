"use client";

import { useIdleTimer } from "react-idle-timer";
import { useEffect, useRef } from "react";

type UseIdleLogoutOpts = {
  timeoutMs?: number;
  onIdle: () => void;
  debug?: boolean;
};

export function useIdleLogout({
  timeoutMs = 120_000,
  onIdle,
  debug = false,
}: UseIdleLogoutOpts) {
  const bcRef = useRef<BroadcastChannel | null>(null);
  const loggedOutRef = useRef(false);

  const handleIdle = () => {
    if (loggedOutRef.current) return;
    loggedOutRef.current = true;
    bcRef.current?.postMessage({ type: "LOGOUT" });
    onIdle();
  };

  const { getRemainingTime } = useIdleTimer({
    timeout: timeoutMs,
    onIdle: handleIdle,
    debounce: 500,
    crossTab: true,
  });

  useEffect(() => {
    loggedOutRef.current = false;

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      bcRef.current = new BroadcastChannel("auth");
      bcRef.current.onmessage = (e) => {
        if (e.data?.type === "LOGOUT" && !loggedOutRef.current) {
          loggedOutRef.current = true;
          onIdle();
        }
      };
    }

    if (debug) {
      const interval = setInterval(() => {
        if (!loggedOutRef.current) {
          const remaining = Math.floor(getRemainingTime() / 1000);
          console.log(`[IdleDebug] Sisa ${remaining}s sebelum logout`);
        }
      }, 5000);
      return () => clearInterval(interval);
    }

    return () => {
      bcRef.current?.close();
    };
  }, [debug, getRemainingTime, onIdle]);
}
