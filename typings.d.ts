import { ComponentType, ReactNode } from 'react';

export type Signal<Value> = {
  Provider: ComponentType<{ children: ReactNode }>;
  usePublish: (value: Value) => void;
  useSubscription: (callback: (value: Value) => void) => void;
}

export function createSignal<Value = any>(): Signal<Value>;
