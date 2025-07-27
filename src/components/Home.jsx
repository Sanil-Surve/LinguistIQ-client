// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { generateLesson } from "../app/slices/lessonSlice";
// import { generateQuizzes } from "../app/slices/quizSlice";

// const Home = () => {
//   const dispatch = useDispatch();
//   const lesson = useSelector((state) => state.lesson.lesson);
//   const quizzes = useSelector((state) => state.quiz.quizzes);
//   const [input, setInput] = useState("");

//   const handleGenerateLesson = () => {
//     dispatch(generateLesson(input));
//   };

//   const handleGenerateQuizzes = () => {
//     dispatch(generateQuizzes(lesson));
//   };

//   return (
//     <div className="p-4 sm:p-8 max-w-6xl mx-auto">
//       <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
//         LinguistIQ
//       </h1>
//       <input
//         type="text"
//         className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring focus:ring-blue-300"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Enter a topic"
//       />
//       <button
//         onClick={handleGenerateLesson}
//         className="bg-blue-500 hover:bg-blue-600 text-white p-2 w-full sm:w-auto rounded mb-4"
//       >
//         Generate Lesson
//       </button>

//       {lesson && (
//         <div className="mb-4">
//           <h2 className="text-xl sm:text-2xl font-bold">Topic</h2>
//           <pre className="text-sm sm:text-base">{lesson}</pre>
//         </div>
//       )}

//       <button
//         onClick={handleGenerateQuizzes}
//         className="bg-green-500 hover:bg-green-600 text-white p-2 w-full sm:w-auto rounded disabled:opacity-50"
//         disabled={!lesson}
//       >
//         Generate Quizzes
//       </button>

//       {quizzes && (
//         <div className="mt-4">
//           <h2 className="text-xl sm:text-2xl font-bold">Quizzes</h2>
//           <pre className="text-sm sm:text-base bg-gray-100 p-4 rounded overflow-auto">
//             {quizzes}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;

// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { generateLesson } from "../app/slices/lessonSlice";
// import { generateQuizzes } from "../app/slices/quizSlice";

// const Home = () => {
//   const dispatch = useDispatch();
//   const lesson = useSelector((state) => state.lesson.lesson);
//   const quizzes = useSelector((state) => state.quiz.quizzes);
//   const lessonLoading = useSelector((state) => state.lesson.loading);
//   const quizLoading = useSelector((state) => state.quiz.loading);
//   const [input, setInput] = useState("");

//   const handleGenerateLesson = () => {
//     if (input.trim()) {
//       dispatch(generateLesson(input));
//     }
//   };

//   const handleGenerateQuizzes = () => {
//     dispatch(generateQuizzes(lesson));
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && input.trim()) {
//       handleGenerateLesson();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
//         {/* Header */}
//         <div className="text-center mb-8 sm:mb-12">
//           <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
//             🧠 LinguistIQ
//           </h1>
//           <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
//             Generate personalized lessons and quizzes powered by AI
//           </p>
//         </div>

//         {/* Input Section */}
//         <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
//           <div className="space-y-4 sm:space-y-6">
//             <div>
//               <label
//                 htmlFor="topic-input"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Enter a topic to learn about
//               </label>
//               <input
//                 id="topic-input"
//                 type="text"
//                 className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="e.g., Machine Learning, English Grammar, World History..."
//               />
//             </div>
//             <button
//               onClick={handleGenerateLesson}
//               disabled={!input.trim() || lessonLoading}
//               className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//             >
//               {lessonLoading ? (
//                 <span className="flex items-center justify-center">
//                   <svg
//                     className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Generating Lesson...
//                 </span>
//               ) : (
//                 "📚 Generate Lesson"
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Lesson Display */}
//         {lesson && (
//           <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
//             <div className="flex items-center mb-4 sm:mb-6">
//               <div className="bg-blue-100 p-2 rounded-lg mr-3">
//                 <span className="text-2xl">📖</span>
//               </div>
//               <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
//                 Generated Lesson
//               </h2>
//             </div>
//             <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
//               <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border-l-4 border-blue-500">
//                 <div
//                   className="text-gray-800 leading-relaxed"
//                   dangerouslySetInnerHTML={{
//                     __html: lesson
//                       .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
//                       .replace(/\*(.*?)\*/g, "<em>$1</em>")
//                       .replace(/\n\n/g, "</p><p>")
//                       .replace(/\n/g, "<br>")
//                       .replace(/^/, "<p>")
//                       .replace(/$/, "</p>"),
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Generate Quiz Button */}
//             <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
//               <button
//                 onClick={handleGenerateQuizzes}
//                 disabled={!lesson || quizLoading}
//                 className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//               >
//                 {quizLoading ? (
//                   <span className="flex items-center justify-center">
//                     <svg
//                       className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Generating Quiz...
//                   </span>
//                 ) : (
//                   "🧩 Generate Quiz"
//                 )}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Quiz Display */}
//         {quizzes && (
//           <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
//             <div className="flex items-center mb-4 sm:mb-6">
//               <div className="bg-green-100 p-2 rounded-lg mr-3">
//                 <span className="text-2xl">🎯</span>
//               </div>
//               <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
//                 Generated Quiz
//               </h2>
//             </div>
//             <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
//               <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 sm:p-6 border-l-4 border-green-500">
//                 <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
//                   {quizzes}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Empty State */}
//         {!lesson && !lessonLoading && (
//           <div className="text-center py-12 sm:py-16">
//             <div className="text-6xl sm:text-8xl mb-4">🎓</div>
//             <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
//               Ready to start learning?
//             </h3>
//             <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
//               Enter any topic above and let our AI generate a personalized
//               lesson and quiz for you.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateLesson, resetLesson } from "../app/slices/lessonSlice";
import { generateQuizzes, resetQuizzes } from "../app/slices/quizSlice";

