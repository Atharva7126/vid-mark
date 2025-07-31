import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AnimatedCounter } from "./animated-counter"

export const StatCard = ({
  title,
  value,
  isLoading,
}: {
  title: string
  value: number | string
  isLoading: boolean
}) => (
  <Card className="flex-1 rounded-2xl bg-muted/10 shadow-md">
    <CardHeader className="text-center space-y-1">
      <CardTitle className="text-base sm:text-lg font-semibold truncate">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-center items-center h-20">
      {isLoading ? (
        <Skeleton className="h-8 w-20 rounded-md" />
      ) : (
        <p className="text-3xl font-bold">
          {typeof value === "number" ? (
            <AnimatedCounter number={value} />
          ) : (
            <span>{value}</span> // Just render the string directly
          )}
        </p>
      )}
    </CardContent>
  </Card>
)