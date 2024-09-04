import { Poppins } from '@next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });

// Import the image from the app folder
import backgroundImage from '../app/background.jpeg';

export default function Home() {
  return (
    <div
      className={`${poppins.className} flex flex-col items-center justify-center min-h-screen bg-cover bg-center`}
      style={{ 
        backgroundImage: `url(${backgroundImage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="text-center flex flex-col items-center justify-center flex-grow p-4">
        {/* Main Title */}
        <h1 className="text-7xl md:text-8xl font-bold text-white mb-4 shadow-md">
          BINDER
        </h1>
        {/* Motto */}
        <h2 className="text-3xl md:text-4xl font-semibold text-white w-full text-center mx-auto mb-6 shadow-md">
          <span className="text-yellow-400">Know</span> Your Semester
        </h2>
        {/* Additional Text */}
        <p className="text-lg md:text-xl text-white shadow-md mt-4 mb-8 px-4">
          Efficiently manage your courses, map, and schedule all in one place.
        </p>
      </div>
    </div>
  );
}
