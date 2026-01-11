import { nanoid } from "nanoid";
import type { BlogPostJSON } from "./types";

/**
 * ============================================
 * DOSTĘPNE BLOKI TREŚCI BLOGA
 * ============================================
 * 
 * 1. PARAGRAPH - zwykły tekst
 *    { id: "1", type: "paragraph", content: "Tekst z <strong>bold</strong> i <em>italic</em>" }
 * 
 * 2. HEADING - nagłówek (level: 1-4)
 *    { id: "2", type: "heading", level: 2, content: "Tytuł sekcji" }
 * 
 * 3. CODE - blok kodu z kolorowaniem składni
 *    { id: "3", type: "code", language: "typescript", code: "const x = 1;", filename: "example.ts" }
 * 
 * 4. IMAGE - obrazek
 *    { id: "4", type: "image", src: "/images/photo.jpg", alt: "Opis", caption: "Podpis" }
 * 
 * 5. QUOTE - cytat
 *    { id: "5", type: "quote", content: "Treść cytatu", author: "Autor" }
 * 
 * 6. LIST - lista (ordered/unordered)
 *    { id: "6", type: "list", style: "unordered", items: ["Punkt 1", "Punkt 2"] }
 * 
 * 7. DIVIDER - linia rozdzielająca
 *    { id: "7", type: "divider" }
 * 
 * 8. CALLOUT - wyróżniony blok (variant: info/warning/error/success)
 *    { id: "8", type: "callout", variant: "info", title: "Uwaga", content: "Treść" }
 * 
 * 9. EMBED - osadzenie (youtube/twitter/codepen)
 *    { id: "9", type: "embed", url: "https://youtube.com/watch?v=xxx", provider: "youtube" }
 * 
 * 10. TABLE - tabela z kolorowymi nagłówkami
 *     { id: "10", type: "table", 
 *       columns: [{ key: "name", header: "Nazwa", color: "#3b82f6" }],
 *       rows: [{ name: "wartość" }], 
 *       striped: true, caption: "Podpis" }
 * 
 * 11. QUIZ - interaktywny quiz
 *     { id: "11", type: "quiz", title: "Quiz", questions: [
 *       { question: "Pytanie?", options: ["A", "B", "C"], correctIndex: 1, explanation: "Wyjaśnienie" }
 *     ]}
 * 
 * 12. FLOWCHART - schemat blokowy (React Flow)
 *     { id: "12", type: "flowchart", title: "Schemat", direction: "TB",
 *       nodes: [
 *         { id: "start", label: "Start", type: "start", color: "#22c55e" },
 *         { id: "decision", label: "Tak?", type: "decision", color: "#f59e0b" },
 *         { id: "process", label: "Proces", type: "process", color: "#3b82f6" },
 *         { id: "end", label: "Koniec", type: "end", color: "#ef4444" }
 *       ],
 *       edges: [
 *         { from: "start", to: "decision" },
 *         { from: "decision", to: "process", label: "Tak" },
 *         { from: "process", to: "end" }
 *       ]}
 *     // node.type: start | end | process | decision | data
 *     // direction: TB (top-bottom) | LR (left-right)
 * 
 * 13. MATH - wzory matematyczne LaTeX
 *     { id: "13", type: "math", formula: "E = mc^2", caption: "Wzór Einsteina" }
 *     { id: "13b", type: "math", formula: "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}" }
 *     { id: "13c", type: "math", formula: "\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}" }
 * 
 * 14. DIFF - porównanie kodu przed/po
 *     { id: "14", type: "diff", filename: "config.ts",
 *       before: "const debug = false;\nconst env = 'dev';",
 *       after: "const debug = true;\nconst env = 'prod';" }
 * 
 * 15. TERMINAL - symulacja terminala
 *     { id: "15", type: "terminal", title: "Instalacja", commands: [
 *       { command: "npm install package", output: "added 1 package" },
 *       { command: "npm run build", output: "Build completed!" }
 *     ]}
 * 
 * 16. API - dokumentacja endpointu
 *     { id: "16", type: "api", method: "POST", endpoint: "/api/users",
 *       description: "Tworzy nowego użytkownika",
 *       params: [{ name: "name", type: "string", required: true, description: "Imię" }],
 *       body: '{ "name": "Jan", "email": "jan@example.com" }',
 *       response: '{ "id": "1", "name": "Jan" }' }
 *     // method: GET | POST | PUT | PATCH | DELETE
 * 
 * 17. FILETREE - struktura plików
 *     { id: "17", type: "filetree", title: "Projekt", items: [
 *       { name: "src", type: "folder", children: [
 *         { name: "index.ts", type: "file", highlight: true },
 *         { name: "utils", type: "folder", children: [
 *           { name: "helpers.ts", type: "file" }
 *         ]}
 *       ]},
 *       { name: "package.json", type: "file" }
 *     ]}
 * 
 * 18. BANNER - alert/powiadomienie
 *     { id: "18", type: "banner", variant: "warning", title: "Uwaga!", content: "Treść alertu" }
 *     // variant: info | warning | error | success | update
 * 
 * 19. STATS - statystyki z animacją
 *     { id: "19", type: "stats", columns: 3, items: [
 *       { value: 1000, label: "Użytkowników", prefix: "", suffix: "+", color: "#3b82f6" },
 *       { value: 99.9, label: "Dostępność", suffix: "%", color: "#22c55e" },
 *       { value: "24", label: "Wsparcie", suffix: "/7" }
 *     ]}
 *     // columns: 2 | 3 | 4
 * 
 * 20. COMPARISON - porównanie dwóch opcji
 *     { id: "20", type: "comparison",
 *       leftTitle: "Bez rozwiązania", rightTitle: "Z rozwiązaniem",
 *       leftItems: ["Ręczna praca", "Błędy", "Wolno"],
 *       rightItems: ["Automatyzacja", "Niezawodność", "Szybko"],
 *       leftColor: "#ef4444", rightColor: "#22c55e" }
 */

