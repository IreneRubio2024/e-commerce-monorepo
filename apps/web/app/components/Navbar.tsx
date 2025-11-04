"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart/CartProvider";
import CartDrawer from "./cart/CartDrawer";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Navbar({ open, setOpen }: Props) {
  const { itemCount } = useCart(); // 👈 get live cart count
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-screen z-20 bg-white shadow-sm">
        <div className="grid grid-cols-3 w-full px-[18px] py-[24px]">
          {/* LEFT SECTION */}
          <div className="col-span-1 flex justify-start items-center gap-4">
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

            {/* NAVBAR LINKS (DESKTOP) */}
            <nav className="hidden lg:flex w-full">
              <ul className="flex justify-start items-center gap-4 w-full">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/">Collections</Link></li>
                <li><Link href="/">New</Link></li>
              </ul>
            </nav>
          </div>

          {/* LOGO */}
          <div className="col-start 2 col-span-1 flex justify-center items-center w-full">
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
          </div>

          {/* RIGHT BUTTONS */}
          <div>
            <ul className="col-start-3 col-span-1 flex justify-end items-center gap-x-[9px]">
              {/* Example icon (search, profile) */}
              <li>
                <Link href="/">
                  <svg
                    width="41"
                    height="41"
                    viewBox="0 0 41 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="20.5" cy="20.5" r="20.5" fill="black" />
                    <circle cx="20.5001" cy="20.4996" r="15.1852" fill="white" />
                    <path
                      d="M15.5116 25.277C16.276 26.2401 17.6987 26.2401 20.5439 26.2401H21.0035C23.8487 26.2401 25.2714 26.2401 26.0357 25.277M15.5116 25.277C14.7473 24.314 15.0094 22.8519 15.5338 19.9278C15.9067 17.8483 16.0931 16.8086 16.801 16.1943M15.5116 25.277C15.5116 25.277 15.5116 25.277 15.5116 25.277ZM26.0357 25.277C26.8001 24.314 26.5379 22.8519 26.0136 19.9278C25.6407 17.8483 25.4542 16.8086 24.7464 16.1943M26.0357 25.277C26.0357 25.277 26.0357 25.277 26.0357 25.277ZM24.7464 16.1943C24.0386 15.5801 23.0269 15.5801 21.0035 15.5801H20.5439C18.5205 15.5801 17.5088 15.5801 16.801 16.1943M24.7464 16.1943C24.7464 16.1943 24.7464 16.1943 24.7464 16.1943ZM16.801 16.1943C16.801 16.1943 16.801 16.1943 16.801 16.1943Z"
                      stroke="black"
                      strokeWidth={1.5}
                    />
                    <path
                      d="M19.1335 18.0396C19.3723 18.9951 20.0164 19.6796 20.7735 19.6796C21.5307 19.6796 22.1748 18.9951 22.4135 18.0396"
                      stroke="black"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                  </svg>
                </Link>
              </li>

              {/* Profile icon (unchanged) */}
              <li>
                <Link href="/">
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
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-[11px] w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* 🧺 CART DRAWER */}
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}











/* import Link from "next/link";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Navbar({ open, setOpen }: Props) {
  return (
    <header className="fixed top-0 left-0  z-20 col-span-12 layout w-screen">
      <div className="col-start-1 col-span-4 flex justify-start items-center gap-4">
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

<<<<<<< Updated upstream
        {/* NAV BARA DESKTOP */}
        <nav className="hidden lg:flex w-full">
          <ul className="flex justify-start items-center gap-4 w-full">
=======
          <nav className="hidden lg:flex w-full">
            <ul className="flex justify-start items-center gap-4 w-full">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/">Collections</Link>
              </li>
              <li>
                <Link href="/">New</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="col-start 2 col-span-1 flex justify-center items-center w-full">
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
        </div>
        <div>
          <ul className="col-start-3 col-span-1 flex justify-end items-center gap-x-[9px]">
>>>>>>> Stashed changes
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/">Collections</Link>
            </li>
            <li>
              <Link href="/">New</Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* LOGO */}
      <div className="col-start-5 col-span-4 flex justify-center items-center w-full">
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
      </div>
      {/* BUTTONS */}

      <ul className="col-start-9 col-span-3 flex justify-end items-center gap-x-[9px]">
        <li>
          <Link href="/">
            <svg
              width="41"
              height="41"
              viewBox="0 0 41 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20.5" cy="20.5" r="20.5" fill="black" />
              <circle cx="20.5001" cy="20.4996" r="15.1852" fill="white" />
              <path
                d="M15.5116 25.277C16.276 26.2401 17.6987 26.2401 20.5439 26.2401H21.0035C23.8487 26.2401 25.2714 26.2401 26.0357 25.277M15.5116 25.277C14.7473 24.314 15.0094 22.8519 15.5338 19.9278C15.9067 17.8483 16.0931 16.8086 16.801 16.1943M15.5116 25.277C15.5116 25.277 15.5116 25.277 15.5116 25.277ZM26.0357 25.277C26.8001 24.314 26.5379 22.8519 26.0136 19.9278C25.6407 17.8483 25.4542 16.8086 24.7464 16.1943M26.0357 25.277C26.0357 25.277 26.0357 25.277 26.0357 25.277ZM24.7464 16.1943C24.0386 15.5801 23.0269 15.5801 21.0035 15.5801H20.5439C18.5205 15.5801 17.5088 15.5801 16.801 16.1943M24.7464 16.1943C24.7464 16.1943 24.7464 16.1943 24.7464 16.1943ZM16.801 16.1943C16.801 16.1943 16.801 16.1943 16.801 16.1943Z"
                stroke="black"
                strokeWidth={1.5}
              />
              <path
                d="M19.1335 18.0396C19.3723 18.9951 20.0164 19.6796 20.7735 19.6796C21.5307 19.6796 22.1748 18.9951 22.4135 18.0396"
                stroke="black"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </li>
        <li>
          <Link href="/">
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
      </ul>
    </header>
  );
}
 */