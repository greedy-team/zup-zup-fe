import { lostItems } from '../db/lostItems.db';
import type { LostItem } from '../db/lostItems.db';

export type PledgeSelectorResult =
  | { storageName: string }
  | { error: 'NOT_FOUND' | 'INVALID_STATE' };

export function changeStatusToPledged(
  lostItemId: number,
): { item: LostItem } | { error: 'NOT_FOUND' | 'INVALID_STATE' } {
  const targetItem = lostItems.find((it) => it.lostItemId === lostItemId);
  if (!targetItem) return { error: 'NOT_FOUND' };
  if (targetItem.status !== 'registered') return { error: 'INVALID_STATE' };

  targetItem.status = 'pledged';
  return { item: targetItem };
}

export function getStorageName(item: LostItem): { storageName: string } {
  return { storageName: item.storageName };
}

export function handlePledge(lostItemId: number): PledgeSelectorResult {
  const res = changeStatusToPledged(lostItemId);
  return 'error' in res ? res : getStorageName(res.item);
}
