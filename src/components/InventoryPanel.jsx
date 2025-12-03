export default function InventoryPanel({ inventory }) {
  if (!inventory || inventory.length === 0) {
    return (
      <div className="bg-[#0A0A0A] border-2 border-[#3A3A3A] overflow-hidden">
        <div className="bg-[#000000] px-3 py-2">
          <h3 className="text-sm font-semibold uppercase text-[#8BC6FF] font-pixel text-xs">INVENTORY</h3>
        </div>
        <div className="px-3 py-2">
          <p className="text-sm text-[#7A7A7A] font-sans">Empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] border-2 border-[#3A3A3A] overflow-hidden">
      <div className="bg-[#000000] px-3 py-2">
        <h3 className="text-sm font-semibold uppercase text-[#8BC6FF] font-pixel text-xs">INVENTORY</h3>
      </div>
      <div className="px-3 py-2 space-y-2">
        {inventory.map((item, idx) => (
          <div key={idx} className="text-sm border-b-2 border-[#3A3A3A] pb-2 last:border-0">
            <div className="font-sans text-[#E5E5E5]">{item.name || item.item_id}</div>
            {item.type && (
              <div className="text-xs text-[#7A7A7A] font-sans">{item.type}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

