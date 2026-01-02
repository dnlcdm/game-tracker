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

  if (isPending)
    return (
      <div className="animate-pulse h-screen bg-white/[0.02] rounded-md border border-white/5" />
    );

  if ((data?.length ?? 0) === 0 && !isPending)
    return <EmptyState type="finished" />;

  return (
    <div className="w-full space-y-4">
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
            onNameClick={handleToggleNamePopover}
          />
        ) : (
          <MobileStatsCards
            data={data}
            onEdit={openModal}
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
