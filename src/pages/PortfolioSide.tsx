import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {Layout} from "@/components/Layout";
import {Spinner} from "@/components/ui/spinner";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Separator} from "@/components/ui/separator";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {Link} from "react-router-dom";
import {getInitials} from "@/lib/utils";
import type {Author, Vaerk} from "@/types";

export default function PortfolioSide() {
    const {userId} = useParams<{ userId: string }>();

    // henter bruger og deres værker
    const {data, isLoading: loading} = useQuery({
        queryKey: ["profile", userId],
        enabled: !!userId,
        queryFn: async () => {
            const [author, posts] = await Promise.all([
                fetch(`/api/users/${userId}`).then((r) => (r.ok ? r.json() : null)) as Promise<Author | null>,
                fetch(`/api/posts/user/${userId}`).then((r) => r.json()),
            ]);
            return {author, vaerker: Array.isArray(posts) ? (posts as Vaerk[]) : []};
        },
    });
    const author = data?.author ?? null;
    const vaerker = data?.vaerker ?? [];

    return (
        <Layout mainClass="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
            {loading ? (
                <div className="flex justify-center py-12"><Spinner className="size-8"/></div>
            ) : (
                <>
                    <div className="flex items-center gap-4">
                        <Avatar size="lg">
                            <AvatarFallback>
                                {author ? getInitials(author.name) : "?"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                {author?.name ?? "Ukendt bruger"}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {vaerker.length} {vaerker.length === 1 ? "værk" : "værker"}
                            </p>
                        </div>
                    </div>
                    <Separator/>
                    {vaerker.length === 0 ? (
                        <p className="text-muted-foreground">Ingen værker.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {vaerker.map((vaerk) => (
                                <VaerkKort key={vaerk.id} vaerk={vaerk}/>
                            ))}
                        </div>
                    )}
                </>
            )}
        </Layout>
    );
}

function VaerkKort({vaerk}: { vaerk: Vaerk }) {
    return (
        <Link to={`/vaerk/${vaerk.id}`} className="group overflow-hidden rounded-lg border bg-card shadow-sm block">
            <AspectRatio ratio={1}>
                <img
                    src={vaerk.imageUrl}
                    alt={vaerk.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </AspectRatio>
        </Link>
    );
}