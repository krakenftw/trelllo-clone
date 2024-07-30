"use client"
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const {user} = useUser();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-5xl font-bold">
          Welcome To <span className="text-purple-400"> Workflo!</span>
        </h1>
 <Link href={user ? "/dashboard" : "/login"}>       <Button className="px-10">Get started</Button></Link>
    </main>
  );
}
