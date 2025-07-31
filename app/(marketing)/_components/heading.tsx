"use client"
import React, { useEffect, useState } from "react"
import { InteractiveHoverButton } from "@/app/(marketing)/_components/interactive-hover-button"
import Link from "next/link"
import { useMediaQuery } from "usehooks-ts"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useConvexAuth } from "convex/react"
import { Spinner } from "@/components/spinner"
import { SignInButton } from "@clerk/nextjs"
import { motion, easeOut } from "framer-motion"

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}

const Heading = () => {
  const [hasMounted, setHasMounted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { isAuthenticated, isLoading } = useConvexAuth()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) return null

  return (
    <motion.div
      className="space-y-4 text-center"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.h1
        variants={itemVariants}
        className="text-4xl dark:text-[#fffff3] sm:text-4xl md:text-6xl font-extrabold leading-tight text-balance"
      >
        Save & Learn Smarter <br className="hidden sm:block" />
        From YouTube
      </motion.h1>

      <motion.h4
        variants={itemVariants}
        className="text-base dark:text-[#fffff3] sm:text-lg text-muted-foreground font-medium"
      >
        Capture insights, write notes, and never lose a good video again
      </motion.h4>

      {isLoading && (
        <motion.div
          variants={itemVariants}
          className="w-full flex items-center justify-center"
        >
          <Spinner size="lg" />
        </motion.div>
      )}

      {!isAuthenticated && !isLoading && isMobile && (
        <motion.div variants={itemVariants}>
          <SignInButton mode="modal">
            <Button>
              Get Started
              <ArrowRight />
            </Button>
          </SignInButton>
        </motion.div>
      )}

      {isAuthenticated && !isLoading && isMobile && (
        <motion.div variants={itemVariants}>
          <Link href="/video">
            <Button>
              Start Now
              <ArrowRight />
            </Button>
          </Link>
        </motion.div>
      )}

      {!isAuthenticated && !isLoading && !isMobile && (
        <motion.div variants={itemVariants}>
          <SignInButton mode="modal">
            <InteractiveHoverButton
              text="Get Started"
              className="text-sm sm:text-base dark:text-[#fffff3]"
            />
          </SignInButton>
        </motion.div>
      )}

      {isAuthenticated && !isLoading && !isMobile && (
        <motion.div variants={itemVariants}>
          <Link href="/video">
            <InteractiveHoverButton
              text="Start Now"
              className="text-sm sm:text-base dark:text-[#fffff3]"
            />
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Heading
