import type { QuoteBlock as QuoteBlockType } from "../types";

interface Props {
    block: QuoteBlockType;
}

export function QuoteBlock({ block }: Props) {
    return (
        <blockquote className="my-6 border-l-4 border-primary pl-6 italic">
            <p
                className="text-lg text-foreground/80"
                dangerouslySetInnerHTML={{ __html: block.content }}
            />
            {block.author && (
                <footer className="mt-2 text-sm text-muted-foreground">
                    — {block.author}
                </footer>
            )}
        </blockquote>
    );
}
