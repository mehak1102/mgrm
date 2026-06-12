import {
  getAllBlogs,
  getBlogBySlug,
  getBlogContent,
  getBlogsForProduct,
  getFeaturedBlog,
  getBodyPartStripItems,
  getBodyPartBlogs,
  getActivityBlogs,
  filterBlogsByType,
  combineBlogs,
  generateBodyPartBlogs,
  generateActivityBlogs,
} from "./blogEngine";
export { getBlogArticle, getBlogReadMinutes, getBlogWordCount } from "./blog";

export const blogPosts = getAllBlogs();

export {
  getAllBlogs,
  getBlogBySlug,
  getBlogContent,
  getBlogsForProduct,
  getFeaturedBlog,
  getBodyPartStripItems,
  getBodyPartBlogs,
  getActivityBlogs,
  filterBlogsByType,
  combineBlogs,
  generateBodyPartBlogs,
  generateActivityBlogs,
};
