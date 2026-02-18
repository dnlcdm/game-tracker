import Avatar from "@mui/material/Avatar";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUserAuth } from "../auth/hooks/useUserAuth";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export default function Header() {
  const { session, isLoading, signOut } = useUserAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const displayName = session?.user?.user_metadata?.name ?? "Player";

  const email =
    session?.user?.email ?? session?.user?.user_metadata?.email ?? "";

  const avatarUrl = session?.user?.user_metadata?.picture ?? "";

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut();
    handleCloseMenu();
  };

  return (
    <div className="flex items-center justify-between sm:h-14 h-11 px-4 bg-blue-950 border-b border-blue-900/40">
      <p className="font-[BHHBogle] text-2xl sm:text-4xl text-white">Tracker</p>

      <div className="md:hidden flex items-center gap-3">
        <IconButton
          onClick={handleOpenMenu}
          disabled={isLoading || !session}
          sx={{ p: 0.5 }}
          aria-label="Abrir menu do perfil"
        >
          <Avatar src={avatarUrl} sx={{ width: 24, height: 24 }} />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 3,
              bgcolor: "#0B1220",
              border: "1px solid rgba(31,41,55,0.9)",
              color: "white",
              minWidth: 260,
            },
          }}
        >
          <div style={{ padding: "10px 14px" }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 900, lineHeight: 1.1 }}
              noWrap
            >
              {displayName}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(156,163,175,0.9)" }}
              noWrap
            >
              {email}
            </Typography>
          </div>

          <Divider sx={{ borderColor: "rgba(31,41,55,0.9)" }} />

          <MenuItem onClick={handleLogout} disabled={isLoading}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: "rgba(229,231,235,0.9)" }} />
            </ListItemIcon>
            {isLoading ? "Saindo..." : "Sair"}
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
