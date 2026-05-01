import {serve} from "bun";
import {readdirSync} from "fs";
import {auth} from "./lib/auth";
import index from "./index.html";
import robotsTxt from "./static/robots.txt" with {type: "text"};
import {prisma} from "./lib/db";
import {PostRepository} from "./repositories/postRepository";
import {PostService} from "./services/postService";
import {createPostRoutes} from "./routes/posts";
import {UserRepository} from "./repositories/userRepository";
import {UserService} from "./services/userService";
import {createUserRoutes} from "./routes/users";
import {LikeRepository} from "./repositories/likeRepository";
import {LikeService} from "./services/likeService";
import {createLikeRoutes} from "./routes/likes";
import {CommentRepository} from "./repositories/commentRepository";
import {CommentService} from "./services/commentService";
import {createCommentRoutes} from "./routes/comments";

// fikser at billeder fra assets mappen ikke bliver loadet ind korrekt, når man kører bun run build og bun run start
function billedeRoutes(): Record<string, () => Response> {
    if (process.env.NODE_ENV !== "production") return {};
    return Object.fromEntries(
        readdirSync(".")
            .filter(n => /\.(jpe?g|png|ico)$/i.test(n))
            .map(n => ["/" + n, () => new Response(Bun.file(n))]),
    );
}

// definierer de forskellige "lag" som der taler med hinanden (route -> service -> repo -> database)
const postRepo = new PostRepository(prisma);
const postService = new PostService(postRepo);
const userRepo = new UserRepository(prisma);
const userService = new UserService(userRepo);
const likeRepo = new LikeRepository(prisma);
const likeService = new LikeService(likeRepo);
const commentRepo = new CommentRepository(prisma);
const commentService = new CommentService(commentRepo);

const server = serve({
    routes: {
        "/api/auth/*": auth.handler,
        // tilføjer alle route handler til serveren gennem spread, som fletter routes sammen
        ...createPostRoutes(postService),
        ...createUserRoutes(userService),
        ...createLikeRoutes(likeService),
        ...createCommentRoutes(commentService),

        // fortæller clankers at de ikke er velkomne
        "/robots.txt": new Response(robotsTxt, {headers: {"Content-Type": "text/plain"}}),

        // serverer billedfiler (fiksede en irriterende bug ARRGHH)
        ...billedeRoutes(),

        "/*": index,
    },

    development: process.env.NODE_ENV !== "production" && {
        // Enable browser hot reloading in development
        hmr: true,

        // Echo console logs from the browser to the server
        console: true,
    },
});

console.log(`🚀 Server running at ${server.url}`);