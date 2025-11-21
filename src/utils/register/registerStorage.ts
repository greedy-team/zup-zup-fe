import { openDB, DBSchema } from 'idb';
import type { RegisterFormData } from '../../types/register';

interface RegisterDB extends DBSchema {
  'register-form': {
    key: string;
    value: RegisterFormData;
  };
}

const dbPromise = openDB<RegisterDB>('register-database', 1, {
  upgrade(db) {
    db.createObjectStore('register-form');
  },
});

const FORM_DATA_KEY = 'formData';

export async function saveFormData(data: RegisterFormData) {
  const db = await dbPromise;
  return db.put('register-form', data, FORM_DATA_KEY);
}

export async function loadFormData(): Promise<RegisterFormData | undefined> {
  const db = await dbPromise;
  return db.get('register-form', FORM_DATA_KEY);
}

export async function clearFormData() {
  const db = await dbPromise;
  return db.delete('register-form', FORM_DATA_KEY);
}
