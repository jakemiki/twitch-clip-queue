import { Entity, entity, persistence } from 'simpler-state';
import { Clip } from '../models';

export function createEntity<TEntity>(
  name: string,
  initialValue: TEntity
): Entity<TEntity> {
  return entity(initialValue, [persistence(name)]);
}

export function createAsyncEntity<TEntity>(
  name: string,
  initialValue: Promise<TEntity>
): Entity<TEntity | undefined> {
  return entity(initialValue, [persistence(name)]);
}

export function same(a: Clip, b: Clip) {
  return a.id === b.id && a.provider === b.provider;
}
