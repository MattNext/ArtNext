import type {LikeRepository} from "@/repositories/likeRepository";
import {httpError} from "@/routes/utils";

export class LikeService {
    constructor(private likes: LikeRepository) {}

    // liker et værk
    async likePost(userId: string, postId: string) {
        const existing = await this.likes.findByUserAndPost(userId, postId);
        if (existing) throw httpError("Allerede liket", 409);
        await this.likes.create(userId, postId);
        return this.likes.countByPostId(postId);
    }

    // fjerner et like
    async unlikePost(userId: string, postId: string) {
        const existing = await this.likes.findByUserAndPost(userId, postId);
        if (!existing) throw httpError("Ikke liket", 404);
        await this.likes.delete(userId, postId);
        return this.likes.countByPostId(postId);
    }

    // henter like status for et værk
    async getLikeStatus(userId: string | null, postId: string) {
        const [count, liked] = await Promise.all([
            this.likes.countByPostId(postId),
            userId ? this.likes.findByUserAndPost(userId, postId) : null,
        ]);
        return {count, liked: !!liked};
    }
}