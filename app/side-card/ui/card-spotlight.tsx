"use client";

import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import type React from "react";
import { type MouseEvent as ReactMouseEvent, useState } from "react";
import { CanvasRevealEffect } from "@/app/side-card/ui/canvas-reveal-effect";
import { cn } from "@/lib/utils";

export const CardSpotlight = ({
  children,
  radius = 350,
  color = "#262626",
  className,
  animatedBorder = false,
  ...props
}: {
  radius?: number;
  color?: string;
  children: React.ReactNode;
  animatedBorder?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const [isHovering, setIsHovering] = useState(false);
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  return (
    <div
      className={cn(
        "group/spotlight p-10 rounded-md relative bg-black",
        animatedBorder
          ? "animated-border"
          : "border border-neutral-800 dark:border-neutral-800",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...(animatedBorder &&
          ({
            "--border-radius": "0.375rem",
            "--border-size": "1.5px",
          } as React.CSSProperties)),
      }}
      {...props}
    >
      <style jsx global>{`
        .animated-border {
          position: relative;
          z-index: 0;
        }

        .animated-border::before {
          content: "";
          position: absolute;
          z-index: -1;
          inset: 0;
          padding: var(--border-size);
          border-radius: var(--border-radius);
          background: linear-gradient(
            to right,
            #3b82f6,
            #8b5cf6,
            #ec4899,
            #3b82f6
          );
          background-size: 400% 400%;
          background-position: 0% 0%;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: xor;
          animation: border-animate 6s linear infinite;
        }

        @keyframes border-animate {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      <motion.div
        className="pointer-events-none absolute z-0 -inset-px rounded-md opacity-0 transition duration-300 group-hover/spotlight:opacity-100"
        style={{
          backgroundColor: color,
          maskImage: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `,
        }}
      >
        {isHovering && (
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-transparent absolute inset-0 pointer-events-none"
            colors={[
              [59, 130, 246],
              [139, 92, 246],
            ]}
            dotSize={3}
          />
        )}
      </motion.div>
      {children}
    </div>
  );
};
