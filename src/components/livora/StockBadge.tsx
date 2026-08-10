import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  in_stock: "bg-success/12 text-success border-success/25",
  low_stock: "bg-warning/15 text-warning border-warning/30",
  available_to_order: "bg-accent/15 text-accent-foreground border-accent/35",
  preorder: "bg-burgundy/10 text-burgundy border-burgundy/25",
  out_of_stock: "bg-muted text-muted-foreground border-border",
};

export function StockBadge({ state, className }: { state: string; className?: string }) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        styles[state] ?? styles['out_of_stock'],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {t(`stock.${state}`)}
    </span>
  );
}
