import { GraduationCap } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">EduLoan Pro</span>
              </div>
              <p className="text-slate-400">
                Making education accessible through smart financing solutions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Loan Types</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Undergraduate Loans</li>
                <li>Postgraduate Loans</li>
                <li>Study Abroad</li>
                <li>Professional Courses</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>EMI Calculator</li>
                <li>Documentation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 EduLoan Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
