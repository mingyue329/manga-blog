import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

import {
  buildThemeToneColor,
  clampThemeHue,
  clampThemeContrastIndex,
  CONTRAST_TONE_STORAGE_KEY,
  DEFAULT_CONTRAST_TONE_INDEX,
  DEFAULT_THEME_HUE,
  findThemeContrastIndex,
  HUE_STORAGE_KEY,
  LEGACY_INK_COLOR_STORAGE_KEY,
  LEGACY_PAPER_COLOR_STORAGE_KEY,
  THEME_CONTRAST_OPTIONS,
  THEME_STORAGE_KEY,
  type ThemeContrastOption,
} from "@/shared/site/theme-options";

type SiteTheme = "light" | "dark" | "system";
type ResolvedSiteTheme = "light" | "dark";

interface ThemeContextValue {
  theme: SiteTheme;
  resolvedTheme: ResolvedSiteTheme;
  hue: number;
  contrastToneIndex: number;
  contrastToneLabel: string;
  contrastToneOptions: readonly ThemeContrastOption[];
  paperColor: string;
  inkColor: string;
  toggleTheme: () => void;
  setTheme: (value: SiteTheme) => void;
  setHue: (value: number) => void;
  setContrastToneIndex: (value: number) => void;
  resetThemeColors: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * 读取系统当前的明暗模式。
 * 当用户选择 `system` 时，最终主题会跟随这里的结果变化。
 */
function getSystemTheme(): ResolvedSiteTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * 解析当前真正应用到页面上的主题。
 * 只有 `system` 需要额外依赖系统结果，其它模式直接返回自身。
 */
function resolveTheme(
  theme: SiteTheme,
  systemTheme: ResolvedSiteTheme,
): ResolvedSiteTheme {
  if (theme === "system") {
    return systemTheme;
  }

  return theme;
}

/**
 * 把解析后的主题写入根节点。
 * `data-theme-mode` 保留用户选择，`data-theme` 保留最终生效结果，后续样式可以同时利用这两个状态。
 */
function applyTheme(theme: SiteTheme, resolvedTheme: ResolvedSiteTheme): void {
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.dataset.themeMode = theme;
}

/**
 * 按顺序循环切换主题模式。
 * 头部原有图标按钮会复用这个顺序，在三种模式之间来回切换。
 */
function getNextTheme(theme: SiteTheme): SiteTheme {
  if (theme === "light") {
    return "dark";
  }

  if (theme === "dark") {
    return "system";
  }

  return "light";
}

/**
 * 把主题色相与色阶写入根节点变量。
 * 页面里的纸面色、墨色和衍生层级都依赖这些基础变量再继续混色。
 */
function applyThemeColors(hue: number, contrastToneIndex: number): void {
  const contrastOption = THEME_CONTRAST_OPTIONS[contrastToneIndex];

  document.documentElement.style.setProperty(
    "--theme-paper-base",
    buildThemeToneColor(contrastOption.paper, hue),
  );
  document.documentElement.style.setProperty(
    "--theme-ink-base",
    buildThemeToneColor(contrastOption.ink, hue),
  );
  document.documentElement.style.setProperty("--theme-hue", String(hue));
}

/**
 * 读取本地存储的对比档位。
 * 新版本优先读取统一档位；如果没有，再尝试从旧的纸色/墨色缓存回推。
 */
function getStoredThemeContrastIndex(): number {
  if (typeof window === "undefined") {
    return DEFAULT_CONTRAST_TONE_INDEX;
  }

  const storedIndex = window.localStorage.getItem(CONTRAST_TONE_STORAGE_KEY);

  if (storedIndex !== null) {
    return clampThemeContrastIndex(
      Number.parseInt(storedIndex, 10),
      THEME_CONTRAST_OPTIONS,
    );
  }

  const legacyPaperColor = window.localStorage.getItem(
    LEGACY_PAPER_COLOR_STORAGE_KEY,
  );
  const legacyInkColor = window.localStorage.getItem(
    LEGACY_INK_COLOR_STORAGE_KEY,
  );
  const legacyIndex = findThemeContrastIndex(
    THEME_CONTRAST_OPTIONS,
    legacyPaperColor,
    legacyInkColor,
  );

  return legacyIndex >= 0 ? legacyIndex : DEFAULT_CONTRAST_TONE_INDEX;
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [theme, setTheme] = useState<SiteTheme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (
      savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "system"
    ) {
      return savedTheme;
    }

    return "system";
  });
  const [systemTheme, setSystemTheme] =
    useState<ResolvedSiteTheme>(getSystemTheme);
  const [hue, setHue] = useState<number>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_THEME_HUE;
    }

    return clampThemeHue(
      Number.parseInt(
        window.localStorage.getItem(HUE_STORAGE_KEY) ?? `${DEFAULT_THEME_HUE}`,
        10,
      ),
    );
  });
  const [contrastToneIndex, setContrastToneIndex] = useState<number>(
    getStoredThemeContrastIndex,
  );
  const contrastToneOption = THEME_CONTRAST_OPTIONS[contrastToneIndex];
  const resolvedTheme = resolveTheme(theme, systemTheme);
  const paperColor = buildThemeToneColor(contrastToneOption.paper, hue);
  const inkColor = buildThemeToneColor(contrastToneOption.ink, hue);

  useEffect(() => {
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

    /**
     * 同步系统主题状态。
     * 只要操作系统主题变化，这里的解析结果就会自动刷新。
     */
    function handleChange(): void {
      setSystemTheme(mediaQueryList.matches ? "dark" : "light");
    }

    handleChange();

    mediaQueryList.addEventListener("change", handleChange);

    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    applyTheme(theme, resolvedTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [resolvedTheme, theme]);

  useEffect(() => {
    applyThemeColors(hue, contrastToneIndex);
    window.localStorage.setItem(HUE_STORAGE_KEY, String(hue));
    window.localStorage.setItem(
      CONTRAST_TONE_STORAGE_KEY,
      String(contrastToneIndex),
    );
    window.localStorage.setItem(LEGACY_PAPER_COLOR_STORAGE_KEY, paperColor);
    window.localStorage.setItem(LEGACY_INK_COLOR_STORAGE_KEY, inkColor);
  }, [contrastToneIndex, hue, inkColor, paperColor]);

  const contextValue = useMemo<ThemeContextValue>(() => {
    return {
      theme,
      resolvedTheme,
      hue,
      contrastToneIndex,
      contrastToneLabel: contrastToneOption.label,
      contrastToneOptions: THEME_CONTRAST_OPTIONS,
      paperColor,
      inkColor,
      toggleTheme: () => {
        setTheme((currentTheme) => getNextTheme(currentTheme));
      },
      setTheme,
      setHue: (value: number) => {
        setHue(clampThemeHue(value));
      },
      setContrastToneIndex: (value: number) => {
        setContrastToneIndex(
          clampThemeContrastIndex(value, THEME_CONTRAST_OPTIONS),
        );
      },
      resetThemeColors: () => {
        setHue(DEFAULT_THEME_HUE);
        setContrastToneIndex(DEFAULT_CONTRAST_TONE_INDEX);
      },
    };
  }, [
    theme,
    resolvedTheme,
    hue,
    contrastToneIndex,
    contrastToneOption.label,
    paperColor,
    inkColor,
  ]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const contextValue = useContext(ThemeContext);

  if (!contextValue) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return contextValue;
}
