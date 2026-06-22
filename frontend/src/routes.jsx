import { lazy } from "react";

export const RecommendedByPhysiotherapist = lazy(
  () => import("./pages/RecommendedByPhysiotherapist")
);

export const recommendedByPhysiotherapistPath = "/recommended-by-physiotherapist";
