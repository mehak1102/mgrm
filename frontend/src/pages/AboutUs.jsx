// import React from 'react';
// import {
//   Award,
//   ShieldCheck,
//   ChevronRight,
//   Quote,
//   Sparkles,
// } from 'lucide-react';

// const productImages = [
//   'abdomen.png',
//   'ankle.png',
//   'arm.png',
//   'back.png',
//   'calf.png',
//   'collar.png',
//   'elbow.png',
//   'finger.png',
//   'knee.png',
//   'leg.png',
//   'neck.png',
//   'orth.png',
//   'ribs.png',
//   'shoulder.png',
//   'thigh.png',
//   'wrist.png',
// ];

// const timeline = [
//   {
//     year: '1994',
//     title: 'MGRM Medicare Incorporated',
//   },
//   {
//     year: '1995',
//     title: 'Manufacturing Started',
//   },
//   {
//     year: '1997',
//     title: 'First US FDA Registration',
//   },
//   {
//     year: '2005',
//     title: 'WHO GMP Certification',
//   },
//   {
//     year: '2007',
//     title: 'NDMA Expert Committee Invitation',
//   },
//   {
//     year: '2008',
//     title: 'Steering Committee Member - NDMA',
//   },
// ];

// const sidebarLinks = [
//   'Our History',
//   'Achievements',
//   'Quality Certifications',
//   'MGRM Timelines',
//   'Leadership',
//   'Testimonials',
// ];

// const AboutUs = () => {
//   return (
//     <div className="relative overflow-hidden bg-[#eef5fb]">
//       {/* BG */}
//       <div className="absolute left-[-150px] top-[-150px] h-[420px] w-[420px] rounded-full bg-cyan-200/40 blur-3xl" />
//       <div className="absolute bottom-[-180px] right-[-180px] h-[450px] w-[450px] rounded-full bg-blue-200/40 blur-3xl" />

//       {/* HERO */}
//       <section className="relative h-screen overflow-hidden">
//         <video
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="absolute inset-0 h-full w-full object-cover"
//         >
//           <source
//             src="/videos/medical-bg.mp4"
//             type="video/mp4"
//           />
//         </video>

//         <div className="absolute inset-0 bg-[#001224]/70 backdrop-blur-[2px]" />

//         <div className="relative z-10 flex h-full items-center">
//           <div className="mx-auto max-w-7xl px-6">
//             <div className="max-w-4xl">
//               <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-2xl">
//                 <Sparkles className="h-5 w-5 text-cyan-300" />

//                 <span className="text-sm font-medium text-white">
//                   MGRM Medicare Private Limited
//                 </span>
//               </div>

//               <h1 className="text-5xl font-black leading-tight text-white md:text-7xl">
//                 Revolutionizing
//                 <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
//                   {' '}
//                   Rehabilitation{' '}
//                 </span>
//                 Since 1994
//               </h1>

//               <p className="mt-10 max-w-3xl text-lg leading-9 text-gray-200 md:text-xl">
//                 India’s leading rehabilitation and medical technology company
//                 trusted by hospitals, doctors, institutions, defense forces and
//                 healthcare professionals nationwide.
//               </p>

//               <div className="mt-12 flex flex-wrap gap-5">
//                 <button className="rounded-2xl bg-white dark:bg-zinc-900 px-8 py-4 font-semibold text-[#002B5B] shadow-xl transition duration-300 hover:scale-105">
//                   Explore Company
//                 </button>

//                 <button className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-xl transition duration-300 hover:bg-white dark:bg-zinc-900 hover:text-[#002B5B]">
//                   Discover Products
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* MAIN */}
//       <section className="relative z-10 mx-auto max-w-7xl px-4 py-24">
//         <div className="flex flex-col gap-10 lg:flex-row">
//           {/* SIDEBAR */}
//           <aside className="top-28 h-fit w-full rounded-[35px] border border-white/60 bg-white/60 dark:bg-zinc-900/60 p-7 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl lg:sticky lg:w-[320px]">
//             <h2 className="mb-8 text-3xl font-black text-[#002B5B]">
//               About Us
//             </h2>

