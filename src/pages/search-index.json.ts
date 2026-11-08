import { getCollection } from 'astro:content';

function cleanMarkdown(text: string): string {
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

export async function GET() {
  let posts: any[] = [];
  try {
    posts = await getCollection('blog');
  } catch (e) {
    console.warn('No blog collection found:', e);
  }

  const index = posts.map(post => {
    const slug = post.id.replace(/\.mdx?$/, '').replace(/\/index(\.[a-z]{2})?$/, '');
    const cleanedBody = cleanMarkdown(post.body || '');
    const description = (post.data.description || '').trim();
    const excerpt = description || cleanedBody.substring(0, 160);
    const postLang = (post.data.lang || 'zh-tw').toLowerCase();
    const normalizedLang = (postLang === 'zh' || postLang === 'zh-hant') ? 'zh-tw' : postLang;

    return {
      id: slug,
      title: (post.data.title || '').trim(),
      author: post.data.authorName || post.data.author || 'Sofamap',
      excerpt: excerpt,
      content: cleanedBody,
      url: `/blog/${slug}/`,
      lang: normalizedLang,
      tags: post.data.tags || [],
      date: post.data.pubDate ? new Date(post.data.pubDate).toISOString().split('T')[0] : '',
    };
  });

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    }
  });
}
