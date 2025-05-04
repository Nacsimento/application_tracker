import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <>
      <div className="text-center mt-10">
      <h1 className="text-4xl font-bold text-gray-800">Welcome to HireTrack</h1>
      <p className="mt-2 text-lg text-gray-600">Your smart hiring assistant</p>
      <Link href={'/dashboard'}><button className="bg-blue-600 cursor-pointer text-white mt-12 px-5 py-2 rounded-full text-2xl font-medium hover:bg-blue-700 transition-colors duration-300">
  Get Started
</button></Link>
      </div>
     
    </>
  );
}
