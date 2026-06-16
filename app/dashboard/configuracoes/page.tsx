import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ConfiguracoesClient } from "@/components/dashboard/ConfiguracoesClient";

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: config }, { data: perfil }, { data: subscricao }] = await Promise.all([
    supabase
      .from("configuracoes_fiscais")
      .select("*")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("users")
      .select("nome")
      .eq("id", user.id)
      .returns<Array<{ nome: string | null }>>()
      .single(),
    supabase
      .from("subscricoes")
      .select("status, plano, trial_ends_at, current_period_end")
      .eq("user_id", user.id)
      .single(),
  ]);

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Configurações</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Ajusta o teu perfil fiscal para cálculos exactos.
        </p>
      </div>
      <ConfiguracoesClient
        userId={user.id}
        email={user.email ?? ""}
        nomeInicial={perfil?.nome ?? ""}
        config={config}
        subscricao={subscricao}
      />
    </div>
  );
}
