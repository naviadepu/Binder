import { Poppins } from '@next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });

export default function Courses() {
  return (
    <div className={`${poppins.className} min-h-screen p-6`}>
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Schedule</h1>
        <p className="text-lg">Schedule your classes here!.</p>
      </header>

      <main className="flex flex-col gap-6">
        {/* Example Course Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800">Course Title</h2>
          <p className="text-gray-600 mt-2">Time, Date, Class etc. </p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Plan</button>
        </div>

        {/* Add more course cards as needed */}
      </main>
    </div>
  );  
}