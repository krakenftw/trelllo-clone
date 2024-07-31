import React, { ReactNode } from "react";
import { useDraggable } from "@dnd-kit/core";

export function Draggable(props: { children: ReactNode; id: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
 const style = transform
  ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      zIndex: 9999,
    }
  : undefined;

  return (
    <button
      className="w-full"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {props.children}
    </button>
  );
}
