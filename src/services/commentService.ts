import type {CommentRepository} from "@/repositories/commentRepository";
import {httpError} from "@/routes/utils";
import {isAdminUserId} from "@/lib/admin";

export class CommentService {
    constructor(private comments: CommentRepository) {}

    // videresende data til repository og opretter kommentar
    addComment(userId: string, postId: string, content: string) {
        return this.comments.create(userId, postId, content);
    }

    // henter alle kommentarer til et værk og videresender
    getPostComments(postId: string) {
        return this.comments.findByPostId(postId);
    }

    // sletter en kommentar
    async deleteComment(id: string, requestingUserId: string) {
        const comment = await this.comments.findById(id);
        if (!comment) throw httpError("Not found", 404);
        if (comment.userId !== requestingUserId && !isAdminUserId(requestingUserId)) throw httpError("Forbidden", 403);
        await this.comments.delete(id);
    }
}