import {Link} from "react-router-dom";
import {Layout} from "@/components/Layout";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";

export function SideIkkeFundet() {
    return (
        <Layout mainClass="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-6 py-16 text-center">
            <div className="space-y-4">
                <p className="text-3xl font-medium text-muted-foreground">404</p>
                <h1 className="text-3xl font-semibold tracking-tight">Siden blev ikke fundet</h1>
                <Button asChild>
                    <Link to="/"><ArrowLeft className="size-4"/> Gå til forsiden</Link>
                </Button>
            </div>
        </Layout>
    );
}

export default SideIkkeFundet;