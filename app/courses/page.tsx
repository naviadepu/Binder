"use client";
import React, { ReactNode, useState } from "react";

interface Course {
  id: string;
  courseCode: string;
  title: string;
  description: string;
  credits: number;
  enrolled?: boolean;
}

interface UserPreferences {
  major: string;
  year: "Freshman" | "Sophomore" | "Junior" | "Senior";
  pathway?: string;
  prerequisites: string[];
}

export default function CoursesPage() {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    major: "",
    year: "Freshman",
    pathway: "",
    prerequisites: [],
  });
  const [prerequisiteInput, setPrerequisiteInput] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const addPrerequisite = () => {
    if (prerequisiteInput.trim()) {
      setUserPreferences((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, prerequisiteInput.trim()],
      }));
      setPrerequisiteInput("");
    }
  };

  const removePrerequisite = (index: number) => {
    setUserPreferences((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index),
    }));
  };

  const fetchCourses = async () => {
    if (!userPreferences.major || !userPreferences.year) {
      setError("Please fill in at least your major and year");
      return;
    }

    setLoading(true);
    setError("");
    setCourses([]);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      console.log('API Key exists:', !!apiKey);
      if (!apiKey) {
        throw new Error("API key not found. Please configure it in your .env.local file.");
      }

      const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate 3 course recommendations for a student with the following profile:
                Major: ${userPreferences.major}
                Year: ${userPreferences.year}
                ${userPreferences.pathway ? `Desired Pathway: ${userPreferences.pathway}` : ""}
                Prerequisites Completed: ${userPreferences.prerequisites.join(", ") || "None"}

                Please format recommendations as plain text with course titles and descriptions.`,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
      }

      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;
      console.log('API Response:', responseText);

      const courseRecommendations = responseText.split('\n\n').filter(Boolean);
      
      const parsedCourses = courseRecommendations
        .map((recommendation: string) => {
          const lines = recommendation.split('\n');
          return {
            id: Math.random().toString(36).substr(2, 9),
            courseCode: lines[0]?.match(/^([A-Z]+\d+)/)?.[0] || "Unknown",
            title: lines[0]?.replace(/^[0-9]+\.\s*/, '').replace(/\*/g, '').replace(/Recommendation \d+:/, '').trim(),
            description: lines.slice(1).join('\n').replace(/\*/g, '').trim(),
            credits: 3,
            prerequisites: []
          };
        })
        .filter((course: Course) => 
          course.title && 
          course.description && 
          course.title !== 'Unknown Course' && 
          course.description !== 'No description available'
        );

      setCourses(parsedCourses);
    } catch (err: unknown) {
      console.error("Error fetching courses:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (course: Course) => {
    setEnrolledCourses(prev => [...prev, course]);
  };

  const sendToAdvisor = () => {
    alert('Course approval request sent to advisor!');
  };

  return (
    <div className="min-h-screen w-full p-8">
      {/* User Input Form */}
      <div className="max-w-2xl mx-auto mb-8 bg-black/10 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Enter Your Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2">Major (required)</label>
            <input
              type="text"
              value={userPreferences.major}
              onChange={(e) => setUserPreferences(prev => ({ ...prev, major: e.target.value }))}
              className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/10"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Year (required)</label>
            <select
              value={userPreferences.year}
              onChange={(e) => setUserPreferences(prev => ({ ...prev, year: e.target.value as UserPreferences['year'] }))}
              className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/10"
              required
            >
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div>
            <label className="block text-white mb-2">Pathway (optional)</label>
            <input
              type="text"
              value={userPreferences.pathway}
              onChange={(e) => setUserPreferences(prev => ({ ...prev, pathway: e.target.value }))}
              className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/10"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Prerequisites</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prerequisiteInput}
                onChange={(e) => setPrerequisiteInput(e.target.value)}
                className="flex-1 bg-black/20 text-white rounded-lg px-4 py-2 border border-white/10"
                placeholder="Enter prerequisite"
              />
              <button
                onClick={addPrerequisite}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
            {/* Display prerequisites */}
            <div className="mt-2 flex flex-wrap gap-2">
              {userPreferences.prerequisites.map((prereq, index) => (
                <span
                  key={index}
                  className="bg-white/10 text-white px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {prereq}
                  <button
                    onClick={() => removePrerequisite(index)}
                    className="text-white/60 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={fetchCourses}
            className="w-full bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-all"
            disabled={loading || !userPreferences.major || !userPreferences.year}
          >
            {loading ? "Loading..." : "Get Course Recommendations"}
          </button>
          
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>
      </div>

      {/* Course Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-black/10 backdrop-blur-xl p-6 rounded-xl border border-white/10"
          >
            <div className="text-white/50 text-sm mb-2">{course.courseCode}</div>
            <h3 className="text-lg font-bold text-white">{course.title}</h3>
            <p className="text-white/70 mt-2">{course.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-white/50">{course.credits} credits</div>
              <button
                onClick={() => handleEnroll(course)}
                disabled={enrolledCourses.some(c => c.id === course.id)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {enrolledCourses.some(c => c.id === course.id) ? "Enrolled" : "Enroll"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Enrolled Courses */}
      {enrolledCourses.length > 0 && (
        <div className="mt-12 bg-black/10 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Enrolled Courses</h2>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="bg-black/20 p-4 rounded-lg border border-white/10"
              >
                <h3 className="text-white font-bold">{course.title}</h3>
                <p className="text-white/70 text-sm mt-1">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
