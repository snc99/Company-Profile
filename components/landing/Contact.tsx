// components/Contact.tsx
export default function Contact() {
  return (
    <section
      id="contact"
      className="min-h-screen bg-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-700">Contact Us</h2>
        <form
          action="/api/contact"
          method="POST"
          className="flex flex-col space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="p-2 rounded bg-white text-gray-800"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="p-2 rounded bg-white text-gray-800"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            className="p-2 rounded bg-white text-gray-800"
          ></textarea>
          <button type="submit" className="bg-white text-lightBlue p-2 rounded">
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
