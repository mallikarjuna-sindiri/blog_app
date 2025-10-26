// Canonical list of categories used for creating and filtering articles
// Includes requested categories plus legacy ones to keep compatibility
export const CATEGORIES = [
  'Technology',
  'Science & Innovation',
  'Health & Fitness',
  'Lifestyle',
  'Travel & Adventure',
  'Food & Recipes',
  'Education & Learning',
  'Business & Finance',
  'Entertainment & Movies',
  'Music & Arts',
  'Sports',
  'Personal Growth & Motivation',
  'Fashion & Beauty',
  'Environment & Nature',
  'Politics & Current Affairs',
  'Gaming',
  'Books & Literature',
  'Photography',
  'DIY & Crafts',
  // Legacy categories (existing articles may use these)
  'programming',
  'AI&ML',
  'database'
].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

