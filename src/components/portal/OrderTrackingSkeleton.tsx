export function OrderTrackingSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-44 animate-pulse rounded-xl bg-brand-border-soft/60" />
      <div className="h-32 animate-pulse rounded-lg bg-brand-border-soft/60" />
      <div className="h-24 animate-pulse rounded-lg bg-brand-border-soft/60" />
      <div className="h-40 animate-pulse rounded-lg bg-brand-border-soft/60" />
    </div>
  )
}
