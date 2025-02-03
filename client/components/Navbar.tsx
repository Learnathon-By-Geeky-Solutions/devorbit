"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { NAV_LINKS } from "@/constants";
import { Button } from "@/components/Button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const lastYRef = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const difference = y - lastYRef.current;
    if (Math.abs(difference) > 50) {
      setIsHidden(difference > 0);
      lastYRef.current = y;
    }
    setIsScrolled(y > 10);
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300); // Delay focus until after animation
  };

  return (
    <motion.div
      animate={isHidden ? "hidden" : "visible"}
      whileHover="visible"
      onFocusCapture={() => setIsHidden(false)}
      variants={{
        hidden: { y: "-90%" },
        visible: { y: "0%" },
      }}
      transition={{ duration: 0.2 }}
      className={`fixed top-1 z-10 w-full mx-2 ${
        isScrolled ? "border border-gray-400 rounded-3xl" : ""
      } bg-white`}
    >
      <nav className="mx-auto flex items-center justify-between rounded-3xl bg-white p-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-bold">
            TurfMania
          </Link>
          <div className="hidden space-x-4 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="relative px-3 py-1 text-lg text-gray-700 transition-colors duration-300 hover:text-green-700"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 transform bg-green-500 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div ref={searchContainerRef} className="relative hidden lg:block">
            <motion.div
              animate={isSearchExpanded ? "expanded" : "collapsed"}
              variants={{
                expanded: { width: "300px" },
                collapsed: { width: "40px" },
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                className={`w-full rounded-full border-gray-300 pl-10 pr-4 focus:border-black ${
                  isSearchExpanded ? "opacity-100" : "opacity-0"
                }`}
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 transform cursor-pointer text-gray-400"
                onClick={handleSearchClick}
              />
            </motion.div>
          </div>
          <Button
            href="/sign-in"
            variant="default"
            className="hidden lg:inline-flex px-7"
          >
            Sign In
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>
                  <div className="mt-4 flex flex-col space-y-4">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.key}
                        href={link.href}
                        className="text-lg  text-gray-700 transition-colors duration-300 hover:text-green-700"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="pt-4">
                      <Input
                        type="text"
                        placeholder="Search..."
                        className="w-full"
                      />
                    </div>
                    <Button variant="default" className="w-full">
                      Sign In
                    </Button>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.div>
  );
};

export default Navbar;
