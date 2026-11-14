
import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div className="bg-[#fffaf5] text-[#392b23]">

      {/* Heading */}
      <section className="text-center pt-12 pb-8">
        <p className="text-[#b56333] text-xs tracking-[0.3em] uppercase mb-3">
          We'd Love To Hear From You
        </p>

        <div className="text-3xl sm:text-4xl">
          <Title text1="CONTACT" text2="US" />
        </div>

        <div className="w-16 h-1 bg-[#b56333] mx-auto mt-4 rounded-full" />

        <p className="text-gray-500 text-sm mt-4 px-4">
          Questions, feedback or just want to say hello? We're here for you.
        </p>
      </section>

      {/* Main Contact Section */}
      <section className="my-10 mb-20 flex flex-col lg:flex-row gap-10 lg:gap-16 items-stretch">

        {/* Image */}
        <div className="w-full lg:w-1/2 relative">
          <div className="absolute -top-4 -left-4 w-28 h-28 bg-[#f0c58e]/60 rounded-tl-[50px]" />

          <img
            className="relative z-10 w-full h-[350px] sm:h-[450px] object-cover rounded-2xl shadow-[0_15px_35px_rgba(181,99,51,0.15)]"
            src={assets.contact_img}
            alt="Forever Customer Support"
          />

          <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-[#b56333]/15 rounded-br-[50px]" />
        </div>

        {/* Contact Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center gap-7">

          <div>
            <p className="text-[#b56333] uppercase tracking-[0.2em] text-xs font-semibold mb-3">
              Get In Touch
            </p>

            <h2 className="text-3xl sm:text-4xl prata-regular leading-snug">
              Let's Start a <span className="text-[#b56333]">Conversation.</span>
            </h2>

            <p className="text-gray-500 text-sm leading-7 mt-4">
              Whether you have a question about our products, orders,
              or anything else, our team is ready to help.
            </p>
          </div>

          {/* Store Card */}
          <div className="bg-white border border-[#f0c58e]/70 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#f0c58e]/40 text-[#b56333] text-xl">
                📍
              </div>

              <div>
                <h3 className="font-semibold text-lg">Our Store</h3>
                <p className="text-xs text-[#b56333]">Visit Us</p>
              </div>
            </div>

            <p className="text-gray-500 text-sm leading-7">
              54709 Willms Station <br />
              Suite 350, Washington, USA
            </p>

          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="bg-[#f0c58e]/25 border border-[#f0c58e]/60 rounded-2xl p-5">
              <span className="text-[#b56333] text-xl">☎</span>
              <h3 className="font-semibold mt-3 mb-2">Call Us</h3>
              <p className="text-gray-500 text-sm">
                (415) 555-0132
              </p>
            </div>

            <div className="bg-[#f0c58e]/25 border border-[#f0c58e]/60 rounded-2xl p-5">
              <span className="text-[#b56333] text-xl">✉</span>
              <h3 className="font-semibold mt-3 mb-2">Email Us</h3>
              <p className="text-gray-500 text-sm break-all">
                admin@forever.com
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Careers Section */}
      <section className="my-20 bg-white border border-[#f0c58e]/70 rounded-3xl overflow-hidden shadow-sm">

        <div className="flex flex-col md:flex-row items-center">

          <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16">

            <p className="text-[#b56333] uppercase tracking-[0.25em] text-xs font-semibold mb-4">
              Grow With Us
            </p>

            <h2 className="text-3xl sm:text-4xl prata-regular leading-snug">
              Build Your Future <br />
              With <span className="text-[#b56333]">Forever.</span>
            </h2>

            <p className="text-gray-500 text-sm leading-7 mt-5 mb-8">
              Passionate about fashion, technology and creating
              exceptional shopping experiences? We'd love to have
              talented people join our journey.
            </p>

            <button
              onClick={() => window.location.href = 'mailto:admin@forever.com?subject=Careers%20at%20Forever'}
              className="bg-[#b56333] text-white px-9 py-4 rounded-full text-sm font-medium shadow-[0_5px_0_#f0c58e] hover:bg-[#984d28] hover:-translate-y-1 transition-all duration-300"
            >
              Explore Careers →
            </button>

          </div>

          <div className="w-full md:w-1/2 bg-[#f0c58e]/30 min-h-[280px] md:min-h-[400px] flex items-center justify-center p-10">

            <div className="text-center">
              <div className="w-24 h-24 bg-[#b56333] rounded-full flex items-center justify-center mx-auto text-white text-4xl mb-6 shadow-lg">
                ♡
              </div>

              <h3 className="text-2xl prata-regular text-[#b56333]">
                Be Part of Something Special
              </h3>

              <p className="text-gray-600 text-sm mt-4 leading-7 max-w-xs mx-auto">
                Great experiences start with great people.
                Let's create something meaningful together.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#b56333] rounded-3xl text-center py-14 px-6 my-16 relative overflow-hidden">

        <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#f0c58e]/20 rounded-full" />
        <div className="absolute -bottom-24 -right-16 w-64 h-64 bg-[#f0c58e]/20 rounded-full" />

        <div className="relative z-10">
          <p className="text-[#f0c58e] text-xs uppercase tracking-[0.3em] mb-4">
            We're Always Here
          </p>

          <h2 className="text-white text-3xl sm:text-4xl prata-regular">
            Your Satisfaction Matters.
          </h2>

          <p className="text-white/80 text-sm mt-4 max-w-lg mx-auto leading-7">
            At Forever, every customer matters. Reach out to us
            and let us make your shopping experience better.
          </p>
        </div>

      </section>

      {/* Newsletter */}
      <NewsletterBox />

    </div>
  )
}

export default Contact
