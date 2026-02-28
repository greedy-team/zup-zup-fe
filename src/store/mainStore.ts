import { create } from 'zustand';
import { createMainSlice } from './slices/mainSlice';
import type { MainSlice } from './slices/mainSlice';

export const useMainStore = create<MainSlice>(createMainSlice);
