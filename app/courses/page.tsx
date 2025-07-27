"use client";
import React, { useState } from 'react';
import { Check, Calendar } from 'lucide-react';
import { useCourseStore } from '../../lib/courseStore';
import Link from 'next/link';

// Define interfaces clearly
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
  pathway: string;
  prerequisites: string[];
}

export default function CourseRecommendation() {
  // Initialize state with proper types
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    major: '',
    year: "Freshman",
    pathway: '',
    prerequisites: [],
  });
  const [prerequisiteInput, setPrerequisiteInput] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [sendingToAdvisor, setSendingToAdvisor] = useState(false);
  const [advisorMessage, setAdvisorMessage] = useState<string>('');
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const setGlobalCourses = useCourseStore((state) => state.addCourses);
  const [addedToSchedule, setAddedToSchedule] = useState(false);

  // Helper functions
  const addPrerequisite = () => {
    if (prerequisiteInput.trim()) {
      setUserPreferences(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, prerequisiteInput.trim()]
      }));
      setPrerequisiteInput("");
    }
  };

  const removePrerequisite = (index: number) => {
    setUserPreferences(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  // Main fetch function with debug logs
  const fetchCourses = async () => {
    if (!userPreferences.major || !userPreferences.year) {
      setError("Please fill in at least your major and year");
      return;
    }

    setLoading(true);
    setError('');
    setCourses([]);

    try {
      const prompt = `You are a course recommendation system. Based on the following student information, recommend suitable courses:\nMajor: ${userPreferences.major}\nYear: ${userPreferences.year}\n${userPreferences.pathway ? `Desired Pathway: ${userPreferences.pathway}` : ''}\nPrerequisites Completed: ${userPreferences.prerequisites.join(', ') || 'None'}\n\nFormat each course recommendation as:\nCOURSECODE: Course Title\nDescription of the course`;

      if (typeof window === 'undefined' || !window.puter) {
        throw new Error('Puter.js not loaded.');
      }
      const response = await window.puter.ai.chat(prompt, { model: 'gpt-4.1-nano' });
      console.log('Puter.js response:', response);
      const responseText = typeof response === 'string'
        ? response
        : response.message?.content || response.text || response.message || '';

      // Parse courses from response
      const parsedCourses = responseText
        .split('\n\n')
        .filter(Boolean)
        .map((recommendation: string): Course => {
          const lines = recommendation.split('\n');
          const firstLine = lines[0]?.replace(/^\d+\.\s*/, '').replace(/Recommendation \d+:\s*/, '').replace(/\*/g, '').trim();
          const [courseCode, ...titleParts] = firstLine.split(':');
          const description = lines.slice(1).join(' ').replace(/\*/g, '').trim();
          // Truncate description to ~100 characters
          const truncatedDescription = description.length > 100 
            ? description.substring(0, 100).trim() + '...'
            : description;
          return {
            id: Math.random().toString(36).substr(2, 9),
            courseCode: courseCode?.trim() || "Unknown",
            title: titleParts.join(':').trim(),
            description: truncatedDescription,
            credits: 3
          };
        })
        .filter((course: { courseCode: string; title: string; description: any; }) => 
          course.title && 
          course.description && 
          course.courseCode !== 'Unknown'
        );

      setCourses(parsedCourses);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (course: Course) => {
    if (!enrolledCourses.some(c => c.id === course.id)) {
      setEnrolledCourses(prev => [...prev, { ...course, enrolled: true }]);
    }
  };

  const handleSendToAdvisor = async () => {
    setSendingToAdvisor(true);
    try {
      // Here you would typically make an API call to your backend
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAdvisorMessage('Successfully sent to advisor for approval!');
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setAdvisorMessage('');
      }, 3000);
    } catch (error) {
      setAdvisorMessage('Failed to send to advisor. Please try again.');
    } finally {
      setSendingToAdvisor(false);
    }
  };

  // Rest of your component JSX remains the same
  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">Course Recommendations</h1>
      
      {/* User Input Form */}
      <div className="mb-6 sm:mb-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-white mb-2 text-sm sm:text-base">Major (required)</label>
            <input
              type="text"
              value={userPreferences.major}
              onChange={(e) => setUserPreferences(prev => ({ ...prev, major: e.target.value }))}
              className="w-full bg-black/20 text-white rounded-lg px-3 sm:px-4 py-2 border border-white/10 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2 text-sm sm:text-base">Year (required)</label>
            <select
              value={userPreferences.year}
              onChange={(e) => setUserPreferences(prev => ({ ...prev, year: e.target.value as UserPreferences['year'] }))}
              className="w-full bg-black/20 text-white rounded-lg px-3 sm:px-4 py-2 border border-white/10 text-sm sm:text-base"
              required
            >
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div>
            <label className="block text-white mb-2 text-sm sm:text-base">Pathway (optional)</label>
            <input
              type="text"
              value={userPreferences.pathway}
              onChange={(e) => setUserPreferences(prev => ({ ...prev, pathway: e.target.value }))}
              className="w-full bg-black/20 text-white rounded-lg px-3 sm:px-4 py-2 border border-white/10 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-white mb-2 text-sm sm:text-base">Prerequisites</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={prerequisiteInput}
                onChange={(e) => setPrerequisiteInput(e.target.value)}
                className="flex-1 bg-black/20 text-white rounded-lg px-3 sm:px-4 py-2 border border-white/10 text-sm sm:text-base"
                placeholder="Enter prerequisite"
                onKeyPress={(e) => e.key === 'Enter' && addPrerequisite()}
              />
              <button
                onClick={addPrerequisite}
                className="bg-white/10 hover:bg-white/20 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                Add
              </button>
            </div>
            {/* Display prerequisites */}
            <div className="mt-2 flex flex-wrap gap-2">
              {userPreferences.prerequisites.map((prereq, index) => (
                <span
                  key={index}
                  className="bg-white/10 text-white px-2 sm:px-3 py-1 rounded-full flex items-center gap-2 text-xs sm:text-sm"
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
        </div>

        <button
          onClick={fetchCourses}
          disabled={loading || !userPreferences.major || !userPreferences.year}
          className="mt-4 sm:mt-6 w-full bg-white hover:bg-white/90 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
        >
          {loading ? 'Loading...' : 'Get Course Recommendations'}
        </button>
      </div>

      {error && (
        <div className="text-red-500 mb-4 text-sm sm:text-base">
          Error: {error}
        </div>
      )}

      {/* Course Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="col-span-full bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white">Available Courses</h2>
          
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="relative group"
                onMouseEnter={() => setHoveredCourse(course.id)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                <div className="flex items-center gap-3 bg-black/20 p-3 sm:p-4 rounded-xl hover:bg-black/30 transition-colors">
                  {/* Checkbox */}
                  <div
                    onClick={() => handleEnroll(course)}
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded border cursor-pointer flex items-center justify-center transition-colors
                      ${enrolledCourses.some(c => c.id === course.id)
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-500 hover:border-green-500'}`}
                  >
                    {enrolledCourses.some(c => c.id === course.id) && (
                      <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                    )}
                  </div>
                  
                  {/* Course Info */}
                  <div className="flex-grow min-w-0">
                    <h3 className="text-white font-medium text-sm sm:text-base truncate">{course.courseCode}: {course.title}</h3>
                    <p className="text-white/50 text-xs sm:text-sm">Credits: {course.credits}</p>
                  </div>
                </div>

                {/* Hover Description */}
                {hoveredCourse === course.id && (
                  <div className="absolute left-0 right-0 mt-2 bg-gray-800/95 p-3 sm:p-4 rounded-lg shadow-xl z-10 backdrop-blur-sm border border-white/10">
                    <p className="text-white/80 text-xs sm:text-sm">{course.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Course Summary (without button) */}
          {enrolledCourses.length > 0 && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
              <p className="text-white/70 text-sm sm:text-base">
                Selected: {enrolledCourses.length} courses 
                ({enrolledCourses.reduce((acc, curr) => acc + curr.credits, 0)} credits)
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                  onClick={() => {
                    setGlobalCourses(enrolledCourses);
                    setAddedToSchedule(true);
                    setTimeout(() => setAddedToSchedule(false), 2000);
                  }}
                >
                  Add Selected Courses to Schedule
                </button>
                <Link href="/schedule" className="inline-block">
                  <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-300 via-teal-300 to-purple-300 hover:from-indigo-400 hover:to-purple-400 text-indigo-900 rounded-lg shadow-lg transition-all text-sm sm:text-base font-semibold">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    View Schedule
                  </button>
                </Link>
                {addedToSchedule && (
                  <span className="text-green-400 flex items-center gap-2 text-sm sm:text-base">Added to schedule!</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Send to Advisor Button - Now between sections */}
      {enrolledCourses.length > 0 && (
        <div className="mt-6 sm:mt-8 mb-6 sm:mb-8 flex justify-end">
          <button
            onClick={handleSendToAdvisor}
            disabled={sendingToAdvisor}
            className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all
                     flex items-center gap-2 text-sm sm:text-base"
          >
            {sendingToAdvisor ? (
              <>
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              'Send to Advisor'
            )}
          </button>
        </div>
      )}

      {/* Enrolled Courses */}
      {enrolledCourses.length > 0 && (
        <div className="mt-4">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Enrolled Courses</h2>
          </div>
          
          {advisorMessage && (
            <div className={`mb-4 p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
              advisorMessage.includes('Successfully') 
                ? 'bg-green-500/20 text-green-200' 
                : 'bg-red-500/20 text-red-200'
            }`}>
              {advisorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
                  {course.courseCode}: {course.title}
                </h3>
                <p className="text-white/70 mb-3 sm:mb-4 text-sm sm:text-base">{course.description}</p>
                <p className="text-xs sm:text-sm text-white/50">Credits: {course.credits}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
