import React from 'react';
// First install the package:
// npm install class-variance-authority
// or
// yarn add class-variance-authority
// @ts-ignore
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-ios transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                default: 'bg-ios-blue text-white hover:bg-ios-blue/90',
                destructive: 'bg-ios-red text-white hover:bg-ios-red/90',
                outline: 'border border-ios-gray-300 hover:bg-ios-gray-100 dark:border-ios-gray-700 dark:hover:bg-ios-gray-800',
                secondary: 'bg-ios-gray-200 text-ios-gray-900 hover:bg-ios-gray-300 dark:bg-ios-gray-800 dark:text-ios-gray-50 dark:hover:bg-ios-gray-700',
                ghost: 'hover:bg-ios-gray-100 dark:hover:bg-ios-gray-800',
                link: 'text-ios-blue underline-offset-4 hover:underline',
                ios: 'bg-white dark:bg-ios-gray-900 border border-ios-gray-200 dark:border-ios-gray-700 shadow-ios text-black dark:text-white hover:bg-ios-gray-100 dark:hover:bg-ios-gray-800',
            },
            size: {
                default: 'h-10 py-2 px-4',
                sm: 'h-9 px-3 rounded-ios text-sm',
                lg: 'h-11 px-8 rounded-ios-lg text-base',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref: React.ForwardedRef<HTMLButtonElement>) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };