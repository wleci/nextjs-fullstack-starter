/* eslint-disable @next/next/no-img-element */
import type { ImageBlock as ImageBlockType } from "../types";

interface Props {
    block: ImageBlockType;
}

export function ImageBlock({ block }: Props) {
    return (
        <figure className="my-8">
            <img
                src={block.src}
                alt={block.alt}
                className="w-full rounded-lg"
                loading="lazy"
            />
            {block.caption && (
                <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                    {block.caption}
                </figcaption>
            )}
        </figure>
    );
}
