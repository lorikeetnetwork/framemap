import { useEffect, useCallback, useRef } from "react";

interface ShortcutAction {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description?: string;
  preventDefault?: boolean;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  shortcuts: ShortcutAction[];
}

export function useKeyboardShortcuts({ enabled = true, shortcuts }: UseKeyboardShortcutsOptions) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = e.target as HTMLElement;
    const isEditing = 
      target.tagName === "INPUT" || 
      target.tagName === "TEXTAREA" || 
      target.isContentEditable;

    // Allow some shortcuts even when editing (like Escape)
    const allowWhileEditing = ["Escape"];

    for (const shortcut of shortcutsRef.current) {
      const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : (!e.ctrlKey && !e.metaKey);
      const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
      const altMatch = shortcut.alt ? e.altKey : !e.altKey;
      const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

      if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
        // Skip if editing and not in allow list
        if (isEditing && !allowWhileEditing.includes(shortcut.key)) {
          continue;
        }

        if (shortcut.preventDefault !== false) {
          e.preventDefault();
        }
        shortcut.action();
        return;
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, handleKeyDown]);
}

// Helper to format shortcut for display
export function formatShortcut(shortcut: ShortcutAction): string {
  const parts: string[] = [];
  
  if (shortcut.ctrl) {
    parts.push(navigator.platform.includes("Mac") ? "⌘" : "Ctrl");
  }
  if (shortcut.shift) {
    parts.push("Shift");
  }
  if (shortcut.alt) {
    parts.push(navigator.platform.includes("Mac") ? "⌥" : "Alt");
  }
  
  // Format special keys
  const keyMap: Record<string, string> = {
    " ": "Space",
    "ArrowUp": "↑",
    "ArrowDown": "↓",
    "ArrowLeft": "←",
    "ArrowRight": "→",
    "Escape": "Esc",
    "Delete": "Del",
    "Backspace": "⌫",
  };
  
  parts.push(keyMap[shortcut.key] || shortcut.key.toUpperCase());
  
  return parts.join("+");
}
