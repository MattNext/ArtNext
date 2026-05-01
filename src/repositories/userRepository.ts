import type {PrismaClient} from "@prisma/client";

export class UserRepository {
    constructor(private db: PrismaClient) {
    }

    // finder en bruger via ID
    findById(id: string) {
        return this.db.user.findUnique({
            where: {id},
            select: {id: true, name: true},
        });
    }
}