import type { ParagraphBlock as ParagraphBlockType } from "../types";

interface Props {
    block: ParagraphBlockType;
}

export function ParagraphBlock({ block }: Props) {
    return (
        <p
            className="text-base leading-7 text-foreground/90"
            dangerouslySetInnerHTML={{ __html: block.content }}
        />
    );
}
