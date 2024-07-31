"use client";

import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Calendar,
  CirclePlus,
  Filter,
  Search,
  Share2,
  Sparkles,
} from "lucide-react";

const ToolbarButton = ({ children, icon: Icon }: any) => (
  <Button size="sm" variant="ghost" className="text-gray-500 gap-3 p-2">
    {children} <Icon size={18} />
  </Button>
);

const toolbarItems = [
  { label: "Calendar view", icon: Calendar },
  { label: "Automation", icon: Sparkles },
  { label: "Filter", icon: Filter },
  { label: "Share", icon: Share2 },
];

export default function Toolbar({ setShowModal }: any) {
  return (
    <div className="flex justify-between items-center">
      <div className="bg-white rounded-md flex items-center border">
        <Input
          className="focus-visible:ring-0 h-10 border-none rounded-none w-[170px]"
          placeholder="Search"
        />
        <div className="px-2 flex items-center">
          <Search size={15} />
        </div>
      </div>
      <div className="flex gap-5 items-center">
        {toolbarItems.map((item, index) => (
          <ToolbarButton key={index} icon={item.icon}>
            {item.label}
          </ToolbarButton>
        ))}
        <Button className="gap-1" size="sm" onClick={() => setShowModal(true)}>
          Create new
          <CirclePlus />
        </Button>
      </div>
    </div>
  );
}
