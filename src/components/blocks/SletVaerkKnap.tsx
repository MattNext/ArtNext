import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useQueryClient} from "@tanstack/react-query";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {Trash2, LoaderCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
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
import type {SletVaerkKnapProps} from "@/types";

export function SletVaerkKnap({vaerkId, uploaderId}: SletVaerkKnapProps) {
    const {data: session} = authClient.useSession();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [deleting, setDeleting] = useState(false);

    // tjekker om brugeren er ejeren af værket, og hvis ikke, så skjuler den komponentet
    if (session?.user.id !== uploaderId) return null;

    // sletter et værk
    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/posts/${vaerkId}`, {method: "DELETE"});
            if (!res.ok) throw new Error();
            queryClient.invalidateQueries({queryKey: ["posts"]});
            queryClient.invalidateQueries({queryKey: ["profile", uploaderId]});
            queryClient.removeQueries({queryKey: ["vaerk", vaerkId]});
            toast.success("Værk slettet.");
            navigate(`/profil/${uploaderId}`);
        } catch {
            toast.error("Kunne ikke slette værket.");
            setDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon"
                        className="text-muted-foreground hover:bg-destructive/15 hover:text-destructive">
                    <Trash2 className="size-4"/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Slet værk?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Denne handling kan ikke fortrydes.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuller</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        variant="destructive"
                        disabled={deleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {deleting ? <LoaderCircle className="size-3.5 animate-spin"/> : <Trash2 className="size-3.5"/>}
                        Slet
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}