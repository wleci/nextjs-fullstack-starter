import type { BlogPost, BlogCategory } from "./schema";

/**
 * Block types for blog content
 */
export type BlockType =
    | "paragraph"
    | "heading"
    | "code"
    | "image"
    | "quote"
    | "list"
    | "divider"
    | "callout"
    | "embed"
    | "table"
    | "quiz"
    | "flowchart"
    | "math"
    | "diff"
    | "terminal"
    | "api"
    | "filetree"
    | "banner"
    | "stats"
    | "comparison";

/**
 * Base block interface
 */
export interface BaseBlock {
    id: string;
    type: BlockType;
}

export interface ParagraphBlock extends BaseBlock {
    type: "paragraph";
    content: string;
}

export interface HeadingBlock extends BaseBlock {
    type: "heading";
    level: 1 | 2 | 3 | 4;
    content: string;
}

export interface CodeBlock extends BaseBlock {
    type: "code";
    language: string;
    code: string;
    filename?: string;
}

export interface ImageBlock extends BaseBlock {
    type: "image";
    src: string;
    alt: string;
    caption?: string;
}

export interface QuoteBlock extends BaseBlock {
    type: "quote";
    content: string;
    author?: string;
}

export interface ListBlock extends BaseBlock {
    type: "list";
    style: "ordered" | "unordered";
    items: string[];
}

export interface DividerBlock extends BaseBlock {
    type: "divider";
}

export interface CalloutBlock extends BaseBlock {
    type: "callout";
    variant: "info" | "warning" | "error" | "success";
    title?: string;
    content: string;
}

export interface EmbedBlock extends BaseBlock {
    type: "embed";
    url: string;
    provider?: "youtube" | "twitter" | "codepen" | "other";
}

/** Table column definition */
export interface TableColumn {
    key: string;
    header: string;
    color?: string;
}

export interface TableBlock extends BaseBlock {
    type: "table";
    columns: TableColumn[];
    rows: Record<string, string>[];
    striped?: boolean;
    caption?: string;
}

/** Quiz question */
export interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
}

export interface QuizBlock extends BaseBlock {
    type: "quiz";
    title: string;
    questions: QuizQuestion[];
}

/** Flowchart node */
export interface FlowchartNode {
    id: string;
    label: string;
    type?: "start" | "end" | "process" | "decision" | "data";
    color?: string;
}

/** Flowchart edge */
export interface FlowchartEdge {
    from: string;
    to: string;
    label?: string;
}

export interface FlowchartBlock extends BaseBlock {
    type: "flowchart";
    title?: string;
    nodes: FlowchartNode[];
    edges: FlowchartEdge[];
    direction?: "TB" | "LR";
}

/** Math block - LaTeX formulas */
export interface MathBlock extends BaseBlock {
    type: "math";
    formula: string;
    inline?: boolean;
    caption?: string;
}

/** Diff block - code comparison */
export interface DiffBlock extends BaseBlock {
    type: "diff";
    language?: string;
    before: string;
    after: string;
    filename?: string;
}

/** Terminal command */
export interface TerminalCommand {
    command: string;
    output?: string;
}

export interface TerminalBlock extends BaseBlock {
    type: "terminal";
    commands: TerminalCommand[];
    title?: string;
}

/** API parameter */
export interface ApiParam {
    name: string;
    type: string;
    required?: boolean;
    description?: string;
}

export interface ApiBlock extends BaseBlock {
    type: "api";
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    endpoint: string;
    description?: string;
    params?: ApiParam[];
    body?: string;
    response?: string;
}

/** File tree item */
export interface FileTreeItem {
    name: string;
    type: "file" | "folder";
    children?: FileTreeItem[];
    highlight?: boolean;
}

export interface FileTreeBlock extends BaseBlock {
    type: "filetree";
    title?: string;
    items: FileTreeItem[];
}

/** Banner/Alert block */
export interface BannerBlock extends BaseBlock {
    type: "banner";
    variant: "info" | "warning" | "error" | "success" | "update";
    title: string;
    content?: string;
    icon?: string;
}

/** Stat item */
export interface StatItem {
    value: string | number;
    label: string;
    prefix?: string;
    suffix?: string;
    color?: string;
}

export interface StatsBlock extends BaseBlock {
    type: "stats";
    items: StatItem[];
    columns?: 2 | 3 | 4;
}

/** Comparison block */
export interface ComparisonBlock extends BaseBlock {
    type: "comparison";
    leftTitle: string;
    rightTitle: string;
    leftItems: string[];
    rightItems: string[];
    leftColor?: string;
    rightColor?: string;
}

export type ContentBlock =
    | ParagraphBlock
    | HeadingBlock
    | CodeBlock
    | ImageBlock
    | QuoteBlock
    | ListBlock
    | DividerBlock
    | CalloutBlock
    | EmbedBlock
    | TableBlock
    | QuizBlock
    | FlowchartBlock
    | MathBlock
    | DiffBlock
    | TerminalBlock
    | ApiBlock
    | FileTreeBlock
    | BannerBlock
    | StatsBlock
    | ComparisonBlock;


/**
 * JSON format for creating/importing blog posts
 */
export interface BlogPostJSON {
    postId: string;
    translations: {
        locale: string;
        slug: string;
        title: string;
        excerpt?: string;
        content: ContentBlock[];
        categories?: string[];
        /** Custom badge text (e.g., "New", "Hot", "Tutorial") */
        badgeText?: string;
        /** Custom badge color (hex, e.g., "#ef4444") */
        badgeColor?: string;
    }[];
    coverImage?: string;
    featured?: boolean;
    published?: boolean;
    authorName?: string;
}

/**
 * Parsed blog post with content blocks
 */
export interface ParsedBlogPost extends Omit<BlogPost, "content" | "categories"> {
    content: ContentBlock[];
    categories: string[];
}

/**
 * Blog list response
 */
export interface BlogListResponse {
    posts: ParsedBlogPost[];
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
}

/**
 * Category with localized name
 */
export interface LocalizedCategory extends BlogCategory {
    name: string;
}
