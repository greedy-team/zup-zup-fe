import type { ApiError } from '../../types/common';

export const defaultQueryRetry = (failureCount: number, error: ApiError | unknown) => {
  const status = (error as ApiError | undefined)?.status;

  if (!status) return failureCount < 3;

  if (status >= 500) return failureCount < 3;

  return false;
};
