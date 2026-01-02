import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentVeryDissatisfiedRoundedIcon from "@mui/icons-material/SentimentVeryDissatisfiedRounded";

export const DIFFICULTY_CONFIG: Record<
  number,
  { icon: React.ReactElement; label: string; color: string }
> = {
  1: {
    icon: (
      <SentimentVerySatisfiedIcon
        className="text-green-500"
        fontSize="inherit"
      />
    ),
    label: "Fácil",
    color: "text-green-500",
  },
  2: {
    icon: (
      <SentimentSatisfiedAltIcon className="text-blue-400" fontSize="inherit" />
    ),
    label: "Médio",
    color: "text-blue-400",
  },
  3: {
    icon: (
      <SentimentSatisfiedIcon className="text-yellow-500" fontSize="inherit" />
    ),
    label: "Complicado",
    color: "text-yellow-500",
  },
  4: {
    icon: (
      <SentimentDissatisfiedIcon
        className="text-orange-500"
        fontSize="inherit"
      />
    ),
    label: "Difícil",
    color: "text-orange-500",
  },
  5: {
    icon: (
      <SentimentVeryDissatisfiedRoundedIcon
        className="text-red-500"
        fontSize="inherit"
      />
    ),
    label: "Imperdoável",
    color: "text-red-500",
  },
};
