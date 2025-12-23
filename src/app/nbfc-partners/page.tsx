import React from "react";

const nbfcPartnerData = {
  title: "Our Lending Partners",
  description: [
    "Studynpay works only with RBI-registered NBFCs and Banks.",
    "Our lenders follow all digital lending guidelines issued by the Reserve Bank of India.",
  ],
  placeholder:
    "(Insert your NBFC list here once finalized.)",
};

const NBFCPartners = () => {
  return (
    <section className="bg-white text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold">
            {nbfcPartnerData.title}
          </h1>
        </div>

        {/* Description */}
        <div className="space-y-4 text-center">
          {nbfcPartnerData.description.map((line, index) => (
            <p
              key={index}
              className="text-base sm:text-lg text-slate-700 leading-relaxed"
            >
              {line}
            </p>
          ))}
        </div>

        {/* Placeholder */}
        <div className="mt-10 p-6 border border-dashed border-slate-300 rounded-lg text-center">
          <p className="text-slate-500 italic">
            {nbfcPartnerData.placeholder}
          </p>
        </div>
      </div>
    </section>
  );
};

export default NBFCPartners;
