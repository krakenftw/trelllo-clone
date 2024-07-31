"use client";
import DashHero from "@/components/dashboard/DashHero";
import Sidebar from "@/components/dashboard/Sidebar";
import Loader from "@/components/Loading";
import { useUser } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect((): void => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-screen h-screen flex">
      <div className="w-1/6">
        <Sidebar user={user} setShowModal={setShowModal} />
      </div>
      <div className="w-full">
        {" "}
        <DashHero
          user={user}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </div>
    </div>
  );
}
