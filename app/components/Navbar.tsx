// components/Navbar.tsx
export default function Navbar() {
  return (
    <nav className="bg-lightBlue text-white fixed w-full p-4 shadow-lg z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Company Name</h1>
        <ul className="flex space-x-4">
          <li><a href="#hero" className="hover:underline">Home</a></li>
          <li><a href="#about" className="hover:underline">About</a></li>
          <li><a href="#skills" className="hover:underline">Skills</a></li>
          <li><a href="#work-history" className="hover:underline">Work History</a></li>
          <li><a href="#contact" className="hover:underline">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}