const Home = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");

  // Lesson state
  const lesson = useSelector((state) => state.lesson.lesson);
  const lessonStatus = useSelector((state) => state.lesson.status);
  const lessonError = useSelector((state) => state.lesson.error);

  // Quiz state
  const quizzes = useSelector((state) => state.quiz.quizzes);
  const quizStatus = useSelector((state) => state.quiz.status);
  const quizError = useSelector((state) => state.quiz.error);

  const handleGenerateLesson = () => {
    if (input.trim()) {
      dispatch(resetLesson());
      dispatch(resetQuizzes());
      dispatch(generateLesson(input));
    }
  };

  const handleGenerateQuizzes = () => {
    if (lesson) {
      dispatch(resetQuizzes());
      dispatch(generateQuizzes(lesson));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && input.trim()) {
      handleGenerateLesson();
    }
  };

  // Format lesson content with markdown support
  const formatLessonContent = (content) => {
    if (!content || typeof content !== "string") return "";
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>")
      .replace(/^/, "<p>")
      .replace(/$/, content.endsWith("</p>") ? "" : "</p>");
  };

  // Format quiz content with proper line breaks
  const formatQuizContent = (content) => {
    if (!content) return "";
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
            🧠 LinguistIQ
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Generate personalized lessons and quizzes powered by AI
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="topic-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter a topic to learn about
              </label>
              <input
                id="topic-input"
                type="text"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Machine Learning, English Grammar, World History..."
              />
            </div>
            <button
              onClick={handleGenerateLesson}
              disabled={!input.trim() || lessonStatus === "loading"}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {lessonStatus === "loading" ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {lessonStatus === "streaming"
                    ? "Generating..."
                    : "Loading..."}
                </span>
              ) : (
                "📚 Generate Lesson"
              )}
            </button>
            {lessonError && (
              <div className="text-red-500 text-sm mt-2">{lessonError}</div>
            )}
          </div>
        </div>

        {/* Lesson Display */}
        {(lesson || lessonStatus === "loading") && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <span className="text-2xl">📖</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Generated Lesson
              </h2>
            </div>
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border-l-4 border-blue-500">
                <div
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: formatLessonContent(lesson),
                  }}
                />
                {lessonStatus === "streaming" && (
                  <div className="mt-2 flex items-center">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm text-blue-600">
                      AI is generating...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Quiz Button */}
            <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleGenerateQuizzes}
                disabled={!lesson || quizStatus === "loading"}
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {quizStatus === "loading" ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {quizStatus === "streaming"
                      ? "Generating..."
                      : "Loading..."}
                  </span>
                ) : (
                  "🧩 Generate Quiz"
                )}
              </button>
              {quizError && (
                <div className="text-red-500 text-sm mt-2">{quizError}</div>
              )}
            </div>
          </div>
        )}

        {/* Quiz Display */}
        {(quizzes || quizStatus === "loading") && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Generated Quiz
              </h2>
            </div>
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 sm:p-6 border-l-4 border-green-500">
                <div className="text-gray-800 leading-relaxed">
                  {formatQuizContent(quizzes)}
                </div>
                {quizStatus === "streaming" && (
                  <div className="mt-2 flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm text-green-600">
                      AI is generating...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!lesson && lessonStatus !== "loading" && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-6xl sm:text-8xl mb-4">🎓</div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
              Ready to start learning?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
              Enter any topic above and let our AI generate a personalized
              lesson and quiz for you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
