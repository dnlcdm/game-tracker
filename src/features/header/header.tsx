import Avatar from "@mui/material/Avatar";
import { useUserAuth } from "../auth/hooks/useUserAuth";

export default function Header() {
  const { session } = useUserAuth();
  return (
    <div className="flex items-center justify-between h-14 px-4 bg-blue-950">
      <p className="font-[BHHBogle] text-4xl text-white">Tracker</p>

      <div className="md:hidden">
        <Avatar
          src={session?.user.user_metadata.avatar_url}
          sx={{ width: 32, height: 32 }}
        />
      </div>
    </div>
  );
}
