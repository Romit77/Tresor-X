"use client";
import React, { useEffect, useState } from "react";
import Bento from "@/components/ui/Bento";
import { Vortex } from "@/components/ui/vortex";
import { motion, useScroll, useTransform } from "framer-motion";
import { Wallet2 } from "lucide-react";
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  // Transform values for content opacity and translation
  const contentOpacity = useTransform(scrollY, [0, 300], [0, 1]);
  const contentTranslateY = useTransform(scrollY, [0, 300], [100, 0]);

  // Transform values for vortex scaling and opacity
  const vortexScale = useTransform(scrollY, [0, 300], [1, 0.7]);
  const vortexOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full overflow-x-hidden bg-black relative">
      {/* Full screen vortex container */}
      <motion.div
        className="fixed inset-0 w-full h-screen"
        style={{
          scale: vortexScale,
          opacity: vortexOpacity,
        }}
      >
        <Vortex backgroundColor="black" className="w-full h-full" />
      </motion.div>

      {/* Scrollable content */}
      <div className="relative min-h-[200vh]">
        {/* Spacer to push content down */}
        <div className="h-screen" />

        {/* Main content section */}
        <motion.div
          className="relative bg-black/50 backdrop-blur-sm"
          style={{
            opacity: contentOpacity,
            y: contentTranslateY,
          }}
        >
          <div className="max-w-6xl mx-auto px-4 text-center py-20">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-950/30 border border-purple-800/20 mb-4"
              >
                <Wallet2 className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300">Solana Powered</span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500">
                Welcome to SolanaWeb3 Toolkit
              </h1>

              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Connect your wallet to access powerful Solana tools and features
              </p>

              <div className="flex justify-center">
                <div className="wallet-adapter-button-trigger">
                  <WalletMultiButtonDynamic className="!bg-purple-900/20 !hover:bg-purple-800/30 !text-purple-300 !border !border-purple-500/30 !rounded-xl !py-4 !px-8 !font-semibold !text-lg transition-all duration-300" />
                </div>
              </div>
            </div>
          </div>

          <Bento />
        </motion.div>
      </div>
    </div>
  );
}
