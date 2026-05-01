import type {ReactNode} from "react";
import {useNavigate} from "react-router-dom";
import {LogIn} from "lucide-react";
import {authClient} from "@/lib/auth-client";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {Layout} from "@/components/Layout";
import type {Session} from "@/types";

export function RequireAuth({message, children}: {
    message: string;
    children: (session: NonNullable<Session>) => ReactNode;
}) {
    const {data: session, isPending} = authClient.useSession();
    const navigate = useNavigate();

    // viser en loading ting midt på skærmen mens session data bliver hentet
    if (isPending) {
        return (
            <Layout mainClass="flex-1 flex items-center justify-center">
                <Spinner className="size-8"/>
            </Layout>
        );
    }

    // viser en "ikke logget ind" skærm hvis det er ingen aktiv session
    if (!session) {
        return (
            <Layout mainClass="flex-1 flex flex-col items-center justify-center gap-4">
                <p>{message}</p>
                <Button onClick={() => navigate("/login")}><LogIn className="size-4"/> Log ind</Button>
            </Layout>
        );
    }

    return <>{children(session)}</>;
}