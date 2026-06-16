"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type Mode = "login" | "register";

interface AuthFormProps {
  mode?: Mode;
  redirectTo?: string;
}

export function AuthForm({ mode = "login", redirectTo = "/dashboard" }: AuthFormProps) {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const callbackUrl = `${baseUrl}/auth/callback?next=${redirectTo}`;

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl,
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (error) {
      setError("Erro ao enviar o link. Tenta novamente.");
    } else {
      setSent(true);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    });

    if (error) {
      setGoogleLoading(false);
      setError("Erro ao iniciar sessão com Google.");
    }
    // Se não houve erro, o browser redireciona automaticamente
  }

  if (sent) {
    return (
      <div className="text-center space-y-4 py-6">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7 text-green-600" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">Verifica o teu email</p>
          <p className="text-gray-500 text-sm mt-1">
            Enviámos um link mágico para <strong>{email}</strong>.<br />
            Clica no link para entrar — não precisas de password.
          </p>
        </div>
        <button
          onClick={() => setSent(false)}
          className="text-sm text-[#1F4E79] hover:underline"
        >
          Usar outro email
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Google OAuth */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 font-semibold border-gray-200 hover:bg-gray-50"
        onClick={handleGoogle}
        disabled={googleLoading || loading}
      >
        {googleLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Chrome className="w-4 h-4 mr-2" />
        )}
        Continuar com Google
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-gray-400">ou usa o teu email</span>
        </div>
      </div>

      {/* Magic link */}
      <form onSubmit={handleMagicLink} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="teu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="h-11"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-11 bg-[#BF4700] hover:bg-[#a33a00] font-bold"
          disabled={loading || !email}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Mail className="w-4 h-4 mr-2" />
          )}
          {mode === "register" ? "Criar conta — receber link" : "Entrar com link mágico"}
        </Button>
      </form>

      <p className="text-xs text-center text-gray-400">
        Sem passwords. Enviamos um link para o teu email — um clique e entras.
      </p>
    </div>
  );
}
