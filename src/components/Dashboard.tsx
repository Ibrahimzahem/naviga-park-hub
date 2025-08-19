import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EntityCard } from "./EntityCard";
import { ParkingMap } from "./ParkingMap";
import { Calendar, MapPin, Clock, LogOut, Building2, Car } from "lucide-react";
import logo from "@/assets/logo.png";
import ksuLogo from "@/assets/ksu-logo.png";
import expoLogo from "@/assets/expo-logo.png";
import hospitalLogo from "@/assets/hospital-logo.png";

interface DashboardProps {
  userId: string;
  onLogout: () => void;
}

const entities = [
  {
    id: "ksu",
    name: "جامعة الملك سعود",
    nameEn: "King Saud University",
    logo: ksuLogo,
    location: "الرياض، المملكة العربية السعودية",
    parkingSpots: 250,
    availableSpots: 89,
    description: "الجامعة الرائدة في التعليم العالي والبحث العلمي",
  },
  {
    id: "expo",
    name: "معرض السعودية",
    nameEn: "Saudi Expo",
    logo: expoLogo,
    location: "الرياض، المملكة العربية السعودية",
    parkingSpots: 500,
    availableSpots: 156,
    description: "مركز المعارض والمؤتمرات الدولية",
  },
  {
    id: "hospital",
    name: "مستشفى الملك خالد",
    nameEn: "King Khalid Hospital",
    logo: hospitalLogo,
    location: "الرياض، المملكة العربية السعودية",
    parkingSpots: 180,
    availableSpots: 23,
    description: "مركز طبي متخصص في الرعاية الصحية المتقدمة",
  },
];

export const Dashboard = ({ userId, onLogout }: DashboardProps) => {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const selectedEntityData = entities.find(e => e.id === selectedEntity);

  const mockAppointments = [
    { id: 1, entity: "جامعة الملك سعود", time: "10:00 ص", date: "اليوم", status: "confirmed" },
    { id: 2, entity: "مستشفى الملك خالد", time: "2:30 م", date: "غداً", status: "pending" },
  ];

  if (selectedEntity && selectedEntityData) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setSelectedEntity(null)}>
                ← العودة
              </Button>
              <img src={selectedEntityData.logo} alt={selectedEntityData.name} className="h-10 w-10 rounded-full" />
              <div>
                <h1 className="text-lg font-bold">{selectedEntityData.name}</h1>
                <p className="text-sm text-muted-foreground">{selectedEntityData.nameEn}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Entity Details */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    تفاصيل المنشأة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">الموقع</p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {selectedEntityData.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الوصف</p>
                    <p className="text-sm">{selectedEntityData.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-accent rounded-lg">
                      <p className="text-2xl font-bold text-primary">{selectedEntityData.parkingSpots}</p>
                      <p className="text-xs text-muted-foreground">إجمالي المواقف</p>
                    </div>
                    <div className="text-center p-3 bg-success/10 rounded-lg">
                      <p className="text-2xl font-bold text-success">{selectedEntityData.availableSpots}</p>
                      <p className="text-xs text-muted-foreground">متاح الآن</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button variant="default" size="lg" className="w-full">
                عرض الخدمات
              </Button>
            </div>

            {/* Parking Map */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    خريطة المواقف التفاعلية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ParkingMap entityId={selectedEntity} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="مبصِر الوطني" className="h-10 w-auto" />
            <div>
              <h1 className="text-lg font-bold text-primary">مبصِر الوطني</h1>
              <p className="text-sm text-muted-foreground">مرحباً، {userId}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  المواعيد القادمة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{appointment.entity}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.time} - {appointment.date}
                        </p>
                      </div>
                      <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                        {appointment.status === "confirmed" ? "مؤكد" : "معلق"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إحصائيات سريعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <p className="text-2xl font-bold text-primary">268</p>
                    <p className="text-xs text-muted-foreground">مواقف متاحة</p>
                  </div>
                  <div className="text-center p-3 bg-nafath/10 rounded-lg">
                    <p className="text-2xl font-bold text-nafath">3</p>
                    <p className="text-xs text-muted-foreground">مواعيد هذا الأسبوع</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Entities Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  المنشآت المشاركة في النظام
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {entities.map((entity) => (
                    <EntityCard
                      key={entity.id}
                      entity={entity}
                      onClick={() => setSelectedEntity(entity.id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};