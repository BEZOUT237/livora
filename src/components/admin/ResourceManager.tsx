import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "date" | "select";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  step?: string;
  placeholder?: string;
  /** static options for select */
  options?: { value: string; label: string }[];
  /** load options from another table: [table, valueCol, labelCol] */
  lookup?: { table: string; value: string; label: string };
  default?: string | number | boolean | null;
  help?: string;
};

export type Column = {
  name: string;
  label: string;
  render?: (row: Row) => React.ReactNode;
  className?: string;
};

export type Row = Record<string, unknown>;

type Props = {
  title: string;
  description?: string;
  table: string;
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
  columns: Column[];
  fields: Field[];
  searchColumns?: string[];
  idColumn?: string;
};

function useLookupOptions(fields: Field[]) {
  const lookups = fields.filter((f) => f.lookup);
  return useQuery({
    queryKey: ["admin-lookups", lookups.map((l) => l.lookup!.table).join(",")],
    enabled: lookups.length > 0,
    queryFn: async () => {
      const out: Record<string, { value: string; label: string }[]> = {};
      for (const f of lookups) {
        const lk = f.lookup!;
        const { data } = await supabase
          .from(lk.table as never)
          .select(`${lk.value},${lk.label}`)
          .limit(500);
        out[f.name] = ((data ?? []) as unknown as Row[]).map((r) => ({
          value: String(r[lk.value]),
          label: String(r[lk.label] ?? r[lk.value]),
        }));
      }
      return out;
    },
  });
}

function emptyForm(fields: Field[]): Record<string, unknown> {
  const o: Record<string, unknown> = {};
  for (const f of fields) o[f.name] = f.default ?? (f.type === "boolean" ? false : "");
  return o;
}

export function ResourceManager({
  title,
  description,
  table,
  select = "*",
  orderBy,
  columns,
  fields,
  searchColumns = [],
  idColumn = "id",
}: Props) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(() => emptyForm(fields));
  const [search, setSearch] = useState("");

  const { data: lookups } = useLookupOptions(fields);

  const list = useQuery({
    queryKey: ["admin-res", table],
    queryFn: async () => {
      let q = supabase.from(table as never).select(select);
      if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      const { data, error } = await q.limit(500);
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const save = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const clean: Record<string, unknown> = {};
      for (const f of fields) {
        const v = payload[f.name];
        if (f.type === "number") clean[f.name] = v === "" || v == null ? null : Number(v);
        else if (f.type === "boolean") clean[f.name] = Boolean(v);
        else clean[f.name] = v === "" ? null : v;
      }
      if (editing) {
        const { error } = await supabase
          .from(table as never)
          .update(clean as never)
          .eq(idColumn, editing[idColumn] as string);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table as never).insert(clean as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Saved" : "Created");
      setOpen(false);
      setEditing(null);
      void qc.invalidateQueries({ queryKey: ["admin-res", table] });
      void qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (row: Row) => {
      const { error } = await supabase
        .from(table as never)
        .delete()
        .eq(idColumn, row[idColumn] as string);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      void qc.invalidateQueries({ queryKey: ["admin-res", table] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = useMemo(() => {
    const all = list.data ?? [];
    if (!search.trim() || searchColumns.length === 0) return all;
    const s = search.toLowerCase();
    return all.filter((r) => searchColumns.some((c) => String(r[c] ?? "").toLowerCase().includes(s)));
  }, [list.data, search, searchColumns]);

  function startCreate() {
    setEditing(null);
    setForm(emptyForm(fields));
    setOpen(true);
  }

  function startEdit(row: Row) {
    setEditing(row);
    const o: Record<string, unknown> = {};
    for (const f of fields) o[f.name] = row[f.name] ?? (f.type === "boolean" ? false : "");
    setForm(o);
    setOpen(true);
  }

  return (
    <section className="rounded-lg border border-border bg-card shadow-panel">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <div>
          <h2 className="font-serif text-lg">{title}</h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {searchColumns.length > 0 && (
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="h-9 w-40 rounded-md border border-border bg-background pl-7 pr-2 text-sm"
              />
            </div>
          )}
          <button
            type="button"
            onClick={() => void list.refetch()}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border hover:bg-secondary"
            aria-label="Refresh"
          >
            <RefreshCw className={cn("size-4", list.isFetching && "animate-spin")} />
          </button>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-ink px-3 text-sm font-bold text-ink-foreground"
          >
            <Plus className="size-4" /> New
          </button>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th key={c.name} className="p-3">
                  {c.label}
                </th>
              ))}
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-muted-foreground" colSpan={columns.length + 1}>
                  {list.isLoading ? "Loading…" : "No records yet."}
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={String(row[idColumn])}>
                {columns.map((c) => (
                  <td key={c.name} className={cn("p-3 align-middle", c.className)}>
                    {c.render ? c.render(row) : formatCell(row[c.name])}
                  </td>
                ))}
                <td className="p-3 text-right">
                  <div className="inline-flex gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(row)}
                      className="inline-flex size-8 items-center justify-center rounded-md border border-border hover:bg-secondary"
                      aria-label="Edit"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Delete this record permanently?")) remove.mutate(row);
                      }}
                      className="inline-flex size-8 items-center justify-center rounded-md border border-border text-destructive hover:bg-destructive/10"
                      aria-label="Delete"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-panel">
            <h3 className="font-serif text-xl">
              {editing ? "Edit" : "New"} — {title}
            </h3>
            <form
              className="mt-5 grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                save.mutate(form);
              }}
            >
              {fields.map((f) => (
                <div key={f.name} className={cn("space-y-1.5", f.type === "textarea" && "sm:col-span-2")}>
                  <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground" htmlFor={f.name}>
                    {f.label}
                    {f.required && <span className="text-destructive"> *</span>}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      id={f.name}
                      rows={3}
                      required={f.required ?? false}
                      value={String(form[f.name] ?? "")}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="w-full rounded-md border border-border bg-background p-2 text-sm"
                    />
                  ) : f.type === "boolean" ? (
                    <label className="flex h-10 items-center gap-2 text-sm">
                      <input
                        id={f.name}
                        type="checkbox"
                        checked={Boolean(form[f.name])}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })}
                        className="size-4"
                      />
                      Enabled
                    </label>
                  ) : f.type === "select" ? (
                    <select
                      id={f.name}
                      required={f.required ?? false}
                      value={String(form[f.name] ?? "")}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="h-10 w-full rounded-md border border-border bg-background px-2 text-sm"
                    >
                      <option value="">—</option>
                      {(f.options ?? lookups?.[f.name] ?? []).map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={f.name}
                      type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                      step={f.step ?? undefined}
                      required={f.required ?? false}
                      placeholder={f.placeholder ?? ""}
                      value={String(form[f.name] ?? "")}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="h-10 w-full rounded-md border border-border bg-background px-2 text-sm"
                    />
                  )}
                  {f.help && <p className="text-[11px] text-muted-foreground">{f.help}</p>}
                </div>
              ))}
              <div className="sm:col-span-2 mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setEditing(null);
                  }}
                  className="h-10 rounded-md border border-border px-4 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={save.isPending}
                  className="h-10 rounded-md bg-ink px-5 text-sm font-bold text-ink-foreground disabled:opacity-60"
                >
                  {save.isPending ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function formatCell(v: unknown): React.ReactNode {
  if (v == null || v === "") return <span className="text-muted-foreground">—</span>;
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}
