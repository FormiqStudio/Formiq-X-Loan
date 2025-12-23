import React from "react";

const refundPolicyData = {
  title: "Refund & Cancellation Policy",

  sections: [
    {
      content:
        "Fees paid for application processing or documentation services are non-refundable.",
    },
    {
      content:
        "If a transaction is charged by mistake, users can request a refund within 48 hours.",
    },
    {
      content:
        "Refunds will be processed to the original payment method within 7–10 working days.",
    },
  ],

  contact: {
    label: "For refund requests, contact:",
    email: "support@studynpay.com",
  },
};

const RefundPolicy = () => {
  return (
    <section className="bg-white text-slate-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold">
            {refundPolicyData.title}
          </h1>
        </div>

        {/* Policy Content */}
        <div className="space-y-6">
          {refundPolicyData.sections.map((item, index) => (
            <p
              key={index}
              className="text-base leading-relaxed text-slate-700"
            >
              {item.content}
            </p>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 border-t pt-6">
          <p className="text-slate-700">
            {refundPolicyData.contact.label}{" "}
            <a
              href={`mailto:${refundPolicyData.contact.email}`}
              className="text-blue-600 hover:underline font-medium"
            >
              {refundPolicyData.contact.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RefundPolicy;
