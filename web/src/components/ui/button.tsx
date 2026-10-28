import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-2xl font-sans font-medium whitespace-nowrap transition-[background-color,color,opacity] duration-150 outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground active:opacity-85',
        outline: 'glass text-foreground active:glass-strong',
        secondary: 'glass text-secondary-foreground active:glass-strong',
        ghost: 'bg-transparent text-foreground active:bg-glass',
        destructive: 'tint-destructive text-destructive active:opacity-85',
        link: 'text-foreground underline-offset-4 active:underline',
      },
      size: {
        'default': 'h-11 gap-2 px-4 text-base',
        'xs': "h-7 gap-1 rounded-xl px-2 text-xs [&_svg:not([class*='size-'])]:size-4",
        'sm': "h-9 gap-1.5 rounded-xl px-3 text-sm [&_svg:not([class*='size-'])]:size-4",
        'lg': 'h-14 gap-2 rounded-[20px] px-5 text-base',
        'icon': 'size-11 rounded-full',
        'icon-xs': "size-7 rounded-full [&_svg:not([class*='size-'])]:size-4",
        'icon-sm': "size-9 rounded-full [&_svg:not([class*='size-'])]:size-4",
        'icon-lg': 'size-14 rounded-full',
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
