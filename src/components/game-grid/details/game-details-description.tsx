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
    const [showTranslated, setShowTranslated] = useState(true);

    const finalTranslation = cachedTranslation || translatedText;
    const hasTranslation = !!finalTranslation;
    const isShowingTranslation = hasTranslation && showTranslated;

    const handleTranslateToggle = () => {
        if (!hasTranslation) {
            mutate({ gameId, text: gameDescription }, {
                onSuccess: () => setShowTranslated(true)
            });
        } else {
            setShowTranslated(!showTranslated);
        }
    };

    return (
        <div className="flex items-start gap-4 relative z-10 w-full">
            <div className="flex flex-col gap-3 w-full">
                <p className="text-[14px] leading-relaxed text-slate-300 font-light">
                    {isShowingTranslation ? finalTranslation : gameDescription}
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleTranslateToggle}
                        disabled={isPending}
                        title={isShowingTranslation ? "Mostrar idioma original" : "Traduzir descrição"}
                        className="text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50 hover:bg-slate-800/50 px-2 py-1.5 min-h-[32px] rounded inline-flex items-center gap-2 text-xs font-medium"
                    >
                        <TranslateIcon fontSize="small" />
                        <span>
                            {isShowingTranslation
                                ? "Ver original"
                                : hasTranslation
                                    ? "Ver tradução"
                                    : "Traduzir"}
                        </span>
                    </button>
                    {isPending && <span className="text-[12px] text-slate-400 animate-pulse">Traduzindo...</span>}
                    {isError && !isPending && <span className="text-[12px] text-red-400">Falha na tradução. Tente novamente.</span>}
                </div>
            </div>
        </div>
    );
};
