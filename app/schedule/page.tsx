import React from 'react'

export default function Schedule() {
  const timeSlots = [
    "8am", "9am", "10am", "11am", "12pm", 
    "1pm", "2pm", "3pm", "4pm", "5pm"
  ];
  const days = ["M", "T", "W", "R", "F"];

  return (
    <div className="min-h-screen pt-24 pb-6 px-6 font-poppins overflow-y-auto">
      <h1 className="text-4xl font-bold text-white mb-1">Schedule</h1>
      <p className="text-white/70 mb-4">Your approved course schedule</p>

      <div className="bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/10">
        {/* Schedule Grid */}
        <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-[1px] bg-white/10">
          {/* Time Column */}
          <div className="bg-black/40">
            <div className="h-12"></div> {/* Empty cell for header */}
            {timeSlots.map((time) => (
              <div key={time} className="h-20 flex items-center justify-center text-white/70">
                {time}
              </div>
            ))}
          </div>

          {/* Days Columns */}
          {days.map((day) => (
            <div key={day} className="bg-black/40">
              <div className="h-12 flex items-center justify-center text-white font-medium">
                {day}
              </div>
              {timeSlots.map((time) => (
                <div key={`${day}-${time}`} className="h-20 border-t border-white/5">
                  {/* Course blocks will go here */}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex justify-end gap-4">
        <button className="px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all">
          Share Schedule
        </button>
        <button className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-all">
          Export Calendar
        </button>
      </div>
    </div>
  );
}