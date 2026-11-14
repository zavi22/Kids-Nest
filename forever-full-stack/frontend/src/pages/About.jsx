
import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div className="bg-[#fffaf5] text-[#392b23]">

      {/* Hero Heading */}
      <section className="pt-12 pb-8 text-center">
        <p className="text-[#b56333] uppercase tracking-[0.3em] text-xs mb-3">
          Discover Our Story
        </p>
        <div className="text-3xl sm:text-4xl">
          <Title text1="ABOUT" text2="US" />
        </div>
        <div className="w-16 h-1 bg-[#b56333] mx-auto mt-4 rounded-full" />
        <p className="text-gray-500 text-sm mt-4 px-4">
          More than fashion. It's a lifestyle.
        </p>
      </section>

      {/* Our Story */}
      <section className="my-10 flex flex-col md:flex-row gap-10 lg:gap-16 items-center">

        <div className="w-full md:w-1/2 relative">
          <div className="absolute -top-4 -left-4 w-28 h-28 bg-[#f0c58e]/50 rounded-tl-[50px]" />

          <img
            className="relative z-10 w-full md:max-w-[520px] h-[350px] md:h-[460px] object-cover rounded-2xl shadow-[0_15px_35px_rgba(181,99,51,0.15)]"
            src={assets.about_img}
            alt="About Forever"
          />

          <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-[#b56333]/15 rounded-br-[50px]" />
        </div>

        <div className="flex flex-col justify-center gap-6 md:w-1/2">

          <span className="text-[#b56333] text-xs uppercase tracking-[0.25em] font-semibold">
            Who We Are
          </span>

          <h2 className="text-3xl sm:text-4xl prata-regular leading-snug">
            Bringing Your Style <br />
            <span className="text-[#b56333]">Closer to You.</span>
          </h2>

          <p className="text-gray-600 leading-7 text-sm sm:text-base">
            Forever was born out of a passion for innovation and a desire to
            revolutionize the way people shop online. Our journey began with
            a simple idea: to provide a platform where customers can easily
            discover, explore, and purchase a wide range of products from
            the comfort of their homes.
          </p>

          <p className="text-gray-600 leading-7 text-sm sm:text-base">
            Since our inception, we've worked tirelessly to curate a diverse
            selection of high-quality products that cater to every taste and
            preference. From fashion and beauty to electronics and home
            essentials, we offer an extensive collection sourced from trusted
            brands and suppliers.
          </p>

          <div className="border-l-4 border-[#b56333] pl-5 py-2 bg-[#f0c58e]/20 rounded-r-xl">
            <h3 className="text-xl font-semibold text-[#b56333] mb-2">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-7 text-sm">
              Our mission at Forever is to empower customers with choice,
              convenience, and confidence. We're dedicated to providing a
              seamless shopping experience that exceeds expectations, from
              browsing and ordering to delivery and beyond.
            </p>
          </div>

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 mt-20">

        <div className="text-center mb-12">
          <p className="text-[#b56333] text-xs tracking-[0.3em] uppercase mb-3">
            The Forever Difference
          </p>

          <div className="text-3xl sm:text-4xl">
            <Title text1="WHY" text2="CHOOSE US" />
          </div>

          <div className="w-16 h-1 bg-[#b56333] mx-auto mt-4 rounded-full" />

          <p className="text-gray-500 text-sm mt-4">
            Here's what makes shopping with us special.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 */}
          <div className="group bg-white border border-[#f0c58e]/70 p-8 sm:p-10 rounded-2xl shadow-sm hover:shadow-[0_15px_35px_rgba(181,99,51,0.12)] hover:-translate-y-2 transition-all duration-300">

            <div className="w-14 h-14 rounded-2xl bg-[#f0c58e]/40 flex items-center justify-center text-2xl text-[#b56333] mb-7 group-hover:bg-[#b56333] group-hover:text-white transition-all">
              ✦
            </div>

            <h3 className="text-lg font-semibold text-[#392b23] mb-4">
              Quality Assurance
            </h3>

            <p className="text-gray-500 leading-7 text-sm">
              We meticulously select and vet each product to ensure it
              meets our stringent quality standards.
            </p>

            <div className="w-10 h-[2px] bg-[#b56333] mt-7 group-hover:w-20 transition-all duration-300" />
          </div>

          {/* Card 2 */}
          <div className="group bg-white border border-[#f0c58e]/70 p-8 sm:p-10 rounded-2xl shadow-sm hover:shadow-[0_15px_35px_rgba(181,99,51,0.12)] hover:-translate-y-2 transition-all duration-300">

            <div className="w-14 h-14 rounded-2xl bg-[#f0c58e]/40 flex items-center justify-center text-2xl text-[#b56333] mb-7 group-hover:bg-[#b56333] group-hover:text-white transition-all">
              ♡
            </div>

            <h3 className="text-lg font-semibold text-[#392b23] mb-4">
              Convenience
            </h3>

            <p className="text-gray-500 leading-7 text-sm">
              With our user-friendly interface and hassle-free ordering
              process, shopping has never been easier.
            </p>

            <div className="w-10 h-[2px] bg-[#b56333] mt-7 group-hover:w-20 transition-all duration-300" />
          </div>

          {/* Card 3 */}
          <div className="group bg-white border border-[#f0c58e]/70 p-8 sm:p-10 rounded-2xl shadow-sm hover:shadow-[0_15px_35px_rgba(181,99,51,0.12)] hover:-translate-y-2 transition-all duration-300">

            <div className="w-14 h-14 rounded-2xl bg-[#f0c58e]/40 flex items-center justify-center text-2xl text-[#b56333] mb-7 group-hover:bg-[#b56333] group-hover:text-white transition-all">
              ✉
            </div>

            <h3 className="text-lg font-semibold text-[#392b23] mb-4">
              Exceptional Customer Service
            </h3>

            <p className="text-gray-500 leading-7 text-sm">
              Our team of dedicated professionals is here to assist you
              every step of the way, ensuring your satisfaction is our
              top priority.
            </p>

            <div className="w-10 h-[2px] bg-[#b56333] mt-7 group-hover:w-20 transition-all duration-300" />
          </div>

        </div>
      </section>

      {/* Brand Statement */}
      <section className="relative overflow-hidden bg-[#b56333] rounded-3xl px-6 py-14 sm:py-20 text-center my-16">

        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#f0c58e]/20" />
        <div className="absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-[#f0c58e]/20" />

        <div className="relative z-10">
          <p className="text-[#f0c58e] text-xs tracking-[0.3em] uppercase mb-5">
            Forever Starts Here
          </p>

          <h2 className="text-white text-3xl sm:text-5xl prata-regular leading-tight">
            Your Style. Your Choice. <br />
            Your Forever.
          </h2>

          <p className="text-white/80 text-sm mt-5 max-w-xl mx-auto leading-7">
            Discover a collection made to complement your lifestyle
            and make every shopping experience memorable.
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterBox />

    </div>
  )
}

export default About