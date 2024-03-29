import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"
import { AlertTriangle, CheckCircleIcon, Info } from "lucide-react"

const bannerVariants = cva(
    "border text-center p-4 text-sm flex items-center w-full",
    {
        variants: {
            variant: {
                warning: "bg-yellow-200/80 border-yellow-30 text-primary",
                success: "bg-emerald-600 border-emerald-800 text-secondary",
                info: "bg-sky-600  border-sky-800 text-secondary"
            }
        },
        defaultVariants: {
            variant:"warning"
        }
    }
)

interface BannerProps extends VariantProps<typeof bannerVariants> {
    label:string
}

const iconMap = {
    warning: AlertTriangle,
    success: CheckCircleIcon,
    info: Info
}

const Banner = ({label, variant}: BannerProps) => {
  const Icon = iconMap[variant || "warning"]
  
    return (
    <div className={cn(bannerVariants({variant}), "text-black")}>
        <Icon className="h-4 w-4 mr-2"/>
        {label}
    </div>
  )
}

export default Banner