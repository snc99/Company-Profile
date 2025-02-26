export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-200 to-white text-blue-700 py-6 text-center">
      <p className="text-sm hover:text-blue-900 transition">
        &copy; {new Date().getFullYear()} Irvan Sandy. All rights reserved.
      </p>
    </footer>
  );
}
