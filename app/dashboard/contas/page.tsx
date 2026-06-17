import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ContasCofreClient } from "@/components/dashboard/ContasCofreClient";

export default async function ContasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: contas }, { data: registos }] = await Promise.all([
    supabase
      .from("contas_cofre")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("cofre_registos")
      .select("conta_id")
      .eq("user_id", user.id),
  ]);

  // Contar registos por conta para mostrar uso
  const usos: Record<string, number> = {};
  for (const r of registos ?? []) {
    if (r.conta_id) usos[r.conta_id] = (usos[r.conta_id] ?? 0) + 1;
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <ContasCofreClient
        contas={contas ?? []}
        usos={usos}
        userId={user.id}
      />
    </div>
  );
}
