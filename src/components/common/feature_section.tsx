import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Calculator, Clock, Shield } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: GraduationCap,
      title: "Education Focused",
      description:
        "Specialized loans for all types of education - from undergraduate to PhD programs",
    },
    {
      icon: Calculator,
      title: "Competitive Rates",
      description: "Best-in-market interest rates starting from 8.5% per annum",
    },
    {
      icon: Clock,
      title: "Quick Processing",
      description:
        "Get approval within 3-5 business days with minimal documentation",
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description:
        "Bank-grade security with partnerships across leading financial institutions",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Why Choose EduLoan Pro?
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We make education financing simple, fast, and accessible for every
            student
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}