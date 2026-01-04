import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";

export default function Carousel() {
  return (
    <>
      <Swiper
        style={{
          '--swiper-navigation-color': '#f0b100',
          '--swiper-pagination-color': '#f0b100',
        }}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className=" w-full h-auto">
            <img
              src={`/assets/Site_Images/CarouselImages/CarouselImages_1.webp`}
              alt="Carousel Images 1"
              className="w-full object-cover object-top aspect-video rounded-md" loading="lazy" decoding="async"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className=" w-full h-auto">
            <img
              src={`/assets/Site_Images/CarouselImages/CarouselImages_2.webp`}
              alt="Carousel Images 2"
              className="w-full object-cover object-top aspect-video rounded-md" loading="lazy" decoding="async"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className=" w-full h-auto">
            <img
              src={`/assets/Site_Images/CarouselImages/CarouselImages_3.webp`}
              alt="Carousel Images 3"
              className="w-full object-cover object-top aspect-video rounded-md" loading="lazy" decoding="async"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className=" w-full h-auto">
            <img
              src={`/assets/Site_Images/CarouselImages/CarouselImages_4.webp`}
              alt="Carousel Images 4"
              className="w-full object-cover object-top aspect-video rounded-md" loading="lazy" decoding="async"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className=" w-full h-auto">
            <img
              src={`/assets/Site_Images/CarouselImages/CarouselImages_5.webp`}
              alt="Carousel Images 5"
              className="w-full object-cover object-top aspect-video rounded-md" loading="lazy" decoding="async"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}
