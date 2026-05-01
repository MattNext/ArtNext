import type {PrismaClient} from "@prisma/client";

export class PostRepository {
    constructor(private db: PrismaClient) {
    }

    // opretter nyt værk i databasen med titel, beskrivelse osv
    create(data: { title: string; description?: string; imageUrl: string; imagePath: string; userId: string }) {
        return this.db.post.create({data});
    }

    // finder et værk via ID
    findById(id: string) {
        return this.db.post.findUnique({
            where: {id},
            include: {user: {select: {id: true, name: true}}},
        });
    }

    // henter alle værk fra en bestemt bruger
    findByUserId(userId: string) {
        return this.db.post.findMany({
            where: {userId},
            orderBy: {createdAt: "desc"},
            include: {user: {select: {id: true, name: true}}},
        });
    }

    // opdaterer titel og beskrivelse på eksisterende værk
    update(id: string, data: {title: string; description?: string}) {
        return this.db.post.update({where: {id}, data});
    }

    // sletter et værk fra databasen
    delete(id: string) {
        return this.db.post.delete({where: {id}});
    }

    // henter op til 50 nyeste værk
    findRecent(limit = 50) {
        return this.db.post.findMany({
            orderBy: {createdAt: "desc"},
            take: limit,
            include: {user: {select: {id: true, name: true}}},
        });
    }
}