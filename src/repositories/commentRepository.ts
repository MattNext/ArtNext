import type {PrismaClient} from "@prisma/client";

export class CommentRepository {
    constructor(private db: PrismaClient) {}

    // opretter en ny kommentar i databasen
    create(userId: string, postId: string, content: string) {
        return this.db.comment.create({
            data: {userId, postId, content},
            include: {user: {select: {id: true, name: true}}},
        });
    }

    // henter alle kommentarer til det pågældende værk
    findByPostId(postId: string) {
        return this.db.comment.findMany({
            where: {postId},
            orderBy: {createdAt: "asc"},
            include: {user: {select: {id: true, name: true}}},
        });
    }

    // finder en bestemt kommentar via ID
    findById(id: string) {
        return this.db.comment.findUnique({where: {id}});
    }

    // sletter en bestemt kommentar via ID
    delete(id: string) {
        return this.db.comment.delete({where: {id}});
    }
}