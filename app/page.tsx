"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useEffect } from "react";
import TresorXLogo from "./components/TresorXLogo";
import {
  Terminal,
  Zap,
  Shield,
  Coins,
  Send,
  Download,
  Palette,
  Key,
  TrendingUp,
  Users,
  Globe,
  Star,
  ArrowRight,
  CheckCircle,
  Activity,
} from "lucide-react";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const ParticleBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0">
        <div
          className="absolute w-1 h-1 bg-purple-400 rounded-full floating-particle pulse-particle"
          style={{ left: "10%", top: "20%" }}
        />
        <div
          className="absolute w-1 h-1 bg-purple-400 rounded-full floating-particle"
          style={{ left: "30%", top: "40%" }}
        />
        <div
          className="absolute w-1 h-1 bg-blue-400 rounded-full floating-particle pulse-particle"
          style={{ left: "60%", top: "10%" }}
        />
        <div
          className="absolute w-1 h-1 bg-purple-400 rounded-full floating-particle"
          style={{ left: "80%", top: "60%" }}
        />
        <div
          className="absolute w-1 h-1 bg-blue-400 rounded-full floating-particle pulse-particle"
          style={{ left: "15%", top: "80%" }}
        />
        <div
          className="absolute w-1 h-1 bg-purple-400 rounded-full floating-particle"
          style={{ left: "90%", top: "30%" }}
        />
        <div
          className="absolute w-1 h-1 bg-blue-400 rounded-full floating-particle pulse-particle"
          style={{ left: "40%", top: "70%" }}
        />
        <div
          className="absolute w-1 h-1 bg-purple-400 rounded-full floating-particle"
          style={{ left: "70%", top: "90%" }}
        />
        <div
          className="absolute w-1 h-1 bg-blue-400 rounded-full floating-particle pulse-particle"
          style={{ left: "25%", top: "15%" }}
        />
        <div
          className="absolute w-1 h-1 bg-purple-400 rounded-full floating-particle"
          style={{ left: "85%", top: "85%" }}
        />
        <div
          className="absolute w-1 h-1 bg-blue-400 rounded-full floating-particle pulse-particle"
          style={{ left: "55%", top: "35%" }}
        />
        <div
          className="absolute w-1 h-1 bg-purple-400 rounded-full floating-particle"
          style={{ left: "5%", top: "65%" }}
        />
      </div>
    </div>
  );
};

