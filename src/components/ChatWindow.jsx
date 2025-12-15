import { useEffect, useRef } from 'react';
import Message from './Message';

export default function ChatWindow({ messages }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div 
      className="flex-1 overflow-y-auto bg-[#0A0A0A] border-2 border-[#3A3A3A] p-4 space-y-4"
      style={{ 
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y'
      }}
    >
      {messages.map((msg, idx) => (
        <Message 
          key={idx} 
          speaker={msg.speaker} 
          text={msg.text} 
          diceRolls={msg.diceRolls || null}
          lastPlayerActionText={msg.lastPlayerActionText || null}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

