import { useEffect, useState } from "react";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SearchIcon from "@mui/icons-material/Search";
import GamepadIcon from "@mui/icons-material/Gamepad";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useUserAuth } from "./auth/hooks/useUserAuth";
import Avatar from "@mui/material/Avatar";

const SIDEBAR_STORAGE_KEY = "sidebar-collapsed";

type NavItem = {
  icon: typeof SearchIcon;
  label: string;
  url: string;
  shortcut?: string;
};

const MENU_ITEMS: NavItem[] = [
  { icon: SearchIcon, label: "Games", url: "/search", shortcut: "1" },
  { icon: BookmarksIcon, label: "Jogarei", url: "/backlog", shortcut: "2" },
  { icon: GamepadIcon, label: "Jogando", url: "/playing", shortcut: "3" },
  { icon: ShowChartIcon, label: "Stats", url: "/game-stats", shortcut: "4" },
];

/* ── SidebarNavItem ─────────────────────────────────────────── */

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
}

const SidebarNavItem = ({ item, isActive, collapsed }: SidebarNavItemProps) => (
  <Link
    key={item.url}
    to={item.url}
    className="block group relative"
    title={collapsed ? item.label : ""}
  >
    <div
      className={`flex items-center rounded-lg transition-all duration-200 ${
        collapsed ? "justify-center py-2.5" : "px-3 py-2.5"
      } ${
        isActive
          ? "bg-[#1F2937] text-white"
          : "hover:bg-[#1F2937]/50 hover:text-white"
      }`}
    >
      <item.icon
        className={`h-5 w-5 flex-shrink-0 transition-colors ${
          isActive ? "text-blue-400" : "text-[#9CA3AF]"
        }`}
      />
      {!collapsed && (
        <span className="ml-3 text-sm font-medium truncate">{item.label}</span>
      )}
    </div>
  </Link>
);

/* ── MainLayout ─────────────────────────────────────────────── */

export const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, signOut, isLoading } = useUserAuth();

  const [collapsed, setCollapsed] = useState(() => {
    const stored = sessionStorage.getItem(SIDEBAR_STORAGE_KEY);
    return stored ? JSON.parse(stored) : false;
  });

  const toggle = () =>
    setCollapsed((prev: boolean) => {
      const next = !prev;
      sessionStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(next));
      return next;
    });

  // Keyboard shortcuts: 1-4 for nav, shift+/ for toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.shiftKey && e.key === "?") { e.preventDefault(); toggle(); return; }
      const num = Number(e.key);
      if (num >= 1 && num <= MENU_ITEMS.length) {
        e.preventDefault();
        navigate(MENU_ITEMS[num - 1].url);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  const displayName = session?.user?.user_metadata?.name ?? "Player";
  const email =
    session?.user?.email ?? session?.user?.user_metadata?.email ?? "";
  const avatarUrl = session?.user?.user_metadata?.picture;

  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-[#030712] overflow-hidden text-white font-sans">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col h-full bg-[#111827] text-[#9CA3AF] border-r border-gray-800 transition-[width] duration-300 ease-in-out relative ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {/* Collapse toggle - positioned on the border */}
        <button
          type="button"
          onClick={toggle}
          title={collapsed ? "Expandir" : "Recolher"}
          className="absolute -right-3.5 top-[33px] z-10 flex items-center justify-center w-7 h-7 rounded-full bg-[#111827] border border-gray-800 text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] transition-colors shadow-lg"
        >
          {collapsed ? (
            <ChevronRightIcon sx={{ fontSize: 16 }} />
          ) : (
            <ChevronLeftIcon sx={{ fontSize: 16 }} />
          )}
        </button>

        {/* User info */}

        {/* User info */}
        {collapsed ? (
          <div className="px-2 py-3 border-b border-gray-800 flex justify-center" title={`${displayName}`}>
            <Avatar src={avatarUrl} sx={{ width: 36, height: 36 }} />
          </div>
        ) : (
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar src={avatarUrl} sx={{ width: 36, height: 36 }} />
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-[#9CA3AF] truncate">
                  {email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 pt-3 pb-4 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.url}
              item={item}
              isActive={location.pathname === item.url}
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* Footer: logout */}
        <div className="px-2 py-3 border-t border-gray-800 flex-shrink-0">
          {collapsed ? (
            <button
              type="button"
              onClick={signOut}
              disabled={isLoading}
              title={isLoading ? "Saindo..." : "Sair"}
              className="flex items-center justify-center w-full py-2 rounded-lg hover:bg-[#1F2937]/50 transition-colors text-[#9CA3AF] hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <LogoutIcon sx={{ fontSize: 20 }} />
            </button>
          ) : (
            <button
              type="button"
              onClick={signOut}
              disabled={isLoading}
              className="flex items-center justify-center w-full gap-2 px-3 py-2 rounded-lg text-sm font-bold bg-[#0B1220] border border-gray-800 text-gray-200 hover:bg-[#111827] hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <LogoutIcon sx={{ fontSize: 18 }} />
              {isLoading ? "Saindo..." : "Sair"}
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#030712] pb-20 md:pb-0">
        <div className="md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom bar — untouched */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#111827]/90 backdrop-blur-lg border-t border-gray-800 flex items-center justify-around px-2 z-50">
        {MENU_ITEMS.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
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
