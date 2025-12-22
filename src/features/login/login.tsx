import React from "react";
import { useUserAuth } from "../auth/hooks/useUserAuth";

export const LoginCard: React.FC = () => {
  const { signInWithGoogle, isLoading } = useUserAuth();

  const googleButtonStyle = {
    backgroundColor: "#fff",
    color: "#757575",
    border: "1px solid #ccc",
    padding: "10px 15px",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    fontWeight: "500",
    marginTop: "20px",
    transition: "background-color 0.3s",
    opacity: isLoading ? 0.7 : 1,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1E293B", // Cor de fundo escura
      }}
    >
      <div
        style={{
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          width: "90%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "#333", marginBottom: "10px" }}>
          Acesse sua Biblioteca de Jogos
        </h2>
        <p style={{ color: "#666", marginBottom: "30px", textAlign: "center" }}>
          Conecte-se com sua conta Google para continuar.
        </p>

        <button
          onClick={signInWithGoogle}
          disabled={isLoading}
          style={googleButtonStyle}
        >
          <span className="mr-2">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                fill="#4285f4"
                fill-opacity="1"
                fill-rule="evenodd"
                stroke="none"
                d="M17.64 9.2q-.002-.956-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
              ></path>
              <path
                fill="#34a853"
                fill-opacity="1"
                fill-rule="evenodd"
                stroke="none"
                d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18"
              ></path>
              <path
                fill="#fbbc05"
                fill-opacity="1"
                fill-rule="evenodd"
                stroke="none"
                d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042z"
              ></path>
              <path
                fill="#ea4335"
                fill-opacity="1"
                fill-rule="evenodd"
                stroke="none"
                d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71"
              ></path>
            </svg>
          </span>
          {isLoading ? "Redirecionando..." : "Entrar com Google"}
        </button>
      </div>
    </div>
  );
};
