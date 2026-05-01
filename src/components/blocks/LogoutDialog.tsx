import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {LogOut, Loader2} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import {toast} from "sonner";
import {authClient} from "@/lib/auth-client.ts";
import type {LogoutDialogProps} from "@/types";

export function LogoutDialog({open, onOpenChange}: LogoutDialogProps) {
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);

    return (
        <AlertDialog open={open} onOpenChange={(o) => !loggingOut && onOpenChange(o)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Log ud?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Du bliver logget ud af din konto på denne enhed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loggingOut}>Annuller</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            setLoggingOut(true);
                            authClient.signOut().then(() => {
                                toast.success("Du er nu logget ud.", {position: "top-center"});
                                setLoggingOut(false);
                                onOpenChange(false);
                                navigate("/");
                            }).catch(() => {
                                setLoggingOut(false);
                            });
                        }}
                        disabled={loggingOut}
                        variant="destructive"
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {loggingOut ? <Loader2 className="size-4 animate-spin"/> : <LogOut className="size-4"/>}
                        {loggingOut ? "Logger ud..." : "Log ud"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}