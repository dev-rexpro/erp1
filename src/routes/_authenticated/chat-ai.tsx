import { createFileRoute } from '@tanstack/react-router'
import { ChatAI } from '@/features/chats/components/chat-ai'

export const Route = createFileRoute('/_authenticated/chat-ai')({
  component: ChatAI,
})