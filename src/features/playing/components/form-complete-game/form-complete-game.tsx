import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import type { IGames } from "../../../search-games/types/games.types";
import { useUpdateToCompleteGame } from "../../hooks/useFinishGame";
import { FinishGameHeader } from "./finish-game-header";
import { FinishGameFormFields } from "./form-fields";
import { finishGameSchema, type FinishGameFormData } from "./types";

interface FinishGameModalProps {
  game: IGames;
  isOpen: boolean;
  onClose: () => void;
}

const todayIsoString = () => new Date().toISOString().split("T")[0];

export const FinishGameModal = ({
  game,
  isOpen,
  onClose,
}: FinishGameModalProps) => {
  const formMethods = useForm({
    resolver: zodResolver(finishGameSchema),
    defaultValues: {
      completed_at: todayIsoString(),
      co_op_friend: "",
      review: "",
      user_rating: 3,
      completion_type: "",
      platform_used: "",
      hours_played: { hours: undefined, minutes: 0 },
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;
  const { mutateAsync, isPending } = useUpdateToCompleteGame(game.id);

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FinishGameFormData) => {
    try {
      await mutateAsync(data);
      handleClose();
    } catch (error) {
      console.error("Erro ao concluir o jogo:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-[#111827] flex flex-col w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl border-t sm:border border-gray-800 shadow-2xl overflow-hidden transition-all">
        <div className="flex-none sticky top-0 z-20 bg-[#111827] border-b border-gray-800">
          <FinishGameHeader game={game} onClose={handleClose} />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0B0F1A]">
          <div className="w-full">
            <FormProvider {...formMethods}>
              <FinishGameFormFields
                onSubmit={handleSubmit(onSubmit)}
                isSaving={isSubmitting || isPending}
              />
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
