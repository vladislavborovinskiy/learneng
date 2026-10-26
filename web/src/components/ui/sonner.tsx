import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check'
import { CircleNotchIcon } from '@phosphor-icons/react/dist/csr/CircleNotch'
import { InfoIcon } from '@phosphor-icons/react/dist/csr/Info'
import { WarningIcon } from '@phosphor-icons/react/dist/csr/Warning'
import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      className="toaster group"
      icons={{
        success: <CheckIcon weight="bold" className="size-6 text-success" />,
        info: <InfoIcon weight="bold" className="size-6 text-primary" />,
        warning: <WarningIcon weight="bold" className="size-6 text-warning" />,
        error: <XIcon weight="bold" className="size-6 text-destructive" />,
        loading: <CircleNotchIcon weight="bold" className="size-6 animate-spin text-primary" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex w-full items-start gap-3 border-2 border-border bg-popover p-4 font-sans text-popover-foreground shadow-none',
          title: 'font-display text-base font-bold',
          description: 'mt-1 text-sm text-muted-foreground',
          icon: 'mt-0.5 shrink-0',
          error: 'border-destructive [&_[data-title]]:text-destructive',
          warning: 'border-warning [&_[data-title]]:text-warning',
          success: 'border-success [&_[data-title]]:text-success',
          info: 'border-primary [&_[data-title]]:text-primary',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
