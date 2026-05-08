import type {LikeService} from "@/services/likeService";
import {json, getSession, requireSession, handle, type BunRequest} from "@/routes/utils";

export function createLikeRoutes(likeService: LikeService) {
    return {
        "/api/users/:userId/likes": {
            GET: (req: BunRequest) => handle(async () => {
                return json(await likeService.getUserLikedPosts(req.params.userId));
            }),
        },

        // route handler for likes på et værk
        "/api/posts/:id/like": {
            GET: (req: BunRequest) => handle(async () => {
                const session = await getSession(req);
                return json(await likeService.getLikeStatus(session?.user.id ?? null, req.params.id));
            }),
            POST: (req: BunRequest) => handle(async () => {
                const session = await requireSession(req);
                const count = await likeService.likePost(session.user.id, req.params.id);
                return json({count, liked: true});
            }),
            DELETE: (req: BunRequest) => handle(async () => {
                const session = await requireSession(req);
                const count = await likeService.unlikePost(session.user.id, req.params.id);
                return json({count, liked: false});
            }),
        },
    };
}