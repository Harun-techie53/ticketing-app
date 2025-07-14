"use client";

import { useAuth } from "@/contexts/authContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RandomAvatar } from "../random-avatar";
import { apiPost } from "@/helpers/axios/config";
import { useToast } from "@/contexts/ToastContext";
import { ToastType } from "@/types";
import { showGlobalToast } from "@/helpers/utils/globals";

const Header = () => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Home", href: "/", hidden: false },
    { label: "Auctions", href: "/tickets/auctions", hidden: !isAuthenticated },
    { label: "Orders", href: "/orders", hidden: !isAuthenticated },
  ];

  const handleLogout = async () => {
    try {
      await apiPost({ apiPath: "/api/users/signout", withCredentials: true });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setTimeout(() => {
        showGlobalToast("Logged out successfully!", ToastType.Success);
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.log("Error logging out: ", error);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-10 fixed top-0 left-0 right-0 z-50">
      <div className="flex-1">
        <Link href="/" className="text-xl font-bold text-primary">
          TicketingApp
        </Link>
      </div>

      <div className="flex-none hidden md:flex gap-2">
        {navItems.map(
          (item) =>
            !item.hidden && (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? "btn btn-active text-primary"
                    : "btn btn-ghost text-base"
                }`}
              >
                {item.label}
              </Link>
            )
        )}
      </div>
      {isAuthenticated && (
        <div className="dropdown dropdown-end ml-5">
          <label tabIndex={0}>
            <RandomAvatar />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content z-[1] mt-3 p-2 w-56 bg-base-100 rounded-xl shadow-lg border border-base-200 transform transition-all duration-300 origin-top scale-95 hover:scale-100"
          >
            <li>
              <Link href="/profile" className="justify-between text-[0.9rem]">
                My Profile
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-[0.9rem]">
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Mobile Menu */}
      <div className="dropdown dropdown-end md:hidden">
        <label tabIndex={0} className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={
                  pathname === item.href ? "text-primary font-semibold" : ""
                }
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Header;
