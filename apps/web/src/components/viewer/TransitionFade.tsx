import type { ZoomLevel } from "@/lib/types";
import type { PropsWithChildren } from "react";

interface TransitionFadeProps extends PropsWithChildren {
  level: ZoomLevel;
}

export default function TransitionFade({
  children,
  level,
}: TransitionFadeProps) {
  return (
    <group key={level} name={`level-${level}`}>
      {children}
    </group>
  );
}
