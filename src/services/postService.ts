import type {PostRepository} from "@/repositories/postRepository";
import {uploadToBunny, deleteFromBunny} from "@/lib/bunny";
import {httpError} from "@/routes/utils";
import sharp from "sharp";

export class PostService {
    constructor(private posts: PostRepository) {
    }

    // opretter et nyt værk + compression
    async createPost(userId: string, title: string, description: string | undefined, fileBuffer: ArrayBuffer) {
        const compressed = await sharp(Buffer.from(fileBuffer))
            .rotate()
            .resize({width: 1920, withoutEnlargement: true})
            .jpeg({quality: 80})
            .toBuffer();
        const path = `posts/${crypto.randomUUID()}.jpg`;
        const imageUrl = await uploadToBunny(path, compressed);
        return this.posts.create({title, description, imageUrl, imagePath: path, userId});
    }

    // henter et værk via ID og videresender
    getPost(id: string) {
        return this.posts.findById(id);
    }

    // henter alle værk fra en bruger og videresender
    getUserPosts(userId: string) {
        return this.posts.findByUserId(userId);
    }

    // henter de nyeste værker og videresender
    getRecentPosts() {
        return this.posts.findRecent();
    }

    // opdaterer et værk
    async updatePost(id: string, requestingUserId: string, data: { title: string; description?: string }) {
        const post = await this.posts.findById(id);
        if (!post) throw httpError("Not found", 404);
        if (post.userId !== requestingUserId) throw httpError("Forbidden", 403);
        return this.posts.update(id, data);
    }

    // sletter et værk
    async deletePost(id: string, requestingUserId: string) {
        const post = await this.posts.findById(id);
        if (!post) throw httpError("Not found", 404);
        if (post.userId !== requestingUserId) throw httpError("Forbidden", 403);
        await deleteFromBunny(post.imagePath);
        await this.posts.delete(id);
    }
}