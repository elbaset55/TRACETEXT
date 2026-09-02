import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F5F2ED]">
      <div className="mx-4 w-full max-w-lg border-2 border-[#000066]/15 bg-white/90 p-8 text-center shadow-[0_16px_44px_rgba(0,0,102,0.08)]">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#F7941D]/15 rounded-full animate-pulse" />
            <AlertCircle className="relative h-16 w-16 text-[#000066]" />
          </div>
        </div>

        <h1 className="font-display text-5xl font-extrabold text-[#000066]">404</h1>

        <h2 className="mt-2 text-xl font-bold text-[#3D4566]">
          الصفحة غير موجودة
        </h2>

        <p className="mb-8 mt-4 leading-relaxed text-[#5A5F7A]">
          عذرًا، الصفحة التي تبحث عنها غير موجودة.
          <br />
          ربما تم نقلها أو حذفها.
        </p>

        <Button
          onClick={handleGoHome}
          className="h-12 rounded-none bg-[#000066] px-6 text-white hover:bg-[#00004d]"
        >
          <Home className="ml-2 h-4 w-4" />
          العودة للرئيسية
        </Button>
      </div>
    </div>
  );
}
