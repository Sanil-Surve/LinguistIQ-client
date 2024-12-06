import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateLesson } from "./lessonSlice";
import { generateQuizzes } from "./quizSlice";
import Navbar from "./Navbar";

function App() {
  const dispatch = useDispatch();
  const lesson = useSelector((state) => state.lesson.lesson);
  const quizzes = useSelector((state) => state.quiz.quizzes);
  const user = useSelector((state) => state.auth.user);
  const [input, setInput] = useState("");

  const handleGenerateLesson = () => {
    dispatch(generateLesson(input));
  };

  const handleGenerateQuizzes = () => {
    dispatch(generateQuizzes(lesson));
  };

  return (
    <div>
      <Navbar />

      {/* Conditional rendering based on user authentication */}
      {user ? (
        <div className="p-4 sm:p-8 max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            LinguistIQ
          </h1>
          <input
            type="text"
            className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring focus:ring-blue-300"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a topic"
          />
          <button
            onClick={handleGenerateLesson}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 w-full sm:w-auto rounded mb-4"
          >
            Generate Lesson
          </button>

          {lesson && (
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">Topic</h2>
              <p className="text-sm sm:text-base">{lesson}</p>
            </div>
          )}

          <button
            onClick={handleGenerateQuizzes}
            className="bg-green-500 hover:bg-green-600 text-white p-2 w-full sm:w-auto rounded disabled:opacity-50"
            disabled={!lesson}
          >
            Generate Quizzes
          </button>

          {quizzes && (
            <div className="mt-4">
              <h2 className="text-xl sm:text-2xl font-bold">Quizzes</h2>
              <pre className="text-sm sm:text-base bg-gray-100 p-4 rounded overflow-auto">
                {quizzes}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to LinguistIQ</h1>
            <p className="text-lg">
              Please sign in to access the full features of the app.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
