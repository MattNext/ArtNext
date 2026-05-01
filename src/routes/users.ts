import type {UserService} from "@/services/userService";
import {json, handle, httpError, type BunRequest} from "@/routes/utils";

export function createUserRoutes(userService: UserService) {
    return {
        // finder/henter en bruger via ID
        "/api/users/:userId": {
            GET: (req: BunRequest) => handle(async () => {
                const user = await userService.getUser(req.params.userId);
                if (!user) throw httpError("Not found", 404);
                return json(user);
            }),
        },
    };
}