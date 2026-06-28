import { Link } from '@tanstack/react-router'
import { Mail, MessageSquare, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRexProAi } from '@/store/use-rexpro-ai'

export function AddShortcutButton() {
  return (
    <Button
      variant='outline'
      size='icon'
      onClick={() => toast.info('Shortcut management coming soon!')}
      title='Add Shortcut'
      className={cn(
        'bg-muted/25 text-foreground hover:bg-accent h-8 w-8 rounded-md shadow-none'
      )}
    >
      <Plus className='size-4' />
    </Button>
  )
}

export function HeaderRight() {
  const toggleAi = useRexProAi((state) => state.toggle)
  return (
    <div className='ms-auto flex items-center gap-2'>
      <Button variant='outline' asChild size='sm' className={cn(
        'bg-muted/25 text-foreground hover:bg-accent h-8 gap-1.5 rounded-md shadow-none text-sm font-normal'
      )}>
        <Link to='/chats'>
          <MessageSquare className='size-4' />
          <span>Chat</span>
        </Link>
      </Button>
      <Button variant='outline' asChild size='sm' className={cn(
        'bg-muted/25 text-foreground hover:bg-accent h-8 gap-1.5 rounded-md shadow-none text-sm font-normal'
      )}>
        <Link to='/mail'>
          <Mail className='size-4' />
          <span>Mail</span>
        </Link>
      </Button>
      <Button
        variant='outline'
        size='icon'
        onClick={toggleAi}
        title='rexpro-ai'
        className={cn(
          'bg-muted/25 text-foreground hover:bg-accent h-8 w-8 rounded-md shadow-none'
        )}
      >
        <img src='/rexpro-ai_logo.svg' alt='rexpro-ai' className='size-4' />
      </Button>
      <AddShortcutButton />
    </div>
  )
}
