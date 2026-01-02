import { useState } from "react";

export const useExpandedGameRow = () => {
  const [expandedGameId, setExpandedGameId] = useState<string | number | null>(
    null,
  );

  const toggleExpanded = (id: string | number) => {
    setExpandedGameId((prev) => (prev === id ? null : id));
  };

  return { expandedGameId, toggleExpanded };
};
