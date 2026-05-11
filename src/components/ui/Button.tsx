import { NoiseBackground } from "@/components/ui/noise-background"
import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost"
    size?: "sm" | "md" | "lg"
    gradientColors?: string[]
}

export function Button({
    children,
    className,
    variant = "primary",
    size = "md",
    gradientColors,
    disabled,
    ...props
}: ButtonProps) {
    const sizeClasses = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-2.5 text-sm",
        lg: "px-8 py-3 text-base",
    }

    const variantInnerClasses = {
        primary:
            "bg-gradient-to-r from-neutral-100 via-neutral-100 to-white text-neutral-900 shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset]",
        secondary:
            "bg-white/10 text-white backdrop-blur-sm border border-white/20",
        ghost:
            "bg-transparent text-neutral-900 dark:text-white",
    }

    const defaultGradients: Record<string, string[]> = {
        primary: ["rgb(67, 152, 255)", "rgb(11, 60, 120)", "rgb(8, 80, 160)"],
        secondary: ["rgb(100, 150, 255)", "rgb(67, 152, 255)", "rgb(11, 60, 120)"],
        ghost: ["rgb(200, 200, 200)", "rgb(150, 150, 150)", "rgb(100, 100, 100)"],
    }

    return (
        <NoiseBackground
            containerClassName={cn(
                "w-fit rounded-full",
                disabled && "opacity-60 cursor-not-allowed pointer-events-none"
            )}
            gradientColors={gradientColors ?? defaultGradients[variant]}
            speed={0.08}
        >
            <button
                className={cn(
                    "cursor-pointer rounded-full font-semibold transition-all duration-100 active:scale-95",
                    sizeClasses[size],
                    variantInnerClasses[variant],
                    className
                )}
                disabled={disabled}
                {...props}
            >
                {children}
            </button>
        </NoiseBackground>
    )
}

export default Button
