import type { FC } from "react";
import { useApiQuery } from "../../hooks/useApi";

export const SearchGames: FC = () => {
  const { data } = useApiQuery<unknown>("/games");

  console.log(data);

  return (
    <p className="cursor-pointer text-center bg-blue-700 uppercase font-bold text-white p-6">
      Call api
    </p>
  );
};
