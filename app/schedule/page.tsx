"use client";

import React, { useState } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useCourseStore } from '../../lib/courseStore';
import Link from 'next/link';

const COURSE_COLORS = [
  'bg-indigo-200 text-indigo-900', // lavender
  'bg-teal-200 text-teal-900',     // teal
  'bg-purple-200 text-purple-900', // soft purple
  'bg-pink-200 text-pink-900',     // pink
  'bg-sky-200 text-sky-900',       // sky blue
  'bg-emerald-200 text-emerald-900', // mint/green
  'bg-yellow-200 text-yellow-900', // pastel yellow
];

export default function Schedule() {
  const timeSlots = [
    "8am", "9am", "10am", "11am", "12pm", 
    "1pm", "2pm", "3pm", "4pm", "5pm"
  ];
  const days = ["M", "T", "W", "R", "F"];
  const enrolledCourses = useCourseStore((state) => state.enrolledCourses);

  // State for placing courses
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    enrolledCourses[0]?.id || null
  );
  const [hoverCell, setHoverCell] = useState<{ day: string; time: string } | null>(null);
  const [placedCourses, setPlacedCourses] = useState<
    Array<{ courseId: string; day: string; time: string }>
  >([]);

  // Helper to get course color
  const getCourseColor = (courseId: string) => {
    const idx = enrolledCourses.findIndex((c) => c.id === courseId);
    return COURSE_COLORS[idx % COURSE_COLORS.length];
  };

  // Helper to get course by id
  const getCourse = (courseId: string) =>
    enrolledCourses.find((c) => c.id === courseId);

  // Check if a course is placed in a cell
  const getPlacedCourse = (day: string, time: string) =>
    placedCourses.find((p) => p.day === day && p.time === time);

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-6 px-4 sm:px-6 font-poppins overflow-y-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">Schedule</h1>
      <p className="text-white/70 mb-4 text-sm sm:text-base">Place your courses on the schedule</p>

      {/* Add Course Button */}
      <div className="mb-4 sm:mb-6">
        <Link href="/courses">
          <button className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 hover:from-pink-300 hover:via-purple-400 hover:to-indigo-300 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg transition-all text-sm sm:text-base">
            Get courses to add to schedule
          </button>
        </Link>
      </div>

      {/* Course Picker */}
      {enrolledCourses.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <span className="text-white/80 font-medium text-sm sm:text-base block mb-3">Select a course to place:</span>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {enrolledCourses.map((course) => (
              <button
                key={course.id}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium shadow transition-all border-2 focus:outline-none text-xs sm:text-sm ${
                  selectedCourseId === course.id
                    ? `${getCourseColor(course.id)} border-white text-white scale-105`
                    : 'bg-white/10 border-transparent text-white/80 hover:bg-white/20'
                }`}
                onClick={() => setSelectedCourseId(course.id)}
              >
                {course.courseCode}: {course.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-black/20 rounded-lg p-2 sm:p-4 backdrop-blur-sm border border-white/10 overflow-x-auto">
        {/* Schedule Grid */}
        <div className="grid grid-cols-[80px_repeat(5,1fr)] sm:grid-cols-[100px_repeat(5,1fr)] gap-[1px] bg-white/10 min-w-[600px]">
          {/* Time Column */}
          <div className="bg-black/40">
            <div className="h-10 sm:h-12"></div> {/* Empty cell for header */}
            {timeSlots.map((time) => (
              <div key={time} className="h-16 sm:h-20 flex items-center justify-center text-white/70 text-xs sm:text-sm">
                {time}
              </div>
            ))}
          </div>

          {/* Days Columns */}
          {days.map((day) => (
            <div key={day} className="bg-black/40">
              <div className="h-10 sm:h-12 flex items-center justify-center text-white font-medium text-sm sm:text-base">
                {day}
              </div>
              {timeSlots.map((time) => {
                const placed = getPlacedCourse(day, time);
                const isHovering =
                  hoverCell &&
                  hoverCell.day === day &&
                  hoverCell.time === time &&
                  selectedCourseId &&
                  !placed;
                return (
                  <div
                    key={`${day}-${time}`}
                    className="h-16 sm:h-20 border-t border-white/5 relative cursor-pointer group"
                    onMouseEnter={() => setHoverCell({ day, time })}
                    onMouseLeave={() => setHoverCell(null)}
                    onClick={() => {
                      if (
                        selectedCourseId &&
                        !placed &&
                        !placedCourses.some(
                          (p) => p.courseId === selectedCourseId && p.day === day && p.time === time
                        )
                      ) {
                        setPlacedCourses((prev) => [
                          ...prev,
                          { courseId: selectedCourseId, day, time },
                        ]);
                      }
                    }}
                  >
                    {/* Placed course */}
                    {placed && (
                      <div
                        className={`absolute inset-1 sm:inset-2 rounded-lg flex flex-col justify-center items-center text-white font-semibold text-[10px] sm:text-xs shadow-lg ${getCourseColor(
                          placed.courseId
                        )} animate-fade-in`}
                        style={{ zIndex: 2 }}
                      >
                        <span>{getCourse(placed.courseId)?.courseCode}</span>
                        <span className="text-[8px] sm:text-[10px] font-normal">
                          {getCourse(placed.courseId)?.title}
                        </span>
                      </div>
                    )}
                    {/* Hover preview */}
                    {isHovering && (
                      <div
                        className={`absolute inset-1 sm:inset-2 rounded-lg flex flex-col justify-center items-center text-white font-semibold text-[10px] sm:text-xs opacity-80 border-2 border-dashed border-white ${getCourseColor(
                          selectedCourseId
                        )} animate-fade-in`}
                        style={{ zIndex: 1 }}
                      >
                        <span>{getCourse(selectedCourseId)?.courseCode}</span>
                        <span className="text-[8px] sm:text-[10px] font-normal">
                          {getCourse(selectedCourseId)?.title}
                        </span>
                        <span className="text-[7px] sm:text-[9px] mt-1 italic">Click to place</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Add a simple fade-in animation
// Add this to your global CSS or tailwind.config.js:
// .animate-fade-in { animation: fadeIn 0.3s; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }