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

// Mock parking data with better positioning for disabled spots
const generateParkingSpots = (entityId: string): ParkingSpot[] => {
  const spots: ParkingSpot[] = [];
  const levels = entityId === "expo" ? 3 : 2;
  const spotsPerLevel = entityId === "expo" ? 40 : 30;
  
  for (let level = 1; level <= levels; level++) {
    for (let i = 1; i <= spotsPerLevel; i++) {
      // Position disabled spots near the entrance (first few spots of each row)
      const isDisabled = (i <= 3 && i % 10 <= 3) || i % 10 === 0; // First 3 spots of each row + every 10th
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
      return spot.status === "available" ? "bg-blue-500 text-white" : "bg-blue-800 text-white";
    }
    switch (spot.status) {
      case "available": return "bg-green-400 text-white hover:bg-green-500";
      case "occupied": return "bg-red-500 text-white";
      case "reserved": return "bg-yellow-500 text-white hover:bg-yellow-600";
      default: return "bg-gray-400 text-white";
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
            <div className="w-3 h-3 bg-green-400 rounded border border-green-500"></div>
            <span>متاح</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded border border-red-600"></div>
            <span>مشغول</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded border border-yellow-600"></div>
            <span>محجوز</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded border border-blue-600"></div>
            <span>ذوي الاحتياجات</span>
          </div>
        </div>
      </div>

      {/* Parking Grid - Aerial View */}
      <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-6 min-h-[500px] shadow-inner">
        {/* Building representation */}
        <div className="absolute top-6 right-6 bg-slate-700 rounded-lg shadow-lg p-4 min-w-[120px]">
          <div className="text-white text-xs font-semibold text-center">المبنى الرئيسي</div>
          <div className="text-white text-xs text-center opacity-75">Main Building</div>
        </div>
        
        {/* Level indicator */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <MapPin className="h-4 w-4" />
            الطابق {selectedLevel}
          </div>
        </div>
        
        {/* Parking Layout with more realistic aerial view */}
        <div className="mt-16 grid grid-cols-12 gap-1 max-w-4xl mx-auto">
          {/* Road/Pathway */}
          <div className="col-span-12 h-4 bg-slate-400 rounded-sm mb-2 relative">
            <div className="absolute inset-0 bg-yellow-400 opacity-30 rounded-sm"></div>
            <div className="text-xs text-slate-600 text-center leading-4">طريق المرور الرئيسي</div>
          </div>
          
          {/* Parking spots arranged in rows */}
          {Array.from({ length: Math.ceil(currentLevelSpots.length / 10) }).map((_, rowIndex) => {
            const rowSpots = currentLevelSpots.slice(rowIndex * 10, (rowIndex + 1) * 10);
            return (
              <div key={rowIndex} className="col-span-12 grid grid-cols-10 gap-1 mb-2">
                {rowSpots.map((spot) => (
                  <div
                    key={spot.id}
                    onClick={() => handleSpotClick(spot)}
                    className={`
                      aspect-[4/3] rounded-sm cursor-pointer transition-all duration-200 
                      hover:scale-110 hover:shadow-lg flex items-center justify-center
                      border border-slate-300 shadow-sm
                      ${getSpotColor(spot)}
                      ${selectedSpot?.id === spot.id ? 'ring-2 ring-blue-500 scale-110 z-10' : ''}
                    `}
                  >
                    {getSpotIcon(spot)}
                  </div>
                ))}
              </div>
            );
          })}
          
          {/* Another road/pathway */}
          <div className="col-span-12 h-3 bg-slate-400 rounded-sm mt-2 opacity-75"></div>
        </div>

        {/* Entrance/Exit indicators with better positioning */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 text-sm bg-green-100 text-green-800 px-4 py-2 rounded-full shadow-md border border-green-200">
            <Navigation className="h-4 w-4" />
            المدخل الرئيسي
          </div>
        </div>
        
        {/* Additional visual elements */}
        <div className="absolute top-6 left-6 opacity-50">
          <div className="w-8 h-8 bg-green-400 rounded-full shadow-md"></div>
          <div className="text-xs text-slate-600 text-center mt-1">حديقة</div>
        </div>
        
        <div className="absolute bottom-6 right-6 opacity-50">
          <div className="w-6 h-6 bg-blue-400 rounded-sm shadow-md"></div>
          <div className="text-xs text-slate-600 text-center mt-1">أمن</div>
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