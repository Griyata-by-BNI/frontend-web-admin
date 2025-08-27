"use client";

import { useIdleTime } from "@/contexts/IdleTimeContext";
import { useEffect, useState } from "react";

export default function IdleTimer() {
  const { getRemainingTime } = useIdleTime();
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.floor(getRemainingTime() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [getRemainingTime]);

  if (remaining <= 0) return null;

  return (
    <div className="text-sm text-gray-500">
      Auto logout in: {remaining}s
    </div>
  );
}