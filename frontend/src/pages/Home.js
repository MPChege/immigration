import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FiTruck, FiArrowRight, FiCheck, FiStar, FiTrendingUp, FiShield, FiClock, FiMapPin } from 'react-icons/fi';

// Scroll Narrative Chapter Component
const NarrativeChapter = ({ chapter, index, scrollProgress }) => {
  const chapterProgress = useTransform(
    scrollProgress,
    [index * 0.2, (index + 1) * 0.2],
    [0, 1]
  );
  const opacity = useTransform(chapterProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(chapterProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

  return (
    <motion.div
      style={{
        opacity,
        scale,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
      className="flex items-center justify-center"
    >
      <div className="container mx-auto px-6 text-center bg-white p-20 rounded-3xl border-2 border-gray-200 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className={`text-sm uppercase tracking-widest mb-4 bg-gradient-to-r ${chapter.gradient} bg-clip-text text-transparent font-bold`}>
            Chapter {index + 1}
          </div>
          <h2 className={`text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r ${chapter.gradient} bg-clip-text text-transparent`}>{chapter.title}</h2>
          <p className="text-2xl md:text-3xl text-gray-700">{chapter.text}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Scroll Narrative Section Component
const ScrollNarrativeSection = ({ chapters, scrollProgress }) => {
  return (
    <section className="relative" style={{ height: '500vh' }}>
      {chapters.map((chapter, index) => (
        <NarrativeChapter
          key={index}
          chapter={chapter}
          index={index}
          scrollProgress={scrollProgress}
        />
      ))}
    </section>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Hero animations
  const heroY = useTransform(smoothProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);

  // Chapter colors
  const chapters = [
    { color: 'red', title: 'Connection', text: 'A journey that becomes a world', gradient: 'from-red-500 to-red-600' },
    { color: 'maroon', title: 'Trust', text: 'Your belongings move safely — with control', gradient: 'from-maroon-500 to-maroon-600' },
    { color: 'red', title: 'Possibility', text: 'Relocation isn\'t stress. It\'s opportunity', gradient: 'from-red-600 to-maroon-600' },
    { color: 'maroon', title: 'Community', text: 'People, connected — without the chaos', gradient: 'from-maroon-600 to-red-500' },
    { color: 'red', title: 'Control', text: 'One platform. Total command', gradient: 'from-red-500 to-maroon-500' },
  ];

  return (
    <div ref={containerRef} className="relative bg-white text-gray-900 overflow-hidden">
      {/* Custom Cursor (Desktop only) */}
      <motion.div
        className="hidden lg:block fixed w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />

      {/* Top Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-red-100/50 shadow-sm"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative w-12 h-12 bg-gradient-to-br from-red-500 via-red-600 to-maroon-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                <FiTruck className="text-white text-xl relative z-10" />
              </motion.div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-red-600 to-maroon-600 bg-clip-text text-transparent">Relocate</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
              >
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-maroon-600 rounded-lg font-semibold text-sm hover:from-red-400 hover:to-maroon-500 transition-all shadow-lg shadow-red-500/50"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-maroon-50/30" />
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-200/40 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-maroon-200/40 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.5, stiffness: 200 }}
              className="inline-flex items-center space-x-2 bg-red-50 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-red-200"
            >
              <FiStar className="text-red-500" />
              <span className="text-sm font-medium text-gray-700">Trusted by 10,000+ customers</span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-tight">
              <span className="block text-gray-900">Relocation doesn't follow</span>
              <span className="block bg-gradient-to-r from-red-500 via-maroon-600 to-red-600 bg-clip-text text-transparent">
                the future. It builds it.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Your life, one platform. Plan. Book. Track. Connect.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-maroon-600 rounded-xl font-bold text-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Enter Relocate</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-400 to-maroon-500"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <FiArrowRight className="w-6 h-6 rotate-90 text-gray-400" />
          </motion.div>
        </div>
      </motion.section>

      {/* Scroll Narrative Section */}
      <ScrollNarrativeSection chapters={chapters} scrollProgress={smoothProgress} />

      {/* Feature Moments */}
      <section className="relative py-32 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-gray-900">Everything You Need</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A comprehensive platform designed for seamless relocations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: FiTruck, title: 'Seamless Planning', gradient: 'from-red-500 to-red-600' },
              { icon: FiShield, title: 'Secure & Trusted', gradient: 'from-maroon-500 to-maroon-600' },
              { icon: FiClock, title: 'Real-Time Tracking', gradient: 'from-red-600 to-maroon-600' },
              { icon: FiMapPin, title: 'Wide Coverage', gradient: 'from-maroon-600 to-red-500' },
              { icon: FiTrendingUp, title: 'Transparent Pricing', gradient: 'from-red-500 to-maroon-500' },
              { icon: FiStar, title: 'Expert Providers', gradient: 'from-maroon-500 to-red-600' },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-red-200 transition-all"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">
                    Experience the future of relocation management
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 bg-gradient-to-br from-red-900/50 via-maroon-900/50 to-red-900/50">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Welcome to the future
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Your relocation, one platform. Secure. Fast. Reliable.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg"
              >
                <span>Launch Relocate</span>
                <FiArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-maroon-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiTruck className="text-white text-lg" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-maroon-600 bg-clip-text text-transparent">Relocate</span>
            </div>
            <p className="text-gray-500 text-sm">
              &copy; 2024 Relocate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
