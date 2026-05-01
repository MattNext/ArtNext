import {useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {Link} from "react-router-dom";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {TidsstempelTooltip} from "@/components/TidsstempelTooltip";
import {getInitials} from "@/lib/utils";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {Trash2, LoaderCircle} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";
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
import type {Comment} from "@/types";
import {isAdminUserId} from "@/lib/admin";

export function KommentarSektion({vaerkId}: { vaerkId: string }) {
    const [input, setInput] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const {data: session} = authClient.useSession();
    const queryClient = useQueryClient();

    // henter kommentarer via cache
    const queryKey = ["comments", vaerkId];
    const {data: comments = []} = useQuery<Comment[]>({
        queryKey,
        queryFn: () => fetch(`/api/posts/${vaerkId}/comments`).then((r) => r.json()).then((d: Comment[]) => [...d].reverse()),
        refetchInterval: 20_000,
    });

    // sender/uploader en ny kommentar når formularen indsendes
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || submitting) return;
        setSubmitting(true);
        try {
            const res = await fetch(`/api/posts/${vaerkId}/comments`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({content: input.trim()}),
            });
            const data = await res.json();
            if (!res.ok) return toast.error(data.error || "Kunne ikke sende kommentar.");
            queryClient.setQueryData<Comment[]>(queryKey, (prev = []) => [data, ...prev]);
            queryClient.invalidateQueries({queryKey});
            setInput("");
            toast.success("Kommentar sendt.");
        } finally {
            setSubmitting(false);
        }
    };

    // sletter en kommentar
    const deleteComment = async (commentId: string) => {
        setDeletingId(commentId);
        try {
            const res = await fetch(`/api/comments/${commentId}`, {method: "DELETE"});
            if (!res.ok) return toast.error("Kunne ikke slette kommentar.");
            queryClient.setQueryData<Comment[]>(queryKey, (prev = []) => prev.filter((c) => c.id !== commentId));
            queryClient.invalidateQueries({queryKey});
            toast.success("Kommentar slettet.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="border-t pt-4 flex flex-col gap-3 flex-1 min-h-0">
            {session ? (
                <form onSubmit={submit} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Skriv en kommentar..."
                        maxLength={500}
                        className="text-sm"
                    />
                    <Button type="submit" size="default" disabled={!input.trim() || submitting}>
                        Send
                    </Button>
                </form>
            ) : null}
            <p className="text-sm font-medium">
                Kommentarer{" "}
                {comments.length > 0 && (
                    <span className="text-muted-foreground font-normal">({comments.length})</span>
                )}
            </p>
            {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">Ingen kommentarer endnu.</p>
            ) : (
                <ScrollArea className="flex-1 min-h-0">
                    <div className="flex flex-col gap-3 pr-3">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-2 group">
                                <Avatar className="size-7 shrink-0 mt-0.5">
                                    <AvatarFallback
                                        className="text-xs">{getInitials(comment.user.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-1.5">
                                        <Link
                                            to={`/profil/${comment.user.id}`}
                                            className="text-xs font-medium hover:underline truncate"
                                        >
                                            {comment.user.name}
                                        </Link>
                                        <TidsstempelTooltip dato={comment.createdAt}/>
                                    </div>
                                    <p className="text-sm break-words whitespace-pre-wrap">{comment.content}</p>
                                </div>
                                {(session?.user.id === comment.user.id || isAdminUserId(session?.user.id)) && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                                            >
                                                <Trash2 className="size-3"/>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Slet kommentar?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Denne handling kan ikke fortrydes.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Annuller</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => deleteComment(comment.id)}
                                                    variant="destructive"
                                                    disabled={deletingId === comment.id}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    {deletingId === comment.id ?
                                                        <LoaderCircle className="size-3.5 animate-spin"/> :
                                                        <Trash2 className="size-3.5"/>}
                                                    Slet
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
}