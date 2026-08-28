import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import InboxIcon from "@mui/icons-material/Inbox";
import LabelOffIcon from "@mui/icons-material/LabelOff";
import type { IGameList } from "../types/list.types";
import { useCreateList } from "../hooks/useCreateList";
import { useDeleteList } from "../hooks/useDeleteList";
import { useRenameList } from "../hooks/useRenameList";
import { useReorderLists } from "../hooks/useReorderLists";

interface BacklogListsSidebarProps {
  lists: IGameList[];
  selectedListId: string | null;
  onSelectList: (listId: string | null) => void;
  gameCountByList: Record<string, number>;
  totalCount: number;
  uncategorizedCount: number;
}

export const BacklogListsSidebar = ({
  lists,
  selectedListId,
  onSelectList,
  gameCountByList,
  totalCount,
  uncategorizedCount,
}: BacklogListsSidebarProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [mobileMenuListId, setMobileMenuListId] = useState<string | null>(null);
  const [isMobileRenaming, setIsMobileRenaming] = useState(false);
  const createInputRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const hasLongPressed = useRef(false);

  const startPress = useCallback((listId: string) => {
    hasLongPressed.current = false;
    longPressTimer.current = setTimeout(() => {
      hasLongPressed.current = true;
      setMobileMenuListId(listId);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);
  }, []);

  const cancelPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const { mutate: createList, isPending: isCreatingList } = useCreateList();
  const { mutate: removeList } = useDeleteList();
  const { mutate: renameListMutation, isPending: isRenamingList, variables: renameVars } = useRenameList();
  const { mutate: reorderMutation } = useReorderLists();

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleCreate = useCallback(() => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    createList(trimmed, {
      onSuccess: () => {
        setNewName("");
        setIsCreating(false);
      },
    });
  }, [newName, createList]);

  const handleRename = useCallback(
    (listId: string) => {
      const trimmed = renameValue.trim();
      if (!trimmed) return;

      renameListMutation(
        { listId, name: trimmed },
        {
          onSuccess: () => {
            setRenamingId(null);
            setRenameValue("");
          },
        },
      );
    },
    [renameValue, renameListMutation],
  );

  const handleDelete = useCallback(
    (listId: string) => {
      if (selectedListId === listId) onSelectList(null);
      removeList(listId);
      setMenuOpenId(null);
    },
    [removeList, selectedListId, onSelectList],
  );

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    const reordered = [...lists];
    const [removed] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, removed);

    reorderMutation(reordered.map((l) => l.id));
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const startRename = (list: IGameList) => {
    setRenamingId(list.id);
    setRenameValue(list.name);
    setMenuOpenId(null);
    setTimeout(() => renameInputRef.current?.focus(), 50);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[220px] flex-shrink-0 border-r border-white/[0.06] bg-gray-950/50">
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4 custom-scrollbar">
          {/* "Backlog" item */}
          <div>
            <button
              onClick={() => onSelectList(null)}
              className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-150 ${selectedListId === null
                ? "bg-blue-500/10 text-blue-400 border-l-2 border-blue-400"
                : "text-white/60 hover:bg-white/[0.04] hover:text-white/80 border-l-2 border-transparent"
                }`}
            >
              <InboxIcon sx={{ fontSize: 16 }} className="flex-shrink-0 opacity-70" />
              <span className="flex-1 truncate">Todos</span>
              <span className="text-[10px] font-bold text-white/25 tabular-nums">
                {totalCount}
              </span>
            </button>
          </div>

          <div>
            <button
              onClick={() => onSelectList("uncategorized")}
              className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-150 ${selectedListId === "uncategorized"
                ? "bg-blue-500/10 text-blue-400 border-l-2 border-blue-400"
                : "text-white/60 hover:bg-white/[0.04] hover:text-white/80 border-l-2 border-transparent"
                }`}
            >
              <LabelOffIcon sx={{ fontSize: 16 }} className="flex-shrink-0 opacity-70" />
              <span className="flex-1 truncate">Sem lista</span>
              <span className="text-[10px] font-bold text-white/25 tabular-nums">
                {uncategorizedCount}
              </span>
            </button>
          </div>

          <div className="space-y-0.5">
            <div className="px-2 pb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                Listas
              </span>
            </div>
            {lists.map((list, index) => (
              <div
                key={list.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className="relative group/item"
              >
                {renamingId === list.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleRename(list.id);
                    }}
                    className="flex items-center gap-1 px-1 relative"
                  >
                    <input
                      ref={renameInputRef}
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleRename(list.id)}
                      onKeyDown={(e) =>
                        e.key === "Escape" && setRenamingId(null)
                      }
                      className="flex-1 bg-white/[0.06] border border-white/10 rounded-md px-2 py-1.5 text-sm text-white outline-none focus:border-blue-400/50 disabled:opacity-50"
                      maxLength={40}
                      disabled={isRenamingList && renameVars?.listId === list.id}
                    />
                    {isRenamingList && renameVars?.listId === list.id && (
                      <div className="absolute right-3 flex items-center">
                        <div className="w-3 h-3 border-[2px] border-white/20 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </form>
                ) : (
                  <button
                    onClick={() => onSelectList(list.id)}
                    className={`w-full flex items-center gap-1.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-150 ${selectedListId === list.id
                      ? "bg-blue-500/10 text-blue-400 border-l-2 border-blue-400"
                      : "text-white/60 hover:bg-white/[0.04] hover:text-white/80 border-l-2 border-transparent"
                      }`}
                  >
                    <DragIndicatorIcon
                      sx={{ fontSize: 14 }}
                      className="opacity-0 group-hover/item:opacity-30 cursor-grab transition-opacity flex-shrink-0"
                    />
                    <span className="flex-1 truncate">{list.name}</span>
                    <span className="text-[10px] font-bold text-white/25 tabular-nums">
                      {gameCountByList[list.id] ?? 0}
                    </span>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === list.id ? null : list.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                          setMenuOpenId(menuOpenId === list.id ? null : list.id);
                        }
                      }}
                      className="opacity-0 group-hover/item:opacity-60 hover:!opacity-100 p-0.5 rounded transition-opacity"
                    >
                      <MoreVertIcon sx={{ fontSize: 14 }} />
                    </div>
                  </button>
                )}

                <AnimatePresence>
                  {menuOpenId === list.id && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setMenuOpenId(null)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-2 top-full z-50 mt-1 w-36 rounded-lg bg-gray-900 border border-white/10 shadow-xl overflow-hidden"
                      >
                        <button
                          onClick={() => startRename(list)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
                        >
                          <EditIcon sx={{ fontSize: 14 }} />
                          Renomear
                        </button>
                        <button
                          onClick={() => handleDelete(list.id)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                          Excluir
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </nav>

        <div className="px-2 pb-3 border-t border-white/[0.06] pt-2">
          {isCreating ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
              }}
              className="flex items-center gap-1 relative"
            >
              <input
                ref={createInputRef}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={() => {
                  if (!newName.trim()) setIsCreating(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setIsCreating(false);
                    setNewName("");
                  }
                }}
                placeholder="Nome da lista"
                className="flex-1 bg-white/[0.06] border border-white/10 rounded-md px-2 py-1.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-400/50 disabled:opacity-50"
                maxLength={40}
                disabled={isCreatingList}
                autoFocus
              />
              {isCreatingList && (
                <div className="absolute right-3 flex items-center">
                  <div className="w-3.5 h-3.5 border-[2px] border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </form>
          ) : (
            <button
              onClick={() => {
                setIsCreating(true);
                setTimeout(() => createInputRef.current?.focus(), 50);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all"
            >
              <AddIcon sx={{ fontSize: 16 }} />
              Nova lista
            </button>
          )}
        </div>
      </aside>

      {/* Mobile horizontal chips */}
      <div className="md:hidden flex items-center gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => onSelectList(selectedListId === "uncategorized" ? null : "uncategorized")}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wide transition-all duration-200 border ${selectedListId === "uncategorized"
            ? "bg-blue-500/15 text-blue-400 border-blue-400/30"
            : "bg-white/[0.04] text-white/50 border-white/[0.08] hover:text-white/70"
            }`}
        >
          <LabelOffIcon sx={{ fontSize: 14 }} className="opacity-70" />
          <span>({uncategorizedCount})</span>
        </button>

        {lists.map((list) => (
          <button
            key={list.id}
            onClick={(e) => {
              if (hasLongPressed.current) {
                e.preventDefault();
                return;
              }
              if (list.id === selectedListId) {
                onSelectList(null);
                return;
              }
              onSelectList(list.id);
            }}
            onTouchStart={() => startPress(list.id)}
            onTouchEnd={cancelPress}
            onTouchCancel={cancelPress}
            onTouchMove={cancelPress}
            onMouseDown={() => startPress(list.id)}
            onMouseUp={cancelPress}
            onMouseLeave={cancelPress}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
            className={`select-none flex-shrink-0 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wide transition-all duration-200 border ${selectedListId === list.id
              ? "bg-blue-500/15 text-blue-400 border-blue-400/30"
              : "bg-white/[0.04] text-white/50 border-white/[0.08] hover:text-white/70"
              }`}
          >
            {list.name} ({gameCountByList[list.id] ?? 0})
          </button>
        ))}

        <button
          onClick={() => {
            setIsCreating(true);
            setTimeout(() => createInputRef.current?.focus(), 50);
          }}
          className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-white/30 border border-dashed border-white/10 hover:text-white/50 hover:border-white/20 transition-all"
        >
          <AddIcon sx={{ fontSize: 14 }} />
        </button>

        {/* Mobile create input overlay */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-999 flex items-end justify-center bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => {
                setIsCreating(false);
                setNewName("");
              }}
            >
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md p-4 pb-10 bg-gray-900 border-t border-white/10 rounded-t-2xl"
              >
                <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
                  Nova lista
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreate();
                  }}
                  className="relative"
                >
                  <input
                    ref={createInputRef}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setIsCreating(false);
                        setNewName("");
                      }
                    }}
                    placeholder="Nome da lista"
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-400/50 disabled:opacity-50"
                    maxLength={40}
                    disabled={isCreatingList}
                    autoFocus
                  />
                  {isCreatingList && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                      <div className="w-4 h-4 border-[2px] border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu bottom sheet (for edit/delete) */}
        <AnimatePresence>
          {mobileMenuListId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] flex flex-col justify-end bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuListId(null)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-gray-900 border-t border-white/10 rounded-t-2xl p-4 pb-8"
              >
                <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-6" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 text-center">
                  Gerenciar Lista: {lists.find(l => l.id === mobileMenuListId)?.name}
                </p>
                <div className="flex flex-col gap-2">
                  <button onClick={() => {
                    const list = lists.find(l => l.id === mobileMenuListId);
                    if (list) {
                      setRenamingId(list.id);
                      setRenameValue(list.name);
                      setIsMobileRenaming(true);
                    }
                    setMobileMenuListId(null);
                  }} className="w-full px-4 py-3 bg-white/[0.04] rounded-xl text-sm font-medium text-white hover:bg-white/[0.08] flex items-center justify-center gap-2">
                    <EditIcon sx={{ fontSize: 16 }} className="text-white/50" />
                    Renomear Lista
                  </button>
                  <button onClick={() => { handleDelete(mobileMenuListId); setMobileMenuListId(null); }} className="w-full px-4 py-3 text-red-400 bg-red-500/10 rounded-xl text-sm font-medium hover:bg-red-500/20 flex items-center justify-center gap-2">
                    <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                    Excluir
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile rename overlay */}
        <AnimatePresence>
          {isMobileRenaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[160] flex items-end justify-center bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => {
                setIsMobileRenaming(false);
                setRenamingId(null);
                setRenameValue("");
              }}
            >
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md p-4 pb-10 bg-gray-900 border-t border-white/10 rounded-t-2xl"
              >
                <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
                  Renomear lista
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (renamingId) handleRename(renamingId);
                    setIsMobileRenaming(false);
                  }}
                  className="relative"
                >
                  <input
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setIsMobileRenaming(false);
                        setRenamingId(null);
                      }
                    }}
                    placeholder="Nome da lista"
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-400/50 disabled:opacity-50"
                    maxLength={40}
                    disabled={isRenamingList}
                    autoFocus
                  />
                  {isRenamingList && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                      <div className="w-4 h-4 border-[2px] border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
