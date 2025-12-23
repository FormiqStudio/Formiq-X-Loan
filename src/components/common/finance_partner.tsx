"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import Image from "next/image";

export const FinancePartnerSlider = () => {
  const partners = [
    {
      name: "HDFC Bank",
      logo: "https://res.cloudinary.com/dyiso4ohk/image/upload/v1766502528/hdfc-bank_elpjra.png",
    },
    {
      name: "ICICI Bank",
      logo: "https://res.cloudinary.com/dyiso4ohk/image/upload/v1766502528/icici-bank_ysvqdx.png",
    },
    {
      name: "Axis Bank",
      logo: "https://res.cloudinary.com/dyiso4ohk/image/upload/v1766502528/axis-bank_qekovo.png",
    },
    {
      name: "State Bank of India",
      logo: "https://res.cloudinary.com/dyiso4ohk/image/upload/v1766502528/sbi_dlupzm.png",
    },
    {
      name: "Kotak Mahindra",
      logo: "https://res.cloudinary.com/dyiso4ohk/image/upload/v1766502528/kotak-mahindra-bank_miidkw.png",
    },
    {
      name: "Yes Bank",
      logo: "https://res.cloudinary.com/dyiso4ohk/image/upload/v1766502528/yes-bank_vwfw74.png",
    },
  ];

  return (
    <section className="w-full py-10 sm:py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <Swiper
          modules={[Autoplay]}
          loop
          slidesPerView="auto"
          spaceBetween={48}
          speed={5000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          className="w-full"
        >
          {partners.map((partner, index) => (
            <SwiperSlide key={index} className="!w-auto">
              <div
                className="
                  flex items-center gap-3 sm:gap-4 md:gap-5
                  px-4 sm:px-6 md:px-8
                  py-3 sm:py-4
                  whitespace-nowrap
                "
              >
                {/* Logo */}
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={80}
                  height={80}
                  className="
                    h-8 sm:h-10 md:h-12 lg:h-14
                    w-auto object-contain
                  "
                />

                {/* Name */}
                <span
                  className="
                    text-sm sm:text-base md:text-lg
                    font-semibold text-gray-700
                  "
                >
                  {partner.name}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
