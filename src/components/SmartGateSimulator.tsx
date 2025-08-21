import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParkingMap } from "@/components/ParkingMap";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { LogIn, LogOut, Car, MapPin, Clock, Users } from "lucide-react";

interface GateEntry {
  id: string;
  entityId: string;
  spotNumber: string;
  level: string;
  zone: string;
  entryTime: Date;
  exitTime?: Date;
  status: "active" | "completed";
}

const entities = [
  { id: "ksu", name: "جامعة الملك سعود", logo: "/src/assets/ksu-logo.png" },
  { id: "expo", name: "إكسبو السعودية", logo: "/src/assets/expo-logo.png" },
  { id: "hospital", name: "مستشفى الملك خالد", logo: "/src/assets/hospital-logo.png" },
];

export const SmartGateSimulator = () => {
  const [selectedEntity, setSelectedEntity] = useState("ksu");
  const [currentEntries, setCurrentEntries] = useState<GateEntry[]>([]);
  const [gateStatus, setGateStatus] = useState<"closed" | "opening" | "open">("closed");
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate available spots for the selected entity
  const generateAvailableSpots = (entityId: string) => {
    const zones = ["A", "B", "C", "D"];
    const levels = ["1", "2", "3"];
    const spots: any[] = [];
    
    zones.forEach(zone => {
      levels.forEach(level => {
        for (let i = 1; i <= 20; i++) {
          const spotNumber = `${zone}${i.toString().padStart(2, "0")}`;
          const isOccupied = currentEntries.some(entry => 
            entry.entityId === entityId && 
            entry.spotNumber === spotNumber && 
            entry.status === "active"
          );
          
          spots.push({
            id: `${entityId}-${level}-${spotNumber}`,
            number: spotNumber,
            status: isOccupied ? "occupied" : "available",
            type: i <= 2 ? "disabled" : "regular",
            level,
            zone
          });
        }
      });
    });
    
    return spots;
  };

  const findNearestAvailableSpot = (entityId: string) => {
    const spots = generateAvailableSpots(entityId);
    const availableSpots = spots.filter(spot => 
      spot.status === "available" && spot.type === "regular"
    );
    
    if (availableSpots.length === 0) {
      return null;
    }
    
    // Priority: Level 1, then nearest zones (A, B, C, D)
    const sortedSpots = availableSpots.sort((a, b) => {
      if (a.level !== b.level) {
        return parseInt(a.level) - parseInt(b.level);
      }
      return a.zone.localeCompare(b.zone);
    });
    
    return sortedSpots[0];
  };

  const simulateEntry = async () => {
    setIsProcessing(true);
    setGateStatus("opening");
    
    try {
      // Find available spot
      const availableSpot = findNearestAvailableSpot(selectedEntity);
      
      if (!availableSpot) {
        toast({
          title: "عذراً، لا توجد مواقف متاحة",
          description: "جميع المواقف محجوزة حالياً",
          variant: "destructive"
        });
        setGateStatus("closed");
        setIsProcessing(false);
        return;
      }

      // Simulate gate opening delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new entry
      const newEntry: GateEntry = {
        id: `entry-${Date.now()}`,
        entityId: selectedEntity,
        spotNumber: availableSpot.number,
        level: availableSpot.level,
        zone: availableSpot.zone,
        entryTime: new Date(),
        status: "active"
      };
      
      setCurrentEntries(prev => [...prev, newEntry]);
      setGateStatus("open");
      
      // Show success notification
      toast({
        title: "مرحباً بك!",
        description: `موقفك: ${availableSpot.number} - الطابق ${availableSpot.level} - منطقة ${availableSpot.zone}`,
        className: "bg-green-50 border-green-200"
      });
      
      // Close gate after 3 seconds
      setTimeout(() => {
        setGateStatus("closed");
      }, 3000);
      
    } catch (error) {
      toast({
        title: "خطأ في النظام",
        description: "حدث خطأ أثناء تخصيص الموقف",
        variant: "destructive"
      });
      setGateStatus("closed");
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateExit = async () => {
    setIsProcessing(true);
    setGateStatus("opening");
    
    try {
      const activeEntries = currentEntries.filter(entry => 
        entry.entityId === selectedEntity && entry.status === "active"
      );
      
      if (activeEntries.length === 0) {
        toast({
          title: "لا توجد مركبات مسجلة",
          description: "لا توجد مركبات داخل المنشأة للخروج",
          variant: "destructive"
        });
        setGateStatus("closed");
        setIsProcessing(false);
        return;
      }
      
      // Exit the most recent entry (LIFO)
      const entryToExit = activeEntries[activeEntries.length - 1];
      
      // Simulate gate opening delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update entry status
      setCurrentEntries(prev => 
        prev.map(entry => 
          entry.id === entryToExit.id 
            ? { ...entry, status: "completed" as const, exitTime: new Date() }
            : entry
        )
      );
      
      setGateStatus("open");
      
      // Calculate parking duration
      const duration = Math.round((Date.now() - entryToExit.entryTime.getTime()) / 1000 / 60);
      
      toast({
        title: "شكراً لزيارتكم",
        description: `تم تحرير الموقف ${entryToExit.spotNumber} - مدة الوقوف: ${duration} دقيقة`,
        className: "bg-blue-50 border-blue-200"
      });
      
      // Close gate after 3 seconds
      setTimeout(() => {
        setGateStatus("closed");
      }, 3000);
      
    } catch (error) {
      toast({
        title: "خطأ في النظام",
        description: "حدث خطأ أثناء تحرير الموقف",
        variant: "destructive"
      });
      setGateStatus("closed");
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedEntityData = entities.find(e => e.id === selectedEntity);
  const activeEntries = currentEntries.filter(entry => 
    entry.entityId === selectedEntity && entry.status === "active"
  );
  const totalSpots = generateAvailableSpots(selectedEntity).length;
  const occupiedSpots = activeEntries.length;
  const availableSpots = totalSpots - occupiedSpots;

  return (
    <div className="space-y-6">
      {/* Entity Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            محاكي البوابة الذكية
          </CardTitle>
          <CardDescription>
            اختر المنشأة لمحاكاة دخول وخروج المركبات وتخصيص المواقف تلقائياً
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">اختر المنشأة</label>
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {entities.map(entity => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedEntityData && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <img 
                  src={selectedEntityData.logo} 
                  alt={selectedEntityData.name}
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h3 className="font-semibold">{selectedEntityData.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    المواقف المتاحة: {availableSpots} من {totalSpots}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gate Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gate Simulator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              لوحة تحكم البوابة
            </CardTitle>
            <CardDescription>
              محاكاة دخول وخروج المركبات
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                gateStatus === "closed" ? "bg-red-100 text-red-700" :
                gateStatus === "opening" ? "bg-yellow-100 text-yellow-700" :
                "bg-green-100 text-green-700"
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  gateStatus === "closed" ? "bg-red-500" :
                  gateStatus === "opening" ? "bg-yellow-500" :
                  "bg-green-500"
                }`} />
                {gateStatus === "closed" ? "البوابة مغلقة" :
                 gateStatus === "opening" ? "البوابة تفتح..." : "البوابة مفتوحة"}
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={simulateEntry}
                disabled={isProcessing}
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <LogIn className="mr-2 h-4 w-4" />
                {isProcessing && gateStatus === "opening" ? "جاري التخصيص..." : "محاكاة دخول"}
              </Button>
              
              <Button 
                onClick={simulateExit}
                disabled={isProcessing || activeEntries.length === 0}
                size="lg"
                variant="outline"
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isProcessing && gateStatus === "opening" ? "جاري التحرير..." : "محاكاة خروج"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              إحصائيات الوقت الحالي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{availableSpots}</div>
                <div className="text-sm text-green-700">متاح</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{occupiedSpots}</div>
                <div className="text-sm text-red-700">محجوز</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">المركبات الحالية:</h4>
              {activeEntries.length === 0 ? (
                <p className="text-sm text-muted-foreground">لا توجد مركبات داخل المنشأة</p>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {activeEntries.map(entry => (
                    <div key={entry.id} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                      <span className="font-medium">{entry.spotNumber}</span>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {Math.round((Date.now() - entry.entryTime.getTime()) / 1000 / 60)} د
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Parking Map */}
      <Card>
        <CardHeader>
          <CardTitle>خريطة المواقف التفاعلية</CardTitle>
          <CardDescription>
            عرض مباشر لحالة المواقف (أخضر = متاح، أحمر = محجوز)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ParkingMap 
            entityId={selectedEntity} 
            currentEntries={currentEntries}
          />
        </CardContent>
      </Card>
    </div>
  );
};