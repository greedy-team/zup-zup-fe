import { create } from 'zustand';
import type { AdminPageState } from './slices/adminSlice';
import { createAdminSlice } from './slices/adminSlice';

export const useAdminStore = create<AdminPageState>(createAdminSlice);
