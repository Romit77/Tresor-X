"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";
import {
  Wallet,
  ArrowLeft,
  RefreshCw,
  DollarSign,
  Activity,
  TrendingUp,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  AlertCircle,
  Terminal,
  BarChart3,
  PieChart,
  Coins,
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

export default function GetBalancePage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const wallet = useWallet();
  const { connection } = useConnection();

  const getBalance = async () => {
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setIsLoading(true);
      const res = await connection.getBalance(wallet.publicKey);
      setBalance(res / LAMPORTS_PER_SOL);
      setLastUpdated(new Date());
      toast.success("Balance updated successfully");
    } catch (error: any) {
      console.error("Error fetching balance:", error);
      toast.error("Failed to fetch balance");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSolPrice = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
      );
      const data = await response.json();
      setSolPrice(data.solana.usd);
    } catch (error) {
      console.error("Error fetching SOL price:", error);
      setSolPrice(150);
    }
  };

  const copyAddress = () => {
    if (wallet.publicKey) {
      navigator.clipboard.writeText(wallet.publicKey.toString());
      toast.success("Address copied to clipboard");
    }
  };

  useEffect(() => {
    if (wallet.publicKey && wallet.connected) {
      getBalance();
    }
    fetchSolPrice();
  }, [wallet.publicKey, wallet.connected]);

  const formatBalance = (bal: number | null) => {
    if (bal === null) return "-.----";
    return bal.toFixed(4);
  };

  const formatAddress = (address: string) => {
    if (showFullAddress) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-right" />

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

      <section className="pt-32 pb-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <CryptoBadge variant="secondary">
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Portfolio Tracker
              </CryptoBadge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Check Your
              <br />
              <span className="gradient-text">SOL Balance</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
            >
              Monitor your Solana wallet balance in real-time. Get instant
              updates on your SOL holdings and portfolio value.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="crypto-card p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <Wallet className="w-8 h-8 text-green-400 mr-3" />
                  <h2 className="text-2xl font-bold">Wallet Balance</h2>
                </div>
                <CryptoButton
                  variant="ghost"
                  onClick={getBalance}
                  disabled={isLoading || !wallet.connected}
                  className="px-4 py-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <RefreshCw className="w-5 h-5" />
                  )}
                </CryptoButton>
              </div>

              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-8 border border-purple-500/30 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">
                    Total Balance
                  </div>
                  <div className="text-5xl font-bold mb-4">
                    <span className="gradient-text">
                      {formatBalance(balance)}
                    </span>
                    <span className="text-2xl text-gray-300 ml-2">SOL</span>
                  </div>

                  {balance !== null && solPrice !== null && (
                    <div className="text-sm text-gray-400">
                      ≈ ${(balance * solPrice).toFixed(2)} USD
                    </div>
                  )}
                </div>
              </div>

              {wallet.publicKey && (
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">Wallet Address:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowFullAddress(!showFullAddress)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {showFullAddress ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={copyAddress}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="font-mono text-sm text-white break-all">
                    {formatAddress(wallet.publicKey.toString())}
                  </div>

                  {lastUpdated && (
                    <div className="mt-4 text-xs text-gray-500">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              )}

              {!wallet.connected && (
                <div className="text-center py-12">
                  <Wallet className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    Connect Your Wallet
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Connect your Solana wallet to view your balance
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="crypto-card p-8">
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-8 h-8 text-blue-400 mr-3" />
                  <h3 className="text-2xl font-bold">Portfolio Analytics</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Network:</span>
                    <CryptoBadge variant="success">Solana Devnet</CryptoBadge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Token Type:</span>
                    <span className="font-medium">SOL (Native)</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Decimals:</span>
                    <span className="font-medium">9</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Update Frequency:</span>
                    <span className="font-medium text-green-400">
                      Real-time
                    </span>
                  </div>
                </div>
              </div>

              <div className="crypto-card p-8">
                <div className="flex items-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                  <h3 className="text-2xl font-bold">Features</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Real-time balance updates</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>USD value estimation</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Address management</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Secure connection</span>
                  </div>
                </div>
              </div>

              <div className="crypto-card p-8">
                <div className="flex items-center mb-6">
                  <Activity className="w-8 h-8 text-purple-400 mr-3" />
                  <h3 className="text-2xl font-bold">Quick Actions</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Link href="/sendSol">
                    <CryptoButton variant="secondary" className="w-full">
                      Send SOL
                    </CryptoButton>
                  </Link>

                  <Link href="/AirDrop">
                    <CryptoButton variant="secondary" className="w-full">
                      Get Airdrop
                    </CryptoButton>
                  </Link>
                </div>
              </div>

              <div className="crypto-card p-8 border-blue-500/30">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-400 mr-3" />
                  <h3 className="text-lg font-bold text-blue-400">Note</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Balance updates are fetched directly from the Solana
                  blockchain. Network congestion may occasionally delay updates.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
