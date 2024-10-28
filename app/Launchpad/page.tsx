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

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function TokenLaunchpad() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [name, setName] = useState("");
  const [initialSupply, setInitialSupply] = useState(0);
  const [imgUrl, setImgUrl] = useState("");
  const [symbol, setSymbol] = useState("");

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
      setImgUrl("");
      setInitialSupply(0);
      setName("");
      setSymbol("");
    } catch (err: any) {
      toast.error(`Error: ${err.message || "Failed to mint tokens"}`);
    } finally {
      toast.dismiss(loadingToast);
    }
  }

  return (
    <>
      <Toaster theme="dark" position="bottom-right" />
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <div className="absolute top-4 right-4">
          <WalletMultiButton className="!bg-zinc-900 hover:!bg-zinc-800 !text-white !border !border-zinc-700" />
        </div>
        <h1 className="text-6xl font-bold mb-10 p-5 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          Create and launch your own Tokens!
        </h1>
        <div className="w-full max-w-md space-y-6 bg-zinc-900/50 p-8 rounded-xl shadow-2xl border border-zinc-800/50 backdrop-blur-sm">
          <div className="space-y-2">
            <label className="text-sm text-zinc-400 ml-1">Token Name</label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 text-white border border-zinc-700/50 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-200"
              type="text"
              placeholder="Enter token name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-400 ml-1">Token Symbol</label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 text-white border border-zinc-700/50 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-200"
              type="text"
              placeholder="Enter token symbol"
              onChange={(e) => setSymbol(e.target.value)}
              value={symbol}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-400 ml-1">Image URL</label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 text-white border border-zinc-700/50 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-200"
              type="text"
              placeholder="Enter image URL"
              onChange={(e) => setImgUrl(e.target.value)}
              value={imgUrl}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-400 ml-1">Initial Supply</label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 text-white border border-zinc-700/50 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-200"
              type="number"
              placeholder="Enter initial supply"
              onChange={(e) => setInitialSupply(Number(e.target.value))}
              value={initialSupply}
            />
          </div>
          <button
            className="w-full px-6 py-3 text-white bg-gradient-to-r from-purple-500 to-blue-500 font-semibold rounded-lg transition duration-200 hover:opacity-90 hover:scale-[0.99] transform active:scale-[0.98] mt-4"
            onClick={createToken}
          >
            Create Token
          </button>
          <p className="text-zinc-500 text-center text-sm mt-4">
            Connect your wallet to start creating tokens on Solana
          </p>
        </div>
      </div>
    </>
  );
}
