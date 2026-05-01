import {useState} from "react";
import {useParams, Link} from "react-router-dom";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {Navbar} from "@/components/Navbar";
import {Spinner} from "@/components/ui/spinner";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {getInitials} from "@/lib/utils";
import {SletVaerkKnap} from "@/components/blocks/SletVaerkKnap";
import {KommentarSektion} from "@/components/blocks/KommentarSektion";
import {LikeKnap} from "@/components/blocks/LikeKnap";
import {RedigerVaerkForm} from "@/components/blocks/RedigerVaerkForm";
import {TidsstempelTooltip} from "@/components/TidsstempelTooltip";
import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import {authClient} from "@/lib/auth-client";
import type {Vaerk} from "@/types";

export default function VaerkSide() {
    const {vaerkId} = useParams<{ vaerkId: string }>();
    const queryClient = useQueryClient();
    const [editing, setEditing] = useState(false);
    const {data: session} = authClient.useSession();

    // henter det pågældende værk
    const {data: vaerk, isLoading: loading} = useQuery<Vaerk>({
        queryKey: ["vaerk", vaerkId],
        enabled: !!vaerkId,
        queryFn: () => fetch(`/api/posts/${vaerkId}`).then((r) => {
            if (!r.ok) throw new Error();
            return r.json();
        }),
    });

    // tjekker om brugeren ejer værket, hvilket bruges til at bestemme om rediger og slet knapperne vises
    const isOwner = session?.user.id === vaerk?.user.id;

    return (
        <div className="h-screen overflow-hidden flex flex-col bg-background">
            <Navbar/>
            <div className="flex flex-1 overflow-hidden">
                {loading ? (
                    <div className="flex flex-1 items-center justify-center">
                        <Spinner className="size-8"/>
                    </div>
                ) : vaerk && (
                    <>
                        <div className="w-2/3 bg-muted flex items-center justify-center overflow-hidden">
                            <img src={vaerk.imageUrl} alt={vaerk.title} className="w-full h-full object-contain"/>
                        </div>
                        <div className="w-1/3 border-l flex flex-col p-6 gap-4 overflow-hidden">
                            <div className="flex items-center">
                                <Link
                                    to={`/profil/${vaerk.user.id}`}
                                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                                >
                                    <Avatar>
                                        <AvatarFallback>{getInitials(vaerk.user.name)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{vaerk.user.name}</span>
                                </Link>
                                <div className="ml-auto pr-1 flex items-center">
                                    {isOwner && !editing && (
                                        <Button variant="ghost" size="icon" className="text-muted-foreground"
                                                onClick={() => setEditing(true)}>
                                            <Pencil className="size-4"/>
                                        </Button>
                                    )}
                                    <SletVaerkKnap vaerkId={vaerk.id} uploaderId={vaerk.user.id}/>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                {editing ? (
                                    <RedigerVaerkForm
                                        vaerk={vaerk}
                                        onSave={(updated) => {
                                            queryClient.setQueryData(["vaerk", vaerkId], updated);
                                            queryClient.invalidateQueries({queryKey: ["posts"]});
                                            setEditing(false);
                                        }}
                                        onCancel={() => setEditing(false)}
                                    />
                                ) : (
                                    <>
                                        <h1 className="text-xl font-bold break-words">{vaerk.title}</h1>
                                        {vaerk.description && (
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{vaerk.description}</p>
                                        )}
                                        <TidsstempelTooltip dato={vaerk.createdAt}/>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <LikeKnap vaerkId={vaerk.id}/>
                            </div>
                            <KommentarSektion vaerkId={vaerk.id}/>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}