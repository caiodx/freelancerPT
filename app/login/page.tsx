import { AuthForm } from "@/components/auth/AuthForm";
import { Shield } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-9 h-9 bg-[#1F4E79] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-[#1F4E79] tracking-tight">
              freelancer<span className="text-[#BF4700]">PT</span>
            </span>
          </Link>
          <p className="text-gray-500 text-sm mt-3">
            Bem-vindo de volta. Entra para ver o teu cofre fiscal.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Entrar na conta</h1>
          <AuthForm mode="login" />

          <p className="text-center text-sm text-gray-500 mt-6 pt-5 border-t border-gray-50">
            Não tens conta?{" "}
            <Link href="/register" className="text-[#1F4E79] font-semibold hover:underline">
              Criar grátis
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
