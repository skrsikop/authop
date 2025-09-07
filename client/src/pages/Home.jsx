import { Link } from "react-router-dom";
import { Shield, Zap, Users, ArrowRight, Lock, KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import * as api from "../services/api";
import { motion } from "framer-motion";
import Navbar from '../component/Navbar'

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.me();
        setIsLoggedIn(!!res?.data?.user);
      } catch {
        setIsLoggedIn(false);
      }
    })();
  }, []);

  const features = [
    { icon: Shield, title: "Bank-Level Security", desc: "256-bit encryption & MFA protection" },
    { icon: Zap, title: "Lightning Fast", desc: "Instant login & smooth UX" },
    { icon: Users, title: "Trusted by Many", desc: "Thousands rely on our system daily" },
  ];

  const steps = [
    { icon: KeyRound, title: "Register", desc: "Create a free account in seconds" },
    { icon: Lock, title: "Verify Identity", desc: "Secure email or phone verification" },
    { icon: Shield, title: "Access Dashboard", desc: "Enjoy secure authentication features" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl animate-pulse"></div>
        
        <div className="relative z-10 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
          >
            Secure & Modern Authentication
          </motion.h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-10">
            Experience the future of login systems – safe, fast, and user-friendly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isLoggedIn ? (
              <>
                <Link to="/">
                  <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-xl hover:scale-105 transition-transform">
                    Go to Dashboard
                  </button>
                </Link>
                <Link to="/">
                  <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 font-semibold shadow hover:scale-105 transition-transform">
                    Read Docs
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-xl hover:scale-110 transition-transform">
                    Join Now <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link to="/login">
                  <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 font-semibold shadow hover:scale-105 transition-transform">
                    Sign In
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-gray-800">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-2xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex justify-center mb-4">
                  <f.icon className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-gray-800">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl shadow-lg bg-white border border-gray-100"
              >
                <div className="flex justify-center mb-4">
                  <s.icon className="w-12 h-12 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
        
        {/* Testimonials Section */}
          <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-gray-800">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  name: "Ali Warsame",
                  role: "Software Engineer",
                  quote:
                    "AuthApp made authentication so seamless. I trust it with all my projects.",
                  img: "https://i.pravatar.cc/100?img=1",
                },
                {
                  name: "Hodan Abdi",
                  role: "Product Manager",
                  quote:
                    "The security features are outstanding. Our team feels much safer.",
                  img: "https://i.pravatar.cc/100?img=2",
                },
                {
                  name: "Yusuf Omar",
                  role: "Startup Founder",
                  quote:
                    "Integration was super easy, and our users love the fast login.",
                  img: "https://i.pravatar.cc/100?img=3",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-xl transition"
                >
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-blue-500"
                  />
                  <p className="italic text-gray-600 mb-4">“{t.quote}”</p>
                  <h3 className="font-semibold text-gray-800">{t.name}</h3>
                  <span className="text-sm text-gray-500">{t.role}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="mb-8 text-lg opacity-90">
            Create your account and unlock the next generation of authentication.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isLoggedIn ? (
              <Link to="/">
                <button className="px-10 py-4 rounded-2xl bg-white text-purple-600 font-semibold shadow-lg hover:scale-105 transition">
                  Dashboard
                </button>
              </Link>
            ) : (
              <Link to="/register">
                <button className="px-10 py-4 rounded-2xl bg-white text-purple-600 font-semibold shadow-lg hover:scale-105 transition flex items-center justify-center gap-2">
                  Create Account <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p>&copy; {new Date().getFullYear()} AuthApp. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-8">
          <Link to="/" className="hover:text-white">Docs</Link>
          <Link to="/login" className="hover:text-white">Sign In</Link>
          <Link to="/register" className="hover:text-white">Register</Link>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
