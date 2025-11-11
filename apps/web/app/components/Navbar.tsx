"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart/CartProvider";
import CartDrawer from "./cart/CartDrawer";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";


interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Navbar({ open, setOpen }: Props) {
  const { itemCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSlugPage = usePathname().includes("/products/");

  return (
    <>

    <motion.header
    initial="hidden"
    animate="show"
             transition={{ delay: 0.2, ease: "easeInOut", duration: 0.6 }}
             className="fixed top-0 left-0 w-screen z-20">
        <div className="grid grid-cols-3 w-full px-8  lg:px-16 mt-8">
          <div className="col-span-1 flex justify-start items-center customGap">
            {!isSlugPage ? (
              <button onClick={() => setOpen(!open)}>
                {!open ? (
                  <svg
                    width="28"
                    height="18"
                    viewBox="0 0 28 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M26.75 0.75L0.750001 0.75"
                      stroke="black"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                    <path
                      d="M18.75 8.75L0.75 8.75"
                      stroke="black"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                    <path
                      d="M13.75 16.75H0.75"
                      stroke="black"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="49"
                    height="14"
                    viewBox="0 0 49 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M48.25 6.75H0.75M0.75 6.75L6.75 0.75M0.75 6.75L6.75 12.75"
                      stroke="black"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ) : (
              <Link href="/">
                <svg
                  width="49"
                  height="14"
                  viewBox="0 0 49 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M48.25 6.75H0.75M0.75 6.75L6.75 0.75M0.75 6.75L6.75 12.75"
                    stroke="black"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}

            {/* NAVBAR LINKS (DESKTOP) */}
            <motion.nav
        className="hidden lg:flex w-full"
        variants={{
          show: { transition: { staggerChildren: 0.1 } },
          hidden: {},
        }}
      >
        <motion.ul className="flex justify-start items-center text-sm font-semibold customGap w-full">
          {["Home", "Collections", "New"].map((link, idx) => (
            <motion.li
              key={link}
              variants={{
                hidden: { opacity: 0, y: -20 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Link
                href="/"
                className={link !== "Home" ? "opacity-30" : ""}
              >
                {link}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </motion.nav>
          </div>

          {/* LOGO */}
          <div className="col-start 2 col-span-1 flex justify-center items-center w-full">
            <Link href="/">
              <svg
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="14.5"
                  width="20.5061"
                  height="20.5061"
                  transform="rotate(45 14.5 0)"
                  fill="#D9D9D9"
                />
                <path
                  d="M28.6463 14.4998L14.75 28.3961V0.603527L28.6463 14.4998Z"
                  fill="black"
                  stroke="#060606"
                  strokeWidth={0.5}
                />
              </svg>
            </Link>
          </div>

          {/* RIGHT BUTTONS */}
          <div>
            <ul className="col-start-3 col-span-1 flex justify-end items-center gap-x-[1rem]">
              {/* Example icon (search, profile) */}

              {/* Profile icon (unchanged) */}
              <li>
                <Link className="opacity-30" href="/">
                  <svg
                    width="41"
                    height="41"
                    viewBox="0 0 41 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="20.5" cy="20.5" r="20.5" fill="black" />
                    <circle
                      cx="20.2873"
                      cy="18.3915"
                      r="2.81143"
                      stroke="white"
                      strokeWidth={1.5}
                    />
                    <path
                      d="M25.2072 26.122C25.2072 24.5693 23.0044 23.3105 20.2872 23.3105C17.5699 23.3105 15.3672 24.5693 15.3672 26.122"
                      stroke="white"
                      strokeWidth={1.5}
                    />
                  </svg>
                </Link>
              </li>

              {/* 🛒 CART BUTTON */}
              <li>
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="relative flex justify-center items-center"
                >
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 6h15l-1.5 9h-12z"
                      stroke="black"
                      strokeWidth={1.2}
                    />
                    <circle cx="10" cy="20" r="1" fill="black" />
                    <circle cx="18" cy="20" r="1" fill="black" />
                  </svg>

                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </motion.header>

      {/* 🧺 CART DRAWER */}
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
