'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  ArrowRight,
  Award,
  IndianRupee,
  Percent,
  ChevronDown,
} from "lucide-react";

export function LoanTypesSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(1);

  const loanTypes = [
    {
      title: "Undergraduate Programs",
      description: "Bachelor's degree programs in India and abroad",
      amount: "Up to ₹20 Lakhs",
      rate: "8.5% onwards",
      features: [
        "No collateral up to ₹7.5L",
        "Flexible repayment",
        "Moratorium period",
      ],
      popular: false,
    },
    {
      title: "Postgraduate Programs",
      description: "Master's and professional courses",
      amount: "Up to ₹50 Lakhs",
      rate: "9.0% onwards",
      features: [
        "Higher loan amounts",
        "Extended tenure",
        "Career-focused programs",
      ],
      popular: true,
    },
    {
      title: "Study Abroad",
      description: "International education financing",
      amount: "Up to ₹1.5 Crores",
      rate: "9.5% onwards",
      features: ["Forex assistance", "Pre-visa support", "Global partnerships"],
      popular: false,
    },
    {
      title: "Professional Courses",
      description: "Medical, Engineering, MBA programs",
      amount: "Up to ₹75 Lakhs",
      rate: "8.75% onwards",
      features: [
        "Specialized programs",
        "Industry partnerships",
        "Placement assistance",
      ],
      popular: false,
    },
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-slate-50 overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Cards */}
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {loanTypes.map((loan, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <div key={index} className="group relative">

                {/* Popular Badge */}
                {loan.popular && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      POPULAR
                    </div>
                  </div>
                )}

                <Card
                  className={`transition-all duration-300 overflow-hidden ${
                    loan.popular
                      ? "border-2 border-blue-600 shadow-xl"
                      : "border border-slate-200 shadow-md hover:shadow-lg"
                  } ${isExpanded ? "ring-2 ring-blue-300" : ""}`}
                >
                  {/* Header */}
                  <button
                    onClick={() => toggleExpand(index)}
                    className="w-full text-left hover:bg-slate-50 transition-colors"
                  >
                    <CardContent
                      className={`transition-all duration-300 ${
                        isExpanded ? "p-4 sm:p-6" : "p-2 sm:p-3"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Index */}
                          <div
                            className={`flex-shrink-0 rounded-full flex items-center justify-center font-bold transition-all ${
                              isExpanded
                                ? "w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white scale-110"
                                : "w-8 h-8 sm:w-9 sm:h-9 bg-slate-100 text-slate-600"
                            }`}
                          >
                            {index + 1}
                          </div>

                          {/* Title */}
                          <div className="min-w-0">
                            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-0.5">
                              {loan.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                              <span className="text-blue-600 font-semibold">
                                {loan.amount}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-600">
                                {loan.rate}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Chevron */}
                        <ChevronDown
                          className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                            isExpanded ? "rotate-180 text-blue-600" : ""
                          }`}
                        />
                      </div>
                    </CardContent>
                  </button>

                  {/* Expanded Content */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                      <div className="h-px bg-slate-200 mb-4"></div>

                      <p className="text-sm sm:text-base text-slate-600 mb-4">
                        {loan.description}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border">
                          <IndianRupee className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold">{loan.amount}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-100 p-3 rounded-lg border">
                          <Percent className="h-5 w-5" />
                          <span className="font-semibold">{loan.rate}</span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-2 mb-5">
                        {loan.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-sm bg-white p-3 rounded-lg border"
                          >
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                            {feature}
                          </div>
                        ))}
                      </div>

                      <Link href="/register">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          Apply for {loan.title}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LoanTypesSection;
