import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export function LoanTypesSection() {
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
    },
    {
      title: "Study Abroad",
      description: "International education financing",
      amount: "Up to ₹1.5 Crores",
      rate: "9.5% onwards",
      features: ["Forex assistance", "Pre-visa support", "Global partnerships"],
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
    },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Education Loan Options
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Tailored financing solutions for every educational journey
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loanTypes.map((loan, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">
                  {loan.title}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {loan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {loan.amount}
                    </div>
                    <div className="text-sm text-slate-500">Loan Amount</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {loan.rate}
                    </div>
                    <div className="text-sm text-slate-500">Interest Rate</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {loan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-slate-600"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    Apply Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
