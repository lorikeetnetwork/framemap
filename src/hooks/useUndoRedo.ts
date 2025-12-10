import { useState, useCallback, useRef } from "react";

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseUndoRedoOptions {
  maxHistory?: number;
}

export function useUndoRedo<T>(initialState: T, options: UseUndoRedoOptions = {}) {
  const { maxHistory = 50 } = options;
  
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  // Track if we're in the middle of an undo/redo to prevent adding to history
  const isUndoingRef = useRef(false);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const set = useCallback((newPresent: T | ((prev: T) => T), recordHistory = true) => {
    setHistory((prev) => {
      const nextPresent = typeof newPresent === "function" 
        ? (newPresent as (prev: T) => T)(prev.present)
        : newPresent;

      // If we're undoing/redoing or not recording, just update present
      if (isUndoingRef.current || !recordHistory) {
        return { ...prev, present: nextPresent };
      }

      // Don't add to history if the state is the same
      if (JSON.stringify(prev.present) === JSON.stringify(nextPresent)) {
        return prev;
      }

      const newPast = [...prev.past, prev.present];
      // Trim history if it exceeds max
      if (newPast.length > maxHistory) {
        newPast.shift();
      }

      return {
        past: newPast,
        present: nextPresent,
        future: [], // Clear future on new action
      };
    });
  }, [maxHistory]);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback((newPresent: T) => {
    setHistory({
      past: [],
      present: newPresent,
      future: [],
    });
  }, []);

  const clear = useCallback(() => {
    setHistory((prev) => ({
      past: [],
      present: prev.present,
      future: [],
    }));
  }, []);

  return {
    state: history.present,
    set,
    undo,
    redo,
    reset,
    clear,
    canUndo,
    canRedo,
    historyLength: history.past.length,
    futureLength: history.future.length,
  };
}
