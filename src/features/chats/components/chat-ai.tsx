"use client";

import { Thread, MessageList, Composer } from "@assistant-ui/react";

export function ChatAI() {
  return (
    <Thread>
      <div className="chat-shell h-full flex flex-col">
        <MessageList className="flex-1 p-4 overflow-y-auto" />
        <Composer 
          placeholder="Ketik pesan..." 
          className="p-3 border-t border-border/20"
          components={{
            Content: (props) => (
              <Composer.Content {...props} className="w-full">
                <Composer.TextArea 
                  className="w-full bg-muted/20 border border-border/30 rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  placeholder="Ketik pesan..."
                />
              </Composer.Content>
            ),
          }}
        />
      </div>
    </Thread>
  );
}