import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

function ContactUsPage() {
  return (
    <div className="bg-white min-h-screen relative">
      {/* Floating Back to Home Button */}
      <Link
        href="/"
        className="fixed top-8 left-8 flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:-translate-y-1 z-50"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Home
      </Link>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-white py-32 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Contact Us
        </h1>
        <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
          Have questions or feedback? Reach out to us and we’ll get back to you promptly.
        </p>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <Card className="p-10 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+91 12345 67890"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="123 Main Street, City, Country"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Write your message here..."
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="px-10 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105 transition-transform transform"
                >
                  Send Message
                </button>
              </div>
            </form>
          </Card>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-24 bg-blue-50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 text-center">
          <Card className="p-6 shadow hover:shadow-lg transition-shadow">
            <Mail className="mx-auto h-8 w-8 text-blue-600 mb-2" />
            <p className="text-lg text-slate-700 font-medium">support@eduloanpro.com</p>
          </Card>
          <Card className="p-6 shadow hover:shadow-lg transition-shadow">
            <Phone className="mx-auto h-8 w-8 text-blue-600 mb-2" />
            <p className="text-lg text-slate-700 font-medium">+91 12345 67890</p>
          </Card>
          <Card className="p-6 shadow hover:shadow-lg transition-shadow">
            <MapPin className="mx-auto h-8 w-8 text-blue-600 mb-2" />
            <p className="text-lg text-slate-700 font-medium">123 Main Street, City, Country</p>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default ContactUsPage;
