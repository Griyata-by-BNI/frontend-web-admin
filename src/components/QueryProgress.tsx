"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useProgress } from "@bprogress/next";
import { useEffect } from "react";

export default function QueryProgress() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const progress = useProgress();

  const active = isFetching + isMutating > 0;

  useEffect(() => {
    if (active) {
      progress.start();
    } else {
      progress.stop();
    }
  }, [active, progress]);

  return null;
}
