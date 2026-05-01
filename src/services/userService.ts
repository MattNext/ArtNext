import type {UserRepository} from "@/repositories/userRepository";

export class UserService {
    constructor(private users: UserRepository) {
    }

    // henter en bruger via ID og videresender
    getUser(id: string) {
        return this.users.findById(id);
    }
}