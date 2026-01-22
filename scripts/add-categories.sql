-- Dodaj kategorie bloga
INSERT OR IGNORE INTO blog_category (id, slug, name_en, name_pl, color)
VALUES 
    ('cat_programowanie', 'programowanie', 'Programming', 'Programowanie', '#3b82f6'),
    ('cat_cpp', 'cpp', 'C++', 'C++', '#00599c');

-- Sprawdź dodane kategorie
SELECT * FROM blog_category;
