import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

/**
 * A rehype plugin to add rel="nofollow noopener noreferrer" and target="_blank"
 * to all external links in markdown content.
 */
export default function rehypeExternalLinks() {
  return (tree) => {
    visit(tree, { type: 'element', tagName: 'a' }, (node) => {
      if (node.properties && typeof node.properties.href === 'string') {
        const url = node.properties.href;

        // Check if it's an external link
        if (url.startsWith('http://') || url.startsWith('https://')) {
          // Exclude ONLY owned mountos.com domains from nofollow
          const isOwned = url.includes('mountos.com');
          
          if (!isOwned) {
            node.properties.rel = 'nofollow noopener noreferrer';
          } else {
            node.properties.rel = 'noopener noreferrer';
          }
          node.properties.target = '_blank';
        }
      }
    });
  };
}
