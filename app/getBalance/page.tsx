"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast, Toaster } from "sonner";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Component() {
  const [balance, setBalance] = useState<number>(0);
  const wallet = useWallet();
  const { connection } = useConnection();

  async function getBal() {
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    try {
      const res = await connection.getBalance(wallet.publicKey);
      setBalance(res / LAMPORTS_PER_SOL);
      toast.success("Balance updated successfully");
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Failed to fetch balance");
    }
  }

  useEffect(() => {
    if (wallet.publicKey) {
      getBal();
    }
  }, [wallet.publicKey, connection]);

  return (
    <div className="h-screen flex flex-col bg-black text-white relative overflow-hidden">
      <Toaster position="top-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 via-blue-500/10 to-transparent filter blur-lg z-0"></div>

      <div className="p-4 flex justify-end relative z-10">
        <WalletMultiButton className="!bg-zinc-900 hover:!bg-zinc-800 !text-white !border !border-zinc-700" />
      </div>
      <div className="py-8 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text relative z-10">
          View Your SOL Balance and Transactions
        </h1>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg border border-gray-800">
          <div className="p-6">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent filter blur-xl"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text relative z-10">
                Solana Wallet Balance
              </h2>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="text-center text-2xl font-bold">
                {wallet.publicKey ? (
                  <>
                    <span className="text-gray-400">Balance: </span>
                    <span className="text-gray-400">
                      {balance.toFixed(4)} SOL
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400">
                    Connect your wallet to view balance
                  </span>
                )}
              </div>
              <button
                onClick={getBal}
                className="w-full p-2 rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:from-purple-600 hover:to-blue-600 transition-colors"
                disabled={!wallet.publicKey}
              >
                Refresh Balance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
