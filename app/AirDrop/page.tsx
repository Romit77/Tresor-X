"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast, Toaster } from "sonner";
import z from "zod";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Component() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState<number>(0);

  const amountSchema = z.number().min(1);

  async function Airdrop() {
    const parsedAmount = amountSchema.safeParse(amount);
    if (!parsedAmount.success) {
      toast.error("Minimum amount should be 1 for Airdrop");
      return;
    }
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    try {
      const res = await connection.requestAirdrop(
        wallet.publicKey!,
        parsedAmount.data * LAMPORTS_PER_SOL
      );
      console.log(res);
      toast.success("Airdrop successful!");
    } catch (err: any) {
      console.log(err);
      toast.error("Airdrop failed. Please try again.");
    }
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <Toaster position="top-center" />
      <div className="p-4 flex justify-end">
        <WalletMultiButton />
      </div>
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg border border-gray-800">
          <div className="p-6">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 to-transparent filter blur-xl"></div>
              <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text relative z-10">
                Solana Airdrop
              </h1>
            </div>
            <div className="space-y-4 relative z-10">
              <input
                type="number"
                placeholder="Enter SOL amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={Airdrop}
                className="w-full p-2 rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:from-purple-600 hover:to-blue-600 transition-colors"
              >
                Request Airdrop
              </button>
              <div className="text-center text-sm text-gray-400">
                Connect your wallet to request an airdrop on Solana
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
