import { useMemo } from "react";
import {
  getBodyPartBlogs,
  getActivityBlogs,
  getFeaturedBlog,
  getBodyPartStripItems,
  getAllBlogs,
} from "../data/blogEngine";

export function useBlogs(filterType = "bodyPart") {
  const bodyPartBlogs = useMemo(() => getBodyPartBlogs(), []);
  const activityBlogs = useMemo(() => getActivityBlogs(), []);
  const featuredBlog = useMemo(() => getFeaturedBlog(), []);
  const stripItems = useMemo(() => getBodyPartStripItems(), []);
  const totalCount = useMemo(() => getAllBlogs().length, []);

  const showBody = filterType === "all" || filterType === "bodyPart";
  const showActivity = filterType === "all" || filterType === "activity";

  return {
    featuredBlog,
    bodyPartBlogs,
    activityBlogs,
    stripItems,
    totalCount,
    showBody,
    showActivity,
    filteredCount:
      filterType === "all"
        ? totalCount
        : filterType === "activity"
          ? activityBlogs.length
          : bodyPartBlogs.length,
  };
}
