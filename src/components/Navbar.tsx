import {useState} from "react";
import {LogIn, LogOut, Settings, FolderOpen, Plus, Compass, ArrowRight, Brush} from "lucide-react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {authClient} from "@/lib/auth-client";
import {LogoutDialog} from "@/components/blocks/LogoutDialog";
import {getInitials} from "@/lib/utils";

export function Navbar() {
    const {data: session} = authClient.useSession();
    const [logoutOpen, setLogoutOpen] = useState(false);

    return (
        <>
            <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen}/>
            <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
                <div className="mx-auto grid h-14 max-w-7xl grid-cols-3 items-center px-4 sm:h-16 sm:px-6">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
                        <Brush className="size-7 text-primary"/>
                        <span>ArtNext</span>
                    </Link>
                    <div className="flex justify-center">
                        <Button asChild variant="ghost" size="sm">
                            <Link to="/udforsk"><Compass className="size-4"/>Udforsk</Link>
                        </Button>
                    </div>
                    <div className="flex items-center justify-end gap-2 sm:gap-3">
                        {session ? (
                            <>
                                <Button asChild variant="ghost" size="sm">
                                    <Link to="/opret-vaerk"><Plus className="size-4"/> Opret værk</Link>
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full">
                                            <Avatar>
                                                <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild className="cursor-pointer">
                                            <Link to={`/profil/${session.user.id}`}>
                                                <FolderOpen className="size-4"/> Mit Portfolio
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="cursor-pointer">
                                            <Link to="/indstillinger">
                                                <Settings className="size-4"/> Indstillinger
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem variant="destructive" className="cursor-pointer"
                                                          onSelect={() => setLogoutOpen(true)}>
                                            <LogOut className="size-4"/> Log ud
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Button asChild variant="ghost" size="sm">
                                    <Link to="/login"><LogIn className="size-4"/> Log ind</Link>
                                </Button>
                                <Button asChild size="sm" variant="default">
                                    <Link to="/opret">
                                        Opret konto
                                        <ArrowRight className="size-4"/>
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}