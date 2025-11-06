import { create } from 'zustand';
import type { AdminPageState } from './slices/admin/adminSlice';
import { createAdminSlice } from './slices/admin/adminSlice';

export const useAdminStore = create<AdminPageState>(createAdminSlice);
