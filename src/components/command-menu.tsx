import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Laptop, Moon, Sun } from 'lucide-react'
import { useSearch } from '@/context/search-provider'
import { useTheme } from '@/context/theme-provider'
import { Badge } from '@/components/ui/badge'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { sidebarData } from './layout/data/sidebar-data'
import { ScrollArea } from './ui/scroll-area'

type SearchItem = {
  group: string
  label: string
  url: string
  icon?: React.ElementType
  disabled?: boolean
  newTab?: boolean
}

const sidebarGroupLabels = new Set(
  sidebarData.navGroups.flatMap((group) => (group.title ? [group.title] : []))
)

function getSubItemGroup(groupLabel: string | undefined, itemTitle: string) {
  return sidebarGroupLabels.has(itemTitle) ? (groupLabel ?? 'Other') : itemTitle
}

const searchItems: SearchItem[] = sidebarData.navGroups.flatMap((group) =>
  group.items.flatMap((item) => {
    if (item.items) {
      return item.items.map((sub) => ({
        group: getSubItemGroup(group.title, item.title),
        label: sub.title,
        url: sub.url || '',
        icon: sub.icon || item.icon,
        disabled: false,
        newTab: false,
      }))
    }
    return [
      {
        group: group.title ?? 'Other',
        label: item.title,
        url: item.url || '',
        icon: item.icon,
        disabled: false,
        newTab: false,
      },
    ]
  })
).filter((item) => item.url)

function getAvailableItems(items: SearchItem[]) {
  return items.filter((item) => !item.disabled && !item.url.includes('coming-soon'))
}

const recommendations = getAvailableItems(searchItems)

function groupBy(items: SearchItem[]) {
  const groups = [...new Set(items.map((item) => item.group))]
  return groups.map((group) => ({
    group,
    items: items.filter((item) => item.group === group),
  }))
}

export function CommandMenu() {
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()
  const [query, setQuery] = React.useState('')

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    if (!value) setQuery('')
  }

  const handleSelect = (item: SearchItem) => {
    if (item.disabled) return
    runCommand(() => {
      if (item.newTab) {
        window.open(item.url, '_blank', 'noopener,noreferrer')
      } else {
        navigate({ to: item.url })
      }
    })
  }

  const renderGroups = (items: SearchItem[]) =>
    groupBy(items).map(({ group, items: groupItems }, index) => (
      <React.Fragment key={group}>
        {index > 0 && <CommandSeparator />}
        <CommandGroup heading={group}>
          {groupItems.map((item) => (
            <CommandItem
              disabled={item.disabled}
              key={`${group}-${item.url}-${item.label}`}
              value={`${item.group} ${item.label}`}
              onSelect={() => handleSelect(item)}
            >
              {item.icon && React.createElement(item.icon, { className: 'mr-2 h-4 w-4 shrink-0 text-muted-foreground/80' })}
              <span>{item.label}</span>

              {item.disabled && (
                <Badge variant='outline' className='text-xs ml-auto'>
                  Soon
                </Badge>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </React.Fragment>
    ))

  return (
    <CommandDialog modal open={open} onOpenChange={handleOpenChange}>
      <CommandInput
        placeholder='Search dashboards, users, and more…'
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <ScrollArea type='hover' className='h-72 pe-1'>
          <CommandEmpty>No results found.</CommandEmpty>
          {query ? renderGroups(searchItems) : renderGroups(recommendations)}

          <CommandSeparator />
          <CommandGroup heading='Theme'>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <Sun className='mr-2 h-4 w-4' /> <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <Moon className='mr-2 h-4 w-4 scale-90' />
              <span>Dark</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <Laptop className='mr-2 h-4 w-4' />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
