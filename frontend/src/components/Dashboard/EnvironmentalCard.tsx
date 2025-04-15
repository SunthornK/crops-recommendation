
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EnvironmentalCardProps {
  title: string;
  value: number | string;
  unit: string;
  icon: React.ReactNode;
  gradientClass?: string;
  isLoading?: boolean;
}

const EnvironmentalCard: React.FC<EnvironmentalCardProps> = ({
  title,
  value,
  unit,
  icon,
  gradientClass = "eco-gradient",
  isLoading = false,
}) => {
  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${gradientClass}`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="w-7 h-7 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-baseline space-x-2">
            <div className="h-9 w-16 bg-gray-200 animate-pulse rounded" />
            <div className="h-5 w-8 bg-gray-200 animate-pulse rounded" />
          </div>
        ) : (
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-sm text-muted-foreground">{unit}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnvironmentalCard;
