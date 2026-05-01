import {Link} from "react-router-dom";

export function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div
                className="mx-auto flex max-w-max flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:gap-6 sm:px-6 sm:py-10 sm:justify-between">
                <div className="flex gap-6 text-sm text-muted-foreground">
                    <Link to="/privatlivspolitik" className="hover:text-foreground transition-colors">Privatlivspolitik</Link>
                    <Link to="/servicevilkaar" className="hover:text-foreground transition-colors">Servicevilkår</Link>
                    <Link to="/kontakt" className="hover:text-foreground transition-colors">Kontakt</Link>
                </div>
            </div>
        </footer>
    );
}