"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Wallet2, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

// Enhanced professional background component with animations
const EnhancedBackground = ({ className }) => (
  <div className={`relative overflow-hidden ${className}`}>
    {/* Dark gradient base */}
    <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />

    {/* Circuit board pattern */}
    <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] bg-repeat opacity-5" />

    {/* Animated gradient orbs - Enhanced with more animations */}
    <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[100px] animate-float-slow opacity-30" />
    <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px] animate-float-medium opacity-20 animation-delay-2000" />
    <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-violet-800/10 rounded-full blur-[80px] animate-float-fast opacity-15 animation-delay-3500" />

    {/* Grid lines with subtle animation */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20 animate-grid-shift" />

    {/* Enhanced animated light stripes */}
    <div className="absolute top-0 left-0 right-0 h-screen bg-gradient-to-b from-purple-500/5 via-transparent to-transparent animate-gradient-shift" />
    <div className="absolute bottom-0 left-0 right-0 h-screen bg-gradient-to-t from-purple-900/5 via-transparent to-transparent animate-gradient-shift-reverse" />

    {/* New: Animated glow effect */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_rgba(139,92,246,0.08)_0%,_transparent_60%)] animate-glow-pulse" />
  </div>
);

// Particle effect component with enhanced animations
const ParticleEffect = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Scattered small dots with varied animations */}
      {Array(25)
        .fill()
        .map((_, i) => (
          <circle
            key={`particle-${i}`}
            cx={`${Math.random() * 100}%`}
            cy={`${Math.random() * 100}%`}
            r={Math.random() * 1.8 + 0.5}
            fill={i % 3 === 0 ? "#a855f7" : i % 3 === 1 ? "#8b5cf6" : "#6366f1"}
            opacity={Math.random() * 0.5 + 0.3}
            filter="url(#glow)"
            className={i % 2 === 0 ? "animate-pulse" : "animate-float-particle"}
            style={{
              animationDuration: `${Math.random() * 5 + 3}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}

      {/* Connection lines with subtle animation */}
      {Array(12)
        .fill()
        .map((_, i) => (
          <line
            key={`line-${i}`}
            x1={`${Math.random() * 100}%`}
            y1={`${Math.random() * 100}%`}
            x2={`${Math.random() * 100}%`}
            y2={`${Math.random() * 100}%`}
            stroke={i % 2 === 0 ? "#a855f7" : "#8b5cf6"}
            strokeWidth="0.5"
            opacity="0.15"
            className="animate-line-fade"
            style={{
              animationDuration: `${Math.random() * 8 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
    </svg>
  );
};

// Redesigned Bento Component
const BentoFeatures = () => {
  const featureBoxes = [
    {
      title: "Launchpad",
      subheading: "Launch your token dreams into reality, no code needed",
      href: "/Launchpad",
      gridArea: "1 / 1 / 2 / 2",
      icon: "🚀",
    },
    {
      title: "Airdrop",
      subheading: "Distribute SOL to multiple wallets in one go",
      href: "/AirDrop",
      gridArea: "1 / 2 / 2 / 3",
      icon: "💸",
    },
    {
      title: "Transfer",
      subheading: "Send SOL seamlessly across the network",
      href: "/sendSol",
      gridArea: "1 / 3 / 3 / 4",
      icon: "💱",
    },
    {
      title: "Balance Check",
      subheading: "Monitor your SOL holdings in real-time",
      href: "/getBalance",
      gridArea: "2 / 1 / 3 / 2",
      icon: "💰",
    },
    {
      title: "Sign Messages",
      subheading: "Verify your identity with wallet signatures",
      href: "/SignMessage",
      gridArea: "2 / 2 / 3 / 3",
      icon: "📝",
    },
    {
      title: "NFT Creation",
      subheading: "Mint unique digital treasures - Coming Soon",
      href: "/NFTCreation",
      gridArea: "3 / 1 / 4 / 4",
      icon: "🎨",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 mb-24">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 mb-4"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-gray-300">Enterprise Solutions</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Professional <span className="text-purple-400">Web3 Tools</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gray-400 max-w-2xl mx-auto"
        >
          Comprehensive suite of Solana blockchain tools designed for
          professional users and enterprises
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-3 grid-rows-3 gap-4 max-w-4xl mx-auto aspect-square"
      >
        {featureBoxes.map((box, index) => (
          <Link
            href={box.href}
            key={index}
            className="block"
            style={{ gridArea: box.gridArea }}
          >
            <motion.div
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 25px rgba(88,28,135,0.15)",
              }}
              whileTap={{ scale: 0.98 }}
              className="group bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 h-full flex flex-col justify-between overflow-hidden relative transition-all duration-300 hover:border-purple-500/30 hover:bg-white/8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 space-y-4">
                <span className="text-2xl block mb-2">{box.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-200 transition-colors duration-300">
                    {box.title}
                  </h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {box.subheading}
                  </p>
                </div>
              </div>

              <motion.div
                className="relative z-10 mt-4 flex items-center gap-2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                <span className="text-sm">Explore</span>
                <ArrowUpRight className="w-4 h-4" />
              </motion.div>

              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-950/10 to-transparent rounded-tl-full" />
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
};

// Enhanced keyframes for various animations
const globalStyles = `
@keyframes slow-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

@keyframes float-slow {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(20px, -15px); }
  50% { transform: translate(0, -30px); }
  75% { transform: translate(-20px, -15px); }
}

@keyframes float-medium {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(-15px, 10px); }
  50% { transform: translate(0, 20px); }
  75% { transform: translate(15px, 10px); }
}

@keyframes float-fast {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(10px, -5px); }
  50% { transform: translate(0, -10px); }
  75% { transform: translate(-10px, -5px); }
}

@keyframes float-particle {
  0%, 100% { transform: translateY(0); opacity: 0.3; }
  50% { transform: translateY(-10px); opacity: 0.6; }
}

@keyframes line-fade {
  0%, 100% { opacity: 0.05; }
  50% { opacity: 0.2; }
}

@keyframes grid-shift {
  0% { background-position: 0px 0px; }
  100% { background-position: 50px 50px; }
}

@keyframes gradient-shift {
  0%, 100% { opacity: 0.05; transform: translateY(0); }
  50% { opacity: 0.1; transform: translateY(-30px); }
}

@keyframes gradient-shift-reverse {
  0%, 100% { opacity: 0.05; transform: translateY(0); }
  50% { opacity: 0.1; transform: translateY(30px); }
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 0.4; }
}

.animate-slow-pulse {
  animation: slow-pulse 10s infinite;
}

.animate-float-slow {
  animation: float-slow 20s infinite ease-in-out;
}

.animate-float-medium {
  animation: float-medium 15s infinite ease-in-out;
}

.animate-float-fast {
  animation: float-fast 12s infinite ease-in-out;
}

.animate-float-particle {
  animation: float-particle 4s infinite ease-in-out;
}

.animate-line-fade {
  animation: line-fade 8s infinite ease-in-out;
}

.animate-grid-shift {
  animation: grid-shift 20s infinite linear;
}

.animate-gradient-shift {
  animation: gradient-shift 15s infinite ease-in-out;
}

.animate-gradient-shift-reverse {
  animation: gradient-shift-reverse 15s infinite ease-in-out;
}

.animate-glow-pulse {
  animation: glow-pulse 10s infinite ease-in-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-3500 {
  animation-delay: 3.5s;
}
`;

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  // Refined animations
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const heroTranslateY = useTransform(scrollY, [0, 400], [0, -50]);

  // Background effects
  const backgroundBlur = useTransform(scrollY, [0, 400], [0, 6]);
  const backgroundOpacity = useTransform(scrollY, [0, 400], [0.7, 1]);

  useEffect(() => {
    setMounted(true);

    // Add global styles for animations
    const styleElement = document.createElement("style");
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative bg-black text-white min-h-screen">
      {/* Enhanced background */}
      <div className="fixed inset-0">
        <EnhancedBackground className="w-full h-full" />
        <ParticleEffect />
      </div>

      <div className="relative min-h-[200vh]">
        {/* Hero section with floating elements */}
        <motion.div
          className="h-screen flex items-center justify-center relative overflow-hidden"
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            y: heroTranslateY,
          }}
        >
          {/* Decorative floating elements with enhanced animations */}
          <motion.div
            className="absolute w-64 h-64 rounded-full border border-white/5"
            animate={{
              x: [0, 10, 0],
              y: [0, -15, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "easeInOut",
            }}
            style={{
              left: "10%",
              top: "20%",
              background:
                "radial-gradient(circle at center, rgba(88,28,135,0.1), transparent 70%)",
            }}
          />

          <motion.div
            className="absolute w-48 h-48 rounded-full border border-purple-500/10"
            animate={{
              x: [0, -15, 0],
              y: [0, 10, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 15,
              ease: "easeInOut",
            }}
            style={{
              right: "15%",
              bottom: "25%",
              background:
                "radial-gradient(circle at center, rgba(168,85,247,0.05), transparent 70%)",
            }}
          />

          <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 1.5 }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[150px] rounded-full bg-purple-600/10 blur-[80px]"
            />

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 relative"
            >
              Solana<span className="text-purple-400">Web3</span>
              <div className="absolute -top-10 -right-10 text-purple-500/20 text-8xl font-bold opacity-20">
                S
              </div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto relative z-10"
            >
              Enterprise-grade tools for Solana blockchain development and
              management
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4 relative z-10"
            >
              <button className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg shadow-purple-500/5">
                Explore Features
              </button>
              <div className="wallet-adapter-button-trigger">
                <WalletMultiButtonDynamic className="!bg-purple-900/40 !hover:bg-purple-800/60 !text-white !border !border-purple-500/30 !rounded-lg !py-3 !px-8 !font-medium !w-full sm:!w-auto transition-all duration-300 !shadow-lg !shadow-purple-500/5" />
              </div>
            </motion.div>

            {/* Fixed scroll indicator - moved to avoid overlap with buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 mt-16"
            >
              <p className="text-sm text-gray-400">Scroll to explore</p>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-6 h-10 rounded-full border border-white/20 flex items-center justify-center"
              >
                <motion.div className="w-1.5 h-3 bg-purple-400 rounded-full" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Content section with Bento grid */}
        <div className="relative backdrop-blur-sm border-t border-white/5 pt-24">
          {/* Enhanced visual divider with animation */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-purple-900/10 to-transparent animate-gradient-shift" />

          {/* Enhanced decorative elements with animations */}
          <div className="absolute top-40 left-10 w-64 h-64 rounded-full bg-purple-900/5 blur-[100px] animate-float-slow" />
          <div className="absolute top-60 right-10 w-32 h-32 rounded-full bg-indigo-900/5 blur-[50px] animate-float-medium" />

          {/* Integrated Bento component */}
          <BentoFeatures />

          {/* Enhanced CTA section */}
          <div className="container max-w-6xl mx-auto px-4 pb-24 relative">
            <div className="bg-gradient-to-r from-black via-purple-950/10 to-black border border-white/10 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
              {/* Enhanced background effects with animations */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(88,28,135,0.15)_0,_transparent_60%)] animate-glow-pulse" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-900/10 blur-[80px] animate-float-slow" />

              {/* New: Animated particles in CTA */}
              <div className="absolute inset-0 overflow-hidden">
                {Array(5)
                  .fill()
                  .map((_, i) => (
                    <div
                      key={`cta-particle-${i}`}
                      className="absolute rounded-full bg-purple-400/20 animate-float-particle"
                      style={{
                        width: `${Math.random() * 8 + 4}px`,
                        height: `${Math.random() * 8 + 4}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDuration: `${Math.random() * 5 + 5}s`,
                        animationDelay: `${Math.random() * 3}s`,
                      }}
                    />
                  ))}
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to elevate your Solana experience?
                </h3>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                  Connect your wallet now to access our professional suite of
                  Solana Web3 tools
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <div className="wallet-adapter-button-trigger">
                    <WalletMultiButtonDynamic className="!bg-purple-800 !hover:bg-purple-700 !text-white !border-none !rounded-lg !py-3 !px-8 !font-medium !w-full sm:!w-auto transition-all duration-300 !shadow-lg" />
                  </div>
                  <button className="px-8 py-3 bg-white/5 text-white border border-white/10 font-medium rounded-lg hover:bg-white/10 transition-colors duration-300">
                    View Documentation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
