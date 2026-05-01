import {Layout} from "@/components/Layout";
import {HeroSektion} from "@/components/HeroSektion";
import {VaerkGrid} from "@/components/VaerkGrid";
import {Link} from "react-router-dom";

export function LandingsSide() {
    return (
        <Layout mainClass="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 py-16">
            <HeroSektion/>
            <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Nyeste værker</h2>
                    <Link to="/udforsk" className="text-sm text-muted-foreground hover:underline">Se alle</Link>
                </div>
                <VaerkGrid limit={6} className="grid grid-cols-2 sm:grid-cols-3 gap-3"/>
            </section>
        </Layout>
    );
}

export default LandingsSide;