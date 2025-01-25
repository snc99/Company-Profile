// components/Hero.tsx
const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-center px-8">
      <h1 className="text-5xl font-bold text-blue-700 mb-4">
        Welcome to Our Company
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        We build modern and innovative solutions for your business needs.
      </p>
      <div className="flex space-x-4">
        <a
          href="#about"
          className="px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-600 transition"
        >
          Learn More
        </a>
        <a
          href="#contact"
          className="px-6 py-3 border border-blue-700 text-blue-700 rounded-md hover:bg-blue-700 hover:text-white transition"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
};

export default Hero;
