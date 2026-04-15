import { useEffect, useState, type ReactElement } from "react";

type MotionPerfRouteEntry = {
  pathname: string;
  mode: string;
  durationMs: number;
  longTaskCount: number;
  longTaskTotalMs: number;
  clsDelta: number;
  interrupted: boolean;
};

type MotionPerfStore = {
  routeTransitions: MotionPerfRouteEntry[];
  cls: number;
  lcpMs?: number;
};

function getSnapshot(): MotionPerfStore | null {
  const store = window.__motionPerf;

  if (!store) {
    return null;
  }

  return {
    routeTransitions: store.routeTransitions.slice(-6),
    cls: store.cls,
    lcpMs: store.lcpMs,
  };
}

export function MotionPerfHud(): ReactElement | null {
  const [snapshot, setSnapshot] = useState<MotionPerfStore | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSnapshot(getSnapshot());
    }, 250);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  if (!snapshot) {
    return null;
  }

  return (
    <pre
      role="status"
      aria-label="Motion Perf"
      className="pointer-events-none fixed bottom-3 right-3 z-[100] max-w-[min(720px,calc(100vw-24px))] whitespace-pre-wrap rounded-lg bg-black/70 p-3 text-[13px] leading-5 text-white"
    >
      {JSON.stringify(snapshot, null, 2)}
    </pre>
  );
}
