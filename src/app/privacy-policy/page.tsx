import React from "react";

const privacyPolicyData = {
  companyName: "Studynpay Private Limited",
  compliance: "100% RBI DLG-2022 compliant",
  lastUpdated: "1 January 2025",

  intro: `Studynpay Private Limited (“Company”, “We”, “Us”, “Our”) operates an online
  platform that helps students compare, apply and connect with partnered financial
  institutions for education loans. This Privacy Policy explains how we collect,
  use, store and protect your personal information.`,

  sections: [
    {
      title: "1. Information We Collect",
      points: [
        "Name, mobile number, email address",
        "Date of birth, residential address, ID proof details",
        "Academic and educational information",
        "Loan requirement and financial details",
        "Device information, IP address, browser data",
        "Documents uploaded voluntarily by the user",
      ],
    },
    {
      title: "2. How We Use Your Information",
      points: [
        "Process and evaluate your loan application",
        "Connect you with partnered NBFCs and Banks",
        "Verify identity and submitted documents",
        "Provide customer support and communication",
        "Improve platform functionality and user experience",
        "Meet legal and regulatory compliance requirements",
      ],
    },
    {
      title: "3. Sharing of Information",
      description:
        "We may share your information strictly on a need-to-know basis with:",
      points: [
        "Partnered NBFCs and Banks",
        "Third-party service providers (KYC, verification, analytics)",
        "Government or law enforcement agencies when legally required",
      ],
      footerNote: "We do not sell or rent your personal data to any third party.",
    },
    {
      title: "4. Cookies",
      description:
        "We use cookies and similar technologies to analyze traffic and enhance user experience.",
    },
    {
      title: "5. Data Security",
      description:
        "We implement industry-standard security practices including SSL encryption, restricted access controls, and secure servers to protect your data.",
    },
    {
      title: "6. User Rights",
      points: [
        "Request correction of inaccurate data",
        "Request deletion of your personal data",
        "Withdraw consent at any time",
      ],
    },
  ],

  grievanceOfficer: {
    name: "To Be Appointed",
    email: "support@studynpay.com",
    phone: "+91-XXXXXXXXXX",
  },
};

const PrivacyPolicy = () => {
  return (
    <section className="bg-white text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500">
            {privacyPolicyData.companyName} —{" "}
            {privacyPolicyData.compliance}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Last Updated: {privacyPolicyData.lastUpdated}
          </p>
        </div>

        {/* Intro */}
        <p className="text-base leading-relaxed mb-8 text-slate-700">
          {privacyPolicyData.intro}
        </p>

        {/* Sections */}
        <div className="space-y-8">
          {privacyPolicyData.sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-semibold mb-3">
                {section.title}
              </h2>

              {section.description && (
                <p className="text-slate-700 mb-3">
                  {section.description}
                </p>
              )}

              {section.points && (
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  {section.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}

              {section.footerNote && (
                <p className="mt-3 font-medium text-slate-700">
                  {section.footerNote}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Contact / Grievance */}
        <div className="mt-12 border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">
            7. Contact Information
          </h2>
          <p className="text-slate-700 mb-2">Grievance Officer:</p>
          <ul className="text-slate-700 space-y-1">
            <li>
              <strong>Name:</strong> {privacyPolicyData.grievanceOfficer.name}
            </li>
            <li>
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${privacyPolicyData.grievanceOfficer.email}`}
                className="text-blue-600 hover:underline"
              >
                {privacyPolicyData.grievanceOfficer.email}
              </a>
            </li>
            <li>
              <strong>Phone:</strong>{" "}
              {privacyPolicyData.grievanceOfficer.phone}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
