import { createFileRoute } from '@tanstack/react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ChatHeader } from '@/features/chats/components/chat-header'
import { ChatSidebar } from '@/features/chats/components/chat-sidebar'
import { Chats } from '@/features/chats'

export const Route = createFileRoute('/chat')({
  component: () => (
    <div className="[--header-height:3.5rem] h-svh w-screen overflow-hidden">
      <SidebarProvider className="flex flex-col h-full">
        <ChatHeader />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <ChatSidebar />
          <div className="flex-1 min-h-0 overflow-hidden">
            <Chats />
          </div>
        </div>
      </SidebarProvider>
    </div>
  ),
})
