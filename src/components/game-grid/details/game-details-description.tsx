
interface Props {
    gameDescription: string;
}

export const GameDetailsDescription = ({ gameDescription }: Props) => {
    return (
        <div className="flex items-start gap-4 relative z-10">
            <div className="flex flex-col gap-1.5">

                <p className="text-[14px] leading-relaxed text-slate-300 font-light">
                    {gameDescription}
                </p>
            </div>
        </div>
    );
};
