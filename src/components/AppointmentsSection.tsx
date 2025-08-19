import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Building2, User, Car } from "lucide-react";

interface Appointment {
  id: string;
  entityName: string;
  clinicName?: string;
  doctorName?: string;
  date: Date;
  duration: number; // in minutes
  status: "upcoming" | "past";
  parkingSpot?: {
    floor: number;
    spotNumber: string;
    zone: string;
  };
}

interface AppointmentsSectionProps {
  userId: string;
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    entityName: "مستشفى الملك خالد",
    clinicName: "عيادة القلب",
    doctorName: "د. أحمد محمد",
    date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    duration: 30,
    status: "upcoming",
    parkingSpot: {
      floor: 2,
      spotNumber: "B15",
      zone: "B"
    }
  },
  {
    id: "2",
    entityName: "جامعة الملك سعود",
    clinicName: "قسم القبول",
    doctorName: "أ. سارة أحمد",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
    duration: 45,
    status: "upcoming"
  },
  {
    id: "3",
    entityName: "مستشفى الملك خالد",
    clinicName: "عيادة العظام",
    doctorName: "د. خالد سعد",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    duration: 30,
    status: "past"
  }
];

export const AppointmentsSection = ({ userId }: AppointmentsSectionProps) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (appointment: Appointment) => {
    const now = currentTime.getTime();
    const appointmentTime = appointment.date.getTime();
    const diff = appointmentTime - now;

    if (diff <= 0) return "انتهى الموعد";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} يوم، ${hours % 24} ساعة`;
    }

    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getUrgencyColor = (appointment: Appointment) => {
    const now = currentTime.getTime();
    const appointmentTime = appointment.date.getTime();
    const diff = appointmentTime - now;
    const hoursUntil = diff / (1000 * 60 * 60);

    if (hoursUntil <= 2) return "text-destructive border-destructive bg-destructive/10";
    if (hoursUntil <= 12) return "text-warning border-warning bg-warning/10";
    return "text-success border-success bg-success/10";
  };

  const upcomingAppointments = mockAppointments.filter(a => a.status === "upcoming");
  const pastAppointments = mockAppointments.filter(a => a.status === "past");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            المواعيد القادمة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingAppointments.map((appointment) => (
            <div
              key={appointment.id}
              onClick={() => setSelectedAppointment(appointment)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getUrgencyColor(appointment)}`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{appointment.entityName}</span>
                  </div>
                  {appointment.clinicName && (
                    <p className="text-sm opacity-80">{appointment.clinicName}</p>
                  )}
                  {appointment.doctorName && (
                    <div className="flex items-center gap-2 text-sm opacity-80">
                      <User className="h-3 w-3" />
                      {appointment.doctorName}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-3 w-3" />
                    {appointment.date.toLocaleString('ar-SA')}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {formatCountdown(appointment)}
                  </div>
                  <p className="text-xs opacity-70">متبقي</p>
                </div>
              </div>

              {appointment.parkingSpot && (
                <div className="mt-3 pt-3 border-t border-current/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="h-4 w-4" />
                    <span>الموقف: الطابق {appointment.parkingSpot.floor} - {appointment.parkingSpot.spotNumber}</span>
                  </div>
                </div>
              )}
              
              {!appointment.parkingSpot && (
                <div className="mt-3 pt-3 border-t border-current/20">
                  <p className="text-sm opacity-70">سيتم تخصيص موقف تلقائياً قبل الموعد</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            المواعيد السابقة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pastAppointments.map((appointment) => (
            <div
              key={appointment.id}
              onClick={() => setSelectedAppointment(appointment)}
              className="p-4 bg-muted/50 rounded-lg cursor-pointer transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{appointment.entityName}</span>
                  </div>
                  {appointment.clinicName && (
                    <p className="text-sm text-muted-foreground">{appointment.clinicName}</p>
                  )}
                  {appointment.doctorName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      {appointment.doctorName}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {appointment.date.toLocaleString('ar-SA')}
                  </div>
                </div>
                
                <Badge variant="secondary">مكتمل</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>تفاصيل الموعد</span>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">معلومات الموعد</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{selectedAppointment.entityName}</span>
                  </div>
                  {selectedAppointment.clinicName && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedAppointment.clinicName}</span>
                    </div>
                  )}
                  {selectedAppointment.doctorName && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{selectedAppointment.doctorName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{selectedAppointment.date.toLocaleString('ar-SA')}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">تفاصيل الموقف</h4>
                {selectedAppointment.parkingSpot ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span>الطابق {selectedAppointment.parkingSpot.floor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>موقف رقم {selectedAppointment.parkingSpot.spotNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>المنطقة {selectedAppointment.parkingSpot.zone}</span>
                    </div>
                    <div className="mt-3 p-3 bg-success/10 rounded-lg">
                      <p className="text-sm text-success">
                        🗺️ خريطة تفاعلية متاحة للوصول إلى الموقف بأسرع طريق
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      سيتم تخصيص موقف تلقائياً قبل موعدك بساعة واحدة
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};