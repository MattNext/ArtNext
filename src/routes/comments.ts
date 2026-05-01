import type {CommentService} from "@/services/commentService";
import {createCommentZod} from "@/lib/zod";
import {json, requireSession, handle, httpError, type BunRequest} from "@/routes/utils";

export function createCommentRoutes(commentService: CommentService) {
    return {
        // route handler for kommentarer på et værk
        "/api/posts/:id/comments": {
            GET: (req: BunRequest) => handle(async () => json(await commentService.getPostComments(req.params.id))),
            POST: (req: BunRequest) => handle(async () => {
                const session = await requireSession(req);
                const body = await req.json();
                const parsed = createCommentZod.safeParse(body);
                if (!parsed.success) throw httpError(parsed.error.issues[0]?.message ?? "Ugyldigt input", 400);
                const comment = await commentService.addComment(session.user.id, req.params.id, parsed.data.content);
                return json(comment, 201);
            }),
        },

        // sletter en kommentar
        "/api/comments/:id": {
            DELETE: (req: BunRequest) => handle(async () => {
                const session = await requireSession(req);
                await commentService.deleteComment(req.params.id, session.user.id);
                return new Response(null, {status: 204});
            }),
        },
    };
}