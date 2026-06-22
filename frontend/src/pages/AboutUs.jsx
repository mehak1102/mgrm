import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Award,
  ShieldCheck,
  ChevronRight,
  Quote,
  Sparkles,
} from 'lucide-react';
import {
  SectionLabel,
  CinematicHeading,
  HeroKineticLine,
  HeroTitleBlock,
  ParagraphGroup,
  AnimatedStat,
  StaggerReveal,
  StaggerItem,
  TimelineReveal,
  TimelineItem,
  FadeUpBlock,
  FadeUpText,
  FadeUpQuote,
} from "../components/typography/TypographyMotion";
import { useTheme } from "../context/ThemeContext";
import { ABOUT_CATEGORY_PASTELS } from "../data/aboutCategoryPastels";
import { bodyCategories } from "../data/siteData";
import API from "../api";
import "../theme/about-category-flip.css";
import ViewportVideo from "../components/media/ViewportVideo";

const CATEGORY_IMAGE_QUERIES = {
  'abdomen2.png': 'Abdominal',
  'ankle2.png': 'Ankle And Foot',
  'arm2.png': 'Arm',
  'back2.png': 'Back',
  'calf2.png': 'Shin And Calf',
  'collar2.png': 'Neck',
  'elbow2.png': 'Elbow',
  'finger2.png': 'Finger',
  'knee2.png': 'Knee',
  'leg2.png': 'Leg',
  'neck2.png': 'Neck',
  'orth2.png': 'Orthopedic Aids',
  'ribs2.png': 'Chest',
  'shoulder2.png': 'Shoulder',
  'thigh2.png': 'Thigh',
  'wrist2.png': 'Wrist',
};

const BACK_PRODUCT_LINES = 5;

const CATEGORY_NUMBER_FILLS = [
  "#bae6fd", "#fbcfe8", "#ddd6fe", "#fed7aa", "#bbf7d0", "#a5f3fc",
  "#fef08a", "#fecdd3", "#c7d2fe", "#99f6e4", "#d9f99d", "#e9d5ff",
  "#bfdbfe", "#a7f3d0", "#fde68a", "#ffd6e8",
];

const CATEGORY_NUMBER_BORDERS = [
  "#38bdf8", "#f472b6", "#a78bfa", "#fb923c", "#4ade80", "#22d3ee",
  "#facc15", "#fb7185", "#818cf8", "#2dd4bf", "#a3e635", "#c084fc",
  "#60a5fa", "#34d399", "#fbbf24", "#f472b6",
];

function getCategoryNumberColors(index) {
  const i = index % CATEGORY_NUMBER_FILLS.length;
  return {
    fill: CATEGORY_NUMBER_FILLS[i],
    border: CATEGORY_NUMBER_BORDERS[i],
  };
}

function CategoryFlipCard({ image, index, categoryName, categoryQuery, products, productsLoaded }) {
  const { theme } = useTheme();
  const palette = ABOUT_CATEGORY_PASTELS[index % ABOUT_CATEGORY_PASTELS.length][theme]
    || ABOUT_CATEGORY_PASTELS[index % ABOUT_CATEGORY_PASTELS.length].light;
  const badgeColors = getCategoryNumberColors(index);
  const productCount = products.length;
  const previewProducts = products.slice(0, BACK_PRODUCT_LINES);

  return (
    <StaggerItem className="about-category-flip min-w-0 w-full h-[260px] sm:h-[280px] md:h-[300px] lg:h-[320px] xl:h-[360px]">
      <div className="about-category-flip__inner">
        <div className="about-category-flip__face about-category-flip__front">
          <span
            className="about-category-flip__front-num"
            aria-hidden="true"
            style={{
              background: badgeColors.fill,
              borderColor: badgeColors.border,
              '--badge-glow': badgeColors.border,
            }}
          >
            {index + 1}
          </span>
          <img
            src={`/products/${image}`}
            alt={categoryName}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold capitalize text-white break-words">
              {categoryName}
            </h3>
          </div>
        </div>

        <div
          className="about-category-flip__face about-category-flip__back"
          style={{
            '--ac-bg': palette.bg,
            '--ac-from': palette.from,
            '--ac-to': palette.to,
            '--ac-title': palette.title,
            '--ac-text': palette.text,
          }}
        >
          <div className="about-category-flip__back-glow" aria-hidden />
          <div className="about-category-flip__back-content">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold capitalize break-words">
              {categoryName}
            </h3>
            <p className="about-category-flip__back-count">
              {productCount} product{productCount === 1 ? '' : 's'}
            </p>

            {productsLoaded && previewProducts.length > 0 ? (
              <ol className="about-category-flip__back-list">
                {previewProducts.map((product, productIndex) => (
                  <li key={product._id || product.slug || `${product.name}-${productIndex}`}>
                    <span className="about-category-flip__back-num">{productIndex + 1}.</span>
                    <span className="about-category-flip__back-name">{product.name}</span>
                  </li>
                ))}
              </ol>
            ) : productsLoaded ? (
              <p className="about-category-flip__back-empty">Open the shop to explore this category.</p>
            ) : (
              <p className="about-category-flip__back-empty" aria-hidden="true">
                &nbsp;
              </p>
            )}

            <Link
              to={`/shop?category=${encodeURIComponent(categoryQuery)}`}
              className="about-category-flip__back-btn btn-primary"
            >
              View Products
            </Link>
          </div>
        </div>
      </div>
    </StaggerItem>
  );
}

