import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car, Users } from "lucide-react";

interface Entity {
  id: string;
  name: string;
  nameEn: string;
  logo: string;
  location: string;
  parkingSpots: number;
  availableSpots: number;
  description: string;
}

interface EntityCardProps {
  entity: Entity;
  onClick: () => void;
}

export const EntityCard = ({ entity, onClick }: EntityCardProps) => {
  const availabilityPercentage = Math.round((entity.availableSpots / entity.parkingSpots) * 100);
  
  const getAvailabilityColor = (percentage: number) => {
    if (percentage > 50) return "bg-success";
    if (percentage > 20) return "bg-warning";
    return "bg-destructive";
  };

  const getAvailabilityText = (percentage: number) => {
    if (percentage > 50) return "متاح";
    if (percentage > 20) return "محدود";
    return "ممتلئ";
  };

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-4">
          <img 
            src={entity.logo} 
            alt={entity.name} 
            className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {entity.name}
            </h3>
            <p className="text-xs text-muted-foreground">{entity.nameEn}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground truncate">{entity.location}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {entity.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-bold text-success">{entity.availableSpots}</span>
                <span className="text-muted-foreground">/{entity.parkingSpots}</span>
              </span>
            </div>
            <Badge 
              variant="secondary" 
              className={`${getAvailabilityColor(availabilityPercentage)} text-white`}
            >
              {getAvailabilityText(availabilityPercentage)}
            </Badge>
          </div>

          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getAvailabilityColor(availabilityPercentage)} transition-all duration-500`}
              style={{ width: `${availabilityPercentage}%` }}
            />
          </div>

          <Button 
            variant="entity" 
            size="sm" 
            className="w-full mt-3"
            onClick={onClick}
          >
            <Users className="h-4 w-4" />
            عرض التفاصيل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};