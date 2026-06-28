import { createContext, useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const DEFAULTS = {
  messageSounds: true,
  desktopNotifications: true,
  enterToSend: true,
  compactMode: false,
};

const SettingsContext = createContext(undefined);

function readAll() {
  return Object.fromEntries(
    Object.entries(DEFAULTS).map(([key, def]) => {
      const stored = localStorage.getItem(`setting_${key}`);
      return [key, stored !== null ? JSON.parse(stored) : def];
    }),
  );
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(readAll);

  function updateSetting(key, value) {
    localStorage.setItem(`setting_${key}`, JSON.stringify(value));
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

/**
 * Returns a ref that always reflects the latest settings value.
 * Use this inside effects/callbacks that shouldn't re-run when settings change.
 */
export function useSettingsRef() {
  const { settings } = useSettings();
  const ref = useRef(settings);
  useEffect(() => {
    ref.current = settings;
  }, [settings]);
  return ref;
}