//             <div className="space-y-4">
//               {sidebarLinks.map((item, index) => (
//                 <a
//                   key={index}
//                   href={`#section-${index}`}
//                   className="group flex items-center justify-between rounded-2xl border border-transparent bg-white/40 px-5 py-4 text-[15px] font-medium text-gray-700 dark:text-zinc-200 transition-all duration-300 hover:border-blue-100 hover:bg-[#002B5B] hover:text-white"
//                 >
//                   {item}

//                   <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
//                 </a>
//               ))}
//             </div>
//           </aside>

//           {/* CONTENT */}
//           <div className="flex-1 space-y-10">
//             {/* HISTORY */}
//             <section
//               id="section-0"
//               className="overflow-hidden rounded-[40px] border border-white/70 bg-white/70 shadow-[0_20px_80px_rgba(0,0,0,0.06)] backdrop-blur-2xl"
//             >
//               <div className="grid items-center lg:grid-cols-2">
//                 <div className="p-10 lg:p-14">
//                   <span className="text-sm font-bold uppercase tracking-[5px] text-[#002B5B]">
//                     Our History
//                   </span>

//                   <h2 className="mt-5 text-4xl font-black leading-tight text-[#002B5B]">
//                     Transforming Rehabilitation In India
//                   </h2>

//                   <div className="mt-8 space-y-6 text-[16px] leading-8 text-gray-600 dark:text-zinc-300">
//                     <p>
//                       Established in 1994, MGRM Medicare pioneered affordable
//                       rehabilitation technologies across India and South Asia.
//                     </p>

//                     <p>
//                       During the 1980s and early 1990s rehabilitation products
//                       were limited and mostly imported.
//                     </p>

//                     <p>
//                       MGRM transformed the industry with innovative orthopedic
//                       splints, emergency rehabilitation systems and advanced
//                       patient care technologies.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="relative h-full min-h-[550px]">
//                   <img
//                     src="/products/orth.png"
//                     alt=""
//                     className="h-full w-full object-cover"
//                   />

//                   <div className="absolute inset-0 bg-gradient-to-t from-[#00152d]/70 to-transparent" />
//                 </div>
//               </div>
//             </section>

//             {/* PRODUCTS */}
//             <section className="rounded-[40px] border border-white/70 bg-white/70 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.06)] backdrop-blur-2xl">
//               <div className="mb-12">
//                 <span className="text-sm font-bold uppercase tracking-[5px] text-[#002B5B]">
//                   Rehabilitation Products
//                 </span>

//                 <h2 className="mt-4 text-4xl font-black text-[#002B5B]">
//                   Orthopedic Product Categories
//                 </h2>
//               </div>

//               <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                 {productImages.map((image, index) => (
//                   <div
//                     key={index}
//                     className="group h-[360px] [perspective:1500px]"
//                   >
//                     <div
//                       className="relative h-full w-full rounded-[32px] transition-all duration-700 group-hover:[transform:rotateY(180deg)]"
//                       style={{
//                         transformStyle: 'preserve-3d',
//                       }}
//                     >
//                       {/* FRONT */}
//                       <div
//                         className="absolute inset-0 overflow-hidden rounded-[32px] border border-white/20"
//                         style={{
//                           backfaceVisibility: 'hidden',
//                           WebkitBackfaceVisibility: 'hidden',
//                         }}
//                       >
//                         <img
//                           src={`/products/${image}`}
//                           alt=""
//                           className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
//                         />

//                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

//                         <div className="absolute bottom-6 left-6">
//                           <h3 className="text-2xl font-bold capitalize text-white">
//                             {image.replace('.png', '')}
//                           </h3>
//                         </div>
//                       </div>

//                       {/* BACK */}
//                       <div
//                         className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[32px] border border-white/30 bg-white/10 p-8 text-center text-white shadow-2xl backdrop-blur-3xl"
//                         style={{
//                           transform: 'rotateY(180deg)',
//                           backfaceVisibility: 'hidden',
//                           WebkitBackfaceVisibility: 'hidden',
//                         }}
//                       >
//                         <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/20 to-cyan-100/10 backdrop-blur-3xl" />

