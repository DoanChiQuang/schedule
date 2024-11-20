import { cn } from '@/modules/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

const typographyVariants = cva('', {
    variants: {
        variant: {
            default: '',
            h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
            h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
            h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
            h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
            p: 'leading-7 [&:not(:first-child)]:mt-6',
            blockquote: 'border-l-2 pl-6 italic',
            inlineCode:
                'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
            lead: 'text-xl text-muted-foreground',
            large: 'text-lg font-semibold',
            small: 'text-sm font-medium leading-none',
            muted: 'text-sm text-muted-foreground',
        },
        defaultVariants: {
            variant: 'default',
        },
    },
});

export interface TypographyProps
    extends VariantProps<typeof typographyVariants> {
    content: React.ReactNode;
    className?: string;
}

const Element = ({
    className,
    variant,
    content,
    ...props
}: TypographyProps) => {
    const prop = {
        className: cn(typographyVariants({ className, variant })),
        ...props,
    };
    switch (variant) {
        case 'h1':
            return <h1 {...prop}>{content}</h1>;
        case 'h2':
            return <h2 {...prop}>{content}</h2>;
        case 'h3':
            return <h3 {...prop}>{content}</h3>;
        case 'h4':
            return <h4 {...prop}>{content}</h4>;
        case 'p':
            return <p {...prop}>{content}</p>;
        case 'blockquote':
            return <blockquote {...prop}>{content}</blockquote>;
        case 'inlineCode':
            return <code {...prop}>{content}</code>;
        case 'lead':
            return <p {...prop}>{content}</p>;
        case 'large':
            return <div {...prop}>{content}</div>;
        case 'small':
            return <small {...prop}>{content}</small>;
        case 'muted':
            return <p {...prop}>{content}</p>;
        default:
            return <div {...prop}>{content}</div>;
    }
};

const Typography = React.forwardRef<HTMLDivElement, TypographyProps>(
    ({ className, variant = 'default', content, ...props }, ref) => {
        return (
            <Element
                className={className}
                variant={variant}
                content={content}
                ref={ref}
                {...props}
            />
        );
    },
);
Typography.displayName = 'Typography';

export { Typography };
