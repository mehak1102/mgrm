import React from 'react';
import {
  Award,
  ShieldCheck,
  ChevronRight,
  Quote,
  Sparkles,
} from 'lucide-react';
import { motion } from "framer-motion";

const productImages = [
  'abdomen.png',
  'ankle.png',
  'arm.png',
  'back.png',
  'calf.png',
  'collar.png',
  'elbow.png',
  'finger.png',
  'knee.png',
  'leg.png',
  'neck.png',
  'orth.png',
  'ribs.png',
  'shoulder.png',
  'thigh.png',
  'wrist.png',
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


const WordByWord = ({ text, className = "", gradient = false }) => {
  const words = text.split(" ");

  return (
    <div className={`flex flex-wrap justify-center ${className}`}>
      {words.map((word, index) => (
  
        <motion.span
  key={index}
  initial={{
    opacity: 0,
    y: -120,
    scale: 0.96,
    filter: "blur(14px)",
  }}
  animate={{
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  }}
  transition={{
    delay: 2.4,
    duration: 1.8,
    ease: [0.16, 1, 0.3, 1],
  }}
  className={`
    mr-4 inline-block will-change-transform
    ${gradient
      ? "bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent"
      : ""}
  `}
>
  {word}
</motion.span>
      ))}
    </div>
  );
};

const AboutUs = () => {
  return (
    <div className="relative overflow-hidden bg-[#eef7ff] dark:bg-slate-950 transition-colors duration-300">
      {/* BG */}
      <div className="absolute left-[-150px] top-[-150px] h-[450px] w-[450px] rounded-full bg-cyan-200/40 blur-3xl" />

      <div className="absolute bottom-[-150px] right-[-150px] h-[450px] w-[450px] rounded-full bg-blue-200/40 blur-3xl" />

      {/* HERO */}
      <section className="relative h-screen overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          // className="absolute inset-0 h-full w-full object-cover"
           className="absolute inset-0 h-full w-full object-cover brightness-110"
        >
          <source
            // src="/videos/medical-bg.mp4"
            src='/videos/slow.mp4'
            type="video/mp4"
          />
        </video>

        {/* <div className="absolute inset-0 bg-[#00172e]/75" /> */}
        <div className="absolute inset-0 bg-[#00172e]/40" />

        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto max-w-7xl px-6">
            {/* <div className="max-w-4xl"> */}
            <div className="max-w-5xl mx-auto text-center">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-xl">
                <Sparkles className="h-5 w-5 text-cyan-300" />

               {/* <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="text-lg md:text-xl font-semibold text-white tracking-widest text-center"
>
  <WordByWord text="MGRM Medicare Private Limited" />
</motion.div> */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
  className="text-lg md:text-xl font-semibold text-white tracking-widest text-center"
>
  <WordByWord text="MGRM Medicare Private Limited" />
</motion.div>
              </div>

              {/* <h1 className="text-5xl font-bold leading-tight text-white md:text-7xl">
                Revolutionizing
                <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  {' '}
                  Rehabilitation{' '}
                </span>
                Since 1994
              </h1> */}
          <h1 className="mt-8 text-center font-black leading-[0.92] tracking-[-2px] text-white">

<div className="overflow-hidden">
  <WordByWord
    text="Revolutionizing"
    className="justify-center text-[52px] md:text-[88px]"
  />
</div>

{/* <div className="overflow-hidden mt-2 flex justify-center">
  <div className="bg-gradient-to-r from-cyan-300 via-white to-blue-300 bg-clip-text text-transparent">
    <WordByWord
      text="Rehabilitation"
      className="justify-center text-[58px] md:text-[98px]"
    />
  </div>
</div> */}
 <WordByWord
  text="Rehabilitation"
  gradient={true}
  className="text-[58px] md:text-[98px]"
/>

<div className="overflow-hidden mt-3">
  <WordByWord
    text="Since 1994"
    className="justify-center text-[32px] md:text-[52px] tracking-[6px] text-white/85"
  />
</div>

</h1>

              {/* <p className="mt-10 max-w-3xl text-lg leading-9 text-gray-200">
                India’s leading rehabilitation and orthopedic healthcare
                technology company trusted by doctors, hospitals,
                defense forces and healthcare institutions nationwide.
              </p> */}
              <motion.p
  initial={{
    opacity: 0,
    y: 60,
    filter: "blur(8px)",
  }}
  animate={{
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  }}
  transition={{
    delay: 1.2,
    duration: 1.2,
    ease: [0.22, 1, 0.36, 1],
  }}
  className="mt-10 max-w-3xl text-lg leading-9 text-gray-200"
>
  India’s leading rehabilitation and orthopedic healthcare
  technology company trusted by doctors, hospitals,
  defense forces and healthcare institutions nationwide.
</motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-24">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* SIDEBAR */}
          <aside className="top-28 h-fit rounded-[35px] border border-white/70 dark:border-white/10 bg-white/70 dark:bg-slate-900/80 p-7 shadow-[0_20px_80px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:sticky transition-colors duration-300 lg:w-[320px]">
            <h2 className="mb-8 text-3xl font-bold text-[#002B5B] dark:text-white">
              About Us
            </h2>

            <div className="space-y-4">
              {sidebarLinks.map((item, index) => (
                <a
                  key={index}
                  href={`#section-${index}`}
                  className="group flex items-center justify-between rounded-2xl bg-[#f4f9ff] dark:bg-slate-800 px-5 py-4 font-medium text-gray-700 dark:text-gray-200 transition-all duration-300 hover:bg-[#002B5B] hover:text-white"
                >
                  {item}

                  <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </a>
              ))}
            </div>
          </aside>

          {/* CONTENT */}
          <div className="flex-1 space-y-10">
            {/* HISTORY */}
            <section
              id="section-0"
              className="overflow-hidden rounded-[40px] border border-white/70 dark:border-white/10 bg-white/80 dark:bg-slate-900/90 shadow-[0_20px_80px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-colors duration-300"
            >
              <div className="grid lg:grid-cols-2">
                <div className="p-10 lg:p-14">
                  <span className="text-sm font-semibold uppercase tracking-[5px] text-[#002B5B] dark:text-cyan-300">
                    Our History
                  </span>

                  <h2 className="mt-5 text-4xl font-bold text-[#002B5B] dark:text-white">
                    Transforming Rehabilitation In India
                  </h2>

                  <div className="mt-8 space-y-6 text-[16px] leading-8 text-gray-600 dark:text-zinc-300">
                    <p>
                      MGRM Medicare Private Limited was established in
                      1994 with a vision to revolutionize physical
                      rehabilitation and orthopedic healthcare in India.
                    </p>

                    <p>
                      The company pioneered innovative rehabilitation
                      products and introduced advanced orthopedic
                      splints and rehabilitation technologies across
                      India and South Asia.
                    </p>

                    <p>
                      Today, MGRM serves hospitals, defense forces,
                      institutions, emergency services and millions of
                      patients with world-class rehabilitation solutions.
                    </p>
                  </div>
                </div>

                <div className="relative min-h-[550px]">
                  <img
                    src="/products/orth.png"
                    alt=""
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#00172e]/60 to-transparent" />
                </div>
              </div>
            </section>

            {/* PRODUCT GRID */}
            <section className="rounded-[40px] border border-white/70 dark:border-white/10 bg-white/80 dark:bg-slate-900/90 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.35)] transition-colors duration-300">
              <div className="mb-12">
                <span className="text-sm font-semibold uppercase tracking-[5px] text-[#002B5B] dark:text-cyan-300">
                  Rehabilitation Products
                </span>

                <h2 className="mt-4 text-4xl font-bold text-[#002B5B] dark:text-white">
                  Orthopedic Product Categories
                </h2>
              </div>

              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className="group h-[360px] [perspective:1200px]"
                  >
                    <div
                      className="relative h-full w-full rounded-[32px] transition-all duration-700 group-hover:[transform:rotateY(180deg)]"
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* FRONT */}
                      <div
                        className="absolute inset-0 overflow-hidden rounded-[32px]"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                        }}
                      >
                        <img
                          src={`/products/${image}`}
                          alt=""
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                        <div className="absolute bottom-6 left-6">
                          <h3 className="text-2xl font-bold capitalize text-white">
                            {image.replace('.png', '')}
                          </h3>
                        </div>
                      </div>

                      {/* BACK */}
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[32px] border border-cyan-100 dark:border-white/10 bg-[#dff4ff] dark:bg-slate-800 p-8 text-center transition-colors duration-300 shadow-2xl"
                        style={{
                          transform: 'rotateY(180deg)',
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/70 to-blue-100/50 backdrop-blur-xl" />

                        <div className="relative z-10">
                          <h3 className="text-3xl font-bold capitalize text-[#002B5B] dark:text-white">
                            {image.replace('.png', '')}
                          </h3>

                          <p className="mt-5 leading-8 text-[#31506f] dark:text-gray-300">
                            Premium orthopedic rehabilitation support
                            designed for medical precision, recovery,
                            mobility and patient comfort.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ACHIEVEMENTS */}
            <section
              id="section-1"
              className="rounded-[40px] bg-gradient-to-br from-[#002B5B] via-[#003a75] to-[#0056a6] p-10 text-white"
            >
              <span className="text-sm font-semibold uppercase tracking-[5px] text-cyan-200">
                Achievements
              </span>

              <h2 className="mt-4 text-4xl font-bold">
                Trusted Across India
              </h2>

              <div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
                {achievements.map((item, index) => (
                  <div
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
                  </div>
                ))}
              </div>

              {/* Famous People */}
              <div className="mt-20">
                <h3 className="text-3xl font-bold">
                  First Citizen to the Common Man
                </h3>

                <p className="mt-6 max-w-5xl text-lg leading-9 text-gray-200">
                  MGRM products have been trusted by renowned leaders,
                  healthcare experts, sports personalities and millions
                  of loyal customers across India.
                </p>

                <div className="mt-10 grid gap-8 md:grid-cols-2">
                  {famousPeople.map((item, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-[35px] bg-white/10 backdrop-blur-xl"
                    >
                      <div className="grid md:grid-cols-2">
                        <img
                          src={item.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />

                        <div className="flex flex-col justify-center p-8">
                          <h4 className="text-3xl font-bold">
                            {item.name}
                          </h4>

                          <p className="mt-5 leading-8 text-gray-200">
                            Recognized personalities and national
                            leaders have trusted MGRM rehabilitation
                            and orthopedic products.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CERTIFICATIONS */}
            <section
              id="section-2"
              className="rounded-[40px] border border-white/70 dark:border-white/10 bg-white/80 dark:bg-slate-900/90 p-10 transition-colors duration-300"
            >
              <span className="text-sm font-semibold uppercase tracking-[5px] text-[#002B5B] dark:text-cyan-300">
                Certifications
              </span>

              <h2 className="mt-4 text-4xl font-bold text-[#002B5B] dark:text-white">
                Global Quality Standards
              </h2>

              <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {certifications.map((item, index) => (
                  <div
                    key={index}
                    className="group rounded-[30px] border border-blue-100 dark:border-white/10 bg-[#f5fbff] dark:bg-slate-900 p-8 text-center transition-colors duration-300 transition duration-300 hover:-translate-y-2 hover:bg-[#002B5B]"
                  >
                    <img
                      src={item.logo}
                      alt=""
                      className="mx-auto h-16 object-contain"
                    />

                    <h3 className="mt-6 text-2xl font-bold text-[#002B5B] dark:text-white transition group-hover:text-white">
                      {item.name}
                    </h3>
                  </div>
                ))}
              </div>
            </section>

            {/* TIMELINE */}
            <section
              id="section-3"
              className="rounded-[40px] border border-white/70 dark:border-white/10 bg-white/80 dark:bg-slate-900/90 p-10 transition-colors duration-300"
            >
              <span className="text-sm font-semibold uppercase tracking-[5px] text-[#002B5B] dark:text-cyan-300">
                MGRM Timeline
              </span>

              <h2 className="mt-4 text-4xl font-bold text-[#002B5B] dark:text-white">
                Journey Through The Years
              </h2>

              <div className="relative mt-24 overflow-x-auto pb-10">
                <div className="relative flex min-w-[1100px] items-center justify-between">
                  <div className="absolute left-0 top-1/2 h-[4px] w-full -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-300 to-[#002B5B]" />

                  {timeline.map((item, index) => (
                    <div
                      key={index}
                      className="group relative z-10 flex w-[180px] flex-col items-center"
                    >
                      <div className="h-7 w-7 rounded-full border-4 border-white bg-[#002B5B] shadow-xl transition duration-300 group-hover:scale-125" />

                      <div className="mt-8 rounded-[30px] bg-[#f5fbff] dark:bg-slate-800 p-6 text-center shadow-xl transition-colors duration-300 transition duration-500 group-hover:-translate-y-4">
                        <h3 className="text-3xl font-bold text-[#002B5B] dark:text-white">
                          {item.year}
                        </h3>

                        <p className="mt-4 leading-7 text-gray-600 dark:text-zinc-300">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* LEADERSHIP */}
            <section
              id="section-4"
              className="rounded-[40px] bg-gradient-to-br from-[#00172e] to-[#003a75] p-10 text-white"
            >
              <span className="text-sm font-semibold uppercase tracking-[5px] text-cyan-200">
                Leadership
              </span>

              <h2 className="mt-4 text-4xl font-bold">
                Visionary Healthcare Leadership
              </h2>

              <p className="mt-8 max-w-4xl text-lg leading-9 text-gray-200">
                MGRM Medicare is led by highly experienced healthcare
                professionals and rehabilitation experts with decades of
                expertise in medical technologies, innovation and patient care.
              </p>
            </section>

            {/* TESTIMONIALS */}
            <section
              id="section-5"
              className="rounded-[40px] border border-white/70 dark:border-white/10 bg-white/80 dark:bg-slate-900/90 p-10 transition-colors duration-300"
            >
              <span className="text-sm font-semibold uppercase tracking-[5px] text-[#002B5B] dark:text-cyan-300">
                Testimonials
              </span>

              <h2 className="mt-4 text-4xl font-bold text-[#002B5B] dark:text-white">
                What Medical Experts Say
              </h2>

              <div className="mt-12 grid gap-8 md:grid-cols-2">
                {testimonials.map((item, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-[35px] border border-blue-100 dark:border-white/10 bg-[#f8fcff] dark:bg-slate-900 shadow-lg transition-colors duration-300 duration-300 hover:-translate-y-3"
                  >
                    <div className="grid md:grid-cols-[220px_1fr]">
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />

                      <div className="p-8">
                        <Quote className="h-14 w-14 text-cyan-300" />

                        <p className="mt-6 text-lg leading-9 text-gray-600 dark:text-zinc-300">
                          “{item.text}”
                        </p>

                        <h4 className="mt-7 text-2xl font-bold text-[#002B5B]">
                          {item.name}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ================= CURE TO CARE SECTION ================= */}
<section
  id="section-6"
  className="relative overflow-hidden rounded-[42px] border border-white/70 dark:border-white/10 bg-white/80 dark:bg-slate-900/90 p-10 shadow-[0_20px_80px_rgba(0,0,0,0.06)] transition-colors duration-300"
>

  {/* BG GLOW */}
  <div className="absolute -top-20 -right-20 h-[260px] w-[260px] rounded-full bg-cyan-300/20 blur-3xl" />

  <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2">

    {/* LEFT CONTENT */}
    <div>

      <p className="text-sm font-bold uppercase tracking-[5px] text-cyan-500">
        Cure to Care™
      </p>

      <h2 className="mt-5 text-5xl font-black leading-tight text-[#002B5B] dark:text-white">
        Complete Eye Care &
        Rehabilitation Solutions
      </h2>

      <p className="mt-8 text-[17px] leading-9 text-slate-600 dark:text-gray-300">
        Under the banner of Cure to Care concept, MGRM Medicare has
        forayed into the distribution and marketing of the complete
        range of medicines for eye care and rehabilitation catering
        to the four-phase treatment protocol of prevention,
        pre-treatment, treatment and post-treatment patient care.
      </p>

      <p className="mt-6 text-[17px] leading-9 text-slate-600 dark:text-gray-300">
        The products are available in the domestic market and over
        50 international markets under the brand name ‘MGRM’.
      </p>
      <div className="mt-8 border-l-4 border-cyan-400 pl-6">
  <p className="text-2xl font-semibold italic leading-10 text-[#002B5B] dark:text-white">
    “MGRM products are designed to support recovery before surgery
    and accelerate rehabilitation after surgery.”
  </p>
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
            className="rounded-full border border-cyan-100 dark:border-white/10 bg-cyan-50 dark:bg-slate-800 px-5 py-3 text-sm font-bold text-[#002B5B] dark:text-white"
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
          className="h-[520px] w-full object-contain bg-[#eef7ff] dark:bg-slate-950  transition duration-700 hover:scale-[1.02]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#00172e]/60 via-transparent to-transparent" />

        {/* FLOAT CARD */}
        <div className="absolute bottom-8 left-8 rounded-[25px] border border-white/20 bg-white/10 px-6 py-5 backdrop-blur-xl">

          <h4 className="text-3xl font-black text-white">
            50+
          </h4>

          <p className="mt-1 text-sm text-white/80">
            International Markets
          </p>
        </div>
      </div>
    </div>
  </div>
</section>


{/* ================= PARTNER PROGRAM SECTION ================= */}
{/* <section
  id="section-7"
  className="relative overflow-hidden rounded-[45px] bg-white dark:bg-slate-900 border border-white/60 dark:border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.08)]"
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

      <span className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-600 dark:text-cyan-400">
        PARTNER PROGRAM
      </span>

      <h2 className="mt-5 text-5xl font-black leading-tight text-[#002B5B] dark:text-white">
        Become Our <br />
        Distribution Partner
      </h2>

      <div className="mt-8 space-y-6 text-lg leading-9 text-slate-600 dark:text-gray-300">

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

      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover scale-[1.12]"
      >
        <source
          src="/videos/handshake.mp4"
          type="video/mp4"
        />
      </video>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00152d]/70 via-[#00152d]/25 to-transparent" />

      {/* OPTIONAL GLOW */}
      <div className="absolute -left-10 top-10 h-[240px] w-[240px] rounded-full bg-cyan-400/20 blur-3xl" />
    </div>

    {/* CONTENT SIDE */}
    <div className="relative z-10 p-10 md:p-16 text-white">

      <span className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-5 py-2 text-sm font-bold tracking-[0.25em] text-cyan-300 backdrop-blur-xl">
        GLOBAL NETWORK
      </span>

      <h2 className="mt-7 text-5xl font-black leading-tight">
        Partner <br />
        Program
      </h2>

      <p className="mt-8 text-lg leading-9 text-white/80">
        Interested in becoming our distribution partner?
        Do you want us to market your product line?
        MGRM Medicare Limited has successfully launched
        partnerships with companies all over the world and
        we’re always looking to expand our network.
      </p>

      <p className="mt-6 text-lg leading-9 text-cyan-200 font-medium">
        Contact us today to learn more and become a part
        of our growing healthcare ecosystem.
      </p>

      {/* STATS */}
      <div className="mt-12 grid grid-cols-3 gap-5">

        <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h3 className="text-4xl font-black text-cyan-300">
            50+
          </h3>

          <p className="mt-2 text-sm text-white/70">
            Global Markets
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h3 className="text-4xl font-black text-cyan-300">
            100+
          </h3>

          <p className="mt-2 text-sm text-white/70">
            Distribution Partners
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h3 className="text-4xl font-black text-cyan-300">
            30+
          </h3>

          <p className="mt-2 text-sm text-white/70">
            Years Experience
          </p>
        </div>
      </div>

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
<section    id="section-8" className="relative overflow-hidden rounded-[45px] border border-white/70 dark:border-white/10 bg-white/80 dark:bg-slate-900/90 p-6 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.35)]">

  {/* BG EFFECTS */}
  <div className="absolute top-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-cyan-200/30 blur-3xl" />

  <div className="absolute bottom-[-120px] left-[-120px] h-[300px] w-[300px] rounded-full bg-blue-200/20 blur-3xl" />

  <div className="relative z-10 pt-6">

    {/* TOP */}
    <div className="max-w-5xl">

      <p className="text-sm font-bold uppercase tracking-[5px] text-cyan-600 dark:text-cyan-300 animate-fade-up">
        Medical Equipment and Accessories
      </p>

      {/* <h2 className="mt-5 text-4xl md:text-6xl font-black leading-tight text-[#002B5B] dark:text-white animate-fade-up">
        Autoclave Cum <br />
        Shredder Sterilizer
      </h2> */}
      <h2 className="mt-5 pt-2 text-4xl md:text-6xl font-black leading-[1.1] text-slate-900 dark:text-white">
  Autoclave Cum <br />
  Shredder Sterilizer
</h2>

      <p className="mt-8 max-w-4xl text-lg leading-9 text-gray-600 dark:text-gray-300 animate-fade-up">
        The Integrated Autoclave with Shredder is designed by our
        experts with rich experience in the medical industry making
        use of leading technology as per the market standards.
      </p>
    </div>

    {/* IMAGES */}
    <div className="mt-16 grid gap-6 md:grid-cols-3">

      {[
        '/equipments/autoclave-1.jpg',
        '/equipments/autoclave-2.jpg',
        '/equipments/autoclave-3.jpg',
      ].map((img, i) => (

        <div
          key={i}
          className="group relative overflow-hidden rounded-[35px] h-[340px] bg-white dark:bg-slate-900 shadow-[0_25px_70px_rgba(0,0,0,0.08)] animate-fade-up"
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
        </div>
      ))}
    </div>

    {/* SPECIFICATIONS */}
    <div className="mt-20 animate-fade-up " id="section-9">

      <div className="flex items-center gap-4">
        <div className="h-12 w-2 rounded-full bg-cyan-500" />

        <h3 className="text-4xl font-black text-[#002B5B] dark:text-white">
          Specifications
        </h3>
      </div>

      <div className="mt-10 overflow-hidden rounded-[35px] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-[0_25px_70px_rgba(0,0,0,0.06)]">

        <table className="w-full border-collapse">

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
                className="border-b border-slate-100 dark:border-white/10 hover:bg-cyan-50/70 dark:hover:bg-slate-800 transition duration-300"
              >

                <td className="w-[35%] px-6 py-6 text-[15px] font-bold text-[#002B5B] dark:text-cyan-300">
                  {item[0]}
                </td>

                <td className="px-6 py-6 leading-8 text-gray-600 dark:text-gray-300">
                  {item[1]}
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>

    {/* CONSTRUCTION */}
    <div className="mt-20 animate-fade-up" id="section-10">

      <div className="flex items-center gap-4">
        <div className="h-12 w-2 rounded-full bg-[#002B5B]" />

        <h3 className="text-4xl font-black text-[#002B5B] dark:text-white">
          Construction
        </h3>
      </div>

      <div className="mt-10 overflow-hidden rounded-[35px] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-[0_25px_70px_rgba(0,0,0,0.06)]">

        <table className="w-full border-collapse">

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
                className="border-b border-slate-100 dark:border-white/10 hover:bg-blue-50/70 dark:hover:bg-slate-800 transition duration-300"
              >

                <td className="w-[35%] px-6 py-6 font-bold text-[#002B5B] dark:text-cyan-300">
                  {item[0]}
                </td>

                <td className="px-6 py-6 leading-8 text-gray-600 dark:text-gray-300">
                  {item[1]}
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>

    {/* SHREDDER */}
    <div className="mt-20 animate-fade-up" id="section-11">

      <div className="flex items-center gap-4">
        <div className="h-12 w-2 rounded-full bg-cyan-500" />

        <h3 className="text-4xl font-black text-[#002B5B] dark:text-white">
          Integrated Shredder Facility
        </h3>
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
    </div>

    {/* ACCESSORIES */}
    <div className="mt-20 animate-fade-up" id="section-12">

      <div className="flex items-center gap-4">
        <div className="h-12 w-2 rounded-full bg-[#002B5B]" />

        <h3 className="text-4xl font-black text-[#002B5B] dark:text-white">
          Accessories
        </h3>
      </div>

      <div className="mt-10 overflow-hidden rounded-[35px] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-[0_25px_70px_rgba(0,0,0,0.06)]">

        <table className="w-full border-collapse">

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
                className="border-b border-slate-100 dark:border-white/10 hover:bg-cyan-50/70 dark:hover:bg-slate-800 transition duration-300"
              >

                <td className="w-[35%] px-6 py-6 font-bold text-[#002B5B] dark:text-cyan-300">
                  {item[0]}
                </td>

                <td className="px-6 py-6 leading-8 text-gray-600 dark:text-gray-300">
                  {item[1]}
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>

    {/* TAGS */}
    <div className="mt-16 flex flex-wrap gap-4 animate-fade-up">

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

        <div
          key={i}
          className="rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-bold text-[#002B5B] dark:text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          {tag}
        </div>
      ))}
    </div>
  </div>
</section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;