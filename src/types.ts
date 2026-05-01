import {authClient} from "@/lib/auth-client";

export type Author = { id: string; name: string };
export type Vaerk = { id: string; title: string; description?: string; imageUrl: string; createdAt: string; user: Author };
export type Comment = { id: string; content: string; createdAt: string; user: Author };
export type LikeData = { count: number; liked: boolean };

export type BunRequest = Request & { params: Record<string, string> };

export type Session = ReturnType<typeof authClient.useSession>["data"];

export type LogoutDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export interface SletVaerkKnapProps {
    vaerkId: string;
    uploaderId: string;
}

// det her er et centralt type register for hele hjemmesiden