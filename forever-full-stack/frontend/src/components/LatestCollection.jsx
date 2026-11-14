import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { ArrowRight } from 'lucide-react'

import 'swiper/css'
import 'swiper/css/pagination'

const LatestCollection = () => {
  const { products, currency } = useContext(ShopContext)
  const [latestProducts, setLatestProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    setLatestProducts(products.slice(0, 10))
  }, [products])

  return (
    <div className="my-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] font-['Outfit'] bg-[#fdf8f2]">
      <div className="text-center py-8 text-3xl">
        <Title text1={'✨ LATEST'} text2={'COLLECTIONS'} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the.
        </p>
      </div>

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1.2}
        autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ el: '.latest-pagination', clickable: true }}
        breakpoints={{
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="!px-1 !pt-2 !pb-8"
      >
        {latestProducts.map((item) => (
          <SwiperSlide key={item._id} className="!h-auto">
            <div
              onClick={() => navigate(`/product/${item._id}`)}
              className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-transparent bg-[#FDF8F2] shadow-[0_4px_20px_rgba(120,80,40,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C4693B] hover:shadow-[0_20px_40px_rgba(196,105,59,0.18)]"
            >
              {/* Image */}
              <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-4 p-5">
                <div>
                  <h3 className="line-clamp-1 text-lg font-medium text-[#3A1F10] sm:text-xl">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-[#C4693B]">
                    {currency}{item.price}
                  </p>
                </div>

                <button
                  className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-[#C4693B] py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#A95529] sm:text-base"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom pagination: gray dots, terracotta pill for active */}
      <div
        className="latest-pagination mt-2 flex items-center justify-center gap-2
          [&_.swiper-pagination-bullet]:m-0 [&_.swiper-pagination-bullet]:h-2.5 [&_.swiper-pagination-bullet]:w-2.5
          [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-gray-300
          [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:duration-300
          [&_.swiper-pagination-bullet-active]:w-10 [&_.swiper-pagination-bullet-active]:!bg-[#C4693B]"
      />
    </div>
  )
}

export default LatestCollection