export function generateExampleJSON(): BlogPostJSON {
    return {
        postId: nanoid(8),
        translations: [
            {
                locale: "pl",
                slug: "przykladowy-post",
                title: "Przykładowy wpis - wszystkie bloki",
                excerpt: "Demonstracja wszystkich dostępnych bloków treści.",
                content: [
                    // Banner na górze
                    { id: "1", type: "banner", variant: "info", title: "Przykładowy artykuł", content: "Ten post pokazuje wszystkie dostępne bloki treści." },

                    // Nagłówek i paragraf
                    { id: "2", type: "heading", level: 2, content: "Podstawowe bloki" },
                    { id: "3", type: "paragraph", content: "To jest zwykły paragraf z <strong>pogrubieniem</strong>, <em>kursywą</em> i <a href='#'>linkiem</a>." },

                    // Lista
                    { id: "4", type: "list", style: "unordered", items: ["Pierwszy punkt", "Drugi punkt", "Trzeci punkt"] },

                    // Cytat
                    { id: "5", type: "quote", content: "Prostota jest szczytem wyrafinowania.", author: "Leonardo da Vinci" },

                    // Callout
                    { id: "6", type: "callout", variant: "warning", title: "Ważne", content: "Pamiętaj o zapisaniu zmian przed zamknięciem." },

                    // Divider
                    { id: "7", type: "divider" },

                    // Kod
                    { id: "8", type: "heading", level: 2, content: "Bloki techniczne" },
                    { id: "9", type: "code", language: "typescript", filename: "example.ts", code: "interface User {\n  id: string;\n  name: string;\n  email: string;\n}\n\nconst getUser = async (id: string): Promise<User> => {\n  const response = await fetch(`/api/users/${id}`);\n  return response.json();\n};" },

                    // Terminal
                    {
                        id: "10", type: "terminal", title: "Instalacja projektu", commands: [
                            { command: "git clone https://github.com/user/repo.git" },
                            { command: "cd repo && npm install", output: "added 150 packages in 12s" },
                            { command: "npm run dev", output: "Server running at http://localhost:3000" }
                        ]
                    },

                    // Diff
                    { id: "11", type: "diff", filename: "config.ts", before: "export const config = {\n  debug: false,\n  apiUrl: 'http://localhost:3000',\n  timeout: 5000\n};", after: "export const config = {\n  debug: true,\n  apiUrl: 'https://api.example.com',\n  timeout: 10000,\n  retries: 3\n};" },

                    // API
                    {
                        id: "12", type: "api", method: "POST", endpoint: "/api/users", description: "Tworzy nowego użytkownika w systemie.", params: [
                            { name: "name", type: "string", required: true, description: "Imię użytkownika" },
                            { name: "email", type: "string", required: true, description: "Adres email" },
                            { name: "role", type: "string", required: false, description: "Rola (domyślnie: user)" }
                        ], body: "{\n  \"name\": \"Jan Kowalski\",\n  \"email\": \"jan@example.com\",\n  \"role\": \"admin\"\n}", response: "{\n  \"id\": \"usr_123\",\n  \"name\": \"Jan Kowalski\",\n  \"email\": \"jan@example.com\",\n  \"role\": \"admin\",\n  \"createdAt\": \"2026-01-11T12:00:00Z\"\n}"
                    },

                    // File Tree
                    {
                        id: "13", type: "filetree", title: "Struktura projektu", items: [
                            {
                                name: "src", type: "folder", children: [
                                    {
                                        name: "app", type: "folder", children: [
                                            { name: "page.tsx", type: "file", highlight: true },
                                            { name: "layout.tsx", type: "file" }
                                        ]
                                    },
                                    {
                                        name: "components", type: "folder", children: [
                                            {
                                                name: "ui", type: "folder", children: [
                                                    { name: "button.tsx", type: "file" },
                                                    { name: "input.tsx", type: "file" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        name: "lib", type: "folder", children: [
                                            { name: "utils.ts", type: "file" }
                                        ]
                                    }
                                ]
                            },
                            { name: "package.json", type: "file" },
                            { name: "tsconfig.json", type: "file" }
                        ]
                    },

                    // Math
                    { id: "14", type: "heading", level: 2, content: "Wzory matematyczne" },
                    { id: "15", type: "math", formula: "E = mc^2", caption: "Równoważność masy i energii" },
                    { id: "16", type: "math", formula: "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}", caption: "Suma ciągu arytmetycznego" },
                    { id: "17", type: "math", formula: "\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}" },

                    // Tabela
                    { id: "18", type: "heading", level: 2, content: "Dane i statystyki" },
                    {
                        id: "19", type: "table", columns: [
                            { key: "feature", header: "Funkcja", color: "#3b82f6" },
                            { key: "free", header: "Darmowy", color: "#22c55e" },
                            { key: "pro", header: "Pro", color: "#f59e0b" }
                        ], rows: [
                            { feature: "Użytkownicy", free: "10", pro: "Bez limitu" },
                            { feature: "Projekty", free: "3", pro: "Bez limitu" },
                            { feature: "Wsparcie", free: "Email", pro: "24/7 Chat" },
                            { feature: "API", free: "1000 req/dzień", pro: "Bez limitu" }
                        ], striped: true, caption: "Porównanie planów"
                    },

                    // Stats
                    {
                        id: "20", type: "stats", columns: 4, items: [
                            { value: 10000, label: "Użytkowników", suffix: "+", color: "#3b82f6" },
                            { value: 99.9, label: "Dostępność", suffix: "%", color: "#22c55e" },
                            { value: 50, label: "Krajów", color: "#8b5cf6" },
                            { value: 24, label: "Wsparcie", suffix: "/7", color: "#f59e0b" }
                        ]
                    },

                    // Comparison
                    {
                        id: "21", type: "comparison", leftTitle: "Tradycyjne podejście", rightTitle: "Nowoczesne rozwiązanie", leftItems: [
                            "Ręczna konfiguracja",
                            "Długi czas wdrożenia",
                            "Trudne skalowanie",
                            "Wysokie koszty utrzymania"
                        ], rightItems: [
                            "Automatyczna konfiguracja",
                            "Szybkie wdrożenie",
                            "Łatwe skalowanie",
                            "Niskie koszty utrzymania"
                        ], leftColor: "#ef4444", rightColor: "#22c55e"
                    },

                    // Flowchart
                    { id: "22", type: "heading", level: 2, content: "Schemat procesu" },
                    {
                        id: "23", type: "flowchart", title: "Proces rejestracji", direction: "TB", nodes: [
                            { id: "start", label: "Start", type: "start", color: "#22c55e" },
                            { id: "form", label: "Formularz", type: "process", color: "#3b82f6" },
                            { id: "validate", label: "Walidacja", type: "decision", color: "#f59e0b" },
                            { id: "error", label: "Błąd", type: "process", color: "#ef4444" },
                            { id: "save", label: "Zapis", type: "data", color: "#8b5cf6" },
                            { id: "end", label: "Koniec", type: "end", color: "#22c55e" }
                        ], edges: [
                            { from: "start", to: "form" },
                            { from: "form", to: "validate" },
                            { from: "validate", to: "error", label: "Nie" },
                            { from: "validate", to: "save", label: "Tak" },
                            { from: "error", to: "form" },
                            { from: "save", to: "end" }
                        ]
                    },

                    // Quiz
                    { id: "24", type: "heading", level: 2, content: "Sprawdź swoją wiedzę" },
                    {
                        id: "25", type: "quiz", title: "Quiz o TypeScript", questions: [
                            { question: "Czym jest TypeScript?", options: ["Bazą danych", "Nadzbiorem JavaScript z typami", "Frameworkiem CSS"], correctIndex: 1, explanation: "TypeScript to język programowania będący nadzbiorem JavaScript, dodający statyczne typowanie." },
                            { question: "Jak zdefiniować typ w TypeScript?", options: ["type Name = string", "var Name: string", "define Name as string"], correctIndex: 0, explanation: "Słowo kluczowe 'type' służy do definiowania aliasów typów." },
                            { question: "Co oznacza '?' przy właściwości?", options: ["Właściwość wymagana", "Właściwość opcjonalna", "Właściwość tylko do odczytu"], correctIndex: 1, explanation: "Znak zapytania oznacza, że właściwość jest opcjonalna i może być undefined." }
                        ]
                    }
                ],
                categories: ["tutorial", "dokumentacja"],
                badgeText: "Kompletny przewodnik",
                badgeColor: "#8b5cf6",
            },
            {
                locale: "en",
                slug: "example-post",
                title: "Example post - all blocks",
                excerpt: "Demonstration of all available content blocks.",
                content: [
                    { id: "1", type: "banner", variant: "info", title: "Example article", content: "This post shows all available content blocks." },
                    { id: "2", type: "heading", level: 2, content: "Basic blocks" },
                    { id: "3", type: "paragraph", content: "This is a regular paragraph with <strong>bold</strong>, <em>italic</em> and <a href='#'>link</a>." },
                    { id: "4", type: "list", style: "unordered", items: ["First item", "Second item", "Third item"] },
                    { id: "5", type: "quote", content: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
                    { id: "6", type: "callout", variant: "warning", title: "Important", content: "Remember to save changes before closing." },
                    { id: "7", type: "divider" },
                    { id: "8", type: "heading", level: 2, content: "Technical blocks" },
                    { id: "9", type: "code", language: "typescript", filename: "example.ts", code: "const greeting = 'Hello World';" },
                    {
                        id: "10", type: "terminal", title: "Installation", commands: [
                            { command: "npm install", output: "added 150 packages" }
                        ]
                    },
                    {
                        id: "11", type: "stats", columns: 3, items: [
                            { value: 10000, label: "Users", suffix: "+", color: "#3b82f6" },
                            { value: 99.9, label: "Uptime", suffix: "%", color: "#22c55e" },
                            { value: 24, label: "Support", suffix: "/7", color: "#f59e0b" }
                        ]
                    }
                ],
                categories: ["tutorial", "documentation"],
                badgeText: "Complete guide",
                badgeColor: "#8b5cf6",
            },
        ],
        coverImage: "/images/blog/example.jpg",
        featured: true,
        published: true,
        authorName: "Admin",
    };
}
