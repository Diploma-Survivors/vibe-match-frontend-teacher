"use client";

import { ParticleBackground } from "@/components/particle-background";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Award,
  ChevronDown,
  Database,
  DollarSign,
  Lock,
  Shield,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useInView } from "react-intersection-observer";

export default function HomePage() {
  const [walletConnected, setWalletConnected] = useState(false);

  // Intersection observer hooks for animations
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [problemsRef, problemsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [solanaRef, solanaInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [audienceRef, audienceInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const connectWallet = () => {
    // This would be replaced with actual Solana wallet connection logic
    setWalletConnected(!walletConnected);
    console.log("Connecting to Solana wallet...");
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">

    </div>
  );
}
