import React from "react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  className = "",
}) => {
  return (
    <div
      className={`relative flex items-center gap-4 rounded-2xl bg-white/80 px-6 py-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 ring-1 ring-blue-200">
        {icon}
      </div>

      <p className="text-sm font-semibold uppercase tracking-wider text-slate-800">
        {title}
      </p>
    </div>
  );
};
