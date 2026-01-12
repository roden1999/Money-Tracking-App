"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Wallet", href: "/wallet" },
    { name: "Transactions", href: "/transactions" },
  ];

  return (
    <nav className="w-full border-b bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard" className="text-xl font-bold text-gray-900">
          Money Tracking App
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition ${isActive
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {item.name}
              </Link>
            );
          })}

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
            >
              {user.UserName}
              <svg
                className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {open && (
              <div
                onMouseLeave={() => setOpen(false)}
                className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-lg ring-1 ring-black/5 x">
                <ul className="py-1 text-sm">

                  {/* Profile */}
                  <li>
                    <button
                      onClick={() => router.replace("/profile")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                      {/* Profile icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5.121 17.804A9 9 0 1118.9 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Profile
                    </button>
                  </li>

                  {/* Divider */}
                  <li className="my-1 border-t border-gray-200" />

                  {/* Logout */}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-red-600 transition hover:bg-red-50 hover:text-red-700"
                    >
                      {/* Logout icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </li>

                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
