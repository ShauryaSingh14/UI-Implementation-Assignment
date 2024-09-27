import React from "react";
import Image from "next/image";
import Link from "next/link";

// Header Component
const Header = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center items-start p-2">
      <Link href="/" className="flex items-center mb-4 md:mb-0">
        <span className="text-2xl md:text-3xl font-bold mr-4">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 12H5M12 19l-7-7 7-7"
            />
          </svg>
        </span>
        <h1 className="text-2xl md:text-3xl font-bold py-2 border-b-2 border-black">
          Rules Creation
        </h1>
      </Link>

      <button className="bg-Maingreen text-white py-2 px-4 rounded-md hover:text-Maingreen hover:bg-white border border-Maingreen transition-all">
        Publish Feed
      </button>
    </div>
  );
};

// SideNav Component
const SideNav = () => {
  return (
    <div className="sticky top-0 h-screen bg-black text-white px-3 py-10 sm:px-5">
      <div className="flex flex-col items-center justify-between h-full">
        <div className="flex flex-col gap-8 items-center">
          <Image
            src="/style.logo.png"
            alt="Logo"
            width={30}
            height={30}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export { SideNav, Header };
