import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const buttonVariants = cva(
  "group/button pixel-corners inline-flex shrink-0 items-center justify-center border-(length:--pixel) font-pixel font-medium whitespace-nowrap transition-[translate,background-color,border-color,box-shadow] duration-75 outline-none select-none focus-visible:border-ring active:translate-y-0.5 active:shadow-none disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
  {
    variants: {
      variant: {
        default:
          'border-primary bg-primary text-primary-foreground shadow-[inset_0_-4px_0_rgb(0_0_0/0.25)]',
        outline:
          'border-border bg-card text-foreground shadow-[inset_0_-4px_0_rgb(255_255_255/0.04)] active:border-primary',
        secondary:
          'border-secondary bg-secondary text-secondary-foreground shadow-[inset_0_-4px_0_rgb(0_0_0/0.25)]',
        ghost: 'border-transparent bg-transparent text-foreground active:bg-muted',
        destructive:
          'border-destructive bg-destructive text-primary-foreground shadow-[inset_0_-4px_0_rgb(0_0_0/0.25)]',
        link: 'border-transparent text-primary underline-offset-4 active:underline',
      },
      size: {
        'default': 'h-11 gap-2 px-4 text-base',
        'xs': "h-7 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-4",
        'sm': "h-9 gap-1.5 px-3 text-sm [&_svg:not([class*='size-'])]:size-5",
        'lg': 'h-14 gap-2 px-5 text-lg',
        'icon': 'size-11',
        'icon-xs': "size-7 [&_svg:not([class*='size-'])]:size-4",
        'icon-sm': "size-9 [&_svg:not([class*='size-'])]:size-5",
        'icon-lg': 'size-14',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
