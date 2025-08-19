import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Phone, FileText, Users, ArrowRight } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  availability: "available" | "limited" | "unavailable";
  icon: React.ReactNode;
}

interface EntityService {
  entityId: string;
  entityName: string;
  services: Service[];
}

const entityServices: EntityService[] = [
  {
    entityId: "hospital",
    entityName: "مستشفى الملك خالد",
    services: [
      {
        id: "appointment",
        name: "حجز موعد",
        description: "حجز موعد في العيادات المختلفة",
        duration: "30-60 دقيقة",
        availability: "available",
        icon: <Calendar className="h-5 w-5" />
      },
      {
        id: "emergency",
        name: "الطوارئ",
        description: "خدمة الطوارئ على مدار الساعة",
        duration: "فوري",
        availability: "available",
        icon: <Clock className="h-5 w-5" />
      },
      {
        id: "labs",
        name: "المختبرات",
        description: "فحوصات مخبرية شاملة",
        duration: "15-30 دقيقة",
        availability: "limited",
        icon: <FileText className="h-5 w-5" />
      }
    ]
  },
  {
    entityId: "ksu",
    entityName: "جامعة الملك سعود",
    services: [
      {
        id: "admission",
        name: "شؤون الطلاب",
        description: "خدمات القبول والتسجيل",
        duration: "45 دقيقة",
        availability: "available",
        icon: <Users className="h-5 w-5" />
      },
      {
        id: "academic",
        name: "الشؤون الأكاديمية",
        description: "استشارات أكاديمية ومتابعة الدرجات",
        duration: "30 دقيقة",
        availability: "available",
        icon: <FileText className="h-5 w-5" />
      },
      {
        id: "library",
        name: "المكتبة",
        description: "خدمات المكتبة والبحث العلمي",
        duration: "مفتوح",
        availability: "available",
        icon: <FileText className="h-5 w-5" />
      }
    ]
  },
  {
    entityId: "expo",
    entityName: "معرض السعودية",
    services: [
      {
        id: "booking",
        name: "حجز أجنحة",
        description: "حجز الأجنحة والمساحات للمعارض",
        duration: "يوم كامل",
        availability: "limited",
        icon: <MapPin className="h-5 w-5" />
      },
      {
        id: "events",
        name: "الفعاليات",
        description: "تنظيم المؤتمرات والفعاليات",
        duration: "حسب الفعالية",
        availability: "available",
        icon: <Calendar className="h-5 w-5" />
      },
      {
        id: "consultation",
        name: "الاستشارات",
        description: "استشارات تنظيم المعارض",
        duration: "60 دقيقة",
        availability: "available",
        icon: <Phone className="h-5 w-5" />
      }
    ]
  }
];

interface ServicesSectionProps {
  selectedEntityId?: string;
}

export const ServicesSection = ({ selectedEntityId }: ServicesSectionProps) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingStep, setBookingStep] = useState<"select" | "details" | "confirm">("select");

  const relevantServices = selectedEntityId 
    ? entityServices.filter(es => es.entityId === selectedEntityId)
    : entityServices;

  const getAvailabilityColor = (availability: Service['availability']) => {
    switch (availability) {
      case "available": return "bg-success text-success-foreground";
      case "limited": return "bg-warning text-warning-foreground";
      case "unavailable": return "bg-destructive text-destructive-foreground";
    }
  };

  const getAvailabilityText = (availability: Service['availability']) => {
    switch (availability) {
      case "available": return "متاح";
      case "limited": return "محدود";
      case "unavailable": return "غير متاح";
    }
  };

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setBookingStep("details");
  };

  const handleBookService = () => {
    setBookingStep("confirm");
    // Here would be the actual booking logic
    setTimeout(() => {
      alert("تم حجز الخدمة بنجاح! سيتم تخصيص موقف تلقائياً عند اقتراب موعدك.");
      setSelectedService(null);
      setBookingStep("select");
    }, 1000);
  };

  if (bookingStep === "details" && selectedService) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {selectedService.icon}
            تفاصيل الخدمة: {selectedService.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">الوصف</h4>
                <p className="text-muted-foreground">{selectedService.description}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">المدة المتوقعة</h4>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{selectedService.duration}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">الحالة</h4>
                <Badge className={getAvailabilityColor(selectedService.availability)}>
                  {getAvailabilityText(selectedService.availability)}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-accent rounded-lg">
                <h4 className="font-semibold mb-2">مميزات النظام الذكي</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>تخصيص موقف تلقائي حسب الموعد</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>أولوية لذوي الاحتياجات الخاصة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>توجيه بصري بالواقع المعزز</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-primary" />
                    <span>تنبيهات ذكية قبل الموعد</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedService(null);
                setBookingStep("select");
              }}
            >
              العودة
            </Button>
            {selectedService.availability !== "unavailable" && (
              <Button onClick={handleBookService}>
                حجز الخدمة
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (bookingStep === "confirm") {
    return (
      <Card className="border-success/50 bg-success/5">
        <CardContent className="text-center py-8">
          <div className="mb-4">
            <div className="h-16 w-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-success-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">جاري معالجة طلبك...</h3>
            <p className="text-muted-foreground">يرجى الانتظار حتى يتم تأكيد الحجز</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {relevantServices.map((entityService) => (
        <Card key={entityService.entityId}>
          <CardHeader>
            <CardTitle>{entityService.entityName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entityService.services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className="p-4 border border-border rounded-lg cursor-pointer transition-all hover:shadow-md hover:border-primary/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {service.icon}
                      <h4 className="font-semibold">{service.name}</h4>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getAvailabilityColor(service.availability)}
                    >
                      {getAvailabilityText(service.availability)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};