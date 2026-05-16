// import { useRef, useState } from "react";
// import { X, Upload, ScanLine, Ruler, CheckCircle2, ImagePlus } from "lucide-react";
// import toast from "react-hot-toast";

// export default function SmartSizeFinder({ open, onClose, onSelectSize, product }) {
//   const fileRef = useRef(null);

//   const [preview, setPreview] = useState("");
//   const [measurement, setMeasurement] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [recommended, setRecommended] = useState("");

//   if (!open) return null;

// //   const availableSizes = product?.sizes?.length ? product.sizes : ["S", "M", "L", "XL"];

// //   const getRecommendedSize = (cm) => {
// //     const value = Number(cm);

// //     if (value <= 34) return "S";
// //     if (value <= 39) return "M";
// //     if (value <= 44) return "L";
// //     return "XL";
// //   };
// const availableSizes = product?.sizes?.length
//   ? product.sizes
//   : ["S", "M", "L", "XL", "XXL", "UN", "Regular", "Plus", "SM", "LXL"];

// const productText = `${product?.name || ""} ${product?.category || ""} ${product?.activity || ""}`.toLowerCase();

// const sizePriority = ["S", "SM", "M", "L", "LXL", "XL", "XXL", "Regular", "Plus", "UN"];

// const normalizeRecommendedSize = (recommended) => {
//   if (availableSizes.includes(recommended)) return recommended;

//   if (recommended === "S" && availableSizes.includes("SM")) return "SM";
//   if (recommended === "M" && availableSizes.includes("SM")) return "SM";
//   if (recommended === "L" && availableSizes.includes("LXL")) return "LXL";
//   if (recommended === "XL" && availableSizes.includes("LXL")) return "LXL";
//   if (recommended === "XL" && availableSizes.includes("XXL")) return "XXL";

//   if (availableSizes.includes("Regular")) return "Regular";
//   if (availableSizes.includes("UN")) return "UN";

//   return availableSizes.find((s) => sizePriority.includes(s)) || availableSizes[0];
// };

// const getFitProfile = () => {
//   // BODY PART BASED
//   if (productText.includes("neck") || productText.includes("cervical") || productText.includes("collar")) {
//     return {
//       type: "neck",
//       label: "neck circumference",
//       example: "Example: 37",
//       chart: [
//         { size: "S", max: 33 },
//         { size: "M", max: 38 },
//         { size: "L", max: 43 },
//         { size: "XL", max: 48 },
//         { size: "XXL", max: 1000 },
//       ],
//     };
//   }

//   if (productText.includes("wrist") || productText.includes("forearm")) {
//     return {
//       type: "wrist",
//       label: "wrist / forearm circumference",
//       example: "Example: 16",
//       chart: [
//         { size: "S", max: 14 },
//         { size: "M", max: 18 },
//         { size: "L", max: 22 },
//         { size: "XL", max: 26 },
//         { size: "XXL", max: 1000 },
//       ],
//     };
//   }

//   if (productText.includes("finger")) {
//     return {
//       type: "finger",
//       label: "finger circumference",
//       example: "Example: 6",
//       chart: [
//         { size: "S", max: 5 },
//         { size: "M", max: 7 },
//         { size: "L", max: 9 },
//         { size: "XL", max: 1000 },
//       ],
//     };
//   }

//   if (productText.includes("shoulder") || productText.includes("arm") || productText.includes("clavicle")) {
//     return {
//       type: "shoulder-arm",
//       label: "arm / shoulder circumference",
//       example: "Example: 30",
//       chart: [
//         { size: "S", max: 24 },
//         { size: "M", max: 30 },
//         { size: "L", max: 36 },
//         { size: "XL", max: 42 },
//         { size: "XXL", max: 1000 },
//       ],
//     };
//   }

//   if (productText.includes("elbow")) {
//     return {
//       type: "elbow",
//       label: "elbow circumference",
//       example: "Example: 26",
//       chart: [
//         { size: "S", max: 22 },
//         { size: "M", max: 28 },
//         { size: "L", max: 34 },
//         { size: "XL", max: 40 },
//         { size: "XXL", max: 1000 },
//       ],
//     };
//   }

//   if (productText.includes("chest") || productText.includes("rib")) {
//     return {
//       type: "chest",
//       label: "chest circumference",
//       example: "Example: 92",
//       chart: [
//         { size: "S", max: 85 },
//         { size: "M", max: 95 },
//         { size: "L", max: 105 },
//         { size: "XL", max: 115 },
//         { size: "XXL", max: 1000 },
//       ],
//     };
//   }

