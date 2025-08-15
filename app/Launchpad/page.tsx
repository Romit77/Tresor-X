"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Coins,
  Upload,
  Settings,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

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
      "inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600 bg-transparent",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

const CryptoInput = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
  error,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="crypto-input w-full"
      />
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};

export default function LaunchpadPage() {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenSupply, setTokenSupply] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState("9");
  const [tokenDescription, setTokenDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!tokenName.trim()) newErrors.name = "Token name is required";
    if (!tokenSymbol.trim()) newErrors.symbol = "Token symbol is required";
    if (tokenSymbol.length > 10)
      newErrors.symbol = "Symbol must be 10 characters or less";
    if (!tokenSupply.trim()) newErrors.supply = "Token supply is required";
    if (isNaN(Number(tokenSupply)) || Number(tokenSupply) <= 0) {
      newErrors.supply = "Supply must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateToken = async () => {
    if (!validateForm()) return;

    setIsCreating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setCreatedToken("8k7v9xQx...mN3pR4");
    } catch (error) {
      console.error("Error creating token:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="nav-glass fixed top-0 w-full z-50"
      >
        <div className="container">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>

              <div className="h-6 w-px bg-gray-700"></div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <div className="text-xl font-bold">Token Launchpad</div>
              </div>
            </div>

            <WalletMultiButton />
          </div>
        </div>
      </motion.nav>

      <div className="pt-24 pb-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Launch Your <span className="gradient-text">SPL Token</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Create and deploy your own SPL token on Solana with just a few
                clicks. Perfect for projects, communities, and businesses.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="crypto-card p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Settings className="w-6 h-6" />
                    Token Configuration
                  </h2>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <CryptoInput
                        label="Token Name"
                        placeholder="My Awesome Token"
                        value={tokenName}
                        onChange={setTokenName}
                        required
                        error={errors.name}
                      />

                      <CryptoInput
                        label="Token Symbol"
                        placeholder="MAT"
                        value={tokenSymbol}
                        onChange={setTokenSymbol}
                        required
                        error={errors.symbol}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <CryptoInput
                        label="Total Supply"
                        placeholder="1000000"
                        value={tokenSupply}
                        onChange={setTokenSupply}
                        type="number"
                        required
                        error={errors.supply}
                      />

                      <CryptoInput
                        label="Decimals"
                        placeholder="9"
                        value={tokenDecimals}
                        onChange={setTokenDecimals}
                        type="number"
                      />
                    </div>

                    <CryptoInput
                      label="Description (Optional)"
                      placeholder="Describe your token's purpose and utility..."
                      value={tokenDescription}
                      onChange={setTokenDescription}
                    />

                    <div className="pt-4">
                      {!createdToken ? (
                        <CryptoButton
                          onClick={handleCreateToken}
                          disabled={isCreating}
                          className="w-full text-lg py-4"
                        >
                          {isCreating ? (
                            <>
                              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                              Creating Token...
                            </>
                          ) : (
                            <>
                              <Zap className="w-5 h-5 mr-2" />
                              Create Token
                            </>
                          )}
                        </CryptoButton>
                      ) : (
                        <div className="crypto-card p-6 bg-green-900/20 border-green-500/30">
                          <div className="flex items-center gap-3 mb-4">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                            <h3 className="text-lg font-bold text-green-400">
                              Token Created Successfully!
                            </h3>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                              <span className="text-gray-300">
                                Token Address:
                              </span>
                              <div className="flex items-center gap-2">
                                <code className="text-green-400">
                                  {createdToken}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(createdToken)}
                                  className="text-gray-400 hover:text-white transition-colors"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <CryptoButton variant="ghost" className="w-full">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View on Solscan
                            </CryptoButton>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <div className="crypto-card p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Features
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">
                        SPL Token Standard
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">
                        Instant Deployment
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">
                        Minimal Fees
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">
                        Full Ownership
                      </span>
                    </div>
                  </div>
                </div>

                <div className="crypto-card p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Cost Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Token Creation:</span>
                      <span className="text-white">~0.002 SOL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Metadata Account:</span>
                      <span className="text-white">~0.001 SOL</span>
                    </div>
                    <div className="border-t border-gray-700 pt-3 flex justify-between font-bold">
                      <span>Total Cost:</span>
                      <span className="text-green-400">~0.003 SOL</span>
                    </div>
                  </div>
                </div>
                <div className="crypto-card p-6">
                  <h3 className="text-lg font-bold mb-4">Need Help?</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Check out our comprehensive guide on token creation and best
                    practices.
                  </p>
                  <CryptoButton variant="ghost" className="w-full">
                    View Documentation
                  </CryptoButton>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
