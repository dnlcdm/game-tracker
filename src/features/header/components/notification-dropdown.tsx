import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useNotifications, type INotification } from "../hooks/useNotifications";
import { usePushNotifications } from "../hooks/usePushNotifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";

export const NotificationDropdown = () => {
    const { notifications, unreadCount, isPending, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const { isSupported, isSubscribed, isPushing, subscribeToPush } = usePushNotifications();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRead = (notification: INotification) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }

        handleClose();
        console.log(notification)
        navigate(`/backlog?tab=price&game=${notification.game_id}`);
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                sx={{ color: "white" }}
                disabled={isPending}
                title="Notificações de Preços"
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        bgcolor: "#0f172a",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.1)",
                        width: 320,
                        maxHeight: 400,
                        borderRadius: 2,
                        boxShadow: "0px 10px 30px rgba(0,0,0,0.5)",
                    }
                }}
            >

                {unreadCount > 0 && (
                    <button
                        className="text-xs text-blue-400 hover:text-blue-300"
                        onClick={() => markAllAsRead()}
                    >
                        Marcar lidas
                    </button>
                )}

                {isSupported && !isSubscribed && (
                    <div className="px-4 pb-3">
                        <button
                            onClick={subscribeToPush}
                            disabled={isPushing}
                            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-md transition-colors shadow-sm cursor-pointer"
                        >
                            {isPushing ? <CircularProgress size={12} color="inherit" /> : <NotificationsActiveIcon sx={{ fontSize: 14 }} />}
                            Ativar Notificações no Dispositivo
                        </button>
                    </div>
                )}

                {isPending ? (
                    <div className="flex justify-center py-6">
                        <CircularProgress size={24} className="text-white" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                        <Typography variant="body2">Nenhuma notificação por aqui.</Typography>
                    </div>
                ) : (
                    <div className="flex flex-col custom-scrollbar overflow-y-auto max-h-[300px]">
                        {notifications.map((notification) => (
                            <MenuItem
                                key={notification.id}
                                onClick={() => handleRead(notification)}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    px: 3,
                                    py: 1.5,
                                    bgcolor: notification.is_read ? "transparent" : "rgba(59, 130, 246, 0.08)",
                                    "&:hover": {
                                        bgcolor: "rgba(255, 255, 255, 0.05)",
                                    },
                                    whiteSpace: "normal"
                                }}
                            >
                                <div className="flex w-full items-start justify-between mb-1">
                                    <div className="flex items-center">
                                        <Typography variant="subtitle2" sx={{ fontWeight: notification.is_read ? 500 : 700, fontSize: "0.85rem", color: notification.is_read ? "#e2e8f0" : "#60a5fa" }}>
                                            {notification.title}
                                        </Typography>
                                        {!notification.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 ml-2 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                                    </div>

                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNotification(notification.id);
                                        }}
                                        sx={{
                                            p: 0.3,
                                            mt: -0.5,
                                            mr: -1.5,
                                            color: "rgba(255,255,255,0.2)",
                                            "&:hover": { color: "#f87171", bgcolor: "rgba(248,113,113,0.1)" }
                                        }}
                                        title="Apagar notificação"
                                    >
                                        <Close sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </div>

                                <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: 1.4, mb: 1.5, pr: 2 }}>
                                    {notification.message}
                                </Typography>

                                <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.7rem", alignSelf: "flex-end" }}>
                                    {new Date(notification.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                                </Typography>
                            </MenuItem>
                        ))}
                    </div>
                )}
            </Menu>
        </>
    );
};
