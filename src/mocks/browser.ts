import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { seedAll } from './seeds/seedAll';

seedAll();
export const worker = setupWorker(...handlers);
