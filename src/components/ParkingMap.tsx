import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Users, MapPin, Navigation } from "lucide-react";

interface ParkingSpot {
  id: string;
  number: string;
  status: "available" | "occupied" | "reserved";
  type: "regular" | "disabled";
  level: number;
  zone: string;
}

interface ParkingMapProps {
  entityId: string;
}

// Mock parking data
const generateParkingSpots = (entityId: string): ParkingSpot[] => {
  const spots: ParkingSpot[] = [];
  const levels = entityId === "expo" ? 3 : 2;
  const spotsPerLevel = entityId === "expo" ? 40 : 30;
  
  for (let level = 1; level <= levels; level++) {
    for (let i = 1; i <= spotsPerLevel; i++) {
      const isDisabled = i % 10 === 0; // Every 10th spot is disabled parking
      const random = Math.random();
      let status: "available" | "occupied" | "reserved";
      
      if (random < 0.3) status = "available";
      else if (random < 0.8) status = "occupied";
      else status = "reserved";
      
      spots.push({
        id: `${entityId}-${level}-${i}`,
        number: `${level}${i.toString().padStart(2, '0')}`,
        status,
        type: isDisabled ? "disabled" : "regular",
        level,
        zone: String.fromCharCode(65 + Math.floor((i - 1) / 10)) // A, B, C, etc.
      });
    }
  }
  
  return spots;
};

export const ParkingMap = ({ entityId }: ParkingMapProps) => {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  
  const parkingSpots = generateParkingSpots(entityId);
  const levels = [...new Set(parkingSpots.map(spot => spot.level))];
  const currentLevelSpots = parkingSpots.filter(spot => spot.level === selectedLevel);
  
  const getSpotColor = (spot: ParkingSpot) => {
    if (spot.type === "disabled") {
      return spot.status === "available" ? "bg-parking-disabled" : "bg-destructive";
    }
    switch (spot.status) {
      case "available": return "bg-parking-available";
      case "occupied": return "bg-parking-occupied";
      case "reserved": return "bg-warning";
      default: return "bg-muted";
    }
  };

  const getSpotIcon = (spot: ParkingSpot) => {
    if (spot.type === "disabled") {
      return <Users className="h-3 w-3 text-white" />;
    }
    return <Car className="h-3 w-3 text-white" />;
  };

  const handleSpotClick = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
  };

  const handleReserveSpot = () => {
    if (selectedSpot && selectedSpot.status === "available") {
      // Here would be the reservation logic
      alert(`تم حجز الموقف ${selectedSpot.number} بنجاح!`);
      setSelectedSpot(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Level Selection */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {levels.map(level => (
            <Button
              key={level}
              variant={selectedLevel === level ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel(level)}
            >
              الطابق {level}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-parking-available rounded"></div>
            <span>متاح</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-parking-occupied rounded"></div>
            <span>مشغول</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-warning rounded"></div>
            <span>محجوز</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-parking-disabled rounded"></div>
            <span>ذوي الاحتياجات</span>
          </div>
        </div>
      </div>

      {/* Parking Grid */}
      <div className="relative bg-accent/20 rounded-lg p-6 min-h-[400px]">
        <div className="absolute top-4 left-4 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          الطابق {selectedLevel}
        </div>
        
        <div className="grid grid-cols-10 gap-2 mt-8">
          {currentLevelSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => handleSpotClick(spot)}
              className={`
                aspect-square rounded cursor-pointer transition-all duration-200 
                hover:scale-105 hover:shadow-md flex items-center justify-center
                ${getSpotColor(spot)}
                ${selectedSpot?.id === spot.id ? 'ring-2 ring-primary scale-105' : ''}
              `}
            >
              {getSpotIcon(spot)}
            </div>
          ))}
        </div>

        {/* Entrance/Exit indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/80 px-3 py-1 rounded-full">
            <Navigation className="h-4 w-4" />
            المدخل الرئيسي
          </div>
        </div>
      </div>

      {/* Selected Spot Details */}
      {selectedSpot && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">الموقف {selectedSpot.number}</h3>
              <p className="text-sm text-muted-foreground">
                الطابق {selectedSpot.level} - المنطقة {selectedSpot.zone}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={selectedSpot.status === "available" ? "default" : "secondary"}>
                  {selectedSpot.status === "available" ? "متاح" : 
                   selectedSpot.status === "occupied" ? "مشغول" : "محجوز"}
                </Badge>
                {selectedSpot.type === "disabled" && (
                  <Badge variant="outline" className="bg-parking-disabled/10">
                    <Users className="h-3 w-3 mr-1" />
                    ذوي الاحتياجات
                  </Badge>
                )}
              </div>
            </div>
            
            {selectedSpot.status === "available" && (
              <Button variant="default" onClick={handleReserveSpot}>
                حجز الموقف
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};