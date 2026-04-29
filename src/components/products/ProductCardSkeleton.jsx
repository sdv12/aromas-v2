export default function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden flex flex-col animate-pulse">
      {/* Image */}
      <div className="aspect-square bg-gray-200 dark:bg-navy-800" />

      {/* Info */}
      <div className="p-3 flex flex-col gap-2.5">
        <div className="h-2.5 w-16 bg-gray-200 dark:bg-navy-700 rounded-full" />
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-gray-200 dark:bg-navy-700 rounded-full" />
          <div className="h-3 w-3/4 bg-gray-200 dark:bg-navy-700 rounded-full" />
        </div>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(s => (
            <div key={s} className="w-3 h-3 bg-gray-200 dark:bg-navy-700 rounded-sm" />
          ))}
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="h-5 w-20 bg-gray-200 dark:bg-navy-700 rounded-full" />
          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-navy-700" />
        </div>
      </div>
    </div>
  )
}
