import {useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";
import {Heart} from "lucide-react";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {cn} from "@/lib/utils";
import type {LikeData} from "@/types";

export function LikeKnap({vaerkId}: { vaerkId: string }) {
    const [loading, setLoading] = useState(false);
    const {data: session} = authClient.useSession();
    const queryClient = useQueryClient();

    // henter likes via cache
    const queryKey = ["likes", vaerkId, session?.user.id ?? null];
    const {data} = useQuery<LikeData>({
        queryKey,
        queryFn: () => fetch(`/api/posts/${vaerkId}/like`).then((r) => r.json()),
        refetchInterval: 20_000,
    });
    const count = data?.count ?? 0;
    const liked = data?.liked ?? false;

    // opdaterer like status
    const toggle = async () => {
        if (!session || loading) return;
        setLoading(true);
        const prev = data;
        queryClient.setQueryData<LikeData>(queryKey, {
            count: liked ? count - 1 : count + 1,
            liked: !liked,
        });
        try {
            const res = await fetch(`/api/posts/${vaerkId}/like`, {method: liked ? "DELETE" : "POST"});
            if (!res.ok) throw new Error();
            const next = (await res.json()) as LikeData;
            queryClient.setQueryData<LikeData>(queryKey, next);
            queryClient.invalidateQueries({queryKey: ["likes", vaerkId]});
        } catch {
            queryClient.setQueryData(queryKey, prev);
            toast.error("Kunne ikke opdatere like.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn("flex items-center gap-1.5 px-2", liked ? "text-red-500" : "text-muted-foreground")}
            onClick={toggle}
            disabled={!session || loading}
        >
            <Heart className={cn("size-4", liked && "fill-current")}/>
            <span className="text-sm">{count}</span>
        </Button>
    );
}