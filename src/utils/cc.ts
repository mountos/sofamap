import * as OpenCC from 'opencc-js';

// 初始化一個從台灣繁體到大陸簡體的轉換器
const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });

/**
 * 將繁體中文轉換為簡體中文
 * @param text 繁體中文字串
 * @returns 簡體中文字串
 */
export function toSimplified(text: string): string {
  if (!text) return '';
  return converter(text);
}

/**
 * 遞迴地將一個物件（如 frontmatter 或 json-ld）中的所有字串欄位轉換成簡體中文
 * @param obj 任意物件
 * @returns 轉換後的物件
 */
export function toSimplifiedObj<T>(obj: T): T {
  if (obj instanceof Date) {
    return obj;
  }

  if (typeof obj === 'string') {
    return toSimplified(obj) as unknown as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => toSimplifiedObj(item)) as unknown as T;
  }
  
  if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = toSimplifiedObj(obj[key]);
      }
    }
    return result as T;
  }
  
  return obj;
}
