import { useState } from 'react';
import { useGame } from '../state/gameContext';
import classesDataRaw from '../data/classes.json';
import racesDataRaw from '../data/races.json';

// Extract arrays from the new structure (backward compatible)
const classesData = classesDataRaw.classes || classesDataRaw;
const racesData = racesDataRaw.races || racesDataRaw;

export default function CharacterCreationScreen() {
  const { createCharacter } = useGame();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    race_id: '',
    class_id: '',
    background_id: 'wanderer', // Default background for v0
    name: ''
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.race_id || !formData.class_id) {
      alert('Please complete all fields');
      return;
    }

    createCharacter(formData);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.race_id !== '';
      case 2: return formData.class_id !== '';
      case 3: return formData.name.trim() !== '';
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-pixel text-[#E5E5E5] mb-8">CHARACTER CREATION</h2>
        
        <div className="bg-[#0A0A0A] border-2 border-[#3A3A3A] p-6 space-y-6">
          {/* Step 1: Race */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-pixel text-[#E5E5E5] mb-4 text-sm">CHOOSE YOUR RACE</h3>
              <div className="grid grid-cols-2 gap-3">
                {racesData.map(race => {
                  const isSelected = formData.race_id === race.race_id;
                  return (
                  <button
                    key={race.race_id}
                    onClick={() => setFormData(prev => ({ ...prev, race_id: race.race_id }))}
                      className={`p-4 text-left transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-[#2A2A2A] border-2 border-[#8BC6FF] shadow-[0_0_4px_#8BC6FF]'
                          : 'bg-[#1A1A1A] border border-[#5A5A5A] hover:bg-[#2A2A2A] hover:border-[#8BC6FF]'
                    }`}
                  >
                      {isSelected && (
                        <div className="absolute top-2 right-2 text-[#8BC6FF] text-[8px] font-pixel uppercase tracking-wider">
                          SELECTED
                        </div>
                      )}
                      <div className={`font-pixel text-xs mb-1 ${isSelected ? 'text-[#8BC6FF] font-semibold' : 'text-[#E5E5E5]'}`}>
                        {race.name.toUpperCase()}
                      </div>
                      <div className={`text-sm font-sans ${isSelected ? 'text-[#CFCFCF]' : 'text-[#CFCFCF] opacity-80'}`}>
                        {race.description}
                      </div>
                  </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Class */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-pixel text-[#E5E5E5] mb-4 text-sm">CHOOSE YOUR CLASS</h3>
              <div className="space-y-3">
                {classesData.map(cls => {
                  const classId = cls.id || cls.class_id;
                  const isSelected = formData.class_id === classId;
                  return (
                  <button
                    key={classId}
                    onClick={() => setFormData(prev => ({ ...prev, class_id: classId }))}
                      className={`w-full p-4 text-left transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-[#2A2A2A] border-2 border-[#8BC6FF] shadow-[0_0_4px_#8BC6FF]'
                          : 'bg-[#1A1A1A] border border-[#5A5A5A] hover:bg-[#2A2A2A] hover:border-[#8BC6FF]'
                    }`}
                  >
                      {isSelected && (
                        <div className="absolute top-2 right-2 text-[#8BC6FF] text-[8px] font-pixel uppercase tracking-wider">
                          SELECTED
                        </div>
                      )}
                      <div className={`font-pixel text-xs mb-1 ${isSelected ? 'text-[#8BC6FF] font-semibold' : 'text-[#E5E5E5]'}`}>
                        {cls.name.toUpperCase()}
                      </div>
                      <div className={`text-sm font-sans ${isSelected ? 'text-[#CFCFCF]' : 'text-[#CFCFCF] opacity-80'}`}>
                        {cls.description}
                      </div>
                  </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Name */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold text-[#E5E5E5] mb-4 tracking-widest uppercase">ENTER YOUR CHARACTER NAME</h3>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter name..."
                className="w-full px-4 py-3 bg-[#1A1A1A] text-[#E5E5E5] border-2 border-[#5A5A5A] focus:border-[#8BC6FF] focus:outline-none font-sans text-base placeholder:text-[#7A7A7A]"
                autoFocus
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t-2 border-[#3A3A3A]">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-6 py-3 bg-[#1A1A1A] text-[#E5E5E5] border-2 border-[#5A5A5A] hover:bg-[#2A2A2A] hover:border-[#8BC6FF] hover:shadow-[0_0_4px_#8BC6FF] active:bg-[#1A1A1A] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed font-pixel text-xs tracking-wide uppercase transition-all"
            >
              BACK
            </button>
            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-3 bg-[#2A2A2A] text-[#E5E5E5] border-2 border-[#8BC6FF] hover:bg-[#3A3A3A] disabled:opacity-50 disabled:cursor-not-allowed font-pixel text-xs tracking-wide uppercase transition-all"
              >
                NEXT
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="px-6 py-3 bg-[#2A2A2A] text-[#E5E5E5] border-2 border-[#8BC6FF] hover:bg-[#3A3A3A] disabled:opacity-50 disabled:cursor-not-allowed font-pixel text-xs tracking-wide uppercase transition-all"
              >
                CREATE CHARACTER
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

