import type { FC, ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  draftCount: number;
  onClear: () => void;
  children: ReactNode;
}

export const MobileFilterDrawer: FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  draftCount,
  onClear,
  children,
}) => {
  return (
    <>
      <aside
        className={`fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:block lg:w-[280px] lg:shrink-0 lg:translate-x-0 lg:bg-transparent lg:backdrop-blur-none lg:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex h-[100dvh] flex-col lg:sticky lg:top-24 lg:h-auto lg:max-h-[calc(100vh-6rem)]">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-800 p-4 lg:mb-3 lg:border-none lg:px-1 lg:py-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-200 lg:text-sm">
                Filtros
              </h2>
              {draftCount > 0 && (
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-300">
                  {draftCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onClear}
                disabled={draftCount === 0}
                className="hidden text-sm font-medium text-slate-400 transition-colors hover:text-blue-300 disabled:opacity-40 disabled:hover:text-slate-400 lg:block lg:text-xs"
              >
                Limpar
              </button>

              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-white lg:hidden"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          <div className="scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent flex-1 space-y-3 overflow-y-auto p-4 lg:overflow-visible lg:p-0">
            {children}
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};
