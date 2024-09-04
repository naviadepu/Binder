import { Poppins } from '@next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });

export default function Courses() {
  return (
    <div className={`${poppins.className} min-h-screen p-6 bg-gray-100`}>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Courses</h1>
        <p className="text-lg text-gray-600">Explore the courses available to you.</p>
      </header>

      <main className="flex flex-col gap-6">
        {/* Example Course Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800">Course Title</h2>
          <p className="text-gray-600 mt-2">Course description goes here. This can include details about what the course covers, prerequisites, and other relevant information.</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Enroll</button>
        </div>

        {/* Add more course cards as needed */}
      </main>
    </div>
  );  
}
