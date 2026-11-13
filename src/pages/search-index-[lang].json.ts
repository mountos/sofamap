import { buildSearchIndex } from '../utils/search.ts';

const SUPPORTED_LANGS = ["zh-tw","sc","en","ja"] as const;

export function getStaticPaths() {
  return SUPPORTED_LANGS.map(lang => ({
    params: { lang },
  }));
}

export async function GET({ params }: { params: { lang: string } }) {
  return buildSearchIndex(params.lang);
}
