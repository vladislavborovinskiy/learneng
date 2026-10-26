import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border-2 font-display font-bold whitespace-nowrap transition-[background-color,border-color,color,opacity] duration-100 outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
  {
    variants: {
      variant: {
        default: 'border-primary bg-primary text-primary-foreground active:opacity-85',
        outline: 'border-border bg-transparent text-foreground active:bg-foreground/10',
        secondary: 'border-secondary bg-secondary text-secondary-foreground active:bg-muted',
        ghost: 'border-transparent bg-transparent text-foreground active:bg-muted',
        destructive: 'border-destructive bg-destructive text-primary-foreground active:opacity-85',
        link: 'border-transparent text-primary underline-offset-4 active:underline',
      },
      size: {
        'default': 'h-11 gap-2 px-4 text-base',
        'xs': "h-7 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-4",
        'sm': "h-9 gap-1.5 px-3 text-sm [&_svg:not([class*='size-'])]:size-5",
        'lg': 'h-14 gap-2 px-5 text-lg',
        'icon': 'size-11 rounded-full',
        'icon-xs': "size-7 rounded-full [&_svg:not([class*='size-'])]:size-4",
        'icon-sm': "size-9 rounded-full [&_svg:not([class*='size-'])]:size-5",
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
