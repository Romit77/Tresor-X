"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState } from "react";
import bs58 from "bs58";
import { ed25519 } from "@noble/curves/ed25519";
import { toast, Toaster } from "sonner";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowLeft,
  PenTool,
  CheckCircle,
  AlertCircle,
  Key,
  Lock,
  FileText,
  Terminal,
  Copy,
  Eye,
  EyeOff,
  Zap,
  Fingerprint,
  Hash,
  User,
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

export default function SignMessagePage() {
  const { publicKey, signMessage } = useWallet();
  const { connection } = useConnection();
  const [message, setMessage] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [isSigningProcess, setIsSigningProcess] = useState(false);
  const [showSignature, setShowSignature] = useState(false);

  const signMsg = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message to sign");
      return;
    }

    try {
      setIsSigningProcess(true);
      const encodedMessage = new TextEncoder().encode(message);

      if (!signMessage) {
        toast.error("Message signing is not supported by your wallet");
        return;
      }

      const signatureBytes = await signMessage(encodedMessage);

      // Verify the signature
      if (
        !ed25519.verify(signatureBytes, encodedMessage, publicKey.toBytes())
      ) {
        toast.error("Signature verification failed");
        throw new Error("Signature verification failed");
      }

      const signatureBase58 = bs58.encode(signatureBytes);
      setSignature(signatureBase58);
      toast.success("Message signed successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(`Signing failed: ${error.message || error}`);
    } finally {
      setIsSigningProcess(false);
    }
  };

  const copySignature = () => {
    if (signature) {
      navigator.clipboard.writeText(signature);
      toast.success("Signature copied to clipboard");
    }
  };

  const clearAll = () => {
    setMessage("");
    setSignature("");
    setShowSignature(false);
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
              <CryptoBadge variant="warning">
                <Fingerprint className="w-4 h-4 inline mr-2" />
                Digital Signature
              </CryptoBadge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Sign Messages
              <br />
              <span className="gradient-text">Cryptographically</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
            >
              Prove your identity and authenticate messages using your Solana
              wallet's private key. Create verifiable digital signatures.
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
              <div className="flex items-center mb-8">
                <PenTool className="w-8 h-8 text-orange-400 mr-3" />
                <h2 className="text-2xl font-bold">Message Signing</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message to Sign
                  </label>
                  <textarea
                    placeholder="Enter your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="crypto-input"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    {message.length} characters
                  </p>
                </div>

                <div className="flex gap-4">
                  <CryptoButton
                    onClick={signMsg}
                    disabled={isSigningProcess || !publicKey || !message.trim()}
                    className="flex-1 text-lg py-4"
                  >
                    {isSigningProcess ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Signing...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2" />
                        Sign Message
                      </>
                    )}
                  </CryptoButton>

                  <CryptoButton
                    variant="secondary"
                    onClick={clearAll}
                    className="px-6 py-4"
                  >
                    Clear
                  </CryptoButton>
                </div>

                {signature && (
                  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-green-400">
                        Signature (Base58):
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowSignature(!showSignature)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {showSignature ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={copySignature}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="font-mono text-sm text-white break-all bg-black/50 p-3 rounded-lg">
                      {showSignature
                        ? signature
                        : `${signature.slice(0, 20)}...${signature.slice(-20)}`}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="crypto-card p-8">
                <div className="flex items-center mb-6">
                  <Key className="w-8 h-8 text-blue-400 mr-3" />
                  <h3 className="text-2xl font-bold">How It Works</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Enter Message</p>
                      <p className="text-sm text-gray-400">
                        Type the message you want to sign
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Create Signature</p>
                      <p className="text-sm text-gray-400">
                        Your wallet signs with private key
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Verify & Share</p>
                      <p className="text-sm text-gray-400">
                        Signature proves message authenticity
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="crypto-card p-8">
                <div className="flex items-center mb-6">
                  <Lock className="w-8 h-8 text-green-400 mr-3" />
                  <h3 className="text-2xl font-bold">Security</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Ed25519 cryptographic signing</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Private key never exposed</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Mathematically verifiable</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Non-repudiation guarantee</span>
                  </div>
                </div>
              </div>

              <div className="crypto-card p-8">
                <div className="flex items-center mb-6">
                  <FileText className="w-8 h-8 text-purple-400 mr-3" />
                  <h3 className="text-2xl font-bold">Use Cases</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Hash className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span>Identity verification</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span>Authentication systems</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span>Document integrity</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span>Smart contract interactions</span>
                  </div>
                </div>
              </div>

              <div className="crypto-card p-8 border-orange-500/30">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-400 mr-3" />
                  <h3 className="text-lg font-bold text-orange-400">
                    Important
                  </h3>
                </div>
                <p className="text-sm text-gray-300">
                  Only sign messages you trust. Your signature proves you
                  authored the message and can be used for authentication.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
