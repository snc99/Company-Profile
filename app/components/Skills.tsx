// components/Skills.tsx
export default function Skills() {
    return (
      <section id="skills" className="py-16 bg-lightBlue text-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Our Skills</h2>
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
  