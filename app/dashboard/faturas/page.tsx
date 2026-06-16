import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FaturasClient } from "@/components/dashboard/FaturasClient";

export default async function FaturasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: faturas }, { data: config }] = await Promise.all([
    supabase
      .from("faturas")
      .select("*")
      .eq("user_id", user.id)
      .order("data_fatura", { ascending: false }),
    supabase
      .from("configuracoes_fiscais")
      .select("*")
      .eq("user_id", user.id)
      .single(),
  ]);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <FaturasClient
        faturas={faturas ?? []}
        config={config}
        userId={user.id}
      />
    </div>
  );
}
