// components/Skills.tsx
export default function Skills() {
  return (
    <section
      id="skills"
      className="min-h-screen flex items-center justify-center bg-blue-50 text-gray-700"
    >
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-center">Our Skills</h2>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <li>Web Development</li>
          <li>UI/UX Design</li>
          <li>SEO Optimization</li>
          <li>Consulting</li>
        </ul>
      </div>
    </section>
  );
}
