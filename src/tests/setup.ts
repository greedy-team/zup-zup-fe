import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

window.URL.createObjectURL = vi.fn();

afterEach(() => {
  cleanup();
});
