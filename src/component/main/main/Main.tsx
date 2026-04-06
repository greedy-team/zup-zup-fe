import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BookOpen, Users, MessageCircleMore, Ellipsis, X } from 'lucide-react';
import Map from './Map';
import LostList from './list/LostList';
import { useSelectedMode, useSetBottomSheetOpen } from '../../../store/hooks/useMainStore';
import { useLostItemsQuery } from '../../../api/main/hooks/useMain';
import { isValidId } from '../../../utils/isValidId';

const PEEK_HEIGHT = 64; // 바텀시트가 닫혔을 때 보이는 높이(px)
const DRAG_THRESHOLD = 50; // 상태 전환 기준 드래그 거리(px)

const Main = () => {
  const selectedMode = useSelectedMode();
  const setBottomSheetOpen = useSetBottomSheetOpen();
  const navigate = useNavigate();

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreFabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMoreOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (moreFabRef.current && !moreFabRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMoreOpen]);

  const [searchParams] = useSearchParams();
  const rawAreaId = searchParams.get('schoolAreaId');
  const selectedAreaId = isValidId(rawAreaId) ? Number(rawAreaId) : 0;
  const rawCategoryId = searchParams.get('categoryId');
  const selectedCategoryId = isValidId(rawCategoryId) ? Number(rawCategoryId) : 0;
  const rawPage = searchParams.get('page');
  const page = isValidId(rawPage) ? Number(rawPage) : 1;

  const { data } = useLostItemsQuery(page, selectedCategoryId, selectedAreaId, {
    enabled: selectedMode !== 'register',
  });
  const totalCount = data?.totalCount ?? 0;

  const [isDesktopListOpen, setIsDesktopListOpen] = useState(true);
  const [shouldRenderAside, setShouldRenderAside] = useState(selectedMode !== 'register');

  // 바텀시트 상태
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startYRef = useRef(0);
  const sheetOpenRef = useRef(false);
  sheetOpenRef.current = sheetOpen;
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedMode !== 'register' && selectedAreaId !== 0) {
      setIsDesktopListOpen(true);
    }
  }, [selectedAreaId, selectedMode]);

  useEffect(() => {
    if (selectedMode === 'find') {
      setShouldRenderAside(true);
      setIsDesktopListOpen(true);
    } else if (selectedMode === 'register') {
      setShouldRenderAside(true);
      setIsDesktopListOpen(false);
      setSheetOpen(false);
      setBottomSheetOpen(false);
    }
  }, [selectedMode]);

  const snapSheet = useCallback((open: boolean) => {
    setSheetOpen(open);
    setBottomSheetOpen(open);
  }, [setBottomSheetOpen]);

  // 마우스 드래그 (document 레벨 등록)
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      const delta = e.clientY - startYRef.current;
      if (sheetOpenRef.current) {
        setDragOffset(Math.max(0, delta));
      } else {
        const sheetHeight = sheetRef.current?.offsetHeight ?? 0;
        const minOffset = -(sheetHeight - PEEK_HEIGHT);
        setDragOffset(Math.max(minOffset, Math.min(0, delta)));
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      const delta = e.clientY - startYRef.current;
      if (!sheetOpenRef.current && delta < -DRAG_THRESHOLD) snapSheet(true);
      else if (sheetOpenRef.current && delta > DRAG_THRESHOLD) snapSheet(false);
      setDragOffset(0);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, snapSheet]);

  const onDragStart = useCallback((clientY: number) => {
    setIsDragging(true);
    startYRef.current = clientY;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - startYRef.current;
    if (sheetOpenRef.current) {
      setDragOffset(Math.max(0, delta));
    } else {
      const sheetHeight = sheetRef.current?.offsetHeight ?? 0;
      const minOffset = -(sheetHeight - PEEK_HEIGHT);
      setDragOffset(Math.max(minOffset, Math.min(0, delta)));
    }
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientY - startYRef.current;
    setIsDragging(false);
    if (!sheetOpenRef.current && delta < -DRAG_THRESHOLD) snapSheet(true);
    else if (sheetOpenRef.current && delta > DRAG_THRESHOLD) snapSheet(false);
    setDragOffset(0);
  }, [snapSheet]);

  const getSheetTransform = () => {
    if (isDragging) {
      return sheetOpen
        ? `translateY(${dragOffset}px)`
        : `translateY(calc(100% - ${PEEK_HEIGHT}px + ${dragOffset}px))`;
    }
    return sheetOpen ? 'translateY(0)' : `translateY(calc(100% - ${PEEK_HEIGHT}px))`;
  };

  return (
    <main className="min-h-0 flex-1">
      <div className="grid h-full min-h-0 min-w-0 grid-cols-1 md:grid-cols-1">
        <section className="relative flex h-full min-h-0 min-w-0 flex-col overflow-x-hidden">
          {shouldRenderAside && (
            <aside
              data-tour="lost-list"
              className={`absolute top-0 left-0 z-30 hidden h-full w-[380px] border-r border-gray-300 bg-white transition-transform duration-300 ease-out md:block ${
                isDesktopListOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
              onTransitionEnd={(e) => {
                if (e.propertyName !== 'transform') return;
                if (selectedMode === 'register' && !isDesktopListOpen) {
                  setShouldRenderAside(false);
                }
              }}
            >
              <LostList />

              {selectedMode !== 'register' && (
                <button
                  className="absolute top-1/2 right-0 z-80 hidden h-12 w-6 translate-x-full -translate-y-1/2 cursor-pointer items-center justify-center rounded-r-md bg-teal-600 text-white shadow-lg transition-all duration-300 hover:bg-teal-700 md:flex"
                  onClick={() => setIsDesktopListOpen(!isDesktopListOpen)}
                  aria-label={isDesktopListOpen ? '목록 닫기' : '목록 열기'}
                >
                  <svg
                    className={`h-5 w-5 transition-transform duration-300 ${isDesktopListOpen ? '' : 'rotate-180'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
            </aside>
          )}

          <div className="min-h-0 flex-1">
            <Map isDesktopListOpen={isDesktopListOpen} />
          </div>

          {/* 모바일 전용: 더보기 FAB */}
          {(selectedMode === 'find' || selectedMode === 'register') && (
            <div
              ref={moreFabRef}
              className={`absolute right-4 z-50 flex gap-2 transition-[bottom] duration-300 ease-out md:hidden ${
                sheetOpen ? 'flex-row items-center' : 'flex-col items-end'
              }`}
              style={{
                bottom:
                  selectedMode === 'find'
                    ? sheetOpen
                      ? 'calc(72% + 1rem)'
                      : `calc(${PEEK_HEIGHT}px + 1rem)`
                    : '1rem',
                touchAction: 'none',
              }}
            >
              {[
                {
                  label: '가이드',
                  icon: <BookOpen className="h-5 w-5" />,
                  onClick: () => {
                    navigate('/onboarding');
                    setIsMoreOpen(false);
                  },
                },
                {
                  label: '팀 소개',
                  icon: <Users className="h-5 w-5" />,
                  onClick: () => {
                    navigate('/more/team');
                    setIsMoreOpen(false);
                  },
                },
                {
                  label: '피드백',
                  icon: <MessageCircleMore className="h-5 w-5" />,
                  href: 'https://forms.gle/xzvHjcbKh3vumBXQA',
                },
              ].map((item, i, arr) => {
                const openDelay = (arr.length - 1 - i) * 50;
                const closeDelay = i * 50;
                const hiddenClass = sheetOpen
                  ? 'pointer-events-none translate-x-4 opacity-0'
                  : 'pointer-events-none translate-y-4 opacity-0';

                return (
                  <div
                    key={item.label}
                    style={{ transitionDelay: `${isMoreOpen ? openDelay : closeDelay}ms` }}
                    className={`transition-all duration-200 ease-out ${
                      isMoreOpen ? 'translate-x-0 translate-y-0 opacity-100' : hiddenClass
                    }`}
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMoreOpen(false)}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-teal-500 shadow-md transition hover:bg-teal-50">
                          {item.icon}
                        </div>
                        <span className="text-xs text-gray-600">{item.label}</span>
                      </a>
                    ) : (
                      <button onClick={item.onClick} className="flex flex-col items-center gap-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-teal-500 shadow-md transition hover:bg-teal-50">
                          {item.icon}
                        </div>
                        <span className="text-xs text-gray-600">{item.label}</span>
                      </button>
                    )}
                  </div>
                );
              })}
              <button
                data-tour="mobile-sidebar-more"
                onClick={() => setIsMoreOpen((v) => !v)}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border shadow-lg transition duration-200 active:scale-95 ${
                  isMoreOpen
                    ? 'border-teal-500 bg-teal-500 text-white'
                    : 'border-gray-300 bg-white text-gray-600 hover:text-teal-500'
                }`}
                aria-label="더보기"
              >
                {isMoreOpen ? (
                  <X className="h-5 w-5 transition-transform duration-200" />
                ) : (
                  <Ellipsis className="h-5 w-5 transition-transform duration-200" />
                )}
              </button>
            </div>
          )}

          {/* 모바일 바텀시트 */}
          {selectedMode === 'find' && (
            <div
              ref={sheetRef}
              className="absolute bottom-0 left-0 right-0 z-40 flex h-[72%] flex-col rounded-t-2xl bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.12)] md:hidden"
              style={{
                transform: getSheetTransform(),
                transition: isDragging ? 'none' : 'transform 0.3s ease-out',
              }}
            >
              {/* 드래그 핸들 */}
              <div
                className="flex shrink-0 select-none flex-col items-center pb-2 pt-3"
                style={{ touchAction: 'none', cursor: isDragging ? 'grabbing' : 'grab' }}
                onMouseDown={(e) => onDragStart(e.clientY)}
                onTouchStart={(e) => onDragStart(e.touches[0].clientY)}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div className="mb-3 h-1.5 w-10 rounded-full bg-gray-300" />
                <div className="flex w-full items-center justify-between px-4">
                  <h3 className="text-base font-semibold">분실물 목록</h3>
                  <p className="text-sm text-gray-400">총 {totalCount}건</p>
                </div>
              </div>

              {/* 목록 스크롤 영역 */}
              <div className="min-h-0 flex-1 overflow-y-auto">
                <LostList />
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Main;
