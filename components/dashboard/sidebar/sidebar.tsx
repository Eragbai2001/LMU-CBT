"use client";
import { cn } from "@/lib/utils";
import Link, { type LinkProps } from "next/link";
import type React from "react";
import { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Pin, PinOff } from "lucide-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
  pinned: boolean;
  setPinned: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const [pinned, setPinned] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider
      value={{ open, setOpen, animate: animate, pinned, setPinned }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = ({
  children,
  ...otherProps
}: {
  children?: React.ReactNode;
} & Omit<React.ComponentProps<typeof motion.div>, "children">) => {
  return (
    <>
      <DesktopSidebar {...otherProps}>{children}</DesktopSidebar>
      <MobileSidebar {...(otherProps as React.ComponentProps<"div">)}>
        {children}
      </MobileSidebar>
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
} & Omit<
  React.ComponentProps<typeof motion.div>,
  "children" | "className"
>) => {
  const { open, setOpen, animate, pinned, setPinned } = useSidebar();
  const handleMouseLeave = () => {
    if (!pinned) {
      setOpen(false);
    }
  };
  return (
    <motion.div
      className={cn(
        "h-full py-4 hidden md:flex md:flex-col bg-white shadow-lg w-[240px] shrink-0 items-center justify-center dark:bg-[#121218]",
        className
      )}
      animate={{
        width: animate ? (open ? "240px" : "60px") : "240px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={handleMouseLeave}
      {...props}>

      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-white w-full"
      )}
      {...props}>
      <div className="flex justify-end z-20 w-full">
        <Menu className="text-neutral-800" onClick={() => setOpen(!open)} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-full w-full inset-0 bg-white p-10 z-[100] flex flex-col justify-between",
              className
            )}>
            <div
              className="absolute right-10 top-10 z-50 text-neutral-800"
              onClick={() => setOpen(!open)}>
              <X />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  onClick, // Add an onClick prop
  ...props
}: {
  link: Links;
  className?: string;
  onClick?: () => void; // Optional click handler
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  return link.href ? (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 ",
        className
      )}
      {...props}>
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className=" text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0">
        {link.label}
      </motion.span>
    </Link>
  ) : (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 w-full cursor-pointer",
        className
      )}>
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className=" text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0">
        {link.label}
      </motion.span>
    </button>
  );
};