//                         <div className="relative z-10">
//                           <h3 className="text-3xl font-black capitalize text-white">
//                             {image.replace('.png', '')}
//                           </h3>

//                           <p className="mt-5 leading-8 text-white/90">
//                             Advanced orthopedic and rehabilitation support
//                             designed for superior comfort, stability and medical
//                             precision.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* ACHIEVEMENTS */}
//             <section
//               id="section-1"
//               className="rounded-[40px] bg-gradient-to-br from-[#001a36] via-[#003a75] to-[#0059b2] p-10 text-white shadow-[0_20px_80px_rgba(0,0,0,0.12)]"
//             >
//               <span className="text-sm font-bold uppercase tracking-[5px] text-cyan-200">
//                 Achievements
//               </span>

//               <h2 className="mt-4 text-4xl font-black">
//                 Trusted Across India
//               </h2>

//               <div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
//                 {[
//                   'Indian Armed Forces',
//                   'NDMA Recognition',
//                   'Healthcare Innovation',
//                   'National Quality Awards',
//                 ].map((item, index) => (
//                   <div
//                     key={index}
//                     className="rounded-[30px] border border-white/10 bg-white/10 p-8 backdrop-blur-2xl transition duration-300 hover:-translate-y-2"
//                   >
//                     <Award className="h-12 w-12 text-cyan-300" />

//                     <h3 className="mt-6 text-2xl font-bold">
//                       {item}
//                     </h3>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* CERTIFICATIONS */}
//             <section
//               id="section-2"
//               className="rounded-[40px] border border-white/70 bg-white/70 p-10 shadow-[0_20px_80px_rgba(0,0,0,0.06)] backdrop-blur-2xl"
//             >
//               <span className="text-sm font-bold uppercase tracking-[5px] text-[#002B5B]">
//                 Certifications
//               </span>

//               <h2 className="mt-4 text-4xl font-black text-[#002B5B]">
//                 Global Quality Standards
//               </h2>

//               <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
//                 {[
//                   'FDA Approval',
//                   'CE Certification',
//                   'WHO GMP',
//                   'ISO 9001',
//                   'ISO 13485',
//                   'ISO 14001',
//                   'OHSAS 18001',
//                   'ANVISA',
//                 ].map((item, index) => (
//                   <div
//                     key={index}
//                     className="group rounded-[28px] border border-blue-100 bg-[#f7fbff] p-7 transition duration-300 hover:-translate-y-2 hover:bg-[#002B5B]"
//                   >
//                     <ShieldCheck className="h-12 w-12 text-[#002B5B] transition group-hover:text-cyan-300" />

//                     <h3 className="mt-6 text-2xl font-bold text-[#002B5B] dark:text-white transition group-hover:text-white">
//                       {item}
//                     </h3>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* TIMELINE */}
//             <section
//               id="section-3"
//               className="rounded-[40px] border border-white/70 bg-white/70 p-10 shadow-[0_20px_80px_rgba(0,0,0,0.06)] backdrop-blur-2xl"
//             >
//               <span className="text-sm font-bold uppercase tracking-[5px] text-[#002B5B]">
//                 MGRM Timeline
//               </span>

//               <h2 className="mt-4 text-4xl font-black text-[#002B5B]">
//                 Journey Through The Years
//               </h2>

//               <div className="relative mt-24 overflow-x-auto pb-10">
//                 <div className="relative flex min-w-[1100px] items-center justify-between">
//                   <div className="absolute left-0 top-1/2 h-[5px] w-full -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-300 to-[#002B5B]" />

//                   {timeline.map((item, index) => (
//                     <div
//                       key={index}
//                       className="group relative z-10 flex w-[180px] flex-col items-center"
//                     >
//                       <div className="h-7 w-7 rounded-full border-4 border-white bg-[#002B5B] shadow-xl transition duration-300 group-hover:scale-125" />