//   if (
//     productText.includes("back") ||
//     productText.includes("lumbo") ||
//     productText.includes("spine") ||
//     productText.includes("abdominal") ||
//     productText.includes("abdomen")
//   ) {
//     return {
//       type: "waist",
//       label: "waist / abdominal circumference",
//       example: "Example: 88",
//       chart: [
//         { size: "S", max: 76 },
//         { size: "M", max: 91 },
//         { size: "L", max: 106 },
//         { size: "XL", max: 121 },
//         { size: "XXL", max: 136 },
//         { size: "Plus", max: 1000 },
//       ],
//     };
//   }

//   if (productText.includes("thigh")) {
//     return {
//       type: "thigh",
//       label: "thigh circumference",
//       example: "Example: 52",
//       chart: [
//         { size: "S", max: 45 },
//         { size: "M", max: 55 },
//         { size: "L", max: 65 },
//         { size: "XL", max: 75 },
//         { size: "XXL", max: 1000 },
//       ],
//     };
//   }

//   if (productText.includes("knee")) {
//     return {
//       type: "knee",
//       label: "knee circumference",
//       example: "Example: 38",
//       chart: [
//         { size: "S", max: 34 },
//         { size: "M", max: 39 },
//         { size: "L", max: 44 },
//         { size: "XL", max: 49 },
//         { size: "XXL", max: 1000 },
//       ],
//     };
//   }

//   if (productText.includes("leg") || productText.includes("shin") || productText.includes("calf")) {
//     return {
//       type: "calf",
//       label: "calf circumference",
//       example: "Example: 36",
//       chart: [
//         { size: "S", max: 32 },
//         { size: "M", max: 38 },
//         { size: "L", max: 44 },
//         { size: "XL", max: 50 },
//         { size: "XXL", max: 1000 },
//       ],
//     };
//   }

//   if (productText.includes("ankle") || productText.includes("foot")) {
//     return {
//       type: "ankle-foot",
//       label: "ankle circumference",
//       example: "Example: 23",
//       chart: [
//         { size: "S", max: 20 },
//         { size: "M", max: 25 },
//         { size: "L", max: 30 },
//         { size: "XL", max: 35 },
//         { size: "XXL", max: 1000 },
//       ],
//     };
//   }

//   // ACTIVITY BASED FALLBACKS
//   if (productText.includes("aerobics") || productText.includes("athletics") || productText.includes("running") || productText.includes("gym")) {
//     return {
//       type: "sports-knee-calf",
//       label: "knee or calf circumference",
//       example: "Example: 38",
//       chart: [
//         { size: "S", max: 34 },
//         { size: "M", max: 39 },
//         { size: "L", max: 44 },
//         { size: "XL", max: 49 },
//         { size: "XXL", max: 1000 },
//       ],
//     };
//   }

//   if (productText.includes("badminton") || productText.includes("tennis") || productText.includes("volleyball") || productText.includes("basketball")) {
//     return {
//       type: "sports-arm-wrist-knee",
//       label: "wrist, arm, or knee circumference",
//       example: "Example: 28",
//       chart: [
//         { size: "S", max: 22 },
//         { size: "M", max: 30 },
//         { size: "L", max: 38 },
//         { size: "XL", max: 46 },
//         { size: "XXL", max: 1000 },
//       ],
//     };
//   }

//   if (productText.includes("cricket") || productText.includes("football") || productText.includes("cycling") || productText.includes("golf")) {
//     return {
//       type: "activity-general",
//       label: "affected body part circumference",
//       example: "Example: 38",
//       chart: [
//         { size: "S", max: 34 },
//         { size: "M", max: 40 },
//         { size: "L", max: 46 },
//         { size: "XL", max: 52 },
//         { size: "XXL", max: 1000 },
//       ],
//     };
//   }

//   if (productText.includes("yoga") || productText.includes("walking") || productText.includes("office") || productText.includes("sleep")) {
//     return {
//       type: "daily-support",
//       label: "affected body part circumference",
//       example: "Example: 38",
//       chart: [
//         { size: "SM", max: 34 },
//         { size: "Regular", max: 44 },
//         { size: "LXL", max: 54 },
//         { size: "Plus", max: 1000 },
//       ],
//     };
//   }

//   return {
//     type: "general",
//     label: "affected body part circumference",
//     example: "Example: 38",
//     chart: [
//       { size: "S", max: 34 },
//       { size: "M", max: 39 },
//       { size: "L", max: 44 },
//       { size: "XL", max: 49 },
//       { size: "XXL", max: 1000 },
//     ],
//   };
// };

