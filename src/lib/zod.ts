import {z} from "zod";

const postFields = {
    title: z.string().trim().min(1, "Titel påkrævet").max(100, "Titel for lang"),
    description: z.string().trim().max(1000, "Beskrivelse for lang").optional(),
};

export const createPostZod = z.object({
    ...postFields,
    image: z.instanceof(File, {message: "Billede påkrævet"})
        .refine((f) => f.size > 0, "Billede påkrævet")
        .refine((f) => f.size <= 20 * 1024 * 1024, "Billede maks 20 MB")
        .refine((f) => f.type.startsWith("image/"), "Filen skal være et billede"),
});

export const updatePostZod = z.object(postFields);

export const createCommentZod = z.object({
    content: z.string().trim().min(1, "Kommentar påkrævet").max(500, "Kommentar for lang"),
});

// definierer forskellige valideringsregler for formularer med Zod