/** Design reminder — Benha Loop is a warm, operational circular-material dashboard; default to the light paper theme. */
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import SplashScreen from "./components/SplashScreen";
import Home from "@/pages/Home";

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/admin" component={Admin} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ErrorBoundary>
      <SettingsProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}
