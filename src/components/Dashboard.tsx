import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EntityCard } from "./EntityCard";
import { ParkingMap } from "./ParkingMap";
import { AppointmentsSection } from "./AppointmentsSection";
import { ServicesSection } from "./ServicesSection";
import { LogOut, Building2, Car, Calendar, Users } from "lucide-react";
import logo from "@/assets/logo.png";
import ksuLogo from "@/assets/ksu-logo.png";
import expoLogo from "@/assets/expo-logo.png";
import hospitalLogo from "@/assets/hospital-logo.png";
import bookFairLogo from "@/assets/book-fair-logo.png";
import mallLogo from "@/assets/mall-logo.png";
import courtLogo from "@/assets/court-logo.png";

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
  {
    id: "book-fair",
    name: "معرض الكتاب",
    nameEn: "Book Fair",
    logo: bookFairLogo,
    location: "الرياض، المملكة العربية السعودية",
    parkingSpots: 320,
    availableSpots: 145,
    description: "معرض الكتاب الدولي ومركز الفعاليات الثقافية",
  },
  {
    id: "mall",
    name: "النخيل مول",
    nameEn: "Al Nakheel Mall",
    logo: mallLogo,
    location: "الرياض، المملكة العربية السعودية",
    parkingSpots: 800,
    availableSpots: 234,
    description: "مركز تسوق متكامل ومجمع ترفيهي حديث",
  },
  {
    id: "court",
    name: "المحكمة العامة",
    nameEn: "General Court",
    logo: courtLogo,
    location: "الرياض، المملكة العربية السعودية",
    parkingSpots: 150,
    availableSpots: 67,
    description: "مجمع المحاكم العامة ومرافق العدالة",
  },
];

export const Dashboard = ({ userId, onLogout }: DashboardProps) => {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "appointments" | "entities" | "services">("overview");
  const selectedEntityData = entities.find(e => e.id === selectedEntity);
  
  // Calculate total available spots dynamically
  const totalAvailableSpots = entities.reduce((total, entity) => total + entity.availableSpots, 0);

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
            <div className="flex items-center gap-4">
              <Button 
                variant={activeTab === "services" ? "default" : "outline"}
                onClick={() => setActiveTab("services")}
              >
                عرض الخدمات
              </Button>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {activeTab === "services" ? (
            <ServicesSection selectedEntityId={selectedEntity} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Entity Details */}
              <div className="lg:col-span-1 space-y-6">
                <div className="p-4 bg-card border rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={selectedEntityData.logo} alt={selectedEntityData.name} className="h-12 w-12 rounded-full" />
                    <div>
                      <h2 className="font-bold">{selectedEntityData.name}</h2>
                      <p className="text-sm text-muted-foreground">{selectedEntityData.nameEn}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">الموقع</p>
                      <p className="text-sm">{selectedEntityData.location}</p>
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
                  </div>
                </div>
              </div>

              {/* Parking Map */}
              <div className="lg:col-span-2">
                <div className="bg-card border rounded-lg p-6 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <Car className="h-5 w-5" />
                    <h3 className="font-semibold">خريطة المواقف التفاعلية</h3>
                  </div>
                  <ParkingMap entityId={selectedEntity} />
                </div>
              </div>
            </div>
          )}
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

      {/* Navigation Tabs */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex gap-4">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              onClick={() => setActiveTab("overview")}
              className="flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              نظرة عامة
            </Button>
            <Button
              variant={activeTab === "appointments" ? "default" : "ghost"}
              onClick={() => setActiveTab("appointments")}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              المواعيد
            </Button>
            <Button
              variant={activeTab === "entities" ? "default" : "ghost"}
              onClick={() => setActiveTab("entities")}
              className="flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              الجهات
            </Button>
            <Button
              variant={activeTab === "services" ? "default" : "ghost"}
              onClick={() => setActiveTab("services")}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              الخدمات
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4">إحصائيات سريعة</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{totalAvailableSpots}</p>
                    <p className="text-xs text-muted-foreground">مواقف متاحة</p>
                  </div>
                  <div className="text-center p-3 bg-nafath/10 rounded-lg">
                    <p className="text-2xl font-bold text-nafath">3</p>
                    <p className="text-xs text-muted-foreground">مواعيد هذا الأسبوع</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Entities */}
            <div className="lg:col-span-2">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4">المنشآت المشاركة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {entities.slice(0, 4).map((entity) => (
                    <div
                      key={entity.id}
                      onClick={() => setSelectedEntity(entity.id)}
                      className="p-4 border border-border rounded-lg cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                    >
                      <div className="flex items-center gap-3">
                        <img src={entity.logo} alt={entity.name} className="h-10 w-10 rounded-full" />
                        <div>
                          <h4 className="font-medium text-sm">{entity.name}</h4>
                          <p className="text-xs text-muted-foreground">{entity.availableSpots} موقف متاح</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "appointments" && (
          <AppointmentsSection userId={userId} />
        )}

        {activeTab === "entities" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {entities.map((entity) => (
              <EntityCard
                key={entity.id}
                entity={entity}
                onClick={() => setSelectedEntity(entity.id)}
              />
            ))}
          </div>
        )}

        {activeTab === "services" && (
          <ServicesSection />
        )}
      </div>
    </div>
  );
};