const CryptoBadge = ({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning";
}) => {
  const variants = {
    primary: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    secondary: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    success: "bg-green-500/20 text-green-300 border-green-500/30",
    warning: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

const CryptoButton = ({
  children,
  variant = "primary",
  onClick,
  className = "",
  href,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  className?: string;
  href?: string;
}) => {
  const variants = {
    primary: "crypto-btn",
    secondary: "crypto-btn-secondary",
    ghost:
      "inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600 bg-transparent",
  };

  if (href) {
    return (
      <Link href={href} className={`${variants[variant]} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  href,
  badge,
}: {
  icon: any;
  title: string;
  description: string;
  href: string;
  badge?: string;
}) => {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        className="crypto-card p-8 h-full group cursor-pointer"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="w-7 h-7 text-white" />
          </div>
          {badge && <CryptoBadge variant="success">{badge}</CryptoBadge>}
        </div>

        <h3 className="text-xl font-space-grotesk font-bold mb-3 group-hover:text-purple-300 transition-colors tracking-tight">
          {title}
        </h3>

        <p className="text-gray-400 mb-4 leading-relaxed">{description}</p>

        <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
          <span className="text-sm font-medium">Explore</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>
    </Link>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <ParticleBackground />

      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="nav-glass fixed top-0 w-full z-50"
      >
        <div className="container">
          <div className="flex justify-between items-center py-4">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <TresorXLogo size="md" animated={true} />
              <div className="text-2xl font-bold font-space-grotesk tracking-tight">
                <span className="text-white">Tresor</span>
                <span className="gradient-text">X</span>
              </div>
            </motion.div>

            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-6 font-space-grotesk">
                <Link
                  href="#features"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Features
                </Link>
                <Link
                  href="#tools"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Tools
                </Link>
                <Link
                  href="#about"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  About
                </Link>
              </nav>
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </motion.nav>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-blue-500/10" />
          <div className="grid-background" />
        </div>

        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 left-10 hidden lg:block"
        >
          <div className="crypto-card p-4 text-sm font-jetbrains-mono max-w-xs">
            <div className="text-green-400 mb-1">$ tresorx --version</div>
            <div className="text-gray-400">TresorX CLI v2.1.0</div>
            <div className="text-purple-400">Solana Devnet Ready ⚡</div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-60 right-10 hidden lg:block"
        >
          <div className="crypto-card p-4 text-sm font-jetbrains-mono max-w-xs">
            <div className="text-yellow-400 mb-1">🚀 Token Created</div>
            <div className="text-gray-400">Supply: 1,000,000</div>
            <div className="text-blue-400">Network: Solana</div>
          </div>
        </motion.div>

        <div className="container relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="mb-8"
                >
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                    <CryptoBadge variant="primary">
                      <Zap className="w-4 h-4 inline mr-2" />
                      Powered by Solana
                    </CryptoBadge>
                    <CryptoBadge variant="success">
                      <Activity className="w-4 h-4 inline mr-2" />
                      Live on Devnet
                    </CryptoBadge>
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-5xl md:text-7xl font-space-grotesk font-bold mb-8 leading-tight tracking-tight"
                >
                  Build the{" "}
                  <span className="relative">
                    <span className="gradient-text">Future</span>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 1 }}
                      className="absolute bottom-2 left-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    />
                  </span>
                  <br />
                  of DeFi
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed font-light"
                >
                  The ultimate toolkit for Solana developers and DeFi
                  enthusiasts. Create, deploy, and manage your crypto projects
                  with enterprise-grade tools.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex flex-wrap gap-6 mb-8 justify-center lg:justify-start"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">10K+</div>
                    <div className="text-sm text-gray-400">Tokens Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">50K+</div>
                    <div className="text-sm text-gray-400">Transactions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">100+</div>
                    <div className="text-sm text-gray-400">NFT Collections</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <CryptoButton href="#tools" className="text-lg px-8 py-4">
                    <Terminal className="w-5 h-5 mr-2" />
                    Launch Terminal
                  </CryptoButton>

                  <CryptoButton
                    variant="ghost"
                    href="#features"
                    className="text-lg px-12 py-4 min-w-[180px]"
                  >
                    <Activity className="w-5 h-5 mr-2" />
                    Learn More
                  </CryptoButton>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="relative">
                  <div className="crypto-card p-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-sm text-gray-400 font-jetbrains-mono">
                          tresorx-terminal
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-black font-jetbrains-mono text-sm space-y-3">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-green-400"
                      >
                        $ tresorx token create --name "MyToken" --symbol "MTK"
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="text-gray-300"
                      >
                        ⚡ Creating token on Solana Devnet...
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="text-purple-400"
                      >
                        ✅ Token created: 8k7v9xQx...mN3pR4
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5 }}
                        className="text-blue-400"
                      >
                        🔗 View on Solscan →
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 3 }}
                        className="text-green-400"
                      >
                        $ tresorx nft mint --collection "Art" --name "Pixel #1"
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 3.5 }}
                        className="text-gray-300 flex items-center"
                      >
                        <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full mr-2"></div>
                        Minting NFT...
                      </motion.div>
                    </div>
                  </div>

                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-6 -right-6 crypto-card p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400">Live</span>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [5, -5, 5] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -bottom-4 -left-6 crypto-card p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-yellow-400">Fast</span>
                    </div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="crypto-card p-4 text-center"
                  >
                    <div className="text-2xl font-bold gradient-text">
                      400ms
                    </div>
                    <div className="text-sm text-gray-400">Avg Block Time</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="crypto-card p-4 text-center"
                  >
                    <div className="text-2xl font-bold gradient-text">
                      $0.00025
                    </div>
                    <div className="text-sm text-gray-400">Transaction Fee</div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 relative">
        <div className="container">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-space-grotesk font-bold mb-6 tracking-tight"
            >
              Why Choose <span className="gradient-text">TresorX</span>?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Built on Solana's high-performance blockchain for the ultimate
              DeFi experience
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-min">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 lg:col-span-2 md:row-span-2 crypto-card p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-300 transition-colors">
                  Bank-Grade Security
                </h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Your assets are protected by cryptographic security and
                  decentralized validation.
                </p>
                <div className="flex items-center gap-2 text-sm text-purple-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Multi-signature support</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-400 mt-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Hardware wallet integration</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-1 lg:col-span-2 md:row-span-1 crypto-card p-6 relative group"
            >
              <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-full"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Lightning Speed</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Execute transactions in milliseconds with Solana's
                  proof-of-stake consensus.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="text-2xl font-bold gradient-text">400ms</div>
                  <div className="text-xs text-gray-500">avg block time</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-1 lg:col-span-2 crypto-card p-6 relative group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl"></div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Asset Support</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Create, manage, and trade SPL tokens, NFTs, and native SOL
                seamlessly.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                  SPL
                </span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                  NFT
                </span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                  SOL
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="md:col-span-1 lg:col-span-2 crypto-card p-6 text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-3">Community Driven</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Join thousands of users building the future of decentralized
                finance.
              </p>
              <div className="text-xl font-bold gradient-text">10,000+</div>
              <div className="text-xs text-gray-500">Active Users</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="md:col-span-2 lg:col-span-2 crypto-card p-6 relative overflow-hidden group"
            >
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-tl from-blue-500/20 to-transparent rounded-full"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Global Access</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Access your assets from anywhere in the world, 24/7, without
                  restrictions.
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">24/7</div>
                    <div className="text-xs text-gray-500">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">180+</div>
                    <div className="text-xs text-gray-500">Countries</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="md:col-span-2 lg:col-span-2 crypto-card p-6 relative group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/30 to-pink-500/30 rounded-full -translate-y-4 translate-x-4"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Premium Experience</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Enjoy a sleek, intuitive interface designed for both beginners
                  and pros.
                </p>
                <div className="flex items-center gap-2 text-sm text-purple-400 mb-2">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Intuitive Design</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-400">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Advanced Features</span>
                </div>
              </div>
            </motion.div> */}
          </div>
        </div>
      </section>

      <section id="tools" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 border border-purple-500 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 border border-blue-500 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-purple-500 rounded-full"></div>
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-space-grotesk font-bold mb-6 tracking-tight"
            >
              Powerful <span className="gradient-text">DeFi Tools</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Everything you need to participate in the decentralized economy
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 lg:col-span-1"
            >
              <div className="crypto-card p-8 h-full group cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Coins className="w-7 h-7 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                      Popular
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-purple-300 transition-colors">
                    Token Launchpad
                  </h3>

                  <p className="text-gray-400 mb-4 leading-relaxed">
                    Create and deploy your own SPL tokens on Solana with just a
                    few clicks. Perfect for projects, communities, and
                    businesses.
                  </p>

                  <Link
                    href="/Launchpad"
                    className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors"
                  >
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="crypto-card p-6 h-full group cursor-pointer hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3">Send SOL</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Transfer SOL tokens instantly to any wallet address with
                  minimal fees.
                </p>
                <Link
                  href="/sendSol"
                  className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors"
                >
                  <span className="text-sm font-medium">Explore</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="crypto-card p-6 h-full group cursor-pointer hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3">SOL Airdrop</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Get free devnet SOL tokens for testing and development
                  purposes.
                </p>
                <Link
                  href="/AirDrop"
                  className="flex items-center text-green-400 group-hover:text-green-300 transition-colors"
                >
                  <span className="text-sm font-medium">Explore</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="crypto-card p-6 h-full group cursor-pointer hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3">Balance Checker</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Monitor your Solana wallet balance in real-time with detailed
                  analytics.
                </p>
                <Link
                  href="/getBalance"
                  className="flex items-center text-orange-400 group-hover:text-orange-300 transition-colors"
                >
                  <span className="text-sm font-medium">Explore</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2 lg:col-span-1"
            >
              <div className="crypto-card p-8 h-full group cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500"></div>

                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Palette className="w-7 h-7 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                    New
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-pink-300 transition-colors">
                  NFT Creator
                </h3>

                <p className="text-gray-400 mb-4 leading-relaxed">
                  Mint unique NFTs on Solana with our powerful creation tools.
                  Turn your digital art into tradeable assets.
                </p>

                <Link
                  href="/NFTCreation"
                  className="flex items-center text-pink-400 group-hover:text-pink-300 transition-colors"
                >
                  <span className="text-sm font-medium">Explore</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="crypto-card p-6 h-full group cursor-pointer hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                  <Key className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3">Message Signing</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Prove your identity using cryptographic signatures with your
                  Solana wallet.
                </p>
                <Link
                  href="/SignMessage"
                  className="flex items-center text-indigo-400 group-hover:text-indigo-300 transition-colors"
                >
                  <span className="text-sm font-medium">Explore</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="crypto-card p-12 text-center bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30"
          >
            <h2 className="text-4xl md:text-5xl font-space-grotesk font-bold mb-6 tracking-tight">
              Ready to <span className="gradient-text">Get Started</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the decentralized revolution today. Connect your wallet and
              start exploring the future of finance with TresorX.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <CryptoButton href="/Launchpad" className="text-lg px-8 py-4">
                <Zap className="w-5 h-5 mr-2" />
                Launch Your Token
              </CryptoButton>
              <CryptoButton
                variant="ghost"
                href="/AirDrop"
                className="text-lg px-12 py-4 min-w-[180px]"
              >
                <Download className="w-5 h-5 mr-2" />
                Get Free SOL
              </CryptoButton>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-800">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl font-bold">
                Tresor<span className="gradient-text">X</span>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 TresorX. Built on Solana.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
