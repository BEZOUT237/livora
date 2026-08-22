import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

const STAFF_ROLES = ["super_admin", "tech", "finance", "inventory", "support", "marketing"];

export const deleteAdminUser = createServerFn({ method: "POST" })
  .validator(z.object({ userId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const authorization = getRequestHeader("authorization");
    const token = authorization?.replace(/^Bearer\s+/i, "");
    if (!token) throw new Error("Authentication required");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !authData.user) throw new Error("Authentication required");

    const { data: roles, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", authData.user.id);
    if (roleError || !roles?.some((row) => STAFF_ROLES.includes(String(row.role)))) {
      throw new Error("Staff access required");
    }
    if (data.userId === authData.user.id) throw new Error("You cannot delete your own account");

    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw error;
    return { ok: true };
  });
