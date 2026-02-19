import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { FiTruck, FiArrowRight, FiCheck, FiStar, FiTrendingUp, FiShield, FiClock, FiMapPin, FiGlobe, FiUsers, FiPackage, FiPhone } from 'react-icons/fi';

const AnimatedCounter = ({ target, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const Home = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroY = useTransform(smoothProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.25], [1, 0]);

  return (
    <div ref={containerRef} className="relative bg-white text-gray-900 overflow-hidden">

      {/* Top Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-maroon-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                <FiTruck className="text-white text-sm" />
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">Relocate</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-sm text-gray-400 hover:text-white transition-colors">Services</a>
              <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How It Works</a>
              <a href="#stats" className="text-sm text-gray-400 hover:text-white transition-colors">Results</a>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/login" className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-maroon-500 to-red-600 rounded-md hover:from-maroon-600 hover:to-red-700 transition-all shadow-md">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0 bg-gray-900">
          <img
            src="/images/hero-airplane.jpg"
            alt="Global Aviation Logistics"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/60 to-gray-900/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.7, stiffness: 200 }}
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-8 border border-white/20"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-white/90">Trusted by 10,000+ customers worldwide</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
                <span className="block text-white">Your Global</span>
                <span className="block bg-gradient-to-r from-red-400 via-red-500 to-maroon-400 bg-clip-text text-transparent">
                  Relocation Partner
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg leading-relaxed">
                End-to-end relocation management. Plan your move, book trusted providers, track shipments in real-time, and settle into your new home seamlessly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-red-500 to-maroon-600 rounded-xl font-bold text-white shadow-xl shadow-red-500/30 hover:shadow-red-500/50 transition-all"
                  >
                    <span>Start Your Move</span>
                    <FiArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                <Link
                  to="/service-providers"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-semibold text-white hover:bg-white/20 transition-all"
                >
                  <span>Browse Providers</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center space-x-8 mt-12">
                <div className="flex items-center space-x-2">
                  <FiShield className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-400">Insured Moves</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiClock className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-400">24/7 Support</span>
                </div>
                <div className="hidden sm:flex items-center space-x-2">
                  <FiGlobe className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-gray-400">Global Coverage</span>
                </div>
              </div>
            </motion.div>

            {/* Right side floating cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="hidden lg:block relative"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-4"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <FiCheck className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Shipment Delivered</p>
                    <p className="text-gray-400 text-sm">New York → London</p>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full w-full" />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 ml-12"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <FiTruck className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">In Transit</p>
                    <p className="text-gray-400 text-sm">Dubai → Sydney • 65% complete</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 mt-4 mr-8"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {['bg-red-400', 'bg-blue-400', 'bg-green-400'].map((color, i) => (
                      <div key={i} className={`w-8 h-8 ${color} rounded-full border-2 border-gray-900 flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{String.fromCharCode(65 + i)}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">+2,400 active users</p>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <FiArrowRight className="w-5 h-5 rotate-90 text-white/50" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Bar */}
      <section id="stats" className="relative py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 10000, suffix: '+', label: 'Successful Moves' },
              { value: 500, suffix: '+', label: 'Service Providers' },
              { value: 50, suffix: '+', label: 'Countries Covered' },
              { value: 98, suffix: '%', label: 'Satisfaction Rate' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-black text-white mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold text-red-600 uppercase tracking-widest">Our Services</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4 text-gray-900">Everything You Need</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From planning to settling in, we cover every step of your relocation journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: FiTruck, title: 'Seamless Planning', desc: 'Create detailed relocation plans with origin, destination, inventory management and cost estimates.', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop&q=80' },
              { icon: FiShield, title: 'Verified Providers', desc: 'Browse and book from our network of rated and reviewed professional service providers.', img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop&q=80' },
              { icon: FiMapPin, title: 'Live Tracking', desc: 'Track your shipments in real-time with status updates from pickup to delivery.', img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop&q=80' },
              { icon: FiPackage, title: 'Document Vault', desc: 'Securely store and manage all your relocation documents in one place.', img: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&h=400&fit=crop&q=80' },
              { icon: FiTrendingUp, title: 'Smart Quotations', desc: 'Get instant cost estimates based on distance, weight and service type.', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop&q=80' },
              { icon: FiStar, title: 'Reviews & Ratings', desc: 'Make informed decisions with transparent ratings and customer reviews.', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&q=80' },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={feature.img}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold text-red-600 uppercase tracking-widest">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4 text-gray-900">Four Simple Steps</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and let us handle the complexity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up and tell us about your relocation needs.', icon: FiUsers },
              { step: '02', title: 'Plan Your Move', desc: 'Set origin, destination, dates and inventory details.', icon: FiMapPin },
              { step: '03', title: 'Book Provider', desc: 'Compare and book from verified service providers.', icon: FiCheck },
              { step: '04', title: 'Track & Arrive', desc: 'Monitor your shipment and settle into your new home.', icon: FiTruck },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative text-center"
                >
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-gray-100">
                      <Icon className="w-8 h-8 text-gray-700" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-red-500 to-maroon-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-xs font-bold">{item.step}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Showcase Image Section */}
      <section className="relative py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-bold text-red-600 uppercase tracking-widest">Why Choose Us</span>
              <h2 className="text-4xl md:text-5xl font-black mt-3 mb-6 text-gray-900">
                Global Reach,<br />Local Expertise
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Whether you're moving across the city or across the world, our platform connects you with the right professionals to make your transition smooth and stress-free.
              </p>
              <div className="space-y-4">
                {[
                  'End-to-end relocation management',
                  'Verified and rated service providers',
                  'Real-time shipment tracking',
                  'Secure document management',
                  'Transparent pricing with no hidden fees',
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiCheck className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/hero-logistics.jpg"
                  alt="Global Logistics Network"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-maroon-600 rounded-lg flex items-center justify-center">
                    <FiGlobe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">50+ Countries</p>
                    <p className="text-xs text-gray-500">Worldwide coverage</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold text-red-600 uppercase tracking-widest">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4 text-gray-900">What Our Clients Say</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah M.', role: 'International Move', quote: 'Relocate made our move from New York to London completely stress-free. The tracking feature was incredible.', rating: 5 },
              { name: 'James K.', role: 'Corporate Transfer', quote: 'As an HR manager, I\'ve used Relocate for 20+ employee transfers. The platform saves us hours of coordination.', rating: 5 },
              { name: 'Priya D.', role: 'Family Relocation', quote: 'Moving our family of 5 across the country was daunting. Relocate matched us with the perfect provider.', rating: 5 },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-maroon-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1494412574643-ff11b0a5eb95?w=1600&h=800&fit=crop&q=80"
            alt="Moving"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/85" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
              Ready to Start Your Move?
            </h2>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              Join thousands of satisfied customers who trust Relocate for their relocation needs. Your seamless move is just one click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-red-500 to-maroon-600 rounded-xl font-bold text-white shadow-xl"
                >
                  <span>Get Started Free</span>
                  <FiArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <Link
                to="/login"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-semibold text-white hover:bg-white/20 transition-all"
              >
                <FiPhone className="w-4 h-4" />
                <span>Contact Sales</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-maroon-500 to-red-600 rounded-lg flex items-center justify-center">
                  <FiTruck className="text-white text-sm" />
                </div>
                <span className="text-lg font-semibold text-white">Relocate</span>
              </div>
              <p className="text-sm leading-relaxed">
                Your trusted partner for seamless relocations worldwide. Plan, book, track and settle with confidence.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/service-providers" className="hover:text-white transition-colors">Service Providers</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white transition-colors cursor-default">Local Moving</span></li>
                <li><span className="hover:text-white transition-colors cursor-default">International Moving</span></li>
                <li><span className="hover:text-white transition-colors cursor-default">Corporate Relocation</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white transition-colors cursor-default">Help Center</span></li>
                <li><span className="hover:text-white transition-colors cursor-default">Privacy Policy</span></li>
                <li><span className="hover:text-white transition-colors cursor-default">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm">&copy; 2026 Relocate. All rights reserved.</p>
            <p className="text-sm mt-2 md:mt-0">Built for seamless global relocations.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
