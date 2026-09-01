import { useState } from "react";
import { GameGrid } from "../../../components/game-grid/grid/game-grid";
import { FreeGameCard } from "../../../components/free-game-card/free-game-card";
import { ConfirmationModal } from "../../../components/confirmation-modal/confirmation-modal";
import { BacklogListsSidebar } from "./backlog-lists-sidebar";
import { ListAssignModal } from "./list-assign-modal";
import { FreeGameCardSkeleton } from "./skeletons/free-game-card-skeleton";
import { SidebarSkeleton } from "./skeletons/sidebar-skeleton";
import { MobileSidebarSkeleton } from "./skeletons/mobile-sidebar-skeleton";
import { useBacklogGameActions } from "../hooks/useBacklogGameActions";
import { useBacklogListFilter } from "../hooks/useBacklogListFilter";
import { useDeleteConfirmation } from "../hooks/useDeleteConfirmation";
import { useSelectedList } from "../hooks/useSelectedList";
import { useFetchLists } from "../hooks/useFetchLists";
import { useFetchListItems } from "../hooks/useFetchListItems";
import type { IGamesSupabase } from "../../search-games/types/games.types";

interface BacklogContentProps {
    games: IGamesSupabase[];
    isLoading: boolean;
    showToast: (message: string, severity: "success" | "error") => void;
}

export const BacklogContent = ({ games, isLoading, showToast }: BacklogContentProps) => {
    const { data: lists = [], isPending: isListsPending } = useFetchLists();
    const { data: listItems = [], isPending: isListItemsPending } = useFetchListItems();
    const isSidebarLoading = isListsPending || isListItemsPending;

    const { selectedListId, handleSelectList } = useSelectedList();
    const { isConfirming, requestDelete, cancelDelete, executeDelete } = useDeleteConfirmation();
    const { gameActions, isDeleting, confirmDelete } = useBacklogGameActions({
        showToast,
        onRequestDelete: requestDelete,
    });

    const { gameCountByList, uncategorizedCount, filteredGames } = useBacklogListFilter({
        games,
        listItems,
        selectedListId,
    });

    const [assignGame, setAssignGame] = useState<IGamesSupabase | null>(null);

    const sidebarProps = {
        lists,
        selectedListId,
        onSelectList: handleSelectList,
        gameCountByList,
        totalCount: games.length,
        uncategorizedCount,
    };

    return (
        <>
            <FreeGameCard skeleton={<FreeGameCardSkeleton />} />

            <div className="block md:hidden">
                {isSidebarLoading ? (
                    <MobileSidebarSkeleton />
                ) : (
                    <BacklogListsSidebar {...sidebarProps} />
                )}
            </div>

            <div className="flex gap-6">
                <div className="hidden md:block">
                    {isSidebarLoading ? (
                        <SidebarSkeleton />
                    ) : (
                        <BacklogListsSidebar {...sidebarProps} />
                    )}
                </div>

                <div className="flex-1 min-w-0 md:pr-4">
                    <GameGrid
                        items={filteredGames}
                        actions={gameActions}
                        isLoading={isLoading}
                        onListAssign={(game) => setAssignGame(game)}
                    />
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirming}
                onClose={cancelDelete}
                onConfirm={() => executeDelete(confirmDelete)}
                title="Atenção: Ação Irreversível"
                message="Você está prestes a remover o jogo dessa lista."
                confirmLabel="Sim, remover"
                cancelLabel="Cancelar"
                variant="danger"
                isLoading={isDeleting}
            />

            {assignGame && (
                <ListAssignModal
                    game={assignGame}
                    lists={lists}
                    listItems={listItems}
                    onClose={() => setAssignGame(null)}
                />
            )}
        </>
    );
};
