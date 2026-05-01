import {Link} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {Spinner} from "@/components/ui/spinner";
import type {Vaerk} from "@/types";

export function VaerkGrid({limit, className = "columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3"}: {
    limit?: number;
    className?: string;
}) {
    const {data: posts = [], isLoading} = useQuery<Vaerk[]>({
        queryKey: ["posts"],
        queryFn: () => fetch("/api/posts").then((r) => r.json()),
    });

    if (isLoading) return <div className="flex justify-center py-10"><Spinner className="size-6"/></div>;

    const visible = limit ? posts.slice(0, limit) : posts;

    return (
        <div className={className}>
            {visible.map((post) => (
                <Link key={post.id} to={`/vaerk/${post.id}`} className="block break-inside-avoid group">
                    <div className="overflow-hidden rounded-md bg-muted aspect-square">
                        <img src={post.imageUrl} alt={post.title}
                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                    </div>
                    <div className="mt-1 px-0.5">
                        <p className="text-sm font-medium truncate">{post.title}</p>
                        <p className="text-xs text-muted-foreground truncate">af {post.user.name}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}