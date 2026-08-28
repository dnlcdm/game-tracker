import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import type { IGamesSupabase } from "../../../features/search-games/types/games.types";
import type { IGameList, IGameListItem } from "../types/list.types";
import { useToggleGameInList } from "../hooks/useToggleGameInList";
import { useCreateList } from "../hooks/useCreateList";

interface ListAssignModalProps {
  game: IGamesSupabase;
  lists: IGameList[];
  listItems: IGameListItem[];
  onClose: () => void;
}

export const ListAssignModal = ({
  game,
  lists,
  listItems,
  onClose,
}: ListAssignModalProps) => {
  const [newName, setNewName] = useState("");
  const [showCreateInput, setShowCreateInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const { mutate: toggleGame, isPending: isToggling, variables: toggleVars } = useToggleGameInList();
  const { mutate: createList, isPending: isCreating } = useCreateList();

  const gameListIds = new Set(
    listItems
      .filter((item) => item.game_id === game.id)
      .map((item) => item.list_id),
  );

  const handleToggle = useCallback(
    (listId: string) => {
      toggleGame({ listId, gameId: game.id });
    },
    [toggleGame, game.id],
  );

  const handleCreate = useCallback(() => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    createList(trimmed, {
      onSuccess: (newList) => {
        setNewName("");
        setShowCreateInput(false);
        toggleGame({ listId: newList.id, gameId: game.id });
      },
    });
  }, [newName, createList, toggleGame, game.id]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  const coverSrc = game.coverUrl || "/not-found-image-1.png";

  const content = (
    <>
      <div className="flex items-center gap-3 mb-4">
        <img
          src={coverSrc}
          alt={game.name}
          className="w-10 h-14 object-cover rounded-md flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-bold text-white truncate">{game.name}</p>
          <p className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
            Adicionar às listas
          </p>
        </div>
      </div>

      <div className="space-y-0.5 max-h-[40vh] overflow-y-auto custom-scrollbar">
        {lists.map((list) => {
          const isChecked = gameListIds.has(list.id);
          return (
            <button
              key={list.id}
              onClick={() => handleToggle(list.id)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-white/[0.04] active:bg-white/[0.08]"
            >
              {isToggling && toggleVars?.listId === list.id ? (
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <div className="w-3.5 h-3.5 border-[2px] border-blue-400/20 border-t-blue-400 rounded-full animate-spin" />
                </div>
              ) : isChecked ? (
                <CheckBoxIcon
                  sx={{ fontSize: 20 }}
                  className="text-blue-400 flex-shrink-0"
                />
              ) : (
                <CheckBoxOutlineBlankIcon
                  sx={{ fontSize: 20 }}
                  className="text-white/25 flex-shrink-0"
                />
              )}
              <span
                className={`text-sm font-medium truncate ${isToggling && toggleVars?.listId === list.id
                    ? "text-white/40"
                    : isChecked
                      ? "text-white"
                      : "text-white/60"
                  }`}
              >
                {list.name}
              </span>
            </button>
          );
        })}

        {lists.length === 0 && (
          <p className="text-xs text-white/30 text-center py-4">
            Nenhuma lista criada ainda
          </p>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-white/[0.06]">
        {showCreateInput ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
            className="flex items-center gap-2 relative"
          >
            <input
              ref={inputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setShowCreateInput(false);
                  setNewName("");
                }
              }}
              placeholder="Nome da lista"
              className="flex-1 bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-400/50 disabled:opacity-50"
              maxLength={40}
              disabled={isCreating}
              autoFocus
            />
            {isCreating && (
              <div className="absolute right-3 flex items-center">
                <div className="w-3.5 h-3.5 border-[2px] border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </form>
        ) : (
          <button
            onClick={() => {
              setShowCreateInput(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all"
          >
            <AddIcon sx={{ fontSize: 16 }} />
            Criar nova lista
          </button>
        )}
      </div>
    </>
  );

  return (
    <AnimatePresence>
      {/* Mobile: bottom sheet */}
      <div className="md:hidden">
        <motion.div
          className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          ref={sheetRef}
          className="fixed bottom-0 left-0 right-0 z-[151] bg-gray-900 border-t border-white/10 rounded-t-2xl px-4 pt-3 pb-8 touch-none"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />
          {content}
        </motion.div>
      </div>

      {/* Desktop: centered modal */}
      <div className="hidden md:block">
        <motion.div
          className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="fixed z-[151] top-1/2 left-1/2 w-full max-w-xs -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-white/10 rounded-xl shadow-2xl p-4"
          initial={{ opacity: 0, scale: 0.95, y: "-48%" }}
          animate={{ opacity: 1, scale: 1, y: "-50%" }}
          exit={{ opacity: 0, scale: 0.95, y: "-48%" }}
          transition={{ duration: 0.15 }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
            aria-label="Fechar"
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </button>
          {content}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
