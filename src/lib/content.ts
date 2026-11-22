import { getCollection, getEntry } from 'astro:content';

/** The single site-content entry. Throws loudly if the file is missing. */
export async function getSite() {
  const entry = await getEntry('site', 'site');
  if (!entry) throw new Error('src/content/site/site.json is missing its "site" entry.');
  return entry.data;
}

/** Published posts, newest first. Drafts never reach a page. */
export async function getPublishedPosts() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
