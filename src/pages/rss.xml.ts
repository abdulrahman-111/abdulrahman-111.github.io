import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../data/site';
import { getPublishedEntries } from '../lib/content';

export async function GET(context: { site?: URL }) {
  const posts = getPublishedEntries(await getCollection('blog'), true);
  return rss({
    title: `${siteConfig.name} — Engineering Writing`,
    description: siteConfig.description,
    site: context.site ?? new URL(siteConfig.url),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      link: `/blog/${post.id}/`,
      categories: [post.data.category, ...post.data.tags],
      content: post.body,
    })),
    customData: '<language>en-us</language>',
  });
}
