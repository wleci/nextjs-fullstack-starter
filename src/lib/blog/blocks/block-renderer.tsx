import type { ContentBlock } from "../types";
import { ParagraphBlock } from "./paragraph";
import { HeadingBlock } from "./heading";
import { CodeBlock } from "./code";
import { ImageBlock } from "./image";
import { QuoteBlock } from "./quote";
import { ListBlock } from "./list";
import { DividerBlock } from "./divider";
import { CalloutBlock } from "./callout";
import { EmbedBlock } from "./embed";
import { TableBlock } from "./table";
import { QuizBlock } from "./quiz";
import { FlowchartBlock } from "./flowchart";
import { MathBlock } from "./math";
import { DiffBlock } from "./diff";
import { TerminalBlock } from "./terminal";
import { ApiBlock } from "./api";
import { FileTreeBlock } from "./filetree";
import { BannerBlock } from "./banner";
import { StatsBlock } from "./stats";
import { ComparisonBlock } from "./comparison";

interface Props {
    blocks: ContentBlock[];
}

export function BlockRenderer({ blocks }: Props) {
    return (
        <div className="prose prose-neutral dark:prose-invert max-w-none">
            {blocks.map((block) => {
                switch (block.type) {
                    case "paragraph":
                        return <ParagraphBlock key={block.id} block={block} />;
                    case "heading":
                        return <HeadingBlock key={block.id} block={block} />;
                    case "code":
                        return <CodeBlock key={block.id} block={block} />;
                    case "image":
                        return <ImageBlock key={block.id} block={block} />;
                    case "quote":
                        return <QuoteBlock key={block.id} block={block} />;
                    case "list":
                        return <ListBlock key={block.id} block={block} />;
                    case "divider":
                        return <DividerBlock key={block.id} />;
                    case "callout":
                        return <CalloutBlock key={block.id} block={block} />;
                    case "embed":
                        return <EmbedBlock key={block.id} block={block} />;
                    case "table":
                        return <TableBlock key={block.id} block={block} />;
                    case "quiz":
                        return <QuizBlock key={block.id} block={block} />;
                    case "flowchart":
                        return <FlowchartBlock key={block.id} block={block} />;
                    case "math":
                        return <MathBlock key={block.id} block={block} />;
                    case "diff":
                        return <DiffBlock key={block.id} block={block} />;
                    case "terminal":
                        return <TerminalBlock key={block.id} block={block} />;
                    case "api":
                        return <ApiBlock key={block.id} block={block} />;
                    case "filetree":
                        return <FileTreeBlock key={block.id} block={block} />;
                    case "banner":
                        return <BannerBlock key={block.id} block={block} />;
                    case "stats":
                        return <StatsBlock key={block.id} block={block} />;
                    case "comparison":
                        return <ComparisonBlock key={block.id} block={block} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
}
