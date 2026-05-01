import {useState} from "react";
import {authClient} from "@/lib/auth-client";
import {Layout} from "@/components/Layout";
import {RequireAuth} from "@/components/RequireAuth";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {LogoutDialog} from "@/components/blocks/LogoutDialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {LogOut, Trash2, LoaderCircle} from "lucide-react";
import {Label} from "@/components/ui/label";

export default function IndstillingerSide() {
    return (
        // laver et lille login tjek, og sender derefter brugerdata videre
        <RequireAuth message="Du er ikke logget ind.">
            {(session) => <Indstillinger user={session.user}/>}
        </RequireAuth>
    );
}

function Indstillinger({user}: { user: { id: string; name: string; email: string } }) {
    const navigate = useNavigate();
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);

    // sletter brugerens konto
    const handleDeleteAccount = async () => {
        setDeletingAccount(true);
        try {
            await authClient.deleteUser();
            toast.success("Din konto er blevet slettet.", {position: "top-center"});
            navigate("/");
        } catch {
            toast.error("Der skete en fejl ved sletning af kontoen.");
            setDeletingAccount(false);
        }
    };

    return (
        <Layout
            mainClass="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-12 md:py-16">
            <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">Indstillinger</h1>
            <div className="bg-card p-6 rounded-lg shadow border space-y-4">
                <div className="grid gap-2">
                    <Label>Navn</Label>
                    <div className="p-2 bg-muted rounded-md">{user.name}</div>
                </div>
                <div className="grid gap-2">
                    <Label>Email</Label>
                    <div className="p-2 bg-muted rounded-md">{user.email}</div>
                </div>
                <div className="grid gap-2">
                    <Label>Bruger ID</Label>
                    <div className="p-2 bg-muted rounded-md font-mono text-sm">{user.id}</div>
                </div>
            </div>
            <div>
                <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen}/>
                <div className="flex gap-2">
                    <Button onClick={() => setLogoutOpen(true)} variant="outline">
                        <LogOut className="size-4"/> Log ud
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><Trash2 className="size-4"/> Slet konto</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Denne handling kan ikke fortrydes. Det vil permanent slette din konto og fjerne
                                    dine data fra vores servere.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Annuller</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount} variant="destructive"
                                                   className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                   disabled={deletingAccount}>
                                    {deletingAccount ? <LoaderCircle className="size-3.5 animate-spin"/> :
                                        <Trash2 className="size-3.5"/>}
                                    Slet konto
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </Layout>
    );
}