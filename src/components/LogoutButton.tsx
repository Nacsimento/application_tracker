'use client'

import { signOut } from "next-auth/react";
import { Power } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="cursor-pointer flex flex-col items-center text-[12px] gap-1"
    >
      <Power /> Log out
    </button>
  );
}