//                       <div className="mt-8 rounded-[30px] border border-white/60 bg-white/70 p-6 text-center shadow-xl backdrop-blur-xl transition duration-500 group-hover:-translate-y-4">
//                         <h3 className="text-3xl font-black text-[#002B5B]">
//                           {item.year}
//                         </h3>

//                         <p className="mt-4 leading-7 text-gray-600 dark:text-zinc-300">
//                           {item.title}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </section>

//             {/* LEADERSHIP */}
//             <section
//               id="section-4"
//               className="rounded-[40px] bg-gradient-to-br from-[#00152d] to-[#003a75] p-10 text-white shadow-[0_20px_80px_rgba(0,0,0,0.12)]"
//             >
//               <span className="text-sm font-bold uppercase tracking-[5px] text-cyan-200">
//                 Leadership
//               </span>

//               <h2 className="mt-4 text-4xl font-black">
//                 Visionary Healthcare Leadership
//               </h2>

//               <p className="mt-8 max-w-4xl text-lg leading-9 text-gray-200">
//                 MGRM Medicare is led by experienced healthcare professionals
//                 with decades of expertise in rehabilitation technologies,
//                 innovation and patient care systems.
//               </p>
//             </section>

//             {/* TESTIMONIALS */}
//             <section
//               id="section-5"
//               className="rounded-[40px] border border-white/70 bg-white/70 p-10 shadow-[0_20px_80px_rgba(0,0,0,0.06)] backdrop-blur-2xl"
//             >
//               <span className="text-sm font-bold uppercase tracking-[5px] text-[#002B5B]">
//                 Testimonials
//               </span>

//               <h2 className="mt-4 text-4xl font-black text-[#002B5B]">
//                 What Medical Experts Say
//               </h2>

//               <div className="mt-12 grid gap-8 md:grid-cols-2">
//                 {[
//                   {
//                     name: 'Dr P K Dave',
//                     text:
//                       'MGRM products are versatile, light and extremely user friendly.',
//                   },
//                   {
//                     name: 'Dr K K Saini',
//                     text:
//                       'Excellent orthopedic supports meeting clinical requirements.',
//                   },
//                   {
//                     name: 'Maj Gen B B Dutta',
//                     text:
//                       'MGRM products are highly appreciated in Armed Forces.',
//                   },
//                   {
//                     name: 'Dr A K Singh',
//                     text:
//                       'Their cervical rehabilitation products are outstanding.',
//                   },
//                 ].map((item, index) => (
//                   <div
//                     key={index}
//                     className="group rounded-[35px] border border-white/70 bg-white/70 p-8 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-3"
//                   >
//                     <Quote className="h-14 w-14 text-cyan-300" />

//                     <p className="mt-6 text-lg leading-9 text-gray-600 dark:text-zinc-300">
//                       “{item.text}”
//                     </p>

//                     <h4 className="mt-7 text-2xl font-black text-[#002B5B]">
//                       {item.name}
//                     </h4>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AboutUs;


import React from 'react';
import {
  Award,
  ShieldCheck,
  ChevronRight,
  Quote,
  Sparkles,
} from 'lucide-react';

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
           className="absolute inset-0 h-full w-full object-cover brightness-100"
        >
          <source
            // src="/videos/medical-bg.mp4"
            src='/videos/hey.mp4'
            type="video/mp4"
          />
        </video>

        {/* <div className="absolute inset-0 bg-[#00172e]/75" /> */}
        <div className="absolute inset-0 bg-[#00172e]/40" />

        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-4xl">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-xl">
                <Sparkles className="h-5 w-5 text-cyan-300" />

                <span className="text-sm font-medium text-white">
                  MGRM Medicare Private Limited
                </span>
              </div>

              <h1 className="text-5xl font-bold leading-tight text-white md:text-7xl">
                Revolutionizing
                <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  {' '}
                  Rehabilitation{' '}
                </span>
                Since 1994
              </h1>

              <p className="mt-10 max-w-3xl text-lg leading-9 text-gray-200">
                India’s leading rehabilitation and orthopedic healthcare
                technology company trusted by doctors, hospitals,
                defense forces and healthcare institutions nationwide.
              </p>
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;