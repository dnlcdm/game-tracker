import { useFetchBacklogGames } from "./hooks/useFetchBacklogGames";
import { EmptyState } from "../../components/empty-states/empty-states";
import { Toast } from "../../components/snackbar/toast";
import { useToast } from "../../components/snackbar/hooks/useToast";
import { BacklogContent } from "./components/backlog-content";

export const Backlog = () => {
  const { data, isPending, isError, isSuccess, isFetching, error } =
    useFetchBacklogGames();

  const { open, message, severity, showToast, hideToast } = useToast();

  if (isError) {
    return (
      <p style={{ color: "red" }}>
        {error instanceof Error ? error.message : "Erro ao carregar backlog"}
      </p>
    );
  }

  const isEmpty =
    isSuccess && !isFetching && !isPending && (data?.length ?? 0) === 0;

  return (
    <div className="text-white">
      {isEmpty ? (
        <EmptyState type="backlog" />
      ) : (
        <BacklogContent
          games={data ?? []}
          isLoading={isPending}
          showToast={showToast}
        />
      )}

      <Toast
        open={open}
        message={message}
        severity={severity}
        onClose={hideToast}
      />
    </div>
  );
};
