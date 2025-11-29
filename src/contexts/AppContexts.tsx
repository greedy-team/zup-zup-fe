import { createContext, useState, type ReactNode } from 'react';
import type { Category, LostItemListItem, LostItemSummaryRow } from '../types/lost/lostApi';
import type { SchoolArea } from '../types/map/map';

export type Mode = 'register' | 'find' | 'mypage';

export type CategoriesCtx = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export type ItemsCtx = {
  items: LostItemListItem[];
  setItems: React.Dispatch<React.SetStateAction<LostItemListItem[]>>;
};

export type SelectedCategoryIdCtx = {
  selectedCategoryId: number;
  setSelectedCategoryId: React.Dispatch<React.SetStateAction<number>>;
};

export type SelectedAreaIdCtx = {
  selectedAreaId: number;
  setSelectedAreaId: React.Dispatch<React.SetStateAction<number>>;
};

export type SchoolAreasCtx = {
  schoolAreas: SchoolArea[];
  setSchoolAreas: React.Dispatch<React.SetStateAction<SchoolArea[]>>;
};

export type TotalCountCtx = {
  totalCount: number;
  setTotalCount: React.Dispatch<React.SetStateAction<number>>;
};

export type PageCtx = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export type SelectedModeCtx = {
  selectedMode: Mode;
  setSelectedMode: React.Dispatch<React.SetStateAction<Mode>>;
};

export type LostItemSummaryCtx = {
  lostItemSummary: LostItemSummaryRow[];
  setLostItemSummary: React.Dispatch<React.SetStateAction<LostItemSummaryRow[]>>;
};

export type RegisterConfirmModalCtx = {
  isRegisterConfirmModalOpen: boolean;
  setIsRegisterConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type RegisterModalCtx = {
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type FindModalCtx = {
  isFindModalOpen: boolean;
  setIsFindModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CategoriesContext = createContext<CategoriesCtx | undefined>(undefined);
export const ItemsContext = createContext<ItemsCtx | undefined>(undefined);
export const SelectedCategoryIdContext = createContext<SelectedCategoryIdCtx | undefined>(
  undefined,
);
export const SelectedAreaIdContext = createContext<SelectedAreaIdCtx | undefined>(undefined);
export const SchoolAreasContext = createContext<SchoolAreasCtx | undefined>(undefined);
export const TotalCountContext = createContext<TotalCountCtx | undefined>(undefined);
export const PageContext = createContext<PageCtx | undefined>(undefined);
export const SelectedModeContext = createContext<SelectedModeCtx | undefined>(undefined);
export const LostItemSummaryContext = createContext<LostItemSummaryCtx | undefined>(undefined);
export const RegisterConfirmModalContext = createContext<RegisterConfirmModalCtx | undefined>(
  undefined,
);
export const RegisterModalContext = createContext<RegisterModalCtx | undefined>(undefined);
export const FindModalContext = createContext<FindModalCtx | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<LostItemListItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [selectedAreaId, setSelectedAreaId] = useState<number>(0);
  const [schoolAreas, setSchoolAreas] = useState<SchoolArea[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [selectedMode, setSelectedMode] = useState<Mode>('find');
  const [lostItemSummary, setLostItemSummary] = useState<LostItemSummaryRow[]>([]);
  const [isRegisterConfirmModalOpen, setIsRegisterConfirmModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isFindModalOpen, setIsFindModalOpen] = useState(false);

  return (
    <CategoriesContext.Provider value={{ categories, setCategories }}>
      <ItemsContext.Provider value={{ items, setItems }}>
        <SelectedCategoryIdContext.Provider value={{ selectedCategoryId, setSelectedCategoryId }}>
          <SelectedAreaIdContext.Provider value={{ selectedAreaId, setSelectedAreaId }}>
            <SchoolAreasContext.Provider value={{ schoolAreas, setSchoolAreas }}>
              <TotalCountContext.Provider value={{ totalCount, setTotalCount }}>
                <PageContext.Provider value={{ page, setPage }}>
                  <SelectedModeContext.Provider value={{ selectedMode, setSelectedMode }}>
                    <LostItemSummaryContext.Provider
                      value={{ lostItemSummary, setLostItemSummary }}
                    >
                      <RegisterConfirmModalContext.Provider
                        value={{ isRegisterConfirmModalOpen, setIsRegisterConfirmModalOpen }}
                      >
                        <RegisterModalContext.Provider
                          value={{ isRegisterModalOpen, setIsRegisterModalOpen }}
                        >
                          <FindModalContext.Provider
                            value={{ isFindModalOpen, setIsFindModalOpen }}
                          >
                            {children}
                          </FindModalContext.Provider>
                        </RegisterModalContext.Provider>
                      </RegisterConfirmModalContext.Provider>
                    </LostItemSummaryContext.Provider>
                  </SelectedModeContext.Provider>
                </PageContext.Provider>
              </TotalCountContext.Provider>
            </SchoolAreasContext.Provider>
          </SelectedAreaIdContext.Provider>
        </SelectedCategoryIdContext.Provider>
      </ItemsContext.Provider>
    </CategoriesContext.Provider>
  );
}
