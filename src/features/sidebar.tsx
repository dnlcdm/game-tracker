import BookmarksIcon from "@mui/icons-material/Bookmarks";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SearchIcon from "@mui/icons-material/Search";
import GamepadIcon from "@mui/icons-material/Gamepad";
import { Link, Outlet, useLocation } from "react-router";
import { useUserAuth } from "./auth/hooks/useUserAuth";
import Avatar from "@mui/material/Avatar";

export const MainLayout = () => {
  const location = useLocation();

  const menuItems = [
    { icon: SearchIcon, label: "Games", url: "/search" },
    { icon: GamepadIcon, label: "Jogando", url: "/playing" },
    { icon: BookmarksIcon, label: "Jogarei", url: "/backlog" },
    { icon: ShowChartIcon, label: "Game stats", url: "/game-stats" },
  ];

  const { session } = useUserAuth();

  console.log(session?.user);

  return (
    <div className="flex h-screen w-full bg-[#030712] overflow-hidden text-white">
      <aside className="flex flex-col h-full w-64 bg-[#111827] text-[#9CA3AF] border-r border-gray-800 font-sans">
        <div className="p-4 border-b border-gray-800 bg-[#0F172A]/30">
          <div className="flex items-center p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <Avatar
              alt="Remy Sharp"
              src={session?.user.user_metadata.avatar_url}
              sx={{ width: 32, height: 32 }}
            />
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">
                {session?.user.user_metadata.full_name}
              </p>
              <p className="text-[11px] text-[#9CA3AF] truncate">
                {session?.user.user_metadata.email}
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url;

            return (
              <Link key={item.url} to={item.url} className="block">
                <div
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#1F2937] text-white shadow-lg"
                      : "hover:bg-[#1F2937]/50 hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 mr-3 transition-colors ${
                      isActive ? "text-blue-400" : "text-[#9CA3AF]"
                    }`}
                  />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#030712]">
        <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
