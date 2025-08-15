import { lostItems, type LostItem, type FeatureSelection } from '../db/lostItems.db';
import { categories } from '../db/categories.db';
import { schoolAreas } from '../db/schoolAreas.db';
import { categoryFeatures, type FeatureDef } from '../db/features.db';
import { ETC_CATEGORY_ID } from '../../constants/category';

export type CreateLostItemBody = {
  imageUrl: string;
  categoryId: number;
  features?: FeatureSelection[];
  schoolAreaId: number;
  detailLocation: string;
  description?: string;
  storageName: string;
};

export type CreateLostItemResult =
  | { ok: true; lostItemId: number; message: string }
  | {
      ok: false;
      error:
        | 'MISSING_IMAGE'
        | 'MISSING_STORAGE_NAME'
        | 'INVALID_CATEGORY'
        | 'INVALID_SCHOOL_AREA'
        | 'MISSING_FEATURES'
        | 'INVALID_FEATURE'
        | 'INVALID_REQUEST'
        | 'INVALID_JSON_FORMAT';
    };

function nextLostItemId(): number {
  const maxId = lostItems.reduce((max, li) => Math.max(max, li.lostItemId), 0);
  return maxId + 1;
}

function getCategoryName(categoryId: number): string | undefined {
  return categories.find((category) => category.categoryId === categoryId)?.categoryName;
}

function getAreaName(schoolAreaId: number): string | undefined {
  return schoolAreas.find((schoolArea) => schoolArea.id === schoolAreaId)?.areaName;
}

export function validateFeatures(categoryId: number, selections: FeatureSelection[]): boolean {
  const categoryDef = categoryFeatures.find((category) => category.categoryId === categoryId);
  if (!categoryDef) return false;

  for (const selection of selections) {
    const { featureId, optionId } = selection;

    const featureDef: FeatureDef | undefined = categoryDef.features.find(
      (feature) => feature.featureId === featureId,
    );
    if (!featureDef) return false;

    const optionExists = featureDef.options.some((option) => option.optionId === optionId);
    if (!optionExists) return false;
  }

  return true;
}

export function createLostItem(body: CreateLostItemBody): CreateLostItemResult {
  if (!body.imageUrl) return { ok: false, error: 'MISSING_IMAGE' };
  if (!body.storageName) return { ok: false, error: 'MISSING_STORAGE_NAME' };

  const categoryName = getCategoryName(body.categoryId);
  if (!categoryName) return { ok: false, error: 'INVALID_CATEGORY' };

  const foundAreaName = getAreaName(body.schoolAreaId);
  if (!foundAreaName) return { ok: false, error: 'INVALID_SCHOOL_AREA' };

  const isEtc = body.categoryId === ETC_CATEGORY_ID;
  const selections = body.features ?? [];

  if (!isEtc) {
    if (selections.length === 0) return { ok: false, error: 'MISSING_FEATURES' };
    if (!validateFeatures(body.categoryId, selections)) {
      return { ok: false, error: 'INVALID_FEATURE' };
    }
  } else if (selections.length > 0 && !validateFeatures(body.categoryId, selections)) {
    return { ok: false, error: 'INVALID_FEATURE' };
  }

  const newId = nextLostItemId();
  const newItem: LostItem = {
    lostItemId: newId,
    status: 'registered',
    categoryId: body.categoryId,
    categoryName,
    schoolAreaId: body.schoolAreaId,
    foundAreaName,
    detailLocation: body.detailLocation,
    storageName: body.storageName,
    features: selections.length > 0 ? selections : undefined,
    description: body.description,
    foundDate: new Date().toISOString(),
    imageUrl: body.imageUrl,
  };

  lostItems.push(newItem);
  return { ok: true, lostItemId: newId, message: '분실물 등록이 완료되었습니다.' };
}

export function createLostItemFromFormData(formData: FormData): CreateLostItemResult {
  const images = formData.getAll('images');
  if (images.length === 0) return { ok: false, error: 'MISSING_IMAGE' };

  const jsonRaw = formData.get('lostItemRegisterRequest');
  if (typeof jsonRaw !== 'string') return { ok: false, error: 'INVALID_REQUEST' };

  let parsed: Omit<CreateLostItemBody, 'imageUrl'>;
  try {
    parsed = JSON.parse(jsonRaw);
  } catch {
    return { ok: false, error: 'INVALID_JSON_FORMAT' };
  }

  return createLostItem({
    ...parsed,
    imageUrl: 'https://i.pinimg.com/736x/a7/32/8a/a7328accb22576f4fc960399cd9e76df.jpg',
  });
}
