import type { EmbedBlock as EmbedBlockType } from "../types";

interface Props {
    block: EmbedBlockType;
}

function getYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
}

export function EmbedBlock({ block }: Props) {
    if (block.provider === "youtube") {
        const videoId = getYouTubeId(block.url);
        if (videoId) {
            return (
                <div className="my-8 aspect-video">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        className="w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );
        }
    }

    return (
        <div className="my-8">
            <a
                href={block.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
            >
                {block.url}
            </a>
        </div>
    );
}
