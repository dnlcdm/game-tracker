import { Google as GoogleIcon } from "@mui/icons-material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ShieldIcon from "@mui/icons-material/Shield";
import BoltIcon from "@mui/icons-material/Bolt";
import { useUserAuth } from "../auth/hooks/useUserAuth";

export const LoginCard = () => {
  const { signInWithGoogle, isLoading } = useUserAuth();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#05070A] text-white">
      {/* Glows */}
      <div className="absolute -top-28 -left-28 w-[420px] h-[420px] rounded-full bg-blue-600/12 blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 w-[460px] h-[460px] rounded-full bg-purple-600/12 blur-[140px]" />

      {/* Grid sutil */}
      <div className="absolute inset-0 opacity-[0.10] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.35)_1px,transparent_0)] [background-size:26px_26px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,7,10,0.1),rgba(5,7,10,0.95))]" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[520px] flex-col justify-center px-5 py-10">
        {/* Logo + título */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-3xl bg-blue-500/25 blur-2xl" />
            <div className="relative grid h-14 w-14 place-items-center rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl">
              <SportsEsportsIcon
                sx={{ fontSize: 34 }}
                className="text-blue-300"
              />
            </div>
          </div>

          <h1 className="text-4xl font-black uppercase tracking-tight leading-tight">
            <span className="text-blue-400">Tracker</span>
          </h1>
          <p className="mt-2 max-w-[34ch] text-xs text-white/60">
            Registre nota, dificuldade, tempo, co-op e data de conclusão —
            rápido e bonito no celular.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl shadow-2xl ring-1 ring-white/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-black uppercase tracking-tight">
                Entrar
              </h2>
              <p className="mt-1 text-xs text-white/55">
                Um clique e você já está dentro.
              </p>
            </div>
          </div>

          <button
            onClick={signInWithGoogle}
            disabled={isLoading}
            className="group relative mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white py-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-black transition hover:bg-gray-100 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                Entrando…
              </>
            ) : (
              <>
                <GoogleIcon sx={{ fontSize: 18 }} />
                Entrar com Google
              </>
            )}

            {/* brilho no hover */}
            <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-[radial-gradient(500px_circle_at_50%_0%,rgba(59,130,246,0.22),transparent_45%)]" />
          </button>

          {/* Micro-benefícios */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
              <div className="flex items-center gap-2 text-white/80">
                <BoltIcon sx={{ fontSize: 16 }} className="text-blue-300" />
                <span className="text-xs font-extrabold">Rápido</span>
              </div>
              <p className="mt-1 text-[11px] text-white/55">
                Sem senha, sem fricção.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
              <div className="flex items-center gap-2 text-white/80">
                <ShieldIcon
                  sx={{ fontSize: 16 }}
                  className="text-emerald-300"
                />
                <span className="text-xs font-extrabold">Seguro</span>
              </div>
              <p className="mt-1 text-[11px] text-white/55">
                OAuth com Google.
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/45 leading-relaxed">
            Ao entrar, você concorda com{" "}
            <span className="cursor-pointer text-white/70 hover:underline">
              Termos
            </span>
            .
          </p>
        </div>

        {/* Footer simples */}
        <div className="mt-6 flex items-center justify-center gap-4 opacity-35">
          <div className="h-[1px] w-10 bg-white" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Mobile first
          </span>
          <div className="h-[1px] w-10 bg-white" />
        </div>
      </main>
    </div>
  );
};
