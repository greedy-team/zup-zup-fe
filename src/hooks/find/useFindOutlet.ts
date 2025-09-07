import { useOutletContext } from 'react-router-dom';
import type { FindOutletContext } from '../../types/find';

export function useFindOutlet() {
  return useOutletContext<FindOutletContext>();
}
