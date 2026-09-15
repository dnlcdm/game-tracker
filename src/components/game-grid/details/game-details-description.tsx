import { useState } from 'react';
import { useTranslateDescription } from "../../../hooks/useTranslateDescription";
import TranslateIcon from '@mui/icons-material/Translate';

interface Props {
    gameId: number;
    gameDescription: string;
    cachedTranslation: string | null;
}

export const GameDetailsDescription = ({ gameId, gameDescription, cachedTranslation }: Props) => {
    const { mutate, data: translatedText, isPending, isError } = useTranslateDescription();
    const [isTranslated, setIsTranslated] = useState(false);

    const finalTranslation = cachedTranslation || translatedText;
    const hasTranslation = !!finalTranslation;
    const showTranslateButton = !hasTranslation && !isTranslated;

    const handleTranslate = () => {
        if (showTranslateButton) {
            mutate({ gameId, text: gameDescription }, {
                onSuccess: () => setIsTranslated(true)
            });
        }
    };

    return (
        <div className="flex items-start gap-4 relative z-10 w-full">
            <div className="flex flex-col gap-1.5 w-full">
                <p className="text-[14px] leading-relaxed text-slate-300 font-light">
                    {finalTranslation || gameDescription}
                </p>
                {showTranslateButton && (
                    <div className="flex items-center gap-2 mt-1">
                        <button
                            onClick={handleTranslate}
                            disabled={isPending}
                            title="Traduzir descrição"
                            className="text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50 hover:bg-slate-800/50 p-1 rounded inline-flex"
                        >
                            <TranslateIcon fontSize="small" />
                        </button>
                        {isPending && <span className="text-[12px] text-slate-400 animate-pulse">Traduzindo...</span>}
                        {isError && !isPending && <span className="text-[12px] text-red-400">Falha na tradução. Tente novamente.</span>}
                    </div>
                )}
            </div>
        </div>
    );
};
