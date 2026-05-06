// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { mgrmCategories } from "../data/siteData";

// const flowItems = [
//   { name: "Neck", query: "Neck", color: "#0ea5e9", label: { x: 48, y: 15 }, side: "left", row: 6 },
//   { name: "Shoulder", query: "Shoulder", color: "#84cc16", label: { x: 42, y: 30 }, side: "left", row: 18 },
//   { name: "Back", query: "Back", color: "#dc7b61", label: { x: 35, y: 39 }, side: "left", row: 34 },
//   { name: "Abdominal", query: "Abdominal", color: "#f97316", label: { x: 58, y: 46 }, side: "right", row: 36 },
//   { name: "Wrist", query: "Wrist", color: "#ec5f8d", label: { x: 64, y: 31 }, side: "right", row: 12 },
//   { name: "Finger", query: "Finger", color: "#4db6a5", label: { x: 70, y: 39 }, side: "right", row: 25 },
//   { name: "Knee", query: "Knee", color: "#7c6cff", label: { x: 60, y: 66 }, side: "right", row: 55 },
//   { name: "Ankle And Foot", query: "Ankle And Foot", color: "#ef4444", label: { x: 60, y: 82 }, side: "right", row: 72 },
// ];

// function getCat(name) {
//   return mgrmCategories.find((c) => c.query === name || c.name === name) || mgrmCategories[0];
// }

// function ThumbGrid({ item }) {
//   const cat = getCat(item.query);
//   const count = item.side === "left" ? 4 : 6;
//   const thumbs = Array.from({ length: count }, (_, i) => i);

//   return (
//     <>
//       {thumbs.map((_, index) => {
//         const col = item.side === "left" ? index % 4 : index % 3;
//         const row = Math.floor(index / (item.side === "left" ? 4 : 3));
//         const x = item.side === "left" ? 6 + col * 5.5 : 79 + col * 5.5;
//         const y = item.row + row * 8.5;

//         return (
//           <motion.button
//             key={`${item.name}-${index}`}
//             initial={{ opacity: 0, scale: 0.75, y: 18 }}
//             whileInView={{ opacity: 1, scale: 1, y: 0 }}
//             transition={{ duration: 0.55, delay: 0.35 + index * 0.08 }}
//             className="absolute z-20 w-16 h-16 bg-white overflow-hidden shadow-md hover:scale-110 transition"
//             style={{ left: `${x}%`, top: `${y}%`, border: `2px solid ${item.color}` }}
//           >
//             <img src={cat.image} onError={(e) => (e.currentTarget.src = "/products/knee.png")} className="w-full h-full object-cover" />
//           </motion.button>
//         );
//       })}
//     </>
//   );
// }

// export default function BodyFlowMap() {
//   const navigate = useNavigate();

//   const go = (query) => {
//     navigate(`/shop?category=${encodeURIComponent(query)}`);
//   };

//   return (
//     <section className="relative bg-white py-16 overflow-hidden">
//       <div className="max-w-[1600px] mx-auto px-4">
//         <motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-8">
//           <h2 className="text-5xl md:text-7xl font-black text-gray-700">
//             <span className="text-red-500">248</span> world class certified products
//           </h2>
//           <p className="text-2xl md:text-4xl font-black text-gray-500 mt-2">
//             to heal and rehabilitate comfortably
//           </p>
//         </motion.div>

//         <div className="relative h-[860px] bg-white rounded-[36px] overflow-hidden">
//           <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
//             {flowItems.map((item, index) => {
//               const startX = item.label.x;
//               const startY = item.label.y + 4;
//               const endX = item.side === "left" ? 21 : 79;
//               const midX = item.side === "left" ? startX - 10 : startX + 10;

//               return (
//                 <motion.path
//                   key={item.name}
//                   d={`M ${startX} ${startY} H ${midX} V ${item.row + 4} H ${endX}`}
//                   fill="none"
//                   stroke={item.color}
//                   strokeWidth="0.28"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   initial={{ pathLength: 0, opacity: 0 }}
//                   whileInView={{ pathLength: 1, opacity: 1 }}
//                   transition={{ duration: 2.2, ease: "easeInOut", delay: index * 0.18 }}
//                 />
//               );
//             })}
//           </svg>

