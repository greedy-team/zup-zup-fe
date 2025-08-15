import { lostItems } from '../db/lostItems.db';

export type PledgeSelectorResult =
  | { storageName: string }
  | { error: 'NOT_FOUND' | 'INVALID_STATE' };

export function pledgeAndGetStorageName(lostItemId: number): PledgeSelectorResult {
  const targetLostItem = lostItems.find((item) => item.lostItemId === lostItemId);
  if (!targetLostItem) return { error: 'NOT_FOUND' };

  if (targetLostItem.status !== 'registered') {
    return { error: 'INVALID_STATE' };
  }

  targetLostItem.status = 'pledged';
  return { storageName: targetLostItem.storageName };
}
