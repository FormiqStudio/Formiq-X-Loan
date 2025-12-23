import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/utils";
import { StatsSection } from "@/components/common/stats_section";
import { FeaturesSection } from "@/components/common/feature_section";
import { LoanTypesSection } from "@/components/common/loan_type";
import { TestimonialsSection } from "@/components/common/testimonial";
import { CTASection } from "@/components/common/call_to_action";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { HeroSection } from "@/components/common/hero_section";

export default async function Home() {
  const session = await getAuthSession();

  if (session?.user) {
    redirect(`/${session.user.role}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <Header />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <LoanTypesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
