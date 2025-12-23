import React from "react";

const loanDisclosureData = {
  title: "Loan Disclosure Information",
  companyName: "Studynpay Private Limited",

  introduction: [
    "Studynpay Private Limited acts as a Loan Aggregator connecting students with NBFCs/Banks that offer Education Loans.",
    "We do not charge any hidden fees.",
  ],

  partnerSection: {
    title: "Partner NBFCs/Banks",
  },

  loanTerms: {
    title: "Indicative Loan Terms (Decided by Partner Lenders)",
    terms: [
      { label: "Loan Amount", value: "As per lender policy" },
      { label: "Tenure", value: "1–10 years" },
      { label: "Interest Rate", value: "Variable, lender-specific" },
      { label: "Processing Fee", value: "As per lender" },
      { label: "Late Payment Charges", value: "As per lender" },
      { label: "Foreclosure Policy", value: "As per lender" },
    ],
  },

  restrictions: {
    title: "We Do Not:",
    points: [
      "Decide loan interest rates",
      "Influence approval or rejection",
      "Collect EMI payments in our bank account",
    ],
  },

  disclaimer:
    "All loan-related decisions are taken solely by the lender.",
};

const LoanDisclosure = () => {
  return (
    <section className="bg-white text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold">
            {loanDisclosureData.title}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {loanDisclosureData.companyName}
          </p>
        </div>

        {/* Introduction */}
        <div className="space-y-4 mb-8">
          {loanDisclosureData.introduction.map((line, index) => (
            <p
              key={index}
              className="text-base leading-relaxed text-slate-700"
            >
              {line}
            </p>
          ))}
        </div>

        {/* Partner Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            {loanDisclosureData.partnerSection.title}
          </h2>
        </div>

        {/* Loan Terms */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            {loanDisclosureData.loanTerms.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loanDisclosureData.loanTerms.terms.map((term, index) => (
              <div
                key={index}
                className="flex justify-between border rounded-lg p-4"
              >
                <span className="font-medium">{term.label}</span>
                <span className="text-slate-600">{term.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Restrictions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            {loanDisclosureData.restrictions.title}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-slate-700">
            {loanDisclosureData.restrictions.points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        {/* Final Disclaimer */}
        <div className="border-t pt-6">
          <p className="font-medium text-slate-700">
            {loanDisclosureData.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoanDisclosure;
