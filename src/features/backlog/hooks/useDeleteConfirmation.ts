import { useCallback, useState } from "react";

export const useDeleteConfirmation = () => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [gameIdToDelete, setGameIdToDelete] = useState<number | null>(null);

  const requestDelete = useCallback((gameId: number) => {
    setGameIdToDelete(gameId);
    setIsConfirming(true);
  }, []);

  const cancelDelete = useCallback(() => {
    setIsConfirming(false);
    setGameIdToDelete(null);
  }, []);

  const executeDelete = useCallback(
    (onConfirm: (gameId: number) => void) => {
      if (gameIdToDelete) {
        onConfirm(gameIdToDelete);
        setIsConfirming(false);
        setGameIdToDelete(null);
      }
    },
    [gameIdToDelete],
  );

  return { isConfirming, gameIdToDelete, requestDelete, cancelDelete, executeDelete };
};
