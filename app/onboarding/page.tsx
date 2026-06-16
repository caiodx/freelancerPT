import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Se já completou o onboarding, vai directamente ao dashboard
  const { data: config } = await supabase
    .from("configuracoes_fiscais")
    .select("onboarding_completed")
    .eq("user_id", user.id)
    .single();

  if (config?.onboarding_completed) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
      {/* Header minimalista */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#1F4E79] rounded-lg flex items-center justify-center">
            <span className="text-white font-extrabold text-xs">F</span>
          </div>
          <span className="font-extrabold text-gray-900 text-sm tracking-tight">FreelancerPT</span>
        </div>
        <p className="text-xs text-gray-400">Configuração inicial</p>
      </header>

      {/* Wizard */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <OnboardingWizard userId={user.id} />
        </div>
      </main>
    </div>
  );
}
