// @ts-ignore
import kunstImg from "@/assets/kunst.jpg";
import {Button} from "@/components/ui/button";
import {Link} from "react-router-dom";
import {authClient} from "@/lib/auth-client";

export function HeroSektion() {
    const {data: session} = authClient.useSession();
    return (
        <section className="relative rounded-xl bg-muted/20 p-8 text-center md:p-12 overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${kunstImg})`,
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
            </div>
            <div className="relative z-10">
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                    Dit kunst. Dit portefølje.
                </h1>
                <p className="mx-auto mt-3 max-w-2xl text-white/80">
                    Opret dit eget portefølje, upload dine værker og få feedback fra andre kunstnere :D
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    {!session && (
                        <Button className="cursor-pointer" size="lg" asChild>
                            <Link to="/opret">Opret portefølje</Link>
                        </Button>
                    )}
                    <Button className="cursor-pointer" size="lg" variant="outline" asChild>
                        <Link to="/udforsk">Udforsk værker</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}