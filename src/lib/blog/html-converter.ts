import { nanoid } from "nanoid";
import type { ContentBlock } from "./types";

/**
 * Converts HTML from WYSIWYG editor to ContentBlock array
 */
export function htmlToContentBlocks(html: string): ContentBlock[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const blocks: ContentBlock[] = [];

    const processNode = (node: ChildNode) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent?.trim();
            if (text) {
                blocks.push({
                    id: nanoid(8),
                    type: "paragraph",
                    content: text,
                });
            }
            return;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return;

        const element = node as HTMLElement;
        const tagName = element.tagName.toLowerCase();

        switch (tagName) {
            case "h1":
            case "h2":
            case "h3":
            case "h4":
                blocks.push({
                    id: nanoid(8),
                    type: "heading",
                    level: parseInt(tagName[1]) as 1 | 2 | 3 | 4,
                    content: element.textContent || "",
                });
                break;

            case "p":
                const content = element.innerHTML.trim();
                if (content) {
                    blocks.push({
                        id: nanoid(8),
                        type: "paragraph",
                        content,
                    });
                }
                break;

            case "blockquote":
                blocks.push({
                    id: nanoid(8),
                    type: "quote",
                    content: element.textContent || "",
                });
                break;

            case "ul":
                const ulItems: string[] = [];
                element.querySelectorAll("li").forEach((li) => {
                    ulItems.push(li.textContent || "");
                });
                if (ulItems.length > 0) {
                    blocks.push({
                        id: nanoid(8),
                        type: "list",
                        style: "unordered",
                        items: ulItems,
                    });
                }
                break;

            case "ol":
                const olItems: string[] = [];
                element.querySelectorAll("li").forEach((li) => {
                    olItems.push(li.textContent || "");
                });
                if (olItems.length > 0) {
                    blocks.push({
                        id: nanoid(8),
                        type: "list",
                        style: "ordered",
                        items: olItems,
                    });
                }
                break;

            case "pre":
                const codeElement = element.querySelector("code");
                const code = codeElement?.textContent || element.textContent || "";
                const languageClass = codeElement?.className.match(/language-(\w+)/);
                const language = languageClass ? languageClass[1] : "plaintext";

                blocks.push({
                    id: nanoid(8),
                    type: "code",
                    language,
                    code,
                });
                break;

            case "img":
                blocks.push({
                    id: nanoid(8),
                    type: "image",
                    src: element.getAttribute("src") || "",
                    alt: element.getAttribute("alt") || "",
                });
                break;

            case "hr":
                blocks.push({
                    id: nanoid(8),
                    type: "divider",
                });
                break;

            default:
                // Process children for other elements
                Array.from(element.childNodes).forEach(processNode);
                break;
        }
    };

    Array.from(doc.body.childNodes).forEach(processNode);

    return blocks;
}

/**
 * Converts ContentBlock array to HTML for WYSIWYG editor
 */
export function contentBlocksToHtml(blocks: ContentBlock[]): string {
    const htmlParts: string[] = [];

    blocks.forEach((block) => {
        switch (block.type) {
            case "paragraph":
                htmlParts.push(`<p>${block.content}</p>`);
                break;

            case "heading":
                htmlParts.push(`<h${block.level}>${block.content}</h${block.level}>`);
                break;

            case "code":
                htmlParts.push(
                    `<pre><code class="language-${block.language}">${escapeHtml(block.code)}</code></pre>`
                );
                break;

            case "image":
                htmlParts.push(`<img src="${block.src}" alt="${block.alt}" />`);
                break;

            case "quote":
                htmlParts.push(`<blockquote>${block.content}</blockquote>`);
                break;

            case "list":
                const tag = block.style === "ordered" ? "ol" : "ul";
                const items = block.items.map((item) => `<li>${item}</li>`).join("");
                htmlParts.push(`<${tag}>${items}</${tag}>`);
                break;

            case "divider":
                htmlParts.push("<hr />");
                break;

            case "callout":
                htmlParts.push(
                    `<div class="callout callout-${block.variant}">` +
                    (block.title ? `<strong>${block.title}</strong>: ` : "") +
                    `${block.content}</div>`
                );
                break;

            // For complex blocks, add a placeholder comment
            default:
                htmlParts.push(
                    `<!-- ${block.type} block (ID: ${block.id}) - edit in JSON mode for full control -->`
                );
                break;
        }
    });

    return htmlParts.join("\n");
}

function escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
