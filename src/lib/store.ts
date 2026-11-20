"use client";
/**
 * Browser-only persistence for the M1 test build: the current player and their
 * finished Challenge runs. Replaced by Supabase in M2.
 */
import { useSyncExternalStore } from "react";
import type { RunRecord } from "./game";

export interface Player {
  id: string;
  name: string;
}

const PLAYER_KEY = "categhero:player";
const RUNS_KEY = "categhero:runs";

const listeners = new Set<() => void>();
const mem = new Map<string, string>();

function read(key: string): string | null {
  try {
    const v = localStorage.getItem(key);
    if (v !== null) return v;
  } catch {}
  return mem.get(key) ?? null;
}

function write(key: string, value: string | null) {
  if (value === null) mem.delete(key);
  else mem.set(key, value);
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
  cache.clear();
  listeners.forEach((l) => l());
}

const cache = new Map<string, unknown>();
function parsed<T>(key: string, fallback: T): T {
  const rawValue = read(key);
  const hit = cache.get(key) as { raw: string | null; value: T } | undefined;
  if (hit && hit.raw === rawValue) return hit.value;
  let value = fallback;
  try {
    if (rawValue !== null) value = JSON.parse(rawValue) as T;
  } catch {}
  cache.set(key, { raw: rawValue, value });
  return value;
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = () => {
    cache.clear();
    fn();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

const EMPTY: RunRecord[] = [];

export function getPlayer(): Player | null {
  return parsed<Player | null>(PLAYER_KEY, null);
}

export function getRuns(): RunRecord[] {
  return parsed<RunRecord[]>(RUNS_KEY, EMPTY);
}

/** Same name (case-insensitive) = same player, so a tester can switch back and forth. */
export function signIn(name: string): Player {
  const clean = name.trim().replace(/\s+/g, " ");
  const player = { id: `local:${clean.toLowerCase()}`, name: clean };
  write(PLAYER_KEY, JSON.stringify(player));
  return player;
}

export function signOut() {
  write(PLAYER_KEY, null);
}

export function saveRun(run: RunRecord) {
  write(RUNS_KEY, JSON.stringify([...getRuns(), run]));
}

/** `undefined` until mounted on the client, then the player or `null`. */
export function usePlayer(): Player | null | undefined {
  return useSyncExternalStore(subscribe, getPlayer, () => undefined);
}

export function useRuns(): RunRecord[] {
  return useSyncExternalStore(subscribe, getRuns, () => EMPTY);
}
