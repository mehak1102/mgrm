import { generateArticleForBlog } from "./articleGenerator";
import { countArticleWords, estimateReadMinutes } from "./contentComposer";

const articleCache = new Map();

export function getBlogArticle(blog) {
  if (!blog?.slug) return null;
  if (!articleCache.has(blog.slug)) {
    articleCache.set(blog.slug, generateArticleForBlog(blog));
  }
  return articleCache.get(blog.slug);
}

export function getBlogWordCount(blog) {
  const article = getBlogArticle(blog);
  return article ? countArticleWords(article) : 0;
}

export function getBlogReadMinutes(blog) {
  const article = getBlogArticle(blog);
  return article ? estimateReadMinutes(article) : blog?.readTime || 8;
}
