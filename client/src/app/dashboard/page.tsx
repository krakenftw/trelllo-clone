"use client";
import TaskView from "@/components/dashboard/TaskView";
import Loader from "@/components/Loading";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useAuth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-screen h-screen">
      <TaskView />
    </div>
  );
}
