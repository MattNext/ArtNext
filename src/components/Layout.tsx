import type {ReactNode} from "react";
import {Navbar} from "@/components/Navbar";
import {Footer} from "@/components/Footer";

export function Layout({children, mainClass}: { children: ReactNode; mainClass?: string }) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar/>
            <main className={mainClass}>{children}</main>
            <Footer/>
        </div>
    );
}

// det her er en form for wrapper komponent, som giver alle sider den samme grunndstruktur. Altså alle sider får en navbar og footer, hvor indholdet vises "i midten".