interface GameDetailsCoverProps {
  coverUrl: string;
  name: string;
}

export const GameDetailsCover = ({ coverUrl, name }: GameDetailsCoverProps) => {
  return (
    <div className="w-full md:w-5/12 relative shrink-0 h-[35vh] md:h-auto">
      <img
        src={coverUrl.replace("t_cover_big", "t_720p")}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-gray-950" />
    </div>
  );
};
