import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {formatDistanceToNow} from "date-fns";
import {da} from "date-fns/locale";

export function TidsstempelTooltip({dato}: { dato: string }) {
    const date = new Date(dato);
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="text-xs text-muted-foreground cursor-default shrink-0 self-start">
                        {formatDistanceToNow(date, {addSuffix: true, locale: da})}
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    {date.toLocaleString("da-DK", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}