export const onRequest = async (context) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  
  // 取出最後一段路徑，檢查是否帶有副檔名（避免改到 .png, .css 等靜態資源的大小寫）
  const lastSegment = pathname.split('/').pop();
  const hasExtension = lastSegment && lastSegment.includes('.');

  if (!hasExtension) {
    const lowerPath = pathname.toLowerCase();
    
    // 如果路徑中包含大寫字母，統一使用 301 永久轉址到小寫網址
    if (pathname !== lowerPath) {
      url.pathname = lowerPath;
      return Response.redirect(url.toString(), 301);
    }
  }

  // 不是需要轉址的狀況，則繼續交由 Cloudflare Pages 原本流程處理
  return context.next();
};
