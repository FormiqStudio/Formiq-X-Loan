import React from "react";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ButtonLinkProps {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "outline";
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({
  children,
  href,
  variant = "primary",
}) => {
  const styles =
    variant === "primary"
      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
      : "bg-white text-blue-600 border-2 border-blue-600";

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${styles}`}
    >
      {children}
    </Link>
  );
};
