import { motion } from "framer-motion";

export function Mascot({ size = 220 }: { size?: number }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      style={{ width: size, height: size }}
      className="relative"
    >
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 grid place-items-center"
      >
        <div className="absolute inset-0 rounded-full bg-aurora blur-2xl opacity-70" />
        <div className="relative rounded-full gradient-hero shadow-glow grid place-items-center"
             style={{ width: size * 0.78, height: size * 0.78 }}>
          <div className="text-[5.2rem] leading-none drop-shadow-lg" style={{ fontSize: size * 0.42 }}>🦊</div>
          {/* Sparkles */}
          <motion.span
            className="absolute -top-2 -right-2 text-3xl"
            animate={{ rotate: [0, 20, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          >✨</motion.span>
          <motion.span
            className="absolute -bottom-2 -left-3 text-2xl"
            animate={{ rotate: [0, -20, 10, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: 0.4 }}
          >⭐</motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}
