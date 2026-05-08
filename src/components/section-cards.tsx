import { Card, CardContent } from "@/components/ui/card"
import { TrendingUpIcon, DollarSignIcon, ShoppingBagIcon, PackageIcon, BoxIcon, AlertCircleIcon, ClipboardCheckIcon, LoaderIcon, TruckIcon, CheckCircleIcon, RotateCcwIcon } from "lucide-react"

const stats = [
  {
    label: "Total Earning",
    value: "$ 2,968.90",
    trend: "+ 18%",
    icon: <DollarSignIcon className="h-4 w-4 text-green-600" />,
    iconBg: "bg-green-100",
  },
  {
    label: "Commission Given",
    value: "$ 390.66",
    trend: "+ 18%",
    icon: <DollarSignIcon className="h-4 w-4 text-amber-600" />,
    iconBg: "bg-amber-100",
  },
  {
    label: "Total Item",
    value: "2600",
    trend: "+ 18%",
    icon: <ShoppingBagIcon className="h-4 w-4 text-green-600" />,
    iconBg: "bg-green-100",
  },
  {
    label: "In Stock",
    value: "18.6K",
    icon: <PackageIcon className="h-4 w-4 text-amber-600" />,
    iconBg: "bg-amber-100",
  },
  {
    label: "Out Of Stock",
    value: "190",
    icon: <AlertCircleIcon className="h-4 w-4 text-red-600" />,
    iconBg: "bg-red-100",
  },
  {
    label: "Waiting For Confirmation",
    value: "15",
    trend: "+ 18%",
    icon: <ClipboardCheckIcon className="h-4 w-4 text-blue-600" />,
    iconBg: "bg-blue-100",
  },
  {
    label: "Processing Order",
    value: "70",
    trend: "+ 18%",
    icon: <LoaderIcon className="h-4 w-4 text-blue-600" />,
    iconBg: "bg-blue-100",
  },
  {
    label: "Ready For Delivery",
    value: "42",
    trend: "+ 18%",
    icon: <TruckIcon className="h-4 w-4 text-green-600" />,
    iconBg: "bg-green-100",
  },
  {
    label: "Delivered Order",
    value: "15K",
    trend: "+ 18%",
    icon: <CheckCircleIcon className="h-4 w-4 text-green-600" />,
    iconBg: "bg-green-100",
  },
  {
    label: "Refunded",
    value: "$ 580.00",
    trend: "+ 18%",
    icon: <RotateCcwIcon className="h-4 w-4 text-amber-600" />,
    iconBg: "bg-amber-100",
  },
]

export function SectionCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 pt-0 lg:p-6 lg:pt-0">
      {stats.map((stat, i) => (
        <Card key={i} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 flex flex-col justify-between h-full relative">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${stat.iconBg.replace('bg-', 'bg-opacity-20 bg-')}`}>
                {stat.icon}
              </div>
              {stat.trend && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                  <TrendingUpIcon className="h-3 w-3" />
                  {stat.trend}
                </div>
              )}
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
              <div className="text-[11px] text-foreground/60 font-semibold uppercase tracking-wider line-clamp-1">{stat.label}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
