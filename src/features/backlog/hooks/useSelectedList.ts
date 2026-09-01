import { useCallback, useState } from "react";

const SELECTED_LIST_KEY = "backlog-selected-list";

export const useSelectedList = () => {
  const [selectedListId, setSelectedListId] = useState<string | null>(() => {
    return localStorage.getItem(SELECTED_LIST_KEY) || null;
  });

  const handleSelectList = useCallback((listId: string | null) => {
    setSelectedListId(listId);
    if (listId) {
      localStorage.setItem(SELECTED_LIST_KEY, listId);
    } else {
      localStorage.removeItem(SELECTED_LIST_KEY);
    }
  }, []);

  return { selectedListId, handleSelectList };
};
