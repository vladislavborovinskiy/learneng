import { Check } from 'pixelarticons/react/Check.js'
import { Close } from 'pixelarticons/react/Close.js'
import { InfoBox } from 'pixelarticons/react/InfoBox.js'
import { Loader } from 'pixelarticons/react/Loader.js'
import { WarningDiamond } from 'pixelarticons/react/WarningDiamond.js'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      className="toaster group"
      icons={{
        success: <Check className="size-6 text-success" />,
        info: <InfoBox className="size-6 text-primary" />,
        warning: <WarningDiamond className="size-6 text-warning" />,
        error: <Close className="size-6 text-destructive" />,
        loading: <Loader className="size-6 animate-spin text-primary" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'pixel-corners flex w-full items-start gap-3 border-(length:--pixel) border-border bg-card p-4 font-sans text-card-foreground shadow-none',
          title: 'font-pixel text-base font-bold',
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
