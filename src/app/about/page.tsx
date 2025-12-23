import { Card } from "@/components/ui/card";
import { Users, Target, Heart, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function AboutUsPage() {
  const coreValues = [
    {
      icon: Heart,
      title: "Integrity",
      description: "Honesty and transparency guide all our decisions.",
    },
    {
      icon: Users,
      title: "Student-Centric",
      description: "Every choice revolves around empowering students.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Supporting learners from every corner of the world.",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Leveraging tech to simplify education financing.",
    },
  ];

  const teamMembers = [
    { name: "Ananya Sharma", role: "CEO & Founder", image: "/team/ananya.jpg" },
    { name: "Rohit Verma", role: "CTO", image: "/team/rohit.jpg" },
    {
      name: "Meera Iyer",
      role: "Head of Operations",
      image: "/team/meera.jpg",
    },
    {
      name: "Siddharth Gupta",
      role: "Head of Finance",
      image: "/team/siddharth.jpg",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-50 to-white py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            About EduLoan Pro
          </h1>
          <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto mb-10 leading-relaxed">
            Empowering students worldwide with transparent, fast, and accessible
            education financing. Our mission is to remove barriers and create
            opportunities for lifelong learning.
          </p>
          <a
            href="#team"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:-translate-y-1"
          >
            Meet Our Team
          </a>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              EduLoan Pro is dedicated to providing students with quick,
              reliable, and transparent access to loans for their education. We
              simplify the process so learners can focus on what matters most:
              their education.
            </p>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Our Vision
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              We envision a world where financial barriers never stop a
              passionate learner from achieving their dreams. Through innovation
              and integrity, we aim to be the most trusted education financing
              platform globally.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Our Core Values
          </h2>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed">
            The principles that guide our work and define our culture.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-4 px-6">
          {coreValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card
                key={index}
                className="p-8 text-center shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Team</h2>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed">
            A passionate team committed to helping students succeed in their
            educational journeys.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-4 px-6">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="overflow-hidden shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2"
            >
              <div className="h-64 overflow-hidden">
                <Image
                  width={100}
                  height={100}
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-slate-600 text-sm">{member.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Back to Home Button */}
      <div className="flex justify-center my-12">
        {/* Floating Back to Home Button */}
        <Link
          href={"/"}
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
      </div>

      {/* Call to Action */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-7xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Join Thousands of Students
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience education financing that’s fast, transparent, and
            student-focused.
          </p>
          <a
            href="/apply"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-transform transform hover:-translate-y-1"
          >
            Apply Now
          </a>
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage;
