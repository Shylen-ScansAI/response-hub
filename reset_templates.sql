-- Clear all templates so that the app can re-seed them on next load
DELETE FROM public.favorites; -- Must delete favorites first due to FK constraint (if cascade is not set)
DELETE FROM public.templates;

-- NOTE: The app logic checks if (templatesData.length === 0) to trigger seeding.
-- By deleting all rows, we ensure the next refresh triggers the seed with the new initialData.js content.
