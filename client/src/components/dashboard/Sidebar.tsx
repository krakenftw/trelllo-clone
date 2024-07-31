"use client";
import {
  BellIcon,
  ChartLine,
  ChartNoAxesCombinedIcon,
  ChevronRight,
  CirclePlus,
  Cog,
  Download,
  HomeIcon,
  LoaderIcon,
  Users,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useUser } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Sidebar({ user, setShowModal }: any) {
  const router = useRouter();
  const { logout } = useUser();
  return (
    <div className="p-2 md:p-4 h-screen flex flex-col justify-between">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-md gap-4 font-bold flex items-center justify-start">
            <Image
              className="rounded-full h-12 w-10"
              src={
                "https://s3-alpha-sig.figma.com/img/71f6/04d7/50a4101f6f29ecef74a38e0f7ae7513c?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=VM3VVa9PGHndk4Xx3cTIkxtNw3EGNszsbcm1ft0qvPP9wA2WChraKVPXcMXvm23nSFji19Xg7Gl6o83tfLxLjNC9MCB0voT53dCvZ78AhIXkLsc9BLFqD4adx3723o54O5N5F0ZiOa7hy5n7H22jpi~kvFx2L6kg7y4KoLZGOR7XGghLNW7EiNAtn~nM4yc68cIHN1P1assk3lJlC5ZfSr4d7Nw4bGZTxUMuMqbnquOKp9vBhjvt55OuGVrzYprtQYdB57zKPmzw0bXPMiqPOy-sBaN-oVcDg95Nha6~twTziQrvgrdkfK1yXCL7S8t1wKOQyUaoYx~LfDOK22WVpQ__"
              }
              alt="user"
              height={20}
              width={20}
            />
            {user.name}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <BellIcon className="text-gray-500" />
              <LoaderIcon className="text-gray-500" />
              <ChevronRight className="text-gray-500" />
            </div>
            <div>
              <Button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                variant={"ghost"}
                className="bg-gray-200 py-2"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-gray-500 ">
          <Button
            variant={"outline"}
            className="flex gap-2 items-center justify-start w-full bg-gray-300"
          >
            <HomeIcon />
            Home
          </Button>
          <Button
            variant={"outline"}
            className="flex gap-2 items-center justify-start w-full border-0"
          >
            <ChartNoAxesCombinedIcon />
            Boards
          </Button>
          <Button
            variant={"outline"}
            className="flex gap-2 items-center justify-start w-full border-0"
          >
            <Cog />
            Settings
          </Button>
          <Button
            variant={"outline"}
            className="flex gap-2 items-center justify-start w-full border-0"
          >
            <Users />
            Team
          </Button>
          <Button
            variant={"outline"}
            className="flex gap-2 items-center justify-start w-full border-0"
          >
            <ChartLine />
            Analytics
          </Button>
        </div>
        <Button
          className="text-lg flex gap-2"
          onClick={() => setShowModal(true)}
        >
          Create new task <CirclePlus />
        </Button>
      </div>
      <div className="bg-gray-300 flex items-center text-gray-500 gap-4 rounded-lg cursor-pointer p-2">
        <Download />
        <div className="flex flex-col">
          <span>Download the app</span>
          <span className="text-sm">Get the full experience</span>
        </div>
      </div>
    </div>
  );
}
