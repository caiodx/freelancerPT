import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CofreRegistosClient } from "@/components/dashboard/CofreRegistosClient";

export default async function CofrePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: registos }, { data: config }] = await Promise.all([
    supabase
      .from("cofre_registos")
      .select("*")
      .eq("user_id", user.id)
      .order("data", { ascending: false }),
    supabase
      .from("configuracoes_fiscais")
      .select("*")
      .eq("user_id", user.id)
      .single(),
  ]);

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <CofreRegistosClient
        registos={registos ?? []}
        userId={user.id}
        isentoIva={config?.isento_iva ?? false}
      />
    </div>
  );
}
