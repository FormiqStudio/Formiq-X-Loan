'use client'
import { GraduationCap, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { name: "Home", href: "/", icon: <GraduationCap className="w-4 h-4 mr-1 inline" />, key: "home" },
    { name: "About Us", href: "/about", key: "about" },
    { name: "Contact Us", href: "/contact", key: "contact" },
    { name: "Grievance Redressal", href: "/grievance", key: "grievance" },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <span className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              EduLoan Pro
            </span>
          </div>

          {/* Desktop Navigation - Hidden on mobile/tablet */}
          <div className="hidden xl:flex items-center space-x-2 bg-gray-100 rounded-full px-6 py-1.5">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                href={tab.href}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center px-3 py-2 rounded-full font-medium transition-all duration-200 text-sm whitespace-nowrap
                  ${
                    activeTab === tab.key
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-700 hover:bg-gray-200"
                  }`}
              >
                {tab.icon} {tab.name}
              </Link>
            ))}
          </div>

          {/* Desktop Action Buttons - Hidden on mobile/tablet */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-900 hover:text-blue-600 text-sm lg:text-base">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm lg:text-base">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-md text-slate-700 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-4 space-y-3 border-t border-slate-200 mt-2">
            {/* Mobile Tabs */}
            <div className="space-y-2">
              {tabs.map((tab) => (
                <Link
                  key={tab.key}
                  href={tab.href}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200
                    ${
                      activeTab === tab.key
                        ? "bg-blue-600 text-white shadow"
                        : "text-slate-700 hover:bg-gray-100"
                    }`}
                >
                  {tab.icon} {tab.name}
                </Link>
              ))}
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex flex-col space-y-2 pt-3 border-t border-slate-200 md:hidden">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-slate-900 hover:text-blue-600">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};