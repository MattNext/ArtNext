import "./index.css";
import {lazy, Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import {Disclaimer} from "@/components/Disclaimer.tsx";
const LandingsSide = lazy(() => import("@/pages/LandingsSide.tsx"));
const SideIkkeFundet = lazy(() => import("@/pages/SideIkkeFundet.tsx"));
const LoginSide = lazy(() => import("@/pages/LoginSide.tsx"));
const OpretningsSide = lazy(() => import("@/pages/OpretningsSide.tsx"));
const OpretVaerkSide = lazy(() => import("@/pages/OpretVaerkSide.tsx"));
const PortfolioSide = lazy(() => import("@/pages/PortfolioSide.tsx"));
const IndstillingerSide = lazy(() => import("@/pages/IndstillingerSide.tsx"));
const VaerkSide = lazy(() => import("@/pages/VaerkSide.tsx"));
const UdforskSide = lazy(() => import("@/pages/UdforskSide.tsx"));

export function App() {
    return (
        <Suspense>
            <Disclaimer/>
            <Routes>
                <Route path="/" element={<LandingsSide/>}/>
                <Route path="/login" element={<LoginSide/>}/>
                <Route path="/opret" element={<OpretningsSide/>}/>
                <Route path="/profil/:userId" element={<PortfolioSide/>}/>
                <Route path="/opret-vaerk" element={<OpretVaerkSide/>}/>
                <Route path="/indstillinger" element={<IndstillingerSide/>}/>
                <Route path="/vaerk/:vaerkId" element={<VaerkSide/>}/>
                <Route path="/udforsk" element={<UdforskSide/>}/>
                <Route path="*" element={<SideIkkeFundet/>}/>
            </Routes>
        </Suspense>
    );
}

export default App;