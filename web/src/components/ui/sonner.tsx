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
        success: <CheckIcon weight="bold" className="size-5 text-success" />,
        info: <InfoIcon weight="bold" className="size-5 text-primary" />,
        warning: <WarningIcon weight="bold" className="size-5 text-warning" />,
        error: <XIcon weight="bold" className="size-5 text-destructive" />,
        loading: <CircleNotchIcon weight="bold" className="size-5 animate-spin text-primary" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex w-full items-start gap-3 rounded-3xl bg-popover p-4 font-sans text-popover-foreground shadow-none',
          title: 'text-base font-medium',
          description: 'mt-1 text-sm text-muted-foreground',
          icon: 'mt-0.5 shrink-0',
          error: '[&_[data-title]]:text-destructive',
          warning: '[&_[data-title]]:text-warning',
          success: '[&_[data-title]]:text-success',
          info: '[&_[data-title]]:text-primary',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
