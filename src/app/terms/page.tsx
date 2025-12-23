import React from "react";

const termsData = {
  title: "Terms & Conditions",
  companyName: "Studynpay Private Limited",
  lastUpdated: "[Insert Date]",
  intro: `Welcome to Studynpay Private Limited (“Studynpay”, “We”, “Us”, “Our”). 
  By using our platform, you agree to these Terms.`,

  sections: [
    {
      title: "1. Nature of Business",
      content: [
        "Studynpay is a loan aggregator / facilitator that helps users apply for education loans from partnered NBFCs/Banks.",
        "We are not a lender and do not disburse loans.",
      ],
    },
    {
      title: "2. Eligibility",
      content: [
        "Users must be:",
        "Above 18 years of age",
        "Legally capable of entering into agreements",
      ],
    },
    {
      title: "3. User Responsibilities",
      content: [
        "You agree to:",
        "Provide accurate information",
        "Not misuse the platform",
        "Not submit false or forged documents",
      ],
    },
    {
      title: "4. Limitation of Liability",
      content: [
        "Studynpay is not responsible for:",
        "Loan approval/rejection decisions",
        "Interest rates or charges of partnered lenders",
        "Delays caused by third-party lenders",
      ],
    },
    {
      title: "5. Payments",
      content: [
        "We may charge processing/application fees.",
        "EMI payments for approved loans are collected directly by the lender.",
      ],
    },
    {
      title: "6. Changes to Terms",
      content: ["We reserve the right to modify these Terms at any time."],
    },
    {
      title: "7. Governing Law",
      content: ["This agreement is governed by the laws of India."],
    },
  ],
};

const TermsConditions = () => {
  return (
    <section className="bg-white text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold">{termsData.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{termsData.companyName}</p>
          <p className="text-sm text-slate-500 mt-1">Last Updated: {termsData.lastUpdated}</p>
        </div>

        {/* Intro */}
        <p className="mb-8 text-slate-700 leading-relaxed">{termsData.intro}</p>

        {/* Sections */}
        <div className="space-y-8">
          {termsData.sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {section.content.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TermsConditions;
