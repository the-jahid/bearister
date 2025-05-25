"use client"
import { cn } from "@/lib/utils"
import { IconMenu2, IconX } from "@tabler/icons-react"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react"
import Image from "next/image"
import Link from "next/link"

import React, { useRef, useState } from "react"

interface NavbarProps {
  children: React.ReactNode
  className?: string
}

interface NavBodyProps {
  children: React.ReactNode
  className?: string
  visible?: boolean
}

interface NavItemsProps {
  items: {
    name: string
    link: string
  }[]
  className?: string
  onItemClick?: () => void
}

interface MobileNavProps {
  children: React.ReactNode
  className?: string
  visible?: boolean
}

interface MobileNavHeaderProps {
  children: React.ReactNode
  className?: string
}

interface MobileNavMenuProps {
  children: React.ReactNode
  className?: string
  isOpen: boolean
  onClose: () => void
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const [visible, setVisible] = useState<boolean>(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  })

  return (
    <motion.div
      ref={ref}
      // IMPORTANT: Change this to class of `fixed` if you want the navbar to be fixed
      className={cn("sticky inset-x-0 top-4 z-50 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ visible?: boolean }>, { visible })
          : child,
      )}
    </motion.div>
  )
}

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(26, 27, 46, 0.3), 0 1px 1px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(26, 27, 46, 0.2), 0 0 4px rgba(26, 27, 46, 0.3), 0 16px 68px rgba(26, 27, 46, 0.2), 0 1px 0 rgba(255, 255, 255, 0.05) inset"
          : "none",
        width: visible ? "40%" : "100%",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: "800px",
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex",
        visible && "bg-[#1a1b2e]/90 backdrop-blur-md border border-[#2a2d47]/50",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-gray-300 transition duration-200 hover:text-white lg:flex lg:space-x-2",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-[#e67e22]/20 border border-[#e67e22]/30"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  )
}

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(26, 27, 46, 0.3), 0 1px 1px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(26, 27, 46, 0.2), 0 0 4px rgba(26, 27, 46, 0.3), 0 16px 68px rgba(26, 27, 46, 0.2), 0 1px 0 rgba(255, 255, 255, 0.05) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "4px" : "2rem",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
        visible && "bg-[#1a1b2e]/90 backdrop-blur-md border border-[#2a2d47]/50",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

export const MobileNavHeader = ({ children, className }: MobileNavHeaderProps) => {
  return <div className={cn("flex w-full flex-row items-center justify-between", className)}>{children}</div>
}

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClose,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-[#1a1b2e]/95 backdrop-blur-md border border-[#2a2d47]/50 px-4 py-8 shadow-[0_0_24px_rgba(26,_27,_46,_0.3),_0_1px_1px_rgba(0,_0,_0,_0.2),_0_0_0_1px_rgba(26,_27,_46,_0.2),_0_0_4px_rgba(26,_27,_46,_0.3),_0_16px_68px_rgba(26,_27,_46,_0.2),_0_1px_0_rgba(255,_255,_255,_0.05)_inset]",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick: () => void
}) => {
  return isOpen ? (
    <IconX className="text-white hover:text-[#e67e22] transition-colors duration-200" onClick={onClick} />
  ) : (
    <IconMenu2 className="text-white hover:text-[#e67e22] transition-colors duration-200" onClick={onClick} />
  )
}

export const NavbarLogo = () => {
  return (
    <Link href="/" className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal">
     <div className="flex items-center gap-1 flex-1 justify-start">
  <div className="relative">
    <Image
      src="https://i.ibb.co/cKpJxnsT/A55-C04-B3-FD56-4367-93-C6-DF68-E80-C9-FC4-1-removebg-preview.png"
      alt="BearisterAI Logo"
      width={50}
      height={50}
      className="rounded-full object-cover"
    />
  </div>
  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent">
    BearisterAI
  </h1>
</div>
    </Link>
  )
}

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string
  as?: React.ElementType
  children: React.ReactNode
  className?: string
  variant?: "primary" | "secondary" | "dark" | "gradient"
} & (React.ComponentPropsWithoutRef<"a"> | React.ComponentPropsWithoutRef<"button">)) => {
  const baseStyles =
    "px-4 py-2 rounded-md text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center"

  const variantStyles = {
    primary:
      "bg-[#e67e22] text-white hover:bg-[#d35400] shadow-[0_0_24px_rgba(230,_126,_34,_0.3),_0_1px_1px_rgba(0,_0,_0,_0.2),_0_0_0_1px_rgba(230,_126,_34,_0.2),_0_0_4px_rgba(230,_126,_34,_0.3),_0_16px_68px_rgba(230,_126,_34,_0.2),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    secondary: "bg-transparent border border-[#2a2d47] text-gray-300 hover:text-white hover:border-[#e67e22]/50",
    dark: "bg-[#2a2d47] text-white hover:bg-[#3a3d57] shadow-[0_0_24px_rgba(42,_45,_71,_0.3),_0_1px_1px_rgba(0,_0,_0,_0.2),_0_0_0_1px_rgba(42,_45,_71,_0.2),_0_0_4px_rgba(42,_45,_71,_0.3),_0_16px_68px_rgba(42,_45,_71,_0.2),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    gradient:
      "bg-gradient-to-r from-[#e67e22] to-[#f39c12] text-white hover:from-[#d35400] hover:to-[#e67e22] shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset]",
  }

  return (
    <Tag href={href || undefined} className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </Tag>
  )
}
