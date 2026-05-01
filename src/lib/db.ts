import {PrismaClient} from "@prisma/client";

export const prisma = new PrismaClient();

// virkelig simpel, opretter bare en databaseforbindelse