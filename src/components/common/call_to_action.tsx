import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Ready to Start Your Educational Journey?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of students who have funded their dreams with us
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8 py-3"
            >
              Apply for Loan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8 py-3"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}