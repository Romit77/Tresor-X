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

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Component() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>(0);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState<number>(0);

  async function getBalance() {
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    try {
      const bal = await connection.getBalance(wallet.publicKey);
      setBalance(bal / LAMPORTS_PER_SOL);
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    getBalance();
  }, [wallet.publicKey, connection]);

  async function SendSol() {
    if (!wallet.publicKey) {
      toast.error("Connect Wallet");
      return;
    }

    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(to),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      await wallet.sendTransaction(transaction, connection);
      toast.success("Transaction successful!");
      getBalance();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      <Toaster position="top-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-purple-400/20 via-blue-400/10 to-transparent pointer-events-none"></div>

      <div className="p-4 flex justify-end relative z-10">
        <WalletMultiButton className="!bg-zinc-900 hover:!bg-zinc-800 !text-white !border !border-zinc-700" />
      </div>
      <div className="py-8 relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text z-10 relative">
          Transfer SOL Securely with Solana Wallet
        </h1>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg border border-gray-800">
          <div className="p-6">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 to-transparent filter blur-xl"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text relative z-10">
                Solana Wallet Transfer
              </h2>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="text-center text-xl">
                <span className="text-gray-400">Balance: </span>
                <span className="font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
                  {balance.toFixed(4)} SOL
                </span>
              </div>
              <input
                type="text"
                placeholder="Recipient Address"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Amount (SOL)"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={SendSol}
                className="w-full p-2 rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:from-purple-600 hover:to-blue-600 transition-colors"
              >
                Send SOL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
