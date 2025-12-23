import { Users, TrendingUp, Award, CheckCircle } from "lucide-react";

export function StatsSection() {
  const stats = [
    { label: "Students Funded", value: "50,000+", icon: Users },
    { label: "Loans Disbursed", value: "₹2,500 Cr+", icon: TrendingUp },
    { label: "Success Rate", value: "95%", icon: Award },
    { label: "Partner Banks", value: "25+", icon: CheckCircle },
  ];

  return (
    <section className="py-16 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <IconComponent className="h-8 w-8 text-blue-200 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}