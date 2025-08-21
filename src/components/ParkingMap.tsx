import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Users, MapPin, Navigation, X } from "lucide-react";

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
  currentEntries?: Array<{
    id: string;
    entityId: string;
    spotNumber: string;
    level: string;
    zone: string;
    status: "active" | "completed";
  }>;
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

export const ParkingMap = ({ entityId, currentEntries = [] }: ParkingMapProps) => {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  
  const parkingSpots = generateParkingSpots(entityId);
  const levels = [...new Set(parkingSpots.map(spot => spot.level))];
  const currentLevelSpots = parkingSpots.filter(spot => spot.level === selectedLevel);
  
  // Check if spot is occupied by current entries
  const isSpotOccupied = (spotNumber: string) => {
    return currentEntries.some(entry => 
      entry.entityId === entityId && 
      entry.spotNumber === spotNumber && 
      entry.status === "active"
    );
  };

  const getSpotColor = (spot: ParkingSpot) => {
    const occupied = isSpotOccupied(spot.number);
    
    if (spot.type === "disabled") {
      return occupied ? "bg-red-500" : "bg-blue-500";
    }
    
    return occupied ? "bg-red-500" : "bg-green-500";
  };

  const handleSpotClick = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
  };

  const handleCancelSpot = (spotNumber: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // This would normally communicate with the gate simulator to release the spot
    window.dispatchEvent(new CustomEvent('releaseSpot', { detail: spotNumber }));
  };

  const handleReserveSpot = () => {
    if (selectedSpot && !isSpotOccupied(selectedSpot.number)) {
      alert(`تم حجز الموقف ${selectedSpot.number} بنجاح!`);
      setSelectedSpot(null);
    }
  };

  // Group spots by zones for realistic layout
  const groupSpotsByZone = (spots: ParkingSpot[]) => {
    const zones: { [key: string]: ParkingSpot[] } = {};
    spots.forEach(spot => {
      if (!zones[spot.zone]) zones[spot.zone] = [];
      zones[spot.zone].push(spot);
    });
    return zones;
  };

  const zoneGroups = groupSpotsByZone(currentLevelSpots);

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

      {/* Realistic Parking Layout */}
      <div className="relative bg-gray-600 rounded-lg p-8 min-h-[600px]">
        <div className="absolute top-4 left-4 flex items-center gap-2 text-sm text-white">
          <MapPin className="h-4 w-4" />
          الطابق {selectedLevel}
        </div>
        
        {/* Parking Facility Layout */}
        <div className="flex justify-between items-start mt-8 h-full">
          {/* Left Side Parking Sections */}
          <div className="space-y-6">
            {Object.entries(zoneGroups).slice(0, 2).map(([zone, spots]) => (
              <div key={zone} className="space-y-2">
                <div className="text-white text-sm font-semibold text-center">منطقة {zone}</div>
                <div className="grid grid-cols-10 gap-1">
                  {spots.slice(0, 20).map((spot) => (
                    <div key={spot.id} className="relative">
                      <div
                        onClick={() => handleSpotClick(spot)}
                        className={`
                          w-8 h-12 border border-gray-400 cursor-pointer transition-all duration-200 
                          hover:scale-105 flex items-center justify-center text-xs text-white font-medium
                          ${getSpotColor(spot)}
                          ${selectedSpot?.id === spot.id ? 'ring-2 ring-yellow-400 scale-105' : ''}
                        `}
                      >
                        {spot.type === "disabled" ? <Users className="h-3 w-3" /> : spot.number.slice(-2)}
                      </div>
                      {isSpotOccupied(spot.number) && (
                        <button
                          onClick={(e) => handleCancelSpot(spot.number, e)}
                          className="absolute -top-2 -right-1 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100"
                        >
                          <X className="h-3 w-3 text-red-500" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Center Road */}
          <div className="flex flex-col items-center space-y-4 mx-8">
            <div className="w-20 h-96 bg-gray-800 rounded relative flex flex-col justify-center">
              {/* Road markings */}
              <div className="absolute inset-0 flex flex-col justify-center space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-1 h-8 bg-white mx-auto rounded"></div>
                ))}
              </div>
              {/* Direction arrows */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                <Navigation className="h-6 w-6 text-white" />
              </div>
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 rotate-180">
                <Navigation className="h-6 w-6 text-white" />
              </div>
            </div>
            
            {/* Main Entrance */}
            <div className="bg-yellow-500 px-4 py-2 rounded text-black font-semibold text-sm">
              المدخل الرئيسي
            </div>
          </div>
          
          {/* Right Side Parking Sections */}
          <div className="space-y-6">
            {Object.entries(zoneGroups).slice(2, 4).map(([zone, spots]) => (
              <div key={zone} className="space-y-2">
                <div className="text-white text-sm font-semibold text-center">منطقة {zone}</div>
                <div className="grid grid-cols-10 gap-1">
                  {spots.slice(0, 20).map((spot) => (
                    <div key={spot.id} className="relative">
                      <div
                        onClick={() => handleSpotClick(spot)}
                        className={`
                          w-8 h-12 border border-gray-400 cursor-pointer transition-all duration-200 
                          hover:scale-105 flex items-center justify-center text-xs text-white font-medium
                          ${getSpotColor(spot)}
                          ${selectedSpot?.id === spot.id ? 'ring-2 ring-yellow-400 scale-105' : ''}
                        `}
                      >
                        {spot.type === "disabled" ? <Users className="h-3 w-3" /> : spot.number.slice(-2)}
                      </div>
                      {isSpotOccupied(spot.number) && (
                        <button
                          onClick={(e) => handleCancelSpot(spot.number, e)}
                          className="absolute -top-2 -right-1 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100"
                        >
                          <X className="h-3 w-3 text-red-500" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-lg text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>متاح</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>محجوز</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>ذوي الاحتياجات</span>
            </div>
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