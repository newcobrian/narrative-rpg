export default function SuggestedActions({ actions, onActionClick }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="space-y-1">
      <div className="text-xs text-[#7A7A7A] font-sans tracking-wider uppercase">
        SUGGESTED ACTIONS
      </div>
    <div className="flex gap-2 overflow-x-auto pb-2">
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={() => onActionClick(action)}
            className="px-3 py-2 bg-transparent text-[#E5E5E5] opacity-80 border border-[#666666] hover:opacity-100 hover:shadow-[0_0_4px_rgba(255,255,255,0.3)] active:opacity-80 transition-all whitespace-nowrap text-xs font-semibold tracking-wide uppercase cursor-pointer"
        >
          {action}
        </button>
      ))}
      </div>
    </div>
  );
}

