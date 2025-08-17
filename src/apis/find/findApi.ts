import type { QuizItem, QuizResult, QuizSubmitBody } from '../../types/find';

const base = '';

export async function getQuiz(lostItemId: number): Promise<QuizItem[]> {
  const res = await fetch(`${base}/api/lost-items/${lostItemId}/quiz`);
  if (res.status === 400) throw new Error('Bad Request');
  if (res.status === 404) throw new Error('Not Found');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function submitQuiz(lostItemId: number, body: QuizSubmitBody): Promise<QuizResult> {
  const res = await fetch(`${base}/api/lost-items/${lostItemId}/quiz`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (res.status === 400) throw new Error('Bad Request');
  if (res.status === 404) throw new Error('Not Found');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export type PledgeSuccess = { storageName: string };
export type PledgeError = { error: 'Not Found' | 'Invalid state' };

export async function postPledge(lostItemId: number): Promise<PledgeSuccess> {
  const res = await fetch(`/api/lost-items/${lostItemId}/pledge`, { method: 'POST' });

  if (res.status === 200) {
    return res.json();
  }
  if (res.status === 404) {
    throw Object.assign(new Error('Not Found'), { code: 404 } as const);
  }
  if (res.status === 409) {
    throw Object.assign(new Error('Invalid state'), { code: 409 } as const);
  }
  throw new Error(`HTTP ${res.status}`);
}

export type PublicDetail =
  | { imageUrl: string; description?: string | null }
  | { error: 'Forbidden' | 'Not Found' };

export async function getPublicDetail(lostItemId: number): Promise<PublicDetail> {
  const res = await fetch(`/api/lost-items/${lostItemId}`);
  if (res.status === 200) return res.json();
  if (res.status === 403) return { error: 'Forbidden' };
  if (res.status === 404) return { error: 'Not Found' };
  throw new Error(`HTTP ${res.status}`);
}
