// src/components/Header.js
"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  const cartCount = useSelector((state) =>
    Object.values(state.cart.items).reduce((total, quantity) => total + quantity, 0)
  );
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const activeClass = "text-red-500";
  const inactiveClass = "hover:text-red-500";

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900 text-white shadow z-50">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="text-2xl font-bold">
          <Link href="/">AK</Link>
        </div>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link href="/" className={`transition-colors ${pathname === "/" ? activeClass : inactiveClass}`}>
                Home
              </Link>
            </li>

            <li className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`transition-colors ${pathname.startsWith("/categories") ? activeClass : inactiveClass}`}
              >
                Categories
              </button>
              <ul
                ref={dropdownRef}
                className={`absolute left-0 mt-2 w-48 bg-gray-800 rounded shadow-lg transition-opacity duration-200 ${
                  isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <li>
                  <Link href="/categories/mountain-bikes" className="block px-4 py-2 hover:bg-red-600">
                    Mountain Bikes
                  </Link>
                </li>
                <li>
                  <Link href="/categories/electric-bikes" className="block px-4 py-2 hover:bg-red-600">
                    Electric Bikes
                  </Link>
                </li>
                <li>
                  <Link href="/categories/cruiser-bikes" className="block px-4 py-2 hover:bg-red-600">
                    Cruiser Bikes
                  </Link>
                </li>
                <li>
                  <Link href="/categories/hybrid-bikes" className="block px-4 py-2 hover:bg-red-600">
                    Hybrid Bikes
                  </Link>
                </li>
              </ul>
            </li>
            <li className="relative">
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-7 h-7 text-white hover:text-red-500 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}