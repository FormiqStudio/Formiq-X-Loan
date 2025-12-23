import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calculator } from "lucide-react";

export const  HeroSection=()=> {
  return (
    <section className="relative py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            🎓 Trusted by 50,000+ Students
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Fund Your
            <span className="text-blue-600"> Education Dreams</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Get instant education loans with competitive rates, minimal
            documentation, and expert guidance from our dedicated DSA network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              >
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/calculator">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculate EMI
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}