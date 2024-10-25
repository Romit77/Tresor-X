"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function Component() {
  const boxes = [
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
      title: "Check Balance",
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
      title: "Create NFTs",
      subheading: "Mint unique digital treasures - Coming Soon",
      href: "/",
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
    <div className="min-h-screen bg-black text-white p-4 md:p-8 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-transparent opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(88,28,135,0.08)_0,_transparent_70%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(29,78,216,0.05)_0,_transparent_50%)] animate-pulse delay-75" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-950/30 border border-purple-800/20 mb-4"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">
              Discover Our Features
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 tracking-tight"
          >
            TresorX Features
          </motion.h1>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 grid-rows-3 gap-4 max-w-4xl mx-auto aspect-square"
        >
          {boxes.map((box, index) => (
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
                className="group bg-gray-950 backdrop-blur-lg p-6 rounded-xl border border-purple-900/20 h-full flex flex-col justify-between overflow-hidden relative transition-all duration-300 hover:border-purple-800/40 hover:bg-gray-900/80"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-blue-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 space-y-4">
                  <span className="text-2xl">{box.icon}</span>
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold mb-2 text-white/90 group-hover:text-purple-200 transition-colors duration-300">
                      {box.title}
                    </h2>
                    <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300 font-semibold">
                      {box.subheading}
                    </p>
                  </div>
                </div>

                <motion.div
                  className="relative z-10 mt-4 flex items-center gap-2 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  <span className="text-sm">Learn more</span>
                  <ArrowUpRight className="w-4 h-4" />
                </motion.div>

                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-950/10 via-blue-950/10 to-transparent rounded-tl-full" />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
