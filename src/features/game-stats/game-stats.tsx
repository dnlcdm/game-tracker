import { useFetchGameStats } from "./hooks/useFetchGameStats";
import { useExpandedGameRow } from "./hooks/useExpandedGameRow";
import { useGameStatsSummary } from "./hooks/useGameStatsSummary";
import { useMobileViewPreference } from "./hooks/useMobileViewPreference";
import { useNamePopover } from "./hooks/useNamePopover";
import { useSelectedGameToFinish } from "./hooks/useSelectedGameToFinish";
import { FinishGameModal } from "../playing/components/form-complete-game/form-complete-game";
import { EmptyState } from "../../components/empty-states/empty-states";
import { DesktopStatsTable } from "./components/desktop-stats-table";
import { MobileStatsCards } from "./components/mobile-stats-cards";
import { MobileStatsTable } from "./components/mobile-stats-table";
import { MobileViewToggle } from "./components/mobile-view-toggle";
import { NamePopover } from "./components/name-popover";
import { StatsHeader } from "./components/stats-header";
import { useDeleteBacklogGame } from "../backlog/hooks/useDeleteBacklogGame";
import { ConfirmationModal } from "../../components/confirmation.modal/confirmation-modal";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { GAME_STATS_QUERY_KEY } from "../playing/constants";

export const StatsTable = () => {
  const { data, isPending } = useFetchGameStats();
  const { selectedGameToFinish, openModal, closeModal } =
    useSelectedGameToFinish();
  const { expandedGameId, toggleExpanded } = useExpandedGameRow();
  const { mobileView, setMobileView } = useMobileViewPreference("table");
  const {
    isOpen: isNamePopoverOpen,
    anchorEl: nameAnchorEl,
    text: namePopoverText,
    toggle: handleToggleNamePopover,
    close: closeNamePopover,
  } = useNamePopover();
  const { quickStats, totalTimeLabel } = useGameStatsSummary(data);

  const { mutate: onDelete, isPending: isPendingMutation } =
    useDeleteBacklogGame();
  const [isConfirming, setIsConfirming] = useState(false);
  const [gameIdToDelete, setGameIdToDelete] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const handleConfirmMoveToBacklog = () => {
    if (gameIdToDelete) {
      onDelete(gameIdToDelete, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [GAME_STATS_QUERY_KEY] });

          setIsConfirming(false);
          setGameIdToDelete(null);
        },
      });
    }
  };

  if (isPending)
    return (
      <div className="animate-pulse h-screen bg-white/[0.02] rounded-md border border-white/5" />
    );

  if ((data?.length ?? 0) === 0 && !isPending)
    return <EmptyState type="finished" />;

  return (
    <div className="w-full space-y-4">
      <ConfirmationModal
        isOpen={isConfirming}
        onClose={() => {
          setIsConfirming(false);
          setGameIdToDelete(null);
        }}
        onConfirm={handleConfirmMoveToBacklog}
        title="Atenção: Ação Irreversível"
        message="Você está prestes a excluir este jogo da sua biblioteca. Todos os dados salvos (incluindo sua avaliação) serão perdidos."
        confirmLabel="Sim, excluir"
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={isPendingMutation}
      />

      <StatsHeader
        totalCount={data?.length ?? 0}
        totalTimeLabel={totalTimeLabel}
        totalPlatinum={quickStats.totalPlatinum}
        coopCount={quickStats.coopCount}
        avgDiff={quickStats.avgDiff}
      />

      <DesktopStatsTable
        data={data}
        onEdit={openModal}
        onDelete={(game) => {
          setGameIdToDelete(game.id);
          setIsConfirming(true);
        }}
        onNameClick={handleToggleNamePopover}
      />

      <MobileViewToggle value={mobileView} onChange={setMobileView} />

      <div className="md:hidden">
        {mobileView === "table" ? (
          <MobileStatsTable
            data={data}
            expandedGameId={expandedGameId}
            onToggleExpanded={toggleExpanded}
            onEdit={openModal}
            onDelete={(game) => {
              setGameIdToDelete(game.id);
              setIsConfirming(true);
            }}
            onNameClick={handleToggleNamePopover}
          />
        ) : (
          <MobileStatsCards
            data={data}
            onEdit={openModal}
            onDelete={(game) => {
              setGameIdToDelete(game.id);
              setIsConfirming(true);
            }}
            onNameClick={handleToggleNamePopover}
          />
        )}
      </div>

      <NamePopover
        open={isNamePopoverOpen}
        anchorEl={nameAnchorEl}
        text={namePopoverText}
        onClose={closeNamePopover}
      />

      {selectedGameToFinish && (
        <FinishGameModal
          game={selectedGameToFinish}
          isOpen={!!selectedGameToFinish}
          onClose={closeModal}
        />
      )}
    </div>
  );
};
