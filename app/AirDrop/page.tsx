"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";
import {
  Zap,
  ArrowLeft,
  Coins,
  Activity,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Gift,
  Star,
  Terminal,
  TrendingUp,
  Users,
  Shield,
  Droplets,
  Download,
} from "lucide-react";
import Link from "next/link";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

// Modern Crypto Badge Component
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

// Modern Crypto Button Component
const CryptoButton = ({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) => {
  const variants = {
    primary: "crypto-btn",
    secondary: "crypto-btn-secondary",
    ghost:
      "px-6 py-3 rounded-xl font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600 bg-transparent",
  };

  return (
    <button
      className={`${variants[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default function AirDropPage() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState(1);
  const [isRequesting, setIsRequesting] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  const requestAirdrop = async () => {
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setIsRequesting(true);
      toast.info("Requesting airdrop...");

      const signature = await connection.requestAirdrop(
        wallet.publicKey,
        amount * LAMPORTS_PER_SOL
      );

      await connection.confirmTransaction(signature);

      toast.success(`Successfully received ${amount} SOL!`);

      // Refresh balance
      const newBalance = await connection.getBalance(wallet.publicKey);
      setBalance(newBalance / LAMPORTS_PER_SOL);
    } catch (error: any) {
      console.error("Airdrop error:", error);
      toast.error(error.message || "Airdrop failed");
    } finally {
      setIsRequesting(false);
    }
  };

  const checkBalance = async () => {
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      const balance = await connection.getBalance(wallet.publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
      toast.success("Balance updated!");
    } catch (error: any) {
      console.error("Balance check error:", error);
      toast.error("Failed to check balance");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-right" />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="nav-glass fixed top-0 w-full z-50"
      >
        <div className="container">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold">
                Tresor<span className="gradient-text">X</span>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back Home</span>
              </Link>
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <CryptoBadge variant="success">
                <Droplets className="w-4 h-4 inline mr-2" />
                Devnet Airdrop
              </CryptoBadge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Get Free
              <br />
              <span className="gradient-text">Devnet SOL</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
            >
              Get free devnet SOL tokens for testing and development. Perfect
              for trying out dApps and smart contracts.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Airdrop Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="crypto-card p-8"
            >
              <div className="flex items-center mb-8">
                <Gift className="w-8 h-8 text-green-400 mr-3" />
                <h2 className="text-2xl font-bold">Request Airdrop</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount (SOL)
                  </label>
                  <select
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    className="crypto-input"
                  >
                    <option value={1}>1 SOL</option>
                    <option value={2}>2 SOL</option>
                    <option value={5}>5 SOL</option>
                  </select>
                </div>

                {balance !== null && (
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Current Balance:</span>
                      <span className="font-bold text-green-400">
                        {balance.toFixed(4)} SOL
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <CryptoButton
                    onClick={requestAirdrop}
                    disabled={isRequesting || !wallet.connected}
                    className="flex-1 text-lg py-4"
                  >
                    {isRequesting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Requesting...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Request Airdrop
                      </>
                    )}
                  </CryptoButton>

                  <CryptoButton
                    variant="secondary"
                    onClick={checkBalance}
                    disabled={!wallet.connected}
                    className="px-6 py-4"
                  >
                    <Activity className="w-5 h-5" />
                  </CryptoButton>
                </div>
              </div>
            </motion.div>

            {/* Info Panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* How it Works */}
              <div className="crypto-card p-8">
                <div className="flex items-center mb-6">
                  <Sparkles className="w-8 h-8 text-blue-400 mr-3" />
                  <h3 className="text-2xl font-bold">How It Works</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Connect Your Wallet</p>
                      <p className="text-sm text-gray-400">
                        Connect your Solana wallet to receive tokens
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Select Amount</p>
                      <p className="text-sm text-gray-400">
                        Choose how many SOL tokens you need
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Request Airdrop</p>
                      <p className="text-sm text-gray-400">
                        Tokens are sent directly to your wallet
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="crypto-card p-8">
                <div className="flex items-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                  <h3 className="text-2xl font-bold">Features</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Free devnet SOL tokens</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Instant delivery</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Multiple amounts available</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Perfect for testing</span>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="crypto-card p-8 border-orange-500/30">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-400 mr-3" />
                  <h3 className="text-lg font-bold text-orange-400">
                    Important Note
                  </h3>
                </div>
                <p className="text-sm text-gray-300">
                  These are devnet tokens and have no real value. They are only
                  for testing and development purposes.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
