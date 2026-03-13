export default function Divider() {
  return (
    <div className="tn-container">
      <div className="relative flex items-center justify-center py-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary-300/50 to-transparent" />
        <div className="mx-4 w-2 h-2 rounded-full bg-gradient-to-br from-primary-400 to-emerald-400 shadow-sm shadow-primary-400/30" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
      </div>
    </div>
  );
}
