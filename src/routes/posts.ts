import type {PostService} from "@/services/postService";
import {createPostZod, updatePostZod} from "@/lib/zod.ts";
import {json, requireSession, handle, httpError, type BunRequest} from "@/routes/utils";

export function createPostRoutes(postService: PostService) {
    return {
        // route handler for værker
        "/api/posts": {
            GET: () => handle(async () => json(await postService.getRecentPosts())),
            POST: (req: Request) => handle(async () => {
                const session = await requireSession(req);
                const formData = await req.formData();
                const parsed = createPostZod.safeParse({
                    title: formData.get("title"),
                    description: formData.get("description") || undefined,
                    image: formData.get("image"),
                });
                if (!parsed.success) throw httpError(parsed.error.issues[0]?.message ?? "Ugyldigt input", 400);

                const {title, description, image} = parsed.data;
                const buffer = await image.arrayBuffer();
                const post = await postService.createPost(session.user.id, title, description, buffer, image.type);
                return json(post, 201);
            }),
        },

        // henter værker fra en bestemt bruger
        "/api/posts/user/:userId": {
            GET: (req: BunRequest) => handle(async () => json(await postService.getUserPosts(req.params.userId))),
        },

        // route handler for et bestemt værk
        "/api/posts/:id": {
            GET: (req: BunRequest) => handle(async () => {
                const post = await postService.getPost(req.params.id);
                if (!post) throw httpError("Not found", 404);
                return json(post);
            }),
            PATCH: (req: BunRequest) => handle(async () => {
                const session = await requireSession(req);
                const body = await req.json();
                const parsed = updatePostZod.safeParse(body);
                if (!parsed.success) throw httpError(parsed.error.issues[0]?.message ?? "Ugyldigt input", 400);
                return json(await postService.updatePost(req.params.id, session.user.id, parsed.data));
            }),
            DELETE: (req: BunRequest) => handle(async () => {
                const session = await requireSession(req);
                await postService.deletePost(req.params.id, session.user.id);
                return new Response(null, {status: 204});
            }),
        },
    };
}