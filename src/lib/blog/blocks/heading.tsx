import type { HeadingBlock as HeadingBlockType } from "../types";

interface Props {
    block: HeadingBlockType;
}

export function HeadingBlock({ block }: Props) {
    const styles: Record<number, string> = {
        1: "text-3xl font-bold mt-10 mb-4",
        2: "text-2xl font-semibold mt-8 mb-3",
        3: "text-xl font-semibold mt-6 mb-2",
        4: "text-lg font-medium mt-4 mb-2",
    };

    const className = styles[block.level];

    switch (block.level) {
        case 1:
            return <h1 className={className} dangerouslySetInnerHTML={{ __html: block.content }} />;
        case 2:
            return <h2 className={className} dangerouslySetInnerHTML={{ __html: block.content }} />;
        case 3:
            return <h3 className={className} dangerouslySetInnerHTML={{ __html: block.content }} />;
        case 4:
            return <h4 className={className} dangerouslySetInnerHTML={{ __html: block.content }} />;
        default:
            return <h2 className={className} dangerouslySetInnerHTML={{ __html: block.content }} />;
    }
}
