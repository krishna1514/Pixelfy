import React from "react";
import { assets, testimonialsData } from "../assets/assets";
import { motion } from "motion/react";
const Testimonials = () => {
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center my-20 py-12"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-900 via-violet-700 to-violet-600 bg-clip-text text-transparent"
      >
        Customers Testimonials
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed"
      >
        What Our Users Are Saying
      </motion.p>
      <div className="flex flex-wrap gap-6 mt-5">
        {testimonialsData.map((item, index) => (
          <div
            key={index}
            className="bg-white/20 p-12 rounded-lg shadow-md border w-80 m-auto cursor-pointer hover:scale-[1.02] transition-all"
          >
            <div className="flex flex-col items-center">
              <img className="rounded w-14" src={item.image} />
              <h2 className="text-xl font-semibold mt-3">{item.name}</h2>
              <p className="text-gray-500 mb-4">{item.role}</p>
              <div className="flex mb-4 gap-x-px">
                {Array(item.stars)
                  .fill()
                  .map((star, index) => (
                    <img src={assets.rating_star} key={index} />
                  ))}
              </div>
              <p className="text-center text-sm text-gray-600">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Testimonials;
