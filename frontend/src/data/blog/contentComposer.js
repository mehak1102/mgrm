import { getRecommendedProducts } from "./productMaps";

export function countArticleWords(article) {
  let total = 0;
  for (const section of article.sections) {
    for (const block of section.blocks) {
      total += countBlockWords(block);
    }
  }
  return total;
}

function countBlockWords(block) {
  if (!block) return 0;
  switch (block.type) {
    case "paragraph":
    case "quote":
    case "tip":
    case "callout":
    case "recommendation":
      return wordCount(block.text || block.body || "");
    case "list":
      return (block.items || []).reduce((n, item) => n + wordCount(item), 0);
    case "faq":
      return (block.items || []).reduce(
        (n, { q, a }) => n + wordCount(q) + wordCount(a),
        0
      );
    case "products":
      return wordCount(block.intro || "") +
        (block.items || []).reduce((n, p) => n + wordCount(p.description || p.name || ""), 0) +
        wordCount(block.recommendation || "");
    case "routine":
      return wordCount(block.intro || "") +
        (block.items || []).reduce((n, { action }) => n + wordCount(action || ""), 0);
    case "takeaways":
      return (block.items || []).reduce((n, item) => n + wordCount(item), 0);
    default:
      return 0;
  }
}

function wordCount(text) {
  return (text || "").split(/\s+/).filter(Boolean).length;
}

function paragraph(text) {
  return { type: "paragraph", text };
}

function divider() {
  return { type: "divider" };
}

function quote(text, attribution) {
  return { type: "quote", text, attribution };
}

function tip(title, text) {
  return { type: "tip", title, text };
}

function callout(title, text, variant = "info") {
  return { type: "callout", title, text, variant };
}

function list(items, style = "bullet", title) {
  return { type: "list", items, style, title };
}

function recommendation(text) {
  return { type: "recommendation", text };
}

function weaveRhythm(blocks, extras = []) {
  const out = [];
  let paraCount = 0;
  let extraIdx = 0;

  for (const block of blocks) {
    out.push(block);
    if (block.type === "paragraph") {
      paraCount += 1;
      if (paraCount >= 3 && extraIdx < extras.length) {
        out.push(extras[extraIdx]);
        extraIdx += 1;
        paraCount = 0;
      }
    }
  }

  while (extraIdx < extras.length) {
    out.push(extras[extraIdx]);
    extraIdx += 1;
  }

  return out;
}

function buildSectionBlocks(sectionData) {
  const blocks = [];
  const rhythm = [];

  if (sectionData.lead) blocks.push(paragraph(sectionData.lead));
  if (sectionData.paragraphs) {
    sectionData.paragraphs.forEach((p) => blocks.push(paragraph(p)));
  }
  if (sectionData.list?.length) {
    rhythm.push(list(sectionData.list, sectionData.listStyle, sectionData.listTitle));
  }
  if (sectionData.quote) {
    rhythm.push(quote(sectionData.quote.text, sectionData.quote.attribution));
  }
  if (sectionData.tip) {
    rhythm.push(tip(sectionData.tip.title, sectionData.tip.text));
  }
  if (sectionData.callout) {
    rhythm.push(callout(sectionData.callout.title, sectionData.callout.text, sectionData.callout.variant));
  }
  if (sectionData.tips?.length) {
    sectionData.tips.forEach((t) => rhythm.push(tip(t.title, t.text)));
  }
  if (sectionData.recommendation) {
    rhythm.push(recommendation(sectionData.recommendation));
  }
  if (sectionData.paragraphsAfter?.length) {
    sectionData.paragraphsAfter.forEach((p) => blocks.push(paragraph(p)));
  }

  return weaveRhythm(blocks, rhythm);
}

export function composeArticle(brief, blog) {
  const products = brief.products?.items || getRecommendedProducts(blog);

  const sections = [
    {
      id: "intro",
      title: null,
      blocks: brief.heroIntro.map((text) => paragraph(text)),
    },
    {
      id: "understanding",
      title: "Understanding The Condition",
      blocks: buildSectionBlocks(brief.understanding),
    },
    {
      id: "causes",
      title: "Common Causes",
      blocks: weaveRhythm(
        [
          ...(brief.causes.paragraphs || []).map(paragraph),
          ...(brief.causes.list?.length
            ? [list(brief.causes.list, "bullet", brief.causes.listTitle)]
            : []),
        ],
        brief.causes.quote ? [quote(brief.causes.quote.text, brief.causes.quote.attribution)] : []
      ),
    },
    {
      id: "symptoms",
      title: "Symptoms",
      blocks: buildSectionBlocks(brief.symptoms),
    },
    {
      id: "prevention",
      title: "Prevention Tips",
      blocks: buildSectionBlocks(brief.prevention),
    },
    {
      id: "recovery",
      title: "Recovery & Rehabilitation",
      blocks: buildSectionBlocks(brief.recovery),
    },
    {
      id: "supports",
      title: "Recommended Supports",
      blocks: [
        paragraph(brief.products?.intro || brief.supportsIntro),
        {
          type: "products",
          intro: null,
          items: products,
          recommendation: brief.products?.recommendation,
        },
        ...(brief.products?.paragraphsAfter || []).map(paragraph),
      ],
    },
    {
      id: "routine",
      title: "Daily Routine Advice",
      blocks: [
        paragraph(brief.dailyRoutine.intro),
        ...(brief.dailyRoutine.paragraphs || []).map(paragraph),
        {
          type: "routine",
          intro: brief.dailyRoutine.scheduleTitle || "A practical day structure",
          items: brief.dailyRoutine.schedule,
        },
        ...(brief.dailyRoutine.paragraphsAfter || []).map(paragraph),
      ],
    },
    {
      id: "faqs",
      title: "Frequently Asked Questions",
      blocks: [
        {
          type: "faq",
          items: brief.faqs,
        },
      ],
    },
    {
      id: "takeaways",
      title: "Final Takeaways",
      blocks: [
        divider(),
        {
          type: "takeaways",
          items: brief.takeaways,
        },
        ...(brief.closingNote ? [callout("Editor's note", brief.closingNote, "info")] : []),
      ],
    },
  ];

  return { sections };
}

export function estimateReadMinutes(article) {
  const words = countArticleWords(article);
  return Math.max(6, Math.min(14, Math.round(words / 200)));
}
