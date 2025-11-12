import { stepsData } from "../assets/assets";
import { motion } from "motion/react";

const Steps = () => {
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center my-32 px-4"
    >
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-900 via-violet-700 to-violet-600 bg-clip-text text-transparent">
          How it works
        </h1>
        <p className="text-xl text-violet-600/70 max-w-2xl mx-auto font-medium">
          Transform Words Into Stunning Images
        </p>
      </div>

      <div className="space-y-6 w-full max-w-4xl">
        {stepsData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative flex items-center gap-6 p-8 bg-white/50 backdrop-blur-sm border border-violet-200/50 cursor-pointer hover:shadow-2xl hover:border-violet-300 hover:bg-white/80 transition-all duration-300 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <img className="w-full h-full" src={item.icon} alt="" />
            </div>

            <div className="relative flex-1">
              <h2 className="text-2xl font-semibold text-violet-900 mb-2 group-hover:text-violet-700 transition-colors duration-300">
                {item.title}
              </h2>
              <p className="text-base text-gray-700 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-violet-100 group-hover:bg-violet-200 transition-colors duration-300">
              <span className="text-lg font-bold text-violet-600 group-hover:text-violet-700 transition-colors duration-300">
                {index + 1}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Steps;
