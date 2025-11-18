import toast from 'react-hot-toast';
import type { ApiError } from '../../types/common';

export const showApiErrorToast = (err: ApiError) => {
  toast.error(`${err.status} : ${err.detail}`);
};