//           <motion.img
//             initial={{ opacity: 0, scale: 0.92 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 1.1 }}
//             src="/products/image.png"
//             onError={(e) => {
//               e.currentTarget.src = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80";
//             }}
//             className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 h-[720px] object-contain z-10"
//           />

//           {flowItems.map((item, index) => {
//             const cat = getCat(item.query);
//             return (
//               <motion.button
//                 key={item.name}
//                 initial={{ opacity: 0, scale: 0.75 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.6, delay: 0.25 + index * 0.12 }}
//                 onClick={() => go(item.query)}
//                 className="absolute z-30 w-24 rounded-xl overflow-hidden shadow-xl hover:scale-110 transition bg-white"
//                 style={{ left: `${item.label.x}%`, top: `${item.label.y}%`, border: `3px solid ${item.color}` }}
//               >
//                 <div className="text-[11px] font-black py-1 text-center text-black" style={{ background: item.color }}>
//                   {item.name}
//                 </div>
//                 <img src={cat.image} onError={(e) => (e.currentTarget.src = "/products/knee.png")} className="w-full h-20 object-cover bg-gray-100" />
//               </motion.button>
//             );
//           })}

//           {flowItems.map((item) => (
//             <ThumbGrid key={item.name} item={item} />
//           ))}

//           <div className="absolute right-8 bottom-8 z-40 grid grid-cols-2 gap-3 bg-white/95 backdrop-blur rounded-2xl p-5 shadow-xl">
//             {flowItems.map((item) => (
//               <button key={item.name} onClick={() => go(item.query)} className="flex items-center gap-2 text-sm font-semibold text-left">
//                 <span className="w-4 h-4 rounded" style={{ background: item.color }} />
//                 {item.name}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { mgrmCategories } from "../data/siteData";

// // const flowItems = [
// //   { name: "Neck", query: "Neck", color: "#0ea5e9", anchor: { x: 48, y: 16 }, side: "left", card: { x: 17, y: 7 }, thumbs: { x: 5, y: 6, cols: 4, count: 4 } },
// //   { name: "Shoulder", query: "Shoulder", color: "#65a30d", anchor: { x: 43, y: 29 }, side: "left", card: { x: 18, y: 20 }, thumbs: { x: 5, y: 18, cols: 4, count: 4 } },
// //   { name: "Back", query: "Back", color: "#dc7b61", anchor: { x: 39, y: 42 }, side: "left", card: { x: 18, y: 36 }, thumbs: { x: 5, y: 34, cols: 4, count: 4 } },
// //   { name: "Orthopedic Aids", query: "Orthopedic Aids", color: "#b45309", anchor: { x: 41, y: 78 }, side: "left", card: { x: 17, y: 70 }, thumbs: { x: 5, y: 68, cols: 4, count: 4 } },

// //   { name: "Wrist", query: "Wrist", color: "#ec5f8d", anchor: { x: 62, y: 32 }, side: "right", card: { x: 71, y: 10 }, thumbs: { x: 78, y: 8, cols: 3, count: 6 } },
// //   { name: "Finger", query: "Finger", color: "#4db6a5", anchor: { x: 66, y: 44 }, side: "right", card: { x: 72, y: 27 }, thumbs: { x: 78, y: 24, cols: 3, count: 6 } },
// //   { name: "Abdominal", query: "Abdominal", color: "#f97316", anchor: { x: 58, y: 49 }, side: "right", card: { x: 72, y: 43 }, thumbs: { x: 78, y: 40, cols: 3, count: 4 } },
// //   { name: "Knee", query: "Knee", color: "#7c6cff", anchor: { x: 59, y: 67 }, side: "right", card: { x: 72, y: 60 }, thumbs: { x: 78, y: 58, cols: 3, count: 4 } },
// //   { name: "Ankle And Foot", query: "Ankle And Foot", color: "#ef4444", anchor: { x: 58, y: 85 }, side: "right", card: { x: 72, y: 77 }, thumbs: { x: 78, y: 75, cols: 3, count: 3 } },
// // ];
// const flowItems = [
//   { name: "Neck", query: "Neck", color: "#0ea5e9", anchor: { x: 48, y: 16 }, side: "left", card: { x: 23, y: 7 }, thumbs: { x: 5, y: 6, cols: 4, count: 4 } },
//   { name: "Shoulder", query: "Shoulder", color: "#65a30d", anchor: { x: 43, y: 29 }, side: "left", card: { x: 24, y: 20 }, thumbs: { x: 5, y: 18, cols: 4, count: 4 } },
//   { name: "Back", query: "Back", color: "#dc7b61", anchor: { x: 39, y: 42 }, side: "left", card: { x: 24, y: 36 }, thumbs: { x: 5, y: 34, cols: 4, count: 4 } },
//   { name: "Orthopedic Aids", query: "Orthopedic Aids", color: "#b45309", anchor: { x: 41, y: 78 }, side: "left", card: { x: 24, y: 70 }, thumbs: { x: 5, y: 68, cols: 4, count: 4 } },

