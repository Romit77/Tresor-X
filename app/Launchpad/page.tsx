"use client";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  ExtensionType,
  getAssociatedTokenAddressSync,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import z from "zod";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Coins,
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
    primary:
      "inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 hover:opacity-90 hover:scale-[0.99] transform active:scale-[0.98] text-white",
    secondary:
      "inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700",
    ghost:
      "inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600 bg-transparent text-white",
  } as const;

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
  value: string | number;
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
        className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 text-white border border-zinc-700/50 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 hover:border-purple-500/30"
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

export default function TokenLaunchpad() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [name, setName] = useState("");
  const [initialSupply, setInitialSupply] = useState(0);
  const [imgUrl, setImgUrl] = useState("");
  const [symbol, setSymbol] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);

  const tokenSchema = z.object({
    name: z
      .string()
      .min(3, { message: "Name must contain atleast 3 characters" }),
    symbol: z
      .string()
      .min(2, { message: "Symbol must contain atleast 3 characters" }),
    imgUrl: z.string().url("image must be a valid url"),
    initialSupply: z
      .number()
      .min(1, { message: "Minimum supply must be greater than 0" }),
  });

  async function createToken() {
    if (!wallet || !wallet.publicKey) {
      toast.error("Please connect wallet to create Tokens");
      return;
    }

    const parsedInput = tokenSchema.safeParse({
      name,
      imgUrl,
      symbol,
      initialSupply: Number(initialSupply),
    });

    if (!parsedInput.success) {
      const errorMessages = parsedInput.error.format();
      if (errorMessages.name?._errors) {
        toast.error(`Name: ${errorMessages.name._errors.join(", ")}`);
      }
      if (errorMessages.symbol?._errors) {
        toast.error(`Symbol: ${errorMessages.symbol._errors.join(", ")}`);
      }
      if (errorMessages.imgUrl?._errors) {
        toast.error(`Image URL: ${errorMessages.imgUrl._errors.join(", ")}`);
      }
      if (errorMessages.initialSupply?._errors) {
        toast.error(
          `Initial Supply: ${errorMessages.initialSupply._errors.join(", ")}`
        );
      }
      return;
    }

    let loadingToast;
    setIsCreating(true);

    try {
      const mintKeypair = Keypair.generate();

      const metadata = {
        mint: mintKeypair.publicKey,
        name: name,
        symbol: symbol,
        uri: "https://token-metadata.romit77dey.workers.dev/",
        additionalMetadata: [],
      };

      const mintLen = getMintLen([ExtensionType.MetadataPointer]);
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

      const lamports = await connection.getMinimumBalanceForRentExemption(
        mintLen + metadataLen
      );

      loadingToast = toast.loading("Creating Token Account");
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: mintLen,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(
          mintKeypair.publicKey,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          9,
          wallet.publicKey,
          null,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          mint: mintKeypair.publicKey,
          metadata: mintKeypair.publicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
          mintAuthority: wallet.publicKey,
          updateAuthority: wallet.publicKey,
        })
      );

      transaction.feePayer = wallet.publicKey;
      const recentBlockHash = connection.getLatestBlockhash();
      transaction.recentBlockhash = (await recentBlockHash).blockhash;
      transaction.partialSign(mintKeypair);
      await wallet.sendTransaction(transaction, connection);
      console.log("Token Account Created!");
      toast.dismiss(loadingToast);

      toast.success(
        `Token mint created at ${mintKeypair.publicKey.toBase58()}`
      );

      const associatedToken = getAssociatedTokenAddressSync(
        mintKeypair.publicKey,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      console.log("ATA : ", associatedToken.toBase58());

      loadingToast = toast.loading("creating associated Token Account");
      const transaction2 = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedToken,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        )
      );
      await wallet.sendTransaction(transaction2, connection);
      toast.dismiss(loadingToast);
      toast.success("ATA created");

      const atomicSupply = initialSupply * 10 ** 9;

      loadingToast = toast.loading("Minting Tokens");
      const transaction3 = new Transaction().add(
        createMintToInstruction(
          mintKeypair.publicKey,
          associatedToken,
          wallet.publicKey,
          atomicSupply,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

      await wallet.sendTransaction(transaction3, connection);
      toast.dismiss(loadingToast);
      toast.success("Minted!, Check your wallet");

      setCreatedToken(mintKeypair.publicKey.toBase58());
      setImgUrl("");
      setInitialSupply(0);
      setName("");
      setSymbol("");
    } catch (err: any) {
      toast.error(`Error: ${err.message || "Failed to mint tokens"}`);
    } finally {
      toast.dismiss(loadingToast);
      setIsCreating(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-zinc-800">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <div className="text-xl font-bold">Token Launchpad</div>
              </div>
            </div>
            <WalletMultiButton className="!bg-zinc-900 hover:!bg-zinc-800 !text-white !border !border-zinc-700 transition-all duration-300 hover:!border-purple-500/50" />
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Launch Your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500">
                  SPL Token
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Create and deploy your own SPL token on Solana with just a few
                clicks. Perfect for projects, communities, and businesses.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <div className="bg-zinc-900/50 p-8 rounded-xl shadow-2xl border border-zinc-800/50 backdrop-blur-sm hover:border-purple-500/20 transition-all duration-300">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Settings className="w-6 h-6" />
                    Token Configuration
                  </h2>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <CryptoInput
                        label="Token Name"
                        placeholder="My Awesome Token"
                        value={name}
                        onChange={setName}
                        required
                      />

                      <CryptoInput
                        label="Token Symbol"
                        placeholder="MAT"
                        value={symbol}
                        onChange={setSymbol}
                        required
                      />
                    </div>

                    <CryptoInput
                      label="Image URL"
                      placeholder="https://example.com/token-image.png"
                      value={imgUrl}
                      onChange={setImgUrl}
                      type="url"
                      required
                    />

                    <CryptoInput
                      label="Initial Supply"
                      placeholder="1000000"
                      value={initialSupply}
                      onChange={(value) => setInitialSupply(Number(value))}
                      type="number"
                      required
                    />

                    <div className="pt-4">
                      {!createdToken ? (
                        <CryptoButton
                          onClick={createToken}
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
                        <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-xl">
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
                                <code className="text-green-400 text-sm">
                                  {createdToken.slice(0, 8)}...
                                  {createdToken.slice(-8)}
                                </code>
                                <button
                                  onClick={() =>
                                    createdToken &&
                                    copyToClipboard(createdToken)
                                  }
                                  className="text-gray-400 hover:text-white transition-colors"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <CryptoButton
                              variant="ghost"
                              className="w-full"
                              onClick={() =>
                                window.open(
                                  `https://solscan.io/token/${createdToken}`,
                                  "_blank"
                                )
                              }
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View on Solscan
                            </CryptoButton>

                            <CryptoButton
                              variant="secondary"
                              className="w-full"
                              onClick={() => {
                                setCreatedToken(null);
                                setName("");
                                setSymbol("");
                                setImgUrl("");
                                setInitialSupply(0);
                              }}
                            >
                              Create Another Token
                            </CryptoButton>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
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

                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
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

                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
                  <h3 className="text-lg font-bold mb-4">Need Help?</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Check out our comprehensive guide on token creation and best
                    practices.
                  </p>
                  <CryptoButton variant="ghost" className="w-full">
                    View Documentation
                  </CryptoButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}
