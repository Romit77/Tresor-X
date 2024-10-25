"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState } from "react";
import bs58 from "bs58";
import { ed25519 } from "@noble/curves/ed25519";
import { toast, Toaster } from "sonner";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Component() {
  const { publicKey, signMessage } = useWallet();
  const { connection } = useConnection();
  const [message, setMessage] = useState<string>("");

  async function signMsg() {
    if (!publicKey) {
      toast.error("Connect wallet");
      return;
    }
    try {
      const encodedMessage = new TextEncoder().encode(message);
      if (!signMessage) {
        toast.error("signMessage function is not available");
        return;
      }
      const signature = await signMessage(encodedMessage);

      if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes())) {
        toast.error("Error");
        throw new Error("Signature verification failed");
      }
      toast.success(`Success! Message signature: ${bs58.encode(signature)}`);
    } catch (error) {
      console.error(error);
      toast.error(`Error: ${error}`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-black">
      <div className="w-full py-12 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-400/20 via-blue-400/10 to-transparent pointer-events-none"></div>

        <h1 className="text-5xl md:text-6xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text mb-[60px] p-8 z-10 relative">
          Sign Messages on the Solana Blockchain!
        </h1>
      </div>

      <div className="absolute top-4 right-4">
        <WalletMultiButton className="!bg-zinc-900 hover:!bg-zinc-800 !text-white !border !border-zinc-700" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="relative bg-gray-900 rounded-3xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Solana Message Signer
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter message"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-purple-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={signMsg}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              Sign Message
            </button>
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
}
