'use client'
import { GraduationCap, ChevronDown } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";

export const Header = () => {
  const [activeTab, setActiveTab] = useState<string>("home");

  const tabs = [
    { name: "Home", href: "/", icon: <GraduationCap className="w-4 h-4 mr-1 inline" />, key: "home" },
    { name: "About Us", href: "/about", key: "about" },
    { name: "Contact Us", href: "/contact", key: "contact" },
    { name: "Grievance Redressal", href: "/grievance", key: "grievance" },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between h-20 md:h-16 py-3 md:py-0">

          {/* Logo */}
          <div className="flex items-center space-x-2 mb-3 md:mb-0">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              EduLoan Pro
            </span>
          </div>

          {/* Tabs Container */}
          <div className="flex items-center justify-between md:justify-start space-x-4 bg-gray-100 rounded-full px-3 py-1 md:px-6 md:py-1.5">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                href={tab.href}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center px-4 py-2 rounded-full font-medium transition-all duration-200
                  ${
                    activeTab === tab.key
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-700 hover:bg-gray-200"
                  }`}
              >
                {tab.icon} {tab.name}
              </Link>
            ))}

{/*             
            <div className="relative group">
              <button className="flex items-center px-4 py-2 rounded-full text-slate-700 hover:bg-gray-200 font-medium transition-all duration-200">
                Services <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute hidden group-hover:block mt-2 bg-white shadow-lg rounded-lg py-2 w-48">
                <Link href="/services/loan" className="block px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                  Education Loan
                </Link>
                <Link href="/services/scholarship" className="block px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                  Scholarships
                </Link>
              </div>
            </div> */}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mt-3 md:mt-0">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-900 hover:text-blue-600">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};
