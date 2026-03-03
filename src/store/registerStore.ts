import { create } from 'zustand';
import { createRegisterSlice } from './slices/registerSlice';
import type { RegisterSlice } from './slices/registerSlice';

export const useRegisterStore = create<RegisterSlice>(createRegisterSlice);