// const fitProfile = getFitProfile();

// const getRecommendedSize = (cm) => {
//   const value = Number(cm);
//   const recommended = fitProfile.chart.find((item) => value <= item.max)?.size || "XXL";
//   return normalizeRecommendedSize(recommended);
// };

//   const handleUpload = (e) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       toast.error("Please upload image file only");
//       return;
//     }

//     const url = URL.createObjectURL(file);
//     setPreview(url);
//     setRecommended("");
//     toast.success("Image uploaded");
//   };

//   const analyze = () => {
//     if (!measurement) {
//       toast.error("Please enter measurement in cm");
//       return;
//     }

//     setLoading(true);
//     setRecommended("");

//     setTimeout(() => {
//       let size = getRecommendedSize(measurement);

//       if (!availableSizes.includes(size)) {
//         size = availableSizes[0];
//       }

//       setRecommended(size);
//       setLoading(false);
//       toast.success(`Recommended size: ${size}`);
//     }, 1500);
//   };

//   const useSize = () => {
//     onSelectSize(recommended);
//     toast.success(`Size ${recommended} selected`);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-[9999] bg-slate-950/55 backdrop-blur-md flex items-center justify-center p-4">
//       <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[34px] overflow-hidden shadow-[0_35px_100px_rgba(15,23,42,0.28)] grid lg:grid-cols-[1fr_0.9fr]">
//         <button
//           type="button"
//           onClick={onClose}
//           className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-lg grid place-items-center hover:scale-105 transition"
//         >
//           <X size={18} />
//         </button>

//         {/* LEFT */}
//         <section className="relative p-7 bg-gradient-to-br from-cyan-50 via-white to-purple-50 overflow-hidden">
//           <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-300/25 rounded-full blur-3xl" />
//           <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-300/25 rounded-full blur-3xl" />

//           <div className="relative z-10">
//             <p className="text-cyan-600 font-black tracking-[0.25em] text-[11px]">
//               AI-ASSISTED FIT
//             </p>

//             <h2 className="text-3xl md:text-4xl font-black mt-3 text-slate-950 dark:text-white leading-tight">
//               Smart Size Finder
//             </h2>

//             <p className="text-slate-500 mt-3 text-sm leading-6">
//               Upload a clear image and enter your measurement to get a quick recommended size.
//             </p>

//             <div className="mt-6 relative h-[310px] rounded-[28px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 overflow-hidden shadow-[0_18px_55px_rgba(15,23,42,0.08)] grid place-items-center">
//               {preview ? (
//                 <img
//                   src={preview}
//                   alt="measurement preview"
//                   className="w-full h-full object-contain bg-white dark:bg-slate-900"
//                 />
//               ) : (
//                 <button
//                   type="button"
//                   onClick={() => fileRef.current?.click()}
//                   className="text-center px-8 group"
//                 >
//                   <div className="w-20 h-20 rounded-full bg-cyan-100 text-cyan-700 mx-auto grid place-items-center group-hover:scale-110 transition">
//                     <ImagePlus size={32} />
//                   </div>

//                   <h3 className="text-xl font-black mt-4">Upload photo</h3>
//                   <p className="text-slate-400 mt-2 text-sm">
//                     Knee, wrist, waist or affected area
//                   </p>
//                 </button>
//               )}

//               {loading && (
//                 <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm text-white flex flex-col items-center justify-center">
//                   <ScanLine size={40} className="animate-pulse" />
//                   <p className="font-black mt-4 text-sm tracking-wide">Analyzing fit...</p>
//                   <div className="mt-4 w-56 h-2 bg-white/20 rounded-full overflow-hidden">
//                     <div className="h-full w-2/3 bg-cyan-300 rounded-full animate-pulse" />
//                   </div>
//                 </div>
//               )}
//             </div>

//             <input
//               ref={fileRef}
//               type="file"
//               accept="image/*"
//               className="hidden"
//               onChange={handleUpload}
//             />

//             <div className="mt-5 flex gap-3">
//               <button
//                 type="button"
//                 onClick={() => fileRef.current?.click()}
//                 className="inline-flex items-center gap-2 bg-slate-950 text-white px-5 py-3 rounded-2xl font-black text-sm hover:scale-105 transition"
//               >
//                 <Upload size={17} /> {preview ? "Change Image" : "Upload Image"}
//               </button>

//               {preview && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setPreview("");
//                     setRecommended("");
//                   }}
//                   className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border font-black text-sm"
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>
//           </div>
//         </section>

