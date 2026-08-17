import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  coerce,
  useAdminList,
  useAdminMutations,
  uploadCover,
  type AdminTable,
  type Field,
  type Row,
} from "@/lib/admin-crud";

const input =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent";

export function AdminField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const [busy, setBusy] = useState(false);

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-2 py-2 text-sm">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="size-4" />
        {field.label}
      </label>
    );
  }

  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={input}
          required={field.required}
        />
      ) : field.type === "select" ? (
        <select value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} className={input}>
          <option value="">—</option>
          {(field.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : field.type === "image" ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              value={(value as string) ?? ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://… or /covers/book.jpg"
              className={input}
            />
            <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 text-xs font-bold">
              <Upload className="size-3.5" />
              {busy ? "…" : "Upload"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setBusy(true);
                  try {
                    onChange(await uploadCover(file));
                    toast.success("Cover uploaded");
                  } catch (err) {
                    toast.error((err as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            </label>
          </div>
          {typeof value === "string" && value ? (
            <img src={value} alt="cover preview" className="h-28 w-auto rounded border border-border object-cover" />
          ) : null}
        </div>
      ) : (
        <input
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
          step={field.type === "number" ? "any" : undefined}
          value={(value as string | number) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={input}
          required={field.required}
        />
      )}
      {field.help && <span className="text-[11px] text-muted-foreground">{field.help}</span>}
    </label>
  );
}

export function RecordDialog({
  title,
  fields,
  initial,
  onCancel,
  onSave,
}: {
  title: string;
  fields: Field[];
  initial: Row;
  onCancel: () => void;
  onSave: (values: Row) => void;
}) {
  const [values, setValues] = useState<Row>(initial);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-panel">
        <h3 className="font-serif text-xl">{title}</h3>
        <form
          className="mt-5 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(coerce(fields, values));
          }}
        >
          {fields.map((f) => (
            <div key={f.name} className={f.type === "textarea" || f.type === "image" ? "sm:col-span-2" : ""}>
              <AdminField field={f} value={values[f.name]} onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))} />
            </div>
          ))}
          <div className="sm:col-span-2 mt-2 flex justify-end gap-2">
            <button type="button" onClick={onCancel} className="rounded-md border border-border px-4 py-2 text-sm">
              Cancel
            </button>
            <button type="submit" className="rounded-md bg-ink px-5 py-2 text-sm font-bold text-ink-foreground">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CrudSection({
  table,
  title,
  description,
  fields,
  select = "*",
  orderBy,
  searchKeys = [],
  renderCell,
  parentFilter,
}: {
  table: AdminTable;
  title: string;
  description?: string;
  fields: Field[];
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
  searchKeys?: string[];
  renderCell?: (row: Row, field: Field) => React.ReactNode;
  parentFilter?: (row: Row) => boolean;
}) {
  const { data, isLoading } = useAdminList(table, select, orderBy);
  const { create, update, remove } = useAdminMutations(table);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [q, setQ] = useState("");

  const columns = useMemo(() => fields.filter((f) => f.inTable !== false).slice(0, 6), [fields]);

  const rows = useMemo(() => {
    let list = data ?? [];
    if (parentFilter) list = list.filter(parentFilter);
    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter((r) =>
        (searchKeys.length ? searchKeys : Object.keys(r)).some((k) =>
          String(r[k] ?? "").toLowerCase().includes(needle),
        ),
      );
    }
    return list;
  }, [data, q, searchKeys, parentFilter]);

  const blank: Row = Object.fromEntries(fields.map((f) => [f.name, f.default ?? (f.type === "boolean" ? false : "")]));

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="w-48 rounded-md border border-border bg-background py-2 pl-8 pr-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-ink px-4 py-2 text-sm font-bold text-ink-foreground"
          >
            <Plus className="size-4" /> New
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
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
            {isLoading && (
              <tr>
                <td className="p-6 text-center text-muted-foreground" colSpan={columns.length + 1}>
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-muted-foreground" colSpan={columns.length + 1}>
                  Nothing here yet.
                </td>
              </tr>
            )}
            {rows.map((r, i) => (
              <tr key={String(r["id"] ?? r["key"] ?? i)}>
                {columns.map((c) => (
                  <td key={c.name} className="max-w-[260px] truncate p-3">
                    {renderCell?.(r, c) ??
                      (c.type === "boolean" ? (
                        <span className={r[c.name] ? "text-success" : "text-muted-foreground"}>
                          {r[c.name] ? "Yes" : "No"}
                        </span>
                      ) : c.type === "image" && r[c.name] ? (
                        <img src={String(r[c.name])} alt="" className="h-12 w-8 rounded object-cover" />
                      ) : c.type === "select" ? (
                        (c.options?.find((o) => o.value === r[c.name])?.label ?? String(r[c.name] ?? "—"))
                      ) : (
                        String(r[c.name] ?? "—")
                      ))}
                  </td>
                ))}
                <td className="p-3 text-right">
                  <div className="inline-flex gap-1">
                    <button
                      onClick={() => setEditing(r)}
                      aria-label="Edit"
                      className="rounded-md border border-border p-1.5 hover:bg-secondary"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this record permanently?")) remove.mutate(String(r["id"] ?? r["key"]));
                      }}
                      aria-label="Delete"
                      className="rounded-md border border-border p-1.5 text-destructive hover:bg-destructive/10"
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

      {creating && (
        <RecordDialog
          title={`New — ${title}`}
          fields={fields}
          initial={blank}
          onCancel={() => setCreating(false)}
          onSave={(v) => {
            create.mutate(v);
            setCreating(false);
          }}
        />
      )}
      {editing && (
        <RecordDialog
          title={`Edit — ${title}`}
          fields={fields}
          initial={editing}
          onCancel={() => setEditing(null)}
          onSave={(v) => {
            update.mutate({ id: String(editing["id"] ?? editing["key"]), values: v });
            setEditing(null);
          }}
        />
      )}
    </section>
  );
}
