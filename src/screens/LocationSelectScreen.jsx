import { useState, useEffect } from 'react';

export default function LocationSelectScreen({ onLocationSelected, onBack }) {
  const [locationsIndex, setLocationsIndex] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadLocationsIndex() {
      try {
        const response = await fetch('/data/locations_index.json');
        if (!response.ok) {
          throw new Error(`Failed to load locations: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setLocationsIndex(data);
      } catch (err) {
        console.error('Error loading locations index:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadLocationsIndex();
  }, []);

  const handleLocationSelect = (locationId) => {
    if (onLocationSelected) {
      onLocationSelected(locationId);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] py-8 flex items-center justify-center">
        <div className="text-[#E5E5E5] font-sans">Loading locations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#000000] py-8 flex items-center justify-center">
        <div className="text-[#BF616A] font-sans">Error loading locations: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-pixel text-[#E5E5E5] mb-8">SELECT ADVENTURE</h2>
        
        <div className="space-y-4 mb-6">
          {locationsIndex.map(location => (
            <div
              key={location.id}
              className="bg-[#0A0A0A] border-2 border-[#3A3A3A] p-6 hover:border-[#8BC6FF] transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-pixel text-[#E5E5E5] mb-2">
                    {location.name.toUpperCase()}
                  </h3>
                  <p className="text-sm font-sans text-[#CFCFCF] mb-3">
                    {location.description}
                  </p>
                  <div className="text-xs font-pixel text-[#7A7A7A] uppercase tracking-wider">
                    Recommended Level: {location.recommended_level}
                  </div>
                </div>
                <button
                  onClick={() => handleLocationSelect(location.id)}
                  className="ml-6 px-6 py-3 bg-[#2A2A2A] text-[#E5E5E5] border-2 border-[#8BC6FF] hover:bg-[#3A3A3A] hover:shadow-[0_0_4px_#8BC6FF] active:bg-[#2A2A2A] active:translate-y-[1px] font-pixel text-xs tracking-wide uppercase transition-all"
                >
                  PLAY
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-start pt-4 border-t-2 border-[#3A3A3A]">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-[#1A1A1A] text-[#E5E5E5] border-2 border-[#5A5A5A] hover:bg-[#2A2A2A] hover:border-[#8BC6FF] hover:shadow-[0_0_4px_#8BC6FF] active:bg-[#1A1A1A] active:translate-y-[1px] font-pixel text-xs tracking-wide uppercase transition-all"
          >
            BACK
          </button>
        </div>
      </div>
    </div>
  );
}
