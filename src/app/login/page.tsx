"use client";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      username ,
      password ,
      
      redirect: false,
    });

    if (res?.ok && !res.error) {
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <>
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold text-gray-800">Welcome to HireTrack</h1>
      <p className="mt-2 text-lg text-gray-600">Your smart hiring assistant</p>
    </div>
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
    </form>
    <div className="text-lg text-gray-700 mt-4 text-center">
      New User?{' '}
    <Link href="/login/register" className="text-blue-600 hover:underline">
     Register
    </Link>
</div>
    </>
    
  );
}
