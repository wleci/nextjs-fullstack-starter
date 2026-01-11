import type { ListBlock as ListBlockType } from "../types";

interface Props {
    block: ListBlockType;
}

export function ListBlock({ block }: Props) {
    const Tag = block.style === "ordered" ? "ol" : "ul";
    const listStyle = block.style === "ordered" ? "list-decimal" : "list-disc";

    return (
        <Tag className={`my-4 ml-6 ${listStyle} space-y-2`}>
            {block.items.map((item, index) => (
                <li
                    key={index}
                    className="text-foreground/90"
                    dangerouslySetInnerHTML={{ __html: item }}
                />
            ))}
        </Tag>
    );
}
