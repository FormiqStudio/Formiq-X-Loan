"use client";

import React from "react";
import {
  ArrowRight,
  Calculator,
  Shield,
  MessageCircle,
  Building2,
  Award,
  GraduationCap,
} from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ServiceCard } from "./service_card";
import { ButtonLink } from "./button_link";
import { FinancePartnerSlider } from "./finance_partner";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Soft Blue Background Glows */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-300/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT CONTENT */}
        <div className="space-y-8 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold border border-blue-200">
            <GraduationCap className="w-4 h-4" />
            Edufintech Company
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight text-slate-900">
            STUDY<span className="text-blue-600">NPAY</span>.COM
          </h1>

          <p className="text-xl font-semibold text-blue-700">
            The A-to-Z of Education
          </p>

          <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
            Complete education solutions — loans, counselling, admissions and
            scholarships — backed by trusted financial institutions.
          </p>

          {/* Courses */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            {["MBBS", "MD", "MS", "MDS", "BDS", "ENGINEERING"].map((course) => (
              <span
                key={course}
                className="px-4 py-2 rounded-full bg-white border border-blue-200 text-blue-700 text-sm font-semibold shadow-sm"
              >
                🎓 {course}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <ButtonLink href="/register">
              Apply Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </ButtonLink>

            <ButtonLink href="/calculator" variant="outline">
              <Calculator className="w-5 h-5" />
              Calculate EMI
            </ButtonLink>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="space-y-8">
          {/* Services */}
          <div className="grid grid-cols-2 gap-4 rounded-2xl p-6 bg-white border border-blue-100 shadow-xl">
            <ServiceCard
              icon={<Shield className="w-7 h-7 text-blue-600" />}
              title="Financing"
            />
            <ServiceCard
              icon={<MessageCircle className="w-7 h-7 text-blue-600" />}
              title="Counselling"
            />
            <ServiceCard
              icon={<Building2 className="w-7 h-7 text-blue-600" />}
              title="Admission"
            />
            <ServiceCard
              icon={<Award className="w-7 h-7 text-blue-600" />}
              title="Scholarship"
            />
          </div>

          {/* Financing Partner */}
    {/* <FinancePartnerSlider/> */}

          {/* Contact Card */}
          <div className="rounded-2xl bg-blue-600 text-white p-6 shadow-xl">
            <p className="font-bold text-lg">
              📞 9046228190 / 8017518002 / 881104811
            </p>
            <p className="font-semibold mt-1">🌐 www.studynpay.com</p>
            <p className="text-sm mt-2 opacity-90">
              📍 Panbazar ICICI Bank opposite Gogoi Building, 3rd Floor,
              Guwahati
            </p>
          </div>
        </div>
      </div>
      <FinancePartnerSlider/>
    </section>
  );
};
