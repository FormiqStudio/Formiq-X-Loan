import React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

const footerLinks = {
  loanTypes: [
    { label: "Undergraduate Loans", href: "/loans/undergraduate" },
    { label: "Postgraduate Loans", href: "/loans/postgraduate" },
    { label: "Study Abroad", href: "/loans/study-abroad" },
    { label: "Professional Courses", href: "/loans/professional" },
  ],
  support: [
    { label: "Help Center", href: "/support/help-center" },
    { label: "Contact Us", href: "/support/contact" },
    { label: "EMI Calculator", href: "/tools/emi-calculator" },
    { label: "Documentation", href: "/docs" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "NBFC Partners", href: "/anbfc-partners" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Loan Disclosure", href: "/loan-disclosure" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">EduLoan Pro</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Making education accessible through smart financing solutions.
            </p>
          </div>

          {/* Loan Types */}
          <div>
            <h3 className="font-semibold mb-4">Loan Types</h3>
            <ul className="space-y-2">
              {footerLinks.loanTypes.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-blue-400 transition text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-blue-400 transition text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-blue-400 transition text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} EduLoan Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
