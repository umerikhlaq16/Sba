export default function Spinner({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-gray-200 border-t-gray-900 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function LoadingScreen({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <Spinner size={26} />
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
