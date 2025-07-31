"use client"

import { useSpring, animated } from "@react-spring/web"

export const AnimatedCounter = ({ number = 0 }: { number: number }) => {
  const { number: animatedNumber } = useSpring({
    from: { number: 0 },
    to: { number },
    config: { tension: 180, friction: 24 },
    reset: true,
  })

  return (
    <animated.span>
      {animatedNumber.to((n) => Math.round(n))}
    </animated.span>
  )
}
