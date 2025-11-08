"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedCardWrapperProps {
  children: ReactNode;
  index?: number;
  className?: string;
}

export default function AnimatedCardWrapper({
  children,
  index = 0,
  className = "",
}: AnimatedCardWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
