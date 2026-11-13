import { getCollection } from 'astro:content';

export function cleanMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*~_>=\-+|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface SearchIndexItem {
  title: string;
  excerpt: string;
  tags: string[];
  url: string;
  lang?: string;
}

export async function buildSearchIndex(targetLang?: string): Promise<Response> {
  let posts: any[] = [];
  try {
    posts = await getCollection('blog');
  } catch (e) {
    console.warn('No blog collection found:', e);
  }

  const filtered = targetLang && targetLang !== 'all'
    ? posts.filter(post => {
        const postLang = (post.data.lang || 'zh-tw').toLowerCase();
        const lang = (postLang === 'zh' || postLang === 'zh-hant') ? 'zh-tw' : postLang;
        return lang === targetLang;
      })
    : posts;

  const index: SearchIndexItem[] = filtered.map(post => {
    const slug = post.id.replace(/\.mdx?$/, '').replace(/\/index(\.[a-z]{2})?$/, '');
    const description = (post.data.description || '').trim();
    const excerpt = description || cleanMarkdown(post.body || '').substring(0, 160);
    const postLang = (post.data.lang || 'zh-tw').toLowerCase();
    const lang = (postLang === 'zh' || postLang === 'zh-hant') ? 'zh-tw' : postLang;

    return {
      title: (post.data.title || '').trim(),
      excerpt,
      tags: Array.isArray(post.data.tags) ? post.data.tags : [],
      url: `/blog/${slug}/`,
      lang,
    };
  });

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    }
  });
}
