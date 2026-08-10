import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useSession() {
  const qc = useQueryClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        qc.invalidateQueries({ queryKey: ["session"] });
        qc.invalidateQueries({ queryKey: ["roles"] });
      }
    });
    return () => data.subscription.unsubscribe();
  }, [qc]);

  return useQuery<Session | null>({
    queryKey: ["session"],
    queryFn: async () => (await supabase.auth.getSession()).data.session,
    staleTime: 30_000,
  });
}

const STAFF = ["super_admin", "tech", "finance", "inventory", "support", "marketing"];

export function useRoles() {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const q = useQuery({
    queryKey: ["roles", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId!);
      if (error) throw error;
      return data.map((r) => r.role as string);
    },
  });
  const roles = q.data ?? [];
  return {
    roles,
    isStaff: roles.some((r) => STAFF.includes(r)),
    isSuperAdmin: roles.includes("super_admin"),
    isFinance: roles.includes("finance") || roles.includes("super_admin"),
    loading: q.isLoading,
    userId,
  };
}