const productImages = [
  'abdomen2.png',
  'ankle2.png',
  'arm2.png',
  'back2.png',
  'calf2.png',
  'collar2.png',
  'elbow2.png',
  'finger2.png',
  'knee2.png',
  'leg2.png',
  'neck2.png',
  'orth2.png',
  'ribs2.png',
  'shoulder2.png',
  'thigh2.png',
  'wrist2.png',
];

const timeline = [
  {
    year: '1994',
    title: 'MGRM Medicare Incorporated',
  },
  {
    year: '1995',
    title: 'Manufacturing Started',
  },
  {
    year: '1997',
    title: 'First US FDA Registration',
  },
  {
    year: '2005',
    title: 'WHO GMP Certification',
  },
  {
    year: '2007',
    title: 'NDMA Expert Committee Invitation',
  },
  {
    year: '2008',
    title: 'Steering Committee Member - NDMA',
  },
];

const sidebarLinks = [
  'Our History',
  'Achievements',
  'Quality Certifications',
  'MGRM Timelines',
  'Leadership',
  'Testimonials',
  'Cure to Care™',
  'Partner Program',
  'Autoclave Sterilizer',
  'Specifications',
  'Construction',
  'Shredder Facility',
  'Accessories',
];

const achievements = [
  {
    title: 'Indian Armed Forces',
    image: 'https://images.unsplash.com/photo-1737996159880-84645414d1db?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'NDMA Recognition',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfNpw2cQhzbDKfrjS3KGV_9QHJrWAOKEG_kA&s',
  },
  {
    title: 'Healthcare Innovation',
    image:
      'https://etimg.etb2bimg.com/photo/123819552.cms',
  },
  {
    title: 'National Quality Awards',
    image:
      'https://images.unsplash.com/photo-1697209868660-c5991488f7b1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const certifications = [
  {
    name: 'FDA Approval',
    logo:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxuxDCZ_iuM5tE9EH4EhICYdC9do0fDiyxew&s',
  },
  {
    name: 'CE Certification',
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/6/66/Conformit%C3%A9_Europ%C3%A9enne_%28logo%29.svg',
  },
  {
    name: 'WHO GMP',
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/2/26/World_Health_Organization_Logo.svg',
  },
  {
    name: 'ISO 9001',
    logo:
      'https://png.pngtree.com/png-clipart/20250514/original/pngtree-iso-9001-certified-company-logo-badge-vector-png-image_20971536.png',
  },
  {
    name: 'ISO 13485',
    logo:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzKy8G7r0dmTJ0IzZUweYFLkKUUVAmJLj1Xg&s',
  },
  {
    name: 'ISO 14001',
    logo:
      'https://vectorseek.com/wp-content/uploads/2023/09/ISO-14001-Logo-Vector.svg-.png',
  },
  {
    name: 'OHSAS 18001',
    logo:
      'https://thumbs.dreamstime.com/b/ohsas-certified-green-label-isolated-white-background-184217643.jpg',
  },
  {
    name: 'ANVISA',
    logo:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVpXWhg4_lQK0ZTVkq-iT_OnvlM9d-3izXVA&s',
  },
];

const testimonials = [
  {
    name: 'Dr P K Dave - AIIMS',
    text: 'MGRM products are versatile, light and extremely user friendly.',
    image:
      'https://static.medigence.com/uploads/doctor/images/80fbbc32a1070d08c2acf558ed4b9281.jpg',
  },
  {
    name: 'Dr K K Saini - Academician',
    text: 'Excellent orthopedic supports meeting clinical requirements.',
    image:
      'https://www.drkksaini.in/images/sp.jpg',
  },
  {
    name: 'Maj Gen B B Dutta - Academician',
    text: 'MGRM products are highly appreciated in Armed Forces.',
    image:
      'https://i.ytimg.com/vi/mQZk1n8W-14/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDmLvej3_4GO5mNjX50vacWv1iZZA',
  },
  {
    name: 'Dr A K Singh - Neurosurgeon',
    text: 'Their cervical rehabilitation products are outstanding.',
    image:
      'https://shinonglobal.com/wp-content/uploads/2022/05/Dr.-A.K.-Singh.jpg',
  },
];

const famousPeople = [
  {
    name: 'Dr A P J Abdul Kalam',
    image:
      'https://cdn.britannica.com/56/148856-004-2F59E2D9/APJ-2008.jpg',
  },
  {
    name: 'Dr Manmohan Singh',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/2/2c/Prime_Minister_Dr._Manmohan_Singh_in_March_2014.jpg',
  },
];


const AboutUs = () => {
  const location = useLocation();
  const [categoryProducts, setCategoryProducts] = useState({});

  useEffect(() => {
    let ignore = false;
    const queries = [
      ...new Set(
        productImages
          .map((image) => CATEGORY_IMAGE_QUERIES[image])
          .filter(Boolean)
      ),
    ];

    Promise.all(
      queries.map((query) =>
        API.get(`/products?category=${encodeURIComponent(query)}&bodyOnly=true`)
          .then((res) => ({ query, products: res.data.products || [] }))
          .catch(() => ({ query, products: [] }))
      )
    ).then((results) => {
      if (ignore) return;
      setCategoryProducts(
        Object.fromEntries(results.map((result) => [result.query, result.products]))
      );
    });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const hash = location.hash?.replace("#", "");
    if (!hash) return undefined;

    const timer = window.setTimeout(() => {
      const el = document.getElementById(hash);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("about-anchor-highlight");
      window.setTimeout(() => el.classList.remove("about-anchor-highlight"), 2400);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return (
    <div className="about-us-page relative overflow-x-clip overflow-hidden bg-[#eef7ff] bg-app dark:bg-zinc-950 transition-colors duration-300 max-w-[100vw]">
      {/* BG */}
      <div className="absolute left-[-150px] top-[-150px] h-[450px] w-[450px] rounded-full bg-cyan-200/40 blur-3xl" />

      <div className="absolute bottom-[-150px] right-[-150px] h-[450px] w-[450px] rounded-full bg-blue-200/40 blur-3xl" />

      {/* HERO */}
      <section className="relative h-screen overflow-hidden">
        <ViewportVideo
          eager
          autoPlay
          muted
          loop
          playsInline
          poster="/products/orth2.png"
          sources={[{ src: "/videos/slow.mp4", type: "video/mp4" }]}
          className="absolute inset-0 h-full w-full object-cover brightness-110"
        />

        {/* <div className="absolute inset-0 bg-[#00172e]/75" /> */}
        <div className="absolute inset-0 bg-[#00172e]/40" />

        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto max-w-7xl px-6">
            {/* <div className="max-w-4xl"> */}
            <div className="max-w-5xl mx-auto text-center">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-xl">
                <Sparkles className="h-5 w-5 text-cyan-300" />

              <div className="text-lg md:text-xl font-semibold text-white tracking-widest text-center">
                <HeroKineticLine
                  text="MGRM Medicare Private Limited"
                  className="justify-center"
                  delay={0.1}
                />
              </div>
              </div>

              <HeroTitleBlock
                className="mt-8 text-center font-black leading-[0.92] tracking-[-2px] text-white"
                lines={[
                  {
                    text: "Revolutionizing",
                    className: "justify-center max-sm:text-[36px] text-[52px] md:text-[88px]",
                    delay: 0.35,
                  },
                  {
                    text: "Rehabilitation",
                    className: "justify-center max-sm:text-[40px] text-[58px] md:text-[98px]",
                    gradient: true,
                    delay: 0.55,
                  },
                  {
                    text: "Since 1994",
                    className:
                      "justify-center max-sm:text-[22px] text-[32px] md:text-[52px] tracking-[4px] sm:tracking-[6px] text-white/85",
                    delay: 0.75,
                  },
                ]}
              />

              <FadeUpText
                animateOnMount
                delay={1.1}
                className="mt-10 mx-auto max-w-3xl text-lg leading-9 text-gray-200"
              >
                India’s leading rehabilitation and orthopedic healthcare
                technology company trusted by doctors, hospitals,
                defense forces and healthcare institutions nationwide.
              </FadeUpText>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:py-24 min-w-0">
        <div className="flex flex-col gap-10 lg:flex-row min-w-0">
          {/* SIDEBAR */}
          <aside className="w-full shrink-0 lg:sticky lg:top-28 h-fit rounded-[35px] border border-white/70 border-slate-200 dark:border-white/10 bg-card/80 dark:bg-zinc-900/80 p-5 sm:p-7 shadow-[0_20px_80px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-colors duration-300 lg:w-[320px]">
            <CinematicHeading
              text="About Us"
              className="mb-8 text-3xl font-bold text-[#002B5B] dark:text-zinc-100"
            />

            <div className="space-y-4">
              {sidebarLinks.map((item, index) => (
                <a
                  key={index}
                  href={`#section-${index}`}
                  className="group flex items-center justify-between gap-2 rounded-2xl bg-[#f4f9ff] dark:bg-zinc-800 px-4 sm:px-5 py-4 font-medium text-gray-700 dark:text-zinc-200 transition-all duration-300 hover:bg-[#002B5B] dark:hover:bg-slate-800 hover:text-white min-w-0"
                >
                  <span className="min-w-0 truncate">{item}</span>

                  <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </a>
              ))}
            </div>
          </aside>

          {/* CONTENT */}
          <div className="flex-1 min-w-0 space-y-10">
            {/* HISTORY */}
            <section
              id="section-0"
              className="overflow-hidden rounded-[40px] border border-white/70 border-slate-200 dark:border-white/10 bg-card/90 dark:bg-zinc-900/90 shadow-[0_20px_80px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-colors duration-300"
            >
              <div className="grid min-w-0 lg:grid-cols-2">
                <div className="p-6 sm:p-10 lg:p-14 min-w-0">
                  <SectionLabel className="text-sm font-semibold uppercase tracking-[5px] text-[#002B5B] text-brand">
                    Our History
                  </SectionLabel>

                  <CinematicHeading
                    text="Transforming Rehabilitation In India"
                    className="mt-5 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#002B5B] dark:text-zinc-100 break-words"
                  />

                  <ParagraphGroup
                    className="mt-8 space-y-6 text-[16px] leading-8 text-gray-500 dark:text-zinc-400"
                    paragraphs={[
                      "MGRM Medicare Private Limited was established in 1994 with a vision to revolutionize physical rehabilitation and orthopedic healthcare in India.",
                      "The company pioneered innovative rehabilitation products and introduced advanced orthopedic splints and rehabilitation technologies across India and South Asia.",
                      "Today, MGRM serves hospitals, defense forces, institutions, emergency services and millions of patients with world-class rehabilitation solutions.",
                    ]}
                  />
                </div>

                <div className="relative min-h-[240px] sm:min-h-[360px] lg:min-h-[550px]">
                  <img
                    src="/products/orth2.png"
                    alt=""
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#00172e]/60 to-transparent" />
                </div>
              </div>
            </section>

            {/* PRODUCT GRID */}
            <section
              id="orthopedic-product-categories"
              className="rounded-[40px] border border-white/70 border-slate-200 dark:border-white/10 bg-card/90 dark:bg-zinc-900/90 p-5 sm:p-8 transition-colors duration-300 min-w-0 overflow-hidden scroll-mt-28"
            >
              <FadeUpBlock className="mb-8 sm:mb-12">
                <SectionLabel className="text-sm font-semibold uppercase tracking-[5px] text-[#002B5B] text-brand">
                  Rehabilitation Products
                </SectionLabel>

                <CinematicHeading
                  text="Orthopedic Product Categories"
                  className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#002B5B] dark:text-zinc-100"
                />
              </FadeUpBlock>

              <StaggerReveal
                className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7 xl:grid-cols-4"
                stagger={0.08}
              >
                {productImages.map((image, index) => {
                  const categoryQuery = CATEGORY_IMAGE_QUERIES[image];
                  const categoryMeta = bodyCategories.find((cat) => cat.query === categoryQuery);
                  const categoryName =
                    categoryMeta?.name ||
                    image.replace('.png', '').replace(/2$/, '');

                  return (
                    <CategoryFlipCard
                      key={image}
                      image={image}
                      index={index}
                      categoryName={categoryName}
                      categoryQuery={categoryQuery}
                      products={categoryProducts[categoryQuery] || []}
                      productsLoaded={Object.prototype.hasOwnProperty.call(categoryProducts, categoryQuery)}
                    />
                  );
                })}
              </StaggerReveal>
            </section>

            {/* ACHIEVEMENTS */}
            <section
              id="section-1"
              className="rounded-[40px] bg-gradient-to-br from-[#002B5B] via-[#003a75] to-[#0056a6] p-10 text-white"
            >
              <SectionLabel className="text-sm font-semibold uppercase tracking-[5px] text-cyan-200">
                Achievements
              </SectionLabel>

              <CinematicHeading
                text="Trusted Across India"
                className="mt-4 text-4xl font-bold"
              />

              <StaggerReveal
                className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-4"
                stagger={0.1}
              >
                {achievements.map((item, index) => (
                  <StaggerItem
                    key={index}
                    className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/10 backdrop-blur-xl"
                  >
                    <div className="relative h-[250px] overflow-hidden">
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                      <div className="absolute bottom-5 left-5">
                        <Award className="mb-3 h-10 w-10 text-cyan-300" />

                        <h3 className="text-2xl font-bold">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerReveal>

              {/* Famous People */}
              <div id="first-citizen" className="mt-20 scroll-mt-28">
                <CinematicHeading
                  text="First Citizen to the Common Man"
                  as="h3"
                  className="text-3xl font-bold"
                />

                <FadeUpText className="mt-6 max-w-5xl text-lg leading-9 text-gray-200">
                  MGRM products have been trusted by renowned leaders,
                  healthcare experts, sports personalities and millions
                  of loyal customers across India.
                </FadeUpText>

                <StaggerReveal className="mt-10 grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 md:gap-8" stagger={0.12}>
                  {famousPeople.map((item, index) => (
                    <StaggerItem
                      key={index}
                      className="min-w-0 overflow-hidden rounded-[35px] bg-white/10 backdrop-blur-xl"
                    >
                      <div className="flex min-w-0 flex-col sm:flex-row sm:items-stretch">
                        <div className="relative h-52 w-full shrink-0 overflow-hidden sm:h-auto sm:min-h-[200px] sm:w-40 md:w-48">
                          <img
                            src={item.image}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover object-top"
                          />
                        </div>

                        <div className="min-w-0 flex-1 flex flex-col justify-center p-5 sm:p-6 md:p-8">
                          <h4 className="text-xl sm:text-2xl md:text-3xl font-bold break-words">
                            {item.name}
                          </h4>

                          <FadeUpText className="mt-4 sm:mt-5 text-base sm:leading-8 text-gray-200 break-words">
                            Recognized personalities and national
                            leaders have trusted MGRM rehabilitation
                            and orthopedic products.
                          </FadeUpText>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerReveal>
              </div>
            </section>

            {/* CERTIFICATIONS */}
            <section
              id="section-2"
              className="rounded-[40px] border border-white/70 border-slate-200 dark:border-white/10 bg-card/90 dark:bg-zinc-900/90 p-10 transition-colors duration-300"
            >
              <SectionLabel className="text-sm font-semibold uppercase tracking-[5px] text-[#002B5B] text-brand">
                Quality Certifications
              </SectionLabel>

              <CinematicHeading
                text="Global Quality Standards"
                className="mt-4 text-4xl font-bold text-[#002B5B] dark:text-zinc-100"
              />

              <StaggerReveal
                className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
                stagger={0.08}
              >
                {certifications.map((item, index) => (
                  <StaggerItem
                    key={index}
                    className="group rounded-[30px] border border-blue-100 dark:border-white/10 bg-[#f5fbff] dark:bg-zinc-800 p-8 text-center transition-colors duration-300 hover:-translate-y-2 hover:bg-[#002B5B] dark:hover:bg-slate-800"
                  >
                    <img
                      src={item.logo}
                      alt=""
                      className="mx-auto h-16 object-contain"
                    />

                    <h3 className="mt-6 text-2xl font-bold text-[#002B5B] text-slate-900 dark:text-zinc-100 transition group-hover:text-white">
                      {item.name}
                    </h3>
                  </StaggerItem>
                ))}
              </StaggerReveal>
            </section>

            {/* TIMELINE */}
            <section
              id="section-3"
              className="rounded-[40px] border border-white/70 border-slate-200 dark:border-white/10 bg-card/90 dark:bg-zinc-900/90 p-5 sm:p-8 lg:p-10 transition-colors duration-300 min-w-0"
            >
              <SectionLabel className="text-sm font-semibold uppercase tracking-[5px] text-[#002B5B] text-brand">
                MGRM Timelines
              </SectionLabel>

              <CinematicHeading
                text="Journey Through The Years"
                className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#002B5B] dark:text-zinc-100"
              />

              <TimelineReveal className="about-timeline-grid relative mt-10 sm:mt-12">
                {timeline.map((item, index) => (
                  <TimelineItem
                    key={index}
                    index={index}
                    className="about-timeline-item group relative z-10 flex min-w-0 flex-col items-center text-center"
                  >
                    <div className="about-timeline-dot h-7 w-7 shrink-0 rounded-full border-4 border-white bg-[#002B5B] shadow-xl transition duration-300 group-hover:scale-125" />

                    <div className="about-timeline-card mt-5 w-full min-w-0 rounded-[24px] sm:rounded-[30px] bg-[#f5fbff] bg-surface-hover p-4 sm:p-6 shadow-xl transition duration-500 group-hover:-translate-y-1">
                      <AnimatedStat
                        value={item.year}
                        valueClassName="text-2xl sm:text-3xl font-bold text-[#002B5B] dark:text-zinc-100"
                      />

                      <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-gray-500 dark:text-zinc-400 break-words">
                        {item.title}
                      </p>
                    </div>
                  </TimelineItem>
                ))}
              </TimelineReveal>
            </section>

            {/* LEADERSHIP */}
            <section
              id="section-4"
              className="rounded-[40px] bg-gradient-to-br from-[#00172e] to-[#003a75] p-10 text-white"
            >
              <SectionLabel className="text-sm font-semibold uppercase tracking-[5px] text-cyan-200">
                Leadership
              </SectionLabel>

              <CinematicHeading
                text="Visionary Healthcare Leadership"
                className="mt-4 text-4xl font-bold"
              />

              <FadeUpText className="mt-8 max-w-4xl text-lg leading-9 text-gray-200">
                MGRM Medicare is led by highly experienced healthcare
                professionals and rehabilitation experts with decades of
                expertise in medical technologies, innovation and patient care.
              </FadeUpText>
            </section>

            {/* TESTIMONIALS */}
            <section
              id="section-5"
              className="rounded-[40px] border border-white/70 border-slate-200 dark:border-white/10 bg-card/90 dark:bg-zinc-900/90 p-5 sm:p-8 lg:p-10 transition-colors duration-300 min-w-0"
            >
              <SectionLabel className="text-sm font-semibold uppercase tracking-[5px] text-[#002B5B] text-brand">
                Testimonials
              </SectionLabel>

              <CinematicHeading
                text="What Medical Experts Say"
                className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#002B5B] dark:text-zinc-100"
              />

              <StaggerReveal className="mt-8 sm:mt-12 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8" stagger={0.12}>
                {testimonials.map((item, index) => (
                  <StaggerItem
                    key={index}
                    className="about-testimonial-card min-w-0 overflow-hidden rounded-[28px] sm:rounded-[35px] border border-blue-100 dark:border-white/10 bg-[#f8fcff] dark:bg-zinc-900 shadow-lg transition duration-300 hover:-translate-y-2"
                  >
                    <div className="flex min-w-0 flex-col sm:flex-row sm:items-stretch">
                      <div className="relative h-52 w-full shrink-0 overflow-hidden sm:h-auto sm:min-h-[200px] sm:w-36 md:w-44 lg:w-48">
                        <img
                          src={item.image}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover object-top"
                        />
                      </div>

                      <div className="min-w-0 flex-1 p-5 sm:p-6">
                        <Quote className="h-10 w-10 shrink-0 text-cyan-300 sm:h-12 sm:w-12" />

                        <FadeUpQuote
                          text={`“${item.text}”`}
                          className="mt-4 text-base sm:text-lg leading-relaxed text-gray-500 dark:text-zinc-400 break-words"
                        />

                        <h4 className="mt-5 text-lg sm:text-xl font-bold text-[#002B5B] dark:text-zinc-100 break-words">
                          {item.name}
                        </h4>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerReveal>
            </section>

            {/* ================= CURE TO CARE SECTION ================= */}
<section
  id="section-6"
  className="relative overflow-hidden rounded-[42px] border border-white/70 border-slate-200 dark:border-white/10 bg-card/90 dark:bg-zinc-900/90 p-10 shadow-[0_20px_80px_rgba(0,0,0,0.06)] transition-colors duration-300"
>

  {/* BG GLOW */}
  <div className="absolute -top-20 -right-20 h-[260px] w-[260px] rounded-full bg-cyan-300/20 blur-3xl" />

  <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2">

    {/* LEFT CONTENT */}
    <div>

      <SectionLabel className="text-sm font-bold uppercase tracking-[5px] text-cyan-500">
        Cure to Care™
      </SectionLabel>

      <CinematicHeading
        text="Complete Eye Care & Rehabilitation Solutions"
        className="mt-5 text-5xl font-black leading-tight text-[#002B5B] dark:text-zinc-100"
      />

      <ParagraphGroup
        className="mt-8 space-y-6 text-[17px] leading-9 text-slate-600 text-gray-500 dark:text-zinc-400"
        paragraphs={[
          "Under the banner of Cure to Care concept, MGRM Medicare has forayed into the distribution and marketing of the complete range of medicines for eye care and rehabilitation catering to the four-phase treatment protocol of prevention, pre-treatment, treatment and post-treatment patient care.",
          "The products are available in the domestic market and over 50 international markets under the brand name ‘MGRM’.",
        ]}
      />

      <div className="mt-8 border-l-4 border-cyan-400 pl-6">
        <FadeUpQuote
          text="“MGRM products are designed to support recovery before surgery and accelerate rehabilitation after surgery.”"
          className="text-2xl font-semibold italic leading-10 text-[#002B5B] dark:text-zinc-100"
        />
      </div>

      {/* TAGS */}
      <div className="mt-10 flex flex-wrap gap-4">

        {[
          'Eye Care',
          'Rehabilitation',
          'Patient Care',
          'Global Markets',
          'Pre & Post Treatment',
          'Healthcare Solutions',
        ].map((tag, i) => (

          <div
            key={i}
            className="rounded-full border border-cyan-100 border-slate-200 dark:border-white/10 bg-cyan-50 bg-surface-hover px-5 py-3 text-sm font-bold text-[#002B5B] dark:text-zinc-100"
          >
            {tag}
          </div>
        ))}
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <div className="relative">

      <div className="absolute inset-0 rounded-[35px] bg-cyan-400/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-[35px] shadow-[0_25px_80px_rgba(34,211,238,0.18)]">

        <img
          src="/about/cure-care.jpg"
          alt="Cure to Care"
          // className="h-[520px] w-full object-cover transition duration-700 hover:scale-105"
          className="h-[520px] w-full object-contain bg-[#eef7ff] bg-app dark:bg-zinc-950  transition duration-700 hover:scale-[1.02]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#00172e]/60 via-transparent to-transparent" />

        {/* FLOAT CARD */}
        <div className="absolute bottom-8 left-8 rounded-[25px] border border-white/20 bg-white/10 px-6 py-5 backdrop-blur-xl">
          <AnimatedStat
            value="50+"
            label="International Markets"
            valueClassName="text-3xl font-black text-white"
            labelClassName="mt-1 text-sm text-white/80"
          />
        </div>
      </div>
    </div>
  </div>
</section>


{/* ================= PARTNER PROGRAM SECTION ================= */}
{/* <section
  id="section-7"
  className="relative overflow-hidden rounded-[45px] bg-card dark:bg-zinc-900 border border-white/60 border-slate-200 dark:border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.08)]"
>
  <div className="grid lg:grid-cols-2 items-center">


    <div className="relative h-[420px] overflow-hidden">

      <video
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      >
        <source
          src="/videos/handshake.mp4"
          type="video/mp4"
        />
      </video>

      
      <div className="absolute inset-0 bg-gradient-to-r from-[#00172e]/70 to-transparent" />

      
      <div className="absolute bottom-10 left-10 max-w-md">
        <p className="text-cyan-300 tracking-[0.3em] text-sm font-bold uppercase">
          Global Network
        </p>

        <h3 className="mt-4 text-4xl font-black text-white leading-tight">
          Partner <br />
          With MGRM
        </h3>

        <p className="mt-5 text-gray-200 leading-8">
          Expanding healthcare innovation and rehabilitation
          solutions across India and worldwide.
        </p>
      </div>
    </div>
    <div className="p-10 lg:p-16">

      <span className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-600 text-brand">
        PARTNER PROGRAM
      </span>

      <h2 className="mt-5 text-5xl font-black leading-tight text-[#002B5B] dark:text-zinc-100">
        Become Our <br />
        Distribution Partner
      </h2>

      <div className="mt-8 space-y-6 text-lg leading-9 text-slate-600 text-gray-500 dark:text-zinc-400">

        <p>
          Interested in becoming our distribution partner?
        </p>

        <p>
          Do you want us to market your product line?
        </p>

        <p>
          MGRM Medicare Limited has successfully launched
          partnerships with companies all over the world and
          we are continuously expanding our global network.
        </p>

        <p>
          Join hands with MGRM to deliver world-class
          rehabilitation and healthcare solutions to hospitals,
          institutions and patients worldwide.
        </p>
      </div>
    </div>
  </div>
</section> */}
{/* ================= PARTNER PROGRAM SECTION ================= */}
<section
  id="section-7"
  className="relative overflow-hidden rounded-[42px] border border-white/10 bg-gradient-to-br from-[#02142b] via-[#06264a] to-[#0a3d73] shadow-[0_30px_90px_rgba(2,12,27,0.35)]"
>
  <div className="grid lg:grid-cols-2 items-center">

    {/* VIDEO SIDE */}
    <div className="relative h-[520px] overflow-hidden">

      <ViewportVideo
        autoPlay
        muted
        loop
        playsInline
        poster="/products/logo-mark.png"
        sources={[{ src: "/videos/pp.mp4", type: "video/mp4" }]}
        className="absolute inset-0 h-full w-full object-cover scale-[1.12]"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00152d]/70 via-[#00152d]/25 to-transparent" />

      {/* OPTIONAL GLOW */}
      <div className="absolute -left-10 top-10 h-[240px] w-[240px] rounded-full bg-cyan-400/20 blur-3xl" />
    </div>

    {/* CONTENT SIDE */}
    <div className="relative z-10 p-10 md:p-16 text-white">

      <SectionLabel className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-5 py-2 text-sm font-bold tracking-[0.25em] text-cyan-300 backdrop-blur-xl">
        GLOBAL NETWORK
      </SectionLabel>

      <CinematicHeading
        text="Partner Program"
        className="mt-7 text-5xl font-black leading-tight"
      />

      <ParagraphGroup
        className="mt-8 space-y-6 text-lg leading-9 text-white/80"
        paragraphs={[
          "Interested in becoming our distribution partner? Do you want us to market your product line? MGRM Medicare Limited has successfully launched partnerships with companies all over the world and we’re always looking to expand our network.",
        ]}
      />

      <FadeUpText className="mt-6 text-lg leading-9 text-cyan-200 font-medium">
        Contact us today to learn more and become a part
        of our growing healthcare ecosystem.
      </FadeUpText>

      <StaggerReveal className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5" stagger={0.12}>
        <StaggerItem className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <AnimatedStat
            value="50+"
            label="Global Markets"
            valueClassName="text-4xl font-black text-cyan-300"
            labelClassName="mt-2 text-sm text-white/70"
          />
        </StaggerItem>

        <StaggerItem className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <AnimatedStat
            value="100+"
            label="Distribution Partners"
            valueClassName="text-4xl font-black text-cyan-300"
            labelClassName="mt-2 text-sm text-white/70"
          />
        </StaggerItem>

        <StaggerItem className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <AnimatedStat
            value="30+"
            label="Years Experience"
            valueClassName="text-4xl font-black text-cyan-300"
            labelClassName="mt-2 text-sm text-white/70"
          />
        </StaggerItem>
      </StaggerReveal>

      {/* BUTTONS */}
      {/* <div className="mt-12 flex flex-wrap gap-5">

        <button className="rounded-full bg-cyan-400 px-8 py-4 font-bold text-[#00152d] transition duration-300 hover:scale-105">
          Become Partner
        </button>

        <button className="rounded-full border border-white/20 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-xl transition duration-300 hover:bg-white hover:text-[#00152d]">
          Contact Us
        </button>
      </div> */}
    </div>
  </div>
</section>

            {/* ================= AUTCLAVE CUM SHREDDER SECTION ================= */}
<section    id="section-8" className="relative overflow-hidden rounded-[45px] border border-white/70 border-slate-200 dark:border-white/10 bg-card/90 dark:bg-zinc-900/90 p-6 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.35)]">

  {/* BG EFFECTS */}
  <div className="absolute top-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-cyan-200/30 blur-3xl" />

  <div className="absolute bottom-[-120px] left-[-120px] h-[300px] w-[300px] rounded-full bg-blue-200/20 blur-3xl" />

  <div className="relative z-10 pt-6">

    {/* TOP */}
    <div className="max-w-5xl">

      <SectionLabel className="text-sm font-bold uppercase tracking-[5px] text-cyan-600 text-brand">
        Medical Equipment and Accessories
      </SectionLabel>

      <CinematicHeading
        text="Autoclave Cum Shredder Sterilizer"
        className="mt-5 pt-2 text-4xl md:text-6xl font-black leading-[1.1] text-slate-900 dark:text-zinc-100"
      />

      <FadeUpText className="mt-8 max-w-4xl text-lg leading-9 text-gray-500 dark:text-zinc-400">
        The Integrated Autoclave with Shredder is designed by our
        experts with rich experience in the medical industry making
        use of leading technology as per the market standards.
      </FadeUpText>
    </div>

    {/* IMAGES */}
    <StaggerReveal className="mt-16 grid gap-6 md:grid-cols-3" stagger={0.1}>

      {[
        '/equipments/autoclave-1.jpg',
        '/equipments/autoclave-2.jpg',
        '/equipments/autoclave-3.jpg',
      ].map((img, i) => (

        <StaggerItem
          key={i}
          className="group relative overflow-hidden rounded-[35px] h-[340px] bg-card dark:bg-zinc-900 shadow-[0_25px_70px_rgba(0,0,0,0.08)]"
        >

          <img
            src={img}
            alt=""
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute bottom-5 left-5 rounded-full bg-white/10 px-5 py-2 backdrop-blur-xl">
            <p className="text-sm font-semibold text-white">
              Hospital Grade Equipment
            </p>
          </div>
        </StaggerItem>
      ))}
    </StaggerReveal>

    {/* SPECIFICATIONS */}
    <FadeUpBlock className="mt-20" id="section-9">

      <div className="flex items-center gap-4">
        <div className="h-12 w-2 rounded-full bg-cyan-500" />

        <CinematicHeading
          text="Specifications"
          as="h3"
          className="text-4xl font-black text-[#002B5B] dark:text-zinc-100"
        />
      </div>

      <div className="mt-10 max-w-full overflow-x-auto rounded-[35px] border border-slate-200 border-slate-200 dark:border-white/10 bg-card dark:bg-zinc-900 shadow-[0_25px_70px_rgba(0,0,0,0.06)]">

        <table className="w-full min-w-[520px] border-collapse">

          <tbody>

            {[
              [
                'Steriliser Type',
                'Horizontal Cylindrical High Speed Steam Steriliser',
              ],
              ['Chamber Capacity', '150 to 200 litre'],
              ['Certification', 'Conforms to third party certification'],
              [
                'Operation',
                'Fully automatic steam jacketed suitable for operation on electricity',
              ],
              [
                'Temperature Range',
                '121°C - 134°C',
              ],
              [
                'Cycle Time',
                'Configurable working temperature and sterilisation cycle time',
              ],
              [
                'Steam Generator',
                'Built-in electrically heated Steam Generator made of SS 316 (AISI 316) with low water protection system',
              ],
              [
                'Power Supply',
                'Works with 3 phase 400/440 V 50 Hz AC supply',
              ],
              [
                'Control System',
                'Microprocessor Controlled with preselected Sterilisation Programs',
              ],
            ].map((item, i) => (

              <tr
                key={i}
                className="border-b border-slate-200 dark:border-white/10 hover:bg-cyan-50/70 hover:bg-gray-50 dark:hover:bg-zinc-800 transition duration-300"
              >

                <td className="w-[35%] px-6 py-6 text-[15px] font-bold text-[#002B5B] text-brand">
                  {item[0]}
                </td>

                <td className="px-6 py-6 leading-8 text-gray-500 dark:text-zinc-400">
                  {item[1]}
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </FadeUpBlock>

    {/* CONSTRUCTION */}
    <FadeUpBlock className="mt-20" id="section-10">

      <div className="flex items-center gap-4">
        <div className="h-12 w-2 rounded-full bg-[#002B5B]" />

        <CinematicHeading
          text="Construction"
          as="h3"
          className="text-4xl font-black text-[#002B5B] dark:text-zinc-100"
        />
      </div>

      <div className="mt-10 max-w-full overflow-x-auto rounded-[35px] border border-slate-200 border-slate-200 dark:border-white/10 bg-card dark:bg-zinc-900 shadow-[0_25px_70px_rgba(0,0,0,0.06)]">

        <table className="w-full min-w-[520px] border-collapse">

          <tbody>

            {[
              ['Provision of Lock', 'Automatic Lock'],
              ['Type of Door', 'Hinged type'],
              [
                'Display Facility',
                'Chamber Temperature, Cycle Number, Batch Number, Time and Date, Alarm Indicator, Low Water Indicator',
              ],
              [
                'Print Facility',
                'Yes, by an inbuilt printer unit',
              ],
              ['Warranty Period', '3 year'],
              ['No of Doors', '1'],
              [
                'User Interface',
                'Touch screen interface',
              ],
              [
                'Data Transfer Facility',
                'Yes, through USB / RS232 port',
              ],
              [
                'Air Removal System',
                'Pressure/Vacuum pulsing for proper steam penetration',
              ],
            ].map((item, i) => (

              <tr
                key={i}
                className="border-b border-slate-200 dark:border-white/10 hover:bg-blue-50/70 hover:bg-gray-50 dark:hover:bg-zinc-800 transition duration-300"
              >

                <td className="w-[35%] px-6 py-6 font-bold text-[#002B5B] text-brand">
                  {item[0]}
                </td>

                <td className="px-6 py-6 leading-8 text-gray-500 dark:text-zinc-400">
                  {item[1]}
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </FadeUpBlock>

    {/* SHREDDER */}
    <FadeUpBlock className="mt-20" id="section-11">

      <div className="flex items-center gap-4">
        <div className="h-12 w-2 rounded-full bg-cyan-500" />

        <CinematicHeading
          text="Integrated Shredder Facility"
          as="h3"
          className="text-4xl font-black text-[#002B5B] dark:text-zinc-100"
        />
      </div>

      <div className="mt-10 overflow-hidden rounded-[35px] bg-gradient-to-br from-[#002B5B] via-[#004e96] to-[#0072d4] shadow-[0_25px_80px_rgba(0,91,187,0.35)]">

        <table className="w-full border-collapse">

          <tbody>

            {[
              [
                'Integrated Shredder',
                'Yes, with Microprocessor controlled',
              ],
              [
                'Shredder Material',
                'SS 316 or SS 316L',
              ],
              [
                'Motor Power',
                '>= 2 HP',
              ],
              [
                'Motor Speed',
                '>= 1000 RPM',
              ],
              [
                'Motor Supply',
                '220 V, 50 HZ AC motor',
              ],
              [
                'Waste Handling',
                'Able to deal with shredding of biomedical waste as per Steriliser capacity',
              ],
            ].map((item, i) => (

              <tr
                key={i}
                className="border-b border-white/10 hover:bg-white/10 transition duration-300"
              >

                <td className="w-[35%] px-6 py-6 font-bold text-cyan-200">
                  {item[0]}
                </td>

                <td className="px-6 py-6 leading-8 text-white/90">
                  {item[1]}
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </FadeUpBlock>

    {/* ACCESSORIES */}
    <FadeUpBlock className="mt-20" id="section-12">

      <div className="flex items-center gap-4">
        <div className="h-12 w-2 rounded-full bg-[#002B5B]" />

        <CinematicHeading
          text="Accessories"
          as="h3"
          className="text-4xl font-black text-[#002B5B] dark:text-zinc-100"
        />
      </div>

      <div className="mt-10 max-w-full overflow-x-auto rounded-[35px] border border-slate-200 border-slate-200 dark:border-white/10 bg-card dark:bg-zinc-900 shadow-[0_25px_70px_rgba(0,0,0,0.06)]">

        <table className="w-full min-w-[520px] border-collapse">

          <tbody>

            {[
              ['Number of Rails', '2'],
              ['Long Handle', '1'],
              ['Sterilisation Carriages', '1'],
              ['Pull out Trays/Tanks', '0'],
              ['Floor loading carts', '2'],
              ['Transfer carriages', '1'],
            ].map((item, i) => (

              <tr
                key={i}
                className="border-b border-slate-200 dark:border-white/10 hover:bg-cyan-50/70 hover:bg-gray-50 dark:hover:bg-zinc-800 transition duration-300"
              >

                <td className="w-[35%] px-6 py-6 font-bold text-[#002B5B] text-brand">
                  {item[0]}
                </td>

                <td className="px-6 py-6 leading-8 text-gray-500 dark:text-zinc-400">
                  {item[1]}
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </FadeUpBlock>

    {/* TAGS */}
    <StaggerReveal className="mt-16 flex flex-wrap gap-4" stagger={0.06}>

      {[
        'Fully Automatic',
        'Biomedical Waste Management',
        'Steam Sterilization',
        'Integrated Shredder',
        'Hospital Grade',
        'Touch Screen Interface',
        'Microprocessor Controlled',
        'High Speed Steriliser',
      ].map((tag, i) => (

        <StaggerItem
          key={i}
          className="rounded-full border border-slate-200 border-slate-200 dark:border-white/10 bg-card dark:bg-zinc-900 px-6 py-3 text-sm font-bold text-[#002B5B] text-slate-900 dark:text-zinc-100 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          {tag}
        </StaggerItem>
      ))}
    </StaggerReveal>
  </div>
</section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;