//   { name: "Wrist", query: "Wrist", color: "#ec5f8d", anchor: { x: 62, y: 32 }, side: "right", card: { x: 67, y: 10 }, thumbs: { x: 82, y: 8, cols: 3, count: 6 } },
//   { name: "Finger", query: "Finger", color: "#4db6a5", anchor: { x: 66, y: 44 }, side: "right", card: { x: 68, y: 27 }, thumbs: { x: 82, y: 24, cols: 3, count: 6 } },
//   { name: "Abdominal", query: "Abdominal", color: "#f97316", anchor: { x: 58, y: 49 }, side: "right", card: { x: 68, y: 43 }, thumbs: { x: 82, y: 40, cols: 3, count: 4 } },
//   { name: "Knee", query: "Knee", color: "#7c6cff", anchor: { x: 59, y: 67 }, side: "right", card: { x: 68, y: 60 }, thumbs: { x: 82, y: 58, cols: 3, count: 4 } },
//   { name: "Ankle And Foot", query: "Ankle And Foot", color: "#ef4444", anchor: { x: 58, y: 85 }, side: "right", card: { x: 68, y: 77 }, thumbs: { x: 82, y: 75, cols: 3, count: 3 } },
// ];

// function getCat(query) {
//   return (
//     mgrmCategories.find((c) => c.query === query || c.name === query) ||
//     mgrmCategories[0]
//   );
// }

// function CategoryCard({ item, index, go }) {
//   const cat = getCat(item.query);

//   return (
//     <motion.button
//       initial={{ opacity: 0, y: 18, scale: 0.95 }}
//       whileInView={{ opacity: 1, y: 0, scale: 1 }}
//       transition={{ duration: 0.75, delay: 0.25 + index * 0.08 }}
//       onClick={() => go(item.query)}
//       className="absolute z-40 w-44 rounded-2xl overflow-hidden bg-white shadow-[0_16px_40px_rgba(15,23,42,0.12)] hover:scale-105 transition"
//       style={{
//         left: `${item.card.x}%`,
//         top: `${item.card.y}%`,
//         border: `2px solid ${item.color}`,
//       }}
//     >
//       <div
//         className="px-3 py-2 text-center text-sm font-black text-white"
//         style={{ background: item.color }}
//       >
//         {item.name}
//       </div>

//       <div className="flex items-center gap-3 p-3">
//         <img
//           src={cat.image}
//           onError={(e) => {
//             e.currentTarget.src = "/products/knee.png";
//           }}
//           className="w-14 h-14 rounded-xl object-cover bg-gray-100"
//           alt={item.name}
//         />

//         <div className="text-left">
//           <p className="font-black text-sm">{item.name}</p>
//           <p className="text-xs text-gray-500">{cat.count} products</p>
//         </div>
//       </div>
//     </motion.button>
//   );
// }

// function ProductThumbs({ item }) {
//   const cat = getCat(item.query);

