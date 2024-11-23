"use client";
import React, { useState } from 'react';

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
    console.log('Starting fetchCourses...'); // Debug log
    console.log('Current userPreferences:', userPreferences); // Debug log

    if (!userPreferences.major || !userPreferences.year) {
      setError("Please fill in at least your major and year");
      return;
    }

    setLoading(true);
    setError('');
    setCourses([]);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      console.log('API Key exists:', !!apiKey); // Debug log (don't log the actual key)

      if (!apiKey) {
        throw new Error("API key not found");
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
      console.log('Attempting API call to:', apiUrl); // Debug log

      const requestBody = {
        contents: [{
          parts: [{
            text: `You are a course recommendation system. Based on the following student information, recommend suitable courses:
            Major: ${userPreferences.major}
            Year: ${userPreferences.year}
            ${userPreferences.pathway ? `Desired Pathway: ${userPreferences.pathway}` : ''}
            Prerequisites Completed: ${userPreferences.prerequisites.join(', ') || 'None'}
            
            Format each course recommendation as:
            COURSECODE: Course Title
            Description of the course`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 32,
          topP: 1,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      console.log('Making request with body:', requestBody);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error Response:', errorData);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from API');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      console.log('Response text:', responseText); // Debug log

      // Parse courses from response
      const parsedCourses = responseText
        .split('\n\n')
        .filter(Boolean)
        .map((recommendation: string): Course => {
          const lines = recommendation.split('\n');
          return {
            id: Math.random().toString(36).substr(2, 9),
            courseCode: lines[0]?.match(/^([A-Z]+\d+)/)?.[0] || "Unknown",
            title: lines[0]?.replace(/^[0-9]+\.\s*/, '').replace(/\*/g, '').replace(/Recommendation \d+:/, '').trim(),
            description: lines.slice(1).join('\n').replace(/\*/g, '').trim(),
            credits: 3
          };
        })
        .filter((course: { title: string; description: any; }) => 
          course.title && 
          course.description && 
          course.title !== 'Unknown Course'
        );

      console.log('Parsed courses:', parsedCourses); // Debug log
      setCourses(parsedCourses);

    } catch (err) {
      console.error('Error in fetchCourses:', err); // Debug log
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Course Recommendations</h1>
      
      {/* User Input Form */}
      <div className="mb-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                onKeyPress={(e) => e.key === 'Enter' && addPrerequisite()}
              />
              <button
                onClick={addPrerequisite}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
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
        </div>

        <button
          onClick={fetchCourses}
          disabled={loading || !userPreferences.major || !userPreferences.year}
          className="mt-6 w-full bg-white hover:bg-white/90 text-black px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Loading...' : 'Get Course Recommendations'}
        </button>
      </div>

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

      {/* Course Recommendations */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-2 text-white">{course.courseCode}: {course.title}</h2>
            <p className="text-white/70 mb-4">{course.description}</p>
            <div className="flex justify-between items-center">
              <p className="text-sm text-white/50">Credits: {course.credits}</p>
              <button
                onClick={() => handleEnroll(course)}
                disabled={enrolledCourses.some(c => c.id === course.id)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {enrolledCourses.some(c => c.id === course.id) ? 'Enrolled' : 'Enroll'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Enrolled Courses */}
      {enrolledCourses.length > 0 && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Enrolled Courses</h2>
            <button
              onClick={handleSendToAdvisor}
              disabled={sendingToAdvisor || enrolledCourses.length === 0}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all
                       flex items-center gap-2"
            >
              {sendingToAdvisor ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                'Send to Advisor'
              )}
            </button>
          </div>
          
          {advisorMessage && (
            <div className={`mb-4 p-4 rounded-lg ${
              advisorMessage.includes('Successfully') 
                ? 'bg-green-500/20 text-green-200' 
                : 'bg-red-500/20 text-red-200'
            }`}>
              {advisorMessage}
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {course.courseCode}: {course.title}
                </h3>
                <p className="text-white/70 mb-4">{course.description}</p>
                <p className="text-sm text-white/50">Credits: {course.credits}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
