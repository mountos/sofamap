export const categoriesTranslation: Record<string, Record<string, string>> = {
  'zh-TW': {
    'guide': '指南與教學'
  },
  'ja': {
    'guide': 'ガイドとチュートリアル'
  },
  'en': {
    'guide': 'Guides & Tutorials'
  }
};

export function getLangFromFilename(filename: string): string {
  if (filename.endsWith('.zh-TW.md') || filename.endsWith('.zh-TW.mdx')) {
    return 'zh-TW';
  }
  if (filename.endsWith('.ja.md') || filename.endsWith('.ja.mdx')) {
    return 'ja';
  }
  return 'en';
}

export function translateCategory(category: string, filename: string): string {
  const lang = getLangFromFilename(filename);
  const translations = categoriesTranslation[lang] || categoriesTranslation['en'];
  return translations[category] || category;
}
