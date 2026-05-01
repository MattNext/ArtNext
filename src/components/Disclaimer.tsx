const DISCLAIMER_ENABLED = true;

import {useState, useEffect} from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STORAGE_KEY = "fraskrivelse-accepteret";

export function Disclaimer() {
    const [open, setOpen] = useState(false);
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        if (!DISCLAIMER_ENABLED) return;
        if (!localStorage.getItem(STORAGE_KEY)) {
            setOpen(true);
        }
    }, []);

    useEffect(() => {
        if (!open || countdown <= 0) return;
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [open, countdown]);

    function handleAccept() {
        localStorage.setItem(STORAGE_KEY, "true");
        setOpen(false);
    }

    if (!DISCLAIMER_ENABLED) return null;

    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Ansvarsfraskrivelse</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-4 text-sm text-muted-foreground">
                            <p>
                                Denne hjemmeside er udarbejdet som led i et <strong>gymnasieprojekt</strong> og
                                er <strong>udelukkende til demonstrationsformål.</strong>
                            </p>
                            <p>
                                Hjemmesiden kan anvende tredjepartstjenester eller analyseværktøjer, som
                                kan behandle visse data til egne eller kommercielle formål. Privatlivspolitikken
                                dækker <strong>kun</strong> de
                                forhold, der er relevante for dette projekt, og er <strong>ikke</strong> nødvendigvis
                                udtømmende.
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row items-center justify-between sm:justify-between">
                    <p className="text-xs italic text-muted-foreground">
                        Tryk på 'OK' for at bekræfte, at du har læst og forstået ovenstående.
                    </p>
                    <AlertDialogAction
                        className="min-w-24"
                        disabled={countdown > 0}
                        onClick={handleAccept}
                    >
                        {countdown > 0 ? `OK (${countdown})` : "OK"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}