//         {/* RIGHT */}
//         <section className="p-7 md:p-8 flex flex-col justify-center">
//           <div className="inline-flex w-fit bg-purple-50 text-purple-700 rounded-full px-4 py-2 font-black text-xs">
//             {product?.name || "MGRM Product"}
//           </div>

//           <div className="mt-7 flex items-start gap-4">
//             <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 grid place-items-center shrink-0">
//               <Ruler />
//             </div>

//             <div>
//               <h3 className="text-2xl font-black text-slate-950 dark:text-white">Enter measurement</h3>
//               <p className="text-slate-500 mt-2 text-sm leading-6">
//                 {/* Use a measuring tape around the affected area and enter the value in centimeters. */}
//                 Measure your {fitProfile.label} and enter the value in centimeters.
//               </p>
//             </div>
//           </div>

//           <div className="mt-7">
//             <label className="font-black text-slate-700 dark:text-zinc-300 text-sm">Measurement in CM</label>
//             <input
//               type="number"
//               value={measurement}
//               onChange={(e) => setMeasurement(e.target.value)}
//             //   placeholder="Example: 38"
//             placeholder={fitProfile.example}
//               className="mt-3 w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/10 px-5 text-lg font-black outline-none focus:ring-2 focus:ring-cyan-500"
//             />
//           </div>

//           <button
//             type="button"
//             onClick={analyze}
//             disabled={loading}
//             className="mt-5 h-14 rounded-2xl bg-gradient-to-r from-cyan-600 to-purple-700 text-white font-black shadow-xl hover:scale-[1.02] transition disabled:opacity-60"
//           >
//             {loading ? "Analyzing..." : "Analyze Size"}
//           </button>

//           {recommended && (
//             <div className="mt-6 rounded-[26px] bg-gradient-to-br from-cyan-50 to-purple-50 border border-cyan-100 p-6">
//               <div className="flex items-center gap-2 text-green-600 font-black text-sm">
//                 <CheckCircle2 size={18} />
//                 Result ready
//               </div>

//               <p className="text-slate-500 font-bold mt-4 text-sm">Recommended Size</p>
//               <h2 className="text-5xl font-black text-slate-950 dark:text-white dark:text-white mt-1">{recommended}</h2>

//               <button
//                 type="button"
//                 onClick={useSize}
//                 className="mt-5 w-full bg-slate-950 text-white py-3 rounded-2xl font-black hover:scale-[1.02] transition"
//               >
//                 Use This Size
//               </button>
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }


// // import { useRef, useState } from "react";
// // import {
// //   X,
// //   Upload,
// //   ScanLine,
// //   CheckCircle2,
// // } from "lucide-react";
// // import toast from "react-hot-toast";

// // export default function SmartSizeFinder({
// //   open,
// //   onClose,
// //   onSelectSize,
// //   product,
// // }) {
// //   const fileRef = useRef(null);

// //   const [preview, setPreview] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const [points, setPoints] = useState([]);
// //   const [recommended, setRecommended] = useState("");

// //   if (!open) return null;

// //   const handleUpload = (e) => {
// //     const file = e.target.files?.[0];

// //     if (!file) return;

// //     const url = URL.createObjectURL(file);

// //     setPreview(url);
// //     setPoints([]);
// //     setRecommended("");

// //     toast.success("Image uploaded");
// //   };

// //   const handleImageClick = (e) => {
// //     if (points.length >= 2) return;

// //     const rect = e.target.getBoundingClientRect();

// //     const x = e.clientX - rect.left;
// //     const y = e.clientY - rect.top;

// //     setPoints((prev) => [...prev, { x, y }]);
// //   };

// //   const calculateDistance = () => {
// //     if (points.length < 2) {
// //       toast.error("Select 2 points");
// //       return;
// //     }

// //     setLoading(true);

// //     setTimeout(() => {
// //       const [p1, p2] = points;

// //       const dx = p2.x - p1.x;
// //       const dy = p2.y - p1.y;

// //       const pixelDistance = Math.sqrt(dx * dx + dy * dy);

// //       let size = "S";

// //       if (pixelDistance > 120) size = "M";
// //       if (pixelDistance > 180) size = "L";
// //       if (pixelDistance > 240) size = "XL";

// //       setRecommended(size);

// //       setLoading(false);

// //       toast.success(`Recommended size: ${size}`);
// //     }, 1500);
// //   };

// //   const useSize = () => {
// //     onSelectSize(recommended);

// //     toast.success(`Size ${recommended} selected`);

// //     onClose();
// //   };

