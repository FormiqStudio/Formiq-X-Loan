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
    <section className="relative py-24 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-600"></div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Features</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-600"></div>
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">EduLoan Pro</span>?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We make education financing simple, fast, and accessible for every student
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="group relative">
                {/* Animated border gradient */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur"></div>
                
                <Card className="relative h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white rounded-2xl overflow-hidden">
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-transparent rounded-bl-full opacity-50"></div>
                  
                  <CardContent className="relative p-8 h-full flex flex-col">
                    {/* Icon with animated background */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-blue-600 rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <IconComponent className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>

                    {/* Number badge */}
                    <div className="absolute top-6 right-6 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-semibold text-sm">
                      {index + 1}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm flex-grow">
                      {feature.description}
                    </p>

                    {/* Animated bottom accent line */}
                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:w-full transition-all duration-500"></div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;