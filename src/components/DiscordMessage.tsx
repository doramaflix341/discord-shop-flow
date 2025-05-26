
import React from 'react';
import { cn } from '@/lib/utils';

interface DiscordMessageProps {
  username: string;
  avatar?: string;
  content: string;
  timestamp?: string;
  isBot?: boolean;
  className?: string;
}

const DiscordMessage = ({ 
  username, 
  avatar, 
  content, 
  timestamp = new Date().toLocaleTimeString(), 
  isBot = false,
  className 
}: DiscordMessageProps) => {
  return (
    <div className={cn("flex items-start gap-3 p-2 hover:bg-discord-hover rounded", className)}>
      <div className="w-10 h-10 rounded-full bg-discord-accent flex items-center justify-center text-white font-semibold flex-shrink-0">
        {avatar ? (
          <img src={avatar} alt={username} className="w-full h-full rounded-full object-cover" />
        ) : (
          username.charAt(0).toUpperCase()
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-white">{username}</span>
          {isBot && (
            <span className="bg-discord-blurple text-white text-xs px-1.5 py-0.5 rounded font-medium">
              BOT
            </span>
          )}
          <span className="text-discord-muted text-xs">{timestamp}</span>
        </div>
        <div 
          className="text-discord-text break-words"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default DiscordMessage;