// //   return (
// //     <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
// //       <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[34px] overflow-hidden shadow-2xl grid lg:grid-cols-2 relative">

// //         <button
// //           onClick={onClose}
// //           className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center"
// //         >
// //           <X size={18} />
// //         </button>

// //         {/* LEFT */}
// //         <div className="p-8 bg-gradient-to-br from-cyan-50 via-white to-purple-50">
// //           <p className="text-cyan-600 font-black tracking-[0.25em] text-xs">
// //             AI SIZE ANALYZER
// //           </p>

// //           <h2 className="text-3xl font-black mt-3 text-slate-950">
// //             Measure Using Image
// //           </h2>

// //           <p className="text-slate-500 mt-3 text-sm leading-6">
// //             Upload image and select top & bottom points.
// //           </p>

// //           <div className="mt-6 relative h-[420px] rounded-[28px] bg-white dark:bg-slate-900 border overflow-hidden">

// //             {preview ? (
// //               <div
// //                 className="relative w-full h-full cursor-crosshair"
// //                 onClick={handleImageClick}
// //               >
// //                 <img
// //                   src={preview}
// //                   alt=""
// //                   className="w-full h-full object-contain"
// //                 />

// //                 {/* POINTS */}
// //                 {points.map((p, i) => (
// //                   <div
// //                     key={i}
// //                     className="absolute w-4 h-4 rounded-full bg-cyan-500 border-2 border-white shadow-lg"
// //                     style={{
// //                       left: p.x - 8,
// //                       top: p.y - 8,
// //                     }}
// //                   />
// //                 ))}

// //                 {/* LINE */}
// //                 {points.length === 2 && (
// //                   <svg className="absolute inset-0 w-full h-full pointer-events-none">
// //                     <line
// //                       x1={points[0].x}
// //                       y1={points[0].y}
// //                       x2={points[1].x}
// //                       y2={points[1].y}
// //                       stroke="#06b6d4"
// //                       strokeWidth="3"
// //                       strokeDasharray="8"
// //                     />
// //                   </svg>
// //                 )}

// //                 {loading && (
// //                   <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white">
// //                     <ScanLine className="animate-pulse" size={42} />

// //                     <p className="mt-4 font-bold tracking-wide">
// //                       Analyzing body distance...
// //                     </p>
// //                   </div>
// //                 )}
// //               </div>
// //             ) : (
// //               <button
// //                 onClick={() => fileRef.current?.click()}
// //                 className="w-full h-full flex flex-col items-center justify-center"
// //               >
// //                 <div className="w-20 h-20 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center">
// //                   <Upload size={34} />
// //                 </div>

// //                 <p className="mt-5 font-black text-slate-700 dark:text-zinc-300">
// //                   Upload Image
// //                 </p>

// //                 <p className="text-slate-400 text-sm mt-2">
// //                   Knee / wrist / neck image
// //                 </p>
// //               </button>
// //             )}
// //           </div>

// //           <input
// //             ref={fileRef}
// //             type="file"
// //             accept="image/*"
// //             className="hidden"
// //             onChange={handleUpload}
// //           />

// //           <div className="flex gap-3 mt-5">
// //             <button
// //               onClick={() => fileRef.current?.click()}
// //               className="px-5 py-3 rounded-2xl bg-slate-950 text-white font-bold text-sm"
// //             >
// //               Upload
// //             </button>

// //             {points.length > 0 && (
// //               <button
// //                 onClick={() => setPoints([])}
// //                 className="px-5 py-3 rounded-2xl border font-bold text-sm"
// //               >
// //                 Reset Points
// //               </button>
// //             )}
// //           </div>
// //         </div>

// //         {/* RIGHT */}
// //         <div className="p-8 flex flex-col justify-center">

// //           <div className="inline-flex w-fit px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
// //             {product?.name}
// //           </div>

// //           <h3 className="text-3xl font-black mt-8 text-slate-950">
// //             AI Fit Analysis
// //           </h3>

// //           <div className="mt-6 space-y-4 text-slate-600">

// //             <div className="flex gap-3">
// //               <div className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-sm">
// //                 1
// //               </div>

// //               <p>Upload image</p>
// //             </div>

// //             <div className="flex gap-3">
// //               <div className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-sm">
// //                 2
// //               </div>

// //               <p>Select top point</p>
// //             </div>

// //             <div className="flex gap-3">
// //               <div className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-sm">
// //                 3
// //               </div>

// //               <p>Select bottom point</p>
// //             </div>

// //           </div>

