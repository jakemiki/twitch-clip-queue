import { createState, State } from '@hookstate/core';
import { Persistence } from '@hookstate/persistence';
import { Clip } from '../models';

export function createPersistentState<TState>(
  name: string,
  initialValue: TState
): State<TState> {
  const state = createState(initialValue);
  state.attach(Persistence(name))
  return state;
}

export function same(a: Clip, b: Clip) {
  return a.id === b.id && a.provider === b.provider;
}
