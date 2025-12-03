import { useState } from 'react';

export default function ActionInput({ onSubmit, disabled }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-[#3A3A3A] mt-2 pt-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your action..."
        disabled={disabled}
        className="flex-1 w-full px-4 py-2 bg-[#1A1A1A] text-[#E5E5E5] border-2 border-[#5A5A5A] focus:border-[#8BC6FF] focus:outline-none disabled:opacity-50 font-sans text-base placeholder:text-[#7A7A7A]"
      />
      <button
        type="submit"
        disabled={!input.trim() || disabled}
        className="px-6 py-2 bg-[#2A2A2A] text-[#E5E5E5] border-2 border-[#8BC6FF] hover:bg-[#3A3A3A] disabled:opacity-50 disabled:cursor-not-allowed font-pixel text-xs tracking-wide uppercase transition-all"
      >
        SEND
      </button>
    </form>
  );
}

