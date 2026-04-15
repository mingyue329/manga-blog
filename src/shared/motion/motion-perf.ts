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
  installed: boolean;
  mode: string;
  longTasks: Array<{ startTime: number; duration: number }>;
  cls: number;
  lcpMs?: number;
  routeTransitions: MotionPerfRouteEntry[];
  transitionStartTime?: number;
  transitionPathname?: string;
  transitionMode?: string;
  transitionLongTaskIndex?: number;
  transitionClsStart?: number;
};

declare global {
  interface Window {
    __motionPerf?: MotionPerfStore;
  }
}

function getStore(mode: string): MotionPerfStore {
  if (!window.__motionPerf) {
    window.__motionPerf = {
      installed: false,
      mode,
      longTasks: [],
      cls: 0,
      routeTransitions: [],
    };
  }

  window.__motionPerf.mode = mode;
  return window.__motionPerf;
}

export function installMotionPerf(mode: string): void {
  const store = getStore(mode);

  if (store.installed) {
    return;
  }

  store.installed = true;

  try {
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        store.longTasks.push({
          startTime: entry.startTime,
          duration: entry.duration,
        });
      }
    });
    longTaskObserver.observe({ type: "longtask", buffered: true });
  } catch {
    // noop
  }

  try {
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceEntry[]) {
        const layoutShift = entry as PerformanceEntry & {
          value?: number;
          hadRecentInput?: boolean;
        };

        if (layoutShift.hadRecentInput) {
          continue;
        }

        store.cls += layoutShift.value ?? 0;
      }
    });
    clsObserver.observe({ type: "layout-shift", buffered: true });
  } catch {
    // noop
  }

  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        store.lcpMs = lastEntry.startTime;
      }
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    // noop
  }
}

export function startRouteTransition({
  pathname,
  mode,
}: {
  pathname: string;
  mode: string;
}): void {
  const store = getStore(mode);

  if (store.transitionStartTime != null && store.transitionPathname) {
    endRouteTransition({ interrupted: true });
  }

  store.transitionStartTime = performance.now();
  store.transitionPathname = pathname;
  store.transitionMode = mode;
  store.transitionLongTaskIndex = store.longTasks.length;
  store.transitionClsStart = store.cls;
}

export function endRouteTransition({
  interrupted = false,
}: {
  interrupted?: boolean;
} = {}): MotionPerfRouteEntry | null {
  const store = window.__motionPerf;

  if (
    !store?.transitionStartTime ||
    !store.transitionPathname ||
    !store.transitionMode
  ) {
    return null;
  }

  const startTime = store.transitionStartTime;
  const pathname = store.transitionPathname;
  const mode = store.transitionMode;
  const longTaskIndex = store.transitionLongTaskIndex ?? store.longTasks.length;
  const clsStart = store.transitionClsStart ?? store.cls;
  const durationMs = performance.now() - startTime;
  const longTasks = store.longTasks.slice(longTaskIndex);
  const longTaskTotalMs = longTasks.reduce((sum, task) => sum + task.duration, 0);

  const entry: MotionPerfRouteEntry = {
    pathname,
    mode,
    durationMs: Math.round(durationMs),
    longTaskCount: longTasks.length,
    longTaskTotalMs: Math.round(longTaskTotalMs),
    clsDelta: Number((store.cls - clsStart).toFixed(4)),
    interrupted,
  };

  store.routeTransitions.push(entry);
  store.transitionStartTime = undefined;
  store.transitionPathname = undefined;
  store.transitionMode = undefined;
  store.transitionLongTaskIndex = undefined;
  store.transitionClsStart = undefined;

  return entry;
}

export function logLastTransition(): void {
  const store = window.__motionPerf;
  const last = store?.routeTransitions.at(-1);

  if (!last) {
    return;
  }

  console.log("[motion] transition", last);
}
