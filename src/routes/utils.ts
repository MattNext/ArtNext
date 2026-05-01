import {auth} from "@/lib/auth";
export type {BunRequest} from "@/types";

// pakker data ind som JSON
export function json(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {"Content-Type": "application/json"},
    });
}

// henter den aktuelle session fra better auth
export function getSession(req: Request) {
    return auth.api.getSession({headers: req.headers});
}

// opretter en fejl med http statuskode
export function httpError(message: string, status: number) {
    return Object.assign(new Error(message), {status});
}

// kræver at brugeren er logget ind
export async function requireSession(req: Request) {
    const session = await getSession(req);
    if (!session) throw httpError("Unauthorized", 401);
    return session;
}

// håndterer fejl for alle route handlers
export async function handle(fn: () => Promise<Response>): Promise<Response> {
    try {
        return await fn();
    } catch (err: any) {
        return json({error: err.message ?? "Server error"}, err.status ?? 500);
    }
}