export default function ObjectivePanel({ encounter, encounterState }) {
  if (!encounter || !encounterState) return null;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h3 className="font-semibold text-lg mb-3">Objectives</h3>
      <div className="space-y-2">
        {encounter.objectives.map(objective => {
          const status = encounterState.objectives_state?.[objective.id] || 'active';
          return (
            <div key={objective.id} className="flex items-start">
              <input
                type="checkbox"
                checked={status === 'completed'}
                readOnly
                className="mt-1 mr-2"
              />
              <span className={`text-sm ${status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                {objective.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

