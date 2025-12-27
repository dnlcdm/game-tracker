import BookmarksIcon from "@mui/icons-material/Bookmarks";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SearchIcon from "@mui/icons-material/Search";
import GamepadIcon from "@mui/icons-material/Gamepad";
import { Link, Outlet, useLocation } from "react-router";
import { useUserAuth } from "./auth/hooks/useUserAuth";
import Avatar from "@mui/material/Avatar";

export const MainLayout = () => {
  const location = useLocation();
  const { session } = useUserAuth();

  const menuItems = [
    { icon: SearchIcon, label: "Games", url: "/search" },
    { icon: BookmarksIcon, label: "Jogarei", url: "/backlog" },
    { icon: GamepadIcon, label: "Jogando", url: "/playing" },
    { icon: ShowChartIcon, label: "Stats", url: "/game-stats" },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#030712] overflow-hidden text-white font-sans">
      <aside className="hidden md:flex flex-col h-full w-64 bg-[#111827] text-[#9CA3AF] border-r border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-[#0F172A]/30">
          <div className="flex items-center p-2 rounded-xl">
            <Avatar
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

      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#030712] pb-20 md:pb-0">
        <div className="p-4 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Outlet />
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#111827]/90 backdrop-blur-lg border-t border-gray-800 flex items-center justify-around px-2 z-50">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isActive ? "text-blue-400" : "text-gray-500"
              }`}
            >
              <item.icon sx={{ fontSize: 24 }} />
              <span className="text-[10px] font-bold uppercase tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 bg-blue-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
