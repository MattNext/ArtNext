import type {PrismaClient} from "@prisma/client";

export class LikeRepository {
    constructor(private db: PrismaClient) {
    }

    // opretter et like i databasen
    create(userId: string, postId: string) {
        return this.db.like.create({data: {userId, postId}});
    }

    // sletter et like fra databasen
    delete(userId: string, postId: string) {
        return this.db.like.delete({where: {userId_postId: {userId, postId}}});
    }

    // tæller hvor mange likes et bestemt værk har
    countByPostId(postId: string) {
        return this.db.like.count({where: {postId}});
    }

    // finder et bestemt like (bruges til at tjekke om brugeren allerede har liket et værk)
    findByUserAndPost(userId: string, postId: string) {
        return this.db.like.findUnique({where: {userId_postId: {userId, postId}}});
    }
}