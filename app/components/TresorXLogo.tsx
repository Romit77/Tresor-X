"use client";

import { motion } from "framer-motion";

interface TresorXLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

const TresorXLogo = ({
  className = "",
  size = "md",
  animated = true,
}: TresorXLogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const LogoSVG = () => (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} ${className}`}
    >
      <defs>
        <linearGradient
          id="treasureGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="gemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* Outer treasure chest */}
      <motion.path
        d="M8 16 L40 16 L40 40 C40 42.2 38.2 44 36 44 L12 44 C9.8 44 8 42.2 8 40 L8 16 Z"
        fill="url(#treasureGradient)"
        stroke="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: animated ? 1 : 1,
          opacity: 1,
        }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />

      <motion.path
        d="M6 16 C6 13.8 7.8 12 10 12 L38 12 C40.2 12 42 13.8 42 16 C42 18.2 40.2 20 38 20 L10 20 C7.8 20 6 18.2 6 16 Z"
        fill="url(#treasureGradient)"
        stroke="none"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />

      <motion.path
        d="M24 6 L28 14 L24 22 L20 14 Z"
        fill="url(#gemGradient)"
        stroke="none"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.8,
          type: "spring",
          stiffness: 200,
        }}
      />

      <motion.circle
        cx="18"
        cy="10"
        r="0.8"
        fill="#ffffff"
        opacity="0.8"
        initial={{ scale: 0 }}
        animate={{
          scale: animated ? [0, 1, 0] : 1,
        }}
        transition={{
          duration: 2,
          repeat: animated ? Infinity : 0,
          delay: 1.5,
        }}
      />
      <motion.circle
        cx="30"
        cy="12"
        r="0.6"
        fill="#ffffff"
        opacity="0.6"
        initial={{ scale: 0 }}
        animate={{
          scale: animated ? [0, 1, 0] : 1,
        }}
        transition={{
          duration: 2.5,
          repeat: animated ? Infinity : 0,
          delay: 2,
        }}
      />

      <motion.circle
        cx="24"
        cy="28"
        r="3"
        fill="#fbbf24"
        stroke="none"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.2 }}
      />

      <motion.path
        d="M24 26 C24.8 26 25.5 26.7 25.5 27.5 C25.5 28.3 24.8 29 24 29 C23.2 29 22.5 28.3 22.5 27.5 C22.5 26.7 23.2 26 24 26 Z M23.5 29 L24.5 29 L24.5 31 L23.5 31 Z"
        fill="#1f2937"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.4 }}
      />

      <motion.circle
        cx="16"
        cy="24"
        r="1.5"
        fill="#fbbf24"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1.6 }}
      />
      <motion.circle
        cx="32"
        cy="24"
        r="1.5"
        fill="#fbbf24"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1.8 }}
      />

      <motion.path
        d="M10 18 L10 22 L14 22"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 2 }}
      />
      <motion.path
        d="M38 18 L38 22 L34 22"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 2.2 }}
      />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{
          scale: 1.05,
          rotate: [0, -2, 2, 0],
        }}
        transition={{ duration: 0.3 }}
      >
        <LogoSVG />
      </motion.div>
    );
  }

  return <LogoSVG />;
};

export default TresorXLogo;