// //           <button
// //             onClick={calculateDistance}
// //             className="mt-8 h-14 rounded-2xl bg-gradient-to-r from-cyan-600 to-purple-700 text-white font-black shadow-xl"
// //           >
// //             Analyze Size
// //           </button>

// //           {recommended && (
// //             <div className="mt-8 rounded-[28px] bg-gradient-to-br from-cyan-50 to-purple-50 border border-cyan-100 p-6">

// //               <div className="flex items-center gap-2 text-green-600 font-bold">
// //                 <CheckCircle2 size={18} />
// //                 AI Result Ready
// //               </div>

// //               <p className="mt-5 text-slate-500 text-sm">
// //                 Recommended Size
// //               </p>

// //               <h2 className="text-6xl font-black mt-1 text-slate-950">
// //                 {recommended}
// //               </h2>

// //               <button
// //                 onClick={useSize}
// //                 className="mt-5 w-full h-14 rounded-2xl bg-slate-950 text-white font-black"
// //               >
// //                 Use This Size
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


import { useRef, useState } from "react";
import {
  X,
  Upload,
  ScanLine,
  Ruler,
  CheckCircle2,
  ImagePlus,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SmartSizeFinder({
  open,
  onClose,
  onSelectSize,
  product,
}) {
  const fileRef = useRef(null);

  const [preview, setPreview] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommended, setRecommended] = useState("");

  if (!open) return null;

  const availableSizes = product?.sizes?.length
    ? product.sizes
    : ["S", "M", "L", "XL", "XXL", "UN", "Regular", "Plus", "SM", "LXL"];

  const productText = `
    ${product?.name || ""}
    ${product?.category || ""}
    ${product?.activity || ""}
    ${product?.bodyPart || ""}
    ${product?.description || ""}
  `.toLowerCase();

  console.log("SMART SIZE TEXT:", productText);

  const sizePriority = [
    "S",
    "SM",
    "M",
    "L",
    "LXL",
    "XL",
    "XXL",
    "Regular",
    "Plus",
    "UN",
  ];

  const normalizeRecommendedSize = (recommended) => {
    if (availableSizes.includes(recommended)) return recommended;

    if (recommended === "S" && availableSizes.includes("SM")) return "SM";
    if (recommended === "M" && availableSizes.includes("SM")) return "SM";
    if (recommended === "L" && availableSizes.includes("LXL")) return "LXL";
    if (recommended === "XL" && availableSizes.includes("LXL")) return "LXL";
    if (recommended === "XL" && availableSizes.includes("XXL"))
      return "XXL";

    if (availableSizes.includes("Regular")) return "Regular";
    if (availableSizes.includes("UN")) return "UN";

    return (
      availableSizes.find((s) => sizePriority.includes(s)) ||
      availableSizes[0]
    );
  };

  const hasAny = (arr) =>
    arr.some((word) => productText.includes(word));

  const getFitProfile = () => {
    // NECK
    if (hasAny(["neck", "cervical", "collar"])) {
      return {
        label: "neck circumference",
        example: "Example: 37",
        chart: [
          { size: "S", max: 33 },
          { size: "M", max: 38 },
          { size: "L", max: 43 },
          { size: "XL", max: 48 },
          { size: "XXL", max: 1000 },
        ],
      };
    }

    // WRIST
    if (hasAny(["wrist", "forearm"])) {
      return {
        label: "wrist circumference",
        example: "Example: 16",
        chart: [
          { size: "S", max: 14 },
          { size: "M", max: 18 },
          { size: "L", max: 22 },
          { size: "XL", max: 26 },
          { size: "XXL", max: 1000 },
        ],
      };
    }

    // FINGER
    if (hasAny(["finger"])) {
      return {
        label: "finger circumference",
        example: "Example: 6",
        chart: [
          { size: "S", max: 5 },
          { size: "M", max: 7 },
          { size: "L", max: 9 },
          { size: "XL", max: 1000 },
        ],
      };
    }

    // ARM / SHOULDER
    if (hasAny(["arm", "shoulder", "clavicle"])) {
      return {
        label: "arm circumference",
        example: "Example: 30",
        chart: [
          { size: "S", max: 24 },
          { size: "M", max: 30 },
          { size: "L", max: 36 },
          { size: "XL", max: 42 },
          { size: "XXL", max: 1000 },
        ],
      };
    }

    // ELBOW
    if (hasAny(["elbow"])) {
      return {
        label: "elbow circumference",
        example: "Example: 26",
        chart: [
          { size: "S", max: 22 },
          { size: "M", max: 28 },
          { size: "L", max: 34 },
          { size: "XL", max: 40 },
          { size: "XXL", max: 1000 },
        ],
      };
    }

    // CHEST
    if (hasAny(["chest", "rib"])) {
      return {
        label: "chest circumference",
        example: "Example: 92",
        chart: [
          { size: "S", max: 85 },
          { size: "M", max: 95 },
          { size: "L", max: 105 },
          { size: "XL", max: 115 },
          { size: "XXL", max: 1000 },
        ],
      };
    }

    // WAIST / BACK / ABDOMINAL
    if (
      hasAny([
        "back",
        "lumbo",
        "spine",
        "waist",
        "abdominal",
        "abdomen",
      ])
    ) {
      return {
        label: "waist circumference",
        example: "Example: 88",
        chart: [
          { size: "S", max: 76 },
          { size: "M", max: 91 },
          { size: "L", max: 106 },
          { size: "XL", max: 121 },
          { size: "XXL", max: 136 },
          { size: "Plus", max: 1000 },
        ],
      };
    }

    // THIGH
    if (hasAny(["thigh"])) {
      return {
        label: "thigh circumference",
        example: "Example: 52",
        chart: [
          { size: "S", max: 45 },
          { size: "M", max: 55 },
          { size: "L", max: 65 },
          { size: "XL", max: 75 },
          { size: "XXL", max: 1000 },
        ],
      };
    }

    // KNEE
    if (hasAny(["knee"])) {
      return {
        label: "knee circumference",
        example: "Example: 38",
        chart: [
          { size: "S", max: 34 },
          { size: "M", max: 39 },
          { size: "L", max: 44 },
          { size: "XL", max: 49 },
          { size: "XXL", max: 1000 },
        ],
      };
    }

    // CALF / LEG
    if (hasAny(["calf", "leg", "shin"])) {
      return {
        label: "calf circumference",
        example: "Example: 36",
        chart: [
          { size: "S", max: 32 },
          { size: "M", max: 38 },
          { size: "L", max: 44 },
          { size: "XL", max: 50 },
          { size: "XXL", max: 1000 },
        ],
      };
    }

    // ANKLE / FOOT
    if (hasAny(["ankle", "foot"])) {
      return {
        label: "ankle circumference",
        example: "Example: 23",
        chart: [
          { size: "S", max: 20 },
          { size: "M", max: 25 },
          { size: "L", max: 30 },
          { size: "XL", max: 35 },
          { size: "XXL", max: 1000 },
        ],
      };
    }

    // YOGA / OFFICE / DAILY
    if (
      hasAny([
        "yoga",
        "walking",
        "office",
        "sleep",
        "daily",
      ])
    ) {
      return {
        label: "affected body part circumference",
        example: "Example: 38",
        chart: [
          { size: "SM", max: 34 },
          { size: "Regular", max: 44 },
          { size: "LXL", max: 54 },
          { size: "Plus", max: 1000 },
        ],
      };
    }

    // SPORTS
    if (
      hasAny([
        "cricket",
        "football",
        "gym",
        "running",
        "tennis",
        "badminton",
        "basketball",
        "volleyball",
        "cycling",
        "golf",
      ])
    ) {
      return {
        label: "affected body part circumference",
        example: "Example: 38",
        chart: [
          { size: "S", max: 34 },
          { size: "M", max: 40 },
          { size: "L", max: 46 },
          { size: "XL", max: 52 },
          { size: "XXL", max: 1000 },
        ],
      };
    }

    // DEFAULT
    return {
      label: "affected body part circumference",
      example: "Example: 38",
      chart: [
        { size: "S", max: 34 },
        { size: "M", max: 39 },
        { size: "L", max: 44 },
        { size: "XL", max: 49 },
        { size: "XXL", max: 1000 },
      ],
    };
  };

  const fitProfile = getFitProfile();

  const getRecommendedSize = (cm) => {
    const value = Number(cm);

    const recommended =
      fitProfile.chart.find((item) => value <= item.max)?.size ||
      "XXL";

    return normalizeRecommendedSize(recommended);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload image file only");
      return;
    }

    const url = URL.createObjectURL(file);

    setPreview(url);
    setRecommended("");

    toast.success("Image uploaded");
  };

  const analyze = () => {
    if (!measurement) {
      toast.error("Please enter measurement in cm");
      return;
    }

    setLoading(true);
    setRecommended("");

    setTimeout(() => {
      let size = getRecommendedSize(measurement);

      if (!availableSizes.includes(size)) {
        size = availableSizes[0];
      }

      setRecommended(size);

      setLoading(false);

      toast.success(`Recommended size: ${size}`);
    }, 1500);
  };

  const useSize = () => {
    onSelectSize(recommended);

    toast.success(`Size ${recommended} selected`);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/55 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[34px] overflow-hidden shadow-[0_35px_100px_rgba(15,23,42,0.28)] grid lg:grid-cols-[1fr_0.9fr]">

        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-lg grid place-items-center hover:scale-105 transition"
        >
          <X size={18} />
        </button>

        {/* LEFT */}
        <section className="relative p-7 bg-gradient-to-br from-cyan-50 via-white to-purple-50 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-300/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-300/25 rounded-full blur-3xl" />

          <div className="relative z-10">
            <p className="text-cyan-600 font-black tracking-[0.25em] text-[11px]">
              SMART FIT ANALYZER
            </p>

            <h2 className="text-3xl md:text-4xl font-black mt-3 text-slate-950 dark:text-white leading-tight">
              Smart Size Finder
            </h2>

            <p className="text-slate-500 mt-3 text-sm leading-6">
              Upload a clear image and enter your measurement to get the best recommended size.
            </p>

            <div className="mt-6 relative h-[310px] rounded-[28px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 overflow-hidden shadow-[0_18px_55px_rgba(15,23,42,0.08)] grid place-items-center">
              {preview ? (
                <img
                  src={preview}
                  alt="measurement preview"
                  className="w-full h-full object-contain bg-white dark:bg-slate-900"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-center px-8 group"
                >
                  <div className="w-20 h-20 rounded-full bg-cyan-100 text-cyan-700 mx-auto grid place-items-center group-hover:scale-110 transition">
                    <ImagePlus size={32} />
                  </div>

                  <h3 className="text-xl font-black mt-4">
                    Upload photo
                  </h3>

                  <p className="text-slate-400 mt-2 text-sm">
                    Knee, wrist, waist, neck or affected area
                  </p>
                </button>
              )}

              {loading && (
                <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm text-white flex flex-col items-center justify-center">
                  <ScanLine size={40} className="animate-pulse" />

                  <p className="font-black mt-4 text-sm tracking-wide">
                    Analyzing fit...
                  </p>

                  <div className="mt-4 w-56 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-cyan-300 rounded-full animate-pulse" />
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 bg-slate-950 text-white px-5 py-3 rounded-2xl font-black text-sm hover:scale-105 transition"
              >
                <Upload size={17} />
                {preview ? "Change Image" : "Upload Image"}
              </button>

              {preview && (
                <button
                  type="button"
                  onClick={() => {
                    setPreview("");
                    setRecommended("");
                  }}
                  className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border font-black text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="p-7 md:p-8 flex flex-col justify-center">
          <div className="inline-flex w-fit bg-purple-50 text-purple-700 rounded-full px-4 py-2 font-black text-xs">
            {product?.name || "MGRM Product"}
          </div>

          <div className="mt-7 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 grid place-items-center shrink-0">
              <Ruler />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-950 dark:text-white">
                Enter measurement
              </h3>

              <p className="text-slate-500 mt-2 text-sm leading-6">
                Measure your {fitProfile.label} and enter the value in centimeters.
              </p>
            </div>
          </div>

          <div className="mt-7">
            <label className="font-black text-slate-700 dark:text-zinc-300 text-sm">
              Measurement in CM
            </label>

            <input
              type="number"
              value={measurement}
              onChange={(e) => setMeasurement(e.target.value)}
              placeholder={fitProfile.example}
              className="mt-3 w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/10 px-5 text-lg font-black outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            type="button"
            onClick={analyze}
            disabled={loading}
            className="mt-5 h-14 rounded-2xl bg-gradient-to-r from-cyan-600 to-purple-700 text-white font-black shadow-xl hover:scale-[1.02] transition disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Analyze Size"}
          </button>

          {recommended && (
            <div className="mt-6 rounded-[26px] bg-gradient-to-br from-cyan-50 to-purple-50 border border-cyan-100 p-6">
              <div className="flex items-center gap-2 text-green-600 font-black text-sm">
                <CheckCircle2 size={18} />
                Result ready
              </div>

              <p className="text-slate-500 font-bold mt-4 text-sm">
                Recommended Size
              </p>

              <h2 className="text-5xl font-black text-slate-950 dark:text-white dark:text-white mt-1">
                {recommended}
              </h2>

              <button
                type="button"
                onClick={useSize}
                className="mt-5 w-full bg-slate-950 text-white py-3 rounded-2xl font-black hover:scale-[1.02] transition"
              >
                Use This Size
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}