
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

interface EmptyDataStateProps {
  message: string;
  icon?: React.ReactNode;
}

export const EmptyDataState: React.FC<EmptyDataStateProps> = ({ 
  message, 
  icon = <Info className="h-12 w-12 mb-3 opacity-50" /> 
}) => {
  return (
    <Card className="bg-black/20 border-white/5">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center text-gray-400">
          {icon}
          <p>{message}</p>
        </div>
      </CardContent>
    </Card>
  );
};
