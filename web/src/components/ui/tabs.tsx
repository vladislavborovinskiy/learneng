import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cn } from 'cn'

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn('flex', className)} {...props} />
}

function TabsList({ className, children, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn('glass relative flex h-13 w-full rounded-2xl p-1', className)}
      {...props}
    >
      <TabsPrimitive.Indicator
        data-slot="tabs-indicator"
        className="glass-strong absolute top-1 bottom-1 left-(--active-tab-left) w-(--active-tab-width) rounded-xl transition-[left,width] duration-200 ease-out motion-reduce:transition-none"
      />
      {children}
    </TabsPrimitive.List>
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        'relative z-1 flex flex-1 items-center justify-center rounded-xl font-sans font-medium text-muted-foreground transition-colors duration-150 outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-active:text-foreground',
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger }
