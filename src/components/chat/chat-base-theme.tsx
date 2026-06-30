import React from "react";
import { Thread, MessageList, Composer } from "@assistant-ui/react";
import "./chat-base-theme.css";

export default function ChatBaseTheme() {
  return (
    <Thread>
      <div className="chat-shell">
        <MessageList />
        <Composer placeholder="Ketik pesan..." />
      </div>
    </Thread>
  );
}