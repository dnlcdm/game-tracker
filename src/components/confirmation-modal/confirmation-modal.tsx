import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useEffect, useState } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "info";
  isLoading?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar?",
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "danger",
  isLoading = false,
}: ConfirmationModalProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = "hidden"; 
    } else {
      const timer = setTimeout(() => setShow(false), 200); 
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-sm transform rounded-2xl border border-white/10 bg-[#0B0F1A] p-6 shadow-2xl transition-all duration-300 ${
          isOpen ? "translate-y-0 scale-100" : "translate-y-10 scale-95"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
              variant === "danger"
                ? "bg-red-500/10 text-red-500"
                : "bg-blue-500/10 text-blue-500"
            }`}
          >
            <WarningAmberIcon fontSize="large" />
          </div>

          <h3 className="mb-2 text-xl font-black text-white uppercase tracking-tighter italic">
            {title}
          </h3>
          
          <p className="mb-8 text-sm text-gray-400 font-medium leading-relaxed">
            {message}
          </p>

          <div className="flex w-full flex-col-reverse gap-3 sm:flex-row">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-white/5 px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 transition-colors active:bg-white/10 sm:py-3"
            >
              {cancelLabel}
            </button>
            
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 rounded-xl px-6 py-4 text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95 disabled:opacity-50 sm:py-3 ${
                variant === "danger"
                  ? "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/20"
                  : "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20"
              }`}
            >
              {isLoading ? "Processando..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};