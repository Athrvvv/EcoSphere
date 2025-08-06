import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {ReactTyped} from "react-typed";
import { useEffect, useState } from "react";
import heroImage from "../assets/hero.svg";
import feature1 from "../assets/feature1.svg";
import feature2 from "../assets/feature2.svg";
import feature3 from "../assets/feature3.svg";

const LandingPage = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 flex flex-col font-sans relative scroll-smooth">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white/90 backdrop-blur sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-indigo-600 tracking-wide">EchoSphere</h1>
        <Link
          to="/auth"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Login
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 py-16 md:px-20 gap-10">
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-gray-900">
            Connect, Share & Grow on <br />
            <span className="text-indigo-600 inline-block mt-2">
              <ReactTyped
                strings={["EchoSphere", "Your Community", "A Dev Hub"]}
                typeSpeed={80}
                backSpeed={40}
                loop
              />
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            A minimal yet powerful space for devs and learners to build, explore, and grow together.
          </p>
          <Link
            to="/auth"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full shadow hover:bg-indigo-700 transition duration-300"
          >
            Get Started
          </Link>
        </motion.div>

        <motion.img
          src={heroImage}
          alt="Hero"
          className="w-full md:w-1/2 max-w-md drop-shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        />
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <motion.h3
          className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Why Join EchoSphere?
        </motion.h3>

        <div className="grid md:grid-cols-3 gap-10">
          {[{
            img: feature1,
            title: "Vibrant Community",
            desc: "Connect with peers, get inspired by fellow developers and students worldwide."
          },
          {
            img: feature2,
            title: "Create & Share",
            desc: "Post ideas, updates, and achievements in a clean, professional feed."
          },
          {
            img: feature3,
            title: "Grow Your Network",
            desc: "Discover profiles, follow thought leaders, and expand your circle."
          }].map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl p-8 text-center transition duration-300 border border-white/40"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <motion.img
                src={feature.img}
                alt={feature.title}
                className="mx-auto h-24 mb-5"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <motion.h4
                className="text-xl font-semibold text-gray-800 mb-2"
                whileHover={{ color: "#4f46e5" }}
              >
                {feature.title}
              </motion.h4>
              <p className="text-gray-600 text-sm leading-relaxed tracking-wide">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Scroll to Top */}
      {showScrollToTop && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-indigo-700 transition"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          ↑
        </motion.button>
      )}

      {/* Footer */}
      <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EchoSphere. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
