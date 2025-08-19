import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Shield, User } from "lucide-react";
import logo from "@/assets/logo.png";

interface LoginPageProps {
  onLogin: (userId: string) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [step, setStep] = useState<"nafath" | "id">("nafath");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNafathLogin = async () => {
    setIsLoading(true);
    // Simulate Nafath authentication
    setTimeout(() => {
      setIsLoading(false);
      setStep("id");
    }, 2000);
  };

  const handleIdSubmit = () => {
    if (userId.trim()) {
      onLogin(userId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src={logo} alt="مبصِر الوطني" className="h-16 w-auto" />
            <div>
              <h1 className="text-2xl font-bold text-primary">مبصِر الوطني</h1>
              <p className="text-sm text-muted-foreground">Al Mubsir Al Watani</p>
            </div>
          </div>
          <p className="text-muted-foreground">نظام إدارة المواقف الذكي</p>
        </div>

        <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <h2 className="text-xl font-semibold text-foreground">
              {step === "nafath" ? "تسجيل الدخول" : "تأكيد الهوية"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {step === "nafath" 
                ? "استخدم نفاذ للدخول الآمن للنظام" 
                : "أدخل رقم الهوية الوطنية"}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === "nafath" ? (
              <div className="space-y-4">
                <Button
                  variant="nafath"
                  size="xl"
                  className="w-full"
                  onClick={handleNafathLogin}
                  disabled={isLoading}
                >
                  <Shield className="h-5 w-5" />
                  {isLoading ? "جاري التحقق..." : "تسجيل الدخول بنفاذ"}
                </Button>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    نظام آمن ومعتمد من الحكومة السعودية
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="userId" className="text-sm font-medium">
                    رقم الهوية الوطنية
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="userId"
                      type="text"
                      placeholder="1234567890"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="pl-4 pr-10 text-right"
                      dir="ltr"
                    />
                  </div>
                </div>
                
                <Button
                  variant="default"
                  size="xl"
                  className="w-full"
                  onClick={handleIdSubmit}
                  disabled={!userId.trim()}
                >
                  دخول النظام
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => setStep("nafath")}
                >
                  العودة لنفاذ
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            © 2024 مبصِر الوطني - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  );
};