//   return Array.from({ length: item.thumbs.count }).map((_, index) => {
//     const col = index % item.thumbs.cols;
//     const row = Math.floor(index / item.thumbs.cols);

//     const x = item.thumbs.x + col * 5.7;
//     const y = item.thumbs.y + row * 8.5;

//     return (
//       <motion.button
//         key={`${item.name}-${index}`}
//         initial={{ opacity: 0, scale: 0.75, y: 18 }}
//         whileInView={{ opacity: 1, scale: 1, y: 0 }}
//         transition={{ duration: 0.65, delay: 0.55 + index * 0.08 }}
//         onClick={() => window.dispatchEvent(new Event("noop"))}
//         className="absolute z-20 w-16 h-16 bg-white overflow-hidden shadow-md hover:scale-110 transition"
//         style={{
//           left: `${x}%`,
//           top: `${y}%`,
//           border: `2px solid ${item.color}`,
//         }}
//       >
//         <img
//           src={cat.image}
//           onError={(e) => {
//             e.currentTarget.src = "/products/knee.png";
//           }}
//           className="w-full h-full object-cover"
//           alt={item.name}
//         />
//       </motion.button>
//     );
//   });
// }

// export default function BodyFlowMap() {
//   const navigate = useNavigate();

//   const go = (query) => {
//     navigate(`/shop?category=${encodeURIComponent(query)}`);
//   };

//   return (
//     <section className="relative bg-white py-16 overflow-hidden">
//       <div className="max-w-[1600px] mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 35 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           className="text-center mb-8"
//         >
//           <h2 className="text-5xl md:text-7xl font-black text-gray-700">
//             Explore Support by Body Area
//           </h2>
//           <p className="text-xl md:text-3xl font-black text-gray-400 mt-2">
//             tap a body region to find the right support
//           </p>
//         </motion.div>

//         <div className="relative h-[900px] bg-white rounded-[36px] overflow-hidden">
//           <svg
//             className="absolute inset-0 w-full h-full z-0"
//             viewBox="0 0 100 100"
//             preserveAspectRatio="none"
//           >
//             {flowItems.map((item, index) => {
//               const startX = item.anchor.x;
//               const startY = item.anchor.y;
//               const cardX = item.card.x + (item.side === "left" ? 11 : 0);
//               const cardY = item.card.y + 4;
//               const midX = item.side === "left" ? startX - 8 : startX + 8;

//               return (
//                 <motion.path
//                   key={item.name}
//                   d={`M ${startX} ${startY} H ${midX} V ${cardY} H ${cardX}`}
//                   fill="none"
//                   stroke={item.color}
//                   strokeWidth="0.32"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   initial={{ pathLength: 0, opacity: 0 }}
//                   whileInView={{ pathLength: 1, opacity: 1 }}
//                 transition={{
//   duration: 3.2,
//   ease: "easeInOut",
//   delay: index * 0.35,
// }}
//                 />
//               );
//             })}
//           </svg>

//           <motion.img
//             initial={{ opacity: 0, scale: 0.94 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 1.1 }}
//             src="/products/image.png"
//             onError={(e) => {
//               e.currentTarget.src = "/products/body.png";
//             }}
//             // className="absolute left-[47%] top-[53%] -translate-x-1/2 -translate-y-1/2 h-[760px] object-contain z-10"
//             className="absolute left-[47%] top-[53%] -translate-x-1/2 -translate-y-1/2 h-[660px] object-contain z-10"
//             alt="Human body"
//           />

//           {flowItems.map((item, index) => (
//             <motion.button
//               key={`${item.name}-dot`}
//               initial={{ opacity: 0, scale: 0 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 0.25 + index * 0.12 }}
//               onClick={() => go(item.query)}
//               className="absolute z-30 group"
//               style={{
//                 left: `${item.anchor.x}%`,
//                 top: `${item.anchor.y}%`,
//               }}
//               title={item.name}
//             >
//               <span
//                 className="absolute inset-0 rounded-full animate-ping opacity-25"
//                 style={{ background: item.color }}
//               />
//               <span
//                 className="relative w-5 h-5 rounded-full border-2 border-white shadow-lg block group-hover:scale-125 transition"
//                 style={{ background: item.color }}
//               />
//             </motion.button>
//           ))}

