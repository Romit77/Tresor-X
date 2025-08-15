"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";
import {
  Send,
  ArrowLeft,
  Wallet,
  Activity,
  CheckCircle,
  AlertCircle,
  Zap,
  Users,
  TrendingUp,
  Shield,
  Terminal,
  DollarSign,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

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
  disabled = false,
  type = "button",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) => {
  const variants = {
    primary: "crypto-btn",
    secondary: "crypto-btn-secondary",
    ghost:
      "px-6 py-3 rounded-xl font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600 bg-transparent",
  };

  return (
    <button
      type={type}
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

export default function SendSolPage() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [showRecipientDetails, setShowRecipientDetails] = useState(false);

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      checkBalance();
    }
  }, [wallet.connected, wallet.publicKey]);

  const checkBalance = async () => {
    if (!wallet.publicKey) return;

    try {
      setIsLoadingBalance(true);
      const balance = await connection.getBalance(wallet.publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (error: any) {
      console.error("Balance check error:", error);
      toast.error("Failed to check balance");
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const sendSol = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet.publicKey || !wallet.signTransaction) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!recipient || !amount) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSending(true);

      // Validate recipient address
      const recipientPubkey = new PublicKey(recipient);
      const amountInLamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      // Check if sender has enough balance
      if (balance && amountInLamports > balance * LAMPORTS_PER_SOL) {
        toast.error("Insufficient balance");
        return;
      }

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: recipientPubkey,
          lamports: amountInLamports,
        })
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      // Sign and send transaction
      const signedTransaction = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      toast.info("Transaction sent, confirming...");

      // Confirm transaction
      await connection.confirmTransaction(signature);

      toast.success(`Successfully sent ${amount} SOL!`);

      // Reset form and refresh balance
      setRecipient("");
      setAmount("");
      checkBalance();
    } catch (error: any) {
      console.error("Send error:", error);

      if (error.message?.includes("Invalid public key")) {
        toast.error("Invalid recipient address");
      } else if (error.message?.includes("insufficient funds")) {
        toast.error("Insufficient funds for transaction");
      } else {
        toast.error(error.message || "Transaction failed");
      }
    } finally {
      setIsSending(false);
    }
  };

  const copyAddress = () => {
    if (wallet.publicKey) {
      navigator.clipboard.writeText(wallet.publicKey.toString());
      toast.success("Address copied to clipboard");
    }
  };

  const setMaxAmount = () => {
    if (balance) {
      // Keep some SOL for transaction fees (0.001 SOL)
      const maxAmount = Math.max(0, balance - 0.001);
      setAmount(maxAmount.toString());
    }
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
              <CryptoBadge variant="primary">
                <Send className="w-4 h-4 inline mr-2" />
                P2P Transfer
              </CryptoBadge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Send
              <br />
              <span className="gradient-text">SOL Instantly</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
            >
              Transfer SOL tokens quickly and securely to any Solana wallet
              address. Lightning fast transactions with minimal fees.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Send Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="crypto-card p-8"
            >
              <div className="flex items-center mb-8">
                <Send className="w-8 h-8 text-blue-400 mr-3" />
                <h2 className="text-2xl font-bold">Send Transaction</h2>
              </div>

              {wallet.connected && (
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">Your Balance:</span>
                    <CryptoButton
                      variant="ghost"
                      onClick={checkBalance}
                      className="px-3 py-1 text-sm"
                    >
                      <Activity className="w-4 h-4" />
                    </CryptoButton>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {isLoadingBalance ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
                    ) : (
                      `${balance?.toFixed(4) || "0.0000"} SOL`
                    )}
                  </div>

                  {wallet.publicKey && (
                    <div className="mt-4 flex items-center space-x-2">
                      <div className="text-sm text-gray-400 font-mono break-all">
                        {showRecipientDetails
                          ? wallet.publicKey.toString()
                          : `${wallet.publicKey
                              .toString()
                              .slice(0, 8)}...${wallet.publicKey
                              .toString()
                              .slice(-8)}`}
                      </div>
                      <button
                        onClick={() =>
                          setShowRecipientDetails(!showRecipientDetails)
                        }
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {showRecipientDetails ? (
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
                  )}
                </div>
              )}

              <form onSubmit={sendSol} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Solana wallet address..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="crypto-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount (SOL)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      placeholder="0.000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="crypto-input pr-20"
                      required
                    />
                    <button
                      type="button"
                      onClick={setMaxAmount}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <CryptoButton
                  type="submit"
                  disabled={
                    isSending || !wallet.connected || !recipient || !amount
                  }
                  className="w-full text-lg py-4"
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send SOL
                    </>
                  )}
                </CryptoButton>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="crypto-card p-8">
                <div className="flex items-center mb-6">
                  <Zap className="w-8 h-8 text-yellow-400 mr-3" />
                  <h3 className="text-2xl font-bold">Transaction Info</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Network:</span>
                    <CryptoBadge variant="success">Solana</CryptoBadge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Fee:</span>
                    <span className="font-mono">~0.000005 SOL</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Speed:</span>
                    <span className="font-medium text-green-400">
                      ~0.4 seconds
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Finality:</span>
                    <span className="font-medium text-blue-400">
                      ~12 seconds
                    </span>
                  </div>
                </div>
              </div>

              <div className="crypto-card p-8">
                <div className="flex items-center mb-6">
                  <Shield className="w-8 h-8 text-green-400 mr-3" />
                  <h3 className="text-2xl font-bold">Security</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Cryptographic signatures</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Immutable blockchain records</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Decentralized validation</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Non-custodial transactions</span>
                  </div>
                </div>
              </div>

              <div className="crypto-card p-8 border-blue-500/30">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-400 mr-3" />
                  <h3 className="text-lg font-bold text-blue-400">Pro Tips</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• Double-check recipient addresses before sending</p>
                  <p>• Keep some SOL for future transaction fees</p>
                  <p>• Transactions are irreversible once confirmed</p>
                  <p>• Use testnet for practice transactions</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
