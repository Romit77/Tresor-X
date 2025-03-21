"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Transaction,
  SystemProgram,
  PublicKey,
  Keypair,
} from "@solana/web3.js";
import {
  createCreateMetadataAccountV3Instruction,
  createCreateMasterEditionV3Instruction,
  PROGRAM_ID as METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  getMintLen,
} from "@solana/spl-token";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import z from "zod";
import dynamic from "next/dynamic";
import axios from "axios";
const METADATA_PROGRAM_ID_FALLBACK = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// Dynamically import wallet button to prevent SSR issues
const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function NFTLaunchpad() {
  // Connection and wallet states
  const wallet = useWallet();
  const { connection } = useConnection();

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [symbol, setSymbol] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [creatingStatus, setCreatingStatus] = useState("");
  const [nftMintAddress, setNftMintAddress] = useState("");

  // Form validation schema
  const nftSchema = z.object({
    name: z
      .string()
      .min(3, { message: "Name must contain at least 3 characters" }),
    symbol: z
      .string()
      .min(2, { message: "Symbol must contain at least 2 characters" }),
    description: z
      .string()
      .min(10, { message: "Description must contain at least 10 characters" }),
    imageUrl: z.string().url({ message: "Please enter a valid image URL" }),
  });

  // Preview image when URL changes
  useEffect(() => {
    if (imageUrl && imageUrl.trim() !== "") {
      // Validate the URL before setting preview
      try {
        new URL(imageUrl);
        setImagePreview(imageUrl);
      } catch (e) {
        setImagePreview("");
      }
    } else {
      setImagePreview("");
    }
  }, [imageUrl]);

  // Handle validation errors
  const handleValidationErrors = (errorMessages: any) => {
    if (errorMessages.name?._errors) {
      toast.error(`Name: ${errorMessages.name._errors.join(", ")}`);
    }
    if (errorMessages.symbol?._errors) {
      toast.error(`Symbol: ${errorMessages.symbol._errors.join(", ")}`);
    }
    if (errorMessages.description?._errors) {
      toast.error(
        `Description: ${errorMessages.description._errors.join(", ")}`
      );
    }
    if (errorMessages.imageUrl?._errors) {
      toast.error(`Image URL: ${errorMessages.imageUrl._errors.join(", ")}`);
    }
  };

  // Create metadata JSON and upload to a service like Arweave
  const createAndUploadMetadata = async (metadata: any) => {
    try {
      setCreatingStatus("Preparing metadata...");

      // In production, you would use a real storage solution
      // This example uses a mock external service
      const metadataBody = {
        name: metadata.name,
        symbol: metadata.symbol,
        description: metadata.description,
        image: metadata.imageUrl,
        attributes: [],
        properties: {
          files: [
            {
              uri: metadata.imageUrl,
              type: "image/jpeg", // Adjust based on your image type
            },
          ],
          category: "image",
          creators: [
            {
              address: wallet.publicKey?.toString(),
              share: 100,
            },
          ],
        },
      };

      // In production, replace with actual API call to your metadata storage service
      // Example: Arweave, IPFS, or your own API
      // const response = await axios.post("https://your-metadata-service.com/api/upload", metadataBody);
      // return response.data.metadataUri;

      // For demo purposes, we'll simulate a metadata URI
      // In production, replace this with actual storage logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate upload delay

      // Return a mock metadata URI
      return `https://arweave.net/${Math.random()
        .toString(36)
        .substring(2, 15)}`;
    } catch (error) {
      console.error("Error uploading metadata:", error);
      throw new Error("Failed to create NFT metadata. Please try again.");
    }
  };

  // Create the NFT on Solana
  const createNFT = async () => {
    if (!wallet || !wallet.publicKey) {
      toast.error("Please connect your wallet to create an NFT");
      return;
    }

    // Validate form inputs
    const parsedInput = nftSchema.safeParse({
      name,
      symbol,
      description,
      imageUrl,
    });

    if (!parsedInput.success) {
      handleValidationErrors(parsedInput.error.format());
      return;
    }

    // Start creation process
    setIsCreating(true);
    setNftMintAddress("");

    try {
      // Create and upload metadata
      const metadataUri = await createAndUploadMetadata({
        name,
        symbol,
        description,
        imageUrl,
      });

      // Generate a new keypair for the NFT mint
      const mintKeypair = Keypair.generate();
      const mintKey = mintKeypair.publicKey;

      // Get associated token account for the wallet
      const associatedTokenAccount = getAssociatedTokenAddressSync(
        mintKey,
        wallet.publicKey
      );

      // Find program-derived addresses for metadata and master edition
      const [metadataAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          METADATA_PROGRAM_ID.toBuffer(),
          mintKey.toBuffer(),
        ],
        METADATA_PROGRAM_ID
      );

      const [masterEditionAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          METADATA_PROGRAM_ID.toBuffer(),
          mintKey.toBuffer(),
          Buffer.from("edition"),
        ],
        METADATA_PROGRAM_ID
      );

      // Calculate rent for mint account
      setCreatingStatus("Calculating rent exemption...");
      const mintLen = getMintLen([]);
      const mintLamports = await connection.getMinimumBalanceForRentExemption(
        mintLen
      );

      // Define NFT metadata
      const metadata = {
        name: name,
        symbol: symbol,
        uri: metadataUri,
        sellerFeeBasisPoints: 500, // 5% royalty
        creators: [
          {
            address: wallet.publicKey,
            verified: true,
            share: 100,
          },
        ],
        collection: null,
        uses: null,
      };

      // Build the transaction
      setCreatingStatus("Building transaction...");
      const transaction = new Transaction();

      // Create mint account
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKey,
          space: mintLen,
          lamports: mintLamports,
          programId: TOKEN_PROGRAM_ID,
        })
      );

      // Initialize mint
      transaction.add(
        createInitializeMintInstruction(
          mintKey,
          0, // 0 decimals for NFTs
          wallet.publicKey,
          wallet.publicKey
        )
      );

      // Create associated token account
      transaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedTokenAccount,
          wallet.publicKey,
          mintKey
        )
      );

      // Mint one token (NFT)
      transaction.add(
        createMintToInstruction(
          mintKey,
          associatedTokenAccount,
          wallet.publicKey,
          1,
          []
        )
      );

      // Create metadata account
      transaction.add(
        createCreateMetadataAccountV3Instruction(
          {
            metadata: metadataAccount,
            mint: mintKey,
            mintAuthority: wallet.publicKey,
            payer: wallet.publicKey,
            updateAuthority: wallet.publicKey,
          },
          {
            createMetadataAccountArgsV3: {
              data: {
                name: metadata.name,
                symbol: metadata.symbol,
                uri: metadata.uri,
                sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
                creators: metadata.creators,
                collection: null,
                uses: null,
              },
              isMutable: true,
              collectionDetails: null,
            },
          }
        )
      );

      // Create master edition (makes it a true NFT)
      transaction.add(
        createCreateMasterEditionV3Instruction(
          {
            edition: masterEditionAccount,
            mint: mintKey,
            updateAuthority: wallet.publicKey,
            mintAuthority: wallet.publicKey,
            payer: wallet.publicKey,
            metadata: metadataAccount,
          },
          {
            createMasterEditionArgs: {
              maxSupply: 0, // 0 means unique 1-of-1 NFT
            },
          }
        )
      );

      // Prepare transaction for sending
      setCreatingStatus("Preparing to send transaction...");
      transaction.feePayer = wallet.publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      // Sign with mint keypair
      transaction.partialSign(mintKeypair);

      // Send transaction
      setCreatingStatus("Sending transaction...");
      const signature = await wallet.sendTransaction(transaction, connection);

      // Wait for confirmation
      setCreatingStatus("Confirming transaction...");
      const confirmation = await connection.confirmTransaction(
        signature,
        "confirmed"
      );

      if (confirmation.value.err) {
        throw new Error("Transaction confirmed but contained an error");
      }

      // Set mint address for display and reset form
      setNftMintAddress(mintKey.toBase58());
      toast.success("NFT created successfully!");

      // Reset form fields
      setName("");
      setSymbol("");
      setDescription("");
      setImageUrl("");
      setImagePreview("");
    } catch (error) {
      console.error("Error creating NFT:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create NFT";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsCreating(false);
      setCreatingStatus("");
    }
  };

  // Copy NFT address to clipboard
  const copyNftAddress = () => {
    if (nftMintAddress) {
      navigator.clipboard.writeText(nftMintAddress);
      toast.success("NFT address copied to clipboard");
    }
  };

  return (
    <>
      <Toaster theme="dark" position="bottom-right" />
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] animate-gradient">
        <div className="absolute top-4 right-4">
          <WalletMultiButton className="!bg-zinc-900 hover:!bg-zinc-800 !text-white !border !border-zinc-700 transition-all duration-300 hover:!border-purple-500/50" />
        </div>
        <h1 className="text-6xl font-bold mb-10 p-5 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-text-gradient bg-[length:200%_auto]">
          Create your NFT on Solana
        </h1>
        <div className="w-full max-w-md space-y-6 bg-zinc-900/50 p-8 rounded-xl shadow-2xl border border-zinc-800/50 backdrop-blur-sm hover:border-purple-500/20 transition-all duration-300">
          {/* Image preview */}
          <div className="flex justify-center mb-4">
            <div className="w-full aspect-square rounded-lg border-2 border-dashed border-zinc-700 flex items-center justify-center overflow-hidden hover:border-purple-500/50 transition-all duration-300">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="NFT Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6">
                  <div className="text-purple-400 text-4xl mb-2">🖼️</div>
                  <p className="text-zinc-400">Enter image URL below</p>
                </div>
              )}
            </div>
          </div>

          {/* Image URL input */}
          <div className="space-y-2 group">
            <label className="text-sm text-zinc-400 ml-1 group-hover:text-purple-400 transition-colors duration-200">
              Image URL
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 text-white border border-zinc-700/50 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 hover:border-purple-500/30"
              type="text"
              placeholder="https://example.com/your-image.jpg"
              onChange={(e) => setImageUrl(e.target.value)}
              value={imageUrl}
              disabled={isCreating}
            />
          </div>

          {/* NFT Name input */}
          <div className="space-y-2 group">
            <label className="text-sm text-zinc-400 ml-1 group-hover:text-purple-400 transition-colors duration-200">
              NFT Name
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 text-white border border-zinc-700/50 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 hover:border-purple-500/30"
              type="text"
              placeholder="Enter NFT name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              disabled={isCreating}
            />
          </div>

          {/* Symbol input */}
          <div className="space-y-2 group">
            <label className="text-sm text-zinc-400 ml-1 group-hover:text-purple-400 transition-colors duration-200">
              Symbol
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 text-white border border-zinc-700/50 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 hover:border-purple-500/30"
              type="text"
              placeholder="Enter NFT symbol"
              onChange={(e) => setSymbol(e.target.value)}
              value={symbol}
              disabled={isCreating}
            />
          </div>

          {/* Description input */}
          <div className="space-y-2 group">
            <label className="text-sm text-zinc-400 ml-1 group-hover:text-purple-400 transition-colors duration-200">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 text-white border border-zinc-700/50 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 hover:border-purple-500/30"
              placeholder="Describe your NFT"
              rows={4}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              disabled={isCreating}
            />
          </div>

          {/* Creation status */}
          {isCreating && (
            <div className="bg-zinc-800/70 rounded-lg p-4 text-sm text-purple-300 animate-pulse">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin"></div>
                <span>{creatingStatus || "Creating your NFT..."}</span>
              </div>
            </div>
          )}

          {/* NFT mint address (success state) */}
          {nftMintAddress && (
            <div className="bg-zinc-800/70 rounded-lg p-4 text-sm text-green-300 break-all">
              <p className="mb-2 font-semibold">NFT Created Successfully! 🎉</p>
              <div className="flex items-center space-x-2">
                <span className="text-zinc-400">Mint Address:</span>
                <span className="font-mono">{nftMintAddress}</span>
                <button
                  onClick={copyNftAddress}
                  className="text-purple-400 hover:text-purple-300"
                  title="Copy address"
                >
                  📋
                </button>
              </div>
              <p className="mt-2 text-xs text-zinc-400">
                Check your wallet to view the NFT
              </p>
            </div>
          )}

          {/* Create button */}
          <button
            className="w-full px-6 py-3 text-white bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-[length:200%] animate-button-gradient font-semibold rounded-lg transition-all duration-300 hover:opacity-90 hover:scale-[0.99] transform active:scale-[0.98] mt-4 hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={createNFT}
            disabled={isCreating}
          >
            {isCreating ? "Creating NFT..." : "Create NFT"}
          </button>

          <p className="text-zinc-500 text-center text-sm mt-4 hover:text-purple-400 transition-colors duration-200">
            Connect Phantom or Backpack wallet to mint your NFT
          </p>
        </div>
      </div>
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 15s ease infinite;
          background-size: 200% 200%;
        }
        .animate-text-gradient {
          animation: textGradient 5s linear infinite;
        }
        @keyframes textGradient {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
        .animate-button-gradient {
          animation: buttonGradient 3s linear infinite;
        }
        @keyframes buttonGradient {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
      `}</style>
    </>
  );
}
