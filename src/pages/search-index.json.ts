import { buildSearchIndex } from '../utils/search.ts';

export async function GET() {
  return buildSearchIndex('zh-tw');
}