//           {flowItems.map((item, index) => (
//             <CategoryCard
//               key={`${item.name}-card`}
//               item={item}
//               index={index}
//               go={go}
//             />
//           ))}

//           {flowItems.map((item) => (
//             <ProductThumbs key={`${item.name}-thumbs`} item={item} />
//           ))}

         

//           <div className="absolute right-10 bottom-10 z-40 grid grid-cols-2 gap-3 bg-white/95 backdrop-blur rounded-2xl p-5 shadow-xl">
//             {flowItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => go(item.query)}
//                 className="flex items-center gap-2 text-sm font-semibold text-left"
//               >
//                 <span
//                   className="w-4 h-4 rounded"
//                   style={{ background: item.color }}
//                 />
//                 {item.name}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { mgrmCategories } from "../data/siteData";

const flowItems = [
  { name: "Neck", query: "Neck", color: "#0ea5e9", label: { x: 22, y: 8 }, anchor: { x: 48, y: 16 }, side: "left", row: 5 },
  { name: "Shoulder", query: "Shoulder", color: "#84cc16", label: { x: 23, y: 23 }, anchor: { x: 42, y: 30 }, side: "left", row: 20 },
  { name: "Back", query: "Back", color: "#dc7b61", label: { x: 22, y: 40 }, anchor: { x: 37, y: 42 }, side: "left", row: 37 },
  { name: "Orthopedic Aids", query: "Orthopedic Aids", color: "#b45309", label: { x: 21, y: 72 }, anchor: { x: 41, y: 78 }, side: "left", row: 69 },

  { name: "Wrist", query: "Wrist", color: "#ec5f8d", label: { x: 72, y: 10 }, anchor: { x: 62, y: 32 }, side: "right", row: 8 },
  { name: "Finger", query: "Finger", color: "#4db6a5", label: { x: 73, y: 28 }, anchor: { x: 66, y: 44 }, side: "right", row: 25 },
  { name: "Abdominal", query: "Abdominal", color: "#f97316", label: { x: 73, y: 47 }, anchor: { x: 58, y: 49 }, side: "right", row: 42 },
  { name: "Knee", query: "Knee", color: "#7c6cff", label: { x: 73, y: 64 }, anchor: { x: 59, y: 67 }, side: "right", row: 59 },
  { name: "Ankle And Foot", query: "Ankle And Foot", color: "#ef4444", label: { x: 73, y: 80 }, anchor: { x: 58, y: 85 }, side: "right", row: 75 },
];

function getCat(name) {
  return (
    mgrmCategories.find((c) => c.query === name || c.name === name) ||
    mgrmCategories[0]
  );
}

function ThumbGrid({ item }) {
  const cat = getCat(item.query);
  const count = item.side === "left" ? 4 : item.name === "Ankle And Foot" ? 3 : 6;
  const cols = item.side === "left" ? 4 : 3;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);

        // const x = item.side === "left" ? 6 + col * 5.8 : 83 + col * 5.3;
        const x = item.side === "left" ? 2 + col * 5.8 : 86 + col * 4.8;
        const y = item.row + row * 8.2;

        return (
          <motion.button
            key={`${item.name}-${index}`}
            initial={{ opacity: 0, scale: 0.75, y: 18 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 + index * 0.1 }}
            onClick={() => window.location.assign(`/shop?category=${encodeURIComponent(item.query)}`)}
            className="absolute z-20 w-16 h-16 bg-white overflow-hidden shadow-md hover:scale-110 transition"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              border: `2px solid ${item.color}`,
            }}
          >
            <img
              src={cat.image}
              onError={(e) => (e.currentTarget.src = "/products/knee.png")}
              className="w-full h-full object-cover"
              alt={item.name}
            />
          </motion.button>
        );
      })}
    </>
  );
}

