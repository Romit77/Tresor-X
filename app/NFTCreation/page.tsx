"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import z from "zod";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ImageIcon,
  ArrowLeft,
  Upload,
  CheckCircle,
  AlertCircle,
  Zap,
  Palette,
  Star,
  Terminal,
  Eye,
  Copy,
  Sparkles,
  Heart,
  TrendingUp,
  Shield,
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

const nftSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol too long"),
  imageUrl: z.string().url("Invalid image URL"),
});

export default function NFTCreationPage() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [symbol, setSymbol] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any>({});

  const validateForm = () => {
    try {
      nftSchema.parse({ name, description, symbol, imageUrl });
      setValidationErrors({});
      return true;
    } catch (error: any) {
      const errors: any = {};
      error.errors.forEach((err: any) => {
        errors[err.path[0]] = err.message;
      });
      setValidationErrors(errors);
      return false;
    }
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    if (url && url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      setImagePreview(url);
    } else {
      setImagePreview("");
    }
  };

  const createNFT = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet.publicKey || !wallet.signTransaction) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix form errors");
      return;
    }

    try {
      setIsCreating(true);
      toast.info("Creating NFT...");

      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast.success("NFT created successfully! (Demo mode)");
      toast.info("Full NFT creation functionality coming soon!");

      setName("");
      setDescription("");
      setSymbol("");
      setImageUrl("");
      setImagePreview("");
    } catch (error: any) {
      console.error("NFT creation error:", error);
      toast.error(error.message || "Failed to create NFT");
    } finally {
      setIsCreating(false);
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
                <Palette className="w-4 h-4 inline mr-2" />
                NFT Creator
              </CryptoBadge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Create Your
              <br />
              <span className="gradient-text">Digital Masterpiece</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
            >
              Mint unique NFTs on Solana with our powerful creation tools. Turn
              your digital art into tradeable blockchain assets.
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
                <Sparkles className="w-8 h-8 text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold">Create NFT</h2>
              </div>

              <form onSubmit={createNFT} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    NFT Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter NFT name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`crypto-input ${
                      validationErrors.name ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {validationErrors.name && (
                    <p className="text-red-400 text-xs mt-1">
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Symbol *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ART"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    className={`crypto-input ${
                      validationErrors.symbol ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {validationErrors.symbol && (
                    <p className="text-red-400 text-xs mt-1">
                      {validationErrors.symbol}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    placeholder="Describe your NFT..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className={`crypto-input ${
                      validationErrors.description ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {validationErrors.description && (
                    <p className="text-red-400 text-xs mt-1">
                      {validationErrors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.png"
                    value={imageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    className={`crypto-input ${
                      validationErrors.imageUrl ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {validationErrors.imageUrl && (
                    <p className="text-red-400 text-xs mt-1">
                      {validationErrors.imageUrl}
                    </p>
                  )}
                </div>

                <CryptoButton
                  type="submit"
                  disabled={isCreating || !wallet.connected}
                  className="w-full text-lg py-4"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating NFT...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Create NFT
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
                  <Eye className="w-8 h-8 text-green-400 mr-3" />
                  <h3 className="text-2xl font-bold">Preview</h3>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="NFT Preview"
                        className="w-full h-64 object-cover rounded-lg"
                        onError={() => setImagePreview("")}
                      />
                      <div>
                        <h4 className="font-bold text-lg">
                          {name || "Untitled NFT"}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {symbol || "SYMBOL"}
                        </p>
                        <p className="text-gray-300 mt-2">
                          {description || "No description provided"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">
                        Enter image URL to see preview
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="crypto-card p-8">
                <div className="flex items-center mb-6">
                  <Star className="w-8 h-8 text-yellow-400 mr-3" />
                  <h3 className="text-2xl font-bold">NFT Details</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Blockchain:</span>
                    <CryptoBadge variant="success">Solana</CryptoBadge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Standard:</span>
                    <span className="font-medium">SPL Token</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Supply:</span>
                    <span className="font-medium text-blue-400">
                      1 (Unique)
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Royalties:</span>
                    <span className="font-medium text-purple-400">5%</span>
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
                    <span>Immutable ownership</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Creator royalties</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Marketplace compatible</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Metadata verification</span>
                  </div>
                </div>
              </div>

              <div className="crypto-card p-8 border-blue-500/30">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-400 mr-3" />
                  <h3 className="text-lg font-bold text-blue-400">Tips</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• Use high-quality images (PNG, JPG, or GIF)</p>
                  <p>• Keep names and descriptions clear and engaging</p>
                  <p>• Ensure image URLs are permanent and accessible</p>
                  <p>• Consider copyright and intellectual property rights</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
