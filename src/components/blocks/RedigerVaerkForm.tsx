import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "sonner";
import type {Vaerk} from "@/types";

export function RedigerVaerkForm({vaerk, onSave, onCancel}: {
    vaerk: Vaerk;
    onSave: (updated: Vaerk) => void;
    onCancel: () => void;
}) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formD = new FormData(e.currentTarget);
        const response = await fetch(`/api/posts/${vaerk.id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                title: String(formD.get("title")).trim(),
                description: String(formD.get("description")).trim() || undefined,
            }),
        });
        const data = await response.json();
        if (!response.ok) return toast.error(data.error || "Kunne ikke opdatere værket.");
        onSave({...vaerk, ...data});
        toast.success("Værk opdateret.");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input name="title" defaultValue={vaerk.title} required maxLength={100} className="text-xl font-bold"/>
            <Textarea name="description" defaultValue={vaerk.description ?? ""} maxLength={1000} rows={4}
                      placeholder="Beskrivelse"/>
            <div className="flex gap-2">
                <Button type="submit">Gem</Button>
                <Button type="button" variant="ghost" onClick={onCancel}>Annuller</Button>
            </div>
        </form>
    );
}