function CategoryLabel({ item, index, go }) {
  const cat = getCat(item.query);

  return (
    <motion.button
      key={item.name}
      initial={{ opacity: 0, scale: 0.82, y: 18 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.35 + index * 0.12 }}
      onClick={() => go(item.query)}
      className="absolute z-40 w-44 rounded-2xl overflow-hidden bg-white shadow-[0_18px_45px_rgba(15,23,42,0.12)] hover:scale-105 transition"
      style={{
        left: `${item.label.x}%`,
        top: `${item.label.y}%`,
        border: `2px solid ${item.color}`,
      }}
    >
      <div
        className="py-2 text-center text-sm font-black text-white"
        style={{ background: item.color }}
      >
        {item.name}
      </div>

      <div className="flex items-center gap-3 p-3">
        <img
          src={cat.image}
          onError={(e) => (e.currentTarget.src = "/products/knee.png")}
          className="w-14 h-14 rounded-xl object-cover bg-gray-100"
          alt={item.name}
        />
        <div className="text-left">
          <p className="text-sm font-black text-gray-900">{item.name}</p>
          <p className="text-xs text-gray-500">{cat.count} products</p>
        </div>
      </div>
    </motion.button>
  );
}

export default function BodyFlowMap() {
  const navigate = useNavigate();

  const go = (query) => {
    navigate(`/shop?category=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative bg-white py-16 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-5xl md:text-7xl font-black text-gray-700">
            <span className="text-red-500">248</span> world class certified products
          </h2>
          <p className="text-2xl md:text-4xl font-black text-gray-500 mt-2">
            to heal and rehabilitate comfortably
          </p>
        </motion.div>

        {/* <div className="relative h-[900px] bg-white rounded-[36px] overflow-hidden">
         */}
         <div className="relative h-[940px] bg-white rounded-[36px] overflow-hidden">
          <svg
            className="absolute inset-0 w-full h-full z-0"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {flowItems.map((item, index) => {
              const startX = item.anchor.x;
              const startY = item.anchor.y;
              const labelEdgeX = item.side === "left" ? item.label.x + 11 : item.label.x;
              const labelY = item.label.y + 5;
              const midX = item.side === "left" ? startX - 8 : startX + 8;

              return (
                <motion.path
                  key={item.name}
                  d={`M ${startX} ${startY} H ${midX} V ${labelY} H ${labelEdgeX}`}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="0.32"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 5.4,
                    ease: "easeInOut",
                    delay: index * 0.28,
                  }}
                />
              );
            })}
          </svg>

          <motion.img
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1 }}
            src="/products/i.png"
            onError={(e) => {
              e.currentTarget.src = "/products/image.png";
            }}
            // className="absolute left-[49%] top-[53%] -translate-x-1/2 -translate-y-1/2 h-[680px] object-contain z-10"
            className="absolute left-[50%] top-[53%] -translate-x-1/2 -translate-y-1/2 h-[620px] object-contain z-10"
            alt="Human body"
          />

          {flowItems.map((item, index) => (
            <motion.button
              key={`${item.name}-dot`}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.45 + index * 0.12 }}
              onClick={() => go(item.query)}
              className="absolute z-30 group"
              style={{
                left: `${item.anchor.x}%`,
                top: `${item.anchor.y}%`,
              }}
              title={item.name}
            >
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-25"
                style={{ background: item.color }}
              />
              <span
                className="relative w-5 h-5 rounded-full border-2 border-white shadow-lg block group-hover:scale-125 transition"
                style={{ background: item.color }}
              />
            </motion.button>
          ))}

          {flowItems.map((item, index) => (
            <CategoryLabel key={`${item.name}-label`} item={item} index={index} go={go} />
          ))}

          {flowItems.map((item) => (
            <ThumbGrid key={`${item.name}-thumbs`} item={item} />
          ))}

          <div className="absolute right-10 bottom-10 z-40 grid grid-cols-2 gap-3 bg-white/95 backdrop-blur rounded-2xl p-5 shadow-xl">
            {flowItems.map((item) => (
              <button
                key={item.name}
                onClick={() => go(item.query)}
                className="flex items-center gap-2 text-sm font-semibold text-left"
              >
                <span
                  className="w-4 h-4 rounded"
                  style={{ background: item.color }}
                />
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}