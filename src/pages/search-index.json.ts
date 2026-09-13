import { getCollection } from 'astro:content';

export async function GET() {
  let posts = [];
  try {
    posts = await getCollection('blog');
  } catch (e) {
    console.warn('No blog collection found');
  }
  
  const index = posts.map(post => ({
    id: post.slug,
    title: post.data.title,
    author: post.data.authorName || '',
    excerpt: (post.data.description || post.body.substring(0, 150)).replace(/\n/g, ' ').replace(/[#*>_\-\[\]]/g, ''),
    url: `/blog/${post.slug}/`,
    lang: post.data.lang || 'zh',
    content: post.body.replace(/\n/g, ' ').replace(/[#*>_\-\[\]]/g, '')
  }));

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}
