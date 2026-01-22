import { db } from "../src/lib/database";
import { blogCategory } from "../src/lib/database/schema";
import { nanoid } from "nanoid";

async function addCategories() {
    const categories = [
        {
            id: nanoid(),
            slug: "programowanie",
            nameEn: "Programming",
            namePl: "Programowanie",
            color: "#3b82f6",
        },
        {
            id: nanoid(),
            slug: "cpp",
            nameEn: "C++",
            namePl: "C++",
            color: "#00599c",
        },
    ];

    try {
        for (const category of categories) {
            // Check if category already exists
            const existing = await db
                .select()
                .from(blogCategory)
                .where((t) => t.slug === category.slug)
                .get();

            if (existing) {
                console.log(`✓ Category "${category.slug}" already exists`);
            } else {
                await db.insert(blogCategory).values(category);
                console.log(`✓ Added category: ${category.slug} (${category.namePl})`);
            }
        }

        console.log("\n✅ All categories added successfully!");
    } catch (error) {
        console.error("❌ Error adding categories:", error);
        process.exit(1);
    }
}

addCategories();
