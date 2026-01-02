import React, { useMemo, useState } from "react";
import { useUserAuth } from "../auth/hooks/useUserAuth";

export const LoginCard: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { signInWithGoogle, signInWithEmail, isLoading } = useUserAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await signInWithEmail(email, password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || "Erro ao fazer login");
      } else {
        setErrorMsg("Erro desconhecido");
      }
    }
  };

  const tips = useMemo(
    () => [
      "Dica: troque de arma, não de sonho.",
      "Dica: checkpoints salvam — suas metas também.",
      "Dica: respira… boss fight não é no modo turbo.",
      "Dica: se travar, reinicia. Vale pra código e vida.",
      "Dica: grind diário > rush de um dia.",
    ],
    [],
  );
  const tip = useMemo(
    () => tips[Math.floor(Math.random() * tips.length)],
    [tips],
  );

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      color: "#E5E7EB",
      background:
        "radial-gradient(1200px 600px at 20% 10%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(900px 500px at 80% 90%, rgba(34,197,94,0.18), transparent 55%), linear-gradient(135deg, #050816 0%, #0B1026 50%, #070A17 100%)",
      position: "relative" as const,
      overflow: "hidden" as const,
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
    },
    glowBlob1: {
      position: "absolute" as const,
      width: "520px",
      height: "520px",
      left: "-160px",
      top: "-160px",
      background:
        "radial-gradient(circle at 30% 30%, rgba(168,85,247,0.55), transparent 55%)",
      filter: "blur(18px)",
      animation: "float1 10s ease-in-out infinite",
      pointerEvents: "none" as const,
    },
    glowBlob2: {
      position: "absolute" as const,
      width: "560px",
      height: "560px",
      right: "-200px",
      bottom: "-220px",
      background:
        "radial-gradient(circle at 30% 30%, rgba(34,197,94,0.35), transparent 60%)",
      filter: "blur(18px)",
      animation: "float2 12s ease-in-out infinite",
      pointerEvents: "none" as const,
    },

    card: {
      width: "min(440px, 100%)",
      borderRadius: "18px",
      padding: "28px",
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.06) 100%)",
      border: "1px solid rgba(255,255,255,0.14)",
      boxShadow:
        "0 18px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.18) inset",
      backdropFilter: "blur(14px)",
      position: "relative" as const,
    },

    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "6px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      color: "rgba(255,255,255,0.88)",
      background: "rgba(99,102,241,0.14)",
      border: "1px solid rgba(99,102,241,0.25)",
      marginBottom: "12px",
      letterSpacing: "0.3px",
    },

    title: {
      margin: 0,
      fontSize: "26px",
      lineHeight: 1.15,
      textAlign: "center" as const,
      letterSpacing: "0.4px",
      color: "#F9FAFB",
      textShadow: "0 0 16px rgba(99,102,241,0.35)",
    },

    subtitle: {
      marginTop: "10px",
      marginBottom: "22px",
      textAlign: "center" as const,
      color: "rgba(229,231,235,0.80)",
      fontSize: "14px",
    },

    label: {
      marginBottom: "6px",
      fontSize: "13px",
      color: "rgba(229,231,235,0.85)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },

    input: {
      width: "100%",
      padding: "12px 12px",
      marginBottom: "14px",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.14)",
      outline: "none",
      backgroundColor: "rgba(3, 6, 23, 0.55)",
      color: "#F9FAFB",
      boxSizing: "border-box" as const,
      boxShadow: "0 0 0 0 rgba(99,102,241,0.0)",
      transition:
        "transform 0.08s ease, box-shadow 0.15s ease, border-color 0.15s ease",
    },

    hintRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "-6px",
      marginBottom: "14px",
      fontSize: "12px",
      color: "rgba(229,231,235,0.65)",
    },

    error: {
      margin: "0 0 12px 0",
      padding: "10px 12px",
      borderRadius: "12px",
      fontSize: "12px",
      color: "#FFE4E6",
      background: "rgba(244,63,94,0.14)",
      border: "1px solid rgba(244,63,94,0.25)",
    },

    primaryBtn: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: "14px",
      border: "1px solid rgba(255,255,255,0.16)",
      cursor: isLoading ? "not-allowed" : "pointer",
      fontWeight: 800,
      letterSpacing: "0.4px",
      color: "#0B1026",
      background:
        "linear-gradient(90deg, #22C55E 0%, #60A5FA 40%, #A78BFA 100%)",
      boxShadow: "0 14px 30px rgba(0,0,0,0.35), 0 0 24px rgba(99,102,241,0.25)",
      opacity: isLoading ? 0.72 : 1,
      transform: isLoading ? "translateY(0)" : "translateY(0)",
      transition: "transform 0.08s ease, filter 0.15s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    },

    divider: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      margin: "18px 0",
      color: "rgba(229,231,235,0.55)",
      fontSize: "12px",
    },
    dividerLine: {
      flex: 1,
      height: "1px",
      background:
        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0.18) 70%, transparent 100%)",
    },
    dividerText: {
      padding: "0 10px",
      letterSpacing: "2px",
      fontWeight: 700,
      opacity: 0.85,
    },

    googleBtn: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: "14px",
      cursor: isLoading ? "not-allowed" : "pointer",
      border: "1px solid rgba(255,255,255,0.18)",
      backgroundColor: "rgba(255,255,255,0.06)",
      color: "rgba(255,255,255,0.92)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      fontSize: "15px",
      fontWeight: 700,
      opacity: isLoading ? 0.72 : 1,
      boxShadow: "0 10px 22px rgba(0,0,0,0.28)",
    },

    tip: {
      marginTop: "16px",
      padding: "10px 12px",
      borderRadius: "14px",
      background: "rgba(34,197,94,0.10)",
      border: "1px solid rgba(34,197,94,0.18)",
      color: "rgba(229,231,235,0.85)",
      fontSize: "12px",
      lineHeight: 1.35,
      display: "flex",
      gap: "10px",
      alignItems: "flex-start",
    },

    tinyIcon: {
      width: "22px",
      height: "22px",
      borderRadius: "8px",
      display: "grid",
      placeItems: "center",
      background: "rgba(34,197,94,0.16)",
      border: "1px solid rgba(34,197,94,0.22)",
      flex: "0 0 auto",
    },
  };

  const keyframes = `
    @keyframes float1 { 0%,100%{ transform: translate(0,0) } 50%{ transform: translate(40px, 25px) } }
    @keyframes float2 { 0%,100%{ transform: translate(0,0) } 50%{ transform: translate(-35px, -30px) } }

    /* foco “gamer glow” nos inputs */
    .gamer-input:focus {
      border-color: rgba(99,102,241,0.45) !important;
      box-shadow: 0 0 0 4px rgba(99,102,241,0.18), 0 0 24px rgba(168,85,247,0.14) !important;
      transform: translateY(-1px);
    }

    /* hover dos botões */
    .gamer-primary:hover { filter: brightness(1.05); transform: translateY(-1px); }
    .gamer-google:hover { background-color: rgba(255,255,255,0.10); }
  `;

  return (
    <div style={styles.page}>
      <style>{keyframes}</style>

      <div style={styles.glowBlob1} />
      <div style={styles.glowBlob2} />

      <div style={styles.card}>
        <h2 style={styles.title}>Acesse sua Biblioteca</h2>
        <p style={styles.subtitle}>
          Entre com suas credenciais e continue a campanha.
        </p>

        <form onSubmit={handleEmailLogin} style={{ width: "100%" }}>
          <div style={styles.label}>
            <span>E-mail</span>
            <span style={{ opacity: 0.7, fontSize: 12 }}>ID do jogador</span>
          </div>

          <input
            className="gamer-input"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
            autoComplete="email"
          />

          <div style={styles.label}>
            <span>Senha</span>
            <span style={{ opacity: 0.7, fontSize: 12 }}>chave secreta</span>
          </div>

          <input
            className="gamer-input"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
            autoComplete="current-password"
          />

          <div style={styles.hintRow}>
            <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span aria-hidden>🛡️</span>
              <span>Seus dados ficam seguros.</span>
            </span>
            <span style={{ opacity: 0.75 }}>v1.0</span>
          </div>

          {errorMsg && <div style={styles.error}>⚠️ {errorMsg}</div>}

          <button
            type="submit"
            disabled={isLoading}
            style={styles.primaryBtn}
            className="gamer-primary"
          >
            {isLoading ? "Carregando..." : "Entrar"}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>OU</span>
          <div style={styles.dividerLine} />
        </div>

        <button
          onClick={signInWithGoogle}
          disabled={isLoading}
          style={styles.googleBtn}
          className="gamer-google"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
            <path
              fill="#4285f4"
              d="M17.64 9.2q-.002-.956-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
            />
            <path
              fill="#34a853"
              d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18"
            />
            <path
              fill="#fbbc05"
              d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042z"
            />
            <path
              fill="#ea4335"
              d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71"
            />
          </svg>
          <span>Continuar com Google</span>
        </button>

        <div style={styles.tip}>
          <div style={styles.tinyIcon} aria-hidden>
            🧠
          </div>
          <div>
            <div
              style={{
                fontWeight: 800,
                marginBottom: 4,
                color: "rgba(229,231,235,0.92)",
              }}
            >
              Dica do lobby
            </div>
            <div>{tip}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// import React, { useMemo, useState } from "react";
// import { useUserAuth } from "../auth/hooks/useUserAuth";
//
// type Mode = "login" | "register";
//
// export const LoginCard: React.FC = () => {
//   const [mode, setMode] = useState<Mode>("login");
//
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//
//   // cadastro
//   const [displayName, setDisplayName] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//
//   // ui
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);
//   const [infoMsg, setInfoMsg] = useState<string | null>(null);
//   const [showPass, setShowPass] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//
//   const { signInWithGoogle, signInWithEmail, signUpWithEmail, isLoading } =
//     useUserAuth();
//
//   const tips = useMemo(
//     () => [
//       "Dica: troque de arma, não de sonho.",
//       "Dica: checkpoints salvam — suas metas também.",
//       "Dica: respira… boss fight não é no modo turbo.",
//       "Dica: se travar, reinicia. Vale pra código e vida.",
//       "Dica: grind diário > rush de um dia.",
//     ],
//     [],
//   );
//   const tip = useMemo(
//     () => tips[Math.floor(Math.random() * tips.length)],
//     [tips],
//   );
//
//   const resetMsgs = () => {
//     setErrorMsg(null);
//     setInfoMsg(null);
//   };
//
//   const handleEmailLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     resetMsgs();
//
//     try {
//       await signInWithEmail(email, password);
//     } catch (err: unknown) {
//       setErrorMsg(err instanceof Error ? err.message : "Erro desconhecido");
//     }
//   };
//
//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     resetMsgs();
//
//     if (!email.trim()) return setErrorMsg("Informe um e-mail válido.");
//     if (password.length < 6)
//       return setErrorMsg("A senha precisa ter pelo menos 6 caracteres.");
//     if (password !== confirmPassword)
//       return setErrorMsg("As senhas não coincidem.");
//
//     try {
//       const status = await signUpWithEmail(email, password, displayName);
//
//       if (status === "CONFIRM_EMAIL") {
//         setInfoMsg(
//           "Conta criada! Confira seu e-mail para confirmar e então faça login. 📩",
//         );
//         // opcional: voltar pro login automaticamente
//         setMode("login");
//         setPassword("");
//         setConfirmPassword("");
//       } else {
//         setInfoMsg("Conta criada e logada! Bem-vinda à campanha. ✨");
//       }
//     } catch (err: unknown) {
//       setErrorMsg(err instanceof Error ? err.message : "Erro desconhecido");
//     }
//   };
//
//   const styles = {
//     page: {
//       minHeight: "100vh",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "24px",
//       color: "#E5E7EB",
//       background:
//         "radial-gradient(1200px 600px at 20% 10%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(900px 500px at 80% 90%, rgba(34,197,94,0.18), transparent 55%), linear-gradient(135deg, #050816 0%, #0B1026 50%, #070A17 100%)",
//       position: "relative" as const,
//       overflow: "hidden" as const,
//       fontFamily:
//         'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
//     },
//     glowBlob1: {
//       position: "absolute" as const,
//       width: "520px",
//       height: "520px",
//       left: "-160px",
//       top: "-160px",
//       background:
//         "radial-gradient(circle at 30% 30%, rgba(168,85,247,0.55), transparent 55%)",
//       filter: "blur(18px)",
//       animation: "float1 10s ease-in-out infinite",
//       pointerEvents: "none" as const,
//     },
//     glowBlob2: {
//       position: "absolute" as const,
//       width: "560px",
//       height: "560px",
//       right: "-200px",
//       bottom: "-220px",
//       background:
//         "radial-gradient(circle at 30% 30%, rgba(34,197,94,0.35), transparent 60%)",
//       filter: "blur(18px)",
//       animation: "float2 12s ease-in-out infinite",
//       pointerEvents: "none" as const,
//     },
//     card: {
//       width: "min(460px, 100%)",
//       borderRadius: "18px",
//       padding: "22px",
//       background:
//         "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.06) 100%)",
//       border: "1px solid rgba(255,255,255,0.14)",
//       boxShadow:
//         "0 18px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.18) inset",
//       backdropFilter: "blur(14px)",
//       position: "relative" as const,
//     },
//     title: {
//       margin: 0,
//       fontSize: "26px",
//       lineHeight: 1.15,
//       textAlign: "center" as const,
//       letterSpacing: "0.4px",
//       color: "#F9FAFB",
//       textShadow: "0 0 16px rgba(99,102,241,0.35)",
//     },
//     subtitle: {
//       marginTop: "10px",
//       marginBottom: "14px",
//       textAlign: "center" as const,
//       color: "rgba(229,231,235,0.80)",
//       fontSize: "14px",
//     },
//     tabsWrap: {
//       display: "grid",
//       gridTemplateColumns: "1fr 1fr",
//       gap: "10px",
//       margin: "14px 0 18px",
//     },
//     tab: (active: boolean) => ({
//       padding: "10px 12px",
//       borderRadius: "14px",
//       border: "1px solid rgba(255,255,255,0.14)",
//       cursor: "pointer",
//       fontWeight: 900,
//       letterSpacing: "0.4px",
//       color: active ? "#0B1026" : "rgba(229,231,235,0.9)",
//       background: active
//         ? "linear-gradient(90deg, #22C55E 0%, #60A5FA 40%, #A78BFA 100%)"
//         : "rgba(255,255,255,0.06)",
//       boxShadow: active
//         ? "0 14px 30px rgba(0,0,0,0.35), 0 0 24px rgba(99,102,241,0.25)"
//         : "0 10px 22px rgba(0,0,0,0.18)",
//       transition: "transform 0.08s ease, filter 0.15s ease",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       gap: "8px",
//       userSelect: "none" as const,
//     }),
//     label: {
//       marginBottom: "6px",
//       fontSize: "13px",
//       color: "rgba(229,231,235,0.85)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//     },
//     inputWrap: { position: "relative" as const, marginBottom: "14px" },
//     input: {
//       width: "100%",
//       padding: "12px 12px",
//       borderRadius: "12px",
//       border: "1px solid rgba(255,255,255,0.14)",
//       outline: "none",
//       backgroundColor: "rgba(3, 6, 23, 0.55)",
//       color: "#F9FAFB",
//       boxSizing: "border-box" as const,
//       transition:
//         "transform 0.08s ease, box-shadow 0.15s ease, border-color 0.15s ease",
//     },
//     toggleBtn: {
//       position: "absolute" as const,
//       right: "10px",
//       top: "50%",
//       transform: "translateY(-50%)",
//       border: "1px solid rgba(255,255,255,0.16)",
//       background: "rgba(255,255,255,0.06)",
//       color: "rgba(229,231,235,0.92)",
//       borderRadius: "10px",
//       padding: "7px 10px",
//       cursor: "pointer",
//       fontSize: "12px",
//       fontWeight: 900,
//       letterSpacing: "0.3px",
//     },
//     hintRow: {
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       marginTop: "-6px",
//       marginBottom: "14px",
//       fontSize: "12px",
//       color: "rgba(229,231,235,0.65)",
//     },
//     error: {
//       margin: "0 0 12px 0",
//       padding: "10px 12px",
//       borderRadius: "12px",
//       fontSize: "12px",
//       color: "#FFE4E6",
//       background: "rgba(244,63,94,0.14)",
//       border: "1px solid rgba(244,63,94,0.25)",
//     },
//     info: {
//       margin: "0 0 12px 0",
//       padding: "10px 12px",
//       borderRadius: "12px",
//       fontSize: "12px",
//       color: "rgba(220,252,231,0.95)",
//       background: "rgba(34,197,94,0.12)",
//       border: "1px solid rgba(34,197,94,0.22)",
//     },
//     primaryBtn: {
//       width: "100%",
//       padding: "12px 14px",
//       borderRadius: "14px",
//       border: "1px solid rgba(255,255,255,0.16)",
//       cursor: isLoading ? "not-allowed" : "pointer",
//       fontWeight: 900,
//       letterSpacing: "0.4px",
//       color: "#0B1026",
//       background:
//         "linear-gradient(90deg, #22C55E 0%, #60A5FA 40%, #A78BFA 100%)",
//       boxShadow: "0 14px 30px rgba(0,0,0,0.35), 0 0 24px rgba(99,102,241,0.25)",
//       opacity: isLoading ? 0.72 : 1,
//       transition: "transform 0.08s ease, filter 0.15s ease",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       gap: "10px",
//     },
//     divider: {
//       display: "flex",
//       alignItems: "center",
//       width: "100%",
//       margin: "18px 0",
//       color: "rgba(229,231,235,0.55)",
//       fontSize: "12px",
//     },
//     dividerLine: {
//       flex: 1,
//       height: "1px",
//       background:
//         "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0.18) 70%, transparent 100%)",
//     },
//     dividerText: {
//       padding: "0 10px",
//       letterSpacing: "2px",
//       fontWeight: 800,
//       opacity: 0.85,
//     },
//     googleBtn: {
//       width: "100%",
//       padding: "12px 14px",
//       borderRadius: "14px",
//       cursor: isLoading ? "not-allowed" : "pointer",
//       border: "1px solid rgba(255,255,255,0.18)",
//       backgroundColor: "rgba(255,255,255,0.06)",
//       color: "rgba(255,255,255,0.92)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       gap: "10px",
//       fontSize: "15px",
//       fontWeight: 900,
//       opacity: isLoading ? 0.72 : 1,
//       boxShadow: "0 10px 22px rgba(0,0,0,0.28)",
//     },
//     tip: {
//       marginTop: "16px",
//       padding: "10px 12px",
//       borderRadius: "14px",
//       background: "rgba(34,197,94,0.10)",
//       border: "1px solid rgba(34,197,94,0.18)",
//       color: "rgba(229,231,235,0.85)",
//       fontSize: "12px",
//       lineHeight: 1.35,
//       display: "flex",
//       gap: "10px",
//       alignItems: "flex-start",
//     },
//     tinyIcon: {
//       width: "22px",
//       height: "22px",
//       borderRadius: "8px",
//       display: "grid",
//       placeItems: "center",
//       background: "rgba(34,197,94,0.16)",
//       border: "1px solid rgba(34,197,94,0.22)",
//       flex: "0 0 auto",
//     },
//   };
//
//   const keyframes = `
//     @keyframes float1 { 0%,100%{ transform: translate(0,0) } 50%{ transform: translate(40px, 25px) } }
//     @keyframes float2 { 0%,100%{ transform: translate(0,0) } 50%{ transform: translate(-35px, -30px) } }
//     .gamer-input:focus {
//       border-color: rgba(99,102,241,0.45) !important;
//       box-shadow: 0 0 0 4px rgba(99,102,241,0.18), 0 0 24px rgba(168,85,247,0.14) !important;
//       transform: translateY(-1px);
//     }
//     .gamer-primary:hover { filter: brightness(1.05); transform: translateY(-1px); }
//     .gamer-google:hover { background-color: rgba(255,255,255,0.10); }
//     .gamer-tab:hover { transform: translateY(-1px); }
//   `;
//
//   const headerTitle =
//     mode === "login" ? "Acesse sua Biblioteca" : "Crie sua Conta";
//   const headerSubtitle =
//     mode === "login" ? "" : "Crie seu perfil e comece a jornada.";
//
//   return (
//     <div style={styles.page}>
//       <style>{keyframes}</style>
//       <div style={styles.glowBlob1} />
//       <div style={styles.glowBlob2} />
//
//       <div style={styles.card}>
//         <h2 style={styles.title}>{headerTitle}</h2>
//         <p style={styles.subtitle}>{headerSubtitle}</p>
//
//         {/* Tabs */}
//         <div style={styles.tabsWrap}>
//           <button
//             type="button"
//             className="gamer-tab"
//             style={styles.tab(mode === "login")}
//             onClick={() => {
//               setMode("login");
//               resetMsgs();
//             }}
//           >
//             <span aria-hidden>🔑</span> Entrar
//           </button>
//
//           <button
//             type="button"
//             className="gamer-tab"
//             style={styles.tab(mode === "register")}
//             onClick={() => {
//               setMode("register");
//               resetMsgs();
//             }}
//           >
//             <span aria-hidden>✨</span> Criar conta
//           </button>
//         </div>
//
//         {infoMsg && <div style={styles.info}>✅ {infoMsg}</div>}
//         {errorMsg && <div style={styles.error}>⚠️ {errorMsg}</div>}
//
//         {/* Forms */}
//         {mode === "login" ? (
//           <form onSubmit={handleEmailLogin}>
//             <div style={styles.label}>
//               <span>E-mail</span>
//               <span style={{ opacity: 0.7, fontSize: 12 }}>ID do jogador</span>
//             </div>
//             <div style={styles.inputWrap}>
//               <input
//                 className="gamer-input"
//                 type="email"
//                 placeholder="seu@email.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 style={styles.input}
//                 required
//                 autoComplete="email"
//               />
//             </div>
//
//             <div style={styles.label}>
//               <span>Senha</span>
//               <span style={{ opacity: 0.7, fontSize: 12 }}>chave secreta</span>
//             </div>
//             <div style={styles.inputWrap}>
//               <input
//                 className="gamer-input"
//                 type={showPass ? "text" : "password"}
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 style={{ ...styles.input, paddingRight: 92 }}
//                 required
//                 autoComplete="current-password"
//               />
//               <button
//                 type="button"
//                 style={styles.toggleBtn}
//                 onClick={() => setShowPass((v) => !v)}
//               >
//                 {showPass ? "🙈" : "👁️"} {showPass ? "Ocultar" : "Mostrar"}
//               </button>
//             </div>
//
//             <div style={styles.hintRow}>
//               <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
//                 <span aria-hidden>🛡️</span>
//                 <span>Seus dados ficam seguros.</span>
//               </span>
//               <span style={{ opacity: 0.75 }}>v1.0</span>
//             </div>
//
//             <button
//               type="submit"
//               disabled={isLoading}
//               style={styles.primaryBtn}
//               className="gamer-primary"
//             >
//               <span aria-hidden>⚡</span>
//               {isLoading ? "Carregando..." : "Entrar"}
//             </button>
//           </form>
//         ) : (
//           <form onSubmit={handleRegister}>
//             <div style={styles.label}>
//               <span>Nome</span>
//               <span style={{ opacity: 0.7, fontSize: 12 }}>
//                 apelido (opcional)
//               </span>
//             </div>
//             <div style={styles.inputWrap}>
//               <input
//                 className="gamer-input"
//                 type="text"
//                 placeholder="Seu nick"
//                 value={displayName}
//                 onChange={(e) => setDisplayName(e.target.value)}
//                 style={styles.input}
//                 autoComplete="nickname"
//               />
//             </div>
//
//             <div style={styles.label}>
//               <span>E-mail</span>
//               <span style={{ opacity: 0.7, fontSize: 12 }}>
//                 login do jogador
//               </span>
//             </div>
//             <div style={styles.inputWrap}>
//               <input
//                 className="gamer-input"
//                 type="email"
//                 placeholder="seu@email.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 style={styles.input}
//                 required
//                 autoComplete="email"
//               />
//             </div>
//
//             <div style={styles.label}>
//               <span>Senha</span>
//               <span style={{ opacity: 0.7, fontSize: 12 }}>
//                 mín. 6 caracteres
//               </span>
//             </div>
//             <div style={styles.inputWrap}>
//               <input
//                 className="gamer-input"
//                 type={showPass ? "text" : "password"}
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 style={{ ...styles.input, paddingRight: 92 }}
//                 required
//                 autoComplete="new-password"
//               />
//               <button
//                 type="button"
//                 style={styles.toggleBtn}
//                 onClick={() => setShowPass((v) => !v)}
//               >
//                 {showPass ? "🙈" : "👁️"} {showPass ? "Ocultar" : "Mostrar"}
//               </button>
//             </div>
//
//             <div style={styles.label}>
//               <span>Confirmar senha</span>
//               <span style={{ opacity: 0.7, fontSize: 12 }}>repita a chave</span>
//             </div>
//             <div style={styles.inputWrap}>
//               <input
//                 className="gamer-input"
//                 type={showConfirm ? "text" : "password"}
//                 placeholder="••••••••"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 style={{ ...styles.input, paddingRight: 92 }}
//                 required
//                 autoComplete="new-password"
//               />
//               <button
//                 type="button"
//                 style={styles.toggleBtn}
//                 onClick={() => setShowConfirm((v) => !v)}
//               >
//                 {showConfirm ? "🙈" : "👁️"}{" "}
//                 {showConfirm ? "Ocultar" : "Mostrar"}
//               </button>
//             </div>
//
//             <button
//               type="submit"
//               disabled={isLoading}
//               style={styles.primaryBtn}
//               className="gamer-primary"
//             >
//               <span aria-hidden>✨</span>
//               {isLoading ? "Criando..." : "Criar conta"}
//             </button>
//           </form>
//         )}
//
//         {/* Divider */}
//         <div style={styles.divider}>
//           <div style={styles.dividerLine} />
//           <span style={styles.dividerText}>OU</span>
//           <div style={styles.dividerLine} />
//         </div>
//
//         {/* Google */}
//         <button
//           onClick={signInWithGoogle}
//           disabled={isLoading}
//           style={styles.googleBtn}
//           className="gamer-google"
//         >
//           <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
//             <path
//               fill="#4285f4"
//               d="M17.64 9.2q-.002-.956-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
//             />
//             <path
//               fill="#34a853"
//               d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18"
//             />
//             <path
//               fill="#fbbc05"
//               d="M3.964 10.712c-.18-.540-.282-1.117-.282-1.710 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042z"
//             />
//             <path
//               fill="#ea4335"
//               d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71"
//             />
//           </svg>
//           <span>
//             {mode === "login" ? "Continuar com Google" : "Cadastrar com Google"}
//           </span>
//         </button>
//
//         {/* Tip */}
//         <div style={styles.tip}>
//           <div style={styles.tinyIcon} aria-hidden>
//             🧠
//           </div>
//           <div>
//             <div
//               style={{
//                 fontWeight: 900,
//                 marginBottom: 4,
//                 color: "rgba(229,231,235,0.92)",
//               }}
//             >
//               Dica do lobby
//             </div>
//             <div>{tip}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
