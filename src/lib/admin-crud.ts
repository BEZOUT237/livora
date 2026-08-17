import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "date" | "image";

export type Field = {
  name: string;
  label: string;
  type?: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  help?: string;
  /** default value used when creating a new record */
  default?: string | number | boolean;
  /** show this field in the list table */
  inTable?: boolean;
};

export type Row = Record<string, unknown>;

/** Tables we allow the admin UI to write to. */
export type AdminTable =
  | "books"
  | "authors"
  | "publishers"
  | "categories"
  | "collections"
  | "collection_books"
  | "homepage_sections"
  | "suppliers"
  | "purchase_orders"
  | "purchase_order_items"
  | "promotions"
  | "orders"
  | "blog_posts"
  | "ambassadors"
  | "competitors"
  | "settings"
  | "user_roles"
  | "reviews"
  | "inventory_movements";

export function useAdminList(table: AdminTable, select = "*", orderBy?: { column: string; ascending?: boolean }) {
  return useQuery({
    queryKey: ["admin", table, select, orderBy?.column, orderBy?.ascending],
    queryFn: async () => {
      let q = supabase.from(table).select(select);
      if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      const { data, error } = await q.limit(500);
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });
}

export function useAdminMutations(table: AdminTable, pk = "id") {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", table] });
    qc.invalidateQueries({ queryKey: ["books"] });
    qc.invalidateQueries({ queryKey: ["home-sections"] });
  };

  const create = useMutation({
    mutationFn: async (values: Row) => {
      const { error } = await supabase.from(table).insert(values as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Created");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Row }) => {
      const { error } = await supabase
        .from(table)
        .update(values as never)
        .eq(pk, id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Saved");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq(pk, id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return { create, update, remove };
}

/** Upload a cover image and return a long-lived signed URL. */
export async function uploadCover(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("covers").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage.from("covers").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signErr || !data) throw signErr ?? new Error("Could not sign cover URL");
  return data.signedUrl;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Coerce raw form values to the shape Postgres expects. */
export function coerce(fields: Field[], raw: Record<string, unknown>): Row {
  const out: Row = {};
  for (const f of fields) {
    const v = raw[f.name];
    if (f.type === "number") {
      out[f.name] = v === "" || v == null ? null : Number(v);
    } else if (f.type === "boolean") {
      out[f.name] = v === true || v === "true" || v === "on";
    } else if (v === "") {
      out[f.name] = f.required ? "" : null;
    } else {
      out[f.name] = v ?? null;
    }
  }
  return out;
}
