
export default function Home() {
  return (
    // <div
    // 	className={`${poppins.className} flex flex-col items-center justify-center min-h-screen bg-cover bg-center`}
    // 	style={{
    // 		backgroundImage: `url(${backgroundImage.src})`,
    // 		backgroundSize: "cover",
    // 		backgroundPosition: "center",
    // 		backgroundRepeat: "no-repeat",
    // 	}}
    // >

    <div className="h-full font-poppins text-center grid place-items-center items-center justify-center flex-grow p-2">
      {/* Main Title */}
      <section className="flex flex-col justify-center items-center bg-gradient-to-r from-primary to-secondary text[#543D75ff]">
        <h1 className="text-7xl md:text-5xl font-semibold mb-4 drop-shadow-md">
        <p>
      <span>Your digital companion for<br></br></span>
      <span>seamless learning</span>
       </p>

        </h1>
        {/* Motto */}
        {/*<h2 className='text-3xl md:text-4xl font-semibold w-full text-center mx-auto mb-6 drop-shadow-md'>
            <span className='text-[#385435ff]'>Know</span> Your Semester
        </h2>*/}
        {/* Additional Text */}
        <p className="text-lg md:text-xl drop-shadow-md mt-4 mb-8 px-4">
          Efficiently manage your courses, schedule and chatbot all in one
          place.
        </p>
        <div>
        </div>
         <div className="flex items-center space-x-4">
  <button className="text-white bg-[#543D75ff] px-6 py-3 rounded-md font-semibold transition-transform transform hover:scale-105">
    Get Started
  </button>
  <a href="#learn-more">
    <button className="text-purple bg-transparent border-2 border-white px-6 py-3 rounded-md font-semibold transition-transform transform hover:scale-105">
      Learn More
    </button>
  </a>
</div>

      </section>
    </div>

  );
}
