// "use client";
// import { useStorage } from "@liveblocks/react";
// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function Projector() {
//     const [theme, setTheme] = useState<"dark" | "light">("dark");
//     const verse = useStorage((root) => root.currentVerse);
    
//     useEffect(() => {
//         const handleKey = (e: KeyboardEvent) => {
//             if (e.key === "f") {
//                 const el = document.documentElement;
//                 if (!document.fullscreenElement) el.requestFullscreen();
//                 else document.exitFullscreen();
//             }
//             if (e.key === "t") {
//                 setTheme((prev) => (prev === "dark" ? "light" : "dark"));
//             }
//         };

//         window.addEventListener("keydown", handleKey);
//         return () => window.removeEventListener("keydown", handleKey);
//     }, [verse]);

//     if (
//         !verse ||
//         typeof verse !== "object" ||
//         verse === null ||
//         !("book" in verse) ||
//         !("chapter" in verse) ||
//         !("verse" in verse) ||
//         !("text" in verse)
//     ) {
//         return (
//             <div className="h-screen flex items-center justify-center text-4xl text-gray-400 bg-gray-900">
//                 Waiting for verse to be selected...
//             </div>
//         );
//     }

//     return (
//         <div className={`h-screen w-screen flex items-center justify-center p-8 ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
//             {/* Screen frame */}
//             <div className={`relative w-full max-w-6xl h-5/6 rounded-xl overflow-hidden border-8 ${theme === "dark" ? "border-gray-700" : "border-gray-300"} shadow-2xl`}>
//                 {/* Bezel */}
//                 <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
//                     {/* Screen content */}
//                     <div className="flex flex-col items-center justify-center h-full w-full text-center">
//                         {/* Reference */}
//                         <div className={`text-2xl mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
//                             {(verse as any).book} {(verse as any).chapter}:{(verse as any).verse}
//                         </div>
                        
//                         {/* Verse text */}
//                         <div className="flex-1 flex items-center justify-center w-full">
//                             <AnimatePresence mode="wait">
//                                 <motion.div
//                                     key={`${verse.book}-${verse.chapter}-${verse.verse}`}
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                     transition={{ duration: 0.5 }}
//                                     className={`${(verse as any).text.length >= 200 ? "text-4xl" : "text-5xl"} font-bold ${
//                                         theme === "light" ? "text-gray-800" : "text-white"
//                                     } leading-snug max-w-4xl px-8`}
//                                 >
//                                     {`${(verse as any).text}`}
//                                 </motion.div>
//                             </AnimatePresence>
//                         </div>
                        
//                         {/* Translation */}
//                         <div className={`text-xl mt-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"} uppercase`}>
//                             {(verse as any).translation} version
//                         </div>
//                     </div>
//                 </div>
                
//                 {/* Frame details */}
//                 <div className={`absolute top-0 left-0 right-0 h-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}></div>
//                 <div className={`absolute bottom-0 left-0 right-0 h-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}></div>
//                 <div className={`absolute left-0 top-0 bottom-0 w-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}></div>
//                 <div className={`absolute right-0 top-0 bottom-0 w-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}></div>
                
//                 {/* Branding/controls */}
//                 <div className={`absolute bottom-4 left-4 text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
//                     Scripture Projector v1.0
//                 </div>
//                 <div className={`absolute bottom-4 right-4 text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
//                     Press <strong>F</strong> for fullscreen | <strong>T</strong> to toggle theme
//                 </div>
//             </div>
//         </div>
//     );
// }
"use client";
import { useStorage } from "@liveblocks/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Projector() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const verse = useStorage((root) => root.currentVerse);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "f") {
        const el = document.documentElement;
        if (!document.fullscreenElement) el.requestFullscreen();
        else document.exitFullscreen();
      }
      if (e.key === "t") {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [verse]);

  if (
    !verse ||
    typeof verse !== "object" ||
    verse === null ||
    !("book" in verse) ||
    !("chapter" in verse) ||
    !("verse" in verse) ||
    !("text" in verse)
  ) {
    return (
      <div className="h-screen flex items-center justify-center text-6xl text-gray-400 bg-gray-900">
        Waiting for verse to be selected...
      </div>
    );
  }

  return (
    <div
      className={`h-screen w-screen flex items-center justify-center p-4 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Giant screen frame */}
      <div
        className={`relative w-full h-full max-w-[90vw] max-h-[90vh] rounded-xl overflow-hidden border-8 ${
          theme === "dark" ? "border-gray-700" : "border-gray-300"
        } shadow-[0_0_40px_rgba(0,0,0,0.5)]`}
      >
        {/* Screen content area */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center p-12 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Reference */}
          <div
            className={`text-4xl mb-8 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {(verse as any).book} {(verse as any).chapter}:
            {(verse as any).verse}
          </div>

          {/* Verse text - dynamically scaled based on length */}
          <div className="flex-1 flex items-center justify-center w-full px-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${verse.book}-${verse.chapter}-${verse.verse}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5 }}
                className={`${
                  (verse as any).text.length >= 200 ? "text-6xl" : "text-7xl"
                } ${
                  (verse as any).text.length >= 300 ? "text-5xl" : ""
                } font-bold ${
                  theme === "light" ? "text-gray-900" : "text-white"
                } leading-[1.3] max-w-6xl text-center`}
                style={{ lineHeight: "1.4" }}
              >
                {`${(verse as any).text}`}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Translation */}
          <div
            className={`text-3xl mt-12 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            } uppercase tracking-wider`}
          >
            {(verse as any).translation} version
          </div>
        </div>

        {/* Frame details */}
        <div
          className={`absolute top-0 left-0 right-0 h-4 ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 right-0 h-4 ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`absolute left-0 top-0 bottom-0 w-4 ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`absolute right-0 top-0 bottom-0 w-4 ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-300"
          }`}
        ></div>

        {/* Controls */}
        <div
          className={`absolute bottom-8 left-8 text-xl ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Scripture Display
        </div>
        <div
          className={`absolute bottom-8 right-8 text-xl ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <span className="hidden md:inline">Press </span>
          <strong>F</strong>{" "}
          <span className="hidden md:inline">for fullscreen</span> |
          <strong>T</strong>{" "}
          <span className="hidden md:inline">to toggle theme</span>
        </div>
      </div>
    </div>
  );
}