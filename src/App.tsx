import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/i18n";
import { isNative } from "@/lib/platform";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import PwaInstallBanner from "./components/PwaInstallBanner.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!isNative && <PwaInstallBanner />}
        {/* App nativo: faixa escura atrás da barra de status, para os ícones
            claros aparecerem sobre qualquer fundo do jogo. */}
        {isNative && (
          <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[env(safe-area-inset-top)] bg-black/30" />
        )}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
