import {useRef, useState} from "react";
import {Layout} from "@/components/Layout";
import {RequireAuth} from "@/components/RequireAuth";
import {useNavigate} from "react-router-dom";
import {useQueryClient} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "sonner";
import {ImagePlus, LoaderCircle} from "lucide-react";

export default function OpretVaerkSide() {
    return (
        <RequireAuth message="Du skal være logget ind for at oprette et værk.">
            {(session) => <OpretVaerkForm userId={session.user.id}/>}
        </RequireAuth>
    );
}

function OpretVaerkForm({userId}: { userId: string }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    // håndterer valget af billedfil
    const handleFileChange = (file: File | null) => {
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    // håndterer drag og drop af billeder
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file?.type.startsWith("image/")) handleFileChange(file);
    };

    // validerer formularen inden den sendes videre
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) return toast.error("Vælg et billede.");
        if (!title.trim()) return toast.error("Titel er påkrævet.");

        // sender formularen til serveren
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("title", title.trim());
            if (description.trim()) formData.append("description", description.trim());

            const res = await fetch("/api/posts", {method: "POST", body: formData});
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error ?? "Ukendt fejl");
            }
            const post = await res.json();
            queryClient.invalidateQueries({queryKey: ["posts"]});
            queryClient.invalidateQueries({queryKey: ["profile", userId]});
            toast.success("Værk oprettet!", {position: "top-center"});
            navigate(`/vaerk/${post.id}`);
        } catch (err: any) {
            toast.error(err.message ?? "Der skete en fejl.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout mainClass="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
            <h1 className="text-2xl font-bold sm:text-3xl">Opret nyt værk</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div
                    className="relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/40 bg-muted/30 transition-colors hover:border-muted-foreground/70"
                    onClick={() => fileInput.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    {preview ? (
                        <img src={preview} alt="Forhåndsvisning"
                             className="h-full w-full rounded-lg object-contain"/>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <ImagePlus className="size-10"/>
                            <span className="text-sm">Træk et billede her ind, eller klik for at vælge</span>
                        </div>
                    )}
                    <input
                        ref={fileInput}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Titel</label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Giv dit værk en titel"
                        maxLength={120}
                        required
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Beskrivelse <span
                        className="text-muted-foreground font-normal">(valgfri)</span></label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Fortæl lidt om dit værk"
                        rows={4}
                    />
                </div>
                <div className="flex gap-3">
                    <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                        {loading ? <LoaderCircle className="size-4 animate-spin"/> : null}
                        Opret værk
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate(`/profil/${userId}`)}>
                        Annuller
                    </Button>
                </div>
            </form>
        </Layout>
    );
}