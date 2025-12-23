import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya Sharma",
      course: "MS Computer Science, Stanford",
      text: "The loan process was incredibly smooth. Got approval within 4 days and the DSA guided me through every step.",
      rating: 5,
    },
    {
      name: "Rahul Patel",
      course: "MBA, IIM Ahmedabad",
      text: "Competitive interest rates and flexible repayment options made my MBA dream possible.",
      rating: 5,
    },
    {
      name: "Ananya Singh",
      course: "MBBS, AIIMS Delhi",
      text: "No hassle documentation and quick processing. Highly recommend for medical students.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Student Success Stories
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Hear from students who achieved their dreams with our support
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-slate-600 mb-4 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-slate-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    {testimonial.course}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
